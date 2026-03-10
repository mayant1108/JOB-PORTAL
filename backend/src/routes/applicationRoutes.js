const express = require('express');
const router = express.Router();
const { 
  applyForJob, 
  getMyApplications, 
  getAllApplications, 
  updateApplicationStatus 
} = require('../controllers/applicationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, applyForJob);
router.get('/my', protect, getMyApplications);
router.get('/', protect, admin, getAllApplications);
router.put('/:id', protect, admin, updateApplicationStatus);

module.exports = router;

