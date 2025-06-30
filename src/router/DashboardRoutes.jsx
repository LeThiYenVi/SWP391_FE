import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/User/Dashboard';
import CycleTracking from '../pages/User/CycleTracking';
import Consultation from '../pages/User/Consultation';
import STITesting from '../pages/User/STITesting';
import QA from '../pages/User/QA';

const DashboardRoutes = [
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/cycle-tracking',
    element: (
      <ProtectedRoute>
        <MainLayout title="Theo dõi chu kỳ - Gynexa">
          <CycleTracking />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/consultation',
    element: (
      <ProtectedRoute>
        <MainLayout title="Tư vấn trực tuyến - Gynexa">
          <Consultation />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/sti-testing',
    element: (
      <ProtectedRoute>
        <MainLayout title="Xét nghiệm STIs - Gynexa">
          <STITesting />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/qa',
    element: (
      <ProtectedRoute>
        <MainLayout title="Hỏi đáp - Gynexa">
          <QA />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
];

export default DashboardRoutes;
