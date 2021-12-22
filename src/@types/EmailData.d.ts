export default interface EmailData {
  to: string;
  template: 'verify' | 'forgot-password' | 'email-updated' | 'password-changed';
  [other: string]: unknown;
}
