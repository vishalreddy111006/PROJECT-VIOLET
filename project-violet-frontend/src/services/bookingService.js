import api from './api';

export const bookingService = {
  // Create booking request
  createBooking: async (data) => {
    const formData = new FormData();

    formData.append('billboardId', data.billboardId);
    formData.append('startDate', data.startDate);
    formData.append('endDate', data.endDate);
    formData.append('adContent', JSON.stringify(data.adContent));
    
    if (data.customerNotes) {
      formData.append('customerNotes', data.customerNotes);
    }

    // Add ad content files
    if (data.adContentFiles) {
      data.adContentFiles.forEach((file) => {
        formData.append('adContent', file);
      });
    }

    const response = await api.post('/api/bookings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Get all bookings
  getBookings: async (params) => {
    const response = await api.get('/api/bookings', { params });
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id) => {
    const response = await api.get(`/api/bookings/${id}`);
    return response.data;
  },

  // Accept booking (Admin)
  acceptBooking: async (id, adminNotes) => {
    const response = await api.put(`/api/bookings/${id}/accept`, { adminNotes });
    return response.data;
  },

  // Reject booking (Admin)
  rejectBooking: async (id, adminNotes) => {
    const response = await api.put(`/api/bookings/${id}/reject`, { adminNotes });
    return response.data;
  },

  // Cancel booking (Customer)
  cancelBooking: async (id) => {
    const response = await api.put(`/api/bookings/${id}/cancel`);
    return response.data;
  },
};
