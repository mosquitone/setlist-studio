// 統一された入力検証ルール
// バックエンド（class-validator）とフロントエンド（Yup）で共通使用

// 共通文字パターン定数 - DRY原則に従って重複を排除
const CHARACTER_SETS = {
  // 日本語文字セット
  HIRAGANA: '\u3040-\u309F',
  KATAKANA: '\u30A0-\u30FF',
  KANJI: '\u4E00-\u9FAF',

  // 共通記号セット
  BASIC_SYMBOLS: '\-()（）.。、,!！?？',
  EXTENDED_SYMBOLS: '\-()（）.。、,!！?？&',
  QUOTE_SYMBOLS: '\-()（）.。、,!！?？\'"\"&',

  // 改行文字
  NEWLINES: '\n\r',
} as const;

// 統合された再利用可能なパターン構築関数
// DRY原則に従い、1つの関数で必須/任意の両方のパターンを生成
const createPattern = (additionalChars: string = '', required: boolean = true): RegExp => {
  const japaneseChars = `${CHARACTER_SETS.HIRAGANA}${CHARACTER_SETS.KATAKANA}${CHARACTER_SETS.KANJI}`;
  const pattern = `[\\w\\s${japaneseChars}${additionalChars}]`;
  const quantifier = required ? '+' : '*';
  return new RegExp(`^${pattern}${quantifier}$`);
};

// 後方互換性のための便利関数
const createOptionalPattern = (additionalChars: string = ''): RegExp =>
  createPattern(additionalChars, false);

// エクスポートして他のファイルからも利用可能にする
export { createPattern, createOptionalPattern };

export const ValidationRules = {
  // パスワード関連
  password: {
    minLength: 8,
    maxLength: 128,
    // パスワードマネージャー互換性：特殊文字不要
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    // @deprecated Use messages.auth.passwordRequirements for i18n support
    message: 'パスワードは8文字以上で、大文字・小文字・数字を含む必要があります',
  },

  // ユーザー関連
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    maxLength: 254,
    message: '有効なメールアドレスを入力してください',
  },

  username: {
    minLength: 1,
    maxLength: 50,
    pattern: createPattern('_', true),
    message: 'ユーザー名は英数字、ひらがな、カタカナ、漢字、アンダースコアのみ使用可能です',
  },

  // セットリスト関連
  setlistTitle: {
    minLength: 1,
    maxLength: 100,
    pattern: createPattern(CHARACTER_SETS.BASIC_SYMBOLS, true),
    message: 'セットリスト名は100文字以内で、使用可能な文字のみ入力してください',
  },

  artistName: {
    minLength: 1,
    maxLength: 100,
    pattern: createPattern(CHARACTER_SETS.EXTENDED_SYMBOLS, true),
    message: 'アーティスト名は100文字以内で、使用可能な文字のみ入力してください',
  },

  eventName: {
    maxLength: 200,
    pattern: createPattern(CHARACTER_SETS.EXTENDED_SYMBOLS, false),
    message: 'イベント名は200文字以内で、使用可能な文字のみ入力してください',
  },

  // 楽曲関連
  songTitle: {
    minLength: 1,
    maxLength: 200,
    pattern: createPattern(CHARACTER_SETS.QUOTE_SYMBOLS, true),
    message: '楽曲名は200文字以内で、使用可能な文字のみ入力してください',
  },

  artist: {
    maxLength: 100,
    pattern: createPattern(CHARACTER_SETS.EXTENDED_SYMBOLS, false),
    message: 'アーティスト名は100文字以内で、使用可能な文字のみ入力してください',
  },

  musicalKey: {
    pattern: /^[A-G][#b]?(m|maj|min|M|m)?$/,
    message: '有効な音楽キー（例：C, Am, F#, Bb）を入力してください',
  },

  tempo: {
    min: 1,
    max: 300,
    message: 'テンポは1-300の範囲で入力してください',
  },

  duration: {
    min: 1,
    max: 7200, // 2時間 = 7200秒
    message: '楽曲時間は1秒-2時間の範囲で入力してください',
  },

  notes: {
    maxLength: 500,
    pattern: createPattern(CHARACTER_SETS.QUOTE_SYMBOLS + CHARACTER_SETS.NEWLINES, false),
    message: 'ノートは500文字以内で、使用可能な文字のみ入力してください',
  },

  // 時間関連
  time: {
    pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    message: '有効な時間形式（HH:MM）で入力してください',
  },
};

// XSS対策用のサニタイゼーション関数
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // HTMLタグ除去
    .replace(/javascript:/gi, '') // JavaScriptプロトコル除去
    .replace(/on\w+=/gi, '') // イベントハンドラ除去
    .slice(0, 1000); // 最大長制限
}

// 統一された検証関数
export function validateField(
  value: string,
  fieldType: keyof typeof ValidationRules,
): { isValid: boolean; message?: string } {
  const rule = ValidationRules[fieldType];

  if (!rule) {
    return { isValid: false, message: '不明なフィールドタイプです' };
  }

  // 空文字チェック（必須フィールドの場合）
  if ('minLength' in rule && rule.minLength > 0 && (!value || value.trim().length === 0)) {
    return { isValid: false, message: 'この項目は必須です' };
  }

  // 長さチェック
  if ('minLength' in rule && value.length < rule.minLength) {
    return { isValid: false, message: rule.message };
  }

  if ('maxLength' in rule && value.length > rule.maxLength) {
    return { isValid: false, message: rule.message };
  }

  // 数値範囲チェック
  if ('min' in rule || 'max' in rule) {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) {
      return { isValid: false, message: '数値を入力してください' };
    }
    if ('min' in rule && typeof rule.min === 'number' && numValue < rule.min) {
      return { isValid: false, message: rule.message };
    }
    if ('max' in rule && typeof rule.max === 'number' && numValue > rule.max) {
      return { isValid: false, message: rule.message };
    }
  }

  // パターンチェック
  if ('pattern' in rule && !rule.pattern.test(value)) {
    return { isValid: false, message: rule.message };
  }

  return { isValid: true };
}

// Yup用のスキーマヘルパー
export function createYupValidation(fieldType: keyof typeof ValidationRules) {
  const rule = ValidationRules[fieldType];

  return {
    rule,
    test: (value: string) => validateField(value, fieldType).isValid,
    message: rule.message,
  };
}
