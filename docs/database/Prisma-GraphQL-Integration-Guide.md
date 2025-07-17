# Prisma と GraphQL の統合ガイド - Setlist Studio

このガイドでは、Setlist StudioにおけるPrismaとGraphQLの統合方法を詳しく解説します。

## 📚 関連ドキュメント

- **[GraphQL初心者ガイド](../api/graphql/GraphQL-Beginner-Guide.md)** - GraphQLの基本概念
- **[GraphQLアーキテクチャガイド](../api/graphql/GraphQL-Architecture-Guide.md)** - アーキテクチャの全体像と処理フロー
- **[Prisma最適化ガイド](./PRISMA_OPTIMIZATION_GUIDE.md)** - パフォーマンス最適化

**💡 このガイドの位置づけ**: アーキテクチャガイドで学んだ全体像を基に、PrismaとGraphQLの具体的な統合方法を詳しく解説します。

## 🔗 PrismaとGraphQLの関係性

### 基本的な役割分担

```
データベース ← Prisma Client → GraphQL Resolver → GraphQL Schema → フロントエンド
     ↑              ↑              ↑              ↑              ↑
  PostgreSQL      ORM          実際の処理      API定義      React/Apollo
```

### 具体的な連携フロー

1. **Prismaスキーマ** → データベーステーブル構造定義
2. **GraphQLスキーマ** → API エンドポイント定義
3. **Resolver** → Prisma Client を使用してデータベースアクセス
4. **Type-GraphQL** → TypeScriptの型とGraphQLスキーマの自動同期

---

## 🏗️ スキーマ設計の対応関係

### Prismaスキーマ（データベース設計）

```prisma
model Setlist {
  id        String   @id @default(cuid())
  title     String
  bandName  String?
  isPublic  Boolean  @default(false)
  userId    String
  createdAt DateTime @default(now())
  
  // リレーション
  user      User           @relation(fields: [userId], references: [id])
  items     SetlistItem[]
  
  @@map("setlists")
}

model SetlistItem {
  id        String @id @default(cuid())
  title     String
  note      String?
  order     Int
  setlistId String
  
  // リレーション
  setlist   Setlist @relation(fields: [setlistId], references: [id])
  
  @@map("setlist_items")
}
```

### GraphQLスキーマ（API設計）

```typescript
@ObjectType()
export class Setlist {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  bandName?: string;

  @Field(() => Boolean)
  isPublic!: boolean;

  @Field(() => Date)
  createdAt!: Date;

  // リレーションは@FieldResolverで解決
  // items?: SetlistItem[] (循環依存回避のため型定義では除外)
}

@ObjectType()
export class SetlistItem {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  note?: string;

  @Field(() => Int)
  order!: number;
}
```

### 対応関係の説明

| Prisma | GraphQL | 役割 |
|--------|---------|------|
| `model Setlist` | `@ObjectType() class Setlist` | データ構造定義 |
| `String @id` | `@Field(() => ID)` | 主キーフィールド |
| `String?` | `@Field(() => String, { nullable: true })` | オプショナルフィールド |
| `SetlistItem[]` | `@FieldResolver(() => [SetlistItem])` | リレーション解決 |
| `@@map("setlists")` | なし | テーブル名マッピング |

---

## 🔄 データ取得パターン

### 1. 基本的なCRUD操作

#### 単一データ取得

```typescript
@Resolver(() => Setlist)
export class SetlistResolver {
  @Query(() => Setlist, { nullable: true })
  async setlist(@Arg('id', () => ID) id: string, @Ctx() ctx: Context) {
    // Prisma Client使用
    const setlist = await ctx.prisma.setlist.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { order: 'asc' }
        }
      }
    });
    
    return setlist as Setlist;
  }
}
```

#### 複数データ取得

```typescript
@Query(() => [Setlist])
async setlists(@Ctx() ctx: Context) {
  return ctx.prisma.setlist.findMany({
    where: { userId: ctx.userId },
    include: {
      items: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          note: true,
          order: true,
          setlistId: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  }) as Promise<Setlist[]>;
}
```

### 2. データ作成パターン

```typescript
@Mutation(() => Setlist)
async createSetlist(
  @Arg('input', () => CreateSetlistInput) input: CreateSetlistInput,
  @Ctx() ctx: Context
) {
  const { items, ...setlistData } = input;

  // ネストした作成（Prismaの強力な機能）
  const setlist = await ctx.prisma.setlist.create({
    data: {
      ...setlistData,
      userId: ctx.userId!,
      items: items ? {
        create: items.map((item) => ({
          title: item.title,
          note: item.note,
          order: item.order,
        }))
      } : undefined
    },
    include: {
      items: {
        orderBy: { order: 'asc' }
      }
    }
  });

  return setlist as Setlist;
}
```

### 3. データ更新パターン

