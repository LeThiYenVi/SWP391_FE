import instance from "./customize-axios";

// =============Authentication APIs============
const loginAPI = async (username, password) => {
  try {
    const response = await instance.post('/api/auth/login', {
      username,
      password,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const registerAPI = async (userData) => {
  
  try {
    const response = await instance.post('/api/auth/register', {
      username: userData.username,
      password: userData.password,
      email: userData.email,
      fullName: userData.fullName,
    });

    return response.data;
  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);
    throw error;
  }
};

const forgetPasswordAPI = async (email, verificationUrl = null) => {
  try {
    const requestBody = { 
      email: email 
    };
    if (verificationUrl) {
      requestBody.otpVerificationLink = verificationUrl;
    }
    
    const response = await instance.post('/api/auth/forgot-password', requestBody);
    return response.data;
  } catch (error) {
    console.error('Forget password API error:', error.message);
    throw error;
  }
};

const validateOtpAPI = async (email, otpCode) => {
  try {

    
    const response = await instance.post('/api/auth/validate-otp', {
      email: email,
      otpCode: otpCode
    });
    
    
    
    return response.data;
  } catch (error) {
    console.error('Validate OTP error:', error.message);
    
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    }
    
    throw error;
  }
};

const resetPasswordAPI = async (token, newPassword, extraParams = {}) => {
  try {

    
    // Nếu có email và otpCode từ extraParams, sử dụng format OTP-based reset
    if (extraParams.email && extraParams.otpCode) {
      const requestData = {
        email: extraParams.email,
        otpCode: extraParams.otpCode,
        newPassword: newPassword
      };
      

      const response = await instance.post('/api/auth/reset-password', requestData);
      return response.data;
    } else {
      // Fallback to token-based reset (old format)
      const requestData = {
        token: token,
        newPassword: newPassword,
        ...extraParams
      };
      
      const response = await instance.post('/api/auth/reset-password', requestData);
      return response.data;
    }
  } catch (error) {
    console.error('DEBUG - Reset password error:', error.response?.data || error.message);
    throw error;
  }
};

const updatePasswordAPI = async (password, newPassword) => {
  try {
    const response = await instance.post('/api/auth/update-password', null, {
      params: {
        password,
        newPassword,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Password update error:', error.response?.data || error.message);
    throw error;
  }
};

const loginByGoogleAPI = async code => {
  try {


    const response = await instance.post('/api/auth/login-by-google', {
      code,
    });


    return response;
  } catch (error) {
    console.error('❌ Google Login API error:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    throw error;
  }
};

const logoutAPI = async () => {
  try {
    const response = await instance.post('/api/auth/logout');

    return response.data;
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
    throw error;
  }
};

const refreshTokenAPI = async (refreshToken) => {
  try {
    const response = await instance.post('/api/auth/refresh-token', {
      refreshToken
    });

    return response.data;
  } catch (error) {
    console.error('Refresh token error:', error.response?.data || error.message);
    throw error;
  }
};

// =============User Profile APIs============
const getUserProfileAPI = async () => {
  try {
    const response = await instance.get('/api/user/profile');

    return response.data;
  } catch (error) {
    console.error('Get user profile error:', error.response?.data || error.message);
    throw error;
  }
};

const getUserProfileWithTrendsAPI = async () => {
  try {
    const response = await instance.get('/api/user/profile/trends');
    console.log('Get user profile with trends success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get user profile with trends error:', error.response?.data || error.message);
    throw error;
  }
};

const updateUserProfileAPI = async (profileData) => {
  try {
    const response = await instance.put('/api/user/profile', profileData);

    return response.data;
  } catch (error) {
    console.error('Update user profile error:', error.response?.data || error.message);
    throw error;
  }
};

const getUserBookingHistoryAPI = async () => {
  try {
    const response = await instance.get('/api/user/booking-history');
    console.log('Get booking history success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get booking history error:', error.response?.data || error.message);
    throw error;
  }
};

// =============User Menstrual Cycle APIs============
const addOrUpdateMenstrualCycleAPI = async (cycleData) => {
  try {
    const response = await instance.post('/api/user/menstrual-cycle', cycleData);
    console.log('Add/Update menstrual cycle success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Add/Update menstrual cycle error:', error.response?.data || error.message);
    throw error;
  }
};

const logMenstrualPeriodAPI = async (logData) => {
  try {
    const response = await instance.post('/api/user/menstrual-cycle/log', logData);
    console.log('Log menstrual period success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Log menstrual period error:', error.response?.data || error.message);
    throw error;
  }
};

const getMenstrualCycleTrackerAPI = async () => {
  try {
    const response = await instance.get('/api/user/menstrual-cycle/tracker');
    console.log('Get menstrual cycle tracker success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get menstrual cycle tracker error:', error.response?.data || error.message);
    throw error;
  }
};

const getUserRemindersAPI = async () => {
  try {
    const response = await instance.get('/api/user/reminders');
    console.log('Get user reminders success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get user reminders error:', error.response?.data || error.message);
    throw error;
  }
};



// =============Dashboard APIs============
const getRevenueByDayAPI = async (month, year) => {
  try {
    const response = await instance.get('/api/admin/reports/dashboard', {
      params: { month, year }
    });
    console.log('Get revenue by day success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get revenue by day error:', error.response?.data || error.message);
    throw error;
  }
};

const getAllOrdersAPI = async (pageNumber = 1, pageSize = 10) => {
  try {
    const params = {};
    if (pageNumber > 0) {
      params.pageNumber = pageNumber;
    }
    if (pageSize > 0) {
      params.pageSize = pageSize;
    }
    const response = await instance.get('/api/admin/reports/overview', { params });
    console.log('Get all orders success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get all orders error:', error.response?.data || error.message);
    throw error;
  }
};

const getTopDesignersByRevenueAPI = async (topN = 5) => {
  try {
    const response = await instance.get('/api/admin/reports/bookings', {
      params: { topN }
    });
    console.log('Get top designers by revenue success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get top designers by revenue error:', error.response?.data || error.message);
    throw error;
  }
};

const getOrderStatusByMonthAPI = async (month, year) => {
  try {
    const response = await instance.get('/api/admin/dashboard/order-status-by-month', {
      params: { month, year }
    });
    console.log('Get order status by month success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get order status by month error:', error.response?.data || error.message);
    throw error;
  }
};

const getCustomerGrowthAPI = async () => {
  try {
    const response = await instance.get('/api/admin/dashboard/customer-growth');
    console.log('Get customer growth success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get customer growth error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Product APIs============
const getNewProductsAPI = async (pageNumber = 1, pageSize = 10) => {
  try {
    const response = await instance.get('/api/products/new', {
      params: {
        pageNumber,
        pageSize,
      },
    });
    console.log('Get new products success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get new products error:', error.response?.data || error.message);
    throw error;
  }
};

const createNewProductAPI = async (id) => {
  try {
    const response = await instance.post('/api/products/new', null, {
      params: { id },
    });
    console.log('Create new product success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create new product error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Category APIs============
const getAllCategoriesAPI = async (style = null, pageNumber = -1, pageSize = -1) => {
  try {
    const params = {};

    if (style !== null) {
      // Giữ style là kiểu boolean ngay từ đầu
      params.style = style;
    }

    if (pageNumber !== -1) {
      params.pageNumber = pageNumber;
    }

    if (pageSize !== -1) {
      params.pageSize = pageSize;
    }

    const response = await instance.get('/api/categories', { params });
    console.log('Get all categories success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get all categories error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Furniture APIs============
const createFurnitureAPI = async (formData) => {
  try {
    const response = await instance.post('/api/furnitures', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Create furniture success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create furniture error:', error.response?.data || error.message);
    throw error;
  }
};

const updateFurnitureAPI = async (id, formData) => {
  try {
    const response = await instance.put(`/api/furnitures/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Update furniture success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update furniture error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Design APIs============
const createDesignAPI = async (formData) => {
  try {
    const response = await instance.post('/api/designs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Create design success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create design error:', error.response?.data || error.message);
    throw error;
  }
};

const updateDesignAPI = async (id, formData) => {
  try {
    const response = await instance.put(`/api/designs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Update design success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update design error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Order APIs============
const getOrdersById = async (orderId) => {
  try {
    const response = await instance.get(`/api/orders/${orderId}`);
    console.log('Get order by ID success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get order by ID error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Designer APIs============
const registerDesignerAPI = async (name, email, password, applicationUrl) => {
  try {
    const response = await instance.post('/api/auth/designer/register', {
      name,
      email,
      password,
      applicationUrl,
    });
    console.log('Register designer success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Register designer error:', error.response?.data || error.message);
    throw error;
  }
};

const getAllOrdersByDesAPI = async (pageNumber = -1, pageSize = -1) => {
  try {
    const response = await instance.get('/api/designer/orders', {
      params: { pageNumber, pageSize },
    });
    console.log('Get all orders by designer success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get all orders by designer error:', error.response?.data || error.message);
    throw error;
  }
};

const getAllFursByDesAPI = async (pageNumber = -1, pageSize = -1) => {
  try {
    const response = await instance.get('/api/designer/furnitures', {
      params: { pageNumber, pageSize },
    });
    console.log('Get all furnitures by designer success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get all furnitures by designer error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Testing Services APIs============
const getAllTestingServicesAPI = async (pageNumber = 1, pageSize = 100) => {
  try {
    const response = await instance.get('/api/admin/testing-services', {
      params: { pageNumber, pageSize }
    });
    console.log('Get all testing services success:', response);
    
    // Kiểm tra cấu trúc response
    if (response.data && response.data.content) {
      // Nếu response có cấu trúc pagination
      return response.data.content;
    } else if (Array.isArray(response.data)) {
      // Nếu response là array trực tiếp
      return response.data;
    } else {
      // Fallback
      return response.data || [];
    }
  } catch (error) {
    console.error('Get all testing services error:', error.response?.data || error.message);
    throw error;
  }
};

const updateTestingServiceAPI = async (serviceId, updateData) => {
  try {
    const response = await instance.patch(`/api/admin/testing-services/${serviceId}`, updateData);
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

// =============Booking APIs============
const getAllBookingsAPI = async (pageNumber = 1, pageSize = 10) => {
  try {
    const response = await instance.get('/api/admin/testing-services/bookings', {
      params: { pageNumber, pageSize }
    });
    console.log('Get all bookings success:', response);
    
    // Kiểm tra cấu trúc response
    if (response.data && response.data.content) {
      // Nếu response có cấu trúc pagination
      return response.data;
    } else if (Array.isArray(response.data)) {
      // Nếu response là array trực tiếp
      return {
        content: response.data,
        pageNumber: 1,
        pageSize: response.data.length,
        totalElements: response.data.length,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false
      };
    } else {
      // Fallback
      return response.data || {
        content: [],
        pageNumber: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false
      };
    }
  } catch (error) {
    console.error('Get all bookings error:', error.response?.data || error.message);
    throw error;
  }
};

export {
  loginAPI,
  registerAPI,
  forgetPasswordAPI,
  validateOtpAPI,
  resetPasswordAPI,
  updatePasswordAPI,
  loginByGoogleAPI,
  logoutAPI,
  refreshTokenAPI,
  getUserProfileAPI,
  getUserProfileWithTrendsAPI,
  updateUserProfileAPI,
  getUserBookingHistoryAPI,
  addOrUpdateMenstrualCycleAPI,
  logMenstrualPeriodAPI,
  getMenstrualCycleTrackerAPI,
  getUserRemindersAPI,
  getRevenueByDayAPI,
  getAllOrdersAPI,
  getTopDesignersByRevenueAPI,
  getOrderStatusByMonthAPI,
  getCustomerGrowthAPI,
  getNewProductsAPI,
  createNewProductAPI,
  getAllCategoriesAPI,
  createFurnitureAPI,
  updateFurnitureAPI,
  createDesignAPI,
  updateDesignAPI,
  
  // Order APIs
  getOrdersById,
  
  // Designer APIs
  registerDesignerAPI,
  getAllOrdersByDesAPI,
  getAllFursByDesAPI,
  
  // Testing Services APIs
  getAllTestingServicesAPI,
  updateTestingServiceAPI,
  deleteTestingServiceAPI,
  
  // Booking APIs
  getAllBookingsAPI
};
