// Frontend config for CIAP (Vite)
const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const COMMUNITY_NAME =
  import.meta.env.VITE_COMMUNITY || 'Acornhoek';

export const ENDPOINTS = {
  notices: `${API_BASE}/notices`,
  jobs: `${API_BASE}/jobs`,
  skills: `${API_BASE}/skills`,
  directory: `${API_BASE}/directory`,
  communities: `${API_BASE}/communities`,
  submit: (type) => `${API_BASE}/submit/${type}`,              // POST
  approve: (type, id) => `${API_BASE}/admin/approve/${type}/${id}`, // POST
  health: `${API_BASE}/health`
};

export { API_BASE };
