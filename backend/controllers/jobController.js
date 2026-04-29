import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import { splitList } from '../utils/userProfile.js';

const splitParagraphs = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value !== 'string') {
    return [];
  }

  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
};

// Get All Jobs
export const getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const {
      search,
      location,
      type,
      workMode,
      experienceLevel,
      minSalary
    } = req.query;

    let query = { status: 'active' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'company.name': { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' };
    }

    if (type) query.type = type;
    if (workMode) query.workMode = workMode;
    if (experienceLevel) query.experienceLevel = experienceLevel;

    if (minSalary) {
      query['salary.min'] = { $gte: Number(minSalary) };
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email role')
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      jobs,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

// Get Single Job
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email profile company');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    job.views += 1;
    await job.save();

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
};

// Create Job
export const createJob = async (req, res) => {
  try {
    const recruiter = await User.findById(req.user.id).select('name email phone profile');

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter account not found',
      });
    }

    const companyName =
      req.body.company?.name ||
      req.body.companyName ||
      recruiter.profile?.company?.name;

    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required before posting a job',
      });
    }

    const job = await Job.create({
      ...req.body,
      company: {
        ...req.body.company,
        name: companyName,
        description:
          req.body.company?.description ||
          recruiter.profile?.company?.description,
        website:
          req.body.company?.website ||
          recruiter.profile?.company?.website,
        email: req.body.company?.email || recruiter.email,
        phone: req.body.company?.phone || recruiter.phone,
        industry:
          req.body.company?.industry ||
          recruiter.profile?.company?.industry,
      },
      shortDescription:
        req.body.shortDescription ||
        req.body.description?.slice(0, 180),
      skills: splitList(req.body.skills),
      responsibilities: splitParagraphs(req.body.responsibilities),
      requirements: splitParagraphs(req.body.requirements),
      benefits: splitParagraphs(req.body.benefits),
      postedBy: req.user.id,
      status: req.body.status || 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create job',
      error: error.message
    });
  }
};

// Update Job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update job',
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

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
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

// Get My Jobs
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      postedBy: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your jobs',
      error: error.message
    });
  }
};

// Search Jobs
export const searchJobs = async (req, res) => {
  return getJobs(req, res);
};
