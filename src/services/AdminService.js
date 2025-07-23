import instance from "./customize-axios";

// =============Admin Testing Services APIs============
const createTestingServiceAPI = async (serviceData) => {
  try {
    const response = await instance.post('/api/admin/testing-services', serviceData);
    console.log('Create testing service success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create testing service error:', error.response?.data || error.message);
    throw error;
  }
};

const updateTestingServiceAPI = async (serviceId, serviceData) => {
  try {
    const response = await instance.put(`/api/admin/testing-services/${serviceId}`, serviceData);
    console.log('Update testing service success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update testing service error:', error.response?.data || error.message);
    throw error;
  }
};

const deleteTestingServiceAPI = async (serviceId) => {
  try {
    const response = await instance.delete(`/api/admin/testing-services/${serviceId}`);
    console.log('Delete testing service success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete testing service error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Admin Consultant Management APIs============
const createConsultantAPI = async (consultantData) => {
  try {
    const response = await instance.post('/api/admin/consultants', consultantData);
    console.log('Create consultant success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create consultant error:', error.response?.data || error.message);
    throw error;
  }
};

const updateConsultantAPI = async (consultantId, consultantData) => {
  try {
    const response = await instance.put(`/api/admin/consultants/${consultantId}`, consultantData);
    console.log('Update consultant success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update consultant error:', error.response?.data || error.message);
    throw error;
  }
};

const deleteConsultantAPI = async (consultantId) => {
  try {
    const response = await instance.delete(`/api/admin/consultants/${consultantId}`);
    console.log('Delete consultant success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete consultant error:', error.response?.data || error.message);
    throw error;
  }
};

const getAllConsultantsAPI = async () => {
  try {
    const response = await instance.get('/api/admin/listConsultant');
    console.log('Get all consultants success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get all consultants error:', error.response?.data || error.message);
    throw error;
  }
};

const getConsultantByIdAPI = async (consultantId) => {
  try {
    const response = await instance.get(`/api/admin/consultants/${consultantId}`);
    console.log('Get consultant by ID success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get consultant by ID error:', error.response?.data || error.message);
    throw error;
  }
};

const autoCreateConsultantSlotsAPI = async (consultantId, data) => {
  try {
    const response = await instance.post(`/api/admin/consultants/${consultantId}/auto-create-slots`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// =============Admin User Management APIs============
const getAllUsersAPI = async (pageNumber = 1, pageSize = 10) => {
  try {
    const response = await instance.get('/api/admin/users', {
      params: { pageNumber, pageSize }
    });
    console.log('Get all users success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get all users error:', error.response?.data || error.message);
    throw error;
  }
};

const getUserByIdAPI = async (userId) => {
  try {
    const response = await instance.get(`/api/admin/user/${userId}`);
    console.log('Get user by ID success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get user by ID error:', error.response?.data || error.message);
    throw error;
  }
};

const updateUserAPI = async (userId, data) => {
  try {
    const response = await instance.put(`/api/admin/users/${userId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteUserAPI = async (userId) => {
  try {
    const response = await instance.delete(`/api/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const setUserToConsultantAPI = async (userId) => {
  try {
    const response = await instance.put(`/api/admin/setUserToConsultant/${userId}`);
    console.log('Set user to consultant success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Set user to consultant error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Admin Schedule Management APIs============
const getConsultantScheduleAPI = async (consultantId, startDate, endDate) => {
  try {
    const response = await instance.get(`/api/admin/consultants/${consultantId}/schedule`, {
      params: { startDate, endDate }
    });
    console.log('Get consultant schedule success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get consultant schedule error:', error.response?.data || error.message);
    throw error;
  }
};

const createConsultantScheduleAPI = async (consultantId, scheduleData) => {
  try {
    const response = await instance.post(`/api/admin/consultants/${consultantId}/schedule`, scheduleData);
    console.log('Create consultant schedule success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create consultant schedule error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Admin Reports APIs============
const getDashboardReportAPI = async (startDate, endDate) => {
  try {
    const response = await instance.get('/api/admin/reports/dashboard', {
      params: { startDate, endDate }
    });
    console.log('Get dashboard report success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get dashboard report error:', error.response?.data || error.message);
    throw error;
  }
};

const getUserGrowthReportAPI = async (period) => {
  try {
    const response = await instance.get('/api/admin/reports/user-growth', {
      params: { period }
    });
    console.log('Get user growth report success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get user growth report error:', error.response?.data || error.message);
    throw error;
  }
};

const getRevenueReportAPI = async (period) => {
  try {
    const response = await instance.get('/api/admin/reports/revenue', {
      params: { period }
    });
    console.log('Get revenue report success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get revenue report error:', error.response?.data || error.message);
    throw error;
  }
};

const getServiceUtilizationReportAPI = async (period) => {
  try {
    const response = await instance.get('/api/admin/reports/service-utilization', {
      params: { period }
    });
    console.log('Get service utilization report success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get service utilization report error:', error.response?.data || error.message);
    throw error;
  }
};

// =============New Admin Dashboard & Reports APIs============
// Get dashboard statistics
const getDashboardStatsAPI = async (month, year) => {
  try {
    const response = await instance.get('/api/admin/dashboard-stats', {
      params: { month, year }
    });
    return response.data;
  } catch (error) {
    console.error('Get dashboard stats error:', error.response?.data || error.message);
    throw error;
  }
};

// Get reports overview
const getReportsOverviewAPI = async () => {
  try {
    const response = await instance.get('/api/admin/reports/overview');
    console.log('Get reports overview success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get reports overview error:', error.response?.data || error.message);
    throw error;
  }
};

// Get bookings report
const getReportsBookingsAPI = async (startDate, endDate, period = 'daily') => {
  try {
    const params = { period };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await instance.get('/api/admin/reports/bookings', { params });
    console.log('Get reports bookings success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get reports bookings error:', error.response?.data || error.message);
    throw error;
  }
};

// Get financial reports
const getReportsFinancialsAPI = async (startDate, endDate, period = 'monthly') => {
  try {
    const params = { period };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await instance.get('/api/admin/reports/financials', { params });
    console.log('Get reports financials success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get reports financials error:', error.response?.data || error.message);
    throw error;
  }
};

// Get users report
const getReportsUsersAPI = async (startDate, endDate, period = 'weekly') => {
  try {
    const params = { period };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await instance.get('/api/admin/reports/users', { params });
    console.log('Get reports users success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get reports users error:', error.response?.data || error.message);
    throw error;
  }
};

// Get consultants report
const getReportsConsultantsAPI = async () => {
  try {
    const response = await instance.get('/api/admin/reports/consultants');
    console.log('Get reports consultants success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get reports consultants error:', error.response?.data || error.message);
    throw error;
  }
};

// Get services report
const getReportsServicesAPI = async () => {
  try {
    const response = await instance.get('/api/admin/reports/services');
    console.log('Get reports services success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get reports services error:', error.response?.data || error.message);
    throw error;
  }
};

const autoCreateCommonSlotsAPI = async (data) => {
  try {
    const response = await instance.post('/api/admin/timeslots/auto-create', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const registerUserAPI = async (data) => {
  try {
    const response = await instance.post('/api/auth/register', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  // Testing Services APIs
  createTestingServiceAPI,
  updateTestingServiceAPI,
  deleteTestingServiceAPI,
  
  // Consultant Management APIs
  createConsultantAPI,
  updateConsultantAPI,
  deleteConsultantAPI,
  getAllConsultantsAPI,
  getConsultantByIdAPI,
  autoCreateConsultantSlotsAPI,
  
  // User Management APIs
  getAllUsersAPI,
  getUserByIdAPI,
  updateUserAPI,
  deleteUserAPI,
  setUserToConsultantAPI,
  
  // Schedule Management APIs
  getConsultantScheduleAPI,
  createConsultantScheduleAPI,
  
  // Reports APIs
  getDashboardReportAPI,
  getUserGrowthReportAPI,
  getRevenueReportAPI,
  getServiceUtilizationReportAPI,

  // New Dashboard & Reports APIs
  getDashboardStatsAPI,
  getReportsOverviewAPI,
  getReportsBookingsAPI,
  getReportsFinancialsAPI,
  //getReportsUsersAPI,
  getReportsConsultantsAPI,
  getReportsServicesAPI,
  autoCreateCommonSlotsAPI,
  registerUserAPI
};