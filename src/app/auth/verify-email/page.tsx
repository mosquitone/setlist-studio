import { Metadata } from 'next';
import { headers } from 'next/headers';

import { getMessages, Language } from '@/lib/i18n';

import VerifyEmailClient from './VerifyEmailClient';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || 'ja';
  const lang: Language = acceptLanguage.startsWith('en') ? 'en' : 'ja';
  const messages = getMessages(lang);

  return {
    title: messages.metadata.verifyEmailTitle,
    description: messages.metadata.verifyEmailDescription,
    keywords: [
      ...messages.metadata.keywords,
      lang === 'ja' ? 'メールアドレス認証' : 'email verification',
    ],
    openGraph: {
      title: messages.metadata.verifyEmailTitle,
      description: messages.metadata.verifyEmailDescription,
      type: 'website',
    },
  };
}

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

export default function VerifyEmailPage() {
  return <VerifyEmailClient />;
}
