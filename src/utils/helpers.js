// Utility functions for the job portal

// Format salary range
export const formatSalary = (salary) => {
  if (!salary) return 'Salary not specified';

  if (typeof salary === 'string' && /rs|lpa|month|project/i.test(salary)) {
    return salary;
  }
  
  const cleanSalary = salary.replace(/[^\d,-]/g, '');
  const parts = cleanSalary.split('-');
  
  const formatted = parts.map(part => {
    const num = parseInt(part.replace(/,/g, ''));
    if (isNaN(num)) return part;
    
    if (num >= 1000000) {
      return `Rs ${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `Rs ${(num / 1000).toFixed(0)}k`;
    }
    return `Rs ${num.toLocaleString()}`;
  }).join(' - ');
  
  return formatted;
};

// Truncate text with ellipsis
export const truncate = (text, maxLength = 120) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 31) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return date.toLocaleDateString();
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export default {
  formatSalary,
  truncate,
  formatDate,
  debounce,
  isValidEmail
};

