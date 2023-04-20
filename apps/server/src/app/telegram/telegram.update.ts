import { Ctx, Start, Update } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';

@Update()
export class TelegramUdpate {
  // Start command
  // Sends chat id
  @Start()
  async start(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.reply(`Your id: ${ctx.message.chat.id}`);
  }
}
