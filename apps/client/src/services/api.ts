import axios, { AxiosError } from 'axios';
import { AuthHelper } from './auth/auth.helper';

const baseURL = 'http://localhost/api/';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = AuthHelper.getAccessToken();

  if (config.headers && accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response ? error.response.status : null;

    if (status !== 401 || error.config._isRetry) return Promise.reject(error);

    error.config._isRetry = true;

    try {
      // await AuthService.refreshTokens();
      const { data } = await axios.post(
        `auth/refresh-token`,
        {},
        { withCredentials: true, baseURL: baseURL }
      );

      AuthHelper.setTokens(data);

      return api(error.config);
    } catch {
      AuthHelper.removeTokens();

      return Promise.reject(error);
    }
  }
);
