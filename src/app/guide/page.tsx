import { Metadata } from 'next';
import { headers } from 'next/headers';

import { getMessages, Language } from '@/lib/i18n';

import GuideClient from './GuideClient';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || 'ja';
  const lang: Language = acceptLanguage.startsWith('en') ? 'en' : 'ja';
  const messages = getMessages(lang);

  return {
    title: messages.metadata.guideTitle,
    description: messages.metadata.guideDescription,
    keywords: [
      ...messages.metadata.keywords,
      lang === 'ja' ? 'チュートリアル' : 'tutorial',
      lang === 'ja' ? '使い方' : 'how to use',
      lang === 'ja' ? 'ガイド' : 'guide',
      lang === 'ja' ? 'マニュアル' : 'manual',
    ],
    openGraph: {
      title: messages.metadata.guideTitle,
      description: messages.metadata.guideDescription,
      type: 'article',
    },
  };
}

export default function GuidePage() {
  return <GuideClient />;
}
