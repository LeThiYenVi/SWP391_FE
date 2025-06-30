import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCycle } from '../../../context/CycleContext';
import { useAppointment } from '../../../context/AppointmentContext';
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
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const { user, logout, isAuthenticated } = useAuth();
  const { getDaysUntilNextPeriod, getDaysUntilOvulation, isInFertilityWindow } =
    useCycle();
  const { getUpcomingAppointments } = useAppointment();
  const navigate = useNavigate();

  const upcomingAppointments = getUpcomingAppointments();
  const daysUntilPeriod = getDaysUntilNextPeriod();
  const daysUntilOvulation = getDaysUntilOvulation();
  const inFertilityWindow = isInFertilityWindow();

  // Mock data cho các chức năng Dashboard
  const overviewStats = {
    totalConsultations: 12,
    totalSTITests: 3,
    totalQuestions: 8,
    newNotifications: 4,
    upcomingAppointments: upcomingAppointments.length,
  };

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

  // Chat realtime data
  const [activeChats, setActiveChats] = useState([
    {
      id: 1,
      counselorId: 1,
      counselorName: 'Dr. Nguyễn Thị Hoa',
      counselorAvatar:
        'https://www.hoilhpn.org.vn/documents/20182/3458479/28_Feb_2022_115842_GMTbsi_thuhien.jpg/c04e15ea-fbe4-415f-bacc-4e5d4cc0204d',
      isOnline: true,
      lastMessage:
        'Tôi sẽ gửi cho bạn một số lời khuyên về chu kỳ kinh nguyệt.',
      lastMessageTime: '2 phút trước',
      unreadCount: 2,
      status: 'active',
      sessionType: 'consultation',
    },
    {
      id: 2,
      counselorId: 2,
      counselorName: 'Dr. Lê Văn Minh',
      counselorAvatar:
        'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/06/anh-bac-si-27.jpg.webp',
      isOnline: false,
      lastMessage: 'Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi.',
      lastMessageTime: '1 giờ trước',
      unreadCount: 0,
      status: 'completed',
      sessionType: 'qa',
    },
  ]);

  const [chatMessages, setChatMessages] = useState({
    1: [
      {
        id: 1,
        sender: 'counselor',
        senderName: 'Dr. Nguyễn Thị Hoa',
        message:
          'Chào bạn! Tôi là Dr. Hoa. Hôm nay bạn cần tư vấn về vấn đề gì?',
        timestamp: '14:30',
        type: 'text',
      },
      {
        id: 2,
        sender: 'user',
        senderName: user?.name || 'Bạn',
        message: 'Chào bác sĩ! Tôi muốn hỏi về chu kỳ kinh nguyệt không đều.',
        timestamp: '14:32',
        type: 'text',
      },
      {
        id: 3,
        sender: 'counselor',
        senderName: 'Dr. Nguyễn Thị Hoa',
        message:
          'Chu kỳ không đều có thể do nhiều nguyên nhân. Bạn có thể mô tả chi tiết hơn về tình trạng của mình không?',
        timestamp: '14:33',
        type: 'text',
      },
      {
        id: 4,
        sender: 'user',
        senderName: user?.name || 'Bạn',
        message:
          'Chu kỳ của tôi thường 35-40 ngày, có khi lên đến 45 ngày. Điều này có bình thường không ạ?',
        timestamp: '14:35',
        type: 'text',
      },
      {
        id: 5,
        sender: 'counselor',
        senderName: 'Dr. Nguyễn Thị Hoa',
        message: 'Tôi sẽ gửi cho bạn một số lời khuyên về chu kỳ kinh nguyệt.',
        timestamp: '14:36',
        type: 'text',
      },
    ],
    2: [
      {
        id: 1,
        sender: 'user',
        senderName: user?.name || 'Bạn',
        message: 'Thuốc tránh thai có ảnh hưởng đến chu kỳ không?',
        timestamp: '13:15',
        type: 'text',
      },
      {
        id: 2,
        sender: 'counselor',
        senderName: 'Dr. Lê Văn Minh',
        message:
          'Thuốc tránh thai có thể ảnh hưởng đến chu kỳ kinh nguyệt. Tùy thuộc vào loại thuốc và cơ địa của từng người.',
        timestamp: '13:20',
        type: 'text',
      },
      {
        id: 3,
        sender: 'counselor',
        senderName: 'Dr. Lê Văn Minh',
        message: 'Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi.',
        timestamp: '13:25',
        type: 'text',
      },
    ],
  });

  const onlineCounselors = [
    {
      id: 1,
      name: 'Dr. Nguyễn Thị Hoa',
      specialty: 'Sản phụ khoa',
      avatar:
        'https://www.hoilhpn.org.vn/documents/20182/3458479/28_Feb_2022_115842_GMTbsi_thuhien.jpg/c04e15ea-fbe4-415f-bacc-4e5d4cc0204d',
      isOnline: true,
      status: 'Có thể tư vấn',
      responseTime: '~ 2 phút',
    },
    {
      id: 3,
      name: 'Dr. Đỗ Phạm Nguyệt Thanh',
      specialty: 'Nội tiết',
      avatar:
        'https://www.hoilhpn.org.vn/documents/20182/3653964/5_May_2022_100351_GMTbs_dophamnguyetthanh.jpg/a744c0f6-07dd-457c-9075-3ec3ff26b384',
      isOnline: true,
      status: 'Có thể tư vấn',
      responseTime: '~ 5 phút',
    },
  ];

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

  // Chat handlers
  const handleOpenChat = chatId => {
    setActiveChatId(chatId);
    setShowChatWindow(true);
  };

  const handleCloseChat = () => {
    setShowChatWindow(false);
    setActiveChatId(null);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChatId) return;

    const currentTime = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newMsg = {
      id: chatMessages[activeChatId].length + 1,
      sender: 'user',
      senderName: user?.name || 'Bạn',
      message: newMessage.trim(),
      timestamp: currentTime,
      type: 'text',
    };

    setChatMessages(prev => ({
      ...prev,
      [activeChatId]: [...prev[activeChatId], newMsg],
    }));

    // Update active chat last message
    setActiveChats(prev =>
      prev.map(chat =>
        chat.id === activeChatId
          ? {
              ...chat,
              lastMessage: newMessage.trim(),
              lastMessageTime: 'Vừa xong',
            }
          : chat
      )
    );

    setNewMessage('');
  };

  const handleStartNewChat = counselorId => {
    const counselor = onlineCounselors.find(c => c.id === counselorId);
    if (!counselor) return;

    const newChat = {
      id: Date.now(), // Simple ID generation
      counselorId: counselor.id,
      counselorName: counselor.name,
      counselorAvatar: counselor.avatar,
      isOnline: true,
      lastMessage: 'Cuộc trò chuyện mới bắt đầu',
      lastMessageTime: 'Vừa xong',
      unreadCount: 0,
      status: 'active',
      sessionType: 'consultation',
    };

    setActiveChats(prev => [newChat, ...prev]);
    setChatMessages(prev => ({
      ...prev,
      [newChat.id]: [
        {
          id: 1,
          sender: 'counselor',
          senderName: counselor.name,
          message: `Chào bạn! Tôi là ${counselor.name}. Tôi có thể giúp gì cho bạn hôm nay?`,
          timestamp: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          type: 'text',
        },
      ],
    }));

    handleOpenChat(newChat.id);
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
      trend: '+2 từ tháng trước',
    },
    {
      title: 'Xét nghiệm STIs',
      value: overviewStats.totalSTITests,
      label: 'lần xét nghiệm đã thực hiện',
      icon: TestTube,
      color: '#22c55e',
      bgColor: 'rgba(34, 197, 94, 0.1)',
      trend: '+1 từ tháng trước',
    },
    {
      title: 'Câu hỏi đã hỏi',
      value: overviewStats.totalQuestions,
      label: 'câu hỏi đã được trả lời',
      icon: HelpCircle,
      color: '#a855f7',
      bgColor: 'rgba(168, 85, 247, 0.1)',
      trend: '+3 từ tuần trước',
    },
    {
      title: 'Thông báo mới',
      value: overviewStats.newNotifications,
      label: 'thông báo chưa đọc',
      icon: Bell,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      trend: 'Hôm nay',
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
                onClick={() => handleSmoothScroll('dashboard-history')}
                className={styles.navLink}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Lịch sử
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
                  <User size={32} />
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
                      <span className="health-stat-trend">{stat.trend}</span>
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
                    Chưa đọc ({notifications.filter(n => !n.read).length})
                  </button>
                  <button className="filter-btn">Quan trọng</button>
                </div>
                <button className="mark-all-read-btn">
                  <CheckCircle size={16} />
                  Đánh dấu đã đọc tất cả
                </button>
              </div>

              <div className="notification-list">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`notification-item ${
                      !notification.read ? 'unread' : ''
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

          {/* History & Activities */}
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

          {/* Chat Realtime Section */}
          <section id="dashboard-chat" className="chat-realtime-section">
            <div className="dashboard-section-header">
              <h2>Chat realtime với tư vấn viên</h2>
              <p>Trò chuyện trực tiếp với các chuyên gia của chúng tôi</p>
            </div>

            <div className="chat-container">
              {/* Active Chats List */}
              <div className="chat-sidebar">
                <div className="chat-sidebar-header">
                  <h3>Cuộc trò chuyện</h3>
                  <button
                    className="new-chat-btn"
                    onClick={() => handleSmoothScroll('online-counselors')}
                  >
                    <Plus size={16} />
                    Chat mới
                  </button>
                </div>

                <div className="active-chats-list">
                  {activeChats.map(chat => (
                    <div
                      key={chat.id}
                      className={`chat-item ${
                        activeChatId === chat.id ? 'active' : ''
                      }`}
                      onClick={() => handleOpenChat(chat.id)}
                    >
                      <div className="chat-avatar">
                        <img
                          src={chat.counselorAvatar}
                          alt={chat.counselorName}
                        />
                        {chat.isOnline && (
                          <div className="online-indicator"></div>
                        )}
                      </div>
                      <div className="chat-info">
                        <h4 className="chat-name">{chat.counselorName}</h4>
                        <p className="chat-last-message">{chat.lastMessage}</p>
                        <span className="chat-time">
                          {chat.lastMessageTime}
                        </span>
                      </div>
                      {chat.unreadCount > 0 && (
                        <div className="chat-unread-badge">
                          {chat.unreadCount}
                        </div>
                      )}
                      <div className={`chat-status ${chat.status}`}>
                        {chat.status === 'active' && (
                          <Circle size={8} className="status-dot" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Window */}
              <div className="chat-main">
                {activeChatId ? (
                  <div className="chat-window">
                    <div className="chat-header">
                      <div className="chat-header-info">
                        <img
                          src={
                            activeChats.find(c => c.id === activeChatId)
                              ?.counselorAvatar
                          }
                          alt="Avatar"
                          className="chat-header-avatar"
                        />
                        <div>
                          <h4>
                            {
                              activeChats.find(c => c.id === activeChatId)
                                ?.counselorName
                            }
                          </h4>
                          <span className="chat-header-status">
                            {activeChats.find(c => c.id === activeChatId)
                              ?.isOnline
                              ? 'Đang trực tuyến'
                              : 'Ngoại tuyến'}
                          </span>
                        </div>
                      </div>
                      <div className="chat-header-actions">
                        <button className="chat-action-btn">
                          <Video size={18} />
                        </button>
                        <button className="chat-action-btn">
                          <Phone size={18} />
                        </button>
                        <button
                          className="chat-action-btn"
                          onClick={handleCloseChat}
                        >
                          <Minimize2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="chat-messages">
                      {chatMessages[activeChatId]?.map(message => (
                        <div
                          key={message.id}
                          className={`message ${
                            message.sender === 'user'
                              ? 'user-message'
                              : 'counselor-message'
                          }`}
                        >
                          <div className="message-content">
                            <p>{message.message}</p>
                            <span className="message-time">
                              {message.timestamp}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="chat-input">
                      <div className="chat-input-actions">
                        <button className="input-action-btn">
                          <Paperclip size={18} />
                        </button>
                        <button className="input-action-btn">
                          <Smile size={18} />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyPress={e =>
                          e.key === 'Enter' && handleSendMessage()
                        }
                        className="message-input"
                      />
                      <button
                        className="send-message-btn"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="chat-placeholder">
                    <MessageSquare size={64} />
                    <h3>Chọn cuộc trò chuyện để bắt đầu</h3>
                    <p>
                      Chọn một tư vấn viên từ danh sách bên trái để bắt đầu chat
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Online Counselors */}
            <div id="online-counselors" className="online-counselors-section">
              <h3>Tư vấn viên đang trực tuyến</h3>
              <div className="online-counselors-grid">
                {onlineCounselors.map(counselor => (
                  <div key={counselor.id} className="counselor-card">
                    <div className="counselor-avatar">
                      <img src={counselor.avatar} alt={counselor.name} />
                      <div className="online-indicator"></div>
                    </div>
                    <div className="counselor-info">
                      <h4>{counselor.name}</h4>
                      <p>{counselor.specialty}</p>
                      <span className="counselor-status">
                        {counselor.status}
                      </span>
                      <span className="response-time">
                        {counselor.responseTime}
                      </span>
                    </div>
                    <button
                      className="start-chat-btn"
                      onClick={() => handleStartNewChat(counselor.id)}
                    >
                      <MessageCircle size={16} />
                      Bắt đầu chat
                    </button>
                  </div>
                ))}
              </div>
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
