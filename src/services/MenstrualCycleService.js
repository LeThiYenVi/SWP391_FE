import axios from 'axios';

const API_BASE = '/api/menstrual-cycle';
const USER_API_BASE = '/api/user/menstrual-cycle';

// Tạo instance axios với interceptor để tự động thêm token
const cycleApi = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

const userCycleApi = axios.create({
  baseURL: USER_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để tự động thêm token vào header
const addTokenInterceptor = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

cycleApi.interceptors.request.use(addTokenInterceptor, (error) => Promise.reject(error));
userCycleApi.interceptors.request.use(addTokenInterceptor, (error) => Promise.reject(error));

// API calls cho tracking chu kỳ
export const cycleService = {
  // === Enhanced APIs (from /api/menstrual-cycle) ===
  
  // Lấy dashboard tổng quan
  getDashboard: () => cycleApi.get('/dashboard'),
  
  // Lấy lịch sử logs
  getLogs: (params = {}) => cycleApi.get('/logs', { params }),
  
  // Tạo log enhanced (chi tiết hơn)
  createEnhancedLog: (data) => cycleApi.post('/log-enhanced', data),
  
  // Lấy dự đoán chu kỳ
  getPrediction: () => cycleApi.get('/prediction'),
  
  // Lấy cửa sổ thụ thai
  getFertilityWindow: () => cycleApi.get('/fertility-window'),
  
  // Lấy thống kê analytics
  getAnalytics: () => cycleApi.get('/analytics'),
  
  // Lấy mẫu triệu chứng
  getSymptomPatterns: () => cycleApi.get('/symptom-patterns'),
  
  // Lấy gợi ý sức khỏe
  getHealthInsights: () => cycleApi.get('/health-insights'),
  
  // === Basic APIs (from /api/user/menstrual-cycle) ===
  
  // Thêm hoặc cập nhật thông tin chu kỳ
  addOrUpdateCycle: (cycleData) => userCycleApi.post('/', cycleData),
  
  // Ghi nhận kỳ kinh
  logMenstrualPeriod: (logData) => userCycleApi.post('/log', logData),
  
  // Lấy thông tin tracker
  getCycleTracker: () => userCycleApi.get('/tracker'),
  
  // === Legacy APIs (for backward compatibility) ===
  
  // Tạo log mới
  createLog: (data) => cycleApi.post('/log', data),
  
  // Lấy chu kỳ hiện tại
  getCurrentCycle: () => cycleApi.get('/current'),
  
  // Cập nhật thông tin chu kỳ
  updateCycle: (data) => cycleApi.put('/update', data),
  
  // Xóa log
  deleteLog: (logId) => cycleApi.delete(`/log/${logId}`),
  
  // Lấy logs theo tháng
  getLogsByMonth: (year, month) => cycleApi.get(`/logs/${year}/${month}`),
  
  // Lấy thống kê theo khoảng thời gian
  getStatsByDateRange: (startDate, endDate) => 
    cycleApi.get('/stats', { params: { startDate, endDate } }),
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