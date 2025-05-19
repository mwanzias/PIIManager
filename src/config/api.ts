// API configuration
const API_CONFIG = {
  baseUrl: process.env.API_BACKEND_URL || 'http://localhost:8000',
  endpoints: {
    login: '/auth/login',
    signup: '/auth/signup',
  }
};

export default API_CONFIG;
