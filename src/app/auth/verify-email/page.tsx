import { Metadata } from 'next';
import { headers } from 'next/headers';
import { getMessages, type Language } from '@/lib/i18n/messages';
import VerifyEmailClient from './VerifyEmailClient';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || 'ja';
  const lang: Language = acceptLanguage.startsWith('en') ? 'en' : 'ja';
  const messages = getMessages(lang);

  return {
    title: messages.metadata.verifyEmailTitle,
    description: messages.metadata.verifyEmailDescription,
  };
}

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

export default function VerifyEmailPage() {
  return <VerifyEmailClient />;
}
