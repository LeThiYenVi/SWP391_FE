import instance from "./customize-axios";

// =============Testing Services APIs============
const getTestingServicesAPI = async () => {
  try {
    const response = await instance.get('/api/services/testing-services');
    console.log('Get testing services success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get testing services error:', error.response?.data || error.message);
    throw error;
  }
};

const getTestingServiceByIdAPI = async (serviceId) => {
  try {
    const response = await instance.get(`/api/services/testing-services/${serviceId}`);
    console.log('Get testing service by ID success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get testing service by ID error:', error.response?.data || error.message);
    throw error;
  }
};

const getTestingServiceBookingResultsAPI = async (bookingId) => {
  try {
    const response = await instance.get(`/api/services/testing-services/bookings/${bookingId}/results`);
    console.log('Get testing service booking results success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get testing service booking results error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Booking APIs============
const createBookingAPI = async (bookingData) => {
  try {
    const response = await instance.post('/api/bookings', bookingData);
    console.log('Create booking success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create booking error:', error.response?.data || error.message);
    throw error;
  }
};

const getMyBookingsAPI = async () => {
  try {
    const response = await instance.get('/api/bookings/my-bookings');
    console.log('Get my bookings success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get my bookings error:', error.response?.data || error.message);
    throw error;
  }
};

const getBookingByIdAPI = async (bookingId) => {
  try {
    const response = await instance.get(`/api/bookings/${bookingId}/my-booking`);
    console.log('Get booking by ID success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get booking by ID error:', error.response?.data || error.message);
    throw error;
  }
};

const cancelBookingAPI = async (bookingId) => {
  try {
    const response = await instance.patch(`/api/bookings/${bookingId}/cancel`);
    console.log('Cancel booking success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Cancel booking error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Admin Booking APIs (for admin/staff)============
const getAllBookingsForStaffAPI = async () => {
  try {
    const response = await instance.get('/api/bookings/all');
    console.log('Get all bookings for staff success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get all bookings for staff error:', error.response?.data || error.message);
    throw error;
  }
};

const getBookingByIdForAdminAPI = async (bookingId) => {
  try {
    const response = await instance.get(`/api/bookings/${bookingId}/admin`);
    console.log('Get booking by ID for admin success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get booking by ID for admin error:', error.response?.data || error.message);
    throw error;
  }
};

const updateBookingStatusAPI = async (bookingId, statusData) => {
  try {
    const response = await instance.patch(`/api/bookings/${bookingId}/status`, statusData);
    console.log('Update booking status success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update booking status error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Booking Tracking APIs============
const markSampleCollectedAPI = async (bookingId, trackingData) => {
  try {
    const response = await instance.post(`/api/booking/${bookingId}/sample-collected`, trackingData);
    console.log('Mark sample collected success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Mark sample collected error:', error.response?.data || error.message);
    throw error;
  }
};

const markResultsReadyAPI = async (bookingId, trackingData) => {
  try {
    const response = await instance.post(`/api/booking/${bookingId}/results-ready`, trackingData);
    console.log('Mark results ready success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Mark results ready error:', error.response?.data || error.message);
    throw error;
  }
};

const markBookingCompletedAPI = async (bookingId, trackingData) => {
  try {
    const response = await instance.post(`/api/booking/${bookingId}/completed`, trackingData);
    console.log('Mark booking completed success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Mark booking completed error:', error.response?.data || error.message);
    throw error;
  }
};

const getBookingTrackingStatusAPI = async (bookingId) => {
  try {
    const response = await instance.get('/api/booking-tracking/status', {
      params: { bookingId }
    });
    console.log('Get booking tracking status success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get booking tracking status error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Admin Testing Service APIs============
const createTestingServiceAPI = async (serviceData) => {
  try {
    const response = await instance.post('/api/admin/testing-services', serviceData);
    console.log('Create testing service success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create testing service error:', error.response?.data || error.message);
    throw error;
  }
};

export {
  // Testing Services APIs
  getTestingServicesAPI,
  getTestingServiceByIdAPI,
  getTestingServiceBookingResultsAPI,
  
  // Booking APIs
  createBookingAPI,
  getMyBookingsAPI,
  getBookingByIdAPI,
  cancelBookingAPI,
  
  // Admin Booking APIs
  getAllBookingsForStaffAPI,
  getBookingByIdForAdminAPI,
  updateBookingStatusAPI,
  
  // Booking Tracking APIs
  markSampleCollectedAPI,
  markResultsReadyAPI,
  markBookingCompletedAPI,
  getBookingTrackingStatusAPI,
  createTestingServiceAPI // Thêm export hàm mới
}; 