import instance from "./customize-axios";

// =============Enhanced Menstrual Cycle APIs============
const logEnhancedMenstrualDataAPI = async (logData) => {
  try {
    const response = await instance.post('/api/menstrual-cycle/log-enhanced', logData);
    console.log('Log enhanced menstrual data success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Log enhanced menstrual data error:', error.response?.data || error.message);
    throw error;
  }
};

const getUserMenstrualLogsAPI = async (userId) => {
  try {
    const response = await instance.get(`/api/menstrual-cycle/consultant/view/${userId}`);
    console.log('Get user menstrual logs success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get user menstrual logs error:', error.response?.data || error.message);
    throw error;
  }
};

const updateMenstrualLogAPI = async (logId, logData) => {
  try {
    const response = await instance.put(`/api/menstrual-cycle/consultant/log/${logId}`, logData);
    console.log('Update menstrual log success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update menstrual log error:', error.response?.data || error.message);
    throw error;
  }
};

const getMenstrualCyclePredictionAPI = async () => {
  try {
    const response = await instance.get('/api/menstrual-cycle/prediction');
    console.log('Get menstrual cycle prediction success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get menstrual cycle prediction error:', error.response?.data || error.message);
    throw error;
  }
};

const getFertilityWindowAPI = async () => {
  try {
    const response = await instance.get('/api/menstrual-cycle/fertility-window');
    console.log('Get fertility window success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get fertility window error:', error.response?.data || error.message);
    throw error;
  }
};

const getMenstrualCycleAnalyticsAPI = async () => {
  try {
    const response = await instance.get('/api/menstrual-cycle/analytics');
    console.log('Get menstrual cycle analytics success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get menstrual cycle analytics error:', error.response?.data || error.message);
    throw error;
  }
};

const getSymptomPatternsAPI = async () => {
  try {
    const response = await instance.get('/api/menstrual-cycle/symptom-patterns');
    console.log('Get symptom patterns success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get symptom patterns error:', error.response?.data || error.message);
    throw error;
  }
};

const getHealthInsightsAPI = async () => {
  try {
    const response = await instance.get('/api/menstrual-cycle/health-insights');
    console.log('Get health insights success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get health insights error:', error.response?.data || error.message);
    throw error;
  }
};

const getMenstrualLogsAPI = async (startDate = null, endDate = null) => {
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await instance.get('/api/menstrual-cycle/logs', { params });
    console.log('Get menstrual logs success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get menstrual logs error:', error.response?.data || error.message);
    throw error;
  }
};

const getMenstrualCycleDashboardAPI = async () => {
  try {
    const response = await instance.get('/api/menstrual-cycle/dashboard');
    console.log('Get menstrual cycle dashboard success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get menstrual cycle dashboard error:', error.response?.data || error.message);
    throw error;
  }
};

export {
  logEnhancedMenstrualDataAPI,
  getUserMenstrualLogsAPI,
  updateMenstrualLogAPI,
  getMenstrualCyclePredictionAPI,
  getFertilityWindowAPI,
  getMenstrualCycleAnalyticsAPI,
  getSymptomPatternsAPI,
  getHealthInsightsAPI,
  getMenstrualLogsAPI,
  getMenstrualCycleDashboardAPI
}; 