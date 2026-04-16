// API service for job portal
const API_BASE = '/api';

const api = {
  // Auth
  login: async (credentials) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  signup: async (userData) => {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Jobs
  getJobs: async () => {
    const response = await fetch(`${API_BASE}/jobs`);
    return response.json();
  },

  getJob: async (id) => {
    const response = await fetch(`${API_BASE}/jobs/${id}`);
    return response.json();
  },

  createJob: async (jobData) => {
    const response = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(jobData),
    });
    return response.json();
  },

  // Applications
  applyJob: async (jobId) => {
    const response = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ jobId }),
    });
    return response.json();
  },

  getApplications: async () => {
    const response = await fetch(`${API_BASE}/applications`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  }
};

export default api;

