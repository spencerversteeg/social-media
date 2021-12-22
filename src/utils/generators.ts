import crypto from 'crypto';

export const generateVerificationToken = (): string => {
  return crypto.randomBytes(128).toString('hex');
};
