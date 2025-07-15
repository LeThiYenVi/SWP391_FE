// src/routes.js
export const routes = {
   landing: "/",
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    unauthorized: "/unauthorized",
    adminDashboard: "/admin/dashboard",
    adminTestingServices: "/admin/testing-services",
    adminOrder: "/admin/order",
    adminOrderDetail: "/admin/orders/:orderId",
    adminProfile: "/admin/profile",
    adminUser: "/admin/user",
    adminCounselor: "/admin/consultants",
    adminWaiting: "/admin/waiting",
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

    chat: "/chat",
    partnerDashboard: "/dashboard",
    designList: "/designs",
    furList: "/furnitures",
    orderList: "/orders",
    orderDetail: "/orders/:orderId",
    profile: "profile",
    newFurniture: "/furniture/create",
    newDesign: "/design/create",
    waitList: "/waiting-list",
    designDetail: "/design/detail/:id",
    furnitureDetail: "/furniture/detail/:id"

};
