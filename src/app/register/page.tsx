// Static generation for register page - no server-side auth needed
import { Metadata } from 'next';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
  title: '新規登録',
  description: 'Setlist Studioに新規アカウントを作成してあなたの楽曲とセットリストを管理しましょう',
};

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

export default function RegisterPage() {
  return <RegisterClient />;
}
