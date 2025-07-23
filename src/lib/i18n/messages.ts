/**
 * i18n Message Management System (Legacy Compatibility Layer)
 * メッセージの多言語管理（後方互換レイヤー）
 *
 * このファイルは既存のコードベースとの互換性を維持するため、
 * 新しく細分化されたメッセージシステムをプロキシしています。
 *
 * 新しいコードでは、個別のメッセージファイルまたは
 * src/lib/i18n/index.ts から直接インポートすることを推奨します。
 */

// 新しいi18nシステムからエクスポート
export type { Language, Messages } from './index';
export { detectLanguage, getMessages, jaMessages, enMessages } from './index';

// 既存のコードとの互換性のため、デフォルトエクスポートとして提供
export { jaMessages as default } from './index';
