import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MessageCircle,
  Clock,
  Star,
  TrendingUp,
  Users,
  Video,
  Phone,
  Eye,
  BarChart3,
} from 'lucide-react';
import { useConsultant } from '../../context/ConsultantContext';
import './ConsultantDashboard.css';

const ConsultantDashboard = () => {
  const navigate = useNavigate();
  const {
    consultantProfile,
    stats,
    upcomingAppointments,
    recentChats,
    loadDashboardStats,
    loadAppointments,
    loadRecentChats,
    updateAppointmentStatus,
  } = useConsultant();

  // Mock data - replace with actual data from context
  const mockStats = {
    completedToday: 8,
    activeChats: 12,
    pendingAppointments: 5,
    rating: 4.9,
    monthlyRevenue: 15000000,
    totalRevenue: 180000000,
  };

  const mockUpcomingAppointments = [
    {
      id: 1,
      patientName: 'Nguyễn Thị Mai',
      patientAvatar: 'https://i.pravatar.cc/100?u=1',
      time: '09:00',
      type: 'video',
      reason: 'Tư vấn chu kỳ kinh nguyệt',
      status: 'scheduled',
    },
    {
      id: 2,
      patientName: 'Trần Thị Lan',
      patientAvatar: 'https://i.pravatar.cc/100?u=2',
      time: '10:30',
      type: 'phone',
      reason: 'Tư vấn sức khỏe sinh sản',
      status: 'scheduled',
    },
    {
      id: 3,
      patientName: 'Lê Thị Hoa',
      patientAvatar: 'https://i.pravatar.cc/100?u=3',
      time: '14:00',
      type: 'chat',
      reason: 'Tư vấn sức khỏe thai kỳ',
      status: 'scheduled',
    },
  ];

  const mockRecentChats = [
    {
      id: 1,
      patientName: 'Nguyễn Thị Mai',
      patientAvatar: 'https://i.pravatar.cc/100?u=1',
      lastMessage: 'Cảm ơn bác sĩ đã tư vấn...',
      timestamp: '2 phút trước',
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: 2,
      patientName: 'Trần Thị Lan',
      patientAvatar: 'https://i.pravatar.cc/100?u=2',
      lastMessage: 'Bác sĩ có thể tư vấn về...',
      timestamp: '10 phút trước',
      unreadCount: 1,
      isOnline: false,
    },
    {
      id: 3,
      patientName: 'Lê Thị Hoa',
      patientAvatar: 'https://i.pravatar.cc/100?u=3',
      lastMessage: 'Em cảm ơn bác sĩ nhiều lắm!',
      timestamp: '1 giờ trước',
      unreadCount: 0,
      isOnline: true,
    },
  ];

  useEffect(() => {
    // Load dashboard data
    if (loadDashboardStats) {
      loadDashboardStats();
    }
    if (loadAppointments) {
      loadAppointments();
    }
    if (loadRecentChats) {
      loadRecentChats();
    }
  }, [loadDashboardStats, loadAppointments, loadRecentChats]);

  const handleAppointmentAction = (appointmentId, action) => {
    if (action === 'start') {
      navigate(`/consultant/appointments/${appointmentId}/session`);
    } else if (action === 'view') {
      navigate(`/consultant/appointments/${appointmentId}`);
    } else if (action === 'complete') {
      updateAppointmentStatus(appointmentId, 'completed');
    } else if (action === 'cancel') {
      updateAppointmentStatus(appointmentId, 'cancelled');
    }
  };

  const handleChatAction = (chatId, action) => {
    if (action === 'open') {
      navigate(`/consultant/messages/${chatId}`);
    }
  };

  const renderOverview = () => (
    <div className="overview-content">
      {/* Stats Cards */}
      <div className="consultant-grid">
        <div className="stat-card primary hover-lift">
          <div className="stat-icon primary animate-float">
            <Calendar />
          </div>
          <div className="stat-content">
            <div className="stat-number text-gradient-primary">
              {mockStats.completedToday}
            </div>
            <div className="stat-label">Cuộc hẹn hôm nay</div>
          </div>
        </div>

        <div className="stat-card success hover-lift">
          <div className="stat-icon success animate-float">
            <MessageCircle />
          </div>
          <div className="stat-content">
            <div className="stat-number text-gradient-primary">
              {mockStats.activeChats}
            </div>
            <div className="stat-label">Tin nhắn chưa đọc</div>
          </div>
        </div>

        <div className="stat-card warning hover-lift">
          <div className="stat-icon warning animate-float">
            <Clock />
          </div>
          <div className="stat-content">
            <div className="stat-number text-gradient-primary">
              {mockStats.pendingAppointments}
            </div>
            <div className="stat-label">Cuộc hẹn đang chờ</div>
          </div>
        </div>

        <div className="stat-card info hover-lift">
          <div className="stat-icon primary animate-float">
            <Star />
          </div>
          <div className="stat-content">
            <div className="stat-number text-gradient-primary">
              {mockStats.rating}
            </div>
            <div className="stat-label">Đánh giá trung bình</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="consultant-grid-2">
        {/* Upcoming Appointments */}
        <div className="glass-card hover-lift">
          <div className="card-header">
            <h3 className="text-gradient-primary">Cuộc hẹn sắp tới</h3>
            <Link to="/consultant/appointments" className="btn-glass">
              Xem tất cả
            </Link>
          </div>
          <div className="appointments-list">
            {mockUpcomingAppointments.map(appointment => (
              <div key={appointment.id} className="appointment-item">
                <div className="appointment-patient">
                  <img
                    src={appointment.patientAvatar}
                    alt={appointment.patientName}
                    className="patient-avatar"
                  />
                  <div className="patient-info">
                    <h4>{appointment.patientName}</h4>
                    <p className="appointment-reason">{appointment.reason}</p>
                  </div>
                </div>
                <div className="appointment-details">
                  <div className="appointment-time">
                    <Clock size={16} />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="appointment-type">
                    {appointment.type === 'video' && <Video size={16} />}
                    {appointment.type === 'phone' && <Phone size={16} />}
                    {appointment.type === 'chat' && <MessageCircle size={16} />}
                  </div>
                </div>
                <div className="appointment-actions">
                  <button
                    onClick={() =>
                      handleAppointmentAction(appointment.id, 'start')
                    }
                    className="action-btn primary"
                  >
                    Bắt đầu
                  </button>
                  <button
                    onClick={() =>
                      handleAppointmentAction(appointment.id, 'view')
                    }
                    className="action-btn secondary"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Chats */}
        <div className="glass-card hover-lift">
          <div className="card-header">
            <h3 className="text-gradient-primary">Tin nhắn gần đây</h3>
            <Link to="/consultant/messages" className="btn-glass">
              Xem tất cả
            </Link>
          </div>
          <div className="chats-list">
            {mockRecentChats.map(chat => (
              <div
                key={chat.id}
                className="chat-item"
                onClick={() => handleChatAction(chat.id, 'open')}
              >
                <div className="chat-avatar">
                  <img src={chat.patientAvatar} alt={chat.patientName} />
                  {chat.isOnline && <div className="online-indicator"></div>}
                </div>
                <div className="chat-content">
                  <div className="chat-header">
                    <h4>{chat.patientName}</h4>
                    <span className="chat-time">{chat.timestamp}</span>
                  </div>
                  <p className="chat-message">{chat.lastMessage}</p>
                </div>
                {chat.unreadCount > 0 && (
                  <div className="unread-badge">{chat.unreadCount}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions and Appointments Side-by-side */}
      <div className="actions-appointments-grid">
        {/* Quick Actions - Left Side */}
        <div className="glass-card hover-lift">
          <div className="card-header">
            <h3 className="text-gradient-primary">Hành động nhanh</h3>
          </div>
          <div className="quick-actions">
            <button
              className="quick-action-btn"
              onClick={() => navigate('/consultant/appointments')}
            >
              <Calendar />
              <span>Xem lịch hẹn</span>
            </button>
            <button
              className="quick-action-btn"
              onClick={() => navigate('/consultant/messages')}
            >
              <MessageCircle />
              <span>Tin nhắn</span>
            </button>
            <button
              className="quick-action-btn"
              onClick={() => navigate('/consultant/profile')}
            >
              <Users />
              <span>Hồ sơ</span>
            </button>
            <button
              className="quick-action-btn"
              onClick={() => navigate('/consultant/analytics')}
            >
              <BarChart3 />
              <span>Thống kê</span>
            </button>
          </div>
        </div>

        {/* Appointments Summary - Right Side */}
        <div className="glass-card hover-lift">
          <div className="card-header">
            <h3 className="text-gradient-primary">Tổng quan cuộc hẹn</h3>
          </div>
          <div className="appointments-summary">
            <div className="summary-item">
              <div className="summary-icon primary">
                <Calendar />
              </div>
              <div className="summary-content">
                <div className="summary-number">
                  {mockUpcomingAppointments.length}
                </div>
                <div className="summary-label">Cuộc hẹn hôm nay</div>
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-icon success">
                <Clock />
              </div>
              <div className="summary-content">
                <div className="summary-number">
                  {
                    mockUpcomingAppointments.filter(
                      a => a.status === 'scheduled'
                    ).length
                  }
                </div>
                <div className="summary-label">Đã lên lịch</div>
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-icon warning">
                <Users />
              </div>
              <div className="summary-content">
                <div className="summary-number">
                  {mockRecentChats.filter(c => c.unreadCount > 0).length}
                </div>
                <div className="summary-label">Chờ phản hồi</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Doanh thu</h3>
        </div>
        <div className="revenue-overview">
          <div className="revenue-item">
            <div className="revenue-label">Hôm nay</div>
            <div className="revenue-amount">
              {(mockStats.monthlyRevenue / 30).toLocaleString('vi-VN')}₫
            </div>
            <div className="revenue-change positive">
              <TrendingUp size={16} />
              <span>+12%</span>
            </div>
          </div>
          <div className="revenue-item">
            <div className="revenue-label">Tháng này</div>
            <div className="revenue-amount">
              {mockStats.monthlyRevenue.toLocaleString('vi-VN')}₫
            </div>
            <div className="revenue-change positive">
              <TrendingUp size={16} />
              <span>+8%</span>
            </div>
          </div>
          <div className="revenue-item">
            <div className="revenue-label">Tổng cộng</div>
            <div className="revenue-amount">
              {mockStats.totalRevenue.toLocaleString('vi-VN')}₫
            </div>
            <div className="revenue-change positive">
              <TrendingUp size={16} />
              <span>+15%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="consultant-container">
      <div className="consultant-header">
        <div className="header-content">
          <h1 className="text-gradient-primary">
            Chào mừng, {consultantProfile?.name?.split(' ').pop() || 'Bác sĩ'}
          </h1>
          <p>Hôm nay là ngày {new Date().toLocaleDateString('vi-VN')}</p>
        </div>
        <div className="header-actions">
          <div className="online-status">
            <div className="status-indicator online animate-pulse"></div>
            <span>Đang trực tuyến</span>
          </div>
        </div>
      </div>

      <div className="main-content">{renderOverview()}</div>
    </div>
  );
};

export default ConsultantDashboard;
