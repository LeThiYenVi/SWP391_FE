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

// =============Booking Service Class============
class BookingService {
  // Create a new booking
  async createBooking(bookingData) {
    try {
      const data = await createBookingAPI(bookingData);
      // Backend trả về ApiResponse format mới
      if (data.success === true) {
        return { success: true, data: data.data, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
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
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Get booking by ID for current user
  async getBookingById(bookingId) {
    try {
      const data = await getBookingByIdAPI(bookingId);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Cancel booking
  async cancelBooking(bookingId) {
    try {
      const data = await cancelBookingAPI(bookingId);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default new BookingService(); 