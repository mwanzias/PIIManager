// API configuration
const API_CONFIG = {
  baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
  endpoints: {
    login: '/auth/login',
    signup: '/auth/signup',
  }
};

export default API_CONFIG;
