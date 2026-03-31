const STATUS_CLASSES = {
  Applied: 'bg-blue-100 text-blue-700',
  'Under Review': 'bg-amber-100 text-amber-800',
  Interview: 'bg-violet-100 text-violet-700',
  Rejected: 'bg-rose-100 text-rose-700',
  Hired: 'bg-green-100 text-green-700',
};

export const getApplicationStatusClass = (status) =>
  STATUS_CLASSES[status] || 'bg-slate-100 text-slate-700';

export const isInterviewStatus = (status) =>
  status === 'Interview' || status === 'Hired';

export const isReviewStatus = (status) =>
  status === 'Applied' || status === 'Under Review';
