// コンポーネント専用型定義

import { Theme, EntityId } from './common';
import { SetlistItem } from './entities';

// セットリスト表示用データ（QRコード付き）
export interface SetlistData {
  id: EntityId;
  title: string;
  artistName: string;
  eventName?: string;
  eventDate?: string;
  openTime?: string;
  startTime?: string;
  theme: Theme;
  items: SetlistItem[];
  qrCodeURL?: string;
}

// テーマコンポーネント用Props
export interface SetlistThemeProps {
  data: SetlistData;
  className?: string;
}

// フォーム用セットリストアイテム（簡略版）
export interface SetlistFormItem {
  id?: EntityId;
  title: string;
  note: string;
}

// セットリストフォーム値
export interface SetlistFormValues {
  title: string;
  artistName: string;
  eventName: string;
  eventDate: string;
  openTime: string;
  startTime: string;
  theme: string; // フォームでは文字列として扱う
  isPublic?: boolean; // オプショナル
  items: SetlistFormItem[];
}
