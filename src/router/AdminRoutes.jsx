import React from 'react';
import AdminDashboard from "../pages/admin/AdminDashboard"
import AdminOrder from "../pages/admin/AdminOrder"
import AdminOrderDetails from "../pages/admin/AdminOrderDetails"
import AdminProfile from "../pages/admin/AdminProfile"
import AdminUser from "../pages/admin/AdminUser"
import AdminCounselor from "../pages/admin/AdminCounselor"
import AdminWaiting from "../pages/admin/AdminWaiting"
import AdminTestingServices from "../pages/admin/AdminTestingServices"
import ProtectedRoute from "../components/ProtectedRoute";
import { routes } from "../routes";
// import { Route, Routes, useLocation } from "react-router-dom";

const AdminRoutes = [
  {
    path: routes.adminDashboard,
    element: (
      <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: routes.adminTestingServices,
    element: (
      <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
        <AdminTestingServices />
      </ProtectedRoute>
    ),
  },
  {
    path: routes.adminOrder,
    element: (
      <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
        <AdminOrder />
      </ProtectedRoute>
    ),
  },
  {
    path: routes.adminWaiting,
    element: (
      <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
        <AdminWaiting />
      </ProtectedRoute>
    ),
  },
  {
    path: routes.adminOrderDetail,
    element: (
      <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
        <AdminOrderDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: routes.adminProfile,
    element: (
      <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
        <AdminProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: routes.adminUser,
    element: (
      <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
        <AdminUser />
      </ProtectedRoute>
    ),
  },
  {
    path: routes.adminCounselor,
    element: (
      <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
        <AdminCounselor />
      </ProtectedRoute>
    ),
  },
];

export default AdminRoutes;

// src/router/index.js

