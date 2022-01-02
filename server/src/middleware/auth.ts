import * as jwt from 'jsonwebtoken';

import { NextFunction, Request, RequestHandler, Response, response } from 'express';

import { TokenData } from '../@types/TokenData';
import { client } from '../utils';
import cookieParser from 'cookie-parser';
import responses from '../utils/responses';

export const isUser: RequestHandler[] = [
  cookieParser(),
  async (req: Request, res: Response, next: NextFunction) => {
    const { cookies } = req;
    const secret = process.env.JWT_SECRET;
    if (!cookies || !cookies.Authorization) {
      responses.invalidToken(res);
      return;
    }

    const verificationResponse = (await jwt.verify(cookies.Authorization, secret as string)) as TokenData;
    const user = await client.user.findFirst({ where: { id: verificationResponse.id } });

    if (!user) {
      responses.invalidToken(res);
      return;
    }
    res.locals.user = user;
    next();
  }
];
