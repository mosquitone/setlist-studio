import { format } from 'date-fns';
import { ja, enUS } from 'date-fns/locale';

import { Language } from './messages';

/**
 * 多言語対応の日時フォーマット関数
 *
 * 使用例:
 * - formatDate(date, 'short', 'ja') → "2024年7月22日"
 * - formatDate(date, 'short', 'en') → "Jul 22, 2024"
 * - formatDate(date, 'long', 'ja') → "2024年7月22日 月曜日"
 * - formatDate(date, 'datetime', 'ja') → "2024年7月22日 14:30"
 */

export type DateFormatType = 'short' | 'long' | 'datetime' | 'time' | 'year' | 'month';

/**
 * 言語別の日付フォーマットパターン
 */
const DATE_FORMATS: Record<Language, Record<DateFormatType, string>> = {
  ja: {
    short: 'yyyy/MM/dd',
    long: 'yyyy年MM月dd日 EEEE',
    datetime: 'yyyy年MM月dd日 HH:mm',
    time: 'HH:mm',
    year: 'yyyy年',
    month: 'yyyy年MM月',
  },
  en: {
    short: 'yyyy/MM/dd',
    long: 'EEEE, MMMM dd, yyyy',
    datetime: 'MMM dd, yyyy HH:mm',
    time: 'HH:mm',
    year: 'yyyy',
    month: 'MMMM yyyy',
  },
};

/**
 * 言語に対応するdate-fnsロケールを取得
 */
function getDateFnsLocale(language: Language) {
  switch (language) {
    case 'ja':
      return ja;
    case 'en':
      return enUS;
    default:
      return enUS;
  }
}

/**
 * 多言語対応の日時フォーマット関数
 *
 * @param date Date object or ISO string
 * @param formatType Format type
 * @param language Language
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  formatType: DateFormatType = 'short',
  language: Language = 'ja',
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // 無効な日付の場合は空文字を返す
    if (isNaN(dateObj.getTime())) {
      return '';
    }

    const formatPattern = DATE_FORMATS[language][formatType];
    const locale = getDateFnsLocale(language);

    return format(dateObj, formatPattern, { locale });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
}

/**
 * 相対時間表示（"3日前", "3 days ago"）
 *
 * @param date Date object or ISO string
 * @param language Language
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string, language: Language = 'ja'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (language === 'ja') {
      if (diffDays > 0) {
        return `${diffDays}日前`;
      } else if (diffHours > 0) {
        return `${diffHours}時間前`;
      } else if (diffMinutes > 0) {
        return `${diffMinutes}分前`;
      } else {
        return '今すぐ';
      }
    } else {
      if (diffDays > 0) {
        return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
      } else if (diffHours > 0) {
        return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
      } else if (diffMinutes > 0) {
        return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
      } else {
        return 'just now';
      }
    }
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return '';
  }
}

/**
 * useI18nフックと連携するための日時フォーマット関数
 *
 * @param language Current language from useI18n hook
 * @returns Object with formatting functions
 */
export function useDateFormat(language: Language) {
  return {
    formatDate: (date: Date | string, formatType: DateFormatType = 'short') =>
      formatDate(date, formatType, language),
    formatRelativeTime: (date: Date | string) => formatRelativeTime(date, language),
  };
}
