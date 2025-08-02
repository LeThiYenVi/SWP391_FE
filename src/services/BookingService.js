import instance from "./customize-axios";

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

// =============Booking Service Class============
class BookingService {
  // Create a new booking
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

  // Get current user's bookings
  async getUserBookings() {
    try {
      const data = await getUserBookingsAPI();
      // Interceptor đã extract data từ ApiResponse
      return { success: true, data: data, message: 'Lấy danh sách lịch hẹn thành công' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  // Get booking by ID for current user
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

  // Cancel booking
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

  // Update test result (for staff/admin)
  async updateTestResult(bookingId, resultData) {
    try {
      const data = await updateTestResultAPI(bookingId, resultData);
      // Interceptor đã extract data từ ApiResponse
      return { success: true, data: data, message: 'Xác nhận lịch hẹn thành công' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  // Update booking status (for user to confirm booking)
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

  // Confirm booking (for user)
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
}

export default new BookingService();
export { createBookingAPI };