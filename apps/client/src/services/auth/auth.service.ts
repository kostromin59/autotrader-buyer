import { ITokens, IUser } from '@autotrader/interfaces';
import { api } from '../api';
import { ILoginFormData } from './types';
import { AuthHelper } from './auth.helper';

export const AuthService = {
  async login(formData: ILoginFormData) {
    const { data } = await api.post<ITokens>('auth/login', formData);

    AuthHelper.setTokens(data);

    return data;
  },
  async refreshTokens() {
    const { data } = await api.post<ITokens>('auth/refresh-token');

    AuthHelper.setTokens(data);

    return data;
  },
  async getProfile(accessToken?: string) {
    const { data } = await api.get<Omit<IUser, 'password'>>(
      'auth/me',
      accessToken && {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  },
  logout() {
    AuthHelper.removeTokens();
  },
};
