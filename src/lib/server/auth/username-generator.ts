/**
 * 日本語名を含むGoogle OAuth認証用のセーフなユーザー名生成機能
 *
 * 特徴:
 * - 日本語（ひらがな、カタカナ、漢字）を保持
 * - 読み取り可能な文字を優先してdisplayNameを使用
 * - フォールバックでemail prefixを使用
 * - 重複を許可（数字サフィックスなし）
 * - 長さ制限（20文字）でトランケート
 */

/**
 * 文字列が読み取り可能な文字（アルファベット、数字、日本語）を含むかチェック
 */
function hasReadableCharacters(str: string): boolean {
  if (!str) return false;

  // 日本語文字（ひらがな、カタカナ、漢字）+ アルファベット + 数字
  const readableChars =
    /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\uF900-\uFAFF\u3400-\u4DBFa-zA-Z0-9]/;
  return readableChars.test(str);
}

/**
 * 危険な文字（制御文字、ヌル文字など）を除去
 * 日本語文字は保持する
 */
function sanitizeUsername(str: string): string {
  // 制御文字（\x00-\x1F, \x7F）とヌル文字を除去、前後の空白をトリム
  return str.replace(/[\x00-\x1F\x7F]/g, '').trim();
}

/**
 * Google OAuth用のセーフなユーザー名を生成
 *
 * @param displayName Google Profileの表示名（日本語名など）
 * @param email Google Account のメールアドレス
 * @returns Promise<string> 生成されたユニークなユーザー名
 */
export async function generateSafeUsername(
  displayName: string | null | undefined,
  email: string,
): Promise<string> {
  let baseUsername: string;

  // Step 1: ベースユーザー名を決定
  if (displayName && hasReadableCharacters(displayName)) {
    // 日本語名や読み取り可能な名前の場合は表示名を使用
    baseUsername = sanitizeUsername(displayName);
  } else {
    // 読み取り不可能またはdisplayNameが空の場合はemailプレフィックスを使用
    baseUsername = email.split('@')[0];
  }

  // Step 2: 長さ制限を適用（20文字）
  if (baseUsername.length > 20) {
    baseUsername = baseUsername.substring(0, 20);
  }

  // Step 3: 空文字列の場合はデフォルト値
  if (!baseUsername.trim()) {
    baseUsername = email.split('@')[0].substring(0, 20);
  }

  // Step 4: 重複チェックを削除（重複を許可するため）
  return baseUsername;
}

/**
 * テスト・デバッグ用の実例
 *
 * 例:
 * - 田中太郎 → "田中太郎" (日本語保持)
 * - John Smith → "John Smith" (英語保持)
 * - "" → "user123" (emailプレフィックス)
 * - 既存ユーザー名 → "田中太郎" (重複許可)
 */
