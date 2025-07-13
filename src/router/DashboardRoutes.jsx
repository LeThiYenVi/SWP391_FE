import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/User/Dashboard';
import CycleTracking from '../pages/User/CycleTracking';
import Consultation from '../pages/User/Consultation';
import STITesting from '../pages/User/STITesting';
import BookingConfirmation from '../pages/User/STITesting/BookingConfirmation';
import QA from '../pages/User/QA';
import TrackingPage from '../pages/User/STITesting/TrackingPage';
import UserProfile from '../pages/User/UserProfile.jsx';

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
        <CycleTracking />
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
    path: '/sti-testing/booking-confirmation',
    element: (
      <ProtectedRoute>
        <BookingConfirmation />
      </ProtectedRoute>
    ),
  },
  {
    path: '/sti-testing/tracking/:bookingId',
    element: (
      <ProtectedRoute>
        <MainLayout title="Tracking trạng thái booking - Gynexa">
          <TrackingPage />
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
  {
    path: '/user/profile',
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
];

export default DashboardRoutes;
