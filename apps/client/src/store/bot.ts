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
  private isAssetUpdated = false;
  private isUserControl = false;
  private timeout: ReturnType<typeof setTimeout> = null;
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

    if (this.isAssetUpdated && !this.isUserControl) return;

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

    const onMessageEvent = async (botId: string, message: string) => {
      if (botId !== this.selectedBot.botId) return;

      runInAction(() => {
        this.chat.push(`${this.lobbyOpponentNickname}: ${message}`);
      });
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
        `http://localhost/completed-trades/${completedTrade.id}`
      );

      runInAction(() => {
        this.status = BotStatus.IN_LOBBY;
        this.tradeState = initialTradeState;
        this.isAssetUpdated = false;
      });

      // Leave in 1s
      setTimeout(() => {
        this.destroyLobby();
      }, 1000);
    });
  }

  private onTradeCancelled() {
    if (!this.socket) return;
    this.socket.on('tradeCancelled', (botId) => {
      if (botId !== this.selectedBot.botId) return;

      runInAction(() => {
        this.status = BotStatus.IN_LOBBY;
        this.tradeState = initialTradeState;
        this.isAssetUpdated = false;
      });

      // Leave in 1s
      setTimeout(() => {
        this.destroyLobby();
      }, 1000);
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
        this.isAssetUpdated = false;
        this.isUserControl = false;
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

      this.sendMessage('Hello! Put your items');
    });
  }

  private onAssetUpdate() {
    if (!this.socket) return;

    this.socket.on('tradeAssetUpdate', (botId) => {
      if (botId !== this.selectedBot.botId) return;
      this.isAssetUpdated = true;
      clearTimeout(this.timeout);

      runInAction(() => {
        this.status = BotStatus.IN_TRADE;
      });

      this.getTradeState();

      // AUTO
      if (this.isUserControl) return;

      this.clearTrade();

      // this.clearTrade();
      this.timeout = setTimeout(async () => {
        this.isAssetUpdated = false;
        let credits = 0;
        const skipItems: number[] = [];
        const state = await this.getTradeState();

        for (let i = 0; i < state.assets.get.length; i++) {
          const currentGetItem = state.assets.get[i];
          const offer = this.trades.find(
            (currentOffer) =>
              currentOffer.isEnabled &&
              matchItems(currentGetItem, currentOffer.wants)
          );

          // Skip if no offer
          if (!offer) continue;

          // If need only 1 item
          if (offer.wants.amount === 1) {
            credits += offer.has.amount;
            skipItems.push(currentGetItem.id);
            continue;
          }

          // If need more then 1 item
          const suitableItems = state.assets.get.filter(
            (item) =>
              matchItems(item, offer.wants) && !skipItems.includes(item.id)
          );

          // If not enough items
          if (suitableItems.length < offer.wants.amount) continue;

          // Add items to skip
          for (let j = 0; j < offer.wants.amount; j++) {
            const currentSuitableItem = suitableItems[j];
            skipItems.push(currentSuitableItem.id);
          }

          // Calculate credits
          credits += offer.has.amount;
        }

        if (this.isUserControl || this.isAssetUpdated) return;

        const inventory = await this.getInventory();

        if (credits > inventory.credits)
          return this.sendMessage("I don't have enough credits!");

        await this.updateCredits(credits);
        await this.confirmTrade();
        return;
      }, 2000);
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
    await this.updateCredits(0);
    await this.getTradeState();

    return true;
  }
}

const rlBot = new RlBot();

export default rlBot;
