import { ITokens } from '@autotrader/interfaces';
import Cookies from 'js-cookie';

export const AuthHelper = {
  getAccessToken() {
    return Cookies.get('accessToken');
  },
  getRefreshToken() {
    return Cookies.get('accessToken');
  },
  setTokens({ accessToken, refreshToken }: ITokens) {
    Cookies.set('accessToken', accessToken);
    Cookies.set('refreshToken', refreshToken);
  },
  removeTokens() {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  },
};
