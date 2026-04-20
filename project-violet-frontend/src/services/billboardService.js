import api from './api';

export const billboardService = {
  // Get all billboards
  getBillboards: async (params) => {
    const response = await api.get('/api/billboards', { params });
    return response.data;
  },

  // Get billboard by ID
  getBillboardById: async (id) => {
    const response = await api.get(`/api/billboards/${id}`);
    return response.data;
  },

  // Create billboard (Admin)
  createBillboard: async (data) => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('location', JSON.stringify(data.location));
    formData.append('specifications', JSON.stringify(data.specifications));
    formData.append('pricing', JSON.stringify(data.pricing));
    
    if (data.tags) {
      formData.append('tags', JSON.stringify(data.tags));
    }

    // Add images
    if (data.billboardImages) {
      data.billboardImages.forEach((file) => {
        formData.append('billboardImages', file);
      });
    }

    // Add documents
    if (data.documents) {
      data.documents.forEach((file) => {
        formData.append('documents', file);
      });
    }

    const response = await api.post('/api/billboards', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update billboard (Admin)
  updateBillboard: async (id, data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === 'billboardImages' && data[key]) {
        data[key].forEach((file) => {
          formData.append('billboardImages', file);
        });
      } else if (data[key] !== undefined && data[key] !== null) {
        if (typeof data[key] === 'object' && !(data[key] instanceof File)) {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    });

    const response = await api.put(`/api/billboards/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete billboard (Admin)
  deleteBillboard: async (id) => {
    const response = await api.delete(`/api/billboards/${id}`);
    return response.data;
  },

  // Get my billboards (Admin)
  getMyBillboards: async () => {
    const response = await api.get('/api/billboards/my/listings');
    return response.data;
  },

  // Get recommendations
  getRecommendations: async (data) => {
    const response = await api.post('/api/billboards/recommendations', data);
    return response.data;
  },

  // Get similar billboards
  getSimilarBillboards: async (id) => {
    const response = await api.get(`/api/billboards/${id}/similar`);
    return response.data;
  },

  // Search nearby billboards
  searchNearby: async (data) => {
    const response = await api.post('/api/billboards/search/nearby', data);
    return response.data;
  },
};
