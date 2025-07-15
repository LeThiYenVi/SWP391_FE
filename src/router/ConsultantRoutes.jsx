import React from 'react';
import ConsultantLayout from '../pages/Consultant/ConsultantLayout';
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
];

export default ConsultantRoutes;
