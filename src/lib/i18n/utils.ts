/**
 * i18n Utility Functions
 * メッセージシステムのユーティリティ関数
 */

// 静的インポートで全メッセージを取得
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
import { pagesMessages } from './messages/pages';
import { setlistsJa, setlistsEn } from './messages/setlists';
import { songsJa, songsEn } from './messages/songs';
import { validationJa, validationEn } from './messages/validation';
import type { Language, Messages } from './types';

// 言語検出関数
export function detectLanguage(acceptLanguage?: string): Language {
  if (!acceptLanguage) {
    return 'ja'; // デフォルトは日本語
  }

  // Accept-Language ヘッダーをパース
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [locale, q = '1'] = lang.trim().split(';q=');
      return {
        locale: locale.toLowerCase().split('-')[0],
        quality: parseFloat(q),
      };
    })
    .sort((a, b) => b.quality - a.quality);

  // サポートされている言語から最適なものを選択
  for (const { locale } of languages) {
    if (locale === 'ja' || locale === 'en') {
      return locale as Language;
    }
  }

  return 'ja'; // デフォルトは日本語
}

// 静的メッセージオブジェクトを構築
const jaMessages: Messages = {
  auth: authJa,
  common: commonJa,
  pages: pagesMessages.ja.pages,
  errors: errorsJa,
  features: featuresJa,
  notifications: notificationsJa,
  validation: validationJa,
  setlistDetail: setlistsJa.detail,
  setlistForm: setlistsJa.form,
  songs: songsJa,
  navigation: navigationJa,
  metadata: metadataJa,
  emails: emailsJa,
  footer: footerJa,
  confirmations: confirmationsJa,
};

const enMessages: Messages = {
  auth: authEn,
  common: commonEn,
  pages: pagesMessages.en.pages,
  errors: errorsEn,
  features: featuresEn,
  notifications: notificationsEn,
  validation: validationEn,
  setlistDetail: setlistsEn.detail,
  setlistForm: setlistsEn.form,
  songs: songsEn,
  navigation: navigationEn,
  metadata: metadataEn,
  emails: emailsEn,
  footer: footerEn,
  confirmations: confirmationsEn,
};

// メッセージ取得関数
export function getMessages(lang: Language): Messages {
  switch (lang) {
    case 'ja':
      return jaMessages;
    case 'en':
      return enMessages;
    default:
      return jaMessages; // デフォルトは日本語
  }
}
