import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useCycle } from '../../../context/CycleContext';
import { useAppointment } from '../../../context/AppointmentContext';
import {
  Calendar,
  Heart,
  MessageCircle,
  TestTube,
  Bell,
  User,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './index.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { getDaysUntilNextPeriod, getDaysUntilOvulation, isInFertilityWindow } =
    useCycle();
  const { getUpcomingAppointments } = useAppointment();

  const upcomingAppointments = getUpcomingAppointments();
  const daysUntilPeriod = getDaysUntilNextPeriod();
  const daysUntilOvulation = getDaysUntilOvulation();
  const inFertilityWindow = isInFertilityWindow();

  const quickActions = [
    {
      title: 'Theo dõi chu kỳ',
      description: 'Ghi nhận chu kỳ và triệu chứng',
      icon: Calendar,
      link: '/cycle-tracking',
      color: 'pink',
    },
    {
      title: 'Đặt lịch tư vấn',
      description: 'Tư vấn với chuyên gia',
      icon: MessageCircle,
      link: '/consultation',
      color: 'blue',
    },
    {
      title: 'Xét nghiệm STIs',
      description: 'Đặt lịch xét nghiệm',
      icon: TestTube,
      link: '/sti-testing',
      color: 'green',
    },
    {
      title: 'Hỏi đáp',
      description: 'Gửi câu hỏi cho tư vấn viên',
      icon: Heart,
      link: '/qa',
      color: 'purple',
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
          </div>
          <div className="header-actions">
            <Bell className="notification-icon" />
            <Link to="/profile" className="user-profile-link">
              <User className="h-6 w-6" />
              <span>{user?.name}</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="dashboard-main">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2 className="welcome-title">Chào mừng trở lại, {user?.name}!</h2>
          <p className="welcome-subtitle">
            Đây là tổng quan về sức khỏe và lịch trình của bạn
          </p>
        </div>

        {/* Health Overview Cards */}
        <div className="health-overview">
          {/* Cycle Card */}
          <div className="health-card cycle-card">
            <div className="health-card-content">
              <div className="health-card-info">
                <h3>Chu kỳ kinh nguyệt</h3>
                {daysUntilPeriod !== null ? (
                  <p className="health-card-number">{daysUntilPeriod} ngày</p>
                ) : (
                  <p className="health-card-number">Chưa thiết lập</p>
                )}
                <p className="health-card-label">đến kỳ kinh tiếp theo</p>
              </div>
              <Calendar className="health-card-icon" />
            </div>
          </div>

          {/* Ovulation Card */}
          <div
            className={`health-card ${
              inFertilityWindow ? 'ovulation-card' : ''
            }`}
          >
            <div className="health-card-content">
              <div className="health-card-info">
                <h3>Rụng trứng</h3>
                {daysUntilOvulation !== null ? (
                  <p className="health-card-number">
                    {daysUntilOvulation} ngày
                  </p>
                ) : (
                  <p className="health-card-number">Chưa thiết lập</p>
                )}
                <p className="health-card-label">
                  {inFertilityWindow
                    ? 'Đang trong thời kỳ màu mỡ'
                    : 'đến thời kỳ rụng trứng'}
                </p>
              </div>
              <Heart className="health-card-icon" />
            </div>
          </div>

          {/* Appointments Card */}
          <div className="health-card appointment-card">
            <div className="health-card-content">
              <div className="health-card-info">
                <h3>Lịch hẹn</h3>
                <p className="health-card-number">
                  {upcomingAppointments.length}
                </p>
                <p className="health-card-label">lịch hẹn sắp tới</p>
              </div>
              <MessageCircle className="health-card-icon" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h3 className="section-title">Thao tác nhanh</h3>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link} className="quick-action-card">
                <div className={`action-icon ${action.color}`}>
                  <action.icon />
                </div>
                <h4 className="action-title">{action.title}</h4>
                <p className="action-description">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity & Upcoming Appointments */}
        <div className="content-grid">
          {/* Upcoming Appointments */}
          <div className="content-card">
            <div className="content-card-header">
              <h3 className="content-card-title">Lịch hẹn sắp tới</h3>
              <Link to="/appointments" className="view-all-link">
                Xem tất cả
              </Link>
            </div>
            {upcomingAppointments.length > 0 ? (
              <div className="appointment-list">
                {upcomingAppointments.slice(0, 3).map(appointment => (
                  <div key={appointment.id} className="appointment-item">
                    <div className="appointment-info">
                      <p className="appointment-doctor">
                        Dr. {appointment.counselorName}
                      </p>
                      <p className="appointment-time">
                        {appointment.date} lúc {appointment.time}
                      </p>
                    </div>
                    <span className="appointment-status">
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">Không có lịch hẹn nào</p>
            )}
          </div>

          {/* Health Tips */}
          <div className="content-card">
            <h3 className="content-card-title">Mẹo sức khỏe</h3>
            <div className="health-tips">
              <div className="health-tip blue">
                <h4 className="tip-title">Theo dõi chu kỳ đều đặn</h4>
                <p className="tip-content">
                  Ghi chép chu kỳ kinh nguyệt giúp bạn hiểu rõ hơn về cơ thể
                  mình
                </p>
              </div>
              <div className="health-tip green">
                <h4 className="tip-title">Tầm soát định kỳ</h4>
                <p className="tip-content">
                  Xét nghiệm STIs định kỳ là cách tốt nhất để bảo vệ sức khỏe
                  sinh sản
                </p>
              </div>
              <div className="health-tip purple">
                <h4 className="tip-title">Tư vấn chuyên gia</h4>
                <p className="tip-content">
                  Đừng ngần ngại đặt câu hỏi với các chuyên gia của chúng tôi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
