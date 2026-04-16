export const platformStats = [
  { label: 'Verified Jobs', value: '12.4k', detail: '312 added this week' },
  { label: 'Candidate Profiles', value: '48k', detail: 'with city and salary data' },
  { label: 'Hiring Employers', value: '3.8k', detail: 'active across India' },
  { label: 'Avg. Fit Score', value: '87%', detail: 'for shortlisted matches' },
];

export const jobCategories = [
  { title: 'Technology', count: 1240, icon: 'code' },
  { title: 'Sales & Marketing', count: 840, icon: 'trend' },
  { title: 'Healthcare', count: 520, icon: 'shield' },
  { title: 'Operations', count: 460, icon: 'briefcase' },
];

export const jobs = [
  {
    id: 1,
    title: 'Frontend React Developer',
    company: 'PixelWorks Labs',
    type: 'Full-time',
    workMode: 'Hybrid',
    city: 'Bengaluru',
    area: 'Indiranagar',
    location: 'Bengaluru, Indiranagar',
    salary: 'Rs 9 LPA - Rs 14 LPA',
    skills: ['React', 'Tailwind', 'JavaScript', 'REST'],
    description:
      'Build fast candidate-facing dashboards, reusable UI components, and job application flows for a growing SaaS team.',
    posted: '2 days ago',
    fitScore: 92,
    applicants: 38,
    urgent: true,
    promoted: true,
    verified: true,
  },
  {
    id: 2,
    title: 'Customer Success Associate',
    company: 'HireNest Services',
    type: 'Part-time',
    workMode: 'On-site',
    city: 'Delhi',
    area: 'Saket',
    location: 'Delhi, Saket',
    salary: 'Rs 32k - Rs 48k / month',
    skills: ['Communication', 'CRM', 'Hindi', 'Excel'],
    description:
      'Support employer onboarding, manage candidate calls, and maintain high response quality across hiring campaigns.',
    posted: 'Today',
    fitScore: 84,
    applicants: 16,
    urgent: false,
    promoted: false,
    verified: true,
  },
  {
    id: 3,
    title: 'Freelance UI Designer',
    company: 'Studio North',
    type: 'Freelance',
    workMode: 'Remote',
    city: 'Mumbai',
    area: 'Remote',
    location: 'Remote, Mumbai preferred',
    salary: 'Rs 1.2L - Rs 2L / project',
    skills: ['Figma', 'Design Systems', 'Research', 'Prototyping'],
    description:
      'Design landing pages, employer job forms, and profile preview screens for high-growth marketplace products.',
    posted: '4 days ago',
    fitScore: 78,
    applicants: 11,
    urgent: false,
    promoted: true,
    verified: true,
  },
  {
    id: 4,
    title: 'Warehouse Operations Lead',
    company: 'UrbanCart Logistics',
    type: 'Temporary',
    workMode: 'On-site',
    city: 'Pune',
    area: 'Hinjewadi',
    location: 'Pune, Hinjewadi',
    salary: 'Rs 45k - Rs 60k / month',
    skills: ['Team Handling', 'Inventory', 'Shift Planning'],
    description:
      'Lead daily warehouse shifts, manage attendance, and coordinate dispatches for seasonal demand.',
    posted: '1 week ago',
    fitScore: 81,
    applicants: 7,
    urgent: true,
    promoted: false,
    verified: true,
  },
];

export const candidateProfiles = [
  {
    id: 1,
    firstName: 'Aarav',
    role: 'React Developer',
    city: 'Bengaluru',
    area: 'Whitefield',
    experience: '3.5 years',
    salary: 'Rs 10 LPA',
    skills: ['React', 'Node.js', 'Tailwind', 'MongoDB', 'Git'],
    verified: true,
    availability: 'Immediate',
    summary: 'Built hiring dashboards, authentication flows, and reusable component libraries.',
    blurredContact: 'Unlock contact',
  },
  {
    id: 2,
    firstName: 'Meera',
    role: 'HR Recruiter',
    city: 'Mumbai',
    area: 'Andheri',
    experience: '5 years',
    salary: 'Rs 8 LPA',
    skills: ['Sourcing', 'Screening', 'ATS', 'Interviewing'],
    verified: true,
    availability: '15 days',
    summary: 'Managed volume hiring for sales, support, and operations teams across metro cities.',
    blurredContact: 'Unlock contact',
  },
  {
    id: 3,
    firstName: 'Kabir',
    role: 'Operations Supervisor',
    city: 'Pune',
    area: 'Wakad',
    experience: '6 years',
    salary: 'Rs 7.2 LPA',
    skills: ['Inventory', 'Vendor Ops', 'Excel', 'Team Handling'],
    verified: false,
    availability: '30 days',
    summary: 'Runs shift rosters, vendor SLAs, and city-wise fulfillment performance reports.',
    blurredContact: 'Unlock contact',
  },
];

