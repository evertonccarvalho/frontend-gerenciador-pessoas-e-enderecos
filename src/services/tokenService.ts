import api from './api';

export class TokenService {
  private static readonly ACCESS_TOKEN_KEY = 'token';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';

  private static isLocalStorageSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    );
  }

  private static setAuthorizationHeader(token: string): void {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  private static removeAuthorizationHeader(): void {
    delete api.defaults.headers.common.Authorization;
  }

  static saveAccessToken(accessToken: string): void {
    localStorage.setItem(TokenService.ACCESS_TOKEN_KEY, accessToken);
    TokenService.setAuthorizationHeader(accessToken);
  }

  static saveRefreshToken(refreshToken: string): void {
    localStorage.setItem(TokenService.REFRESH_TOKEN_KEY, refreshToken);
  }

  static getAccessToken(): string | null {
    if (TokenService.isLocalStorageSupported()) {
      return localStorage.getItem(TokenService.ACCESS_TOKEN_KEY);
    }
    return null;
  }

  static getRefreshToken(): string | null {
    if (TokenService.isLocalStorageSupported()) {
      return localStorage.getItem(TokenService.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  static removeTokens(): void {
    if (TokenService.isLocalStorageSupported()) {
      localStorage.removeItem(TokenService.ACCESS_TOKEN_KEY);
      localStorage.removeItem(TokenService.REFRESH_TOKEN_KEY);
      TokenService.removeAuthorizationHeader();
    }
  }


}
