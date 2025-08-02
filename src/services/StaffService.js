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
      collectorFullName: sampleData.collectorFullName,
      collectorIdCard: sampleData.collectorIdCard,
      collectorPhoneNumber: sampleData.collectorPhoneNumber || null,
      collectorDateOfBirth: sampleData.collectorDateOfBirth || null,
      collectorGender: sampleData.collectorGender || null,
      relationshipToBooker: sampleData.relationshipToBooker,
      sampleCollectionDate: sampleData.sampleCollectionDate,
      notes: sampleData.notes || null
    };

    const response = await instance.post(`/api/bookings/${bookingId}/sample-collection`, requestData);
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
    console.log('🚀 Calling API: /api/staff/testing-services');
    const response = await instance.get('/api/staff/testing-services');
    console.log('✅ Get all testing services success:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Get all testing services error:', error.response?.data || error.message);
    console.error('❌ Full error:', error);
    throw error;
  }
};

const createTestingServiceAPI = async (serviceData) => {
  try {
    const response = await instance.post('/api/staff/testing-services', serviceData);
    console.log('Create testing service success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create testing service error:', error.response?.data || error.message);
    throw error;
  }
};

const updateTestingServiceAPI = async (serviceId, serviceData) => {
  try {
    const response = await instance.patch(`/api/staff/testing-services/${serviceId}`, serviceData);
    console.log('Update testing service success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update testing service error:', error.response?.data || error.message);
    throw error;
  }
};

const deleteTestingServiceAPI = async (serviceId) => {
  try {
    const response = await instance.delete(`/api/staff/testing-services/${serviceId}`);
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

// Test Result Delivery API
const deliverTestResultAPI = async (bookingId, resultData) => {
  try {
    console.log('📤 Delivering test result for booking:', bookingId, resultData);

    const requestData = {
      resultDeliveryDate: resultData.resultDeliveryDate,
      resultNotes: resultData.resultNotes || null,
      testResult: resultData.testResult || null
    };

    const response = await instance.post(`/api/bookings/${bookingId}/test-result-delivery`, requestData);
    console.log('✅ Test result delivered successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error delivering test result:', error);
    throw error;
  }
};

// StaffService class
class StaffService {
  // Booking Management
  async getAllBookings(status, date) {
    try {
      const data = await getAllBookingsAPI(status, date);
      if (data.success === true) {
        return { success: true, data: data.data || data.content, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  async getBookingsByStatus(status, pageNumber = 1, pageSize = 100) {
    try {
      const data = await getBookingsByStatusAPI(status, pageNumber, pageSize);
      if (data.success === true) {
        return { success: true, data: data.data || data.content, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  async getBookingById(bookingId) {
    try {
      const data = await getBookingByIdAPI(bookingId);
      if (data.success === true) {
        return { success: true, data: data.data || data.content, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  async updateBookingStatus(bookingId, status) {
    try {
      const data = await updateBookingStatusAPI(bookingId, status);
      if (data.success === true) {
        return { success: true, data: data.data || data.content, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  // Sample Collection
  async markSampleCollected(bookingId, sampleData) {
    try {
      const data = await markSampleCollectedAPI(bookingId, sampleData);
      if (data.success === true) {
        return { success: true, data: data.data || data.content, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  // Results Management
  async uploadTestResult(bookingId, resultData) {
    try {
      const data = await uploadTestResultAPI(bookingId, resultData);
      if (data.success === true) {
        return { success: true, data: data.data || data.content, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  async getTestResult(bookingId) {
    try {
      const data = await getTestResultAPI(bookingId);
      if (data.success === true) {
        return { success: true, data: data.data || data.content, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  // Service Management
  async getAllTestingServices() {
    try {
      const data = await getAllTestingServicesAPI();
      // Interceptor đã tự động extract data từ ApiResponse
      // data bây giờ là array services trực tiếp
      return { success: true, data: data, message: 'Lấy danh sách dịch vụ thành công' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  async createTestingService(serviceData) {
    try {
      const data = await createTestingServiceAPI(serviceData);
      if (data.success === true) {
        return { success: true, data: data.data || data.content, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  async updateTestingService(serviceId, serviceData) {
    try {
      const data = await updateTestingServiceAPI(serviceId, serviceData);
      if (data.success === true) {
        return { success: true, data: data.data || data.content, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  async deleteTestingService(serviceId) {
    try {
      const data = await deleteTestingServiceAPI(serviceId);
      if (data.success === true) {
        return { success: true, data: data.data || data.content, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  // Dashboard
  async getStaffDashboardStats() {
    try {
      const data = await getStaffDashboardStatsAPI();
      if (data.success === true) {
        return { success: true, data: data.data || data.content, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  async getBookingsByDateRange(startDate, endDate) {
    try {
      const data = await getBookingsByDateRangeAPI(startDate, endDate);
      if (data.success === true) {
        return { success: true, data: data.data || data.content, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  // Update Test Result
  async updateTestResult(bookingId, resultData) {
    try {
      const data = await updateTestResultAPI(bookingId, resultData);
      if (data.success === true) {
        return { success: true, data: data.data || data.content, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  // Deliver Test Result
  async deliverTestResult(bookingId, resultData) {
    try {
      const data = await deliverTestResultAPI(bookingId, resultData);
      if (data.success === true) {
        return { success: true, data: data.data || data.content, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }



  async createTestingService(serviceData) {
    try {
      const data = await createTestingServiceAPI(serviceData);
      if (data.success === true) {
        return { success: true, data: data.data || data.content, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  async updateTestingService(serviceId, serviceData) {
    try {
      const data = await updateTestingServiceAPI(serviceId, serviceData);
      if (data.success === true) {
        return { success: true, data: data.data || data.content, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  async deleteTestingService(serviceId) {
    try {
      const data = await deleteTestingServiceAPI(serviceId);
      if (data.success === true) {
        return { success: true, data: data.data || data.content, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }
}

const staffService = new StaffService();
export default staffService;

export {
  getAllBookingsAPI,
  getBookingsByStatusAPI,
  getBookingByIdAPI,
  updateBookingStatusAPI,
  markSampleCollectedAPI,
  uploadTestResultAPI,
  getTestResultAPI,
  getAllTestingServicesAPI,
  createTestingServiceAPI,
  updateTestingServiceAPI,
  deleteTestingServiceAPI,
  getStaffDashboardStatsAPI,
  getBookingsByDateRangeAPI,
  updateTestResultAPI,
  deliverTestResultAPI
};
