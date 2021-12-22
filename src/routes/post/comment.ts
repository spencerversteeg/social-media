import { deleteComment, getComments, postComment } from '../../controllers/post/comment';

import { Router } from 'express';
import { fetchPost } from '../../middleware/post';
import { isUser } from '../../middleware/auth';

const router = Router({ mergeParams: true });

router.post('/', isUser, fetchPost, postComment);
router.get('/', isUser, fetchPost, getComments);
router.delete('/:comment_id', isUser, fetchPost, deleteComment);

export default router;
