import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth/nextauth';
import { PASSWORD_POLICY } from '@/lib/constants/auth';
import {
  logSecurityEventDB,
  SecurityEventType,
  SecurityEventSeverity,
} from '@/lib/security/security-logger-db';
import { hashIP } from '@/lib/security/security-utils';
import { DatabaseThreatDetection, ThreatSeverity } from '@/lib/security/threat-detection-db';
import { emailService } from '@/lib/server/email/emailService';
import { prisma } from '@/lib/server/prisma';

// Threat detection instance
const threatDetection = new DatabaseThreatDetection(prisma);

export async function POST(request: NextRequest) {
  try {
    // NextAuthセッション確認
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Google認証が必要です。' },
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
        details: { action: 'google_email_change', reason: 'threat_detected' },
      });
      return NextResponse.json(
        {
          success: false,
          message: '一時的にアクセスが制限されています。しばらく待ってから再度お試しください。',
        },
        { status: 429 },
      );
    }

    const body = await request.json();

    // パスワード検証
    if (body.newPassword) {
      if (
        typeof body.newPassword !== 'string' ||
        body.newPassword.length < PASSWORD_POLICY.MIN_LENGTH ||
        body.newPassword.length > PASSWORD_POLICY.MAX_LENGTH ||
        !PASSWORD_POLICY.REGEX.test(body.newPassword)
      ) {
        return NextResponse.json(
          { success: false, message: PASSWORD_POLICY.MESSAGE },
          { status: 400 },
        );
      }
    }

    // currentUserIdが送信されている場合は、それを使用してユーザーを特定
    // （セッション切り替え問題対応）
    let currentUser;
    if (body.currentUserId) {
      currentUser = await prisma.user.findUnique({
        where: { id: body.currentUserId },
      });

      // セキュリティチェック：Google認証ユーザーのみがこの機能を使用可能
      if (!currentUser || currentUser.authProvider !== 'google') {
        return NextResponse.json(
          { success: false, message: 'この機能はGoogle認証ユーザーのみ利用可能です。' },
          { status: 403 },
        );
      }
    } else {
      // 従来の方法（後方互換性のため）
      currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
    }

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'ユーザーが見つかりません。' },
        { status: 404 },
      );
    }

    // Google認証のメールアドレスを新しいメールアドレスとして使用
    const googleEmail = session.user.email;

    // 既存のメールアドレスと同じ場合はエラー
    if (currentUser.email === googleEmail) {
      return NextResponse.json(
        { success: false, message: '現在のメールアドレスと同じです。' },
        { status: 400 },
      );
    }

    // メールアドレス重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email: googleEmail },
    });
    if (existingUser && existingUser.id !== currentUser.id) {
      return NextResponse.json(
        { success: false, message: 'このメールアドレスは既に使用されています。' },
        { status: 400 },
      );
    }

    // メールアドレス変更実行（即座に変更）
    const updateData: Prisma.UserUpdateInput = {
      email: googleEmail,
      emailVerified: true, // Google認証により検証済み
      authProvider: body.newPassword ? 'email' : currentUser.authProvider,
    };

    if (body.newPassword) {
      updateData.password = await bcrypt.hash(body.newPassword, 12);
    }

    const oldEmail = currentUser.email;
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
    });

    // メールアドレス変更履歴を記録
    const userAgent = request.headers.get('user-agent') || '';
    const cooldownUntil = new Date();
    cooldownUntil.setHours(cooldownUntil.getHours() + 72); // 3日間のクールダウン

    await prisma.emailHistory.create({
      data: {
        userId: currentUser.id,
        oldEmail,
        newEmail: googleEmail,
        changeMethod: 'google_oauth',
        ipAddress: clientIP,
        userAgent,
        authProvider: updatedUser.authProvider,
        cooldownUntil,
        verificationSent: false,
      },
    });

    // 旧メールアドレスに通知
    await emailService.sendEmailChangeNotificationEmail(
      oldEmail,
      currentUser.username || 'ユーザー',
      googleEmail,
    );

    // 新メールアドレスに完了通知
    await emailService.sendEmailChangeSuccessEmail(googleEmail, currentUser.username || 'ユーザー');

    // セキュリティログ記録
    await logSecurityEventDB(prisma, {
      type: SecurityEventType.EMAIL_CHANGE_SUCCESS,
      severity: SecurityEventSeverity.LOW,
      userId: currentUser.id,
      ipAddress: hashedIP,
      details: {
        oldEmail,
        newEmail: googleEmail,
        method: 'google_oauth',
        authProvider: updatedUser.authProvider,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Google認証によりメールアドレスが正常に変更されました。',
    });
  } catch (error) {
    console.error('Google email change error:', error);

    return NextResponse.json(
      { success: false, message: 'メールアドレス変更に失敗しました。' },
      { status: 500 },
    );
  }
}
