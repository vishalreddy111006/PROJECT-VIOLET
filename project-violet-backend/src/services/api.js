import axios from 'axios';

// Create a configured Axios instance
const api = axios.create({
  // Use your environment variable, or fallback to local backend port
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000', 
});

// Request Interceptor: Automatically attach the JWT token to all requests
api.interceptors.request.use(
  (config) => {
    // Assuming you store the token in localStorage upon login
    const token = localStorage.getItem('token'); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors (like expired tokens)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid - force logout
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;