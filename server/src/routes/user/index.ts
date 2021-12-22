import {
  followUser,
  getLoggedInUser,
  getLoggedInUserPosts,
  getUserPosts,
  updateLoggedInUser
} from '../../controllers/user';

import { Router } from 'express';
import { isUser } from '../../middleware/auth';

const router = Router();

router.get('/post', isUser, getLoggedInUserPosts);
router.get('/:id/post', getUserPosts);
router.get('/:id/follow', isUser, followUser);

router.get('/me', isUser, getLoggedInUser);

router.put('/', isUser, updateLoggedInUser);

export default router;
