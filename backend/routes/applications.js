import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

import {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
} from '../controllers/applicationController.js';

const router = express.Router();

// Candidate Routes
router.post('/', protect, authorize('candidate'), applyJob);
router.get('/my-applications', protect, authorize('candidate'), getMyApplications);

// Recruiter Routes
router.get(
  '/job/:jobId',
  protect,
  authorize('recruiter', 'admin'),
  getJobApplications
);

router.put(
  '/:id/status',
  protect,
  authorize('recruiter', 'admin'),
  updateApplicationStatus
);

export default router;
