import instance from './customize-axios';

// Sử dụng instance axios chung đã có sẵn interceptor và config

// Debug function để kiểm tra token
const debugToken = () => {
  const authToken = localStorage.getItem('authToken');
  const token = localStorage.getItem('token');
  console.log('🔍 Token Debug:', {
    authToken: authToken ? 'Present' : 'Missing',
    token: token ? 'Present' : 'Missing',
    authTokenValue: authToken?.substring(0, 20) + '...',
    tokenValue: token?.substring(0, 20) + '...'
  });
  return authToken || token;
};

// API calls cho tracking chu kỳ
export const cycleService = {
  // === Enhanced APIs (from /api/menstrual-cycle) ===
  
  // Lấy dashboard tổng quan
  getDashboard: () => instance.get('/api/menstrual-cycle/dashboard'),

  // Lấy lịch sử logs
  getLogs: (params = {}) => instance.get('/api/menstrual-cycle/logs', { params }),

  // Tạo log enhanced (chi tiết hơn)
  createEnhancedLog: (data) => instance.post('/api/menstrual-cycle/log-enhanced', data),

  // Lấy dự đoán chu kỳ
  getPrediction: () => instance.get('/api/menstrual-cycle/prediction'),

  // Lấy cửa sổ thụ thai
  getFertilityWindow: () => instance.get('/api/menstrual-cycle/fertility-window'),

  // Lấy thống kê analytics
  getAnalytics: () => instance.get('/api/menstrual-cycle/analytics'),

  // Lấy mẫu triệu chứng
  getSymptomPatterns: () => instance.get('/api/menstrual-cycle/symptom-patterns'),

  // Lấy gợi ý sức khỏe
  getHealthInsights: () => instance.get('/api/menstrual-cycle/health-insights'),

  // Lấy dữ liệu calendar cho tháng cụ thể
  getCalendarData: (year, month) => instance.get('/api/menstrual-cycle/calendar', { params: { year, month } }),

  // Lấy thông tin chu kỳ hiện tại (không sử dụng nữa, thay bằng getDashboard)
  getCurrentCycleInfo: () => instance.get('/api/user/menstrual-cycle/current-cycle'),
  
  // === Basic APIs (from /api/user/menstrual-cycle) ===
  
  // Thêm hoặc cập nhật thông tin chu kỳ
  addOrUpdateCycle: (cycleData) => instance.post('/api/user/menstrual-cycle', cycleData),

  // Ghi nhận kỳ kinh
  logMenstrualPeriod: (logData) => instance.post('/api/user/menstrual-cycle/log', logData),

  // Lấy thông tin tracker
  getCycleTracker: () => {
    debugToken();
    return instance.get('/api/user/menstrual-cycle/tracker');
  },
  
  // === Legacy APIs (for backward compatibility) ===
  
  // Tạo log mới
  createLog: (data) => instance.post('/api/menstrual-cycle/log', data),

  // Lấy chu kỳ hiện tại
  getCurrentCycle: () => instance.get('/api/menstrual-cycle/current'),

  // Cập nhật thông tin chu kỳ
  updateCycle: (data) => instance.put('/api/menstrual-cycle/update', data),

  // Xóa log
  deleteLog: (logId) => instance.delete(`/api/menstrual-cycle/log/${logId}`),

  // Lấy logs theo tháng
  getLogsByMonth: (year, month) => instance.get(`/api/menstrual-cycle/logs/${year}/${month}`),

  // Lấy thống kê theo khoảng thời gian
  getStatsByDateRange: (startDate, endDate) =>
    instance.get('/api/menstrual-cycle/stats', { params: { startDate, endDate } }),
};

// Helper functions
export const formatDateForAPI = (date) => {
  return date.toISOString().split('T')[0];
};

export const parseAPIResponse = (response) => {
  if (response.data && response.data.content) {
    return response.data.content;
  }
  return response.data;
};

export default cycleService; 