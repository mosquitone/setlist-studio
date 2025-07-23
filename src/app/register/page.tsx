// Static generation for register page - no server-side auth needed
import { Metadata } from 'next';
import { headers } from 'next/headers';

import { getMessages, type Language } from '@/lib/i18n/messages';

import RegisterClient from './RegisterClient';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || 'ja';
  const lang: Language = acceptLanguage.startsWith('en') ? 'en' : 'ja';
  const messages = getMessages(lang);

  return {
    title: messages.metadata.registerTitle,
    description: messages.metadata.registerDescription,
  };
}

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

export default function RegisterPage() {
  return <RegisterClient />;
}
