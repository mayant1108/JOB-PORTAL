const Job = require('../models/Job');

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const inferJobCategory = (job) => {
  if (job.category && job.category !== 'General') {
    return job.category;
  }

  const haystack = [
    job.title,
    job.description,
    ...(Array.isArray(job.tags) ? job.tags : []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (/(design|designer|ui|ux|figma|creative)/.test(haystack)) {
    return 'Design';
  }

  if (/(marketing|seo|growth|brand|content|social media)/.test(haystack)) {
    return 'Marketing';
  }

  if (/(sales|account executive|business development|revenue)/.test(haystack)) {
    return 'Sales';
  }

  if (/(finance|financial|accounting|accountant|bookkeeping)/.test(haystack)) {
    return 'Finance';
  }

  if (/(hr|human resources|recruit|recruiter|talent|people ops)/.test(haystack)) {
    return 'HR';
  }

  return 'Engineering';
};

const formatPostedLabel = (createdAt) => {
  if (!createdAt) {
    return 'Recently posted';
  }

  const createdDate = new Date(createdAt);
  const diffInDays = Math.max(
    0,
    Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  if (diffInDays === 0) {
    return 'Today';
  }

  if (diffInDays === 1) {
    return '1 day ago';
  }

  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks === 1) {
    return '1 week ago';
  }

  if (diffInWeeks < 5) {
    return `${diffInWeeks} weeks ago`;
  }

  return createdDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const normalizeSalary = (salary) => {
  if (!salary) {
    return salary;
  }

  return `${salary}`.replace(/\$/g, '₹');
};

const serializeJob = (jobDoc) => {
  const job = typeof jobDoc.toObject === 'function' ? jobDoc.toObject() : jobDoc;

  return {
    ...job,
    id: job._id?.toString?.() || job.id,
    company: job.company || 'Confidential Company',
    logo: job.logo || '💼',
    salary: normalizeSalary(job.salary),
    tags: Array.isArray(job.tags) ? job.tags : [],
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    category: inferJobCategory(job),
    jobType: job.type,
    posted: formatPostedLabel(job.createdAt),
  };
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const { search, type, location, company } = req.query;
    const filters = [{ isActive: true }];

    if (search) {
      filters.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      });
    }

    const jobType = type || req.query.jobType;
    if (jobType && jobType !== 'All') {
      filters.push({ type: jobType });
    }

    if (location) {
      filters.push({ location: { $regex: location, $options: 'i' } });
    }

    if (company) {
      filters.push({
        company: { $regex: `^${escapeRegex(company)}$`, $options: 'i' },
      });
    }

    const query = filters.length === 1 ? filters[0] : { $and: filters };

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(jobs.map(serializeJob));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (job) {
      res.json(serializeJob(job));
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Admin
const createJob = async (req, res) => {
  try {
    const job = new Job({
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      type: req.body.type || req.body.jobType,
      salary: req.body.salary,
      category: req.body.category || inferJobCategory(req.body),
      description: req.body.description,
      requirements: req.body.requirements || [],
      tags: req.body.tags || [],
      logo: req.body.logo || '💼',
      applyLink: req.body.applyLink,
      postedBy: req.user._id,
    });

    const createdJob = await job.save();
    res.status(201).json(serializeJob(createdJob));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      job.title = req.body.title || job.title;
      job.company = req.body.company || job.company;
      job.location = req.body.location || job.location;
      job.type = req.body.type || req.body.jobType || job.type;
      job.salary = req.body.salary || job.salary;
      job.category = req.body.category || job.category;
      job.description = req.body.description || job.description;
      job.requirements = req.body.requirements || job.requirements;
      job.tags = req.body.tags || job.tags;
      job.logo = req.body.logo || job.logo;
      job.applyLink = req.body.applyLink || job.applyLink;
      job.isActive = req.body.isActive !== undefined ? req.body.isActive : job.isActive;

      const updatedJob = await job.save();
      res.json(serializeJob(updatedJob));
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      await job.deleteOne();
      res.json({ message: 'Job removed' });
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
