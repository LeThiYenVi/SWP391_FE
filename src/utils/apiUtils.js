export const handleApiResponse = (response) => {
  if (!response || !response.data) {
    throw new Error('Invalid response format');
  }

  const responseData = response.data;

  if (responseData.success !== undefined) {
    if (!responseData.success) {
      throw new Error(responseData.message || 'API request failed');
    }
    return responseData.data || responseData;
  }

  return responseData;
};

export const handleApiError = (error, defaultMessage = 'Có lỗi xảy ra') => {
  if (error.response?.data) {
    const errorData = error.response.data;

    if (errorData.success !== undefined && !errorData.success) {
      return errorData.message || defaultMessage;
    } else if (errorData.message) {
      return errorData.message;
    } else if (typeof errorData === 'string') {
      return errorData;
    }
  }

  return error.message || defaultMessage;
};

/**
 * Tạo axios interceptor để tự động xử lý ApiResponse format
 * @param {Object} axiosInstance - Axios instance
 */
export const setupApiResponseInterceptor = (axiosInstance) => {
  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      // Tự động extract data từ ApiResponse format
      if (response.data && response.data.success !== undefined) {
        if (!response.data.success) {
          return Promise.reject(new Error(response.data.message || 'API request failed'));
        }
        response.data = response.data.data || response.data;
      }
      return response;
    },
    (error) => {
      // Tự động extract error message từ ApiResponse format
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.success !== undefined && !errorData.success) {
          error.message = errorData.message || error.message;
        }
      }
      return Promise.reject(error);
    }
  );
};

/**
 * Wrapper function để gọi API với xử lý ApiResponse format
 * @param {Function} apiCall - Function gọi API
 * @param {string} defaultErrorMessage - Default error message
 * @returns {Promise} - Promise với data đã được extract
 */
export const apiCallWrapper = async (apiCall, defaultErrorMessage = 'Có lỗi xảy ra') => {
  try {
    const response = await apiCall();
    return handleApiResponse(response);
  } catch (error) {
    const errorMessage = handleApiError(error, defaultErrorMessage);
    throw new Error(errorMessage);
  }
}; 