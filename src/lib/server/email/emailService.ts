import crypto from 'crypto';

import { Resend } from 'resend';

import { getMessages, Language } from '../../i18n/messages';

import { EmailReliabilityService, EmailResult } from './emailReliability';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key-for-build');

const SETLIST_STUDIO_LOGO = `
<div style="text-align: center; margin: 30px 0 40px 0;">
  <h1 style="font-family: Arial, sans-serif; font-size: 36px; font-weight: bold; color: #1976d2; margin: 0; letter-spacing: 2px;">
    SETLIST STUDIO
  </h1>
  <div style="font-family: monospace; font-size: 20px; color: #1976d2; margin-top: 5px;">
    ♪ ▁▂▃▄▃▂▁ ♪
  </div>
</div>
`;

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
  private circuitBreaker: ReturnType<typeof EmailReliabilityService.createCircuitBreaker>;

  private constructor() {
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    this.circuitBreaker = EmailReliabilityService.createCircuitBreaker(5, 60000);
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
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return { token, expires };
  }

  /**
   * パスワードリセット用トークンを生成（短めの有効期限）
   */
  public generatePasswordResetToken(): TokenData {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    return { token, expires };
  }

  /**
   * メールアドレス変更用トークンを生成
   */
  public generateEmailChangeToken(): TokenData {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return { token, expires };
  }

  /**
   * メール送信のベースメソッド（リトライ機構付き）
   */
  private async sendEmail(
    config: EmailConfig,
    emailType: 'verification' | 'password_reset' | 'email_change' | 'notification' = 'notification',
  ): Promise<boolean> {
    try {
      const retryOptions = EmailReliabilityService.getRetryOptionsForEmailType(emailType);

      await this.circuitBreaker.execute(async () => {
        return await EmailReliabilityService.retryWithBackoff(async () => {
          const { data, error } = await resend.emails.send({
            from: config.from,
            to: config.to,
            subject: config.subject,
            html: config.html,
          });

          if (error) {
            const errorMessage = typeof error === 'string' ? error : JSON.stringify(error);
            const emailError = new Error(`Email sending failed: ${errorMessage}`);

            if (!EmailReliabilityService.isTemporaryError(error)) {
              console.error('Permanent email error - not retrying:', error);
              throw emailError;
            }

            throw emailError;
          }

          console.log('Email sent successfully:', data?.id);
          return data;
        }, retryOptions);
      });

      return true;
    } catch (error) {
      console.error('Email service error after all retries:', error);
      return false;
    }
  }

  /**
   * より詳細な情報を返すメール送信メソッド
   */
  private async sendEmailWithDetails(
    config: EmailConfig,
    emailType: 'verification' | 'password_reset' | 'email_change' | 'notification' = 'notification',
  ): Promise<EmailResult> {
    let attempts = 0;
    let finalError: Error | undefined;

    try {
      const retryOptions = EmailReliabilityService.getRetryOptionsForEmailType(emailType);

      const result = await this.circuitBreaker.execute(async () => {
        return await EmailReliabilityService.retryWithBackoff(async () => {
          attempts++;
          const { data, error } = await resend.emails.send({
            from: config.from,
            to: config.to,
            subject: config.subject,
            html: config.html,
          });

          if (error) {
            const errorMessage = typeof error === 'string' ? error : JSON.stringify(error);
            const emailError = new Error(`Email sending failed: ${errorMessage}`);

            if (!EmailReliabilityService.isTemporaryError(error)) {
              console.error('Permanent email error - not retrying:', error);
              throw emailError;
            }

            throw emailError;
          }

          console.log('Email sent successfully:', data?.id);
          return data;
        }, retryOptions);
      });

      return {
        success: true,
        attempts,
        messageId: result?.id,
      };
    } catch (error) {
      finalError = error instanceof Error ? error : new Error(String(error));
      console.error('Email service error after all retries:', finalError);

      return {
        success: false,
        attempts,
        finalError,
      };
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
    const emailBody = messages.emails.verificationBody(username, verificationUrl);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${SETLIST_STUDIO_LOGO}
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${emailBody}</pre>
      </div>
    `;

    return this.sendEmail(
      {
        from: this.fromEmail,
        to: email,
        subject: `Setlist Studio - ${messages.emails.verificationSubject}`,
        html,
      },
      'verification',
    );
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
    const emailBody = messages.emails.passwordResetBody(username, resetUrl);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${SETLIST_STUDIO_LOGO}
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${emailBody}</pre>
      </div>
    `;

    return this.sendEmail(
      {
        from: this.fromEmail,
        to: email,
        subject: `Setlist Studio - ${messages.emails.passwordResetSubject}`,
        html,
      },
      'password_reset',
    );
  }

  /**
   * メールアドレス変更確認メールを送信
   */
  public async sendEmailChangeConfirmation(
    oldEmail: string,
    newEmail: string,
    username: string,
    token: string,
    lang?: Language,
  ): Promise<boolean> {
    const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/confirm-email-change?token=${token}`;
    const messages = getMessages(lang || 'ja');
    const emailBody = messages.emails.emailChangeBody(username, oldEmail, newEmail, confirmUrl);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${SETLIST_STUDIO_LOGO}
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${emailBody}</pre>
      </div>
    `;

    return this.sendEmail(
      {
        from: this.fromEmail,
        to: newEmail,
        subject: `Setlist Studio - ${messages.emails.emailChangeSubject}`,
        html,
      },
      'email_change',
    );
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
    const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login`;
    const emailBody = messages.emails.passwordResetSuccessBody(username, loginUrl);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${SETLIST_STUDIO_LOGO}
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${emailBody}</pre>
      </div>
    `;

    return this.sendEmail(
      {
        from: this.fromEmail,
        to: email,
        subject: `Setlist Studio - ${messages.emails.passwordResetSuccessSubject}`,
        html,
      },
      'notification',
    );
  }

  /**
   * 詳細な結果を返すメール認証メール送信
   */
  public async sendEmailVerificationWithDetails(
    email: string,
    username: string,
    token: string,
    lang?: Language,
  ): Promise<EmailResult> {
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`;
    const messages = getMessages(lang || 'ja');
    const emailBody = messages.emails.verificationBody(username, verificationUrl);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${SETLIST_STUDIO_LOGO}
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${emailBody}</pre>
      </div>
    `;

    return this.sendEmailWithDetails(
      {
        from: this.fromEmail,
        to: email,
        subject: `Setlist Studio - ${messages.emails.verificationSubject}`,
        html,
      },
      'verification',
    );
  }

  /**
   * 詳細な結果を返すパスワードリセットメール送信
   */
  public async sendPasswordResetEmailWithDetails(
    email: string,
    username: string,
    token: string,
    lang?: Language,
  ): Promise<EmailResult> {
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;
    const messages = getMessages(lang || 'ja');
    const emailBody = messages.emails.passwordResetBody(username, resetUrl);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${SETLIST_STUDIO_LOGO}
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${emailBody}</pre>
      </div>
    `;

    return this.sendEmailWithDetails(
      {
        from: this.fromEmail,
        to: email,
        subject: `Setlist Studio - ${messages.emails.passwordResetSubject}`,
        html,
      },
      'password_reset',
    );
  }

  /**
   * 詳細な結果を返すメールアドレス変更確認メール送信
   */
  public async sendEmailChangeEmailWithDetails(
    oldEmail: string,
    newEmail: string,
    username: string,
    token: string,
    lang?: Language,
  ): Promise<EmailResult> {
    const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/confirm-email-change?token=${token}`;
    const messages = getMessages(lang || 'ja');
    const emailBody = messages.emails.emailChangeBody(username, oldEmail, newEmail, confirmUrl);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${SETLIST_STUDIO_LOGO}
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${emailBody}</pre>
      </div>
    `;

    return this.sendEmailWithDetails(
      {
        from: this.fromEmail,
        to: newEmail,
        subject: `Setlist Studio - ${messages.emails.emailChangeSubject}`,
        html,
      },
      'email_change',
    );
  }

  /**
   * メールアドレス変更通知メール送信（旧メールアドレスに送信）
   */
  public async sendEmailChangeNotificationEmail(
    oldEmail: string,
    username: string,
    newEmail: string,
    lang?: Language,
  ): Promise<EmailResult> {
    const messages = getMessages(lang || 'ja');
    const emailBody = messages.emails.emailChangeNotificationBody(username, oldEmail, newEmail);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${SETLIST_STUDIO_LOGO}
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${emailBody}</pre>
      </div>
    `;

    return this.sendEmailWithDetails(
      {
        from: this.fromEmail,
        to: oldEmail,
        subject: `Setlist Studio - ${messages.emails.emailChangeNotificationSubject}`,
        html,
      },
      'notification',
    );
  }

  /**
   * メールアドレス変更成功メール送信（新メールアドレスに送信）
   */
  public async sendEmailChangeSuccessEmail(
    newEmail: string,
    username: string,
    lang?: Language,
  ): Promise<EmailResult> {
    const messages = getMessages(lang || 'ja');
    const emailBody = messages.emails.emailChangeSuccessBody(username, newEmail);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${SETLIST_STUDIO_LOGO}
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${emailBody}</pre>
      </div>
    `;

    return this.sendEmailWithDetails(
      {
        from: this.fromEmail,
        to: newEmail,
        subject: `Setlist Studio - ${messages.emails.emailChangeSuccessSubject}`,
        html,
      },
      'notification',
    );
  }

  /**
   * 過去のメールアドレス復帰時の所有権確認メール送信
   */
  public async sendEmailOwnershipVerificationEmail(
    email: string,
    username: string,
    userId: string,
    lang?: Language,
  ): Promise<EmailResult> {
    const messages = getMessages(lang || 'ja');
    // 所有権確認用トークン生成
    const verificationToken = this.generateSecureToken();

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${SETLIST_STUDIO_LOGO}
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #1976d2; margin-top: 0;">${messages.auth.emailOwnershipVerification}</h2>
          <p>${messages.emails.emailOwnershipDescription}</p>
          <p>${messages.emails.emailOwnershipEmailLabel}: <strong>${email}</strong></p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://${process.env.NEXTAUTH_URL || 'localhost:3000'}/auth/verify-email-ownership?token=${verificationToken.token}&userId=${userId}" 
               style="background: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              ${messages.emails.emailOwnershipButtonText}
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">
            ${messages.emails.emailOwnershipExpiresLabel}: ${verificationToken.expires.toLocaleString(lang === 'en' ? 'en-US' : 'ja-JP')}
          </p>
        </div>
        <p style="font-size: 12px; color: #888;">
          ${messages.emails.emailOwnershipDisclaimer}
        </p>
      </div>
    `;

    return this.sendEmailWithDetails(
      {
        from: this.fromEmail,
        to: email,
        subject: `Setlist Studio - ${messages.emails.emailOwnershipSubject}`,
        html,
      },
      'verification',
    );
  }

  /**
   * Circuit Breaker の状態を取得
   */
  public getCircuitBreakerState(): 'closed' | 'open' | 'half-open' {
    return this.circuitBreaker.getState();
  }

  /**
   * Circuit Breaker の失敗回数を取得
   */
  public getCircuitBreakerFailureCount(): number {
    return this.circuitBreaker.getFailureCount();
  }

  /**
   * Circuit Breaker をリセット
   */
  public resetCircuitBreaker(): void {
    this.circuitBreaker.reset();
  }
}

export const emailService = EmailService.getInstance();
