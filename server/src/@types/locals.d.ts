import { Post, User } from '@prisma/client';

export interface UserLocal {
  user: User;
}

export interface PostLocal extends UserLocal {
  post: Post & {
    Like: {
      userId: string;
    }[];
    Comment: {
      id: string;
      createdAt: Date;
      message: string;
      user: {
        id: string;
        name: string;
      };
    }[];
    user: {
      name: string;
    };
    _count: {
      Like: number;
    } | null;
  };
}
