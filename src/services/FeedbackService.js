import instance from "./customize-axios";

const submitConsultationFeedbackAPI = async (feedbackData) => {
  try {
    const response = await instance.post('/api/feedback/consultation', feedbackData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getConsultantFeedbackAPI = async (consultantId) => {
  try {
    const response = await instance.get(`/api/feedback/consultant/${consultantId}`);
    console.log('Get consultant feedback success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get consultant feedback error:', error.response?.data || error.message);
    throw error;
  }
};

const getConsultationFeedbackAPI = async (consultationId) => {
  try {
    const response = await instance.get(`/api/feedback/consultation/${consultationId}`);
    console.log('Get consultation feedback success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get consultation feedback error:', error.response?.data || error.message);
    throw error;
  }
};

const getBookingFeedbackAPI = async (bookingId) => {
  try {
    const response = await instance.get(`/api/feedback/booking/${bookingId}`);
    console.log('Get booking feedback success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get booking feedback error:', error.response?.data || error.message);
    throw error;
  }
};

const updateFeedbackAPI = async (feedbackId, feedbackData) => {
  try {
    const response = await instance.put(`/api/feedback/${feedbackId}`, feedbackData);
    console.log('Update feedback success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update feedback error:', error.response?.data || error.message);
    throw error;
  }
};

const deleteFeedbackAPI = async (feedbackId) => {
  try {
    const response = await instance.delete(`/api/feedback/${feedbackId}`);
    console.log('Delete feedback success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete feedback error:', error.response?.data || error.message);
    throw error;
  }
};

export {
  submitConsultationFeedbackAPI,
  getConsultantFeedbackAPI,
  getConsultationFeedbackAPI,
  getBookingFeedbackAPI,
  updateFeedbackAPI,
  deleteFeedbackAPI
}; 