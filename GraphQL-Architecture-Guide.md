# 3つのファイルの関係性を超わかりやすく解説！

この3つのファイルは**GraphQLの送受信**を支える重要な構成要素です。**レストラン**に例えて説明します！

## 🏢 全体の仕組み（レストラン例）

```
お客さん → ウェイター → キッチン → シェフ → データベース
(React)   (Apollo)    (API Route)  (Resolver)  (PostgreSQL)
```

---

## 📋 各ファイルの役割

### 1️⃣ **ApolloProvider.tsx** = "ウェイターサービスの提供"
```typescript
// レストランで「ウェイターサービス」を利用可能にする
export default function ApolloProviderWrapper({ children }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
```

**役割**: React全体でGraphQLを使えるようにする仕組み

### 2️⃣ **apollo-client.ts** = "ウェイター（注文取り・配膳係）"
```typescript
// ウェイターの設定
const httpLink = createHttpLink({
  uri: '/api/graphql', // キッチンの場所を教える
  credentials: 'include', // 会員証を持参
})

// 注文時の認証・セキュリティチェック
const authLink = setContext(async (_, { headers }) => {
  const csrfToken = await getCSRFToken() // セキュリティトークン取得
  return {
    headers: {
      ...headers,
      'x-csrf-token': csrfToken || '',
    }
  }
})

// ウェイターを配置
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(), // 注文履歴を記憶
})
```

**役割**: 
- 注文（GraphQLクエリ）をキッチン（API Route）に届ける
- 料理（データ）をお客さん（React Component）に届ける
- 認証・セキュリティチェック

### 3️⃣ **route.ts** = "キッチン（料理を作る場所）"
```typescript
// キッチンの設備とシェフ
const server = new ApolloServer({
  schema: graphqlSchema, // レシピ本
  resolvers: [SetlistResolver, SongResolver, AuthResolver], // シェフたち
})

// 注文を受け取る窓口
export async function POST(request: NextRequest) {
  // セキュリティチェック
  const rateLimitResponse = await rateLimitFunction(request)
  const csrfResponse = await csrfProtection(request, prisma)
  
  // 注文をシェフに渡す
  const handler = startServerAndCreateNextHandler(server, {
    context: async (req) => createSecureContext(req),
  })
  return handler(request)
}
```

**役割**: 
- 注文（GraphQLクエリ）を受け取る
- 適切なシェフ（Resolver）に調理を依頼
- 料理（データ）を完成させてウェイターに渡す

### 4️⃣ **Resolver** = "専門シェフ（実際に料理を作る人）"
```typescript
// SetlistResolver.ts = セットリスト専門シェフ
@Resolver(Setlist)
export class SetlistResolver {
  @Query(() => [Setlist])
  async setlists(@Ctx() { user }): Promise<Setlist[]> {
    // データベースから材料（データ）を取得
    return prisma.setlist.findMany({
      where: { userId: user.id }
    })
  }
  
  @Mutation(() => Setlist)
  async createSetlist(@Arg("input") input: CreateSetlistInput): Promise<Setlist> {
    // 新しいセットリストを作成
    return prisma.setlist.create({
      data: { ...input }
    })
  }
}
```

**役割**: 
- 専門分野の料理（データ操作）を担当
- データベースから材料（データ）を取得・調理
- Query（読み取り）とMutation（変更）を実行
- 各エンティティ（User, Song, Setlist等）ごとに専門シェフが存在

---

## 🔄 実際の処理フロー

### 例：「セットリスト一覧を取得」の場合

#### 1️⃣ **お客さん（React Component）が注文**
```typescript
// components/SetlistsPage.tsx
const { data, loading } = useQuery(GET_SETLISTS)
//                              ↑ 「セットリスト一覧ください！」
```

#### 2️⃣ **ウェイター（Apollo Client）が注文を運ぶ**
```typescript
// apollo-client.ts内で自動実行
POST /api/graphql
Content-Type: application/json
x-csrf-token: abc123...

{
  "query": "query GetSetlists { setlists { id name } }"
}
```

#### 3️⃣ **キッチン（API Route）が注文を受け取る**
```typescript
// route.ts:98-122
export async function POST(request: NextRequest) {
  // セキュリティチェック「この人大丈夫？」
  const rateLimitResponse = await rateLimitFunction(request)
  const csrfResponse = await csrfProtection(request, prisma)
  
  // Apollo Serverに「この注文お願いします」
  const handler = startServerAndCreateNextHandler(server)
  return handler(request)
}
```

