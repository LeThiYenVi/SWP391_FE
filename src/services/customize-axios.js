import axios from "axios";
import { toast } from "react-toastify";
import { routes } from "../routes";
import { API_BASE_URL } from "../config";
import { setupApiResponseInterceptor } from "../utils/apiUtils";

const instance = axios.create({
  baseURL: API_BASE_URL,
});

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    if (response.data && response.data.success !== undefined) {
      if (!response.data.success) {
        const error = new Error(response.data.message || 'API request failed');
        error.response = {
          status: 400,
          data: response.data
        };
        return Promise.reject(error);
      }
      response.data = response.data.data || response.data;
    }

    return response;
  },
  function (error) {
    if (error.response) {
      if (error.response.data) {
        const errorData = error.response.data;
        if (errorData.success !== undefined && !errorData.success) {
          error.message = errorData.message || error.message;
        }
      }

      if (error.response.status === 401) {
        if (
          window.location.pathname !== routes.login &&
          !error.config.url.includes('/api/auth/') &&
          !error.config.url.includes('/api/chat/')
        ) {
          localStorage.clear();
          localStorage.setItem("sessionExpired", "true");
          window.location.href = routes.landing;
        }
      }
    } else if (error.request) {
      toast.error("Không thể kết nối đến server. Vui lòng thử lại sau");
    } else {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại");
    }
    return Promise.reject(error);
  }
);

export default instance;