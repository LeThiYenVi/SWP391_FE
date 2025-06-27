import axios from "axios";
import { toast } from "react-toastify";
import { routes } from "../routes";
import { API_BASE_URL } from "../config";

const instance = axios.create({
  baseURL: `${API_BASE_URL}`,
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
    return response.data ? response.data : { statusCode: response.status };
  },
  function (error) {
    if (error.response) {
      if (error.response.status === 401) {
        // Nếu request là login thì không redirect
        if (!error.config.url.includes('/api/auth/designer/login')) {
          localStorage.clear();
          localStorage.setItem("sessionExpired", "true");
          window.location.href = routes.login;
        }
      } else {
        console.error("Response error:", error.response);
      }
    } else if (error.request) {
      console.error("Request error:", error.request);
      toast.error("Không thể kết nối đến server. Vui lòng thử lại sau");
    } else {
      console.error("Error:", error.message);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại");
    }
    return Promise.reject(error);
  }
);


export default instance;