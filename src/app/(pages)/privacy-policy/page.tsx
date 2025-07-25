import { Metadata } from 'next';
import { headers } from 'next/headers';

import { getMessages, Language } from '@/lib/i18n';

import PrivacyPolicyClient from './PrivacyPolicyClient';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || 'ja';
  const lang: Language = acceptLanguage.startsWith('en') ? 'en' : 'ja';
  const messages = getMessages(lang);

  return {
    title: messages.metadata.privacyPolicyTitle,
    description: messages.metadata.privacyPolicyDescription,
    keywords: [
      ...messages.metadata.keywords,
      lang === 'ja' ? 'プライバシーポリシー' : 'privacy policy',
    ],
    openGraph: {
      title: messages.metadata.privacyPolicyTitle,
      description: messages.metadata.privacyPolicyDescription,
      type: 'article',
    },
  };
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
