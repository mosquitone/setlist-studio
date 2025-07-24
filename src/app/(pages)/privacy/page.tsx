import { Metadata } from 'next';
import { headers } from 'next/headers';

import { getMessages, Language } from '@/lib/i18n';

import PrivacyClient from './PrivacyClient';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || 'ja';
  const lang: Language = acceptLanguage.startsWith('en') ? 'en' : 'ja';
  const messages = getMessages(lang);

  return {
    title: messages.metadata.privacyTitle,
    description: messages.metadata.privacyDescription,
    keywords: [
      ...messages.metadata.keywords,
      lang === 'ja' ? 'プライバシーポリシー' : 'privacy policy',
    ],
    openGraph: {
      title: messages.metadata.privacyTitle,
      description: messages.metadata.privacyDescription,
      type: 'article',
    },
  };
}

export default function PrivacyPage() {
  return <PrivacyClient />;
}
