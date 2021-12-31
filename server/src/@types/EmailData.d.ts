export interface NodeMailerSettings {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export default interface EmailData {
  to: string;
  template: 'verify' | 'forgot-password' | 'email-updated' | 'password-changed';
  [other: string]: unknown;
}
