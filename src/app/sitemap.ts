import { MetadataRoute } from 'next';

import { getPublicUrl } from '@/lib/config/url';
import { prisma } from '@/lib/server/prisma-optimized';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getPublicUrl();
  const lastModified = new Date();

  // 静的ページ
  const staticPages = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/register`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ];

  try {
    // 公開セットリストを取得
    const publicSetlists = await prisma.setlist.findMany({
      where: {
        isPublic: true,
      },
      select: {
        id: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // 動的セットリストページ
    const setlistUrls = publicSetlists.map((setlist) => ({
      url: `${baseUrl}/setlists/${setlist.id}`,
      lastModified: setlist.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...setlistUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // エラーが発生した場合は静的ページのみ返す
    return staticPages;
  }
}
