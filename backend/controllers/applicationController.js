import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

const formatEducation = (education = []) => {
  if (!Array.isArray(education) || !education.length) {
    return '';
  }

  return education
    .map((item) => item.degree || item.institution || item.field)
    .filter(Boolean)
    .join(', ');
};

const parseExpectedSalary = (value) => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return 0;
  }

  const digits = value.replace(/[^\d]/g, '');
  return digits ? Number.parseInt(digits, 10) : 0;
};

// Apply Job
export const applyJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    const job = await Job.findById(jobId).populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job is not open for applications'
      });
    }

    const existing = await Application.findOne({
      job: jobId,
      candidate: req.user.id
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You already applied for this job'
      });
    }

    const resume = req.user.profile?.resume;
    if (!resume) {
      return res.status(400).json({
        success: false,
        message: 'Please upload your resume in profile before applying',
      });
    }

    if (!req.user.phone) {
      return res.status(400).json({
        success: false,
        message: 'Please update your phone number in profile before applying',
      });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      recruiter: job.postedBy._id,
      fullName: req.user.name,
      email: req.user.email,
      phone: req.user.phone || '',
      skills: req.user.profile?.skills || [],
      experience: req.user.profile?.experience
        ? `${req.user.profile.experience} years`
        : 'Fresher',
      education: formatEducation(req.user.profile?.education),
      location: [
        req.user.profile?.location?.city,
        req.user.profile?.location?.area,
      ]
        .filter(Boolean)
        .join(', '),
      expectedSalary: parseExpectedSalary(req.user.profile?.salaryExpectation),
      portfolio: req.user.profile?.portfolio || '',
      linkedin: req.user.profile?.linkedin || '',
      github: req.user.profile?.github || '',
      coverLetter: coverLetter || '',
      resume,
    });

    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicantsCount: 1 },
      $push: { applications: application._id }
    });

    await User.findByIdAndUpdate(req.user.id, {
      $push: { applications: application._id },
    });

    await Notification.create({
      user: job.postedBy._id,
      sender: req.user.id,
      type: 'application',
      title: 'New Job Application',
      message: `${req.user.name} applied for ${job.title}`,
      relatedId: application._id,
      relatedModel: 'Application'
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to apply job',
      error: error.message
    });
  }
};

// My Applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user.id
    })
      .populate('job', 'title company location status type workMode salary applicantsCount createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
};

// Applications for specific Job
export const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).select('postedBy');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (
      req.user.role !== 'admin' &&
      job.postedBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view applications for this job',
      });
    }

    const applications = await Application.find({
      job: req.params.jobId
    })
      .populate('candidate', 'name email phone profile')
      .populate('job', 'title company')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job applications',
      error: error.message
    });
  }
};

// Update Status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('candidate', 'name email phone')
      .populate('job', 'title postedBy');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (
      req.user.role !== 'admin' &&
      application.job.postedBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this application',
      });
    }

    application.status = status;
    application.recruiter = req.user.id;
    application.responseDate = new Date();
    await application.save();

    await Notification.create({
      user: application.candidate._id,
      sender: req.user.id,
      type: 'status_update',
      title: 'Application Status Updated',
      message: `Your application for ${application.job.title} is now ${status}`,
      relatedId: application._id,
      relatedModel: 'Application'
    });

    res.status(200).json({
      success: true,
      message: 'Application status updated',
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message
    });
  }
};
