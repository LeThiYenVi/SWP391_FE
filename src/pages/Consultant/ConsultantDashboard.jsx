import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Loader2,
} from 'lucide-react';
import { useConsultant } from '../../context/ConsultantContext';
import { useAuth } from '../../context/AuthContext';
import './ConsultantDashboard.css';
import {
  getTodayAppointmentsAPI,
  getPendingAppointmentsAPI,
  getUpcomingAppointmentsAPI,
  getUnreadMessagesCountAPI,
  getRevenueAPI
} from '../../services/ConsultantService';

const ConsultantDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    consultantProfile,
    appointments,
    conversations,
    dashboardStats,
    loading,
    loadDashboardStats,
    loadAppointments,
    loadConversations,
    updateAppointmentStatus,
    getUpcomingAppointments,
    getTodayAppointments,
    getUnreadMessagesCount,
  } = useConsultant();

  // State cho dashboard
  const [todayCount, setTodayCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [revenueToday, setRevenueToday] = useState(0);
  const [revenueMonth, setRevenueMonth] = useState(0);
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState(null);

  // Ref để đảm bảo chỉ gọi API một lần
  const hasLoadedRef = useRef(false);

  // Load data một lần khi component mount
  useEffect(() => {
    console.log('ConsultantDashboard useEffect triggered:', {
      hasLoaded: hasLoadedRef.current,
      userRole: user?.role,
      shouldLoad: !hasLoadedRef.current && user?.role === 'ROLE_CONSULTANT'
    });
    
    if (!hasLoadedRef.current && user?.role === 'ROLE_CONSULTANT') {
      const loadData = async () => {
        console.log('Loading dashboard data...');
        hasLoadedRef.current = true; // Đánh dấu đã load
        try {
          await Promise.all([
            loadDashboardStats(),
            loadAppointments(),
            loadConversations(),
          ]);
          console.log('Dashboard data loaded successfully');
        } catch (error) {
          console.error('Error loading dashboard data:', error);
          hasLoadedRef.current = false; // Reset nếu lỗi
        }
      };
      loadData();
    }
  }, [user?.role]); // Chỉ phụ thuộc vào user?.role

  useEffect(() => {
    const fetchDashboardData = async () => {
      setDashboardLoading(true);
      setDashboardError(null);
      try {
        const [today, pending, upcoming, unread, revToday, revMonth, revTotal] = await Promise.all([
          getTodayAppointmentsAPI(),
          getPendingAppointmentsAPI(),
          getUpcomingAppointmentsAPI(),
          getUnreadMessagesCountAPI(),
          getRevenueAPI('today'),
          getRevenueAPI('month'),
          getRevenueAPI('total'),
        ]);
        setTodayCount(Array.isArray(today) ? today.length : 0);
        setPendingCount(Array.isArray(pending) ? pending.length : 0);
        setUpcomingCount(Array.isArray(upcoming) ? upcoming.length : 0);
        setUnreadCount(typeof unread === 'number' ? unread : 0);
        setRevenueToday(revToday?.amount || 0);
        setRevenueMonth(revMonth?.amount || 0);
        setRevenueTotal(revTotal?.amount || 0);
      } catch (err) {
        setDashboardError('Không thể tải dữ liệu dashboard');
      } finally {
        setDashboardLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Helper functions để format data
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return new Date(timeString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

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

  const renderOverview = () => {
    // Lấy data thực từ context
    const todayAppointments = getTodayAppointments();
    const upcomingAppointments = getUpcomingAppointments();
    const unreadCount = getUnreadMessagesCount();
    // Nếu conversations là mảng rỗng hoặc trả về lỗi thì hiển thị thông báo
    const recentConversations = Array.isArray(conversations) && conversations.length > 0 ? conversations.slice(0, 3) : [];

    // Stats từ dashboardStats hoặc tính toán từ data
    const stats = {
      completedToday: todayAppointments.filter(apt => apt.status === 'COMPLETED').length,
      activeChats: unreadCount,
      pendingAppointments: upcomingAppointments.length,
      rating: dashboardStats && dashboardStats.averageRating ? dashboardStats.averageRating : '--',
      monthlyRevenue: dashboardStats && dashboardStats.monthlyRevenue ? dashboardStats.monthlyRevenue : 0,
      totalRevenue: dashboardStats && dashboardStats.totalRevenue ? dashboardStats.totalRevenue : 0,
    };

    return (
      <div className="overview-content">
        {/* Stats Cards */}
        <div className="consultant-grid">
          <div className="stat-card primary hover-lift">
            <div className="stat-icon primary animate-float">
              <Calendar />
            </div>
            <div className="stat-content">
              <div className="stat-number text-gradient-primary">
                {stats.completedToday}
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
                {stats.activeChats}
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
                {stats.pendingAppointments}
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
                {stats.rating !== '--' ? stats.rating : <span style={{color:'#aaa'}}>--</span>}
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
              {loading ? (
                <div style={{display:'flex',justifyContent:'center',padding:'2rem'}}>
                  <Loader2 size={24} className="animate-spin" />
                </div>
              ) : upcomingAppointments.length > 0 ? (
                upcomingAppointments.slice(0, 3).map(appointment => (
                  <div key={appointment.id} className="appointment-item">
                    <div className="appointment-patient">
                      <img
                        src={appointment.customerAvatar || 'https://i.pravatar.cc/100?u=1'}
                        alt={appointment.customerName}
                        className="patient-avatar"
                      />
                      <div className="patient-info">
                        <h4>{appointment.customerName}</h4>
                        <p className="appointment-reason">{appointment.notes || 'Tư vấn sức khỏe'}</p>
                      </div>
                    </div>
                    <div className="appointment-details">
                      <div className="appointment-time">
                        <Clock size={16} />
                        <span>{formatTime(appointment.timeSlot?.startTime)}</span>
                      </div>
                      <div className="appointment-type">
                        <Video size={16} />
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
                ))
              ) : (
                <div style={{textAlign:'center',padding:'2rem',color:'#64748b'}}>
                  Không có cuộc hẹn sắp tới
                </div>
              )}
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
              {loading ? (
                <div style={{display:'flex',justifyContent:'center',padding:'2rem'}}>
                  <Loader2 size={24} className="animate-spin" />
                </div>
              ) : recentConversations.length > 0 ? (
                recentConversations.map(conversation => (
                  <div
                    key={conversation.id}
                    className="chat-item"
                    onClick={() => handleChatAction(conversation.id, 'open')}
                  >
                    <div className="chat-avatar">
                      <img 
                        src={conversation.customerAvatar || 'https://i.pravatar.cc/100?u=1'} 
                        alt={conversation.customerName} 
                      />
                      {conversation.customerStatus === 'online' && <div className="online-indicator"></div>}
                    </div>
                    <div className="chat-content">
                      <div className="chat-header">
                        <h4>{conversation.customerName}</h4>
                        <span className="chat-time">{getTimeAgo(conversation.lastMessageTime)}</span>
                      </div>
                      <p className="chat-message">{conversation.lastMessage || 'Chưa có tin nhắn'}</p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="unread-badge">{conversation.unreadCount}</div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{textAlign:'center',padding:'2rem',color:'#64748b'}}>
                  Chưa có dữ liệu tin nhắn (API chưa tích hợp)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3 style={{fontWeight:700,fontSize:'1.2rem',marginBottom:16}}>Doanh thu</h3>
          </div>
          <div style={{display:'flex',gap:24,flexWrap:'wrap',justifyContent:'flex-start'}}>
            <div style={{flex:'1 1 200px',background:'linear-gradient(135deg,#e0e7ff,#6366f1)',borderRadius:18,padding:24,boxShadow:'0 2px 12px rgba(99,102,241,0.08)',display:'flex',flexDirection:'column',alignItems:'flex-start',minWidth:200}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                <TrendingUp size={22} style={{color:'#3730a3'}} />
                <span style={{fontWeight:600,fontSize:'1rem'}}>Hôm nay</span>
              </div>
              <div style={{fontWeight:800,fontSize:'2rem',color:'#3730a3',marginBottom:4}}>
                {(revenueToday).toLocaleString('vi-VN')}₫
              </div>
              <div style={{color:'#059669',fontWeight:600,fontSize:'1rem'}}>+12%</div>
            </div>
            <div style={{flex:'1 1 200px',background:'linear-gradient(135deg,#fef9c3,#f59e0b)',borderRadius:18,padding:24,boxShadow:'0 2px 12px rgba(245,158,11,0.08)',display:'flex',flexDirection:'column',alignItems:'flex-start',minWidth:200}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                <TrendingUp size={22} style={{color:'#b45309'}} />
                <span style={{fontWeight:600,fontSize:'1rem'}}>Tháng này</span>
              </div>
              <div style={{fontWeight:800,fontSize:'2rem',color:'#b45309',marginBottom:4}}>
                {revenueMonth.toLocaleString('vi-VN')}₫
              </div>
              <div style={{color:'#059669',fontWeight:600,fontSize:'1rem'}}>+8%</div>
            </div>
            <div style={{flex:'1 1 200px',background:'linear-gradient(135deg,#f3e8ff,#a855f7)',borderRadius:18,padding:24,boxShadow:'0 2px 12px rgba(168,85,247,0.08)',display:'flex',flexDirection:'column',alignItems:'flex-start',minWidth:200}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                <TrendingUp size={22} style={{color:'#7c3aed'}} />
                <span style={{fontWeight:600,fontSize:'1rem'}}>Tổng cộng</span>
              </div>
              <div style={{fontWeight:800,fontSize:'2rem',color:'#7c3aed',marginBottom:4}}>
                {revenueTotal.toLocaleString('vi-VN')}₫
              </div>
              <div style={{color:'#059669',fontWeight:600,fontSize:'1rem'}}>+15%</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Quick actions dạng card giống user dashboard
  const quickActions = [
    {
      title: 'Lịch hẹn',
      description: 'Xem và quản lý lịch hẹn',
      icon: Calendar,
      onClick: () => navigate('/consultant/appointments'),
      gradient: 'linear-gradient(135deg, #e0e7ff, #6366f1)',
      iconColor: '#3730a3',
    },
    {
      title: 'Tin nhắn',
      description: 'Trò chuyện với khách hàng',
      icon: MessageCircle,
      onClick: () => navigate('/consultant/messages'),
      gradient: 'linear-gradient(135deg, #f0fdf4, #22c55e)',
      iconColor: '#15803d',
    },
    {
      title: 'Hồ sơ',
      description: 'Cập nhật thông tin cá nhân',
      icon: Users,
      onClick: () => navigate('/consultant/profile'),
      gradient: 'linear-gradient(135deg, #f3e8ff, #a855f7)',
      iconColor: '#7c3aed',
    },
    {
      title: 'Thống kê',
      description: 'Xem báo cáo, doanh thu',
      icon: BarChart3,
      onClick: () => navigate('/consultant/analytics'),
      gradient: 'linear-gradient(135deg, #fef9c3, #f59e0b)',
      iconColor: '#b45309',
    },
  ];

  // Loading state
  if (loading && !hasLoadedRef.current) {
    return (
      <div className="consultant-container">
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'50vh'}}>
          <div style={{textAlign:'center'}}>
            <Loader2 size={48} className="animate-spin" style={{marginBottom:'1rem'}} />
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="consultant-container" style={{paddingTop: 64}}>
      {/* Quick Actions dạng card */}
      <section className="consultant-quick-actions" style={{marginBottom:32}}>
        <div style={{display:'flex',gap:24,flexWrap:'wrap',justifyContent:'flex-start'}}>
          {quickActions.map((action, idx) => (
            <div key={idx} className="consultant-action-card hover-lift" style={{background:action.gradient, borderRadius:16, minWidth:200, flex:'1 1 200px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'flex-start', padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.04)'}} onClick={action.onClick}>
              <div style={{background:'#fff',borderRadius:12,padding:8,marginBottom:12,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <action.icon size={28} style={{color:action.iconColor}} />
              </div>
              <div style={{fontWeight:700,fontSize:'1.1rem',marginBottom:4}}>{action.title}</div>
              <div style={{fontSize:'0.95rem',color:'#444',opacity:0.85}}>{action.description}</div>
            </div>
          ))}
        </div>
      </section>
      <div className="consultant-header">
        <div className="header-content">
          <h1 className="text-gradient-primary">
            Chào mừng, {consultantProfile?.fullName?.split(' ').pop() || 'Bác sĩ'}
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
