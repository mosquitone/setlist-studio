# Reactの自動エスケープ機能とXSS防御

## 概要

Reactは、XSS（Cross-Site Scripting）攻撃を防ぐための自動エスケープ機能を内蔵しています。このドキュメントでは、Reactがどのようにしてアプリケーションを安全に保つのか、具体的なケースと技術的な理由を解説します。

## 目次

- [Reactの自動エスケープの仕組み](#reactの自動エスケープの仕組み)
- [具体的なケースと動作例](#具体的なケースと動作例)
- [なぜ安全なのか：技術的な理由](#なぜ安全なのか技術的な理由)
- [dangerouslySetInnerHTMLとの違い](#dangerouslysetinnerhtmlとの違い)
- [プロジェクトでの実装例](#プロジェクトでの実装例)
- [XSSとCSRFの違い](#xssとcsrfの違い)

## Reactの自動エスケープの仕組み

ReactはJSX内で`{}`を使用して変数を表示する際、自動的にHTMLエスケープを行います。これは特別な設定や追加のコードを必要とせず、デフォルトで有効になっています。

### エスケープされる文字

| 文字 | エスケープ後 | 用途 |
|------|-------------|------|
| `<` | `&lt;` | HTMLタグの開始を防ぐ |
| `>` | `&gt;` | HTMLタグの終了を防ぐ |
| `&` | `&amp;` | HTMLエンティティの開始を防ぐ |
| `"` | `&quot;` | 属性値の終端を防ぐ |
| `'` | `&#039;` | 属性値の終端を防ぐ |

## 具体的なケースと動作例

### ケース1: 文字列の場合（最も一般的）

```jsx
// ユーザーが入力した悪意のあるデータ
const userInput = '<script>alert("XSS攻撃！")</script>';

// Reactコンポーネント
function SongTitle() {
  return <div>{userInput}</div>;
}

// ReactがレンダリングするHTML
<div>&lt;script&gt;alert("XSS攻撃！")&lt;/script&gt;</div>

// ブラウザに表示される内容（テキストとして表示）
<script>alert("XSS攻撃！")</script>
```

**結果**: スクリプトは実行されず、安全にテキストとして表示されます。

### ケース2: オブジェクトの`toString()`メソッド

```jsx
// 攻撃者が細工したオブジェクト
const maliciousObject = {
  toString: () => '<img src=x onerror="alert(\'XSS\')">'
};

function Component() {
  return <div>{maliciousObject}</div>;
}

// Reactの処理
// 1. maliciousObject.toString()を呼ぶ
// 2. 返された文字列をエスケープ
// 3. 結果: &lt;img src=x onerror="alert('XSS')"&gt;
```

**結果**: `toString()`の戻り値も信頼せず、適切にエスケープされます。

### ケース3: 属性値の場合

```jsx
const userInput = '" onmouseover="alert(\'XSS\')" data-hack="';

function DangerousAttribute() {
  return <div title={userInput}>ホバーしてください</div>;
}

// Reactがレンダリングする内容
<div title="&quot; onmouseover=&quot;alert('XSS')&quot; data-hack=&quot;">
  ホバーしてください
</div>
```

**結果**: 属性値内の特殊文字もエスケープされ、属性の終端として解釈されません。

### ケース4: 配列の場合

```jsx
const songs = [
  { id: 1, title: '<script>alert(1)</script>' },
  { id: 2, title: '<img src=x onerror="alert(2)">' }
];

function SongList() {
  return (
    <ul>
      {songs.map(song => (
        <li key={song.id}>{song.title}</li>
      ))}
    </ul>
  );
}

// 各要素が個別にエスケープされる
<ul>
  <li>&lt;script&gt;alert(1)&lt;/script&gt;</li>
  <li>&lt;img src=x onerror="alert(2)"&gt;</li>
</ul>
```

**結果**: 配列の各要素が個別にエスケープ処理されます。

### ケース5: 複雑な攻撃パターン

```jsx
// 様々な攻撃パターン
const attackPatterns = [
  'javascript:alert("XSS")',
  '"><script>alert(String.fromCharCode(88,83,83))</script>',
  '<iframe src="javascript:alert(\'XSS\')"></iframe>',
  '<input type="text" value="<script>alert(\'XSS\')</script>">'
];

// 全てのパターンが安全にエスケープされる
attackPatterns.map(pattern => <div>{pattern}</div>);
```

**結果**: どんな複雑な攻撃パターンも、全て安全なテキストとして表示されます。

## なぜ安全なのか：技術的な理由

### 1. HTMLパーサーの動作原理

```html
<!-- エスケープ後のHTML -->
<div>&lt;script&gt;alert("XSS")&lt;/script&gt;</div>

<!-- ブラウザのパース処理 -->
1. <div>タグを認識
2. &lt; を見つける → これは < の文字参照として解釈
3. テキストノードとして処理
4. </div>でタグを閉じる
5. スクリプトタグとして解釈されない
```

### 2. DOMツリーでの表現

```
Element: div
  └─ TextNode: "<script>alert("XSS")</script>"
```

エスケープされた内容は、スクリプト要素ではなくテキストノードとして扱われます。

### 3. ブラウザのレンダリングエンジンの処理フロー

```
HTMLパーサー → DOMツリー構築 → レンダリング

エスケープされた文字の処理：
- パーサーフェーズでテキストとして確定
- JavaScriptエンジンに渡されない
- 実行コンテキストが作られない
- スクリプトとして評価されない
```

### 4. Reactの内部実装

ReactはReactElementを作成する際に、以下の処理を行います：

1. **文字列の検証**: 入力が文字列かどうかチェック
2. **自動変換**: オブジェクトの場合は`toString()`を呼び出し
3. **エスケープ処理**: 特殊文字を文字参照に変換
4. **DOM生成**: `textContent`または属性値として安全に設定

## dangerouslySetInnerHTMLとの違い

### 危険な例（避けるべき）

```jsx
// ❌ 危険：エスケープされない
const userInput = '<img src=x onerror="alert(\'XSS\')">';
<div dangerouslySetInnerHTML={{__html: userInput}} />

// userInputがそのままHTMLとして解釈され、onerrorが実行される
```

### 安全な例（推奨）

```jsx
// ✅ 安全：自動エスケープ
const userInput = '<img src=x onerror="alert(\'XSS\')">';
<div>{userInput}</div>

// userInputはテキストとして扱われ、画像タグとして解釈されない
```

## プロジェクトでの実装例

### 楽曲テーブルでの実装

```jsx
// src/components/songs/SongTable.tsx:230-234
<TableCell>{song.title}</TableCell>
<TableCell>{song.artist}</TableCell>
<TableCell>{song.notes || '-'}</TableCell>

// もし song.title = '<img src=x onerror="alert(1)">' の場合：
// 1. Reactが自動エスケープ
// 2. &lt;img src=x onerror=&quot;alert(1)&quot;&gt; に変換
// 3. ブラウザはこれをテキストとして表示
// 4. 画像タグとして解釈されない、onerrorも実行されない
```

### セットリストダッシュボードでの実装

```jsx
// src/components/home/SetlistDashboard.tsx:185
<Typography variant="h6">
  {setlist.title}
</Typography>

// ユーザーが悪意のあるセットリスト名を入力しても
// Reactの自動エスケープにより安全に表示される
```

## XSSとCSRFの違い

### XSS（Cross-Site Scripting）

- **攻撃内容**: 悪意のあるスクリプトを被害者のブラウザで実行させる
- **攻撃対象**: ブラウザ（JavaScript実行環境）
- **被害例**: Cookie窃取、画面改ざん、キー入力の記録
- **対策**: 出力時のエスケープ、CSPヘッダー

### CSRF（Cross-Site Request Forgery）

- **攻撃内容**: 被害者の認証済みセッションを悪用して勝手に操作を実行
- **攻撃対象**: サーバー（API操作）
- **被害例**: データ削除、設定変更、不正な送金
- **対策**: CSRFトークン（GraphQL mutationのみ）、SameSite Cookie

## dangerouslySetInnerHTMLの使用箇所

`dangerouslySetInnerHTML`の使用箇所（安全な用途のみ）：

1. **JSON-LD構造化データ（SEO用）**
   - `/app/layout.tsx`: 組織情報、Webサイト情報
   - `/app/HomePageClient.tsx`: ソフトウェアスキーマ
   - `/app/guide/GuideClient.tsx`: ガイド記事スキーマ
   - `/app/(pages)/privacy-policy/PrivacyPolicyClient.tsx`: プライバシーポリシースキーマ
   - `/app/(pages)/terms-of-service/TermsOfServiceClient.tsx`: 利用規約スキーマ

2. **静的コンテンツ（固定テキスト）**
   - 利用規約、プライバシーポリシーの表示

**重要**: これら全てにユーザー入力は含まれていません。

## まとめ

Reactの自動エスケープ機能により：

1. **デフォルトで安全**: 特別な設定や追加コード不要
2. **包括的な保護**: 全ての特殊文字を適切にエスケープ
3. **コンテキスト認識**: 属性値と要素内容で適切に処理
4. **開発者にやさしい**: XSSを意識せずに安全なアプリケーションが作れる
5. **パフォーマンス**: ブラウザネイティブの文字参照を使用し高速

このプロジェクトでは、Reactの自動エスケープに加えて、以下の多層防御を実装しています：

1. **CSPヘッダー**: nonceベースのスクリプト制御
2. **HttpOnly Cookie**: JavaScriptからアクセス不可な認証トークン
3. **CSRF保護**: GraphQL mutationのみに適用されるトークン検証
4. **入力検証**: Formik/Yup（クライアント）とclass-validator（サーバー）
5. **サニタイゼーション**: DOMPurifyを使用した入力値の無害化

これにより、エンタープライズレベルのセキュリティを実現しています。

## 注意事項

### 開発者ツールでの編集について

開発者ツールで直接DOMを編集した場合は、Reactの保護の範囲外です：

- **Reactが防ぐもの**: サーバー/データベースからの悪意のある入力
- **Reactが防げないもの**: 開発者ツールでの直接編集、ブラウザ拡張機能

ただし、開発者ツールでの変更は自分のブラウザのみに影響し、他のユーザーには影響しません。