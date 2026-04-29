import Job from '../models/Job.js';
import User from '../models/User.js';
import Application from '../models/Application.js';

// Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalJobs,
      activeJobs,
      pendingJobs,
      closedJobs,
      totalUsers,
      totalApplications,
      totalCandidates,
      totalRecruiters,
      recentJobs,
      recentUsers,
      cityInsights,
      applicationStats
    ] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      Job.countDocuments({ status: 'pending' }),
      Job.countDocuments({ status: 'closed' }),
      User.countDocuments(),
      Application.countDocuments(),
      User.countDocuments({ role: 'candidate' }),
      User.countDocuments({ role: 'recruiter' }),

      Job.find()
        .populate('postedBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(10),

      User.find({}, '-password')
        .sort({ createdAt: -1 })
        .limit(10),

      Job.aggregate([
        { $group: { _id: '$location.city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),

      Application.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        pendingJobs,
        closedJobs,
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalApplications,
        recentJobs,
        recentUsers,
        cityInsights,
        applicationStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

// Approve Job
export const approveJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: 'active' },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job approved successfully',
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve job',
      error: error.message
    });
  }
};

// Delete Job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    await Job.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ job: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message
    });
  }
};

// Manage Users
export const manageUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Reports
export const getReports = async (req, res) => {
  try {
    const jobsByStatus = await Job.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      reports: {
        jobsByStatus,
        usersByRole,
        applicationsByStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate reports',
      error: error.message
    });
  }
};