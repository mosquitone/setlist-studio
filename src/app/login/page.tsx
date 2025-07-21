// Static generation for login page - no server-side auth needed
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { getMessages, type Language } from '@/lib/i18n/messages';
import LoginClient from './LoginClient';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || 'ja';
  const lang: Language = acceptLanguage.startsWith('en') ? 'en' : 'ja';
  const messages = getMessages(lang);

  return {
    title: messages.metadata.loginTitle,
    description: messages.metadata.loginDescription,
  };
}

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

export default function LoginPage() {
  return <LoginClient />;
}
