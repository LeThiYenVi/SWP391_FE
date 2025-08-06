import instance from "./customize-axios";

/**
 * BOOKING SERVICE - Frontend API Integration
 * 
 * Service này xử lý tất cả API calls liên quan đến booking workflow:
 * 1. Customer tạo booking (PENDING)
 * 2. Customer xác nhận booking (CONFIRMED)
 * 3. Staff lấy mẫu (SAMPLE_COLLECTED)
 * 4. Staff upload kết quả (COMPLETED)
 * 5. Customer xem kết quả
 * 
 * Backend Integration:
 * - BE-SWP391/src/main/java/com/example/gender_healthcare_service/controller/BookingController.java
 * - BE-SWP391/src/main/java/com/example/gender_healthcare_service/service/impl/BookingServiceImpl.java
 * 
 * WebSocket Integration:
 * - Real-time updates được nhận qua WebSocketContext
 * - Customer nhận notifications khi status thay đổi
 */

// =============Booking APIs============

/**
 * WORKFLOW STEP 1: Customer tạo booking mới
 * 
 * Frontend: SWP391_FE/src/pages/User/STITesting/index.jsx
 * - Customer chọn service và timeslot, submit form
 * - Gọi API POST /api/bookings để tạo booking với status PENDING
 * - Sau khi thành công, redirect đến BookingConfirmation
 * - Tự động trigger WebSocket notification
 * 
 * @param bookingData {serviceId, timeSlotId, customerNotes}
 * @returns Promise với booking đã tạo
 */
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

/**
 * Lấy danh sách booking của customer hiện tại
 * 
 * Frontend: SWP391_FE/src/pages/User/Dashboard/index.jsx
 * - Hiển thị tất cả booking của customer (PENDING, CONFIRMED, SAMPLE_COLLECTED, COMPLETED)
 * - Customer có thể click vào từng booking để xem chi tiết hoặc tracking
 * - Gọi API GET /api/bookings/my-bookings
 * 
 * @returns Promise với danh sách booking
 */
