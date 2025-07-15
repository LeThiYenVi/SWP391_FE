import instance from "./customize-axios";

// =============Payment APIs============
const createPaymentAPI = async (paymentDetails) => {
  try {
    const response = await instance.post('/api/payment', paymentDetails);
    console.log('Create payment success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create payment error:', error.response?.data || error.message);
    throw error;
  }
};

const getPaymentStatusAPI = async (paymentId) => {
  try {
    const response = await instance.get(`/api/payment/${paymentId}/status`);
    console.log('Get payment status success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get payment status error:', error.response?.data || error.message);
    throw error;
  }
};

const refundPaymentAPI = async (paymentId) => {
  try {
    const response = await instance.post(`/api/payment/${paymentId}/refund`);
    console.log('Refund payment success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Refund payment error:', error.response?.data || error.message);
    throw error;
  }
};

const cancelPaymentAPI = async (paymentId) => {
  try {
    const response = await instance.post(`/api/payment/${paymentId}/cancel`);
    console.log('Cancel payment success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Cancel payment error:', error.response?.data || error.message);
    throw error;
  }
};

const updatePaymentAPI = async (paymentId, paymentDetails) => {
  try {
    const response = await instance.put(`/api/payment/${paymentId}`, paymentDetails);
    console.log('Update payment success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update payment error:', error.response?.data || error.message);
    throw error;
  }
};

const getPaymentHistoryAPI = async (userId) => {
  try {
    const response = await instance.get(`/api/payment/history/${userId}`);
    console.log('Get payment history success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get payment history error:', error.response?.data || error.message);
    throw error;
  }
};

const getAllPaymentsAPI = async (userId) => {
  try {
    const response = await instance.get(`/api/payment/all/${userId}`);
    console.log('Get all payments success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get all payments error:', error.response?.data || error.message);
    throw error;
  }
};

export {
  createPaymentAPI,
  getPaymentStatusAPI,
  refundPaymentAPI,
  cancelPaymentAPI,
  updatePaymentAPI,
  getPaymentHistoryAPI,
  getAllPaymentsAPI
}; 