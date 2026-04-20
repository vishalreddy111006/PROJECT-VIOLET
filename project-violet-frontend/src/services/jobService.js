import api from './api';

export const jobService = {
  // Get all jobs
  getJobs: async (params) => {
    const response = await api.get('/api/jobs', { params });
    return response.data;
  },

  // Get job by ID
  getJobById: async (id) => {
    const response = await api.get(`/api/jobs/${id}`);
    return response.data;
  },

  // Get my jobs
  getMyJobs: async (params) => {
    const response = await api.get('/api/jobs/my/assignments', { params });
    return response.data;
  },

  // Accept job
  acceptJob: async (id) => {
    const response = await api.put(`/api/jobs/${id}/accept`);
    return response.data;
  },

  // Reject job
  rejectJob: async (id, reason) => {
    const response = await api.put(`/api/jobs/${id}/reject`, { reason });
    return response.data;
  },

  // Start job
  startJob: async (id) => {
    const response = await api.put(`/api/jobs/${id}/start`);
    return response.data;
  },

  // Complete job
  completeJob: async (id, data) => {
    const formData = new FormData();

    if (data.notes) {
      formData.append('notes', data.notes);
    }

    // Add proof images
    if (data.proofImages) {
      data.proofImages.forEach((file) => {
        formData.append('proofImages', file);
      });
    }

    const response = await api.put(`/api/jobs/${id}/complete`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update agent location
  updateLocation: async (latitude, longitude) => {
    const response = await api.put('/api/jobs/agent/location', {
      latitude,
      longitude,
    });
    return response.data;
  },

  // Get nearby jobs
  getNearbyJobs: async (latitude, longitude, radius) => {
    const response = await api.post('/api/jobs/nearby', {
      latitude,
      longitude,
      radius,
    });
    return response.data;
  },
};
