import { HttpResponse } from '../../@types/http';
import { RequestHandler } from 'express';
import { User } from '@prisma/client';
import { UserLocal } from '../../@types/locals';
import { client } from '../../utils';
import { parseZodErrors } from '../../utils/parser';
import responses from '../../utils/responses';
import { sendEmail } from '../../email';
import { updateSchema } from './validation';
import { z } from 'zod';
import { compileFunction } from 'vm';

export const getLoggedInUser: RequestHandler<never, HttpResponse, never, never, UserLocal> = async (
  req,
  res
): Promise<void> => {
  if (!res.locals.user) {
    responses.invalidToken(res);
    return;
  }

  const { id, name, email } = res.locals.user;

  res.status(200).json({ status: 'success', data: { id, name, email } });
};

export const updateLoggedInUser: RequestHandler<
  never,
  HttpResponse,
  z.infer<typeof updateSchema>,
  never,
  UserLocal
> = async (req, res): Promise<void> => {
  const validationErrors = parseZodErrors(updateSchema, req.body);

  if (validationErrors) {
    responses.invalidFields(res, 'Invalid information provided', validationErrors);
    return;
  }

  if (!res.locals.user) {
    responses.missingToken(res);
    return;
  }

  // const { name, email } = req.body;

  const user = await client.user.update({ where: { id: res.locals.user.id }, data: req.body });

  if (res.locals.user.email !== user.email) {
    await sendEmail({ to: res.locals.user.email, template: 'email-updated' });
  }

  res.json({
    status: 'success',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  });
};

export const getLoggedInUserPosts: RequestHandler<any, HttpResponse, never, never, UserLocal> = async (
  req,
  res
): Promise<void> => {
  const posts = await client.post.findMany({ where: { userId: res.locals.user.id } });

  if (!posts) {
    responses.notFound(res);
    return;
  }

  responses.success(res, posts);
};

export const getUserPosts: RequestHandler<any, HttpResponse, never, never, never> = async (req, res): Promise<void> => {
  if (!req.params.name) {
    responses.notFound(res, 'Missing ID parameter');
    return;
  }

  const post = await client.post.findMany({ where: { user: { name: req.params.name } } });
  if (!post) {
    responses.notFound(res);
    return;
  }

  responses.success(res, post);
};

export const followUser: RequestHandler<any, HttpResponse, never, never, UserLocal> = async (
  req,
  res
): Promise<void> => {
  if (!req.params.name) {
    responses.notFound(res);
    return;
  }

  const foundUser = await client.user.findFirst({ where: { name: req.params.name } });
  if (!foundUser) {
    responses.notFound(res);
    console.log(1);
    return;
  }

  const isFollowing = await client.user.findFirst({
    where: {
      id: foundUser.id,
      followers: {
        some: {
          id: res.locals.user.id
        }
      }
    }
  });

  if (!isFollowing) {
    // Set follower on found user
    await client.user.update({
      where: { id: foundUser.id },
      data: { followers: { connect: { id: res.locals.user.id } } }
    });

    // Set following on logged in user
    await client.user.update({
      where: { id: res.locals.user.id },
      data: { following: { connect: { id: foundUser.id } } }
    });
  } else {
    // Remove follower on found user
    await client.user.update({
      where: { id: foundUser.id },
      data: { followers: { disconnect: { id: res.locals.user.id } } }
    });

    // Remove following on logged in user
    await client.user.update({
      where: { id: res.locals.user.id },
      data: { following: { disconnect: { id: foundUser.id } } }
    });
  }

  const updatedUser = await client.user.findFirst({
    where: { id: foundUser.id },
    include: { _count: { select: { following: true, followers: true } } }
  });

  responses.success(res, { followers: updatedUser!._count!.followers, following: updatedUser!._count!.following });
};

export const getUserByName: RequestHandler<any, HttpResponse, never, never, UserLocal> = async (req, res) => {
  if (!req.params.name) {
    responses.notFound(res);
    return;
  }

  const foundUser = await client.user.findFirst({
    where: { name: req.params.name },
    include: {
      followers: true,
      Post: {
        include: {
          _count: { select: { Like: true } },
          Like: { select: { userId: true } },
          user: { select: { name: true } }
        }
      },
      _count: {
        select: {
          followers: true,
          following: true
        }
      }
    }
  });

  if (!foundUser) {
    responses.notFound(res);
    return;
  }

  foundUser.Post.forEach((post) => {
    if (post.Like.find((p) => p.userId === res.locals.user.id)) {
      // @ts-ignore
      post.liked = true;
    } else {
      // @ts-ignore
      post.liked = false;
    }
  });

  if (foundUser.followers.find((u) => u.id === res.locals.user.id)) {
    // @ts-ignore
    foundUser.followed = true;
  } else {
    // @ts-ignore
    foundUser.followed = false;
  }

  responses.success(res, {
    id: foundUser.id,
    name: foundUser.name,
    createdAt: foundUser.createdAt,
    // @ts-ignore
    followed: foundUser.followed,
    Post: foundUser.Post,
    followers: foundUser._count!.followers,
    following: foundUser._count!.following
  });
};
