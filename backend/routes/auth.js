import express from 'express';
import { protect } from '../middleware/auth.js';

import {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Protected Routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;