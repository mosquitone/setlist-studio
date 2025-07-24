/**
 * API Routes用のi18nヘルパー関数
 * API Routes helper functions for i18n
 */

import { NextRequest } from 'next/server';

import { Language, Messages } from './types';

import { jaMessages, enMessages } from './index';

/**
 * リクエストから言語を検出
 * Detect language from request
 */
export function detectLanguageFromRequest(request: NextRequest): Language {
  // 1. Accept-Language ヘッダーから言語を取得
  const acceptLanguage = request.headers.get('accept-language') || '';
  const languages = acceptLanguage
    .split(',')
    .map((lang) => lang.split(';')[0].trim().split('-')[0].toLowerCase());

  // 2. 最初にマッチした言語を返す
  for (const lang of languages) {
    if (lang === 'ja' || lang === 'en') {
      return lang as Language;
    }
  }

  // 3. デフォルトは日本語
  return 'ja';
}

/**
 * API用のメッセージ取得関数
 * Get messages for API routes
 */
export function getApiMessages(request: NextRequest): Messages {
  const lang = detectLanguageFromRequest(request);
  return lang === 'ja' ? jaMessages : enMessages;
}

/**
 * エラーレスポンス用のヘルパー
 * Helper for error responses
 */
export function getErrorMessage(request: NextRequest, key: keyof Messages['errors']): string {
  const msg = getApiMessages(request);
  return msg.errors[key];
}

/**
 * 汎用メッセージ取得ヘルパー
 * Generic message getter helper
 */
export function getMessage<K extends keyof Messages>(
  request: NextRequest,
  category: K,
  key: keyof Messages[K],
): string {
  const msg = getApiMessages(request);
  return (msg[category] as any)[key];
}
