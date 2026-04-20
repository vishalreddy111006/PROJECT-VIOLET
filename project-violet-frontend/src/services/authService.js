import api from './api';

export const authService = {
  // Register new user
  register: async (data) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (data) => {
    const response = await api.post('/api/auth/verify-otp', data);
    return response.data;
  },

  // Login
  login: async (data) => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },

  // Resend OTP
  resendOTP: async (data) => {
    const response = await api.post('/api/auth/resend-otp', data);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const formData = new FormData();
    
    if (data.name) formData.append('name', data.name);
    if (data.lastName) formData.append('lastName', data.lastName);
    if (data.email) formData.append('email', data.email);
    if (data.profileImage) formData.append('profileImage', data.profileImage);

    const response = await api.put('/api/auth/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Upload ID document (Admin)
  uploadIDDocument: async (file) => {
    const formData = new FormData();
    formData.append('idDocument', file);

    const response = await api.post('/api/auth/upload-id', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
