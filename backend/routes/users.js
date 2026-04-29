import express from 'express';
import { protect } from '../middleware/auth.js';

import {
  getUserProfile,
  updateProfile,
  uploadResume,
  uploadProfilePhoto,
  getCandidateProfiles,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../controllers/userController.js';

import { getMe } from '../controllers/authController.js';

const router = express.Router();

/* Upload Routes */
router.post('/upload-resume', protect, uploadResume);
router.post('/upload-photo', protect, uploadProfilePhoto);
router.get('/candidates', getCandidateProfiles);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read-all', protect, markAllNotificationsRead);
router.put('/notifications/:id/read', protect, markNotificationRead);

/* Logged In User Profile */
router.get('/profile', protect, getMe);

/* Update Logged In User */
router.put('/', protect, updateProfile);

/* Get User By ID */
router.get('/:id', protect, getUserProfile);

export default router;
