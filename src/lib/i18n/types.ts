/**
 * i18n Type Definitions
 * 国際化システムの型定義
 */

import { AuthMessages } from './messages/auth';
import { CommonMessages } from './messages/common';

// 言語タイプ
export type Language = 'ja' | 'en';

// 型定義をインポート
export type { AuthMessages, CommonMessages };

// メインのメッセージ型定義
export interface Messages {
  auth: AuthMessages;
  common: CommonMessages;
  // 他のセクションも同様に定義
  errors: any; // 簡略化のため一時的にany
  pages: any;
  features: any;
  notifications: any;
  confirmations: any;
  validation: any;
  footer: any;
  setlistDetail: any;
  setlistForm: any;
  navigation: any;
  songs: any;
  metadata: any;
  emails: any;
}
