/**
 * Prisma クエリ最適化ユーティリティ
 * パフォーマンス向上のためのクエリ最適化とキャッシュ機能
 */

import { PrismaClient } from '@prisma/client';

// クエリ結果キャッシュ（メモリベース）
const queryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// キャッシュTTL（ミリ秒）
const DEFAULT_CACHE_TTL = 60000; // 1分
const SETLIST_CACHE_TTL = 300000; // 5分
const SONG_CACHE_TTL = 600000; // 10分

/**
 * クエリ結果をキャッシュ
 */
export function cacheQuery<T>(key: string, data: T, ttl: number = DEFAULT_CACHE_TTL): T {
  queryCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
  return data;
}

/**
 * キャッシュからクエリ結果を取得
 */
export function getCachedQuery<T>(key: string): T | null {
  const cached = queryCache.get(key);
  if (!cached) return null;

  const isExpired = Date.now() - cached.timestamp > cached.ttl;
  if (isExpired) {
    queryCache.delete(key);
    return null;
  }

  return cached.data as T;
}

/**
 * キャッシュをクリア
 */
export function clearCache(pattern?: string) {
  if (pattern) {
    for (const [key] of queryCache) {
      if (key.includes(pattern)) {
        queryCache.delete(key);
      }
    }
  } else {
    queryCache.clear();
  }
}

/**
 * 最適化されたセットリスト取得
 */
export async function getOptimizedSetlists(prisma: PrismaClient, userId: string) {
  const cacheKey = `setlists:${userId}`;
  const cached = getCachedQuery(cacheKey);
  if (cached) return cached;

  const setlists = await prisma.setlist.findMany({
    where: { userId },
    include: {
      items: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          note: true,
          order: true,
          setlistId: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return cacheQuery(cacheKey, setlists, SETLIST_CACHE_TTL);
}

/**
 * 最適化されたセットリスト詳細取得
 */
export async function getOptimizedSetlist(prisma: PrismaClient, id: string, userId?: string) {
  const cacheKey = `setlist:${id}:${userId || 'public'}`;
  const cached = getCachedQuery(cacheKey);
  if (cached) return cached;

  const setlist = await prisma.setlist.findFirst({
    where: {
      id,
      OR: [{ isPublic: true }, { userId: userId || '' }],
    },
    include: {
      items: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          note: true,
          order: true,
          setlistId: true,
        },
      },
    },
  });

  return cacheQuery(cacheKey, setlist, SETLIST_CACHE_TTL);
}

/**
 * 最適化された楽曲取得
 */
export async function getOptimizedSongs(prisma: PrismaClient, userId: string) {
  const cacheKey = `songs:${userId}`;
  const cached = getCachedQuery(cacheKey);
  if (cached) return cached;

  const songs = await prisma.song.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      artist: true,
      duration: true,
      key: true,
      tempo: true,
      notes: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return cacheQuery(cacheKey, songs, SONG_CACHE_TTL);
}

/**
 * バッチクエリ最適化
 */
export async function batchQuery<T>(
  queries: Array<() => Promise<T>>,
  batchSize: number = 5,
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < queries.length; i += batchSize) {
    const batch = queries.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((query) => query()));
    results.push(...batchResults);
  }

  return results;
}

/**
 * 接続健全性チェック
 */
export async function checkConnection(prisma: PrismaClient): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('❌ Database connection check failed:', error);
    return false;
  }
}

/**
 * クエリ実行時間測定
 */
export async function measureQuery<T>(name: string, query: () => Promise<T>): Promise<T> {
  try {
    const result = await query();
    return result;
  } catch (error) {
    console.error(`❌ Query ${name} failed:`, error);
    throw error;
  }
}

/**
 * 定期的なキャッシュクリーンアップ
 */
setInterval(() => {
  const now = Date.now();

  for (const [key, value] of queryCache.entries()) {
    if (now - value.timestamp > value.ttl) {
      queryCache.delete(key);
    }
  }
}, 300000); // 5分ごとにクリーンアップ
