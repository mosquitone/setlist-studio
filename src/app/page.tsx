// ISR for home page - 1 hour cache for optimal performance
import { Metadata } from 'next';
import HomeClient from './HomeClient';

// ホームページはレイアウトのデフォルトタイトルを使用

// Enable ISR with 1 hour cache
export const revalidate = 3600;

export default function HomePage() {
  return <HomeClient />;
}
