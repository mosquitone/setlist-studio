// ドメインエンティティ型定義

import { EntityId, Theme, ISODateString } from './common';

// ユーザーエンティティ
export interface User {
  id: EntityId;
  email: string;
  username: string;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

// 楽曲エンティティ
export interface Song {
  id: EntityId;
  title: string;
  artist: string;
  duration?: number;
  key?: string;
  tempo?: number;
  notes?: string;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

// セットリストアイテムエンティティ
export interface SetlistItem {
  id: EntityId;
  title: string;
  note?: string;
  order: number;
  setlistId?: EntityId;
}

// セットリストエンティティ
export interface Setlist {
  id: EntityId;
  title: string;
  artistName?: string;
  eventName?: string;
  eventDate?: string;
  openTime?: string;
  startTime?: string;
  theme: Theme;
  isPublic: boolean;
  userId?: EntityId;
  items: SetlistItem[];
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}
