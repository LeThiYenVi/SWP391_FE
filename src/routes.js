// src/routes.js - Healthcare Service Routes
export const routes = {
    // Public routes
    landing: "/",
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    unauthorized: "/unauthorized",
    
    // User dashboard routes
    dashboard: "/dashboard",
    profile: "/profile",
    userProfile: "/user/profile",
    notifications: "/notifications",
    
    // Service routes (Vietnamese)
    consultation: "/tu-van",
    cycleTracking: "/theo-doi-chu-ky",
    stiTesting: "/xet-nghiem-sti",
    qa: "/hoi-dap",
    
    // Service routes (English - for backward compatibility)
    consultationEn: "/consultation",
    cycleTrackingEn: "/cycle-tracking",
    stiTestingEn: "/sti-testing",
    qaEn: "/qa",
    
    // Admin routes
    adminDashboard: "/admin/dashboard",
    adminTestingServices: "/admin/testing-services",
    adminOrder: "/admin/order",
    adminOrderDetail: "/admin/orders/:orderId",
    adminProfile: "/admin/profile",
    adminUser: "/admin/user",
    adminCounselor: "/admin/consultants",
    adminContentManagement: "/admin/content-management",

    // Consultant routes
    consultantDashboard: "/consultant/dashboard",
    consultantAppointments: "/consultant/appointments",
    consultantMessages: "/consultant/messages",
    consultantProfile: "/consultant/profile",
    consultantAnalytics: "/consultant/analytics",
    consultantSettings: "/consultant/settings",

    // Staff routes
    staffDashboard: "/staff",
    staffAppointments: "/staff/appointments",
    staffSampleCollection: "/staff/sample-collection",
    staffUploadResult: "/staff/upload-result",
    staffServiceInput: "/staff/service-input",

    // Chat and communication
    chat: "/chat",
    
    // Booking and tracking
    bookingConfirmation: "/booking-confirmation",
    stiBookingConfirmation: "/sti-testing/booking-confirmation",
    trackingPage: "/sti-testing/tracking/:bookingId"
};
