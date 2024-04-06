import api from './api';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';

export class TokenService {
  private static readonly ACCESS_TOKEN_KEY = 'token';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';

  private static setAuthorizationHeader(token: string): void {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  private static removeAuthorizationHeader(): void {
    delete api.defaults.headers.common.Authorization;
  }

  static saveAccessToken(accessToken: string): void {
    setCookie(TokenService.ACCESS_TOKEN_KEY, accessToken);
    TokenService.setAuthorizationHeader(accessToken);
  }

  static saveRefreshToken(refreshToken: string): void {
    setCookie(TokenService.REFRESH_TOKEN_KEY, refreshToken);
  }

  static getAccessToken(): string | undefined {
    return getCookie(TokenService.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | undefined {
    return getCookie(TokenService.REFRESH_TOKEN_KEY);
  }

  static removeTokens(): void {
    deleteCookie(TokenService.ACCESS_TOKEN_KEY);
    deleteCookie(TokenService.REFRESH_TOKEN_KEY);
    TokenService.removeAuthorizationHeader();
  }
}
