const express = require('express');
const router = express.Router();
const { 
  getJobs, 
  getJobById, 
  createJob, 
  updateJob, 
  deleteJob 
} = require('../controllers/jobController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getJobs)
  .post(protect, admin, createJob);

router.route('/:id')
  .get(getJobById)
  .put(protect, admin, updateJob)
  .delete(protect, admin, deleteJob);

module.exports = router;

