# Prisma初心者ガイド - データベースの魔法使い

このガイドでは、Prismaとは何なのか、なぜ使うのか、どう使うのかを**魔法使い**の比喩を使って初心者にもわかりやすく解説します。

## 📚 関連ドキュメント

- **[Prisma最適化ガイド](./PRISMA_OPTIMIZATION_GUIDE.md)** - パフォーマンス最適化
- **[PrismaとGraphQLの統合ガイド](./Prisma-GraphQL-Integration-Guide.md)** - GraphQLとの連携
- **[GraphQL初心者ガイド](../api/graphql/GraphQL-Beginner-Guide.md)** - GraphQLの基本概念

## 🧙‍♂️ Prismaとは何なのか？

### 魔法使いの比喩で理解するPrisma

Prismaは、**データベースの魔法使い**のような存在です。

```text
あなた（開発者）: 「ユーザー情報を取得したい」
Prisma（魔法使い）: 「承知しました」→ 魔法の呪文を唱える → データベースから情報を取得
データベース（図書館）: 膨大な本（データ）が保管されている場所
```

### 従来の方法 vs Prisma

#### 従来の方法（生SQLを書く）
```sql
-- あなたが直接書く必要があった呪文
SELECT u.id, u.name, u.email, s.title, s.created_at
FROM users u
LEFT JOIN setlists s ON u.id = s.user_id
WHERE u.id = ?
ORDER BY s.created_at DESC;
```

#### Prisma を使った方法
```typescript
// Prismaが魔法で変換してくれる
const userWithSetlists = await prisma.user.findUnique({
  where: { id: userId },
  include: { 
    setlists: { 
      orderBy: { createdAt: 'desc' } 
    } 
  }
});
```

**Prismaは、人間が理解しやすい言葉をデータベースが理解できる言葉に翻訳してくれる魔法使い**です！

---

## 🎯 なぜPrismaを使うのか？

### 1. **型安全性** - 呪文の間違いを防ぐ

```typescript
// 従来：実行時まで間違いがわからない
const users = await db.query('SELECT * FROM usres'); // typo!

// Prisma：TypeScriptが即座に間違いを指摘
const users = await prisma.user.findMany(); // 型チェック済み
```

### 2. **自動補完** - 魔法の呪文を覚える必要がない

```typescript
// IDEで自動補完される
const user = await prisma.user.
//                          ↑ ここで候補が表示される
//                          findUnique, findMany, create, update, delete...
```

### 3. **マイグレーション** - データベースの構造変更を管理

```bash
# スキーマを変更したら
npx prisma migrate dev --name "add_user_profile"
# → 自動でデータベースを更新
```

### 4. **関連データの簡単取得** - 複雑な呪文を簡単に

```typescript
// 関連データを簡単に取得
const setlistWithSongs = await prisma.setlist.findUnique({
  where: { id: setlistId },
  include: {
    items: true,  // セットリストの楽曲も一緒に取得
    user: true    // 作成者情報も一緒に取得
  }
});
```

---

## 🏗️ Prismaの基本構成要素

### 1. **Prismaスキーマ** - 設計図

```prisma
// prisma/schema.prisma - データベースの設計図
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  createdAt DateTime @default(now())
  
  // リレーション
  setlists  Setlist[]
  
  @@map("users")
}
```

### 2. **Prisma Client** - 魔法使い本体

```typescript
// src/lib/prisma.ts - 魔法使いを召喚
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;
```

### 3. **マイグレーション** - 変更履歴

```bash
# 新しい変更を適用
npx prisma migrate dev --name "add_user_profile"

# 変更履歴を確認
ls prisma/migrations/
```

---

## 🎨 実際の使い方

### 1. **データの作成（CREATE）**

```typescript
// 新しいユーザーを作成
const newUser = await prisma.user.create({
  data: {
    email: 'user@example.com',
    username: 'musicfan',
    setlists: {
      create: [
        {
          title: '夏フェス用',
          bandName: 'Rock Band',
          items: {
            create: [
              { title: '青春', order: 1 },
              { title: '情熱', order: 2 }
            ]
          }
        }
      ]
    }
  },
  include: {
    setlists: {
      include: {
        items: true
      }
    }
  }
});
```

### 2. **データの取得（READ）**

```typescript
// 全ユーザーを取得
const allUsers = await prisma.user.findMany();

// 特定のユーザーを取得
const user = await prisma.user.findUnique({
  where: { id: 'user123' }
});

// 条件を指定して取得
const activeUsers = await prisma.user.findMany({
  where: {
    createdAt: {
      gte: new Date('2024-01-01')
    }
  },
  orderBy: {
    createdAt: 'desc'
  },
  take: 10  // 最新10件
});
```

### 3. **データの更新（UPDATE）**

```typescript
// 単一データの更新
const updatedUser = await prisma.user.update({
  where: { id: 'user123' },
  data: {
    email: 'newemail@example.com'
  }
});

// 複数データの更新
const updatedUsers = await prisma.user.updateMany({
  where: {
    createdAt: {
      lt: new Date('2023-01-01')
    }
  },
  data: {
    isActive: false
  }
});
```

