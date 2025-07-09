import instance from "./customize-axios";
import { API_ENDPOINTS } from "../config";

// =============Auth============
const loginAPI = async (username, password, rememberMe = false) => {
  try {
    const response = await instance.post(API_ENDPOINTS.AUTH.LOGIN, {
      username,
      password,
      rememberMe
    });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const registerAPI = async (userData) => {
  try {
    const response = await instance.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

const verifyEmailAPI = async (token) => {
  try {
    const response = await instance.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
    return response;
  } catch (error) {
    console.error('Verify email error:', error);
    throw error;
  }
};

const resetPasswordAPI = async (token, newPassword) => {
  try {
    const response = await instance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      newPassword,
    });
    return response;
  } catch (error) {
    console.error('Reset password error:', error.response?.data || error.message);
    throw error;
  }
};

const forgotPasswordAPI = async (email) => {
  try {
    const response = await instance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

const updatePasswordAPI = async (currentPassword, newPassword) => {
  try {
    const response = await instance.post(API_ENDPOINTS.USER.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return response;
  } catch (error) {
    console.error('Password update error:', error.response?.data || error.message);
    throw error;
  }
};

// =============User============
const getUserProfileAPI = async () => {
  try {
    const response = await instance.get(API_ENDPOINTS.USER.PROFILE);
    return response;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

const updateUserProfileAPI = async (userData) => {
  try {
    const response = await instance.put(API_ENDPOINTS.USER.UPDATE_PROFILE, userData);
    return response;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// =============Search============
const searchContentAPI = async (query, filters = {}, page = 1, limit = 10) => {
  try {
    const response = await instance.get(API_ENDPOINTS.CONTENT.SEARCH, {
      params: {
        query,
        ...filters,
        page,
        limit
      }
    });
    return response;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

// =============Homepage============
const getHomepageDataAPI = async () => {
  try {
    const response = await instance.get(API_ENDPOINTS.CONTENT.HOMEPAGE);
    return response;
  } catch (error) {
    console.error('Get homepage data error:', error);
    throw error;
  }
};

export {
  // Auth exports
  loginAPI,
  registerAPI,
  verifyEmailAPI,
  resetPasswordAPI,
  forgotPasswordAPI,
  updatePasswordAPI,
  
  // User exports
  getUserProfileAPI,
  updateUserProfileAPI,
  
  // Search exports
  searchContentAPI,
  
  // Homepage exports
  getHomepageDataAPI
};
