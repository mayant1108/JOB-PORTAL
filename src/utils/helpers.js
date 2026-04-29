// Shared formatters and mappers for backend-driven Job Portal views.

export const truncate = (text = '', maxLength = 120) => {
  if (!text || text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
};

export const formatDate = (dateString) => {
  if (!dateString) {
    return 'Recently';
  }

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  if (diffDays === 0) {
    return 'Today';
  }

  if (diffDays === 1) {
    return '1 day ago';
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  if (diffDays < 31) {
    return `${Math.floor(diffDays / 7)} weeks ago`;
  }

  return date.toLocaleDateString();
};

export const formatSalary = (salary) => {
  if (!salary) {
    return 'Salary not specified';
  }

  if (typeof salary === 'string') {
    return salary;
  }

  const { min, max, currency = 'INR', period = 'month' } = salary;
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });

  if (!min && !max) {
    return 'Salary not specified';
  }

  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)} / ${period}`;
  }

  return `${formatter.format(min || max)} / ${period}`;
};

export const formatCompactNumber = (value) => {
  const numericValue = Number(value || 0);

  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(numericValue);
};

export const debounce = (func, wait) => {
  let timeout;

  return function debouncedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const splitList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value !== 'string') {
    return [];
  }

  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

export const getDashboardPath = (role) => {
  if (role === 'recruiter') {
    return '/employer-dashboard';
  }

  if (role === 'admin') {
    return '/admin-dashboard';
  }

  return '/candidate-dashboard';
};

const toJobId = (job) => job?._id || job?.id;

export const normalizeJob = (job = {}) => {
  const id = toJobId(job);
  const companyName =
    typeof job.company === 'string'
      ? job.company
      : job.company?.name || 'Confidential Company';
  const locationLabel =
    typeof job.location === 'string'
      ? job.location
      : [job.location?.city, job.location?.area]
          .filter(Boolean)
          .join(', ') || job.workMode || 'Location not specified';

  return {
    id,
    _id: id,
    title: job.title || 'Untitled role',
    company: companyName,
    companyDetails:
      typeof job.company === 'object' && job.company
        ? job.company
        : { name: companyName },
    type: job.type || 'Full-time',
    workMode: job.workMode || 'On-site',
    location: locationLabel,
    city:
      typeof job.location === 'object'
        ? job.location?.city || ''
        : job.city || '',
    area:
      typeof job.location === 'object'
        ? job.location?.area || ''
        : job.area || '',
    salary: formatSalary(job.salary),
    salaryRaw: job.salary,
    skills: Array.isArray(job.skills) ? job.skills : [],
    description: job.shortDescription || truncate(job.description || '', 180),
    fullDescription: job.description || '',
    shortDescription: job.shortDescription || truncate(job.description || '', 180),
    posted: formatDate(job.createdAt || job.posted),
    postedAt: job.createdAt || job.posted,
    applicants: job.applicantsCount ?? job.applicants ?? 0,
    urgent: Boolean(job.featured || job.urgent),
    promoted: Boolean(job.isPromoted || job.promoted),
    verified: job.status ? job.status === 'active' : Boolean(job.verified),
    status: job.status || 'active',
    responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    benefits: Array.isArray(job.benefits) ? job.benefits : [],
    experienceLevel: job.experienceLevel || 'Not specified',
    openings: job.openings || 1,
    companyDescription: job.company?.description || '',
    companyWebsite: job.company?.website || '',
    companyEmail: job.company?.email || '',
    companyPhone: job.company?.phone || '',
    postedBy: job.postedBy || null,
  };
};

const maskContact = (value = '') => {
  if (!value) {
    return 'Unlock contact';
  }

  if (value.includes('@')) {
    const [name, domain] = value.split('@');
    const maskedName = `${name.slice(0, 2)}***`;
    return `${maskedName}@${domain}`;
  }

  return `${value.slice(0, 2)}******${value.slice(-2)}`;
};

export const normalizeCandidate = (candidate = {}) => {
  const fullName = candidate.name || '';
  const [firstName = 'Candidate'] = fullName.split(' ');
  const location = candidate.profile?.location || {};

  return {
    id: candidate._id || candidate.id,
    firstName,
    name: fullName || 'Candidate',
    role: candidate.profile?.headline || 'Job Seeker',
    city: location.city || 'India',
    area: location.area || 'Open to relocate',
    experience: candidate.profile?.experience
      ? `${candidate.profile.experience} years`
      : 'Fresher',
    salary: candidate.profile?.salaryExpectation || 'Negotiable',
    skills: Array.isArray(candidate.profile?.skills) ? candidate.profile.skills : [],
    verified: Boolean(candidate.isVerified || candidate.verified),
    availability: candidate.profile?.availability || 'Open to work',
    summary:
      candidate.profile?.summary ||
      'Profile is available for hiring and job opportunities.',
    blurredContact: maskContact(candidate.email || candidate.phone),
    contactEmail: candidate.email || '',
    contactPhone: candidate.phone || '',
  };
};

const applicationStatusMap = {
  applied: 'Application Received',
  reviewing: 'Under Review',
  shortlisted: 'Shortlisted',
  interview: 'Interview Scheduled',
  selected: 'Selected',
  rejected: 'Rejected',
  hired: 'Hired',
};

export const normalizeApplication = (application = {}) => {
  const normalizedJob = normalizeJob(application.job || {});

  return {
    id: application._id || application.id,
    company: normalizedJob.company,
    position: normalizedJob.title,
    status: applicationStatusMap[application.status] || application.status || 'Applied',
    rawStatus: application.status || 'applied',
    date: formatDate(application.appliedDate || application.createdAt),
    createdAt: application.appliedDate || application.createdAt,
    fitScore: application.fitScore || null,
    note: application.notes || '',
    candidateName: application.candidate?.name || '',
    candidateRole: application.candidate?.profile?.headline || '',
    candidateLocation: application.location || '',
    candidateSkills: application.skills || [],
    coverLetter: application.coverLetter || '',
    jobId: normalizedJob.id,
    job: normalizedJob,
    isViewed: Boolean(application.isViewed),
  };
};

export const calculateProfileCompletion = (user = {}) => {
  const profile = user.profile || {};
  const checks = [
    Boolean(user.name),
    Boolean(user.email),
    Boolean(user.phone),
    Boolean(profile.headline),
    Boolean(profile.summary),
    Array.isArray(profile.skills) && profile.skills.length > 0,
    Boolean(profile.location?.city),
    Boolean(profile.resume),
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
};

export default {
  formatSalary,
  truncate,
  formatDate,
  formatCompactNumber,
  debounce,
  isValidEmail,
  splitList,
  getDashboardPath,
  normalizeJob,
  normalizeCandidate,
  normalizeApplication,
  calculateProfileCompletion,
};
