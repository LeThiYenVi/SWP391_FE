// DashboardImproved.jsx - Refactored dashboard component
import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUserDashboard } from '../hooks/useUserDashboard';
import { HealthStatsGrid } from '../components/HealthStatsCard';
import QuickActionsGrid from '../components/QuickActionsGrid';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorBoundary from '../../../components/ErrorBoundary';
import './index.css';

// Lazy load heavy components
const NotificationsPanel = lazy(() =>
  import('../components/NotificationsPanel')
);
const RecentActivities = lazy(() => import('../components/RecentActivities'));
const HealthTips = lazy(() => import('../components/HealthTips'));
const ChatWidget = lazy(() => import('../components/ChatWidget'));

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    dashboardData,
    healthStats,
    quickActions,
    handleLogout,
    refreshDashboard,
  } = useUserDashboard();

  // Handle action clicks
  const handleQuickActionClick = (type, action) => {
    switch (type) {
      case 'auth_required':
        toast.info('Vui lòng đăng nhập để sử dụng tính năng này');
        navigate('/login', { state: { from: { pathname: action.link } } });
        break;
      case 'action_click':
        // Track user interaction
        // analytics.track('quick_action_clicked', { action_id: action.id });
        break;
    }
  };

  // Handle health stat clicks
  const handleHealthStatClick = stat => {
    switch (stat.id) {
      case 'period':
        navigate('/theo-doi-chu-ky');
        break;
      case 'ovulation':
        navigate('/theo-doi-chu-ky?focus=ovulation');
        break;
      case 'appointments':
        navigate('/tu-van?tab=history');
        break;
    }
  };

  const handleNotificationClick = notification => {
    // Mark as read and navigate
    switch (notification.type) {
      case 'period':
        navigate('/theo-doi-chu-ky');
        break;
      case 'appointment':
        navigate('/tu-van');
        break;
      default:
        break;
    }
  };

  if (dashboardData.loading) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner size="large" />
        <p>Đang tải dashboard...</p>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="dashboard-error">
        <h2>Có lỗi xảy ra</h2>
        <p>{dashboardData.error}</p>
        <button onClick={refreshDashboard} className="retry-button">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="dashboard-improved">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-content">
            <h1>Chào mừng trở lại, {user?.name || 'Bạn'}!</h1>
            <p>
              Theo dõi sức khỏe và quản lý lịch hẹn của bạn một cách dễ dàng
            </p>
          </div>
          <div className="welcome-actions">
            <button
              onClick={refreshDashboard}
              className="refresh-button"
              aria-label="Làm mới dữ liệu"
            >
              🔄 Làm mới
            </button>
          </div>
        </section>

        {/* Health Stats */}
        <section className="health-stats-section">
          <h2>Tình trạng sức khỏe</h2>
          <HealthStatsGrid
            stats={healthStats}
            onStatClick={handleHealthStatClick}
            loading={dashboardData.loading}
          />
        </section>

        {/* Quick Actions */}
        <section className="quick-actions-section">
          <QuickActionsGrid
            actions={quickActions}
            onActionClick={handleQuickActionClick}
            title="Dịch vụ nhanh"
            loading={dashboardData.loading}
          />
        </section>

        {/* Two Column Layout */}
        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="dashboard-left">
            {/* Notifications */}
            <Suspense fallback={<LoadingSpinner />}>
              <NotificationsPanel
                notifications={dashboardData.notifications}
                onNotificationClick={handleNotificationClick}
                loading={dashboardData.loading}
              />
            </Suspense>

            {/* Recent Activities */}
            <Suspense fallback={<LoadingSpinner />}>
              <RecentActivities
                activities={dashboardData.recentActivities}
                loading={dashboardData.loading}
              />
            </Suspense>
          </div>

          {/* Right Column */}
          <div className="dashboard-right">
            {/* Health Tips */}
            <Suspense fallback={<LoadingSpinner />}>
              <HealthTips
                tips={dashboardData.healthTips}
                loading={dashboardData.loading}
              />
            </Suspense>
          </div>
        </div>

        {/* Floating Chat Widget */}
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
