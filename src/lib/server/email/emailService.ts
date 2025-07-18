import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    token: string
  ): Promise<boolean> {
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Setlist Studio - メール認証</h2>
        <p>こんにちは ${username} さん、</p>
        <p>アカウントの作成ありがとうございます。以下のリンクをクリックしてメールアドレスを認証してください。</p>
        <div style="margin: 20px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            メールアドレスを認証する
          </a>
        </div>
        <p>このリンクは24時間で有効期限が切れます。</p>
        <p>もしこのメールに心当たりがない場合は、このメールを無視してください。</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          このメールは自動送信されています。返信しないでください。
        </p>
      </div>
    `;

    return this.sendEmail({
      from: this.fromEmail,
      to: email,
      subject: 'Setlist Studio - メール認証のお願い',
      html,
    });
  }

  /**
   * パスワードリセットメールを送信
   */
  public async sendPasswordResetEmail(
    email: string,
    username: string,
    token: string
  ): Promise<boolean> {
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Setlist Studio - パスワードリセット</h2>
        <p>こんにちは ${username} さん、</p>
        <p>パスワードリセットのリクエストを受け付けました。以下のリンクをクリックして新しいパスワードを設定してください。</p>
        <div style="margin: 20px 0;">
          <a href="${resetUrl}" 
             style="background-color: #d32f2f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            パスワードをリセット
          </a>
        </div>
        <p>このリンクは1時間で有効期限が切れます。</p>
        <p>もしこのリクエストに心当たりがない場合は、このメールを無視してください。</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          このメールは自動送信されています。返信しないでください。
        </p>
      </div>
    `;

    return this.sendEmail({
      from: this.fromEmail,
      to: email,
      subject: 'Setlist Studio - パスワードリセットのご案内',
      html,
    });
  }

  /**
   * メールアドレス変更確認メールを送信
   */
  public async sendEmailChangeConfirmation(
    newEmail: string,
    username: string,
    token: string
  ): Promise<boolean> {
    const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/confirm-email-change?token=${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Setlist Studio - メールアドレス変更確認</h2>
        <p>こんにちは ${username} さん、</p>
        <p>メールアドレスの変更リクエストを受け付けました。以下のリンクをクリックして変更を確定してください。</p>
        <div style="margin: 20px 0;">
          <a href="${confirmUrl}" 
             style="background-color: #388e3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            メールアドレス変更を確定
          </a>
        </div>
        <p>このリンクは24時間で有効期限が切れます。</p>
        <p>もしこのリクエストに心当たりがない場合は、このメールを無視してください。</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          このメールは自動送信されています。返信しないでください。
        </p>
      </div>
    `;

    return this.sendEmail({
      from: this.fromEmail,
      to: newEmail,
      subject: 'Setlist Studio - メールアドレス変更確認',
      html,
    });
  }

  /**
   * パスワードリセット完了通知メールを送信
   */
  public async sendPasswordResetSuccessEmail(
    email: string,
    username: string
  ): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Setlist Studio - パスワード変更完了</h2>
        <p>こんにちは ${username} さん、</p>
        <p>パスワードが正常に変更されました。</p>
        <p>もしこの変更に心当たりがない場合は、すぐにお問い合わせください。</p>
        <div style="margin: 20px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login" 
             style="background-color: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            ログイン
          </a>
        </div>
        <hr>
        <p style="color: #666; font-size: 12px;">
          このメールは自動送信されています。返信しないでください。
        </p>
      </div>
    `;

    return this.sendEmail({
      from: this.fromEmail,
      to: email,
      subject: 'Setlist Studio - パスワード変更完了のお知らせ',
      html,
    });
  }
}

export const emailService = EmailService.getInstance();