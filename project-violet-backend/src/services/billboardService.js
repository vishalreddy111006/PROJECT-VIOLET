import api from './api';

export const billboardService = {
  /**
   * Create a new billboard (Includes File Uploads)
   * @param {FormData} billboardData - The FormData object containing files and JSON strings
   */
  createBillboard: async (billboardData) => {
    try {
      const response = await api.post('/api/billboards', billboardData, {
        headers: {
          // CRITICAL: Tells the backend to expect files mixed with text
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating billboard:', error);
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  /**
   * Get all billboards (with optional filters)
   */
  getBillboards: async (params = {}) => {
    try {
      const response = await api.get('/api/billboards', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get recommendations using the  Smart Match Engine
   */
  getRecommendations: async (preferences) => {
    try {
      const response = await api.post('/api/billboards/recommendations', preferences);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get a single billboard by ID
   */
  getBillboardById: async (id) => {
    try {
      const response = await api.get(`/api/billboards/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};