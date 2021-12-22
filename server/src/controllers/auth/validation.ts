import { z } from 'zod';
import { name, email, password, confirmPassword } from '../../utils/validation';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+-=])[A-Za-z\d!@#$%^&*()_+-=]{8,}$/;

export const registerSchema = z
  .object({
    name: z
      .string({ ...name })
      .min(2, { message: name.minLength })
      .max(32, { message: name.maxLength }),
    email: z.string({ ...email }).email({ message: email.invalid_type_error }),
    password: z.string({ ...password }).regex(passwordRegex, { message: password.pattern }),
    confirmPassword: z.string({ ...confirmPassword }).regex(passwordRegex, { message: password.pattern })
  })
  .refine((obj) => obj.password === obj.confirmPassword, {
    message: password.nonMatch,
    path: ['passwords']
  });

export const loginSchema = z.object({
  email: z.string({ ...email }).email({ message: email.invalid_type_error }),
  password: z.string({
    ...password
  })
});

export const forgotPasswordSchema = z.object({
  email: z.string({ ...email }).email({ message: 'Email is not valid.' })
});

export const changePasswordSchema = z
  .object({
    password: z.string({ ...password }).regex(passwordRegex, { message: password.pattern }),
    confirmPassword: z
      .string({
        ...confirmPassword
      })
      .regex(passwordRegex, { message: confirmPassword.pattern })
  })
  .refine((obj) => obj.password === obj.confirmPassword, {
    message: password.nonMatch,
    path: ['passwords']
  });
