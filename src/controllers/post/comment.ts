import { HttpResponse } from '../../@types/http';
import { PostLocal } from '../../@types/locals';
import { RequestHandler } from 'express';
import { client } from '../../utils';
import { createSchema } from './validation';
import { parseZodErrors } from '../../utils/parser';
import responses from '../../utils/responses';
import { z } from 'zod';

export const postComment: RequestHandler<any, HttpResponse, z.infer<typeof createSchema>, never, PostLocal> = async (
  req,
  res
): Promise<void> => {
  const validationErrors = parseZodErrors(createSchema, req.body);
  if (validationErrors) {
    responses.invalidFields(res, 'Your comment is invalid.', validationErrors);
    return;
  }

  const newComment = await client.comment.create({
    data: {
      userId: res.locals.user.id,
      postId: res.locals.post.id,
      message: req.body.message
    }
  });
  if (!newComment) {
    responses.internal(res, 'There was an issue posting your comment, please try again.');
  }

  responses.success(res, newComment);
};

export const getComments: RequestHandler<any, HttpResponse, never, never, PostLocal> = async (
  req,
  res
): Promise<void> => {
  const comments = await client.comment.findMany({
    where: { postId: res.locals.post.id },
    orderBy: { createdAt: 'desc' }
  });

  if (!comments) {
    responses.notFound(res);
    return;
  }

  responses.success(res, comments);
};

export const deleteComment: RequestHandler<any, HttpResponse, never, never, PostLocal> = async (
  req,
  res
): Promise<void> => {
  if (!req.params.comment_id) {
    responses.notFound(res);
    return;
  }

  const foundComment = await client.comment.findFirst({
    where: { postId: res.locals.post.id, id: req.params.comment_id }
  });
  if (!foundComment) {
    responses.notFound(res);
    return;
  }

  if (res.locals.user.id !== foundComment.userId) {
    responses.unauthorized(res, 'You are only able to delete your own comments.');
    return;
  }

  await client.comment.delete({ where: { id: foundComment.id } });

  responses.success(res);
};
