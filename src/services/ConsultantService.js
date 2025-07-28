// Consultant Service - Real API calls for consultant functionality
import { toast } from 'react-toastify';
import instance from "./customize-axios";

// =============Consultant Profile APIs============
const getConsultantProfileAPI = async () => {
  try {
    const response = await instance.get('/api/consultant/getProfile');
    console.log('Get consultant profile success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get consultant profile error:', error.response?.data || error.message);
    throw error;
  }
};

const updateConsultantProfileAPI = async (profileData) => {
  try {
    const response = await instance.put('/api/consultant/updateProfile', profileData);
    console.log('Update consultant profile success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update consultant profile error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Consultant Availability APIs============
const addUnavailabilityAPI = async (unavailabilityData) => {
  try {
    const response = await instance.post('/api/consultant/unavailability', unavailabilityData);
    console.log('Add unavailability success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Add unavailability error:', error.response?.data || error.message);
    throw error;
  }
};

const getUnavailabilityAPI = async () => {
  try {
    const response = await instance.get('/api/consultant/unavailability');
    console.log('Get unavailability success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get unavailability error:', error.response?.data || error.message);
    throw error;
  }
};

const getConsultantAvailabilityAPI = async (date) => {
  try {
    // Lấy consultant ID từ profile hiện tại
    const profileResponse = await instance.get('/api/consultant/getProfile');
    const consultantId = profileResponse.data.id;
    
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
const getConsultationBookingsAPI = async (date = null, status = null) => {
  try {
    const params = {};
    if (date) params.date = date;
    if (status) params.status = status;
    
    const response = await instance.get('/api/consultant/consultation-bookings', { params });
    console.log('Get consultation bookings success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get consultation bookings error:', error.response?.data || error.message);
    throw error;
  }
};

const getConsultationHistoryAPI = async (userId) => {
  try {
    const response = await instance.get(`/api/consultant/patient/${userId}/consultation-history`);
    console.log('Get consultation history success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get consultation history error:', error.response?.data || error.message);
    throw error;
  }
};

const getPatientRemindersAPI = async (userId) => {
  try {
    const response = await instance.get(`/api/consultant/patient/${userId}/reminders`);
    console.log('Get patient reminders success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get patient reminders error:', error.response?.data || error.message);
    throw error;
  }
};

const createReminderAPI = async (reminderData) => {
  try {
    const response = await instance.post('/api/consultant/patient/reminder', reminderData);
    console.log('Create reminder success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create reminder error:', error.response?.data || error.message);
    throw error;
  }
};

const getReminderByIdAPI = async (reminderId) => {
  try {
    const response = await instance.get(`/api/consultant/patient/reminder/${reminderId}`);
    console.log('Get reminder by ID success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get reminder by ID error:', error.response?.data || error.message);
    throw error;
  }
};

const updateReminderAPI = async (reminderId, reminderData) => {
  try {
    const response = await instance.put(`/api/consultant/patient/reminder/${reminderId}`, reminderData);
    console.log('Update reminder success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update reminder error:', error.response?.data || error.message);
    throw error;
  }
};

const deleteReminderAPI = async (reminderId) => {
  try {
    const response = await instance.delete(`/api/consultant/patient/reminder/${reminderId}`);
    console.log('Delete reminder success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete reminder error:', error.response?.data || error.message);
    throw error;
  }
};

export const getTodayAppointmentsAPI = async () => {
  const today = new Date().toISOString().slice(0, 10);
  return getConsultationBookingsAPI(today, null);
};

export const getPendingAppointmentsAPI = async () => {
  return getConsultationBookingsAPI(null, 'pending');
};

export const getUpcomingAppointmentsAPI = async () => {
  return getConsultationBookingsAPI(null, 'scheduled');
};
// Lấy số tin nhắn chưa đọc
export const getUnreadMessagesCountAPI = async () => {
  try {
    console.log('🔍 Calling getUnreadMessagesCountAPI...');
    const response = await instance.get('/api/chat/consultant/unread-count');
    console.log('✅ Get unread messages count success:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Get unread messages count error:', error.response?.data || error.message);
    console.error('❌ Error status:', error.response?.status);
    console.error('❌ Full error:', error);
    // Trả về 0 nếu có lỗi
    return 0;
  }
};
// Lấy doanh thu
export const getRevenueAPI = async (type = 'today') => {
  // type: 'today', 'month', 'total'
  let url = '/api/consultant/revenue';
  if (type === 'today') url += '?date=' + new Date().toISOString().slice(0, 10);
  else if (type === 'month') url += '?month=' + new Date().toISOString().slice(0, 7);
  else if (type === 'total') url += '/total';
  const res = await instance.get(url);
  return res.data;
};

// =============Public Consultant APIs============
const getPublicConsultantsAPI = async () => {
  try {
    const response = await instance.get('/api/homepage/consultants');
    console.log('Get public consultants success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get public consultants error:', error.response?.data || error.message);
    throw error;
  }
};

const getAvailableConsultantsAPI = async () => {
  try {
    const response = await instance.get('/api/chat/customer/available-consultants');
    console.log('Get available consultants success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get available consultants error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Consultant Create Booking APIs============
const createBookingForUserAPI = async (bookingData) => {
  try {
    console.log('Making API call to create booking with data:', bookingData);
    const response = await instance.post('/api/bookings/consultant-create', bookingData);
    console.log('Create booking for user success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create booking for user error:', error.response?.data || error.message);
    console.error('Full error object:', error);
    throw error;
  }
};

const createConsultationForUserAPI = async (consultationData) => {
  try {
    const response = await instance.post('/api/consultation/consultant-create', consultationData);
    console.log('Create consultation for user success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create consultation for user error:', error.response?.data || error.message);
    throw error;
  }
};

const getCustomersAPI = async () => {
  try {
    const response = await instance.get('/api/consultant/customers');
    console.log('Get customers success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get customers error:', error.response?.data || error.message);
    throw error;
  }
};

const createTestCustomerAPI = async () => {
  try {
    const response = await instance.post('/api/consultant/create-test-customer');
    console.log('Create test customer success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create test customer error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Consultant Service Class (Wrapper for backward compatibility)============
class ConsultantService {
  // Profile management
  async getConsultantProfile() {
    try {
      const data = await getConsultantProfileAPI();
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateConsultantProfile(profileData) {
    try {
      const data = await updateConsultantProfileAPI(profileData);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Availability management
  async addUnavailability(unavailabilityData) {
    try {
      const data = await addUnavailabilityAPI(unavailabilityData);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getUnavailability() {
    try {
      const data = await getUnavailabilityAPI();
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getConsultantAvailability(date) {
    try {
      const data = await getConsultantAvailabilityAPI(date);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Appointment management
  async getAppointments(filters = {}) {
    try {
      const data = await getConsultationBookingsAPI(filters.date, filters.status);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Patient management
  async getPatientReminders(userId) {
    try {
      const data = await getPatientRemindersAPI(userId);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async createReminder(reminderData) {
    try {
      const data = await createReminderAPI(reminderData);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateReminder(reminderId, reminderData) {
    try {
      const data = await updateReminderAPI(reminderId, reminderData);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async deleteReminder(reminderId) {
    try {
      const data = await deleteReminderAPI(reminderId);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Create booking for user
  async createBookingForUser(bookingData) {
    try {
      const data = await createBookingForUserAPI(bookingData);
      // Interceptor đã extract data từ ApiResponse, nên data là BookingResponseDTO
      return { success: true, data: data, message: 'Tạo lịch hẹn thành công' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  // Create consultation for user
  async createConsultationForUser(consultationData) {
    try {
      const data = await createConsultationForUserAPI(consultationData);
      return { success: true, data: data, message: 'Tạo lịch tư vấn thành công' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  }

  // Get customers list
  async getCustomers() {
    try {
      const response = await getCustomersAPI();
      console.log('Raw customers API response:', response);
      
      // Kiểm tra cấu trúc response
      if (response && response.success && response.data) {
        return { success: true, data: response.data };
      } else if (response && Array.isArray(response)) {
        return { success: true, data: response };
      } else if (response && response.data && Array.isArray(response.data)) {
        return { success: true, data: response.data };
      } else {
        console.warn('Unexpected customers response format:', response);
        return { success: false, message: 'Invalid response format' };
      }
    } catch (error) {
      console.error('Error in getCustomers:', error);
      return { success: false, message: error.message };
    }
  }

  // Create test customer for testing
  async createTestCustomer() {
    try {
      const response = await createTestCustomerAPI();
      return { success: true, data: response.data, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Legacy methods for backward compatibility
  async changePassword(oldPassword, newPassword) {
    // This should use the auth API for password change
    return { success: false, message: 'Use UsersSevices.updatePasswordAPI instead' };
  }

  async getConversations() {
    // This should be handled by a separate chat service
    return { success: false, message: 'Use ChatService instead' };
  }

  async sendMessage(conversationId, message) {
    // This should be handled by a separate chat service
    return { success: false, message: 'Use ChatService instead' };
  }

  async getAnalytics(period = 'month') {
    // This should be handled by analytics API
    return { success: false, message: 'Use AnalyticsService instead' };
  }

  async getDashboardStats() {
    // This should be handled by dashboard API
    return { success: false, message: 'Use DashboardService instead' };
  }

  async updateOnlineStatus(isOnline) {
    // This should be handled by presence API
    return { success: false, message: 'Use PresenceService instead' };
  }

  async getWorkingHours() {
    // This should be part of profile data
    try {
      const profile = await this.getConsultantProfile();
      return { success: true, data: profile.data?.workingHours || {} };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateWorkingHours(workingHours) {
    // This should be part of profile update
    try {
      const data = await updateConsultantProfileAPI({ workingHours });
      return { success: true, data: data.workingHours };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getPatientInfo(patientId) {
    // This should be handled by user service
    return { success: false, message: 'Use UserService.getUserProfileAPI instead' };
  }

  async getAvailableConsultants() {
    try {
      const response = await getAvailableConsultantsAPI();
      console.log('Raw available consultants response:', response);
      
      // API trả về ApiResponse wrapper với data field
      let consultantsData;
      if (response && response.data && Array.isArray(response.data)) {
        consultantsData = response.data;
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        consultantsData = response.data.data;
      } else if (response && Array.isArray(response)) {
        consultantsData = response;
      } else {
        console.warn('Unexpected response format:', response);
        consultantsData = [];
      }
      
      return { success: true, data: consultantsData };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

const consultantService = new ConsultantService();

export default consultantService;
export {
  getConsultantProfileAPI,
  updateConsultantProfileAPI,
  addUnavailabilityAPI,
  getUnavailabilityAPI,
  getConsultationBookingsAPI,
  getConsultationHistoryAPI,
  getPatientRemindersAPI,
  createReminderAPI,
  getReminderByIdAPI,
  updateReminderAPI,
  deleteReminderAPI,
  getPublicConsultantsAPI,
  getAvailableConsultantsAPI,
  createBookingForUserAPI,
  createConsultationForUserAPI,
  getCustomersAPI,
  createTestCustomerAPI
};
