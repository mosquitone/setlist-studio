# GraphQL初心者ガイド - Setlist Studio

このガイドでは、GraphQLの基本概念を**レストラン**の比喩を使って、初心者にもわかりやすく解説します。

## 📚 関連ドキュメント

- **[GraphQLアーキテクチャガイド](./GraphQL-Architecture-Guide.md)** - アーキテクチャの全体像
- **[GraphQLライブラリガイド](./GraphQL-Libraries-Guide.md)** - 使用ライブラリの詳細解説

## 🍽️ GraphQL初心者向け：レストラン完全版

### なぜレストランなのか？

GraphQLの仕組みは、レストランの運営システムと非常に似ているからです！

### 従来のREST API = "ファミレス"

```
お客さん：「ハンバーガーください」→ ハンバーガー係へ
お客さん：「ポテトください」→ ポテト係へ  
お客さん：「ドリンクください」→ ドリンク係へ
```

**問題点**: 3回も注文する必要がある（3回のHTTPリクエスト）

### GraphQL = "高級レストラン"

```
お客さん：「ハンバーガーとポテトとドリンクください」
ウェイター：「承知しました」→ キッチンで全部用意 → 一度に提供
```

**メリット**: 1回の注文で全部入手（1回のGraphQLクエリ）

---

## 🎯 実際のコード例で見るレストラン

### 1. お客さん（React Component）の注文

```typescript
// 「セットリストとその中の曲一覧を一度に欲しい」
const GET_SETLIST_WITH_SONGS = gql`
  query GetSetlistWithSongs($id: String!) {
    setlist(id: $id) {
      id
      name
      venue
      songs {
        id
        title
        artist
        key
      }
    }
  }
`

const { data, loading } = useQuery(GET_SETLIST_WITH_SONGS, {
  variables: { id: "setlist123" }
})
```

### 2. ウェイター（Apollo Client）の仕事

```typescript
// 注文を整理して、セキュリティトークンを付けて送信
POST /api/graphql
{
  "query": "query GetSetlistWithSongs($id: String!) { ... }",
  "variables": { "id": "setlist123" }
}
```

### 3. キッチン（API Route）の処理

```typescript
// 注文を受け取って、セキュリティチェック後、適切なシェフに依頼
export async function POST(request: NextRequest) {
  // 「この人、本当にお客さん？」
  const security = await securityCheck(request)
  
  // 「シェフさん、この注文お願いします」
  return apolloServer.handle(request)
}
```

### 4. シェフ（Resolver）の実際の調理

```typescript
@Resolver(Setlist)
export class SetlistResolver {
  // 「セットリスト情報を取ってきます」
  @Query(() => Setlist)
  async setlist(@Arg("id") id: string): Promise<Setlist> {
    return prisma.setlist.findUnique({
      where: { id },
      include: { 
        songs: true // 「曲も一緒に取ってきます」
      }
    })
  }
}
```

### 5. 完成した料理の提供

```json
{
  "data": {
    "setlist": {
      "id": "setlist123",
      "name": "夏フェス用",
      "venue": "渋谷ライブハウス",
      "songs": [
        { "id": "song1", "title": "青春", "artist": "バンドA", "key": "C" },
        { "id": "song2", "title": "情熱", "artist": "バンドB", "key": "G" }
      ]
    }
  }
}
```

---

## 🌟 GraphQLの魅力ポイント

### 🎯 **過不足のない注文**

```typescript
// 欲しい情報だけを指定
query {
  setlist(id: "123") {
    name        // ← 名前だけ欲しい
    venue       // ← 会場だけ欲しい
    # id は不要なので指定しない
  }
}
```

### 🚀 **1回で全部取得**

```typescript
// 関連データもまとめて取得
query {
  user(id: "user123") {
    name
    setlists {
      name
      songs {
        title
      }
    }
  }
}
```

### 🔧 **型安全性**

```typescript
// TypeScriptで型が自動生成される
const { data } = useQuery<GetSetlistQuery>(GET_SETLIST)
// data.setlist.name ← 型チェックされる
```

---

## 🆚 REST API vs GraphQL 比較

### REST API の場合

```typescript
// 3回のリクエストが必要
const user = await fetch('/api/users/123')
const setlists = await fetch('/api/users/123/setlists')
const songs = await fetch('/api/setlists/456/songs')

// 不要なデータも取得してしまう
const user = {
  id: "123",
  name: "山田太郎",
  email: "yamada@example.com",
  createdAt: "2023-01-01", // 不要
  updatedAt: "2023-12-01", // 不要
  profile: { ... },        // 不要
  settings: { ... }        // 不要
}
```

### GraphQL の場合

```typescript
// 1回のリクエストで全て取得
const { data } = useQuery(gql`
  query GetUserSetlists($userId: ID!) {
    user(id: $userId) {
      name              # 必要なデータのみ
      setlists {
        name
        songs {
          title
        }
      }
    }
  }
`)
```

---

## 🏗️ GraphQLの基本構成要素

### 1. **Query（クエリ）** - データの読み取り

```typescript
// 「セットリスト一覧を見せて」
query GetSetlists {
  setlists {
    id
    name
    createdAt
  }
}
```

### 2. **Mutation（ミューテーション）** - データの変更

```typescript
// 「新しいセットリストを作って」
mutation CreateSetlist($input: CreateSetlistInput!) {
  createSetlist(input: $input) {
    id
    name
    createdAt
  }
}
```

### 3. **Subscription（サブスクリプション）** - リアルタイム更新

