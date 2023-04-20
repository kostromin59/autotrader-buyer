import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Scenes, Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Scenes.SceneContext>
  ) { }

  // Send message
  async sendMessage(chatId: string, message: string) {
    console.log(chatId, message);
    return await this.bot.telegram.sendMessage(chatId, message);
  }
}
