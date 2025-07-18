import { Resend } from 'resend';
import crypto from 'crypto';
import { getMessages, Language } from '../../i18n/messages';

// ビルド時エラーを避けるため、環境変数が存在しない場合はダミー値を使用
const resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key-for-build');

export interface EmailConfig {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface TokenData {
  token: string;
  expires: Date;
}

export class EmailService {
  private static instance: EmailService;
  private fromEmail: string;

  private constructor() {
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * セキュアなトークンを生成
   */
  public generateSecureToken(): TokenData {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24時間後
    return { token, expires };
  }

  /**
   * パスワードリセット用トークンを生成（短めの有効期限）
   */
  public generatePasswordResetToken(): TokenData {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1時間後
    return { token, expires };
  }

  /**
   * メール送信のベースメソッド
   */
  private async sendEmail(config: EmailConfig): Promise<boolean> {
    try {
      const { data, error } = await resend.emails.send({
        from: config.from,
        to: config.to,
        subject: config.subject,
        html: config.html,
      });

      if (error) {
        console.error('Email sending error:', error);
        return false;
      }

      console.log('Email sent successfully:', data?.id);
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }

  /**
   * メール認証メールを送信
   */
  public async sendEmailVerification(
    email: string,
    username: string,
    token: string,
    lang?: Language,
  ): Promise<boolean> {
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`;
    const messages = getMessages(lang || 'ja');
    const emailBody = messages.email.verificationBody(username, verificationUrl);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Setlist Studio</h2>
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${emailBody}</pre>
      </div>
    `;

    return this.sendEmail({
      from: this.fromEmail,
      to: email,
      subject: `Setlist Studio - ${messages.email.verificationSubject}`,
      html,
    });
  }

  /**
   * パスワードリセットメールを送信
   */
  public async sendPasswordResetEmail(
    email: string,
    username: string,
    token: string,
    lang?: Language,
  ): Promise<boolean> {
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;
    const messages = getMessages(lang || 'ja');
    const emailBody = messages.email.passwordResetBody(username, resetUrl);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Setlist Studio</h2>
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${emailBody}</pre>
      </div>
    `;

    return this.sendEmail({
      from: this.fromEmail,
      to: email,
      subject: `Setlist Studio - ${messages.email.passwordResetSubject}`,
      html,
    });
  }

  /**
   * メールアドレス変更確認メールを送信
   */
  public async sendEmailChangeConfirmation(
    newEmail: string,
    username: string,
    token: string,
    lang?: Language,
  ): Promise<boolean> {
    const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/confirm-email-change?token=${token}`;
    const messages = getMessages(lang || 'ja');
    const emailBody = messages.email.emailChangeBody(username, confirmUrl);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Setlist Studio</h2>
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${emailBody}</pre>
      </div>
    `;

    return this.sendEmail({
      from: this.fromEmail,
      to: newEmail,
      subject: `Setlist Studio - ${messages.email.emailChangeSubject}`,
      html,
    });
  }

  /**
   * パスワードリセット完了通知メールを送信
   */
  public async sendPasswordResetSuccessEmail(
    email: string,
    username: string,
    lang?: Language,
  ): Promise<boolean> {
    const messages = getMessages(lang || 'ja');
    const emailBody = messages.email.passwordResetSuccessBody(username);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Setlist Studio</h2>
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${emailBody}</pre>
      </div>
    `;

    return this.sendEmail({
      from: this.fromEmail,
      to: email,
      subject: `Setlist Studio - ${messages.email.passwordResetSuccessSubject}`,
      html,
    });
  }
}

export const emailService = EmailService.getInstance();
