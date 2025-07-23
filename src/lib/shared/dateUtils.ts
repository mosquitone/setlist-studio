/**
 * Utility functions for date formatting with timezone support and i18n
 * @deprecated Use formatDate from @/lib/i18n/date-format instead for i18n support
 */

import { formatDate } from '@/lib/i18n/date-format';
import { Language } from '@/lib/i18n/messages';

// レガシー関数 - 後方互換性のため保持
export const formatDateJST = (dateString: string | null | undefined): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTimeJST = (dateString: string | null | undefined): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// i18n対応版の関数 - 新しいformatDate関数を使用
export const formatEventDate = (
  dateString: string | null | undefined,
  language: Language = 'ja',
): string => {
  if (!dateString) return '';
  return formatDate(dateString, 'short', language);
};

// 後方互換性のため残しておく
export const formatEventDateJST = (dateString: string | null | undefined): string => {
  return formatEventDate(dateString, 'ja');
};

export const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  return date.toISOString().split('T')[0];
};
