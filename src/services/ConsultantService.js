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

// =============Dashboard APIs============
// Lấy cuộc hẹn hôm nay
export const getTodayAppointmentsAPI = async () => {
  const today = new Date().toISOString().slice(0, 10);
  return getConsultationBookingsAPI(today, null);
};
// Lấy cuộc hẹn đang chờ
export const getPendingAppointmentsAPI = async () => {
  return getConsultationBookingsAPI(null, 'pending');
};
// Lấy cuộc hẹn sắp tới (status = scheduled hoặc ngày > hôm nay)
export const getUpcomingAppointmentsAPI = async () => {
  return getConsultationBookingsAPI(null, 'scheduled');
};
// Lấy số tin nhắn chưa đọc (mock nếu chưa có API)
export const getUnreadMessagesCountAPI = async () => {
  // Nếu có API thật thì gọi, tạm mock trả về 0
  return 0;
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
}

// Export singleton instance for backward compatibility
const consultantService = new ConsultantService();

export default consultantService;

// Export individual API functions
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
  deleteReminderAPI
};
