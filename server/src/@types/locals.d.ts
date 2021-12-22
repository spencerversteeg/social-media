import { Post, User } from '@prisma/client';

export interface UserLocal {
  user: User;
}

export interface PostLocal extends UserLocal {
  post: Post;
}
