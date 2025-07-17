import instance from "./customize-axios";

// =============Staff Booking Management APIs============
const getAllBookingsAPI = async (status = null, date = null) => {
  try {
    const params = {};
    if (status) params.status = status;
    if (date) params.date = date;

    const response = await instance.get('/api/bookings/all', { params });
    console.log('Get all bookings success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get all bookings error:', error.response?.data || error.message);
    throw error;
  }
};

const getBookingsByStatusAPI = async (status, pageNumber = 1, pageSize = 100) => {
  try {
    const response = await instance.get(`/api/bookings/status/${status}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    console.log('Get bookings by status success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get bookings by status error:', error.response?.data || error.message);
    throw error;
  }
};

const getBookingByIdAPI = async (bookingId) => {
  try {
    const response = await instance.get(`/api/bookings/${bookingId}/admin`);
    console.log('Get booking by ID success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get booking by ID error:', error.response?.data || error.message);
    throw error;
  }
};

const updateBookingStatusAPI = async (bookingId, status) => {
  try {
    const response = await instance.patch(`/api/bookings/${bookingId}/status`, { status });
    console.log('Update booking status success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update booking status error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Staff Sample Collection APIs============
const markSampleCollectedAPI = async (bookingId, sampleData) => {
  try {
    const requestData = {
      status: 'SAMPLE_COLLECTED',
      description: sampleData.notes || sampleData.sampleNotes,
      resultDate: sampleData.resultDeliveryDate || sampleData.resultDate
    };

    const response = await instance.patch(`/api/bookings/${bookingId}/status`, requestData);
    console.log('Mark sample collected success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Mark sample collected error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Staff Results Management APIs============
const uploadTestResultAPI = async (bookingId, resultData) => {
  try {
    const response = await instance.post(`/api/services/testing-services/bookings/${bookingId}/results`, resultData);
    console.log('Upload test result success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Upload test result error:', error.response?.data || error.message);
    throw error;
  }
};

const getTestResultAPI = async (bookingId) => {
  try {
    const response = await instance.get(`/api/services/testing-services/bookings/${bookingId}/results`);
    console.log('Get test result success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get test result error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Staff Service Management APIs============
const getAllTestingServicesAPI = async () => {
  try {
    const response = await instance.get('/api/services/testing-services');
    console.log('Get all testing services success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get all testing services error:', error.response?.data || error.message);
    throw error;
  }
};

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

const updateTestingServiceAPI = async (serviceId, serviceData) => {
  try {
    const response = await instance.put(`/api/admin/testing-services/${serviceId}`, serviceData);
    console.log('Update testing service success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update testing service error:', error.response?.data || error.message);
    throw error;
  }
};

const deleteTestingServiceAPI = async (serviceId) => {
  try {
    const response = await instance.delete(`/api/admin/testing-services/${serviceId}`);
    console.log('Delete testing service success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete testing service error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Staff Dashboard APIs============
const getStaffDashboardStatsAPI = async () => {
  try {
    const response = await instance.get('/api/staff/dashboard/stats');
    console.log('Get staff dashboard stats success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get staff dashboard stats error:', error.response?.data || error.message);
    throw error;
  }
};

const getBookingsByDateRangeAPI = async (startDate, endDate) => {
  try {
    const response = await instance.get('/api/staff/bookings/date-range', {
      params: { startDate, endDate }
    });
    console.log('Get bookings by date range success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get bookings by date range error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Test Result API============
const updateTestResultAPI = async (bookingId, resultData) => {
  try {
    const response = await instance.patch(`/api/bookings/${bookingId}/test-result`, resultData);
    console.log('Update test result success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update test result error:', error.response?.data || error.message);
    throw error;
  }
};

// StaffService class
class StaffService {
  // Booking Management
  async getAllBookings(status, date) {
    try {
      const response = await getAllBookingsAPI(status, date);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getBookingsByStatus(status, pageNumber = 1, pageSize = 100) {
    try {
      const response = await getBookingsByStatusAPI(status, pageNumber, pageSize);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getBookingById(bookingId) {
    try {
      const response = await getBookingByIdAPI(bookingId);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateBookingStatus(bookingId, status) {
    try {
      const response = await updateBookingStatusAPI(bookingId, status);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Sample Collection
  async markSampleCollected(bookingId, sampleData) {
    try {
      const response = await markSampleCollectedAPI(bookingId, sampleData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Results Management
  async uploadTestResult(bookingId, resultData) {
    try {
      const response = await uploadTestResultAPI(bookingId, resultData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getTestResult(bookingId) {
    try {
      const response = await getTestResultAPI(bookingId);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Service Management
  async getAllTestingServices() {
    try {
      const response = await getAllTestingServicesAPI();
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createTestingService(serviceData) {
    try {
      const response = await createTestingServiceAPI(serviceData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateTestingService(serviceId, serviceData) {
    try {
      const response = await updateTestingServiceAPI(serviceId, serviceData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteTestingService(serviceId) {
    try {
      const response = await deleteTestingServiceAPI(serviceId);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Dashboard
  async getStaffDashboardStats() {
    try {
      const response = await getStaffDashboardStatsAPI();
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getBookingsByDateRange(startDate, endDate) {
    try {
      const response = await getBookingsByDateRangeAPI(startDate, endDate);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update Test Result
  async updateTestResult(bookingId, resultData) {
    try {
      const response = await updateTestResultAPI(bookingId, resultData);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
const staffService = new StaffService();
export default staffService;

// Export individual API functions
export {
  // Booking Management
  getAllBookingsAPI,
  getBookingsByStatusAPI,
  getBookingByIdAPI,
  updateBookingStatusAPI,

  // Sample Collection
  markSampleCollectedAPI,
  
  // Results Management
  uploadTestResultAPI,
  getTestResultAPI,
  
  // Service Management
  getAllTestingServicesAPI,
  createTestingServiceAPI,
  updateTestingServiceAPI,
  deleteTestingServiceAPI,
  
  // Dashboard
  getStaffDashboardStatsAPI,
  getBookingsByDateRangeAPI,

  // Test Result
  updateTestResultAPI
};