### 4. **データの削除（DELETE）**

```typescript
// 単一データの削除
const deletedUser = await prisma.user.delete({
  where: { id: 'user123' }
});

// 複数データの削除
const deletedUsers = await prisma.user.deleteMany({
  where: {
    isActive: false
  }
});
```

---

## 🔗 リレーション（関連データ）の処理

### 1. **1対多のリレーション**

```prisma
// 1人のユーザーは複数のセットリストを持つ
model User {
  id       String    @id @default(cuid())
  setlists Setlist[] // 1対多
}

model Setlist {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id])
}
```

```typescript
// 関連データを含めて取得
const userWithSetlists = await prisma.user.findUnique({
  where: { id: 'user123' },
  include: {
    setlists: true  // セットリストも一緒に取得
  }
});
```

### 2. **多対多のリレーション**

```prisma
// セットリストと楽曲の多対多（中間テーブル）
model Setlist {
  id    String        @id @default(cuid())
  items SetlistItem[]
}

model Song {
  id            String        @id @default(cuid())
  setlistItems  SetlistItem[]
}

model SetlistItem {
  id        String  @id @default(cuid())
  setlistId String
  songId    String
  order     Int
  
  setlist   Setlist @relation(fields: [setlistId], references: [id])
  song      Song    @relation(fields: [songId], references: [id])
}
```

### 3. **ネストした操作**

```typescript
// セットリストを作成しながら楽曲も同時に作成
const setlistWithSongs = await prisma.setlist.create({
  data: {
    title: '新しいセットリスト',
    user: {
      connect: { id: 'user123' }  // 既存ユーザーに関連付け
    },
    items: {
      create: [
        {
          order: 1,
          song: {
            create: {  // 新しい楽曲を作成
              title: '新曲',
              artist: 'アーティスト名'
            }
          }
        }
      ]
    }
  },
  include: {
    items: {
      include: {
        song: true
      }
    }
  }
});
```

---

## 🚀 高度な機能

### 1. **トランザクション** - 全部成功か全部失敗

```typescript
// 複数の操作を一つのトランザクションで実行
const result = await prisma.$transaction(async (prisma) => {
  // 1. ユーザーを作成
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      username: 'newuser'
    }
  });

  // 2. セットリストを作成
  const setlist = await prisma.setlist.create({
    data: {
      title: '初回セットリスト',
      userId: user.id
    }
  });

  return { user, setlist };
});
```

### 2. **集約クエリ** - データの統計

```typescript
// 統計情報を取得
const stats = await prisma.setlist.aggregate({
  _count: {
    id: true
  },
  _avg: {
    itemsCount: true
  },
  where: {
    userId: 'user123'
  }
});

// グループ化
const setlistsByBand = await prisma.setlist.groupBy({
  by: ['bandName'],
  _count: {
    id: true
  },
  orderBy: {
    _count: {
      id: 'desc'
    }
  }
});
```

### 3. **生SQLクエリ** - 直接データベースにアクセス

```typescript
// 複雑なクエリは生SQLでも実行可能
const result = await prisma.$queryRaw`
  SELECT 
    u.username,
    COUNT(s.id) as setlist_count
  FROM users u
  LEFT JOIN setlists s ON u.id = s.user_id
  GROUP BY u.id, u.username
  ORDER BY setlist_count DESC
`;
```

---

## 🛠️ 開発ワークフロー

### 1. **スキーマの設計**

```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  createdAt DateTime @default(now())
  
  setlists  Setlist[]
  
  @@map("users")
}
```

### 2. **マイグレーションの実行**

```bash
# 開発環境でのマイグレーション
npx prisma migrate dev --name "add_user_table"

# 本番環境でのマイグレーション
npx prisma migrate deploy
```

### 3. **Prisma Clientの生成**

```bash
# スキーマからクライアントを生成
npx prisma generate
```

### 4. **データベースの確認**

```bash
# Prisma Studioでデータを確認
npx prisma studio
```

---

## 🎯 実践的な例：セットリストアプリ

### スキーマ設計

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  createdAt DateTime @default(now())
  
  setlists  Setlist[]
  songs     Song[]
  
  @@map("users")
}

model Setlist {
  id        String   @id @default(cuid())
  title     String
  bandName  String?
  eventDate DateTime?
  isPublic  Boolean  @default(false)
  createdAt DateTime @default(now())
  userId    String
  
  user      User           @relation(fields: [userId], references: [id])
  items     SetlistItem[]
  
  @@map("setlists")
}

model Song {
  id       String @id @default(cuid())
  title    String
  artist   String
  key      String?
  tempo    Int?
  duration Int?
  notes    String?
  userId   String
  
  user         User          @relation(fields: [userId], references: [id])
  setlistItems SetlistItem[]
  
  @@map("songs")
}

