import { api } from '../api';

export const TelegramService = {
  async sendMessage(message: string) {
    return await api.post('/telegram/message', {
      message,
    });
  },
};
