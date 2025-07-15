import instance from "./customize-axios";

// =============Consultation Availability APIs============
const getConsultantAvailabilityAPI = async (consultantId, date) => {
  try {
    const response = await instance.get(`/api/consultation/consultant/${consultantId}/availability`, {
      params: { date }
    });
    console.log('Get consultant availability success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get consultant availability error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Consultation Booking APIs============
const bookConsultationAPI = async (bookingData) => {
  try {
    const response = await instance.post('/api/consultation/book', bookingData);
    console.log('Book consultation success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Book consultation error:', error.response?.data || error.message);
    throw error;
  }
};

const getUserBookingsAPI = async (status = null) => {
  try {
    const params = {};
    if (status) params.status = status;
    
    const response = await instance.get('/api/consultation/user-bookings', { params });
    console.log('Get user bookings success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get user bookings error:', error.response?.data || error.message);
    throw error;
  }
};

const getConsultantBookingsAPI = async (date = null, status = null) => {
  try {
    const params = {};
    if (date) params.date = date;
    if (status) params.status = status;
    
    const response = await instance.get('/api/consultation/consultant-bookings', { params });
    console.log('Get consultant bookings success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get consultant bookings error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Consultation Management APIs============
const updateConsultationStatusAPI = async (consultationId, statusData) => {
  try {
    const response = await instance.put(`/api/consultation/${consultationId}/status`, statusData);
    console.log('Update consultation status success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update consultation status error:', error.response?.data || error.message);
    throw error;
  }
};

const getConsultationDetailsAPI = async (consultationId) => {
  try {
    const response = await instance.get(`/api/consultation/${consultationId}`);
    console.log('Get consultation details success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get consultation details error:', error.response?.data || error.message);
    throw error;
  }
};

const cancelConsultationAPI = async (consultationId) => {
  try {
    const response = await instance.put(`/api/consultation/${consultationId}/cancel`);
    console.log('Cancel consultation success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Cancel consultation error:', error.response?.data || error.message);
    throw error;
  }
};

const getUpcomingConsultationsAPI = async () => {
  try {
    const response = await instance.get('/api/consultation/upcoming');
    console.log('Get upcoming consultations success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get upcoming consultations error:', error.response?.data || error.message);
    throw error;
  }
};

export {
  // Availability APIs
  getConsultantAvailabilityAPI,
  
  // Booking APIs
  bookConsultationAPI,
  getUserBookingsAPI,
  getConsultantBookingsAPI,
  
  // Management APIs
  updateConsultationStatusAPI,
  getConsultationDetailsAPI,
  cancelConsultationAPI,
  getUpcomingConsultationsAPI
}; 