model SetlistItem {
  id        String  @id @default(cuid())
  order     Int
  note      String?
  setlistId String
  songId    String?
  title     String  // 楽曲が未登録の場合のタイトル
  
  setlist   Setlist @relation(fields: [setlistId], references: [id])
  song      Song?   @relation(fields: [songId], references: [id])
  
  @@map("setlist_items")
}
```

### 実際の使用例

```typescript
// セットリストアプリの典型的な操作
export class SetlistService {
  
  // セットリスト一覧取得
  async getUserSetlists(userId: string) {
    return prisma.setlist.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            song: true
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // セットリスト作成
  async createSetlist(userId: string, data: CreateSetlistData) {
    return prisma.setlist.create({
      data: {
        title: data.title,
        bandName: data.bandName,
        userId,
        items: {
          create: data.items.map((item, index) => ({
            order: index + 1,
            title: item.title,
            note: item.note,
            songId: item.songId
          }))
        }
      },
      include: {
        items: {
          include: {
            song: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  // セットリスト複製
  async duplicateSetlist(originalId: string, newTitle: string) {
    return prisma.$transaction(async (prisma) => {
      const original = await prisma.setlist.findUnique({
        where: { id: originalId },
        include: { items: true }
      });

      if (!original) {
        throw new Error('Original setlist not found');
      }

      return prisma.setlist.create({
        data: {
          title: newTitle,
          bandName: original.bandName,
          userId: original.userId,
          items: {
            create: original.items.map((item) => ({
              order: item.order,
              title: item.title,
              note: item.note,
              songId: item.songId
            }))
          }
        },
        include: {
          items: {
            include: {
              song: true
            },
            orderBy: { order: 'asc' }
          }
        }
      });
    });
  }

  // 楽曲の自動登録
  async ensureSongExists(userId: string, title: string, artist: string) {
    const existingSong = await prisma.song.findFirst({
      where: {
        userId,
        title,
        artist
      }
    });

    if (existingSong) {
      return existingSong;
    }

    return prisma.song.create({
      data: {
        title,
        artist,
        userId
      }
    });
  }
}
```

---

## 🚨 よくある間違いと解決策

### 1. **N+1問題**

```typescript
// 悪い例：N+1問題が発生
const setlists = await prisma.setlist.findMany();
for (const setlist of setlists) {
  const items = await prisma.setlistItem.findMany({
    where: { setlistId: setlist.id }
  });
  // 各セットリストごとに個別クエリ実行
}

// 良い例：includeで一括取得
const setlistsWithItems = await prisma.setlist.findMany({
  include: {
    items: true
  }
});
```

### 2. **型の誤用**

```typescript
// 悪い例：型チェックを無視
const user = await prisma.user.findUnique({
  where: { id: 'user123' }
});
console.log(user.email); // userがnullの可能性

// 良い例：適切な型チェック
const user = await prisma.user.findUnique({
  where: { id: 'user123' }
});
if (user) {
  console.log(user.email); // 安全
}
```

### 3. **接続リークの問題**

```typescript
// 悪い例：接続を閉じない
export async function getUsers() {
  const prisma = new PrismaClient();
  return prisma.user.findMany();
  // 接続が閉じられない
}

// 良い例：シングルトンパターン
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

---

## 🎓 学習ロードマップ

### 初級編（基礎理解）
1. ✅ Prismaとは何か
2. ✅ スキーマの書き方
3. ✅ 基本的なCRUD操作
4. ✅ リレーションの理解

### 中級編（実践応用）
1. 🔄 マイグレーションの管理
2. 🔄 パフォーマンス最適化
3. 🔄 エラーハンドリング
4. 🔄 トランザクション処理

### 上級編（高度な機能）
1. 🔄 カスタムバリデーション
2. 🔄 複雑なクエリ最適化
3. 🔄 データベース設計パターン
4. 🔄 本番環境での運用

---

## 🎬 まとめ

Prismaは、データベースとアプリケーションの間に立つ**魔法使い**です：

### 🎯 **Prismaの魔法**
- **型安全性**: 間違いを事前に防ぐ
- **自動補完**: 複雑な呪文を覚える必要がない
- **マイグレーション**: データベースの変更を安全に管理
- **リレーション**: 関連データを簡単に取得

### 🚀 **開発効率の向上**
- **直感的なAPI**: 人間が理解しやすい
- **型生成**: TypeScriptとの完璧な統合
- **デバッグ支援**: エラーメッセージが分かりやすい
- **パフォーマンス**: 最適化されたクエリの自動生成

### 🛡️ **安全性の確保**
- **SQLインジェクション**: 自動的に防御
- **型チェック**: 実行時エラーを事前に発見
- **マイグレーション**: データベース変更の履歴管理
- **バックアップ**: 安全なデータ操作

Prismaをマスターして、データベースを自在に操る魔法使いになりましょう！

### 🔗 次のステップ

1. [Prisma最適化ガイド](./PRISMA_OPTIMIZATION_GUIDE.md)でパフォーマンスを向上
2. [PrismaとGraphQLの統合ガイド](./Prisma-GraphQL-Integration-Guide.md)でAPIとの連携を学習
3. 実際のプロジェクトでPrismaを使用

Happy Coding with Prisma! 🎉✨