export const applications = [
  {
    id: 1,
    company: 'PixelWorks Labs',
    position: 'Frontend React Developer',
    status: 'Interview Scheduled',
    date: '2 days ago',
    fitScore: 92,
  },
  {
    id: 2,
    company: 'HireNest Services',
    position: 'Customer Success Associate',
    status: 'Application Received',
    date: '5 days ago',
    fitScore: 84,
  },
  {
    id: 3,
    company: 'Studio North',
    position: 'Freelance UI Designer',
    status: 'Shortlisted',
    date: '1 week ago',
    fitScore: 78,
  },
];

export const employerJobs = [
  {
    id: 1,
    title: 'Frontend React Developer',
    status: 'Active',
    applicants: 38,
    shortlisted: 9,
    budget: 'Rs 4,800 ad spend',
    expires: '14 days left',
  },
  {
    id: 2,
    title: 'Support Team Lead',
    status: 'Pending Admin',
    applicants: 0,
    shortlisted: 0,
    budget: 'Free listing',
    expires: 'Awaiting approval',
  },
  {
    id: 3,
    title: 'Content Moderator',
    status: 'Closed',
    applicants: 64,
    shortlisted: 12,
    budget: 'Rs 2,200 ad spend',
    expires: 'Closed yesterday',
  },
];

export const applicantQueue = [
  { id: 1, name: 'Aarav Sharma', role: 'React Developer', note: 'Strong portfolio', stage: 'Shortlisted' },
  { id: 2, name: 'Nisha Rao', role: 'Frontend Engineer', note: 'Needs salary discussion', stage: 'Review' },
  { id: 3, name: 'Irfan Khan', role: 'UI Developer', note: 'Available immediately', stage: 'Interview' },
];

export const adminQueue = [
  {
    id: 1,
    title: 'Support Team Lead',
    company: 'NorthStar BPO',
    risk: 'Low',
    submitted: '18 min ago',
    checks: ['Phone OTP verified', 'Email confirmed', 'Duplicate scan clear'],
  },
  {
    id: 2,
    title: 'Data Entry Executive',
    company: 'QuickTask Hub',
    risk: 'Medium',
    submitted: '1 hour ago',
    checks: ['Salary below market', 'Company GST pending', 'Location verified'],
  },
  {
    id: 3,
    title: 'Field Sales Associate',
    company: 'MetroPay',
    risk: 'Low',
    submitted: '3 hours ago',
    checks: ['Employer verified', 'Ad payment received', 'No duplicate posting'],
  },
];

export const activityMetrics = [
  { label: 'Active users', value: '8,420', trend: '+14%' },
  { label: 'Time spent', value: '11m 28s', trend: '+8%' },
  { label: 'Less applicant jobs', value: '124', trend: '-6%' },
  { label: 'Paid ads live', value: '86', trend: '+19%' },
];

export const cityInsights = [
  { city: 'Bengaluru', jobs: 420, candidates: 3400 },
  { city: 'Delhi NCR', jobs: 360, candidates: 2800 },
  { city: 'Mumbai', jobs: 310, candidates: 2350 },
  { city: 'Pune', jobs: 220, candidates: 1760 },
];

export const profileChecklist = [
  { label: 'Personal information', done: true },
  { label: 'Professional information', done: true },
  { label: 'Education details', done: true },
  { label: 'Aadhaar verification', done: false },
  { label: 'CV export enabled', done: true },
];