```typescript
@Mutation(() => Setlist)
async updateSetlist(
  @Arg('id', () => ID) id: string,
  @Arg('input', () => UpdateSetlistInput) input: UpdateSetlistInput,
  @Ctx() ctx: Context
) {
  const { items, ...setlistData } = input;

  // 関連データの置き換え
  const updatedSetlist = await ctx.prisma.setlist.update({
    where: { id },
    data: {
      ...setlistData,
      items: items ? {
        deleteMany: {}, // 既存アイテムを削除
        create: items.map((item) => ({
          title: item.title,
          note: item.note,
          order: item.order,
        }))
      } : undefined
    },
    include: {
      items: {
        orderBy: { order: 'asc' }
      }
    }
  });

  return updatedSetlist as Setlist;
}
```

---

## 🎯 リレーション処理の最適化

### 1. N+1問題の回避

#### 問題のあるパターン

```typescript
// 悪い例：N+1問題が発生
@FieldResolver(() => [SetlistItem])
async items(@Root() setlist: Setlist, @Ctx() ctx: Context) {
  // 各セットリストごとに個別クエリ実行
  return ctx.prisma.setlistItem.findMany({
    where: { setlistId: setlist.id },
    orderBy: { order: 'asc' }
  });
}
```

#### 最適化されたパターン

```typescript
// 良い例：事前ロード戦略
@Query(() => [Setlist])
async setlists(@Ctx() ctx: Context) {
  return ctx.prisma.setlist.findMany({
    include: { 
      items: { orderBy: { order: 'asc' } } // 事前ロード
    }
  });
}

@FieldResolver(() => [SetlistItem])
async items(@Root() setlist: Setlist) {
  const setlistWithItems = setlist as Setlist & { items?: SetlistItem[] };
  return setlistWithItems.items || []; // 追加クエリなし
}
```

### 2. 選択的フィールド取得

```typescript
// 必要なフィールドのみ取得
@Query(() => [Setlist])
async setlists(@Ctx() ctx: Context) {
  return ctx.prisma.setlist.findMany({
    select: {
      id: true,
      title: true,
      bandName: true,
      createdAt: true,
      items: {
        select: {
          id: true,
          title: true,
          order: true,
          // noteは除外（不要な場合）
        },
        orderBy: { order: 'asc' }
      }
    }
  });
}
```

### 3. 条件付きインクルード

```typescript
@Query(() => Setlist, { nullable: true })
async setlist(
  @Arg('id', () => ID) id: string,
  @Arg('includeItems', () => Boolean, { defaultValue: true }) includeItems: boolean,
  @Ctx() ctx: Context
) {
  return ctx.prisma.setlist.findUnique({
    where: { id },
    include: includeItems ? {
      items: {
        orderBy: { order: 'asc' }
      }
    } : undefined
  });
}
```

---

## 🛠️ 高度な統合パターン

### 1. トランザクション処理

```typescript
@Mutation(() => Setlist)
async duplicateSetlist(
  @Arg('originalId', () => ID) originalId: string,
  @Arg('newTitle', () => String) newTitle: string,
  @Ctx() ctx: Context
) {
  // Prismaトランザクション
  const duplicatedSetlist = await ctx.prisma.$transaction(async (prisma) => {
    // 1. 元のセットリストを取得
    const original = await prisma.setlist.findUnique({
      where: { id: originalId },
      include: { items: true }
    });

    if (!original) {
      throw new Error('Original setlist not found');
    }

    // 2. 新しいセットリストを作成
    const newSetlist = await prisma.setlist.create({
      data: {
        title: newTitle,
        bandName: original.bandName,
        userId: ctx.userId!,
        items: {
          create: original.items.map((item) => ({
            title: item.title,
            note: item.note,
            order: item.order,
          }))
        }
      },
      include: {
        items: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return newSetlist;
  });

  return duplicatedSetlist as Setlist;
}
```

### 2. バッチ処理

```typescript
@Mutation(() => [Setlist])
async batchUpdateSetlists(
  @Arg('updates', () => [BatchUpdateInput]) updates: BatchUpdateInput[],
  @Ctx() ctx: Context
) {
  // 複数の更新を効率的に実行
  const updatePromises = updates.map((update) =>
    ctx.prisma.setlist.update({
      where: { id: update.id },
      data: { 
        title: update.title,
        bandName: update.bandName 
      }
    })
  );

  const updatedSetlists = await Promise.all(updatePromises);
  return updatedSetlists as Setlist[];
}
```

### 3. 集約クエリ

```typescript
@ObjectType()
class SetlistStats {
  @Field(() => Int)
  totalSetlists!: number;

  @Field(() => Int)
  totalItems!: number;

  @Field(() => Float)
  averageItemsPerSetlist!: number;
}

@Query(() => SetlistStats)
async setlistStats(@Ctx() ctx: Context) {
  const [totalSetlists, totalItems] = await Promise.all([
    ctx.prisma.setlist.count({
      where: { userId: ctx.userId }
    }),
    ctx.prisma.setlistItem.count({
      where: { 
        setlist: { userId: ctx.userId } 
      }
    })
  ]);

  return {
    totalSetlists,
    totalItems,
    averageItemsPerSetlist: totalSetlists > 0 ? totalItems / totalSetlists : 0
  };
}
```

