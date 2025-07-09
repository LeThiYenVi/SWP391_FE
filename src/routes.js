// src/routes.js
export const routes = {
  // Public routes
  landing: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  search: "/search",
  
  // User dashboard routes
  dashboard: "/dashboard",
  cycleTracking: "/cycle-tracking",
  consultation: "/consultation",
  stiTesting: "/sti-testing",
  qa: "/qa",
  profile: "/profile",
  settings: "/settings",
  
  // Vietnamese URL aliases (SEO friendly)
  tuVan: "/tu-van",
  theoDoiChuKy: "/theo-doi-chu-ky",
  xetNghiemSTI: "/xet-nghiem-sti",
  hoiDap: "/hoi-dap",
  
  // Admin routes
  adminDashboard: "/admin/dashboard",
  adminTestingServices: "/admin/testing-services",
  adminOrder: "/admin/order",
  adminOrderDetail: "/admin/orders/:orderId",
  adminProfile: "/admin/profile",
  adminUser: "/admin/user",
  adminCounselor: "/admin/counselor",
  adminWaiting: "/admin/waiting",
  
  // Catch all
  notFound: "*"
};
