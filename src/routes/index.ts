import { NextFunction, Request, Response, Router } from 'express';

import authRouter from './auth';
import postRouter from './post';
import userRouter from './user';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the API'
  });
});

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/post', postRouter);

export default router;