---

## 🔍 デバッグとモニタリング

### 1. Prismaクエリログの活用

```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  log      = ["query", "info", "warn", "error"]
}
```

```typescript
// GraphQL Context
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' },
    { emit: 'stdout', level: 'error' },
  ],
});

// クエリログの監視
prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Duration: ' + e.duration + 'ms');
});
```

### 2. パフォーマンス監視

```typescript
@Query(() => [Setlist])
async setlists(@Ctx() ctx: Context) {
  const startTime = Date.now();
  
  const setlists = await ctx.prisma.setlist.findMany({
    include: { items: true }
  });
  
  const duration = Date.now() - startTime;
  console.log(`Setlists query took ${duration}ms`);
  
  return setlists;
}
```

---

## 🚨 よくある問題と解決策

### 1. 循環依存エラー

```typescript
// 問題：循環依存が発生
@ObjectType()
class Setlist {
  @Field(() => [SetlistItem])
  items!: SetlistItem[];
}

@ObjectType()
class SetlistItem {
  @Field(() => Setlist)
  setlist!: Setlist;
}
```

```typescript
// 解決策：@FieldResolverを使用
@ObjectType()
class Setlist {
  // items フィールドを型定義から除外
}

@ObjectType()
class SetlistItem {
  // setlist フィールドを型定義から除外
}

@Resolver(() => Setlist)
export class SetlistResolver {
  @FieldResolver(() => [SetlistItem])
  async items(@Root() setlist: Setlist) {
    return setlist.items || [];
  }
}
```

### 2. 型の不整合

```typescript
// 問題：PrismaとGraphQLの型が異なる
const setlist = await ctx.prisma.setlist.findUnique({
  where: { id },
  include: { items: true }
});
// setlist.items が存在するが、Setlist型には定義されていない

// 解決策：型アサーション
return setlist as Setlist & { items?: SetlistItem[] };
```

### 3. パフォーマンスの問題

```typescript
// 問題：不要なデータまで取得
const setlists = await ctx.prisma.setlist.findMany({
  include: { items: true } // 全フィールドを取得
});

// 解決策：selectによる最適化
const setlists = await ctx.prisma.setlist.findMany({
  select: {
    id: true,
    title: true,
    // 必要なフィールドのみ
    items: {
      select: {
        id: true,
        title: true,
        order: true
      }
    }
  }
});
```

---

## 🎯 ベストプラクティス

### 1. クエリ最適化

- **事前ロード**: `include`でリレーションを事前取得
- **選択的取得**: `select`で必要なフィールドのみ取得
- **インデックス活用**: Prismaスキーマで適切なインデックス設定

### 2. エラーハンドリング

```typescript
@Query(() => Setlist, { nullable: true })
async setlist(@Arg('id', () => ID) id: string, @Ctx() ctx: Context) {
  try {
    const setlist = await ctx.prisma.setlist.findUnique({
      where: { id },
      include: { items: true }
    });
    
    if (!setlist) {
      throw new Error('Setlist not found');
    }
    
    return setlist;
  } catch (error) {
    console.error('Error fetching setlist:', error);
    throw error;
  }
}
```

### 3. 型安全性の確保

```typescript
// Prisma型からGraphQL型への変換
type PrismaSetlistWithItems = Prisma.SetlistGetPayload<{
  include: { items: true }
}>;

function convertToGraphQLSetlist(prismaSetlist: PrismaSetlistWithItems): Setlist {
  return {
    id: prismaSetlist.id,
    title: prismaSetlist.title,
    bandName: prismaSetlist.bandName,
    // ... その他のフィールド
  } as Setlist;
}
```

---

## 🚀 まとめ

PrismaとGraphQLの統合により、以下のメリットが得られます：

### 🎯 **開発効率の向上**
- 型安全なデータベースアクセス
- 自動生成されるPrisma Client
- GraphQLスキーマとの一貫性

### 🚀 **パフォーマンス最適化**
- N+1問題の回避
- 効率的なクエリ実行
- 必要なデータのみの取得

### 🛡️ **保守性の向上**
- 明確な責任分担
- 型による実行時エラーの防止
- スキーマ変更の影響範囲の明確化

このガイドを参考に、効率的で保守性の高いPrisma+GraphQL統合を実現してください！

### 🔗 次のステップ

1. [GraphQL初心者ガイド](./GraphQL-Beginner-Guide.md)でGraphQLの基本を学習
2. [Prisma最適化ガイド](../../development/PRISMA_OPTIMIZATION_GUIDE.md)でパフォーマンスを向上
3. 実際のプロジェクトでパターンを適用

Happy Coding! 🎉