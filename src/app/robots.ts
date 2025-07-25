import { MetadataRoute } from 'next';

import { getPublicUrl } from '@/lib/config/url';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getPublicUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/setlists/*/edit', '/profile'],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: ['CCBot', 'anthropic-ai', 'Claude-Web', 'Bard', 'PaLM'],
        disallow: '/api/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
