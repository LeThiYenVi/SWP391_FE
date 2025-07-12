import axios from "axios";
import { toast } from "react-toastify";
import { routes } from "../routes";
import { API_BASE_URL } from "../config";

const instance = axios.create({
  baseURL: API_BASE_URL,
});

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
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
    // Trả về toàn bộ response object để FE có thể truy cập response.data
    return response;
  },
  function (error) {
    if (error.response) {
      if (
        error.response.status === 401 &&
        window.location.pathname !== routes.login &&
        !error.config.url.includes('/api/auth/designer/login')
      ) {
        localStorage.clear();
        localStorage.setItem("sessionExpired", "true");
        window.location.href = routes.login;
      } else {
        console.error("Response error:", error.response);
      }
    } else if (error.request) {
      console.error("Request error:", error.request);
      toast.error("Không thể kết nối đến server. Vui lòng thử lại sau");
    } else {
      console.error("Error:", error.message);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại");
    }
    return Promise.reject(error);
  }
);


export default instance;