```typescript
// 「セットリストが更新されたら教えて」
subscription OnSetlistUpdated {
  setlistUpdated {
    id
    name
    updatedAt
  }
}
```

---

## 🛠️ GraphQLの実践的な使い方

### データ取得の基本パターン

```typescript
// 基本的な取得
const { data, loading, error } = useQuery(GET_SETLISTS)

// 変数を使った取得
const { data } = useQuery(GET_SETLIST, {
  variables: { id: "setlist123" }
})

// 条件付き実行
const { data } = useQuery(GET_SETLIST, {
  variables: { id },
  skip: !id // idがない場合は実行しない
})
```

### データ更新の基本パターン

```typescript
// 基本的な更新
const [createSetlist, { loading, error }] = useMutation(CREATE_SETLIST)

// 実行
const handleSubmit = async (input) => {
  const { data } = await createSetlist({
    variables: { input }
  })
}

// 更新後の再取得
const [updateSetlist] = useMutation(UPDATE_SETLIST, {
  refetchQueries: [{ query: GET_SETLISTS }]
})
```

---

## 🎨 GraphQLクエリの書き方

### 基本的な構文

```graphql
query QueryName($variable: Type!) {
  fieldName(argument: $variable) {
    subField1
    subField2
    nestedObject {
      nestedField
    }
  }
}
```

### 実際の例

```graphql
query GetSetlistWithSongs($id: ID!) {
  setlist(id: $id) {
    # 基本情報
    id
    name
    venue
    eventDate
    
    # 関連データ
    songs {
      id
      title
      artist
      key
    }
    
    # 作成者情報
    user {
      id
      username
    }
  }
}
```

### エイリアス（別名）の使用

```graphql
query GetMultipleSetlists {
  recentSetlist: setlist(id: "recent123") {
    name
    createdAt
  }
  
  favoriteSetlist: setlist(id: "favorite456") {
    name
    createdAt
  }
}
```

---

## 🔍 GraphQLの便利な機能

### 1. **フラグメント** - 共通フィールドの再利用

```graphql
fragment SetlistInfo on Setlist {
  id
  name
  venue
  eventDate
}

query GetSetlists {
  setlists {
    ...SetlistInfo
    songsCount
  }
}

query GetSetlist($id: ID!) {
  setlist(id: $id) {
    ...SetlistInfo
    songs {
      title
      artist
    }
  }
}
```

### 2. **ディレクティブ** - 条件付きフィールド

```graphql
query GetSetlist($id: ID!, $includeSongs: Boolean!) {
  setlist(id: $id) {
    id
    name
    songs @include(if: $includeSongs) {
      title
      artist
    }
  }
}
```

### 3. **インライン フラグメント** - 型による条件分岐

```graphql
query GetItems {
  items {
    ... on Song {
      title
      artist
    }
    ... on Setlist {
      name
      venue
    }
  }
}
```

---

## 🚨 GraphQLでよくある間違いと解決策

### 1. **N+1問題**

```typescript
// 問題のあるResolver
@Resolver(Setlist)
export class SetlistResolver {
  @FieldResolver(() => [Song])
  async songs(@Root() setlist: Setlist) {
    // 各セットリストごとに個別にクエリ実行（N+1問題）
    return prisma.song.findMany({
      where: { setlistId: setlist.id }
    })
  }
}

// 解決策：DataLoader使用
@Resolver(Setlist)
export class SetlistResolver {
  @FieldResolver(() => [Song])
  async songs(@Root() setlist: Setlist, @Ctx() { loaders }) {
    // バッチ処理で効率的に取得
    return loaders.songsBySetlistId.load(setlist.id)
  }
}
```

### 2. **過度に深いクエリ**

```typescript
// 危険なクエリ
query DangerousQuery {
  user {
    setlists {
      songs {
        setlist {
          songs {
            setlist {
              // 無限ループの可能性
            }
          }
        }
      }
    }
  }
}

// 解決策：深度制限
const server = new ApolloServer({
  validationRules: [depthLimit(5)] // 深度5まで制限
})
```

---

## 🎯 GraphQL学習のロードマップ

### 初級編（基礎理解）
1. ✅ GraphQLとは何か
2. ✅ REST APIとの違い
3. ✅ Query, Mutation, Subscriptionの基本
4. ✅ GraphQLクエリの書き方

### 中級編（実践応用）
1. 🔄 Apollo Clientの使い方
2. 🔄 キャッシュ戦略
3. 🔄 エラーハンドリング
4. 🔄 フラグメントとディレクティブ

### 上級編（パフォーマンス最適化）
1. 🔄 DataLoaderによるN+1問題解決
2. 🔄 クエリ最適化
3. 🔄 セキュリティ対策
4. 🔄 スキーマ設計のベストプラクティス

---

## 🎬 まとめ

GraphQLは最初は複雑に感じるかもしれませんが、**レストラン**の比喩で考えると：

- **お客さん（React）**: 欲しい料理を注文
- **ウェイター（Apollo Client）**: 注文を運び、料理を配膳
- **キッチン（API Route）**: 注文を受け取り、適切なシェフに依頼
- **シェフ（Resolver）**: 実際に料理を作る

この役割分担により、効率的で型安全な開発が可能になります。

### 🚀 次のステップ

1. [GraphQLアーキテクチャガイド](./GraphQL-Architecture-Guide.md)でアーキテクチャの全体像を学習
2. [GraphQLライブラリガイド](./GraphQL-Libraries-Guide.md)で使用ライブラリの詳細を確認
3. 実際のコードを書いて練習

GraphQLをマスターして、現代的なWebアプリケーション開発を楽しみましょう！