import { Router } from 'express';
import {
  changePassword,
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  verifyUser
} from '../../controllers/auth';
const router = Router();

// @route  POST api/auth/register
// @desc   Create user / Register user
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Login user / Returning JWT Token
router.post('/login', loginUser);

// @route   GET api/auth/logout
// @desc    Logout user / Clear JWT Token from user's cookies
router.get('/logout', logoutUser);

// @route   POST api/auth/verify/:token
// @desc    Verify user / Verify user's email
router.get('/verify/:token', verifyUser);

// @route PATCH api/auth/reset/:token
// @desc  Reset password
router.patch('/reset/:token', changePassword);

// @route  POST api/auth/reset
// @desc   Send password reset link
router.post('/reset', forgotPassword);

export default router;
