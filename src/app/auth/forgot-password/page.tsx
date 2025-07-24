import { Metadata } from 'next';
import { headers } from 'next/headers';

import { getMessages, Language } from '@/lib/i18n';

import ForgotPasswordClient from './ForgotPasswordClient';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || 'ja';
  const lang: Language = acceptLanguage.startsWith('en') ? 'en' : 'ja';
  const messages = getMessages(lang);

  return {
    title: messages.metadata.forgotPasswordTitle,
    description: messages.metadata.forgotPasswordDescription,
    keywords: [
      ...messages.metadata.keywords,
      lang === 'ja' ? 'パスワードリセット' : 'password reset',
    ],
    openGraph: {
      title: messages.metadata.forgotPasswordTitle,
      description: messages.metadata.forgotPasswordDescription,
      type: 'website',
    },
  };
}

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
