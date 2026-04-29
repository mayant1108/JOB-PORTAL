import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
  searchJobs
} from '../controllers/jobController.js';

const router = express.Router();

// Public Routes
router.get('/', getJobs);
router.get('/search', searchJobs);
router.get('/my-jobs', protect, authorize('recruiter', 'admin'), getMyJobs);
router.get('/:id', getJob);

// Recruiter Routes
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

export default router;