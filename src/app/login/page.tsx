// Static generation for login page - no server-side auth needed
import { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'ログイン',
  description: 'Setlist Studioにログインしてあなたの楽曲とセットリストを管理しましょう',
};

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

export default function LoginPage() {
  return <LoginClient />;
}