#### 4️⃣ **シェフ（Resolver）が料理を作る**
```typescript
// SetlistResolver.ts
@Query(() => [Setlist])
async setlists(@Ctx() { user }): Promise<Setlist[]> {
  // データベースから材料を取得
  return prisma.setlist.findMany({
    where: { userId: user.id }
  })
}
```

#### 5️⃣ **料理完成 → ウェイター → お客さん**
```json
// 完成した料理（JSONレスポンス）
{
  "data": {
    "setlists": [
      { "id": "1", "name": "夏フェス用セットリスト" },
      { "id": "2", "name": "ライブハウス用" }
    ]
  }
}
```

#### 6️⃣ **お客さん（React）が料理を受け取る**
```typescript
// loading が false になり、data に結果が入る
const { data, loading } = useQuery(GET_SETLISTS)

return (
  <div>
    {data?.setlists.map(setlist => (
      <div key={setlist.id}>{setlist.name}</div>
    ))}
  </div>
)
```

---

## 🔗 ファイル間の依存関係

```
React App
├── ApolloProvider.tsx
│   ├── imports: apollo-client.ts
│   └── wraps: React Components
├── apollo-client.ts  
│   ├── configures: httpLink → '/api/graphql'
│   └── handles: authentication & CSRF
└── Components use GraphQL
    └── send requests to: /api/graphql
                           ↓
                    route.ts handles requests
                    ├── applies: security checks
                    ├── delegates: to Apollo Server
                    └── executes: GraphQL Resolvers
```

## 🎯 まとめ

- **ApolloProvider.tsx**: 「GraphQLサービスを使えるようにする設定」
- **apollo-client.ts**: 「GraphQLの送受信を担当するウェイター」  
- **route.ts**: 「GraphQLクエリを実際に処理するキッチン」
- **Resolver**: 「実際にデータ操作を行う専門シェフ」

この4つが連携することで、ReactからGraphQLを使ったデータの送受信が可能になります！

---

## 🔧 技術的な詳細

### Apollo Clientの設定詳細

```typescript
// apollo-client.ts
const httpLink = createHttpLink({
  uri: '/api/graphql', // Next.js API Routeエンドポイント
  credentials: 'include', // HttpOnly Cookieを含める
})

const authLink = setContext(async (_, { headers }) => {
  // CSRF トークンを取得
  let csrfToken = getCSRFTokenFromCookie()
  if (!csrfToken) {
    csrfToken = await getCSRFToken()
  }

  return {
    headers: {
      ...headers,
      'x-csrf-token': csrfToken || '',
    }
  }
})
```

### API Routeの処理詳細

```typescript
// route.ts
export async function POST(request: NextRequest) {
  // 1. レート制限チェック
  const rateLimitResponse = await rateLimitFunction(request)
  if (rateLimitResponse) return rateLimitResponse

  // 2. CSRF保護
  const csrfResponse = await csrfProtection(request, prisma)
  if (csrfResponse) return csrfResponse

  // 3. Apollo Serverで処理
  const server = await getServerInstance()
  const handler = startServerAndCreateNextHandler(server, {
    context: async (req) => createSecureContext(req),
  })
  return handler(request)
}
```

### セキュリティ機能

- **HttpOnly Cookie**: XSS攻撃からの保護
- **CSRF Protection**: クロスサイトリクエストフォージェリ防止
- **Rate Limiting**: DDoS攻撃・ブルートフォース攻撃防止
- **Query Depth Limiting**: GraphQL DoS攻撃防止

---

## 🏗️ GraphQLアプリケーション設計フロー

### Phase 1: 要件分析とドメインモデリング
1. **機能要件の整理**
   - ユーザーが何をしたいか（認証、CRUD操作など）
   - データの関係性を把握

2. **エンティティ設計**
   - User, Song, Setlist, SetlistItemのような主要エンティティを特定
   - 関係性を定義（1:N, N:Nなど）

### Phase 2: データベース設計
1. **Prismaスキーマ設計** (`prisma/schema.prisma`)
   ```prisma
   model User {
     id       String @id @default(cuid())
     email    String @unique
     setlists Setlist[]
   }
   ```

2. **マイグレーション実行**
   ```bash
   pnpm db:push
   pnpm generate
   ```

### Phase 3: GraphQLスキーマ設計
1. **Type定義** (`src/lib/server/graphql/types/`)
   ```typescript
   @ObjectType()
   export class User {
     @Field()
     id: string;
     
     @Field()
     email: string;
   }
   ```

