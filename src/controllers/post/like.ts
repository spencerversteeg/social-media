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

  responses.success(res);
};
