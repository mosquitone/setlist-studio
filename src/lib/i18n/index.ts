/**
 * i18n System Entry Point
 * i18nシステムのエントリーポイント
 *
 * このファイルは、細分化されたメッセージファイルを統合して、
 * 既存のコードベースとの互換性を維持します。
 */

// 型定義をエクスポート
export type { Language, Messages } from './types';

// ユーティリティ関数をエクスポート
export { detectLanguage, getMessages } from './utils';

// 個別メッセージモジュールからインポート
import { authJa, authEn } from './messages/auth';
import { commonJa, commonEn } from './messages/common';
import { confirmationsJa, confirmationsEn } from './messages/confirmations';
import { emailsJa, emailsEn } from './messages/emails';
import { errorsJa, errorsEn } from './messages/errors';
import { featuresJa, featuresEn } from './messages/features';
import { footerJa, footerEn } from './messages/footer';
import { metadataJa, metadataEn } from './messages/metadata';
import { navigationJa, navigationEn } from './messages/navigation';
import { notificationsJa, notificationsEn } from './messages/notifications';
import { pagesJa, pagesEn } from './messages/pages';
import { setlistsJa, setlistsEn } from './messages/setlists';
import { songsJa, songsEn } from './messages/songs';
import { validationJa, validationEn } from './messages/validation';
import type { Messages } from './types';

// 日本語メッセージの統合
export const jaMessages: Messages = {
  auth: authJa,
  common: commonJa,
  pages: pagesJa,
  errors: errorsJa,
  features: featuresJa,
  notifications: notificationsJa,
  validation: validationJa,
  setlists: setlistsJa,
  setlistDetail: setlistsJa.detail,
  setlistForm: setlistsJa.form,
  songs: songsJa,
  navigation: navigationJa,
  metadata: metadataJa,
  emails: emailsJa,
  footer: footerJa,
  confirmations: confirmationsJa,
};

// 英語メッセージの統合
export const enMessages: Messages = {
  auth: authEn,
  common: commonEn,
  pages: pagesEn,
  errors: errorsEn,
  features: featuresEn,
  notifications: notificationsEn,
  validation: validationEn,
  setlists: setlistsEn,
  setlistDetail: setlistsEn.detail,
  setlistForm: setlistsEn.form,
  songs: songsEn,
  navigation: navigationEn,
  metadata: metadataEn,
  emails: emailsEn,
  footer: footerEn,
  confirmations: confirmationsEn,
};

// 既存コードとの互換性のため、デフォルトエクスポート
export { jaMessages as ja, enMessages as en };

// 個別モジュールのエクスポート（必要に応じて直接アクセス可能）
export {
  authJa,
  authEn,
  commonJa,
  commonEn,
  pagesJa,
  pagesEn,
  errorsJa,
  errorsEn,
  featuresJa,
  featuresEn,
  notificationsJa,
  notificationsEn,
  validationJa,
  validationEn,
  setlistsJa,
  setlistsEn,
  songsJa,
  songsEn,
  navigationJa,
  navigationEn,
  metadataJa,
  metadataEn,
  emailsJa,
  emailsEn,
  footerJa,
  footerEn,
  confirmationsJa,
  confirmationsEn,
};
