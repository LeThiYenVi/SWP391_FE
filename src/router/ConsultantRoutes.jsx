import React from 'react';
import ConsultantLayout from '../pages/Consultant/ConsultantLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import { Navigate } from 'react-router-dom';

const ConsultantRoutes = [
  {
    path: '/consultant',
    element: (
      <ProtectedRoute allowedRoles={['consultant', 'counselor', 'CONSULTANT', 'COUNSELOR', 'ROLE_CONSULTANT', 'ROLE_COUNSELOR']}>
        <Navigate to="/consultant/dashboard" replace />
      </ProtectedRoute>
    ),
  },
  {
    path: '/consultant/create-appointment',
    element: (
      <ProtectedRoute allowedRoles={['consultant', 'counselor', 'CONSULTANT', 'COUNSELOR', 'ROLE_CONSULTANT', 'ROLE_COUNSELOR']}>
        <ConsultantLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: '/consultant/*',
    element: (
      <ProtectedRoute allowedRoles={['consultant', 'counselor', 'CONSULTANT', 'COUNSELOR', 'ROLE_CONSULTANT', 'ROLE_COUNSELOR']}>
        <ConsultantLayout />
      </ProtectedRoute>
    ),
  },
];

export default ConsultantRoutes;
