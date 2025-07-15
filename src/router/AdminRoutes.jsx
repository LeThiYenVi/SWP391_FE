import React from 'react';
import AdminDashboard from "../pages/admin/AdminDashboard"
import AdminOrder from "../pages/admin/AdminOrder"
import AdminOrderDetails from "../pages/admin/AdminOrderDetails"
import AdminProfile from "../pages/admin/AdminProfile"
import AdminUser from "../pages/admin/AdminUser"
import AdminConsultants from "../pages/admin/AdminConsultants"
import AdminTestingServices from "../pages/admin/AdminTestingServices"
import AdminContentManagement from "../pages/admin/AdminContentManagement"
// import ProtectedRoute from "../components/ProtectedRoute";
import { routes } from "../routes";
// import { Route, Routes, useLocation } from "react-router-dom";

const AdminRoutes = [
  {
    path: routes.adminDashboard,
    element: (
      // <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminDashboard />
      // </ProtectedRoute>
    ),
  },
  {
    path: routes.adminTestingServices,
    element: (
      // <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminTestingServices />
      // </ProtectedRoute>
    ),
  },
  {
    path: routes.adminOrder,
    element: (
      // <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminOrder />
      // </ProtectedRoute>
    ),
  },
  {
    path: routes.adminOrderDetail,
    element: (
      // <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminOrderDetails />
      // </ProtectedRoute>
    ),
  },
  {
    path: routes.adminProfile,
    element: (
      // <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminProfile />
      // </ProtectedRoute>
    ),
  },
  {
    path: routes.adminUser,
    element: (
      // <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminUser />
      // </ProtectedRoute>
    ),
  },
  {
    path: routes.adminCounselor,
    element: (
      // <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminConsultants />
      // </ProtectedRoute>
    ),
  },
  {
    path: routes.adminContentManagement,
    element: (
      // <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminContentManagement />
      // </ProtectedRoute>
    ),
  },
];

export default AdminRoutes;

// src/router/index.js

