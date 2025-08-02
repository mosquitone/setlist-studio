import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { config } from '@/lib/config/environment';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: config.googleClientId,
      clientSecret: config.googleClientSecret,
      authorization: {
        params: {
          prompt: 'select_account', // アカウント選択画面を強制表示
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      // Google認証でメールアドレスが存在する場合のみ許可
      return account?.provider === 'google' && !!user.email;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/api/auth/google-sync`;
    },
  },
};
