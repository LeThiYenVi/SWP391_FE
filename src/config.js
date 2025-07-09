// Use environment variables for API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.MODE === 'production' 
    ? "https://api.gynexacare.com" // Đổi thành API thực tế
    : "http://localhost:8080"); // API local cho development

// Cấu hình các API endpoint
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    VERIFY_EMAIL: "/api/auth/verify-email",
    LOGOUT: "/api/auth/logout",
  },
  
  // User endpoints
  USER: {
    PROFILE: "/api/users/profile",
    UPDATE_PROFILE: "/api/users/profile",
    CHANGE_PASSWORD: "/api/users/change-password",
  },
  
  // Content endpoints
  CONTENT: {
    SEARCH: "/api/content/search",
    HOMEPAGE: "/api/content/homepage",
  },
  
  // Feature endpoints
  CYCLE_TRACKING: "/api/cycle",
  CONSULTATION: "/api/consultation",
  STI_TESTING: "/api/sti-testing",
  QA: "/api/qa",
};

// Cấu hình khác
export const APP_CONFIG = {
  ITEMS_PER_PAGE: 10,
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  DEFAULT_AVATAR: "/assets/default-avatar.png",
};
