import { PrismaClient } from '@prisma/client';

export const inDevelopment = process.env.NODE_ENV === 'development';
export const client = new PrismaClient();
