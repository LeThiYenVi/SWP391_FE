import instance from "./customize-axios";

// =============Question APIs============
const submitQuestionAPI = async (questionData) => {
  try {
    const response = await instance.post('/api/qa/questions', questionData);
    console.log('Submit question success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Submit question error:', error.response?.data || error.message);
    throw error;
  }
};

const getUserQuestionsAPI = async (userId = null, status = null, pageNumber = 1, pageSize = 10) => {
  try {
    const params = { pageNumber, pageSize };
    if (userId) params.userId = userId;
    if (status) params.status = status;
    
    const response = await instance.get('/api/qa/user/questions', { params });
    console.log('Get user questions success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get user questions error:', error.response?.data || error.message);
    throw error;
  }
};

const getConsultantQuestionsAPI = async (category = null, pageNumber = 1, pageSize = 10) => {
  try {
    const params = { pageNumber, pageSize };
    if (category) params.category = category;
    
    const response = await instance.get('/api/qa/consultant/questions', { params });
    console.log('Get consultant questions success:', response.data);
    console.log('Response structure:', response);
    console.log('Response.data type:', typeof response.data);
    console.log('Response.data keys:', Object.keys(response.data || {}));
    
    // Check if response.data has the expected structure
    if (response.data && response.data.success !== undefined) {
      // If it's wrapped in ApiResponse format, extract the data
      const extractedData = response.data.data || response.data;
      console.log('Extracted data:', extractedData);
      console.log('Extracted data content:', extractedData?.content);
      console.log('First question in content:', extractedData?.content?.[0]);
      return extractedData;
    }
    
    console.log('Returning raw response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get consultant questions error:', error.response?.data || error.message);
    throw error;
  }
};

const getQuestionDetailsAPI = async (questionId) => {
  try {
    const response = await instance.get(`/api/qa/questions/${questionId}`);
    console.log('Get question details success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get question details error:', error.response?.data || error.message);
    throw error;
  }
};

const deleteQuestionAPI = async (questionId) => {
  try {
    const response = await instance.delete(`/api/qa/questions/${questionId}`);
    console.log('Delete question success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete question error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Answer APIs============
const answerQuestionAPI = async (questionId, answerData) => {
  try {
    const response = await instance.post(`/api/qa/questions/${questionId}/answers`, answerData);
    console.log('Answer question success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Answer question error:', error.response?.data || error.message);
    throw error;
  }
};

const updateAnswerAPI = async (answerId, answerData) => {
  try {
    const response = await instance.put(`/api/qa/answers/${answerId}`, answerData);
    console.log('Update answer success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update answer error:', error.response?.data || error.message);
    throw error;
  }
};

// =============FAQ APIs============
const getFAQsAPI = async (category = null) => {
  try {
    const params = {};
    if (category) params.category = category;
    
    const response = await instance.get('/api/qa/faq', { params });
    console.log('Get FAQs success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get FAQs error:', error.response?.data || error.message);
    throw error;
  }
};

const markQuestionAsPublicAPI = async (questionId, isPublic) => {
  try {
    const response = await instance.put(`/api/qa/questions/${questionId}/public`, null, {
      params: { isPublic }
    });
    console.log('Mark question as public success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Mark question as public error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Search and Categories APIs============
const getPopularCategoriesAPI = async (limit = 5) => {
  try {
    const response = await instance.get('/api/qa/categories/popular', {
      params: { limit }
    });
    console.log('Get popular categories success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get popular categories error:', error.response?.data || error.message);
    throw error;
  }
};

const searchQuestionsAPI = async (query, pageNumber = 1, pageSize = 10) => {
  try {
    const response = await instance.get('/api/qa/search', {
      params: { query, pageNumber, pageSize }
    });
    console.log('Search questions success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Search questions error:', error.response?.data || error.message);
    throw error;
  }
};

const getPublicQuestionsAPI = async (category = null, pageNumber = 1, pageSize = 10) => {
  try {
    const params = { pageNumber, pageSize };
    if (category) params.category = category;
    
    const response = await instance.get('/api/qa/public/questions', { params });
    console.log('Get public questions success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get public questions error:', error.response?.data || error.message);
    throw error;
  }
};

export {
  // Question APIs
  submitQuestionAPI,
  getUserQuestionsAPI,
  getConsultantQuestionsAPI,
  getQuestionDetailsAPI,
  deleteQuestionAPI,
  
  // Answer APIs
  answerQuestionAPI,
  updateAnswerAPI,
  
  // FAQ APIs
  getFAQsAPI,
  markQuestionAsPublicAPI,
  
  // Search and Categories APIs
  getPopularCategoriesAPI,
  searchQuestionsAPI,
  getPublicQuestionsAPI
}; 