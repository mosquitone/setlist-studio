// API/GraphQLレスポンス型定義

import { User, Song, Setlist } from './entities';

// 認証関連
export interface AuthPayload {
  token: string;
  user: User;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// APIレスポンス型
export interface GetSetlistsResponse {
  setlists: Setlist[];
}

export interface GetSongsResponse {
  songs: Song[];
}

export interface GetSetlistResponse {
  setlist: Setlist;
}
