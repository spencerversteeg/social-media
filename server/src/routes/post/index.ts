import { createPost, deletePost, getPost, getPosts, updatePost } from '../../controllers/post';
import { fetchPost, isPostAuthor } from '../../middleware/post';

import { Router } from 'express';
import commentRouter from './comment';
import { isUser } from '../../middleware/auth';
import { like } from '../../controllers/post/like';

const router = Router({ mergeParams: true });

router.post('/', isUser, createPost);
router.get('/', getPosts);
router.get('/:id', isUser, fetchPost, getPost);
router.put('/:id', isUser, fetchPost, isPostAuthor, updatePost);
router.delete('/:id', isUser, fetchPost, isPostAuthor, deletePost);

router.post('/:id/like', isUser, fetchPost, like);
router.use('/:id/comment', commentRouter);

export default router;
