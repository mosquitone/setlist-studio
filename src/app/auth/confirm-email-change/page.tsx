import { Metadata } from 'next';
import { headers } from 'next/headers';

import { getMessages, Language } from '@/lib/i18n';

import ConfirmEmailChangeClient from './ConfirmEmailChangeClient';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || 'ja';
  const lang: Language = acceptLanguage.startsWith('en') ? 'en' : 'ja';
  const messages = getMessages(lang);

  return {
    title: messages.metadata.confirmEmailChangeTitle,
    description: messages.metadata.confirmEmailChangeDescription,
    keywords: [
      ...messages.metadata.keywords,
      lang === 'ja' ? 'メールアドレス変更' : 'email change',
    ],
    openGraph: {
      title: messages.metadata.confirmEmailChangeTitle,
      description: messages.metadata.confirmEmailChangeDescription,
      type: 'website',
    },
  };
}

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

export default function ConfirmEmailChangePage() {
  return <ConfirmEmailChangeClient />;
}
