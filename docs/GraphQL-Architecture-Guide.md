# GraphQLアーキテクチャ完全ガイド - Setlist Studio

この文書では、Setlist StudioのGraphQLアーキテクチャを**レストラン**に例えて、初心者にもわかりやすく解説します。

## 📚 関連ドキュメント

- **[GraphQLライブラリガイド](./GraphQL-Libraries-Guide.md)** - 使用ライブラリの詳細解説
- **[GraphQL初心者ガイド](./GraphQL-Beginner-Guide.md)** - GraphQL入門とレストラン比喩

## 🏢 全体の仕組み（レストラン例）

```
お客さん → ウェイター → キッチン → シェフ → 食材庫
(React)   (Apollo)    (Next.js API Route)  (Resolver)  (PostgreSQL)
```

このアプリケーションは**統一Next.jsアーキテクチャ**を採用し、Vercel Functions互換の設計になっています。

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
// /api/graphql/route.ts - Next.js API Route
import { buildSchema } from 'type-graphql'
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'

// Type-GraphQLでスキーマを構築（シェフたちを配置）
const graphqlSchema = await buildSchema({
  resolvers: [SetlistResolver, SongResolver, AuthResolver], // シェフたち
  dateScalarMode: 'isoDate',
})

// キッチンの設備（Apollo Server v4）
const server = new ApolloServer({
  schema: graphqlSchema, // シェフたちが入ったレシピ本
  introspection: process.env.NODE_ENV !== 'production',
  validationRules: [depthLimit(10)], // セキュリティ制限
  formatError: (err) => {
    // 本番環境でのエラーハンドリング
    if (process.env.NODE_ENV === 'production') {
      return { message: 'サーバーエラーが発生しました' }
    }
    return err
  }
})

// Next.js APIルートハンドラー（注文受付窓口）
const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => createSecureContext(req),
})

export async function POST(request: NextRequest) {
  // セキュリティチェック「この人大丈夫？」
  const rateLimitResponse = await rateLimitFunction(request)
  const csrfResponse = await csrfProtection(request, prisma)
  
  // 注文をシェフに渡す
  return handler(request)
}
```

**役割**: 
- Next.js API Routeとして動作（Vercel Functions互換）
- 注文（GraphQLクエリ）を受け取る
- Type-GraphQLでスキーマを構築
- Apollo Server v4でセキュリティ強化
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
- 食材庫から材料（データ）を取得・調理
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
  // 食材庫から材料を取得
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