import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

import {
  getDashboardStats,
  approveJob,
  deleteJob,
  manageUsers,
  getReports
} from '../controllers/adminController.js';

const router = express.Router();

// Admin Access Only
router.use(protect, authorize('admin'));

// Dashboard
router.get('/stats', getDashboardStats);

// Job Management
router.put('/jobs/:id/approve', approveJob);
router.delete('/jobs/:id', deleteJob);

// User Management
router.get('/users', manageUsers);

// Reports
router.get('/reports', getReports);

export default router;