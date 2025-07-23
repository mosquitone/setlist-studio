export interface OAuthUserInfo {
  email: string;
  verified_email: boolean;
  name?: string;
  picture?: string;
}

export interface OAuthProvider {
  /**
   * アクセストークンを検証してユーザー情報を取得
   */
  verifyAccessToken(accessToken: string): Promise<OAuthUserInfo | null>;

  /**
   * プロバイダー名を取得
   */
  getProviderName(): string;
}
