import instance from './customize-axios';

const MenstrualCycleService = {
  // Get current menstrual cycle
  getCurrentMenstrualCycle: async () => {
    try {
      const response = await instance.get('/api/menstrual-cycle/current');
      return response.data;
    } catch (error) {
      console.error('Error fetching current menstrual cycle:', error);
      throw error;
    }
  },

  // Create menstrual cycle
  createMenstrualCycle: async (cycleData) => {
    try {
      const response = await instance.post('/api/menstrual-cycle/create', cycleData);
      return response.data;
    } catch (error) {
      console.error('Error creating menstrual cycle:', error);
      throw error;
    }
  },

  // Get day log
  getDayLog: async (date) => {
    try {
      const response = await instance.get(`/api/menstrual-cycle/day-log/${date}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching day log:', error);
      throw error;
    }
  },

  // Update day log
  updateDayLog: async (logData) => {
    try {
      const response = await instance.post('/api/menstrual-cycle/update-day-log', logData);
      return response.data;
    } catch (error) {
      console.error('Error updating day log:', error);
      throw error;
    }
  },

  // Quick log
  quickLog: async (logData) => {
    try {
      const response = await instance.post('/api/menstrual-cycle/quick-log', logData);
      return response.data;
    } catch (error) {
      console.error('Error quick logging:', error);
      throw error;
    }
  },

  // Get phases for a month
  getPhasesForMonth: async (year, month) => {
    try {
      const response = await instance.get(`/api/menstrual-cycle/phases/${year}/${month}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching phases:', error);
      throw error;
    }
  },

  // Get detailed phases for a month (with icons, colors, descriptions)
  getDetailedPhasesForMonth: async (year, month) => {
    try {
      const response = await instance.get(`/api/menstrual-cycle/phases-detailed/${year}/${month}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching detailed phases:', error);
      throw error;
    }
  },

  // Get logs for date range
  getLogsForDateRange: async (startDate, endDate) => {
    try {
      const response = await instance.get(`/api/menstrual-cycle/logs/${startDate}/${endDate}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  },

  // Get cycle summary with predictions
  getCycleSummary: async () => {
    try {
      const response = await instance.get('/api/menstrual-cycle/cycle-summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching cycle summary:', error);
      throw error;
    }
  },

  // Update cycle settings
  updateCycleSettings: async (settings) => {
    try {
      const response = await instance.patch('/api/menstrual-cycle/update-settings', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating cycle settings:', error);
      throw error;
    }
  }
};

export default MenstrualCycleService; 