import { Metadata } from 'next';
import { headers } from 'next/headers';

import { getMessages, Language } from '@/lib/i18n';

import TermsOfServiceClient from './TermsOfServiceClient';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || 'ja';
  const lang: Language = acceptLanguage.startsWith('en') ? 'en' : 'ja';
  const messages = getMessages(lang);

  return {
    title: messages.metadata.termsTitle,
    description: messages.metadata.termsDescription,
    keywords: [...messages.metadata.keywords, lang === 'ja' ? '利用規約' : 'terms of service'],
    openGraph: {
      title: messages.metadata.termsTitle,
      description: messages.metadata.termsDescription,
      type: 'article',
    },
  };
}

export default function TermsOfServicePage() {
  return <TermsOfServiceClient />;
}
