import instance from "./customize-axios";

const getTestingServicesAPI = async () => {
  try {
    const response = await instance.get('/api/services/testing-services');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getTestingServiceByIdAPI = async (id) => {
  try {
    const response = await instance.get(`/api/services/testing-services/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createBookingAPI = async (bookingData) => {
  try {
    const response = await instance.post('/api/bookings', bookingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getMyBookingsAPI = async () => {
  try {
    const response = await instance.get('/api/bookings/my-bookings');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getBookingByIdAPI = async (id) => {
  try {
    const response = await instance.get(`/api/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const cancelBookingAPI = async (id) => {
  try {
    const response = await instance.put(`/api/bookings/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllBookingsForStaffAPI = async () => {
  try {
    const response = await instance.get('/api/admin/bookings');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateBookingStatusAPI = async (id, status) => {
  try {
    const response = await instance.put(`/api/admin/bookings/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const markSampleCollectedAPI = async (bookingId, trackingData) => {
  try {
    const response = await instance.post(`/api/booking/${bookingId}/sample-collected`, trackingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const uploadTestResultAPI = async (bookingId, resultData) => {
  try {
    const response = await instance.post(`/api/services/testing-services/bookings/${bookingId}/results`, resultData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getTestResultAPI = async (bookingId) => {
  try {
    const response = await instance.get(`/api/services/testing-services/bookings/${bookingId}/results`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createTestingServiceAPI = async (serviceData) => {
  try {
    const response = await instance.post('/api/admin/testing-services', serviceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateTestingServiceAPI = async (id, serviceData) => {
  try {
    const response = await instance.put(`/api/admin/testing-services/${id}`, serviceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteTestingServiceAPI = async (id) => {
  try {
    const response = await instance.delete(`/api/admin/testing-services/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getStaffDashboardStatsAPI = async () => {
  try {
    const response = await instance.get('/api/staff/dashboard/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getBookingsByDateRangeAPI = async (startDate, endDate) => {
  try {
    const response = await instance.get('/api/staff/bookings/date-range', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateTestResultAPI = async (bookingId, resultData) => {
  try {
    const response = await instance.put(`/api/staff/bookings/${bookingId}/result`, resultData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

class TestingService {
  async getTestingServices() {
    try {
      const data = await getTestingServicesAPI();
      return { success: true, data: data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async createBooking(bookingData) {
    try {
      const data = await createBookingAPI(bookingData);
      return { success: true, data: data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getMyBookings() {
    try {
      const data = await getMyBookingsAPI();
      return { success: true, data: data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

const testingService = new TestingService();

export default testingService;

export {
  getTestingServicesAPI,
  getTestingServiceByIdAPI,
  createBookingAPI,
  getMyBookingsAPI,
  getBookingByIdAPI,
  cancelBookingAPI,
  getAllBookingsForStaffAPI,
  updateBookingStatusAPI,
  markSampleCollectedAPI,
  uploadTestResultAPI,
  getTestResultAPI,
  createTestingServiceAPI,
  updateTestingServiceAPI,
  deleteTestingServiceAPI,
  getStaffDashboardStatsAPI,
  getBookingsByDateRangeAPI,
  updateTestResultAPI
};
