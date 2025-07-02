// 共通型定義

// ID型 - CUIDベースの一意識別子
export type EntityId = string;

// テーマ型 - セットリストテーマ選択
export type Theme = 'black' | 'white';

// 文字列配列型 - 汎用的な文字列リスト
export type StringArray = string[];

// タイムスタンプ型 - 日付時刻表現
export type Timestamp = Date;

// ISO文字列型 - API/GraphQL用日付文字列
export type ISODateString = string;
