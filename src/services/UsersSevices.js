import instance from "./customize-axios";

// =============Authentication APIs============
const loginAPI = async (username, password) => {
  try {
    const response = await instance.post('/api/auth/login', {
      username,
      password,
    });
    console.log('Login success response:', response);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const registerAPI = async (userData) => {
  console.log('Sending registration data to backend:', userData);
  try {
    const response = await instance.post('/api/auth/register', {
      username: userData.username,
      password: userData.password,
      email: userData.email,
      fullName: userData.fullName,
    });
    console.log('Register success:', response.data);
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
    console.log('Validating OTP for email:', email, 'OTP:', otpCode);
    
    const response = await instance.post('/api/auth/validate-otp', {
      email: email,
      otpCode: otpCode
    });
    
    console.log('Validate OTP full response:', response);
    console.log('Validate OTP response.data:', response.data);
    console.log('Validate OTP response.status:', response.status);
    console.log('Validate OTP response.headers:', response.headers);
    
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
    console.log('DEBUG - Calling reset password API with token:', token ? `${token.substring(0, 10)}...` : 'invalid token');
    
    // Nếu có email và otpCode từ extraParams, sử dụng format OTP-based reset
    if (extraParams.email && extraParams.otpCode) {
      const requestData = {
        email: extraParams.email,
        otpCode: extraParams.otpCode,
        newPassword: newPassword
      };
      
      console.log('DEBUG - Using OTP-based reset with email:', extraParams.email);
      const response = await instance.post('/api/auth/reset-password', requestData);
      console.log('DEBUG - Reset password success:', response.data);
      return response.data;
    } else {
      // Fallback to token-based reset (old format)
      const requestData = {
        token: token,
        newPassword: newPassword,
        ...extraParams
      };
      
      const response = await instance.post('/api/auth/reset-password', requestData);
      console.log('DEBUG - Reset password success:', response.data);
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
    console.log('Password update success:', response.data);
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
    console.log('Google Login success:', response);
    return response;
  } catch (error) {
    console.error('Google Login error:', error);
    throw error;
  }
};

const logoutAPI = async () => {
  try {
    const response = await instance.post('/api/auth/logout');
    console.log('Logout success:', response.data);
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
    console.log('Refresh token success:', response.data);
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
    console.log('Get user profile success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get user profile error:', error.response?.data || error.message);
    throw error;
  }
};

const updateUserProfileAPI = async (profileData) => {
  try {
    const response = await instance.put('/api/user/profile', profileData);
    console.log('Update user profile success:', response.data);
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

// =============Admin APIs============
const getAllAccountsAPI = async (role = null, pageNumber = -1, pageSize = -1) => {
  try {
    const params = {};

    if (role !== null) {
      params.role = role;
    }

    if (pageNumber !== -1) {
      params.pageNumber = pageNumber;
    }

    if (pageSize !== -1) {
      params.pageSize = pageSize;
    }

    const response = await instance.get('/api/admin/users', { params });
    console.log('Get all accounts success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get all accounts error:', error.response?.data || error.message);
    throw error;
  }
};

const getAwaitingDesignersAPI = async () => {
  try {
    const response = await instance.get('/api/admin/users/awaiting-designers');
    console.log('Get awaiting designers success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get awaiting designers error:', error.response?.data || error.message);
    throw error;
  }
};

const applicationResultAPI = async (userId, status) => {
  try {
    const response = await instance.post('/api/admin/users/application-result', {
      userId,
      status
    });
    console.log('Application result success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Application result error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Dashboard APIs============
const getRevenueByDayAPI = async (month, year) => {
  try {
    const response = await instance.get('/api/admin/dashboard/revenue-by-day', {
      params: { month, year }
    });
    console.log('Get revenue by day success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get revenue by day error:', error.response?.data || error.message);
    throw error;
  }
};

const getAllOrdersAPI = async (pageNumber = -1, pageSize = -1) => {
  try {
    const params = {};

    if (pageNumber !== -1) {
      params.pageNumber = pageNumber;
    }

    if (pageSize !== -1) {
      params.pageSize = pageSize;
    }

    const response = await instance.get('/api/admin/orders', { params });
    console.log('Get all orders success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get all orders error:', error.response?.data || error.message);
    throw error;
  }
};

const getTopDesignersByRevenueAPI = async (topN = 5) => {
  try {
    const response = await instance.get('/api/admin/dashboard/top-designers', {
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
const getNewProductsAPI = async (pageNumber = -1, pageSize = -1) => {
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
const getAllTestingServicesAPI = async (pageNumber = -1, pageSize = -1) => {
  try {
    const params = {};

    if (pageNumber !== -1) {
      params.pageNumber = pageNumber;
    }

    if (pageSize !== -1) {
      params.pageSize = pageSize;
    }

    const response = await instance.get('/api/admin/testing-services', { params });
    console.log('Get all testing services success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get all testing services error:', error.response?.data || error.message);
    throw error;
  }
};

export {
  // Authentication APIs
  loginAPI,
  registerAPI,
  forgetPasswordAPI,
  validateOtpAPI,
  resetPasswordAPI,
  updatePasswordAPI,
  loginByGoogleAPI,
  logoutAPI,
  refreshTokenAPI,
  
  // User Profile APIs
  getUserProfileAPI,
  updateUserProfileAPI,
  getUserBookingHistoryAPI,
  
  // Menstrual Cycle APIs
  addOrUpdateMenstrualCycleAPI,
  logMenstrualPeriodAPI,
  getMenstrualCycleTrackerAPI,
  getUserRemindersAPI,
  
  // Admin APIs
  getAllAccountsAPI,
  getAwaitingDesignersAPI,
  applicationResultAPI,
  
  // Dashboard APIs
  getRevenueByDayAPI,
  getAllOrdersAPI,
  getTopDesignersByRevenueAPI,
  getOrderStatusByMonthAPI,
  getCustomerGrowthAPI,
  
  // Product APIs
  getNewProductsAPI,
  createNewProductAPI,
  
  // Category APIs
  getAllCategoriesAPI,
  
  // Furniture APIs
  createFurnitureAPI,
  updateFurnitureAPI,
  
  // Design APIs
  createDesignAPI,
  updateDesignAPI,
  
  // Order APIs
  getOrdersById,
  
  // Designer APIs
  registerDesignerAPI,
  getAllOrdersByDesAPI,
  getAllFursByDesAPI,
  
  // Testing Services APIs
  getAllTestingServicesAPI
};
