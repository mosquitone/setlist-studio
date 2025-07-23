// 共通型定義

// ID型 - CUIDベースの一意識別子
export type EntityId = string;

// テーマの値
export const THEMES = {
  BLACK: 'black',
  WHITE: 'white',
} as const;

// テーマ型 - セットリストテーマ選択
export type Theme = (typeof THEMES)[keyof typeof THEMES];

// 文字列配列型 - 汎用的な文字列リスト
export type StringArray = string[];

// タイムスタンプ型 - 日付時刻表現
export type Timestamp = Date;

// ISO文字列型 - API/GraphQL用日付文字列
export type ISODateString = string;

// 認証プロバイダーの値
export const AUTH_PROVIDERS = {
  EMAIL: 'email',
  GOOGLE: 'google',
} as const;

// 認証プロバイダー型 - ユーザーの認証方法
export type AuthProvider = (typeof AUTH_PROVIDERS)[keyof typeof AUTH_PROVIDERS];
