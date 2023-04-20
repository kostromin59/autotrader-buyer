import io, { Socket } from 'socket.io-client';
import {
  ListenEvents,
  EmitEvents,
  Bot,
  Asset,
  Trade,
  Platform,
  LobbyState,
} from '@rocketleagueapi/tradebot-api-types';
import { makeAutoObservable, runInAction } from 'mobx';
import { BotStatus } from '../types/bot/bot-status.enum';
import { ILoginBot } from '../types/bot/login-bot.interface';
import { ITradeItem, ITradeOffer } from '@autotrader/interfaces';
import { getItemInfo } from '../utils/decrypt-asset.util';
import { TelegramService } from '../services/telegram/telegram.service';
import { CompletedTradeService } from '../services/completed-trade/completed-trade.service';

const initialTradeState: Trade = {
  assets: {
    get: [],
    give: [],
  },
  credits: {
    get: 0,
    give: 0,
  },
  id: 'NONE',
  player: {
    id: 'NONE',
    platform: Platform.EPIC_GAMES,
  },
};

function matchItems(firstItem: Asset, secondItem: ITradeItem): boolean {
  return (
    firstItem.item === secondItem.item &&
    firstItem.paint === secondItem.paint &&
    (firstItem.cert === secondItem.cert || !secondItem.cert) &&
    (firstItem.series === secondItem.series || !secondItem.series) &&
    getItemInfo(firstItem.item).special === secondItem.special &&
    firstItem.quality === secondItem.quality &&
    Boolean(firstItem.blueprint) === secondItem.blueprint
  );
}

