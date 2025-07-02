import { Theme } from '@/types/common';

export interface SetlistItem {
  id: string;
  title: string;
  note?: string;
  order: number;
}

export interface SetlistData {
  id: string;
  title: string;
  bandName: string;
  eventName?: string;
  eventDate?: string;
  openTime?: string;
  startTime?: string;
  theme: Theme;
  items: SetlistItem[];
  qrCodeURL?: string;
}

export interface SetlistThemeProps {
  data: SetlistData;
  className?: string;
}
