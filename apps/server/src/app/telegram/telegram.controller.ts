import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from '../auth/guards/auth.guard';
import { CurrentUser } from '../users/decorators/user.decorator';
import { SendMessageDto } from './dto/send-message.dto';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  // Send message
  @Auth()
  @Post('message')
  async sendMessage(
    @CurrentUser('telegram') telegramChatId: string,
    @Body() dto: SendMessageDto
  ) {
    await this.telegramService.sendMessage(telegramChatId, dto.message);
    return;
  }
}
