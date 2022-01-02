import { RequestHandler } from 'express';
import { client } from '../utils';
import responses from '../utils/responses';

export const fetchPost: RequestHandler = async (req, res, next): Promise<void> => {
  if (!req.params.id) {
    responses.notFound(res);
    return;
  }

  const post = await client.post.findFirst({
    where: { id: req.params.id },
    include: {
      user: { select: { name: true } },
      Like: { select: { userId: true } },
      Comment: { select: { id: true, createdAt: true, message: true, user: { select: { id: true, name: true } } } },
      _count: { select: { Like: true } }
    }
  });

  if (!post) {
    responses.notFound(res);
    return;
  }

  res.locals.post = post;
  next();
};

export const isPostAuthor: RequestHandler = async (req, res, next): Promise<void> => {
  if (res.locals.user.id !== res.locals.post.userId) {
    responses.unauthorized(res, 'You are unable to modify this post.');
    return;
  }

  next();
};
