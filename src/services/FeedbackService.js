import instance from "./customize-axios";

// =============Feedback APIs============
const submitConsultationFeedbackAPI = async (feedbackData) => {
  try {
    const response = await instance.post('/api/feedback/consultation', feedbackData);
    console.log('Submit consultation feedback success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Submit consultation feedback error:', error.response?.data || error.message);
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

export {
  submitConsultationFeedbackAPI,
  getConsultantFeedbackAPI
}; 