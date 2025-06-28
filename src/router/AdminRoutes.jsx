import React from 'react';
import AdminDashboard from "../pages/admin/AdminDashboard"
import ProtectedRoute from "../components/ProtectedRoute";
import { routes } from "../routes";
import { Route, Routes, useLocation } from "react-router-dom";

const AdminRoutes = [
  {
    path: routes.AdminDashboard,
    element: (
     <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminDashboard />
        </ProtectedRoute>
    ),
  },
];

export default AdminRoutes;

// src/router/index.js