class RlBot {
  private socket: Socket<ListenEvents, EmitEvents>;
  private accepter: Socket;
  private selectedBot: Bot;
  private queue: string[] = [];
  private cart: number[] = [];
  private isDeletingItems = false;
  private isRemoveCommand = false;
  private isWantCommand = false;
  private isCartCommand = false;
  private isTradeCommand = false;
  private isUserControl = false;
  inventory: { assets: Asset[]; credits: number } = {
    credits: 0,
    assets: [],
  };
  status: BotStatus = BotStatus.DISCONNECTED;
  botNickname: string;
  tradeState = initialTradeState;
  lobbyOpponentNickname = 'Nobody';
  chat: string[] = [];
  trades: ITradeOffer[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setTrades(trades: ITradeOffer[]) {
    this.trades = trades;
  }

  setApiKey(key: string) {
    if (this.socket) return;

    this.socket = io('https://tradebot.anga.blue', {
      auth: {
        key,
      },
    });

    this.accepter = io('http://localhost:3123');

    this.accepter.on('new-request', (nick: string) => {
      if (this.queue.length === 0 && this.status === BotStatus.FREE) {
        this.inviteToLobby(nick);
      } else {
        this.queue.push(nick);
      }
    });

    const onConnect = () => {
      runInAction(() => {
        if (!this.selectedBot) {
          this.status = BotStatus.CONNECTED;
          return;
        }
        this.socket.emit(
          'getLobbyState',
          this.selectedBot.botId,
          ({ res, error }) => {
            if (error || !res) return (this.status = BotStatus.CONNECTED);

            switch (res.state) {
              case LobbyState.IN_PARTY:
                this.status = BotStatus.IN_LOBBY;
                return;
              case LobbyState.IN_TRADE:
                this.status = BotStatus.IN_TRADE;
                return;
              case LobbyState.COMPLETING:
                this.status = BotStatus.ACCEPTING_TRADE;
                return;
              case LobbyState.IN_CONFIRMATION:
                this.status = BotStatus.ACCEPTING_TRADE;
                return;
              default:
                this.status = BotStatus.FREE;
                return;
            }
          }
        );
      });
    };

    const onDisconnect = () => {
      runInAction(() => {
        this.status = BotStatus.DISCONNECTED;
      });
    };

    this.socket.off('connect', onConnect);
    this.socket.on('connect', onConnect);

    this.socket.off('disconnect', onDisconnect);
    this.socket.on('disconnect', onDisconnect);
  }

  async getBots(): Promise<Bot[]> {
    if (!this.socket) return [];
    return new Promise((resolve, reject) => {
      this.socket.emit('getBots', ({ res, error }) => {
        if (error || !res) reject([]);
        resolve(res);
      });
    });
  }

  async setBot(botId: string) {
    const bots = await this.getBots();
    const bot = bots.find((bot) => bot.botId === botId);

    runInAction(() => {
      this.selectedBot = bot;
      this.botNickname = bot.name;
      this.status = BotStatus.FREE;
    });

    // Events start
    this.onMessage();
    this.onAssetUpdate();
    this.onCreditsUpdate();
    this.onTradeStarted();
    this.onLobbyDestroy();
    this.onTradeCompleted();
    this.onTradeCancelled();
    this.onLobbyJoined();

    // Actions
    this.destroyLobby();
  }

  async loginBot(dto: ILoginBot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject(false);

      this.socket.emit(
        'updateBot',
        {
          secret: dto.secret,
          account_id: dto.accountId,
          device_id: dto.deviceId,
        },
        ({ res, error }) => {
          if (error || !res) return reject(false);
          return resolve(res);
        }
      );
    });
  }

  async getInventory(): Promise<{ credits: number; assets: Asset[] }> {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject([]);

      this.socket.emit(
        'getInventory',
        this.selectedBot.botId,
        ({ res, error }) => {
          if (error || !res) return reject([]);

          runInAction(() => {
            this.inventory = res;
          });

          return resolve(res);
        }
      );
    });
  }

  async getTradeState(): Promise<Trade | null> {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject(null);

      this.socket.emit(
        'getLobbyState',
        this.selectedBot.botId,
        ({ res, error }) => {
          if (error || !res) return reject(null);

          runInAction(() => {
            this.tradeState = res.trade || initialTradeState;

            if (
              res.state === LobbyState.IN_CONFIRMATION ||
              res.state === LobbyState.COMPLETING
            )
              this.status = BotStatus.ACCEPTING_TRADE;
          });

          resolve(res.trade || initialTradeState);
        }
      );
    });
  }

  async updateAsset(itemId: number, action?: boolean, isUserAction = false) {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject(false);

      this.isUserControl = isUserAction;

      if (!action) {
        const isItemInTrade = !!this.tradeState.assets.give.find(
          (item) => item.id === itemId
        );

        action = !isItemInTrade;
      }

      this.socket.emit(
        'updateAsset',
        this.selectedBot.botId,
        itemId,
        action,
        ({ res, error }) => {
          if (error || !res) return reject(false);

          runInAction(() => {
            this.status = BotStatus.IN_TRADE;
          });

          this.getTradeState();

          return resolve(true);
        }
      );
    });
  }

  async updateCredits(amount: number, isUserAction = false) {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject(false);

      this.isUserControl = isUserAction;

      this.socket.emit(
        'updateCredits',
        this.selectedBot.botId,
        amount,
        ({ res, error }) => {
          if (error || !res) return reject(false);

          runInAction(() => {
            this.status = BotStatus.IN_TRADE;
          });

          this.getTradeState();

          return resolve(true);
        }
      );
    });
  }

  async inviteToLobby(nickname: string) {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject(false);

      this.queue = this.queue.filter((nick) => nick !== nickname);

      this.socket.emit(
        'createLobby',
        this.selectedBot.botId,
        {
          id: nickname,
          platform: Platform.EPIC_GAMES,
        },
        {
          inviteTimeout: 30000,
        },
        ({ error, res }) => {
          if (error || !res) return reject(false);

          this.getTradeState();

          runInAction(() => {
            this.status = BotStatus.IN_LOBBY;
            this.lobbyOpponentNickname = nickname;
          });

          return resolve(true);
        }
      );
    });
  }

  async sendMessage(message: string) {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject(false);

      this.socket.emit(
        'sendChatMessage',
        this.selectedBot.botId,
        message,
        ({ res, error }) => {
          if (error || !res) return reject(false);

          runInAction(() => {
            this.chat.push(`You: ${message}`);
          });

          return resolve(true);
        }
      );
    });
  }

  async destroyLobby() {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject(false);
      this.socket.emit(
        'destroyLobby',
        this.selectedBot.botId,
        ({ res, error }) => {
          if (!res || error) return reject(false);

          this.getTradeState();

          return resolve(true);
        }
      );
    });
  }

  async confirmTrade() {
    const state = await this.getTradeState();

    if (this.isDeletingItems) return;

    return new Promise((resolve, reject) => {
      if (!this.socket) return reject(false);

      this.socket.emit(
        'confirmTrade',
        this.selectedBot.botId,
        {
          assets: {
            give: state.assets.give.map((asset) => asset.id),
            get: state.assets.get.map((asset) => asset.id),
          },
          credits: state.credits,
        },
        ({ res, error }) => {
          if (error || !res) return reject(false);

          runInAction(() => {
            this.status = BotStatus.ACCEPTING_TRADE;
          });

          return resolve(true);
        }
      );
    });
  }

  private onMessage() {
    if (!this.socket) return;

    // const wantCommand = async (argument: string) => {
    //   if (!argument) return this.sendMessage('Invalid argument');
    //   this.isWantCommand = true;
    //
    //   const [numberOfTrade, numberOfItem] = argument
    //     .trim()
    //     .split('-')
    //     .map((num) => Number(num));
    //
    //   // Invalid argument
    //   if (
    //     !numberOfTrade ||
    //     !numberOfItem ||
    //     isNaN(numberOfTrade) ||
    //     isNaN(numberOfItem) ||
    //     numberOfItem > 10 ||
    //     numberOfItem < 1
    //   ) {
    //     this.isWantCommand = false;
    //     return this.sendMessage('Invalid argument');
    //   }
    //   // Find offer
    //   const tradeOffer = this.trades.find(
    //     (offer) =>
    //       offer.garageItem === numberOfItem &&
    //       offer.garageTrade === numberOfTrade
    //   );
    //
    //   if (!tradeOffer) {
    //     this.isWantCommand = false;
    //     return this.sendMessage('Invalid argument');
    //   }
    //
    //   // Is disabled
    //   if (!tradeOffer.isEnabled) {
    //     this.isWantCommand = false;
    //     return this.sendMessage("I can't do it right now");
    //   }
    //
    //   let giveCredits = 0;
    //   const ignoreGiveItems: number[] = [];
    //
    //   const inventory = await this.getInventory();
    //
    //   // Check give items
    //
    //   if (tradeOffer.has.item === 4743) {
    //     // CREDITS LOGIC
    //     giveCredits += tradeOffer.has.amount;
    //   } else {
    //     // ITEMS LOGIC
    //     const suitableItems: number[] = [];
    //     const inventorySuitableItems = inventory.assets.filter(
    //       (inventoryItem) =>
    //         !ignoreGiveItems.includes(inventoryItem.id) &&
    //         inventoryItem.item === tradeOffer.has.item &&
    //         inventoryItem.paint === tradeOffer.has.paint &&
    //         (inventoryItem.cert === tradeOffer.has.cert ||
    //           !tradeOffer.has.cert) &&
    //         (inventoryItem.series === tradeOffer.has.series ||
    //           !tradeOffer.has.series) &&
    //         getItemInfo(inventoryItem.item).special ===
    //         tradeOffer.has.special &&
    //         inventoryItem.quality === tradeOffer.has.quality &&
    //         Boolean(inventoryItem.blueprint) === tradeOffer.has.blueprint
    //     );
    //
    //     // Items not enough in inventory
    //     if (inventorySuitableItems.length < tradeOffer.has.amount) {
    //       this.isWantCommand = false;
    //       return this.sendMessage("I don't have enough items");
    //     }
    //
    //     // The same offers in cart
    //     const offersInCart = this.cart.filter(
    //       (cartId) => cartId === tradeOffer.id
    //     );
    //
    //     // If inventory items less than ask
    //     if (
    //       inventorySuitableItems.length <
    //       tradeOffer.has.amount * (offersInCart.length + 1)
    //     ) {
    //       this.isWantCommand = false;
    //       return this.sendMessage("I don't have enough items");
    //     }
    //
    //     // Ignore some items
    //     for (let j = 0; j < tradeOffer.has.amount; j++) {
    //       // If found all suitable items
    //       if (suitableItems.length === tradeOffer.has.amount) break;
    //
    //       const currentSuitableItem = inventorySuitableItems[j];
    //       if (ignoreGiveItems.includes(currentSuitableItem.id)) continue;
    //
    //       ignoreGiveItems.push(currentSuitableItem.id);
    //       suitableItems.push(currentSuitableItem.id);
    //     }
    //
    //     // Calculate give and get items
    //     const [give, get] = this.cart.reduce(
    //       (numOfItems, tradeIdInCart) => {
    //         const currentTradeOffer = this.trades.find(
    //           (offer) => offer.id === tradeIdInCart
    //         );
    //
    //         if (currentTradeOffer.has.item !== 4743) {
    //           numOfItems[0] = numOfItems[0] + currentTradeOffer.has.amount;
    //         }
    //
    //         if (currentTradeOffer.wants.item !== 4743) {
    //           numOfItems[1] = numOfItems[1] + currentTradeOffer.wants.amount;
    //         }
    //
    //         return numOfItems;
    //       },
    //       [0, 0]
    //     );
    //
    //     if (give > 24 || get > 24) {
    //       this.isWantCommand = false;
    //       return this.sendMessage('Too much items');
    //     } else if (
    //       tradeOffer.has.item !== 4743 &&
    //       give + tradeOffer.has.amount > 24
    //     ) {
    //       this.isWantCommand = false;
    //       return this.sendMessage('Too much items');
    //     } else if (
    //       tradeOffer.wants.item !== 4743 &&
    //       get + tradeOffer.wants.amount > 24
    //     ) {
    //       this.isWantCommand = false;
    //       return this.sendMessage('Too much items');
    //     }
    //   }
    //
    //   // Not enough credits
    //   if (inventory.credits < giveCredits) {
    //     this.isWantCommand = false;
    //     return this.sendMessage("I don't have enough credits");
    //   }
    //
    //   this.cart.push(tradeOffer.id);
    //
    //   this.isWantCommand = false;
    //   return this.sendMessage(
    //     'Trade added to your cart. Put items or credits and type /trade'
    //   );
    // };
    //
    // const tradeCommand = async (state: Trade) => {
    //   let credits = 0;
    //   const ignoreItems: number[] = [];
    //   this.isTradeCommand = true;
    //
    //   // Check get items
    //   for (let i = 0; i < this.cart.length; i++) {
    //     const currentTradeId = this.cart[i];
    //     const currentTrade = this.trades.find(
    //       (offer) => offer.id === currentTradeId
    //     );
    //
    //     if (currentTrade.wants.item === 4743) {
    //       // CREDITS LOGIC
    //       credits += currentTrade.wants.amount;
    //     } else {
    //       // ITEMS LOGIC
    //       const suitableItems: number[] = [];
    //
    //       for (let j = 0; j < state.assets.get.length; j++) {
    //         // If found all suitable items
    //         if (suitableItems.length === currentTrade.wants.amount) break;
    //
    //         const currentItem = state.assets.get[j];
    //
    //         // If item is validated
    //         if (ignoreItems.includes(currentItem.id)) {
    //           continue;
    //         }
    //
    //         // If item suit
    //         if (
    //           currentItem.item === currentTrade.wants.item &&
    //           currentItem.paint === currentTrade.wants.paint &&
    //           (currentItem.cert === currentTrade.wants.cert ||
    //             !currentTrade.wants.cert) &&
    //           (currentItem.series === currentTrade.wants.series ||
    //             !currentTrade.wants.series) &&
    //           getItemInfo(currentItem.item).special ===
    //           currentTrade.wants.special &&
    //           currentItem.quality === currentTrade.wants.quality &&
    //           Boolean(currentItem.blueprint) === currentTrade.wants.blueprint
    //         ) {
    //           suitableItems.push(currentItem.id);
    //           ignoreItems.push(currentItem.id);
    //         }
    //       }
    //
    //       // If not enough items
    //       if (suitableItems.length !== currentTrade.wants.amount) {
    //         this.isTradeCommand = false;
    //         return this.sendMessage('You have to put items first');
    //       }
    //     }
    //   }
    //
    //   // If not enough credits
    //   if (state.credits.get < credits) {
    //     this.isTradeCommand = false;
    //     return this.sendMessage('Not enough credits');
    //   }
    //
    //   this.sendMessage(`In your cart ${this.cart.length} offers`);
    //
    //   const inventory = await this.getInventory();
    //   const ignoreInventoryItems: number[] = [];
    //   let creditsPut = 0;
    //
    //   // Put items
    //   for (let i = 0; i < this.cart.length; i++) {
    //     const currentTradeId = this.cart[i];
    //     const currentTrade = this.trades.find(
    //       (offer) => offer.id === currentTradeId
    //     );
    //
    //     if (currentTrade.has.item === 4743) {
    //       // CREDITS
    //       creditsPut += currentTrade.has.amount;
    //     } else {
    //       // ITEMS
    //       const inventorySuitableItems = inventory.assets.filter(
    //         (inventoryItem) =>
    //           !ignoreInventoryItems.includes(inventoryItem.id) &&
    //           inventoryItem.item === currentTrade.has.item &&
    //           inventoryItem.paint === currentTrade.has.paint &&
    //           (inventoryItem.cert === currentTrade.has.cert ||
    //             !currentTrade.has.cert) &&
    //           (inventoryItem.series === currentTrade.has.series ||
    //             !currentTrade.has.series) &&
    //           getItemInfo(inventoryItem.item).special ===
    //           currentTrade.has.special &&
    //           inventoryItem.quality === currentTrade.has.quality &&
    //           Boolean(inventoryItem.blueprint) === currentTrade.has.blueprint
    //       );
    //
    //       const puttedItems: number[] = [];
    //       // FIND ITEM
    //       for (let j = 0; j < inventorySuitableItems.length; j++) {
    //         if (currentTrade.has.amount === puttedItems.length) break;
    //
    //         const currentInventoryItem = inventorySuitableItems[j];
    //
    //         if (ignoreInventoryItems.includes(currentInventoryItem.id))
    //           continue;
    //
    //         ignoreInventoryItems.push(currentInventoryItem.id);
    //         puttedItems.push(currentInventoryItem.id);
    //
    //         if (this.isDeletingItems) {
    //           this.clearTrade();
    //           break;
    //         }
    //
    //         await this.updateAsset(currentInventoryItem.id, true);
    //       }
    //     }
    //   }
    //
    //   if (this.isDeletingItems) {
    //     this.clearTrade();
    //     this.isTradeCommand = false;
    //     return;
    //   }
    //   // PUT CREDITS AND CONFIRM TRADE
    //   await this.updateCredits(creditsPut);
    //   await this.confirmTrade();
    //   this.isTradeCommand = false;
    // };
    //
    // const cartCommand = () => {
    //   this.isCartCommand = true;
    //   const cart = this.cart
    //     .map((cartId) => {
    //       const trade = this.trades.find((trade) => trade.id === cartId);
    //       return `${trade.garageTrade}-${trade.garageItem}`;
    //     })
    //     .join('; ');
    //
    //   this.sendMessage(cart);
    //   this.isCartCommand = false;
    // };
    //
    // const removeCommand = (argument: string) => {
    //   if (!argument) return this.sendMessage('Invalid argument');
    //
    //   this.isRemoveCommand = true;
    //
    //   const [numberOfTrade, numberOfItem] = argument
    //     .trim()
    //     .split('-')
    //     .map((num) => Number(num));
    //
    //   // Invalid argument
    //   if (
    //     !numberOfTrade ||
    //     !numberOfItem ||
    //     isNaN(numberOfTrade) ||
    //     isNaN(numberOfItem) ||
    //     numberOfItem > 10 ||
    //     numberOfItem < 1
    //   ) {
    //     this.isRemoveCommand = false;
    //     return this.sendMessage('Invalid argument');
    //   }
    //   // Current trade offer
    //   const tradeOffer = this.trades.find(
    //     (trade) =>
    //       trade.garageTrade === numberOfTrade &&
    //       trade.garageItem === numberOfItem
    //   );
    //
    //   if (!tradeOffer) {
    //     this.isRemoveCommand = false;
    //     return this.sendMessage('Invalid argument');
    //   }
    //   // Clear cart
    //   const index = this.cart.indexOf(tradeOffer.id);
    //
    //   if (index > -1) {
    //     runInAction(() => {
    //       this.cart.splice(index, 1);
    //     });
    //   }
    //
    //   this.isRemoveCommand = false;
    //   this.sendMessage('Done');
    // };
    //
    const onMessageEvent = async (botId: string, message: string) => {
      if (botId !== this.selectedBot.botId) return;

      runInAction(() => {
        this.chat.push(`${this.lobbyOpponentNickname}: ${message}`);
      });
      //
      // // AUTO
      // if (this.isUserControl) return;
      // // If not command
      // if (message[0] !== '/') return;
      //
      // const [command, argument] = message
      //   .substring(1)
      //   .trim()
      //   .toLowerCase()
      //   .split(' ');
      //
      // if (command === 'help') {
      //   await this.sendMessage(
      //     'TradeId is in the description, itemId is the square in trade offer (from 1 to 10)'
      //   );
      //   await this.sendMessage('1) /want tradeId-itemId (Example: /want 5-9)');
      //   await this.sendMessage(
      //     '2) /trade (I will put items from cart (use /want) and confirm trade)'
      //   );
      //   await this.sendMessage('3) /cart (You will see your cart)');
      //   await this.sendMessage(
      //     '4) /remove tradeId-itemId (I will remove offer from the cart)'
      //   );
      //   await this.sendMessage('You can ask help Kostromin#3600 in discord');
      //   return;
      // }
      //
      // await this.clearTrade();
      // const state = await this.getTradeState();
      //
      // if (
      //   this.isDeletingItems ||
      //   this.isCartCommand ||
      //   this.isWantCommand ||
      //   this.isTradeCommand ||
      //   this.isRemoveCommand
      // )
      //   return this.sendMessage('Repeat command');
      //
      // if (command === 'want') wantCommand(argument);
      // else if (command === 'trade') tradeCommand(state);
      // else if (command === 'cart') cartCommand();
      // else if (command === 'remove') removeCommand(argument);
    };

    this.socket.off('chatMessage', onMessageEvent);
    this.socket.on('chatMessage', onMessageEvent);
  }

  private onTradeStarted() {
    if (!this.socket) return;
    this.socket.on('tradeStarted', (botId) => {
      if (botId !== this.selectedBot.botId) return;

      runInAction(() => {
        this.status = BotStatus.IN_TRADE;
      });
    });
  }

  private onTradeCompleted() {
    if (!this.socket) return;
    this.socket.on('tradeCompleted', async (botId, trade) => {
      if (botId !== this.selectedBot.botId) return;

      const inventory = await this.getInventory();

      const completedTrade = await CompletedTradeService.create({
        trade,
        inventory,
        nickname: this.lobbyOpponentNickname,
      });

      TelegramService.sendMessage(
        `https://autotrader.ngsquad.ru/completed-trades/${completedTrade.id}`
      );

      runInAction(() => {
        this.status = BotStatus.IN_LOBBY;
        this.tradeState = initialTradeState;
        this.cart = [];
        this.isCartCommand = false;
        this.isWantCommand = false;
        this.isTradeCommand = false;
        this.isDeletingItems = false;
        this.isRemoveCommand = false;
      });

      this.destroyLobby();
    });
  }

  private onTradeCancelled() {
    if (!this.socket) return;
    this.socket.on('tradeCancelled', (botId) => {
      if (botId !== this.selectedBot.botId) return;

      runInAction(() => {
        this.status = BotStatus.IN_LOBBY;
        this.tradeState = initialTradeState;
        this.cart = [];
        this.isCartCommand = false;
        this.isWantCommand = false;
        this.isTradeCommand = false;
        this.isDeletingItems = false;
        this.isRemoveCommand = false;
      });
    });
  }

  private onLobbyDestroy() {
    if (!this.socket || !this.selectedBot) return;
    this.socket.on('lobbyDestroyed', (botId) => {
      if (botId !== this.selectedBot.botId) return;

      runInAction(() => {
        this.queue = this.queue.filter(
          (nickname) => nickname !== this.lobbyOpponentNickname
        );
        this.status = BotStatus.FREE;
        this.tradeState = initialTradeState;
        this.lobbyOpponentNickname = 'Nobody';
        this.chat = [];
        this.cart = [];
        this.isUserControl = false;
        this.isCartCommand = false;
        this.isWantCommand = false;
        this.isTradeCommand = false;
        this.isDeletingItems = false;
        this.isRemoveCommand = false;
      });

      if (this.queue.length > 0) {
        this.inviteToLobby(this.queue[0]);
      }
    });
  }

  private onLobbyJoined() {
    if (!this.socket || !this.selectedBot) return;
    this.socket.on('joinedLobby', (botId) => {
      if (botId !== this.selectedBot.botId) return;

      this.sendMessage(
        'Hello! Use commands to trade! Check commands using command /help'
      );
    });
  }

  private onAssetUpdate() {
    if (!this.socket) return;
    let timeout: ReturnType<typeof setTimeout> = null;
    this.socket.on('tradeAssetUpdate', (botId) => {
      if (botId !== this.selectedBot.botId) return;
      clearTimeout(timeout);

      runInAction(() => {
        this.status = BotStatus.IN_TRADE;
      });

      this.getTradeState();

      // AUTO
      if (this.isUserControl) return;
      // this.clearTrade();
      timeout = setTimeout(() => {
        return this.sendMessage('ok!');
      }, 1500);
    });
  }

  private onCreditsUpdate() {
    if (!this.socket) return;
    this.socket.on('tradeCreditsUpdate', (botId) => {
      if (botId !== this.selectedBot.botId) return;

      runInAction(() => {
        this.status = BotStatus.IN_TRADE;
      });

      this.getTradeState();

      // AUTO
      if (this.isUserControl) return;
      this.clearTrade();
    });
  }

  private async clearTrade() {
    this.isDeletingItems = true;
    await this.updateCredits(0);
    const state = await this.getTradeState();

    for (let i = 0; i < state.assets.give.length; i++) {
      const item = state.assets.give[i];

      await this.updateAsset(item.id, false);
    }

    await this.getTradeState();

    this.isDeletingItems = false;
    this.isTradeCommand = false;
    return true;
  }
}

const rlBot = new RlBot();

export default rlBot;
