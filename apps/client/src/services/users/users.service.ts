import { IUser } from '@autotrader/interfaces';
import { api } from '../api';

interface ICreateUser {
  email: string;
  key: string;
  telegram: string;
}

export const UsersService = {
  async createUser(dto: ICreateUser) {
    return await api.post('users', dto);
  },
  async getUsers(accessToken?: string) {
    const { data } = await api.get<Omit<IUser, 'password'>[]>(
      'users',
      accessToken && {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  },
  async swapAccess(userId: number) {
    return await api.post(`users/access/${userId}`);
  },
  async refreshPassword(userId: number) {
    return await api.post(`users/refresh/${userId}`);
  },
  async deleteUser(userId: number) {
    return await api.delete(`users/${userId}`);
  },
};
