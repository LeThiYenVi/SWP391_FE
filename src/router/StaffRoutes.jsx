import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import StaffLayout from '../pages/Staff/StaffLayout';
import StaffAppointments from '../pages/Staff/StaffAppointments';
import StaffSampleCollection from '../pages/Staff/StaffSampleCollection';
import StaffUploadResult from '../pages/Staff/StaffUploadResult';
import StaffServiceInput from '../pages/Staff/StaffServiceInput';

const StaffRoutes = [
  {
    path: '/staff',
    element: (
      <ProtectedRoute allowedRoles={['staff', 'admin']}>
        <StaffLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: '/staff/appointments',
    element: (
      <ProtectedRoute allowedRoles={['staff', 'admin']}>
        <StaffLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: '/staff/sample-collection',
    element: (
      <ProtectedRoute allowedRoles={['staff', 'admin']}>
        <StaffLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: '/staff/upload-result',
    element: (
      <ProtectedRoute allowedRoles={['staff', 'admin']}>
        <StaffLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: '/staff/service-input',
    element: (
      <ProtectedRoute allowedRoles={['staff', 'admin']}>
        <StaffLayout />
      </ProtectedRoute>
    ),
  },
];

export default StaffRoutes;
