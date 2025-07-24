import { Metadata } from 'next';
import { headers } from 'next/headers';

import { getMessages, Language } from '@/lib/i18n';

import CheckEmailClient from './CheckEmailClient';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || 'ja';
  const lang: Language = acceptLanguage.startsWith('en') ? 'en' : 'ja';
  const messages = getMessages(lang);

  return {
    title: messages.metadata.checkEmailTitle,
    description: messages.metadata.checkEmailDescription,
    keywords: [...messages.metadata.keywords, lang === 'ja' ? 'メール認証' : 'email verification'],
    openGraph: {
      title: messages.metadata.checkEmailTitle,
      description: messages.metadata.checkEmailDescription,
      type: 'website',
    },
  };
}

export default function CheckEmailPage() {
  return <CheckEmailClient />;
}
