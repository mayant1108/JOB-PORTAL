const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const getAuthHeaders = ({ hasJsonBody = false, includeAuth = true } = {}) => {
  const headers = {};
  const token = localStorage.getItem('token');

  if (hasJsonBody) {
    headers['Content-Type'] = 'application/json';
  }

  if (includeAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const createQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    query.set(key, String(value));
  });

  return query.toString();
};

const parseResponse = async (response) => {
  const raw = await response.text();
  let data = {};

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = {
        success: response.ok,
        message: raw,
      };
    }
  }

  if (!response.ok) {
    return {
      success: false,
      message: data.message || `Request failed with status ${response.status}`,
      ...data,
    };
  }

  return data.success === undefined
    ? { success: true, ...data }
    : data;
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, options);
  return parseResponse(response);
};

const api = {
  login: async (credentials) =>
    request('/auth/login', {
      method: 'POST',
      headers: getAuthHeaders({ hasJsonBody: true, includeAuth: false }),
      body: JSON.stringify(credentials),
    }),

  signup: async (userData) =>
    request('/auth/register', {
      method: 'POST',
      headers: getAuthHeaders({ hasJsonBody: true, includeAuth: false }),
      body: JSON.stringify(userData),
    }),

  getProfile: async () =>
    request('/users/profile', {
      headers: getAuthHeaders(),
    }),

  updateProfile: async (profileData) =>
    request('/users', {
      method: 'PUT',
      headers: getAuthHeaders({ hasJsonBody: true }),
      body: JSON.stringify(profileData),
    }),

  uploadFile: async (formData, type) =>
    request(`/users/${type === 'resume' ? 'upload-resume' : 'upload-photo'}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    }),

  getJobs: async (params = {}) => {
    const queryString = createQueryString(params);
    return request(`/jobs${queryString ? `?${queryString}` : ''}`);
  },

  getJob: async (id) => request(`/jobs/${id}`),

  createJob: async (jobData) =>
    request('/jobs', {
      method: 'POST',
      headers: getAuthHeaders({ hasJsonBody: true }),
      body: JSON.stringify(jobData),
    }),

  getMyJobs: async () =>
    request('/jobs/my-jobs', {
      headers: getAuthHeaders(),
    }),

  applyJob: async (jobId, coverLetter = '') =>
    request('/applications', {
      method: 'POST',
      headers: getAuthHeaders({ hasJsonBody: true }),
      body: JSON.stringify({ jobId, coverLetter }),
    }),

  getMyApplications: async () =>
    request('/applications/my-applications', {
      headers: getAuthHeaders(),
    }),

  getJobApplications: async (jobId) =>
    request(`/applications/job/${jobId}`, {
      headers: getAuthHeaders(),
    }),

  updateApplicationStatus: async (applicationId, status) =>
    request(`/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders({ hasJsonBody: true }),
      body: JSON.stringify({ status }),
    }),

  getCandidates: async (params = {}) => {
    const queryString = createQueryString(params);
    return request(`/users/candidates${queryString ? `?${queryString}` : ''}`);
  },

  getNotifications: async () =>
    request('/users/notifications', {
      headers: getAuthHeaders(),
    }),

  markNotificationRead: async (notificationId) =>
    request(`/users/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: getAuthHeaders({ hasJsonBody: true }),
    }),

  markAllNotificationsRead: async () =>
    request('/users/notifications/read-all', {
      method: 'PUT',
      headers: getAuthHeaders({ hasJsonBody: true }),
    }),

  getAdminStats: async () =>
    request('/admin/stats', {
      headers: getAuthHeaders(),
    }),

  approveJob: async (jobId) =>
    request(`/admin/jobs/${jobId}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders({ hasJsonBody: true }),
    }),

  deleteAdminJob: async (jobId) =>
    request(`/admin/jobs/${jobId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }),
};

export default api;
