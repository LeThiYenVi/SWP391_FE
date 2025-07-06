import React from 'react';
import ConsultantLayout from '../pages/Consultant/ConsultantLayout';
import ConsultantDashboard from '../pages/Consultant/ConsultantDashboard';
import ConsultantAppointments from '../pages/Consultant/ConsultantAppointments';
import ConsultantMessages from '../pages/Consultant/ConsultantMessages';
import ConsultantProfile from '../pages/Consultant/ConsultantProfile';
import ProtectedRoute from '../components/ProtectedRoute';

const ConsultantRoutes = [
  {
    path: '/consultant/*',
    element: (
      <ProtectedRoute allowedRoles={['consultant', 'counselor']}>
        <ConsultantLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: '/consultant',
    element: (
      <ProtectedRoute allowedRoles={['consultant', 'counselor']}>
        <ConsultantLayout />
      </ProtectedRoute>
    ),
  },
  // Individual consultant routes (for direct access)
  {
    path: '/consultant/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['consultant', 'counselor']}>
        <ConsultantDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/consultant/appointments',
    element: (
      <ProtectedRoute allowedRoles={['consultant', 'counselor']}>
        <ConsultantAppointments />
      </ProtectedRoute>
    ),
  },
  {
    path: '/consultant/messages',
    element: (
      <ProtectedRoute allowedRoles={['consultant', 'counselor']}>
        <ConsultantMessages />
      </ProtectedRoute>
    ),
  },
  {
    path: '/consultant/profile',
    element: (
      <ProtectedRoute allowedRoles={['consultant', 'counselor']}>
        <ConsultantProfile />
      </ProtectedRoute>
    ),
  },
];

export default ConsultantRoutes;
