import { PostLocal, UserLocal } from '../../@types/locals';
import { createSchema, updateSchema } from './validation';

import { HttpResponse } from '../../@types/http';
import { RequestHandler } from 'express';
import { client } from '../../utils';
import { parseZodErrors } from '../../utils/parser';
import responses from '../../utils/responses';
import { z } from 'zod';

export const createPost: RequestHandler<never, HttpResponse, z.infer<typeof createSchema>, never, UserLocal> = async (
  req,
  res
): Promise<void> => {
  const validationErrors = parseZodErrors(createSchema, req.body);

  if (validationErrors) {
    responses.invalidFields(res, 'Your message is not valid', validationErrors);
    return;
  }

  const newPost = await client.post.create({
    data: {
      message: req.body.message,
      userId: res.locals.user.id
    },
    include: {
      user: {
        select: {
          name: true
        }
      }
    }
  });

  if (!newPost) {
    responses.internal(res);
    return;
  }

  responses.success(res, newPost);
};

export const getPosts: RequestHandler<never, HttpResponse, never, never, UserLocal> = async (
  req,
  res
): Promise<void> => {
  const posts = await client.post.findMany({
    where: {},
    include: {
      _count: { select: { Like: true } },
      Like: { select: { userId: true } },
      user: { select: { name: true } }
    }
  });

  posts.forEach((post) => {
    if (post.Like.find((p) => p.userId === res.locals.user.id)) {
      // @ts-ignore
      post.liked = true;
    } else {
      // @ts-ignore
      post.liked = false;
    }
  });

  if (!posts) {
    responses.notFound(res);
    return;
  }

  responses.success(res, posts);
};

export const getPost: RequestHandler<any, any, never, never, PostLocal> = async (req, res): Promise<void> => {
  const data = { ...res.locals.post, liked: false };

  if (data.Like.find((p: { userId: string }) => p.userId === res.locals.user.id)) {
    data.liked = true;
  }

  data.Comment.forEach((comment: any) => {
    if (comment.user.id === res.locals.user.id) {
      // @ts-ignore
      comment.owner = true;
    }
  });

  responses.success(res, data);
};

export const updatePost: RequestHandler<any, HttpResponse, z.infer<typeof updateSchema>, never, PostLocal> = async (
  req,
  res
): Promise<void> => {
  const validationErrors = parseZodErrors(updateSchema, req.body);

  if (validationErrors) {
    responses.invalidFields(res, 'Your message is invalid', validationErrors);
    return;
  }

  const updatedPost = await client.post.update({
    where: { id: res.locals.post.id },
    data: { message: req.body.message }
  });
  if (!updatedPost) {
    responses.internal(res, 'There was an issue updated your post, please try again.');
    return;
  }

  responses.success(res, updatedPost);
};

export const deletePost: RequestHandler<any, HttpResponse, never, never, PostLocal> = async (
  req,
  res
): Promise<void> => {
  await client.post.delete({ where: { id: res.locals.post.id } });

  responses.success(res);
};
