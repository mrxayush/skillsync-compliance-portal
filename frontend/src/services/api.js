import axios from 'axios';

// If running on Vercel or cloud and VITE_API_BASE_URL is not set, default to Render backend
const DEFAULT_CLOUD_BACKEND = 'https://skillsync-compliance-portal.onrender.com/api';

const resolveBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined') {
    if (window.location.origin.includes('localhost:3000')) {
      return 'http://localhost:8080/api';
    }
    // If hosted on Vercel, point to Render backend
    if (window.location.origin.includes('vercel.app')) {
      return DEFAULT_CLOUD_BACKEND;
    }
  }
  return '/api';
};

const api = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s timeout to allow Render free tier cold-start wakeups
});

// Response interceptor for clear error surfacing
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      'Unable to connect to SkillSync backend server.';
    return Promise.reject(new Error(errorMsg));
  }
);

export default api;