2. **Input型定義**
   ```typescript
   @InputType()
   export class CreateUserInput {
     @Field()
     email: string;
   }
   ```

### Phase 4: Resolver実装
1. **CRUD操作の実装** (`src/lib/server/graphql/resolvers/`)
   ```typescript
   @Resolver(User)
   export class UserResolver {
     @Query(() => [User])
     async users(): Promise<User[]> {
       return prisma.user.findMany();
     }
   }
   ```

### Phase 5: クライアント統合
1. **GraphQL Operations定義** (`src/lib/server/graphql/apollo-operations.ts`)
2. **Apollo Client設定** (`src/lib/client/apollo-client.ts`)
3. **React Components統合**

---

## 📖 GraphQL用語解説

### Resolver
**Resolver**は、GraphQLスキーマの各フィールドに対して「実際にデータをどう取得・操作するか」を定義する関数です。

#### Resolverの種類
- **Query Resolver**: データ読み取り（例: `users`, `setlists`）
- **Mutation Resolver**: データ変更（例: `createSetlist`, `updateSong`）
- **Field Resolver**: 関連データの遅延読み込み（例: `User.setlists`）

### Apollo Client
フロントエンド（React）からGraphQL APIを呼び出すためのクライアントライブラリ。主な機能：
- GraphQLクエリ実行
- キャッシュ管理
- 状態管理
- エラーハンドリング
- 認証ヘッダー自動付与

---

## 🍽️ GraphQL初心者向け：レストラン完全版

### なぜレストランなのか？
GraphQLの仕組みは、レストランの運営システムと非常に似ているからです！

#### 従来のREST API = "ファミレス"
```
お客さん：「ハンバーガーください」→ ハンバーガー係へ
お客さん：「ポテトください」→ ポテト係へ  
お客さん：「ドリンクください」→ ドリンク係へ
```
**問題点**: 3回も注文する必要がある（3回のHTTPリクエスト）

#### GraphQL = "高級レストラン"
```
お客さん：「ハンバーガーとポテトとドリンクください」
ウェイター：「承知しました」→ キッチンで全部用意 → 一度に提供
```
**メリット**: 1回の注文で全部入手（1回のGraphQLクエリ）

### 実際のコード例で見るレストラン

#### 1. お客さん（React Component）の注文
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

#### 2. ウェイター（Apollo Client）の仕事
```typescript
// 注文を整理して、セキュリティトークンを付けて送信
POST /api/graphql
{
  "query": "query GetSetlistWithSongs($id: String!) { ... }",
  "variables": { "id": "setlist123" }
}
```

#### 3. キッチン（API Route）の処理
```typescript
// 注文を受け取って、セキュリティチェック後、適切なシェフに依頼
export async function POST(request: NextRequest) {
  // 「この人、本当にお客さん？」
  const security = await securityCheck(request)
  
  // 「シェフさん、この注文お願いします」
  return apolloServer.handle(request)
}
```

#### 4. シェフ（Resolver）の実際の調理
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

#### 5. 完成した料理の提供
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

### GraphQLの魅力ポイント

#### 🎯 **過不足のない注文**
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

#### 🚀 **1回で全部取得**
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

#### 🔧 **型安全性**
```typescript
// TypeScriptで型が自動生成される
const { data } = useQuery<GetSetlistQuery>(GET_SETLIST)
// data.setlist.name ← 型チェックされる
```

---

## 🏗️ プロジェクト構造とファイルの関係

```
Setlist Studio アーキテクチャ
├── フロントエンド（React）
│   ├── ApolloProvider.tsx      ← GraphQL環境の準備
│   ├── apollo-client.ts        ← GraphQL通信設定
│   └── Components/             ← UI実装
│       ├── SetlistPage.tsx     ← セットリスト表示
│       └── CreateForm.tsx      ← セットリスト作成
├── バックエンド（Next.js API Routes）
│   ├── /api/graphql/route.ts   ← GraphQL APIエンドポイント
│   └── GraphQL実装/
│       ├── types/              ← データ型定義
│       │   ├── User.ts
│       │   ├── Setlist.ts
│       │   └── Song.ts
│       └── resolvers/          ← データ操作ロジック
│           ├── UserResolver.ts
│           ├── SetlistResolver.ts
│           └── SongResolver.ts
└── データベース（PostgreSQL + Prisma）
    └── prisma/schema.prisma    ← データベース設計
```

このように、各ファイルが明確な役割を持ち、GraphQLを中心とした現代的なWebアプリケーションの構成になっています！