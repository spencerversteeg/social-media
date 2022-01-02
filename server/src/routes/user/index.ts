import {
  followUser,
  getLoggedInUser,
  getLoggedInUserPosts,
  getUserByName,
  getUserPosts,
  updateLoggedInUser
} from '../../controllers/user';

import { Router } from 'express';
import { isUser } from '../../middleware/auth';

const router = Router();

router.put('/', isUser, updateLoggedInUser);
router.get('/me', isUser, getLoggedInUser);

router.get('/:name', isUser, getUserByName);
router.get('/:name/post', isUser, getUserPosts);
router.get('/:name/follow', isUser, followUser);

router.get('/post', isUser, getLoggedInUserPosts);

export default router;
