import instance from './customize-axios';

class DashboardService {
  async getDashboardStats() {
    try {
      const response = await instance.get('/api/homepage/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUpcomingAppointments() {
    try {
      const response = await instance.get('/api/homepage/upcoming-appointments');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Lấy thông báo
  async getNotifications(type = null) {
    try {
      const params = type ? { type } : {};
      const response = await instance.get('/api/homepage/notifications', { params });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông báo:', error);
      throw error;
    }
  }

  // Đánh dấu thông báo đã đọc
  async markNotificationAsRead(notificationId) {
    try {
      const response = await instance.post(`/api/homepage/notifications/${notificationId}/mark-read`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi đánh dấu thông báo đã đọc:', error);
      throw error;
    }
  }

  // Đánh dấu tất cả thông báo đã đọc
  async markAllNotificationsAsRead() {
    try {
      const response = await instance.post('/api/homepage/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi đánh dấu tất cả thông báo đã đọc:', error);
      throw error;
    }
  }
}

export default new DashboardService(); 