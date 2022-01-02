import * as jwt from 'jsonwebtoken';

import { changePasswordSchema, forgotPasswordSchema, loginSchema, registerSchema } from './validation';

import { HttpResponse } from '../../@types/http';
import { RequestHandler } from 'express';
import { VerificationParameters } from '../../@types/auth';
import bcrypt from 'bcryptjs';
import { client, inDevelopment } from '../../utils';
import { generateVerificationToken } from '../../utils/generators';
import { parseZodErrors } from '../../utils/parser';
import responses from '../../utils/responses';
import { sendEmail } from '../../email';
import { z } from 'zod';

export const registerUser: RequestHandler<never, HttpResponse, z.infer<typeof registerSchema>, never, never> = async (
  req,
  res
): Promise<void> => {
  const validationErrors = parseZodErrors(registerSchema, req.body);

  if (validationErrors) {
    responses.invalidFields(res, 'Invalid form data', validationErrors);
    return;
  }

  const { name, email, password, confirmPassword } = req.body;

  if (confirmPassword !== password) {
    responses.passwordMismatch(res);
    return;
  }

  const existingUser = await client.user.findFirst({ where: { email } });
  if (existingUser) {
    responses.alreadyExists(res);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await client.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      UserVerification: { create: { token: generateVerificationToken() } }
    },
    include: { UserVerification: true }
  });

  const link = `${process.env.FRONTEND_URL}/verify/${user.UserVerification!.token}`;

  await sendEmail({ template: 'verify', to: user.email, link });

  responses.success(res);
};

export const loginUser: RequestHandler<never, HttpResponse, z.infer<typeof loginSchema>, never, never> = async (
  req,
  res
): Promise<void> => {
  const validationErrors = parseZodErrors(loginSchema, req.body);

  if (validationErrors) {
    responses.invalidFields(res, 'Invalid credentials', validationErrors);
    return;
  }

  const { email, password } = req.body;

  const user = await client.user.findFirst({ where: { email }, include: { UserVerification: true } });

  if (!user) {
    responses.invalidCredentials(res);
    return;
  }

  if (!user.UserVerification!.verified) {
    responses.notVerified(res);
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    responses.invalidCredentials(res);
    return;
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '14d' });

  // TODO: Setup cookies for responses wrapped
  res
    .cookie('Authorization', `${token}`, { maxAge: 1209600000, path: '/', httpOnly: true, secure: !inDevelopment })
    .json({ status: 'success', data: { id: user.id, name: user.name, email: user.email } });
};

export const verifyUser: RequestHandler<VerificationParameters, HttpResponse, unknown, never, never> = async (
  req,
  res
): Promise<void> => {
  const { token } = req.params;
  const user = await client.user.findFirst({ where: { UserVerification: { token } } });

  if (!user) {
    responses.unauthorized(res);
    return;
  }

  await client.userVerification.update({ where: { userId: user.id }, data: { verified: true } });

  // TODO: Redirect to frontend confirmation page
  // TODO: Figure out redirect wrapper on responses
  responses.success(res);
};

export const logoutUser: RequestHandler<never, HttpResponse, unknown, never, never> = async (
  req,
  res
): Promise<void> => {
  res.clearCookie('Authorization').json({ status: 'success', data: {} });
};

export const forgotPassword: RequestHandler<
  never,
  HttpResponse,
  z.infer<typeof forgotPasswordSchema>,
  never,
  never
> = async (req, res): Promise<void> => {
  const validationErrors = parseZodErrors(forgotPasswordSchema, req.body);

  if (validationErrors) {
    responses.invalidFields(res, 'Invalid fields', validationErrors);
    return;
  }

  const { email } = req.body;
  const user = await client.user.findFirst({ where: { email } });
  if (!user) {
    responses.success(res);
    return;
  }

  const passwordReset = await client.userPasswordReset.create({
    data: { token: generateVerificationToken(), userId: user.id }
  });

  await sendEmail({
    to: user.email,
    template: 'forgot-password',
    link: `${process.env.FRONTEND_URL}/reset/${passwordReset.token}`
  });

  responses.success(res);
};

export const changePassword: RequestHandler<
  never,
  HttpResponse,
  z.infer<typeof changePasswordSchema>,
  never,
  never
> = async (req, res): Promise<void> => {
  const validationErrors = parseZodErrors(changePasswordSchema, req.body);

  if (validationErrors) {
    responses.invalidFields(res, "Something isn't right.", validationErrors);
    return;
  }

  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!token) {
    responses.missingToken(res);
    return;
  }

  if (confirmPassword !== password) {
    responses.passwordMismatch(res);
    return;
  }

  const passwordReset = await client.userPasswordReset.findFirst({ where: { token } });
  if (!passwordReset) {
    responses.notFound(res);
    return;
  }

  if (passwordReset.used) {
    responses.resetUsed(res);
    return;
  }

  const user = await client.user.findFirst({ where: { id: passwordReset.userId } });
  if (!user) {
    responses.notFound(res);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await client.userPasswordReset.update({ where: { userId: user.id }, data: { used: true } });
  await client.user.update({ where: { id: user.id }, data: { password: hashedPassword } });

  await sendEmail({
    to: user.email,
    template: 'password-changed'
  });

  responses.success(res);
};
