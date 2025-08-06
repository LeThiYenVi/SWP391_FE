import instance from "./customize-axios";

/**
 * STAFF SERVICE - Frontend API Integration for Staff Operations
 * 
 * Service này xử lý tất cả API calls cho staff/admin operations:
 * - Quản lý booking (xem, filter, cập nhật status)
 * - Lấy mẫu xét nghiệm (SampleCollectionForm)
 * - Upload kết quả xét nghiệm (TestResultForm)
 * - Quản lý testing services
 * - Dashboard statistics
 * 
 * Backend Integration:
 * - BE-SWP391/src/main/java/com/example/gender_healthcare_service/controller/BookingController.java
 * - BE-SWP391/src/main/java/com/example/gender_healthcare_service/controller/ServiceController.java
 * - BE-SWP391/src/main/java/com/example/gender_healthcare_service/controller/AdminController.java
 * 
 * Workflow Integration:
 * - Staff lấy mẫu: CONFIRMED → SAMPLE_COLLECTED
 * - Staff upload kết quả: SAMPLE_COLLECTED → COMPLETED
 * - WebSocket notifications cho customer real-time updates
 */

// =============Staff Booking Management APIs============

/**
 * Lấy tất cả booking cho staff quản lý
 * 
 * Frontend: SWP391_FE/src/pages/Staff/StaffAppointments.jsx
 * - Staff xem danh sách tất cả booking để quản lý
 * - Có thể filter theo status, customer, service, date range
 * - Hiển thị booking theo từng status: PENDING, CONFIRMED, SAMPLE_COLLECTED, COMPLETED
 * - Gọi API GET /api/bookings/all với pagination
 * 
 * @param status Filter theo status (optional)
 * @param date Filter theo date (optional)
 * @returns Promise với danh sách booking
 */
