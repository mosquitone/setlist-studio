import { PrismaClient } from '@prisma/client';

// Prismaクライアントの最適化設定
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Vercel Functions用の接続プール最適化
    transactionOptions: {
      maxWait: 2000, // 2秒（高速化）
      timeout: 8000, // 8秒（Vercel Functions 10秒制限に対する安全マージン）
      isolationLevel: 'ReadCommitted',
    },
    errorFormat: 'minimal',
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// グローバル型を拡張
declare global {
  var prisma: PrismaClientSingleton | undefined;
}

const globalForPrisma = globalThis;

// グローバルインスタンスを使用（開発環境でのホットリロード対応）
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// 本番以外（development, test, staging等）でグローバルに保存
// テスト環境での接続再利用やステージングでのデバッグに対応
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// クエリ実行時間の計測は開発環境のみ
// テスト実行時のノイズを避け、ステージングは専用の計測ツールを使用
if (process.env.NODE_ENV === 'development') {
  prisma.$use(async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();

    // 100ms以上かかるクエリを警告
    if (after - before > 100) {
      console.warn(`⚠️  Slow query detected (${after - before}ms):`, {
        model: params.model,
        action: params.action,
      });
    }

    return result;
  });
}
