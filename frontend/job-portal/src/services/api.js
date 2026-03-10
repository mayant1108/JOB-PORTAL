const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for making API calls
const apiCall = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  register: (userData) => apiCall('/users/signup', 'POST', userData),
  login: (credentials) => apiCall('/users/login', 'POST', credentials),
  getProfile: () => apiCall('/users/profile', 'GET'),
  updateProfile: (userData) => apiCall('/users/profile', 'PUT', userData),
  getAllUsers: () => apiCall('/users', 'GET'),
  deleteUser: (id) => apiCall(`/users/${id}`, 'DELETE'),
};

// Job APIs
export const jobAPI = {
  getAllJobs: () => apiCall('/jobs', 'GET'),
  getJobById: (id) => apiCall(`/jobs/${id}`, 'GET'),
  createJob: (jobData) => apiCall('/jobs', 'POST', jobData),
  updateJob: (id, jobData) => apiCall(`/jobs/${id}`, 'PUT', jobData),
  deleteJob: (id) => apiCall(`/jobs/${id}`, 'DELETE'),
  getJobsByCompany: (company) => apiCall(`/jobs?company=${company}`, 'GET'),
};

// Application APIs
export const applicationAPI = {
  applyForJob: (applicationData) => apiCall('/applications', 'POST', applicationData),
  getMyApplications: () => apiCall('/applications/my', 'GET'),
  getAllApplications: () => apiCall('/applications', 'GET'),
  updateApplicationStatus: (id, status) => apiCall(`/applications/${id}`, 'PUT', { status }),
};

export default API_BASE_URL;

