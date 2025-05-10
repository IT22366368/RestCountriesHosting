import axios from 'axios';

// Get the API URL from environment variables or use the default
// For Create React App, environment variables must start with REACT_APP_
// For Vite, they should start with VITE_
const API_URL = 
  
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  'https://rest-countries-hosting.vercel.app/api';

// Create an axios instance with custom configuration
const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending/receiving cookies with requests
});

// Request interceptor to handle errors or add headers
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = 
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      'Something went wrong';
    
    return Promise.reject({ message });
  }
);

const api = {
  // User authentication APIs
  register: async (userData) => {
    return await instance.post('/users/register', userData);
  },
  
  login: async (credentials) => {
    return await instance.post('/users/login', credentials);
  },
  
  logout: async () => {
    return await instance.post('/users/logout');
  },
  
  // User profile APIs
  getUserProfile: async () => {
    return await instance.get('/users/profile');
  },
  
  updateUserProfile: async (userData) => {
    return await instance.put('/users/profile', userData);
  },
  
  // Country favorites APIs
  addFavoriteCountry: async (countryCode) => {
    return await instance.post('/users/favorites', { countryCode });
  },
  
  removeFavoriteCountry: async (countryCode) => {
    return await instance.delete(`/users/favorites/${countryCode}`);
  },

  // Health check API
  checkHealth: async () => {
    return await instance.get('/health');
  },
  
  // Get the base URL being used by the API
  getBaseUrl: () => {
    return instance.defaults.baseURL;
  }
};

export default api;