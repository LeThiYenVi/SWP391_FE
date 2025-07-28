import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCycle } from '../../../context/CycleContext';
import { useAppointment } from '../../../context/AppointmentContext';
import { useChat } from '../../../context/ChatContext';
import BookingService from '../../../services/BookingService';
import DashboardService from '../../../services/DashboardService';
import ChatService from '../../../services/ChatService';
import ChatInitializer from '../../../components/Chat/ChatInitializer';
import {
  Search,
  Menu,
  X,
  Calendar,
  Heart,
  MessageCircle,
  TestTube,
  Bell,
  User,
  LogOut,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Clock,
  Users,
  Phone,
  Mail,
  MapPin,
  Shield,
  Award,
  HelpCircle,
  Activity,
  Star,
  Download,
  Upload,
  ChevronRight,
  Plus,
  Edit,
  Settings,
  BarChart3,
  FileText,
  Bookmark,
  Send,
  Filter,
  AlertCircle,
  MessageSquare,
  Circle,
  Minimize2,
  Maximize2,
  Paperclip,
  Smile,
  Mic,
  Video,
} from 'lucide-react';
import Footer from '../../../components/Footer/Footer';
import styles from '../../HomePage.module.css';
import './index.css';

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [showRealtimeChat, setShowRealtimeChat] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [overviewStats, setOverviewStats] = useState({
    totalConsultations: 0,
    totalSTITests: 0,
    totalQuestions: 0,
    newNotifications: 0,
  });
  const [onlineCounselors, setOnlineCounselors] = useState([]);
  const [loadingConsultants, setLoadingConsultants] = useState(false);
  
  // ✅ Sử dụng ChatContext thay vì state riêng
  
  const { user, logout, isAuthenticated, updateUserProfile } = useAuth();
  const { getDaysUntilNextPeriod, getDaysUntilOvulation, isInFertilityWindow } =
    useCycle();
  const { getUpcomingAppointments } = useAppointment();

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      const [stats, appointments, notifications] = await Promise.all([
        DashboardService.getDashboardStats(),
        DashboardService.getUpcomingAppointments(),
        DashboardService.getNotifications()
      ]);
      
      setOverviewStats({
        totalConsultations: stats.totalConsultations,
        totalSTITests: stats.totalSTITests,
        totalQuestions: stats.totalQuestions,
        newNotifications: stats.newNotifications,
      });
      
      setPendingBookingsCount(appointments.length);
      setUpcomingAppointments(appointments);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  // ✅ Đã loại bỏ loadConversations riêng, sử dụng ChatContext thay thế

  // Load consultants - Removed per user request
  // const loadConsultants = async () => {
  //   try {
  //     setLoadingConsultants(true);
  //     const response = await DashboardService.getOnlineConsultants();
  //     if (response && Array.isArray(response)) {
  //       setOnlineCounselors(response);
  //     }
  //   } catch (error) {
  //     console.error('Error loading consultants:', error);
  //   } finally {
  //     setLoadingConsultants(false);
  //   }
  // };

  // Load tất cả data khi component mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadDashboardData();
      // ✅ Loại bỏ loadConversations() - sử dụng ChatContext thay thế
      // loadConsultants(); // Removed per user request
    }
  }, [isAuthenticated, user]);

  const {
    conversations, // ✅ Sử dụng trực tiếp conversations từ ChatContext
    loading: loadingConversations, // ✅ Sử dụng loading từ ChatContext
    currentConversation,
    messages,
    selectConversation,
    createConversation
  } = useChat();
  const navigate = useNavigate();

  // const upcomingAppointments = getUpcomingAppointments(); // Commented out to use API data
  const daysUntilPeriod = getDaysUntilNextPeriod();
  const daysUntilOvulation = getDaysUntilOvulation();
  const inFertilityWindow = isInFertilityWindow();


  const notifications = [
    {
      id: 1,
      type: 'appointment',
      title: 'Lịch tư vấn sắp tới',
      message: 'Bạn có lịch tư vấn với Dr. Nguyễn Hoa vào 15:00 ngày mai',
      time: '2 giờ trước',
      read: false,
      icon: MessageCircle,
      color: '#568392',
    },
    {
      id: 2,
      type: 'test_result',
      title: 'Kết quả xét nghiệm',
      message: 'Kết quả xét nghiệm STI của bạn đã có. Nhấn để xem chi tiết.',
      time: '5 giờ trước',
      read: false,
      icon: TestTube,
      color: '#22c55e',
    },
    {
      id: 3,
      type: 'cycle_reminder',
      title: 'Nhắc nhở chu kỳ',
      message: 'Hôm nay là ngày dự đoán rụng trứng. Hãy theo dõi cẩn thận!',
      time: '1 ngày trước',
      read: true,
      icon: Heart,
      color: '#f59e0b',
    },
    {
      id: 4,
      type: 'qa_response',
      title: 'Trả lời câu hỏi',
      message: 'Dr. Lê Minh đã trả lời câu hỏi của bạn về chu kỳ kinh nguyệt',
      time: '2 ngày trước',
      read: true,
      icon: HelpCircle,
      color: '#a855f7',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'consultation',
      title: 'Tư vấn với Dr. Nguyễn Hoa',
      description: 'Chủ đề: Chu kỳ kinh nguyệt không đều',
      date: '2024-01-15',
      status: 'completed',
      rating: 5,
    },
    {
      id: 2,
      type: 'test',
      title: 'Xét nghiệm STI đầy đủ',
      description: 'Gói xét nghiệm 12 loại STI',
      date: '2024-01-10',
      status: 'completed',
      result: 'Âm tính - Bình thường',
    },
    {
      id: 3,
      type: 'question',
      title: 'Câu hỏi về thuốc tránh thai',
      description: 'Thuốc tránh thai có ảnh hưởng đến chu kỳ không?',
      date: '2024-01-12',
      status: 'answered',
      rating: 4,
    },
  ];

  const cycleHistory = [
    {
      id: 1,
      startDate: '2024-01-01',
      endDate: '2024-01-05',
      cycleLength: 28,
      period: 5,
      symptoms: ['Đau bụng', 'Mệt mỏi'],
    },
    {
      id: 2,
      startDate: '2023-12-04',
      endDate: '2023-12-08',
      cycleLength: 28,
      period: 4,
      symptoms: ['Đau đầu'],
    },
  ];

  const testHistory = [
    {
      id: 1,
      testName: 'Gói xét nghiệm STI đầy đủ',
      date: '2024-01-10',
      status: 'completed',
      result: 'Âm tính - Bình thường',
      price: '1,200,000 VNĐ',
      facility: 'Phòng khám Gynexa - Q1',
    },
    {
      id: 2,
      testName: 'Xét nghiệm HIV/AIDS',
      date: '2023-12-15',
      status: 'completed',
      result: 'Âm tính',
      price: '200,000 VNĐ',
      facility: 'Phòng khám Gynexa - Q3',
    },
    {
      id: 3,
      testName: 'Xét nghiệm Syphilis',
      date: '2024-01-20',
      status: 'processing',
      result: 'Đang xử lý...',
      price: '150,000 VNĐ',
      facility: 'Phòng khám Gynexa - Q1',
    },
  ];

  const qaHistory = [
    {
      id: 1,
      question: 'Chu kỳ kinh nguyệt của tôi không đều, có sao không?',
      answer:
        'Chu kỳ kinh nguyệt có thể bị ảnh hưởng bởi nhiều yếu tố như stress, thay đổi cân nặng, thuốc...',
      counselor: 'Dr. Nguyễn Hoa',
      date: '2024-01-12',
      status: 'answered',
      category: 'Chu kỳ kinh nguyệt',
      rating: 5,
      bookmarked: true,
    },
    {
      id: 2,
      question: 'Thuốc tránh thai nào an toàn nhất?',
      answer:
        'Việc lựa chọn thuốc tránh thai phù hợp cần dựa vào tình trạng sức khỏe cá nhân...',
      counselor: 'Dr. Lê Minh',
      date: '2024-01-08',
      status: 'answered',
      category: 'Thuốc tránh thai',
      rating: 4,
      bookmarked: false,
    },
  ];

  // Chat realtime data - will be loaded from API
  const [activeChats, setActiveChats] = useState([]);
  const [chatMessages, setChatMessages] = useState({});



  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  // Hàm xử lý smooth scroll
  const handleSmoothScroll = sectionId => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    // Đóng mobile menu sau khi click
    setIsMenuOpen(false);
  };



  const handleStartNewChat = async (counselorId) => {
    try {
      // Forward đến trang chat để bắt đầu cuộc trò chuyện mới
      navigate('/chat');
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  const handleContinueChat = () => {
    // Forward đến trang chat để tiếp tục cuộc trò chuyện
    navigate('/chat');
  };

  const handleSelectConversation = async (conversation) => {
    await selectConversation(conversation);
    setSelectedConversation(conversation);
    setShowRealtimeChat(true);
  };

  const handleBackToChatList = () => {
    setSelectedConversation(null);
    setShowRealtimeChat(false);
  };

  const handleMarkAllNotificationsAsRead = async () => {
    try {
      await DashboardService.markAllNotificationsAsRead();
      // Reload notifications
      const updatedNotifications = await DashboardService.getNotifications();
      // Update notifications state
      // Note: You might want to add a notifications state to store API data
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const quickActions = [
    {
      title: 'Theo dõi chu kỳ',
      description: 'Ghi nhận chu kỳ và triệu chứng',
      icon: Calendar,
      link: '/theo-doi-chu-ky',
      color: 'pink',
      gradient: 'linear-gradient(135deg, #fce7f3, #ec4899)',
      iconColor: '#be185d',
    },
    {
      title: 'Tư vấn trực tuyến',
      description: 'Tư vấn với chuyên gia',
      icon: MessageCircle,
      link: '/tu-van',
      color: 'blue',
      gradient: 'var(--primary-gradient)',
      iconColor: 'var(--primary-dark)',
    },
    {
      title: 'Xét nghiệm STIs',
      description: 'Đặt lịch xét nghiệm',
      icon: TestTube,
      link: '/xet-nghiem-sti',
      color: 'green',
      gradient: 'linear-gradient(135deg, #dcfce7, #22c55e)',
      iconColor: '#15803d',
    },
    {
      title: 'Hỏi đáp',
      description: 'Gửi câu hỏi cho tư vấn viên',
      icon: Heart,
      link: '/hoi-dap',
      color: 'purple',
      gradient: 'linear-gradient(135deg, #f3e8ff, #a855f7)',
      iconColor: '#7c3aed',
    },
  ];

  const healthStats = [
    {
      title: 'Chu kỳ kinh nguyệt',
      value:
        daysUntilPeriod !== null ? `${daysUntilPeriod} ngày` : 'Chưa thiết lập',
      label: 'đến kỳ kinh tiếp theo',
      icon: Calendar,
      color: '#e91e63',
      bgColor: 'rgba(233, 30, 99, 0.1)',
    },
    {
      title: 'Rụng trứng',
      value:
        daysUntilOvulation !== null
          ? `${daysUntilOvulation} ngày`
          : 'Chưa thiết lập',
      label: inFertilityWindow
        ? 'Đang trong thời kỳ màu mỡ'
        : 'đến thời kỳ rụng trứng',
      icon: Heart,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    {
      title: 'Lịch hẹn',
      value: upcomingAppointments.length,
      label: 'lịch hẹn sắp tới',
      icon: MessageCircle,
      color: 'var(--primary-color)',
      bgColor: 'rgba(86, 131, 146, 0.1)',
    },
  ];

  // Tổng quan chi tiết
  const detailedStats = [
    {
      title: 'Tổng số tư vấn',
      value: overviewStats.totalConsultations,
      label: 'phiên tư vấn đã hoàn thành',
      icon: MessageCircle,
      color: '#568392',
      bgColor: 'rgba(86, 131, 146, 0.1)',
    },
    {
      title: 'Xét nghiệm STIs',
      value: overviewStats.totalSTITests,
      label: 'lần xét nghiệm đã thực hiện',
      icon: TestTube,
      color: '#22c55e',
      bgColor: 'rgba(34, 197, 94, 0.1)',
    },
    {
      title: 'Câu hỏi đã hỏi',
      value: overviewStats.totalQuestions,
      label: 'câu hỏi đã được trả lời',
      icon: HelpCircle,
      color: '#a855f7',
      bgColor: 'rgba(168, 85, 247, 0.1)',
    },
    {
      title: 'Thông báo mới',
      value: overviewStats.newNotifications,
      label: 'thông báo chưa đọc',
      icon: Bell,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
  ];

  // Services data từ HomePage
  const services = [
    {
      icon: MessageCircle,
      title: 'Tư vấn trực tuyến',
      description: 'Tư vấn trực tuyến với chuyên gia an toàn và bảo mật',
      link: '/tu-van',
      requireAuth: true,
    },
    {
      icon: Calendar,
      title: 'Theo dõi chu kỳ',
      description: 'Theo dõi và dự đoán chu kỳ sinh lý một cách thông minh',
      link: '/theo-doi-chu-ky',
      requireAuth: true,
    },
    {
      icon: TestTube,
      title: 'Xét nghiệm STIs',
      description: 'Đặt lịch và xem kết quả xét nghiệm an toàn, bảo mật',
      link: '/xet-nghiem-sti',
      requireAuth: true,
    },
    {
      icon: CheckCircle,
      title: 'Xác nhận lịch hẹn',
      description: 'Xem và xác nhận các lịch hẹn được tạo bởi tư vấn viên',
      link: '/booking-confirmation',
      requireAuth: true,
      badge: pendingBookingsCount > 0 ? pendingBookingsCount.toString() : null,
    },
    {
      icon: HelpCircle,
      title: 'Hỏi đáp',
      description: 'Đặt câu hỏi và nhận tư vấn từ các chuyên gia',
      link: '/hoi-dap',
      requireAuth: true,
    },
  ];

  // More services cho section More Services
  const moreServices = [
    {
      icon: Heart,
      title: 'Chăm sóc sức khỏe',
      description: 'Chương trình chăm sóc sức khỏe toàn diện và cá nhân hóa',
      link: '/suc-khoe',
      requireAuth: true,
    },
    {
      icon: Shield,
      title: 'Bảo mật thông tin',
      description: 'Cam kết bảo mật tuyệt đối thông tin cá nhân của bạn',
      link: '/bao-mat',
      requireAuth: false,
    },
    {
      icon: Users,
      title: 'Cộng đồng',
      description: 'Kết nối với cộng đồng phụ nữ quan tâm sức khỏe',
      link: '/cong-dong',
      requireAuth: true,
    },
    {
      icon: Award,
      title: 'Chứng nhận',
      description: 'Đạt chuẩn quốc tế về chăm sóc sức khỏe sinh sản',
      link: '/chung-nhan',
      requireAuth: false,
    },
  ];

  const healthTips = [
    {
      title: 'Theo dõi chu kỳ đều đặn',
      content:
        'Ghi chép chu kỳ kinh nguyệt giúp bạn hiểu rõ hơn về cơ thể mình',
      color: 'blue',
      borderColor: 'var(--primary-color)',
    },
    {
      title: 'Tầm soát định kỳ',
      content:
        'Xét nghiệm STIs định kỳ là cách tốt nhất để bảo vệ sức khỏe sinh sản',
      color: 'green',
      borderColor: '#22c55e',
    },
    {
      title: 'Tư vấn chuyên gia',
      content: 'Đừng ngần ngại đặt câu hỏi với các chuyên gia của chúng tôi',
      color: 'purple',
      borderColor: '#a855f7',
    },
  ];

  return (
    <div className={styles.homepage}>
      {/* Header - sử dụng lại từ HomePage */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <Link to="/" className={styles.logo}>
              <Heart className={styles.logoIcon} />
              <span className={styles.logoText}>Gynexa</span>
            </Link>

            <nav
              className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}
            >
              <Link to="/" className={styles.navLink}>
                Trang chủ
              </Link>
              <Link to="/dashboard" className={styles.navLink}>
                Dashboard
              </Link>
              <button
                onClick={() => handleSmoothScroll('dashboard-services')}
                className={styles.navLink}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Dịch vụ
              </button>
              <button
                onClick={() => handleSmoothScroll('dashboard-notifications')}
                className={styles.navLink}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Thông báo
              </button>
              <button
                onClick={() => handleSmoothScroll('dashboard-chat')}
                className={styles.navLink}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Chat
              </button>
              <button
                onClick={() => handleSmoothScroll('dashboard-contact')}
                className={styles.navLink}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Liên hệ
              </button>
            </nav>

            <div className={styles.headerActions}>
              {isAuthenticated && (
                <div style={{ position: 'relative' }}>
                  <button
                    className={styles.btnOutline}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <User size={18} style={{ marginRight: 4 }} />
                    {user?.name || 'Tài khoản'}
                  </button>
                  {showUserMenu && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '110%',
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        minWidth: 180,
                        zIndex: 100,
                      }}
                    >
                      <Link
                        to="/dashboard"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: 12,
                          textDecoration: 'none',
                          color: '#222',
                          fontWeight: 500,
                        }}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User size={16} /> Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: 12,
                          textDecoration: 'none',
                          color: '#222',
                          fontWeight: 500,
                        }}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User size={16} /> Hồ sơ cá nhân
                      </Link>
                      <Link
                        to="/settings"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: 12,
                          textDecoration: 'none',
                          color: '#222',
                          fontWeight: 500,
                        }}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings size={16} /> Cài đặt
                      </Link>
                      <button
                        onClick={() => {
                          handleSmoothScroll('dashboard-notifications');
                          setShowUserMenu(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: 12,
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          color: '#222',
                          fontWeight: 500,
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <Bell size={16} /> Thông báo (
                        {overviewStats.newNotifications})
                      </button>
                      <button
                        onClick={handleLogout}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: 12,
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          color: '#d32f2f',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        <LogOut size={16} /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              )}
              <button
                className={styles.menuToggle}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="dashboard-main-content">
        <div className={styles.container}>
          {/* Welcome Section */}
          <section className="dashboard-welcome">
            <div className="welcome-content">
              <h1 className="dashboard-title">
                Chào mừng trở lại, {user?.name}!
              </h1>
              <p className="dashboard-subtitle">
                Đây là tổng quan về sức khỏe và lịch trình của bạn
              </p>
            </div>
          </section>

          {/* Profile Summary */}
          <section className="profile-summary-section">
            <div className="profile-summary-card">
              <div className="profile-info">
                <div className="profile-avatar">
                  {user?.avatarUrl ? (
                    <>
                      <img
                        src={user.avatarUrl}
                        alt="Avatar"
                        className="profile-avatar-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <User
                        size={32}
                        style={{ display: 'none' }}
                      />
                    </>
                  ) : (
                    <User size={32} />
                  )}
                </div>
                <div className="profile-details">
                  <h3>{user?.name || 'Người dùng'}</h3>
                  <p>{user?.email || 'user@gynexa.com'}</p>
                  <span className="profile-status">Thành viên từ 2024</span>
                </div>
              </div>
              <div className="profile-actions">
                <Link to="/profile" className="profile-action-btn">
                  <Edit size={16} />
                  Chỉnh sửa hồ sơ
                </Link>
                <Link to="/settings" className="profile-action-btn">
                  <Settings size={16} />
                  Cài đặt
                </Link>
              </div>
            </div>
          </section>

          {/* Overview Statistics */}
          <section id="dashboard-overview" className="health-overview-section">
            <div className="dashboard-section-header">
              <h2>Tổng quan hoạt động</h2>
              <p>
                Thống kê tổng quan về các hoạt động chăm sóc sức khỏe của bạn
              </p>
            </div>

            <div className="health-stats-grid">
              {detailedStats.map((stat, index) => (
                <div
                  key={index}
                  className="health-stat-card"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <div className="health-stat-content">
                    <div className="health-stat-info">
                      <h3 className="health-stat-title">{stat.title}</h3>
                      <p
                        className="health-stat-value"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </p>
                      <p className="health-stat-label">{stat.label}</p>
                    </div>
                    <div
                      className="health-stat-icon"
                      style={{ color: stat.color }}
                    >
                      <stat.icon size={36} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cycle & Health Quick Info */}
            <div className="cycle-health-grid">
              {healthStats.map((stat, index) => (
                <div
                  key={index}
                  className="cycle-health-card"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <div className="health-stat-content">
                    <div className="health-stat-info">
                      <h4 className="cycle-health-title">{stat.title}</h4>
                      <p
                        className="cycle-health-value"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </p>
                      <p className="cycle-health-label">{stat.label}</p>
                    </div>
                    <div
                      className="cycle-health-icon"
                      style={{ color: stat.color }}
                    >
                      <stat.icon size={28} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions - sử dụng style tương tự Services của HomePage */}
          <section className="dashboard-services">
            <div className="dashboard-section-header">
              <h2>Thao tác nhanh</h2>
              <p>Các dịch vụ chăm sóc sức khỏe chuyên nghiệp</p>
            </div>

            <div className={styles.servicesGrid}>
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className={styles.serviceCard}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className={styles.serviceIcon}
                    style={{
                      background: action.gradient,
                      color: action.iconColor,
                    }}
                  >
                    <action.icon size={32} />
                  </div>
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Content Grid */}
          <section className="dashboard-content-section">
            <div className="dashboard-content-grid">
              {/* Upcoming Appointments */}
              <div className="dashboard-content-card">
                <div className="dashboard-card-header">
                  <h3>Lịch hẹn sắp tới</h3>
                  <Link to="/appointments" className="view-all-link">
                    Xem tất cả <ArrowRight size={16} />
                  </Link>
                </div>
                {upcomingAppointments.length > 0 ? (
                  <div className="appointment-list">
                    {upcomingAppointments.slice(0, 3).map(appointment => (
                      <div key={appointment.id} className="appointment-item">
                        <div className="appointment-info">
                          <p className="appointment-doctor">
                            {appointment.type === 'CONSULTATION' ? `Dr. ${appointment.consultantName}` : appointment.serviceName}
                          </p>
                          <p className="appointment-time">
                            {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')} lúc {new Date(appointment.appointmentDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="appointment-description">
                            {appointment.description}
                          </p>
                        </div>
                        <span className="appointment-status">
                          {appointment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Calendar size={48} />
                    <h4>Không có lịch hẹn nào</h4>
                    <p>Bạn chưa có lịch hẹn nào. Đặt lịch tư vấn ngay!</p>
                    <Link to="/tu-van" className={styles.btnPrimary}>
                      Đặt lịch ngay <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Health Tips */}
              <div className="dashboard-content-card">
                <div className="dashboard-card-header">
                  <h3>Mẹo sức khỏe</h3>
                </div>
                <div className="health-tips-list">
                  {healthTips.map((tip, index) => (
                    <div
                      key={index}
                      className="health-tip-item"
                      style={{ borderLeftColor: tip.borderColor }}
                    >
                      <h4 className="tip-title">{tip.title}</h4>
                      <p className="tip-content">{tip.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Notification Center */}
          <section
            id="dashboard-notifications"
            className="notification-section"
          >
            <div className="dashboard-section-header">
              <h2>Trung tâm thông báo</h2>
              <p>Theo dõi tất cả thông báo và cập nhật quan trọng</p>
            </div>

            <div className="notification-container">
              <div className="notification-header">
                <div className="notification-filter">
                  <button className="filter-btn active">
                    Tất cả ({notifications.length})
                  </button>
                  <button className="filter-btn">
                    Chưa đọc ({notifications.filter(n => !n.isRead).length})
                  </button>
                  <button className="filter-btn">Quan trọng</button>
                </div>
                <button className="mark-all-read-btn" onClick={handleMarkAllNotificationsAsRead}>
                  <CheckCircle size={16} />
                  Đánh dấu đã đọc tất cả
                </button>
              </div>

              <div className="notification-list">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`notification-item ${
                      !notification.isRead ? 'unread' : ''
                    }`}
                  >
                    <div
                      className="notification-icon"
                      style={{ color: notification.color }}
                    >
                      <notification.icon size={24} />
                    </div>
                    <div className="notification-content">
                      <h4 className="notification-title">
                        {notification.title}
                      </h4>
                      <p className="notification-message">
                        {notification.message}
                      </p>
                      <span className="notification-time">
                        {notification.time}
                      </span>
                    </div>
                    {!notification.read && (
                      <div className="notification-dot"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* History & Activities - Hidden per user request */}
          {/*
          <section id="dashboard-history" className="history-section">
            <div className="dashboard-section-header">
              <h2>Lịch sử hoạt động</h2>
              <p>Theo dõi toàn bộ lịch sử các hoạt động chăm sóc sức khỏe</p>
            </div>

            <div className="history-container">
              <div className="history-tabs">
                <button className="history-tab active">Tất cả</button>
                <button className="history-tab">Tư vấn</button>
                <button className="history-tab">Xét nghiệm</button>
                <button className="history-tab">Hỏi đáp</button>
              </div>

              <div className="history-list">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="history-item">
                    <div className="history-icon">
                      {activity.type === 'consultation' && (
                        <MessageCircle size={20} />
                      )}
                      {activity.type === 'test' && <TestTube size={20} />}
                      {activity.type === 'question' && <HelpCircle size={20} />}
                    </div>
                    <div className="history-content">
                      <h4 className="history-title">{activity.title}</h4>
                      <p className="history-description">
                        {activity.description}
                      </p>
                      <div className="history-meta">
                        <span className="history-date">{activity.date}</span>
                        <span className={`history-status ${activity.status}`}>
                          {activity.status === 'completed' && 'Hoàn thành'}
                          {activity.status === 'answered' && 'Đã trả lời'}
                        </span>
                      </div>
                      {activity.rating && (
                        <div className="history-rating">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill={i < activity.rating ? '#ffd700' : 'none'}
                              color="#ffd700"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="history-actions">
                      <button className="action-btn">
                        <FileText size={16} />
                        Chi tiết
                      </button>
                      {activity.type === 'test' &&
                        activity.status === 'completed' && (
                          <button className="action-btn">
                            <Download size={16} />
                            Tải kết quả
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="history-load-more">
                <button className={styles.btnOutline}>
                  Xem thêm <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </section>
          */}

          {/* Chat Realtime Section */}
          <section id="dashboard-chat" className="chat-realtime-section">
            <div className="dashboard-section-header">
              <h2>Chat realtime với tư vấn viên</h2>
              <p>Trò chuyện trực tiếp với các chuyên gia của chúng tôi</p>
            </div>

            <div className="chat-container">
              {loadingConversations ? (
                <div className="chat-placeholder">
                  <MessageSquare size={64} />
                  <h3>Đang tải...</h3>
                  <p>Đang tải thông tin chat</p>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    border: '2px solid #f3f3f3', 
                    borderTop: '2px solid #568392', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite',
                    margin: '10px auto'
                  }}></div>
                </div>
              ) : conversations.length > 0 ? (
                // Có conversation - hiển thị khung chat và nút tiếp tục
                <div className="chat-active">
                  <div className="chat-preview">
                    <MessageSquare size={48} />
                    <div className="chat-info">
                      <h3>Cuộc trò chuyện hiện tại</h3>
                      <p>Bạn có {conversations.length} cuộc trò chuyện đang hoạt động</p>
                      {conversations[0] && (
                        <div className="last-message">
                          <span>Tin nhắn cuối: {conversations[0].lastMessage || 'Chưa có tin nhắn'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Không có conversation - hiển thị nút bắt đầu mới
                <div className="chat-placeholder">
                  <MessageSquare size={64} />
                  <h3>Bắt đầu cuộc trò chuyện</h3>
                  <p>
                    Bạn chưa có cuộc trò chuyện nào. Hãy bắt đầu chat với tư vấn viên ngay!
                  </p>
                </div>
              )}
              
              {/* Nút chat bên phải */}
              {!loadingConversations && (
                <div className="chat-action-button">
                  {conversations.length > 0 ? (
                    <button 
                      className="continue-chat-btn"
                      onClick={handleContinueChat}
                    >
                      <MessageCircle size={16} />
                      Tiếp tục trò chuyện
                    </button>
                  ) : (
                    <button 
                      className="start-new-chat-btn"
                      onClick={() => navigate('/chat')}
                    >
                      <Plus size={16} />
                      Bắt đầu cuộc trò chuyện
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Quick Booking Section */}
          <section className="quick-booking-section">
            <div className="dashboard-section-header">
              <h2>Đặt lịch nhanh</h2>
              <p>Đặt lịch tư vấn hoặc xét nghiệm một cách nhanh chóng</p>
            </div>

            <div className="quick-booking-grid">
              <div className="booking-card consultation-booking">
                <div className="booking-icon">
                  <MessageCircle size={32} />
                </div>
                <h3>Đặt lịch tư vấn</h3>
                <p>Tư vấn trực tuyến với chuyên gia</p>
                <Link to="/tu-van" className={styles.btnPrimary}>
                  <Plus size={16} />
                  Đặt lịch ngay
                </Link>
              </div>

              <div className="booking-card test-booking">
                <div className="booking-icon">
                  <TestTube size={32} />
                </div>
                <h3>Đặt lịch xét nghiệm</h3>
                <p>Xét nghiệm STI an toàn, bảo mật</p>
                <Link to="/xet-nghiem-sti" className={styles.btnPrimary}>
                  <Plus size={16} />
                  Đặt lịch ngay
                </Link>
              </div>

              <div className="booking-card qa-booking">
                <div className="booking-icon">
                  <HelpCircle size={32} />
                </div>
                <h3>Đặt câu hỏi</h3>
                <p>Hỏi đáp với tư vấn viên chuyên nghiệp</p>
                <Link to="/hoi-dap" className={styles.btnPrimary}>
                  <Send size={16} />
                  Gửi câu hỏi
                </Link>
              </div>
            </div>
          </section>

          {/* Services Section - reuse từ HomePage */}
          <section id="dashboard-services" className={styles.services}>
            <div className={styles.sectionHeader}>
              <h2>Dịch vụ của GYNEXA</h2>
              <p>
                Chúng tôi cung cấp dịch vụ chăm sóc sức khỏe toàn diện và chuyên
                nghiệp
              </p>
            </div>

            <div className={styles.servicesGrid}>
              {services.map((service, index) => (
                <Link
                  key={index}
                  to={service.link}
                  className={styles.serviceCard}
                  style={{ textDecoration: 'none' }}
                >
                  <div className={styles.serviceIcon}>
                    <service.icon size={32} />
                    {service.badge && (
                      <span className={styles.serviceBadge}>
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </Link>
              ))}
            </div>

            {/* More Services Section */}
            <div className={styles.moreServices}>
              <div className={styles.moreServicesGrid}>
                {moreServices.map((service, index) => (
                  <Link
                    key={index}
                    to={service.link}
                    className={styles.serviceCard}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className={styles.serviceIcon}>
                      <service.icon size={32} />
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section - reuse từ HomePage */}
          <section id="dashboard-contact" className={styles.contact}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionTag}>
                Đừng giữ thắc mắc một mình – hỏi ngay nhé!
              </p>
              <h2>Liên hệ</h2>
            </div>

            <div className={styles.contactGrid}>
              <div className={styles.contactCard}>
                <Phone className={styles.contactIcon} />
                <h3>Đường dây nóng</h3>
                <p>(84) 123-456-789</p>
                <p>(84) 987-654-321</p>
              </div>

              <div
                className={`${styles.contactCard} ${styles.contactCardPrimary}`}
              >
                <MapPin className={styles.contactIcon} />
                <h3>Địa chỉ</h3>
                <p>123 Nguyễn Huệ</p>
                <p>Quận 1, TP.HCM</p>
              </div>

              <div className={styles.contactCard}>
                <Mail className={styles.contactIcon} />
                <h3>Email</h3>
                <p>support@gynexa.com</p>
                <p>info@gynexa.com</p>
              </div>

              <div className={styles.contactCard}>
                <Clock className={styles.contactIcon} />
                <h3>Giờ làm việc</h3>
                <p>T2-T7: 09:00-20:00</p>
                <p>Chủ Nhật: 24h</p>
              </div>
            </div>
          </section>

          {/* Quick Stats */}
          <section className="quick-stats-section">
            <div className="quick-stats-grid">
              <div className="quick-stat-item">
                <div className="stat-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-info">
                  <h4>Tiến độ sức khỏe</h4>
                  <p>Đang theo dõi chu kỳ</p>
                </div>
              </div>
              <div className="quick-stat-item">
                <div className="stat-icon">
                  <Clock size={24} />
                </div>
                <div className="stat-info">
                  <h4>Hoạt động gần đây</h4>
                  <p>Cập nhật hôm qua</p>
                </div>
              </div>
              <div className="quick-stat-item">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <h4>Hỗ trợ 24/7</h4>
                  <p>Luôn sẵn sàng</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer - sử dụng lại từ HomePage */}
      <Footer />
    </div>
  );
};

export default Dashboard;