const getAllBookingsAPI = async (status = null, date = null) => {
  try {
    let url = '/api/bookings/all';
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (date) params.append('date', date);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await instance.get(url);
    console.log('Get all bookings success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get all bookings error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Lấy booking theo status cụ thể
 * 
 * Frontend: SWP391_FE/src/pages/Staff/StaffAppointments.jsx
 * - Staff có thể xem booking theo từng status riêng biệt
 * - Ví dụ: xem tất cả booking PENDING để xác nhận
 * - Xem tất cả booking SAMPLE_COLLECTED để upload kết quả
 * - Gọi API GET /api/bookings/status/{status}
 * 
 * @param status Status cần filter (PENDING, CONFIRMED, SAMPLE_COLLECTED, COMPLETED)
 * @param pageNumber Số trang (default: 1)
 * @param pageSize Số booking mỗi trang (default: 100)
 * @returns Promise với danh sách booking theo status
 */
const getBookingsByStatusAPI = async (status, pageNumber = 1, pageSize = 100) => {
  try {
    const response = await instance.get(`/api/bookings/status/${status}`, {
      params: { pageNumber, pageSize }
    });
    console.log('Get bookings by status success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get bookings by status error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Lấy chi tiết booking theo ID
 * 
 * Frontend: SWP391_FE/src/pages/Staff/StaffAppointments.jsx
 * - Staff click vào booking để xem chi tiết
 * - Hiển thị thông tin đầy đủ: customer, service, timeslot, status
 * - Gọi API GET /api/bookings/{bookingId}/admin
 * 
 * @param bookingId ID của booking cần xem
 * @returns Promise với thông tin chi tiết booking
 */
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

/**
 * Cập nhật trạng thái booking
 * 
 * Frontend: SWP391_FE/src/pages/Staff/StaffAppointments.jsx
 * - Staff có thể cập nhật trạng thái booking (CONFIRMED, SAMPLE_COLLECTED, COMPLETED)
 * - Gọi API PATCH /api/bookings/{bookingId}/status
 * - Trigger WebSocket notification đến customer tracking page
 * 
 * @param bookingId ID của booking cần cập nhật
 * @param status Status mới
 * @returns Promise với booking đã cập nhật
 */
const updateBookingStatusAPI = async (bookingId, status) => {
  try {
    const response = await instance.patch(`/api/bookings/${bookingId}/status`, {
      status: status
    });
    console.log('Update booking status success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update booking status error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * WORKFLOW STEP 3: Staff lấy mẫu xét nghiệm và nhập tên bác sĩ phụ trách
 * 
 * Frontend: SWP391_FE/src/components/staff/SampleCollectionForm.jsx
 * - Staff điền thông tin người lấy mẫu và tên bác sĩ phụ trách
 * - Gọi API POST /api/bookings/{bookingId}/sample-collection
 * - Tạo SampleCollectionProfile với doctorName field
 * - Chuyển status từ CONFIRMED → SAMPLE_COLLECTED
 * - Trigger WebSocket notification: CONFIRMED → SAMPLE_COLLECTED
 * - Customer nhận được real-time update về việc đã lấy mẫu
 * 
 * @param bookingId ID của booking cần lấy mẫu
 * @param sampleData Thông tin người lấy mẫu và doctorName
 * @returns Promise với booking đã cập nhật
 */
const markSampleCollectedAPI = async (bookingId, sampleData) => {
  try {
    const response = await instance.post(`/api/bookings/${bookingId}/sample-collection`, sampleData);
    console.log('Mark sample collected success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Mark sample collected error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Staff Results Management APIs============

/**
 * WORKFLOW STEP 4: Staff upload kết quả xét nghiệm
 * 
 * Frontend: SWP391_FE/src/components/staff/TestResultForm.jsx
 * - Staff nhập kết quả xét nghiệm chi tiết
 * - Gọi API POST /api/services/testing-services/bookings/{bookingId}/results
 * - Tự động chuyển status từ SAMPLE_COLLECTED → COMPLETED
 * - Trigger WebSocket notification đến customer tracking page
 * - Customer nhận được real-time update và có thể xem kết quả ngay
 * 
 * @param bookingId ID của booking cần cập nhật kết quả
 * @param resultData {result, resultType, notes, resultDate}
 * @returns Promise với booking đã cập nhật
 */
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

/**
 * Lấy kết quả xét nghiệm của booking
 * 
 * Frontend: SWP391_FE/src/components/staff/TestResultForm.jsx
 * - Staff có thể xem kết quả đã upload trước đó
 * - Gọi API GET /api/services/testing-services/bookings/{bookingId}/results
 * - Hiển thị kết quả trong form để chỉnh sửa
 * 
 * @param bookingId ID của booking cần xem kết quả
 * @returns Promise với thông tin kết quả
 */
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

/**
 * Lấy tất cả testing services
 * 
 * Frontend: SWP391_FE/src/pages/Staff/StaffUploadResult.jsx
 * - Staff xem danh sách các dịch vụ xét nghiệm có sẵn
 * - Gọi API GET /api/staff/testing-services
 * - Hiển thị tên service, mô tả, giá, thời gian xử lý
 * 
 * @returns Promise với danh sách testing services
 */
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

/**
 * Tạo testing service mới
 * 
 * Frontend: SWP391_FE/src/pages/admin/AdminTestingServices.jsx
 * - Admin tạo dịch vụ xét nghiệm mới
 * - Gọi API POST /api/staff/testing-services
 * - Lưu thông tin: tên, mô tả, giá, thời gian xử lý
 * 
 * @param serviceData Thông tin service mới
 * @returns Promise với service đã tạo
 */
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

/**
 * Cập nhật testing service
 * 
 * Frontend: SWP391_FE/src/pages/admin/AdminTestingServices.jsx
 * - Admin chỉnh sửa thông tin dịch vụ xét nghiệm
 * - Gọi API PATCH /api/staff/testing-services/{serviceId}
 * - Cập nhật: tên, mô tả, giá, thời gian xử lý
 * 
 * @param serviceId ID của service cần cập nhật
 * @param serviceData Thông tin service mới
 * @returns Promise với service đã cập nhật
 */
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

/**
 * Xóa testing service
 * 
 * Frontend: SWP391_FE/src/pages/admin/AdminTestingServices.jsx
 * - Admin xóa dịch vụ xét nghiệm (soft delete)
 * - Gọi API DELETE /api/staff/testing-services/{serviceId}
 * - Service không còn hiển thị cho customer nhưng vẫn trong database
 * 
 * @param serviceId ID của service cần xóa
 * @returns Promise với thông báo thành công
 */
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

/**
 * Lấy thống kê dashboard cho staff
 * 
 * Frontend: SWP391_FE/src/pages/Staff/StaffDashboard.jsx
 * - Hiển thị tổng số booking, booking theo status
 * - Hiển thị số booking theo ngày/tuần/tháng
 * - Gọi API GET /api/staff/dashboard/stats
 * 
 * @returns Promise với thống kê dashboard
 */
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

/**
 * Lấy booking theo khoảng thời gian
 * 
 * Frontend: SWP391_FE/src/pages/Staff/StaffDashboard.jsx
 * - Staff có thể xem booking trong một khoảng thời gian
 * - Hữu ích để lập báo cáo theo ngày/tuần/tháng
 * - Gọi API GET /api/staff/bookings/date-range
 * 
 * @param startDate Ngày bắt đầu
 * @param endDate Ngày kết thúc
 * @returns Promise với danh sách booking trong khoảng thời gian
 */
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

// =============Staff Service Class============

/**
 * StaffService Class - Wrapper cho tất cả staff APIs
 * 
 * Cung cấp interface đơn giản cho frontend components để tương tác với backend
 * Tự động xử lý error handling và response formatting
 * Tập trung vào các operations của staff: quản lý booking, upload kết quả, thống kê
 */
class StaffService {
  /**
   * Lấy tất cả booking cho staff quản lý
   * 
   * @param status Filter theo status (optional)
   * @param date Filter theo date (optional)
   * @returns {success: boolean, data: BookingResponseDTO[], message: string}
   */
  async getAllBookings(status, date) {
    try {
      const data = await getAllBookingsAPI(status, date);
      return { success: true, data: data.data || data.content, message: data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Lấy booking theo status cụ thể
   * 
   * @param status Status cần filter (PENDING, CONFIRMED, SAMPLE_COLLECTED, COMPLETED)
   * @param pageNumber Số trang (default: 1)
   * @param pageSize Số booking mỗi trang (default: 100)
   * @returns {success: boolean, data: BookingResponseDTO[], message: string}
   */
  async getBookingsByStatus(status, pageNumber = 1, pageSize = 100) {
    try {
      const data = await getBookingsByStatusAPI(status, pageNumber, pageSize);
      return { success: true, data: data.data || data.content, message: data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Lấy chi tiết booking theo ID
   * 
   * @param bookingId ID của booking cần xem
   * @returns {success: boolean, data: BookingResponseDTO, message: string}
   */
  async getBookingById(bookingId) {
    try {
      const data = await getBookingByIdAPI(bookingId);
      return { success: true, data: data.data || data.content, message: data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Cập nhật trạng thái booking
   * 
   * @param bookingId ID của booking cần cập nhật
   * @param status Status mới
   * @returns {success: boolean, data: BookingResponseDTO, message: string}
   */
  async updateBookingStatus(bookingId, status) {
    try {
      const data = await updateBookingStatusAPI(bookingId, status);
      return { success: true, data: data.data || data.content, message: data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  /**
   * WORKFLOW STEP 3: Staff lấy mẫu xét nghiệm và nhập tên bác sĩ phụ trách
   * 
   * @param bookingId ID của booking cần lấy mẫu
   * @param sampleData Thông tin người lấy mẫu và doctorName
   * @returns {success: boolean, data: BookingResponseDTO, message: string}
   */
  async markSampleCollected(bookingId, sampleData) {
    try {
      const data = await markSampleCollectedAPI(bookingId, sampleData);
      return { success: true, data: data.data || data.content, message: data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  /**
   * WORKFLOW STEP 4: Staff upload kết quả xét nghiệm
   * 
   * @param bookingId ID của booking cần cập nhật kết quả
   * @param resultData {result, resultType, notes, resultDate}
   * @returns {success: boolean, data: BookingResponseDTO, message: string}
   */
  async uploadTestResult(bookingId, resultData) {
    try {
      const data = await uploadTestResultAPI(bookingId, resultData);
      return { success: true, data: data.data || data.content, message: data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Lấy kết quả xét nghiệm của booking
   * 
   * @param bookingId ID của booking cần xem kết quả
   * @returns {success: boolean, data: BookingResponseDTO, message: string}
   */
  async getTestResult(bookingId) {
    try {
      const data = await getTestResultAPI(bookingId);
      return { success: true, data: data.data || data.content, message: data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Lấy tất cả testing services
   * 
   * @returns {success: boolean, data: TestingServiceResponseDTO[], message: string}
   */
  async getAllTestingServices() {
    try {
      const data = await getAllTestingServicesAPI();
      return { success: true, data: data.data || data.content, message: data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Tạo testing service mới
   * 
   * @param serviceData Thông tin service mới
   * @returns {success: boolean, data: TestingServiceResponseDTO, message: string}
   */
  async createTestingService(serviceData) {
    try {
      const data = await createTestingServiceAPI(serviceData);
      return { success: true, data: data.data || data.content, message: data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Cập nhật testing service
   * 
   * @param serviceId ID của service cần cập nhật
   * @param serviceData Thông tin service mới
   * @returns {success: boolean, data: TestingServiceResponseDTO, message: string}
   */
  async updateTestingService(serviceId, serviceData) {
    try {
      const data = await updateTestingServiceAPI(serviceId, serviceData);
      return { success: true, data: data.data || data.content, message: data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Xóa testing service
   * 
   * @param serviceId ID của service cần xóa
   * @returns {success: boolean, message: string}
   */
  async deleteTestingService(serviceId) {
    try {
      const data = await deleteTestingServiceAPI(serviceId);
      return { success: true, message: data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Lấy thống kê dashboard cho staff
   * 
   * @returns {success: boolean, data: DashboardStats, message: string}
   */
  async getStaffDashboardStats() {
    try {
      const data = await getStaffDashboardStatsAPI();
      return { success: true, data: data.data || data.content, message: data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Lấy booking theo khoảng thời gian
   * 
   * @param startDate Ngày bắt đầu
   * @param endDate Ngày kết thúc
   * @returns {success: boolean, data: BookingResponseDTO[], message: string}
   */
  async getBookingsByDateRange(startDate, endDate) {
    try {
      const data = await getBookingsByDateRangeAPI(startDate, endDate);
      return { success: true, data: data.data || data.content, message: data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  // Legacy methods for backward compatibility
  async updateTestResult(bookingId, resultData) {
    return this.uploadTestResult(bookingId, resultData);
  }

  async deliverTestResult(bookingId, resultData) {
    return this.uploadTestResult(bookingId, resultData);
  }
}

// Legacy API functions for backward compatibility
const deliverTestResultAPI = async (bookingId, resultData) => {
  try {
    const response = await instance.post(`/api/services/testing-services/bookings/${bookingId}/results`, resultData);
    console.log('Deliver test result success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Deliver test result error:', error.response?.data || error.message);
    throw error;
  }
};

// Export individual API functions for direct use
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
  deliverTestResultAPI
};

// Export the service class instance as default
export default new StaffService();
