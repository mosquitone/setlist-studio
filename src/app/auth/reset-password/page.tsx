import { Metadata } from 'next';
import { headers } from 'next/headers';

import { getMessages, Language } from '@/lib/i18n';

import ResetPasswordClient from './ResetPasswordClient';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || 'ja';
  const lang: Language = acceptLanguage.startsWith('en') ? 'en' : 'ja';
  const messages = getMessages(lang);

  return {
    title: messages.metadata.resetPasswordTitle,
    description: messages.metadata.resetPasswordDescription,
    keywords: [
      ...messages.metadata.keywords,
      lang === 'ja' ? 'パスワード再設定' : 'password reset',
    ],
    openGraph: {
      title: messages.metadata.resetPasswordTitle,
      description: messages.metadata.resetPasswordDescription,
      type: 'website',
    },
  };
}

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}