const getUserBookingsAPI = async () => {
  try {
    const response = await instance.get('/api/bookings/my-bookings');
    console.log('Get user bookings success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get user bookings error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * WORKFLOW STEP 5: Customer xem chi tiết booking và kết quả
 * 
 * Frontend: SWP391_FE/src/components/TestResultModal.jsx
 * - Customer click "Xem kết quả" từ notification hoặc booking list
 * - Gọi API GET /api/bookings/{bookingId}/my-booking
 * - Hiển thị modal với đầy đủ thông tin: kết quả, tên bác sĩ, ngày lấy mẫu
 * - Priority hiển thị doctorName: result.doctorName > sampleCollectionProfile.doctorName > fallback
 * 
 * @param bookingId ID của booking cần xem
 * @returns Promise với thông tin chi tiết booking
 */
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

/**
 * Customer/Admin hủy booking
 * 
 * Frontend: SWP391_FE/src/pages/User/Dashboard/index.jsx
 * - Customer có thể hủy booking nếu chưa được xác nhận
 * - Gọi API PATCH /api/bookings/{bookingId}/cancel
 * - Trigger WebSocket notification về việc hủy booking
 * 
 * @param bookingId ID của booking cần hủy
 * @returns Promise với booking đã hủy
 */
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

/**
 * WORKFLOW STEP 4: Staff cập nhật kết quả xét nghiệm
 * 
 * Frontend: SWP391_FE/src/components/staff/TestResultForm.jsx
 * - Staff nhập kết quả xét nghiệm chi tiết
 * - Gọi API PATCH /api/bookings/{bookingId}/test-result
 * - Tự động chuyển status từ SAMPLE_COLLECTED → COMPLETED
 * - Trigger WebSocket notification đến customer tracking page
 * - Customer nhận được real-time update và có thể xem kết quả ngay
 * 
 * @param bookingId ID của booking cần cập nhật kết quả
 * @param resultData {result, resultType, notes, resultDate}
 * @returns Promise với booking đã cập nhật
 */
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

/**
 * WORKFLOW STEP 2: Customer xác nhận booking
 * 
 * Frontend: SWP391_FE/src/pages/User/BookingConfirmation.jsx
 * - Customer xác nhận booking sau khi đặt lịch
 * - Gọi API PATCH /api/bookings/{bookingId}/confirm
 * - Chuyển status từ PENDING → CONFIRMED
 * - Trigger WebSocket notification
 * 
 * @param bookingId ID của booking cần xác nhận
 * @returns Promise với booking đã xác nhận
 */
const confirmBookingAPI = async (bookingId) => {
  try {
    const response = await instance.patch(`/api/bookings/${bookingId}/confirm`);
    console.log('Confirm booking success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Confirm booking error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Staff/Admin cập nhật trạng thái booking
 * 
 * Frontend: SWP391_FE/src/pages/Staff/StaffAppointments.jsx
 * - Staff có thể cập nhật trạng thái booking (CONFIRMED, SAMPLE_COLLECTED, COMPLETED)
 * - Gọi API PATCH /api/bookings/{bookingId}/status
 * - Trigger WebSocket notification đến customer tracking page
 * 
 * @param bookingId ID của booking cần cập nhật
 * @param statusData {status, notes}
 * @returns Promise với booking đã cập nhật
 */
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

/**
 * WORKFLOW: API để cập nhật SampleCollectionProfile
 * 
 * Frontend: SWP391_FE/src/components/staff/SampleCollectionForm.jsx
 * - Staff có thể chỉnh sửa thông tin mẫu đã lấy
 * - Gọi API PUT /api/bookings/{bookingId}/sample-collection
 * - Cập nhật doctorName và các thông tin khác
 * 
 * @param bookingId ID của booking cần cập nhật
 * @param sampleCollectionData Thông tin mẫu mới
 * @returns Promise với booking đã cập nhật
 */
const updateSampleCollectionProfileAPI = async (bookingId, sampleCollectionData) => {
  try {
    const response = await instance.put(`/api/bookings/${bookingId}/sample-collection`, sampleCollectionData);
    console.log('Update sample collection profile success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update sample collection profile error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Booking Service Class============

/**
 * BookingService Class - Wrapper cho tất cả booking APIs
 * 
 * Cung cấp interface đơn giản cho frontend components để tương tác với backend
 * Tự động xử lý error handling và response formatting
 */
class BookingService {
  /**
   * Create a new booking
   * 
   * @param bookingData {serviceId, timeSlotId, customerNotes}
   * @returns {success: boolean, data: BookingResponseDTO, message: string}
   */
  async createBooking(bookingData) {
    try {
      const data = await createBookingAPI(bookingData);
      // Interceptor đã extract data từ ApiResponse
      return { success: true, data: data, message: 'Tạo lịch hẹn thành công' };
    } catch (error) {
      // Xử lý error response từ backend
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Get current user's bookings
   * 
   * @returns {success: boolean, data: BookingResponseDTO[], message: string}
   */
  async getUserBookings() {
    try {
      const response = await getUserBookingsAPI();
      // Response format: { success: true, message: "...", data: [...] }
      if (response.success) {
        return { success: true, data: response.data, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Get booking by ID for current user
   * 
   * @param bookingId ID của booking cần xem
   * @returns {success: boolean, data: BookingResponseDTO, message: string}
   */
  async getBookingById(bookingId) {
    try {
      const data = await getBookingByIdAPI(bookingId);
      // Interceptor đã extract data từ ApiResponse
      return { success: true, data: data, message: 'Lấy thông tin lịch hẹn thành công' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Cancel booking
   * 
   * @param bookingId ID của booking cần hủy
   * @returns {success: boolean, data: BookingResponseDTO, message: string}
   */
  async cancelBooking(bookingId) {
    try {
      const data = await cancelBookingAPI(bookingId);
      // Interceptor đã extract data từ ApiResponse
      return { success: true, data: data, message: 'Hủy lịch hẹn thành công' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Update test result (for staff/admin)
   * 
   * @param bookingId ID của booking cần cập nhật kết quả
   * @param resultData {result, resultType, notes, resultDate}
   * @returns {success: boolean, data: BookingResponseDTO, message: string}
   */
  async updateTestResult(bookingId, resultData) {
    try {
      const data = await updateTestResultAPI(bookingId, resultData);
      // Interceptor đã extract data từ ApiResponse
      return { success: true, data: data, message: 'Cập nhật kết quả xét nghiệm thành công' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Update booking status (for user to confirm booking)
   * 
   * @param bookingId ID của booking cần cập nhật
   * @param statusData {status, notes}
   * @returns {success: boolean, data: BookingResponseDTO, message: string}
   */
  async updateBookingStatus(bookingId, statusData) {
    try {
      const data = await updateBookingStatusAPI(bookingId, statusData);
      // Interceptor đã extract data từ ApiResponse
      return { success: true, data: data, message: 'Cập nhật trạng thái lịch hẹn thành công' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Confirm booking (for user)
   * 
   * @param bookingId ID của booking cần xác nhận
   * @returns {success: boolean, data: BookingResponseDTO, message: string}
   */
  async confirmBooking(bookingId) {
    try {
      const data = await confirmBookingAPI(bookingId);
      // Interceptor đã extract data từ ApiResponse
      return { success: true, data: data, message: 'Xác nhận lịch hẹn thành công' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  /**
   * WORKFLOW: Cập nhật SampleCollectionProfile với doctorName
   * 
   * Frontend: SWP391_FE/src/components/staff/SampleCollectionForm.jsx
   * - Staff có thể chỉnh sửa thông tin mẫu đã lấy
   * - Cập nhật doctorName và các thông tin khác
   * 
   * @param bookingId ID của booking cần cập nhật
   * @param sampleCollectionData Thông tin mẫu mới
   * @returns {success: boolean, data: BookingResponseDTO, message: string}
   */
  async updateSampleCollectionProfile(bookingId, sampleCollectionData) {
    try {
      const data = await updateSampleCollectionProfileAPI(bookingId, sampleCollectionData);
      // Interceptor đã extract data từ ApiResponse
      return { success: true, data: data, message: 'Cập nhật thông tin mẫu xét nghiệm thành công' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }
}

export default new BookingService();
export { createBookingAPI };