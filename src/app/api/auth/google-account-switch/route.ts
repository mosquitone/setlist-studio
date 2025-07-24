import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth/nextauth';
import { PASSWORD_POLICY } from '@/lib/constants/auth';
import { getMessage } from '@/lib/i18n/api-helpers';
import {
  logSecurityEventDB,
  SecurityEventType,
  SecurityEventSeverity,
} from '@/lib/security/security-logger-db';
import { hashIP } from '@/lib/security/security-utils';
import { DatabaseThreatDetection, ThreatSeverity } from '@/lib/security/threat-detection-db';
import { emailService } from '@/lib/server/email/emailService';
import { prisma } from '@/lib/server/prisma';
import { AUTH_PROVIDERS } from '@/types/common';

// Threat detection instance
const threatDetection = new DatabaseThreatDetection(prisma);

export async function POST(request: NextRequest) {
  try {
    // NextAuthセッション確認
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: getMessage(request, 'auth', 'googleAuthRequired') },
        { status: 401 },
      );
    }

    // セキュリティチェック
    const clientIP =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const hashedIP = hashIP(clientIP);

    // 脅威検出
    const threatAnalysis = await threatDetection.analyzeRequest(request, session.user.email);
    if (threatAnalysis.some((threat) => threat.severity === ThreatSeverity.HIGH)) {
      await logSecurityEventDB(prisma, {
        type: SecurityEventType.RATE_LIMIT_EXCEEDED,
        severity: SecurityEventSeverity.HIGH,
        ipAddress: hashedIP,
        details: { action: 'google_account_switch', reason: 'threat_detected' },
      });
      return NextResponse.json(
        {
          success: false,
          message: getMessage(request, 'auth', 'temporaryAccessRestricted'),
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { currentUserId, newPassword } = body;

    // パスワード検証（設定する場合）
    if (newPassword) {
      if (
        typeof newPassword !== 'string' ||
        newPassword.length < PASSWORD_POLICY.MIN_LENGTH ||
        newPassword.length > PASSWORD_POLICY.MAX_LENGTH ||
        !PASSWORD_POLICY.REGEX.test(newPassword)
      ) {
        return NextResponse.json(
          { success: false, message: PASSWORD_POLICY.MESSAGE },
          { status: 400 },
        );
      }
    }

    // 元のユーザー情報を取得
    const originalUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      include: {
        songs: true,
        setlists: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!originalUser || originalUser.authProvider !== AUTH_PROVIDERS.GOOGLE) {
      return NextResponse.json(
        { success: false, message: getMessage(request, 'auth', 'googleAccountNotFound') },
        { status: 404 },
      );
    }

    const newGoogleEmail = session.user.email;

    // 新しいGoogleアカウントが既存アカウントと同じかチェック
    if (originalUser.email === newGoogleEmail) {
      return NextResponse.json(
        { success: false, message: getMessage(request, 'auth', 'sameGoogleAccount') },
        { status: 400 },
      );
    }

    // 新しいGoogleアカウントが既に登録済みかチェック
    const existingNewUser = await prisma.user.findUnique({
      where: { email: newGoogleEmail },
    });

    if (existingNewUser) {
      return NextResponse.json(
        {
          success: false,
          message: getMessage(request, 'auth', 'googleAccountAlreadyRegistered'),
        },
        { status: 400 },
      );
    }

    // データ移行処理をトランザクションで実行
    const result = await prisma.$transaction(async (tx) => {
      // 新しいアカウント情報でユーザーを更新
      const updateData: {
        email: string;
        emailVerified: boolean;
        authProvider: string;
        password?: string;
      } = {
        email: newGoogleEmail,
        emailVerified: true, // Google認証により検証済み
        authProvider: newPassword ? AUTH_PROVIDERS.EMAIL : AUTH_PROVIDERS.GOOGLE,
      };

      if (newPassword) {
        updateData.password = await bcrypt.hash(newPassword, 12);
      }

      const updatedUser = await tx.user.update({
        where: { id: originalUser.id },
        data: updateData,
      });

      return updatedUser;
    });

    // 通知メール送信
    await Promise.all([
      // 旧メールアドレスに変更通知
      emailService.sendEmailChangeNotificationEmail(
        originalUser.email,
        originalUser.username || 'ユーザー',
        newGoogleEmail,
      ),
      // 新メールアドレスに完了通知
      emailService.sendEmailChangeSuccessEmail(newGoogleEmail, originalUser.username || 'ユーザー'),
    ]);

    // セキュリティログ記録
    await logSecurityEventDB(prisma, {
      type: SecurityEventType.EMAIL_CHANGE_SUCCESS,
      severity: SecurityEventSeverity.MEDIUM, // アカウント切り替えは重要な操作
      userId: originalUser.id,
      ipAddress: hashedIP,
      details: {
        oldEmail: originalUser.email,
        newEmail: newGoogleEmail,
        method: 'google_account_switch',
        authProvider: result.authProvider,
        songsCount: originalUser.songs.length,
        setlistsCount: originalUser.setlists.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: getMessage(request, 'auth', 'googleAccountSwitchSuccess'),
    });
  } catch (error) {
    console.error('Google account switch error:', error);

    return NextResponse.json(
      { success: false, message: getMessage(request, 'auth', 'googleAccountSwitchFailed') },
      { status: 500 },
    );
  }
}
