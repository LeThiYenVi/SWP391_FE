import instance from "./customize-axios";

// =============Time Slot APIs============
const getAvailableTimeSlotsAPI = async (date) => {
  try {
    const response = await instance.get('/api/time-slots', {
      params: { date }
    });
    console.log('Get available time slots success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get available time slots error:', error.response?.data || error.message);
    throw error;
  }
};

const getAvailableTimeSlotsForConsultantAPI = async (date, consultantId) => {
  try {
    const response = await instance.get('/api/time-slots/consultant', {
      params: { date, consultantId }
    });
    console.log('Get available time slots for consultant success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get available time slots for consultant error:', error.response?.data || error.message);
    throw error;
  }
};

const getAvailableFacilityTimeSlotsAPI = async (date) => {
  try {
    const response = await instance.get('/api/time-slots/facility', {
      params: { date }
    });
    console.log('Get available facility time slots success:', response.data);
    // Backend trả về ApiResponse wrapper, cần lấy data từ response.data.data
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Get available facility time slots error:', error.response?.data || error.message);
    throw error;
  }
};

const getAvailableTimeSlotsByConsultantAPI = async (consultantId, fromDate, toDate) => {
  try {
    const response = await instance.get('/api/time-slots/available', {
      params: { consultantId, fromDate, toDate }
    });
    console.log('Get available time slots by consultant success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get available time slots by consultant error:', error.response?.data || error.message);
    throw error;
  }
};

const getTimeSlotsByConsultantAPI = async (consultantId, date) => {
  try {
    const response = await instance.get(`/api/time-slots/consultant/${consultantId}`, {
      params: { date }
    });
    console.log('Get time slots by consultant success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get time slots by consultant error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Time Slot Service Class============
class TimeSlotService {
  // Get available time slots for a specific date
  async getAvailableTimeSlots(date) {
    try {
      const data = await getAvailableTimeSlotsAPI(date);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Get available time slots for a specific consultant and date
  async getAvailableTimeSlotsForConsultant(date, consultantId) {
    try {
      const data = await getAvailableTimeSlotsForConsultantAPI(date, consultantId);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Get available facility time slots for a specific date
  async getAvailableFacilityTimeSlots(date) {
    try {
      const data = await getAvailableFacilityTimeSlotsAPI(date);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Get available time slots by consultant and date range
  async getAvailableTimeSlotsByConsultant(consultantId, fromDate, toDate) {
    try {
      const data = await getAvailableTimeSlotsByConsultantAPI(consultantId, fromDate, toDate);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Get time slots by consultant
  async getTimeSlotsByConsultant(consultantId, date) {
    try {
      const data = await getTimeSlotsByConsultantAPI(consultantId, date);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default new TimeSlotService(); 