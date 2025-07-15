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
    const response = await instance.get('/api/admin/consultants');
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

// =============Admin User Management APIs============
const getAllUsersAPI = async () => {
  try {
    const response = await instance.get('/api/admin/users');
    console.log('Get all users success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get all users error:', error.response?.data || error.message);
    throw error;
  }
};

const updateUserAPI = async (userId, userData) => {
  try {
    const response = await instance.put(`/api/admin/users/${userId}`, userData);
    console.log('Update user success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update user error:', error.response?.data || error.message);
    throw error;
  }
};

const deleteUserAPI = async (userId) => {
  try {
    const response = await instance.delete(`/api/admin/users/${userId}`);
    console.log('Delete user success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete user error:', error.response?.data || error.message);
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
  
  // User Management APIs
  getAllUsersAPI,
  updateUserAPI,
  deleteUserAPI,
  
  // Schedule Management APIs
  getConsultantScheduleAPI,
  createConsultantScheduleAPI,
  
  // Reports APIs
  getDashboardReportAPI,
  getUserGrowthReportAPI,
  getRevenueReportAPI,
  getServiceUtilizationReportAPI
}; 