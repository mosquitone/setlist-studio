import { Metadata } from 'next';
import { headers } from 'next/headers';

import { getMessages, Language } from '@/lib/i18n';

import HomePageClient from './HomePageClient';

// Disable caching for authentication-dependent content
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || 'ja';
  const lang: Language = acceptLanguage.startsWith('en') ? 'en' : 'ja';
  const messages = getMessages(lang);

  return {
    title: messages.metadata.homeTitle,
    description: messages.metadata.homeDescription,
    keywords: messages.metadata.keywords,
    openGraph: {
      title: messages.metadata.homeTitle,
      description: messages.metadata.homeDescription,
      type: 'website',
    },
  };
}

export default function HomePage() {
  return <HomePageClient />;
}
