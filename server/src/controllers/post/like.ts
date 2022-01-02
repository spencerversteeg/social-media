import { HttpResponse } from '../../@types/http';
import { PostLocal } from '../../@types/locals';
import { RequestHandler } from 'express';
import { client } from '../../utils';
import responses from '../../utils/responses';

export const like: RequestHandler<never, HttpResponse, never, never, PostLocal> = async (req, res) => {
  const foundLike = await client.like.findFirst({ where: { postId: res.locals.post.id, userId: res.locals.user.id } });

  if (!foundLike) {
    await client.like.create({ data: { postId: res.locals.post.id, userId: res.locals.user.id } });
  } else {
    await client.like.delete({ where: { id: foundLike.id } });
  }
  const foundPost = await client.post.findFirst({
    where: { id: res.locals.post.id },
    include: {
      user: { select: { name: true } },
      Like: { select: { userId: true } },
      Comment: { select: { id: true, createdAt: true, message: true, user: { select: { name: true } } } },
      _count: { select: { Like: true } }
    }
  });

  if (!foundPost) {
    responses.notFound(res);
    return;
  }

  if (foundPost.Like.find((p) => p.userId === res.locals.user.id)) {
    // @ts-ignore
    foundPost.liked = true;
  }

  responses.success(res, foundPost);
};
