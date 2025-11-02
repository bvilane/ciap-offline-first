const BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';
export const COMMUNITY_NAME = process.env.REACT_APP_COMMUNITY || 'Acornhoek';
export const ENDPOINTS = {
  notices: `${BASE}/notices`,
  jobs: `${BASE}/jobs`,
  skills: `${BASE}/skills`,
  directory: `${BASE}/directory`,
};
