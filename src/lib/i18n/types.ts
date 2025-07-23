/**
 * i18n Type Definitions
 * 国際化システムの型定義
 */

import { AuthMessages } from './messages/auth';
import { CommonMessages } from './messages/common';
import { ConfirmationMessages } from './messages/confirmations';
import { EmailMessages } from './messages/emails';
import { ErrorMessages } from './messages/errors';
import { FeatureMessages } from './messages/features';
import { FooterMessages } from './messages/footer';
import { MetadataMessages } from './messages/metadata';
import { NavigationMessages } from './messages/navigation';
import { NotificationMessages } from './messages/notifications';
import { PageMessages } from './messages/pages';
import { SetlistMessages } from './messages/setlists';
import { SongMessages } from './messages/songs';
import { ValidationMessages } from './messages/validation';

// 言語タイプ
export type Language = 'ja' | 'en';

// 型定義をインポート
export type {
  AuthMessages,
  CommonMessages,
  ErrorMessages,
  FeatureMessages,
  NotificationMessages,
  ValidationMessages,
  SetlistMessages,
  SongMessages,
  ConfirmationMessages,
  EmailMessages,
  FooterMessages,
  MetadataMessages,
  NavigationMessages,
  PageMessages,
};

// メインのメッセージ型定義
export interface Messages {
  auth: AuthMessages;
  common: CommonMessages;
  errors: ErrorMessages;
  pages: PageMessages;
  features: FeatureMessages;
  notifications: NotificationMessages;
  confirmations: ConfirmationMessages;
  validation: ValidationMessages;
  footer: FooterMessages;
  setlists: SetlistMessages;
  setlistDetail: SetlistMessages['detail']; // 後方互換性のため
  setlistForm: SetlistMessages['form']; // 後方互換性のため
  navigation: NavigationMessages;
  songs: SongMessages;
  metadata: MetadataMessages;
  emails: EmailMessages;
}
