import React, { useState, useEffect } from 'react';
import { useCycle } from '../../../context/CycleContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import notificationService from '../../../services/NotificationService';
import {
  Calendar,
  Plus,
  Smile,
  Frown,
  Meh,
  Heart,
  Droplets,
  Bell,
  BookOpen,
  MessageCircle,
  TestTube,
  Settings,
  History,
  TrendingUp,
  Info,
  ChevronRight,
  Activity,
  Moon,
  Sun,
  CloudRain,
  Sparkles,
  Menu,
  X,
  User,
  LogOut,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { getTodayFormatted } from '../../../utils/dateUtils';
import CycleInsights from '../../../components/CycleInsights';

import styles from '../../HomePage.module.css';
import './index.css';

const CycleTracking = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    cycleData,
    predictions,
    notifications,
    updateCycleData,
    addSymptom,
    addMood,
    addNote,
    getDaysUntilNextPeriod,
    getDaysUntilOvulation,
    isInFertilityWindow,
    getDataForDate,
    getCyclePhaseForDate,
    getHealthRecommendations,
  } = useCycle();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewingMonth, setViewingMonth] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showPeriodForm, setShowPeriodForm] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [modalType, setModalType] = useState('period');
  const [periodFormData, setPeriodFormData] = useState({
    startDate: getTodayFormatted(),
    expectedLength: cycleData.periodLength || 5,
  });
  const [newNoteText, setNewNoteText] = useState('');
  const [notificationPermission, setNotificationPermission] =
    useState('default');

  const today = new Date();
  const monthStart = startOfMonth(viewingMonth);
  const monthEnd = endOfMonth(viewingMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const selectedDateData = getDataForDate(selectedDate);
  const healthRecommendations = getHealthRecommendations();

  // Defensive check để đảm bảo cycleData có đầy đủ fields cần thiết
  const safeMode = !cycleData.symptoms || !cycleData.mood || !cycleData.notes;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleStartPeriod = () => {
    updateCycleData({
      lastPeriod: periodFormData.startDate,
      periodLength: parseInt(periodFormData.expectedLength),
    });
    setShowPeriodForm(false);
  };

  const handleAddNote = () => {
    if (newNoteText.trim()) {
      addNote(selectedDate, newNoteText.trim());
      setNewNoteText('');
      setShowAddModal(false);
    }
  };

  const moodIcons = {
    happy: { icon: Smile, color: 'text-green-500', label: 'Vui vẻ' },
    sad: { icon: Frown, color: 'text-blue-500', label: 'Buồn' },
    neutral: { icon: Meh, color: 'text-gray-500', label: 'Bình thường' },
    excited: { icon: Sparkles, color: 'text-yellow-500', label: 'Phấn khích' },
    tired: { icon: Moon, color: 'text-purple-500', label: 'Mệt mỏi' },
    stressed: { icon: CloudRain, color: 'text-red-500', label: 'Căng thẳng' },
  };

  const symptomList = [
    'Đau bụng',
    'Đau lưng',
    'Đau đầu',
    'Buồn nôn',
    'Mệt mỏi',
    'Thay đổi cảm xúc',
    'Tăng cân',
    'Chuột rút',
    'Đau ngực',
    'Mụn trứng cá',
    'Chảy máu bất thường',
    'Khô âm đạo',
  ];

  const getPeriodPhase = date => {
    return getCyclePhaseForDate(date);
  };

  const getCurrentPhaseInfo = phase => {
    switch (phase) {
      case 'period':
        return {
          label: 'Kỳ kinh',
          icon: '🩸',
          description: 'Lót niêm mạc tử cung đang thoát ra',
          advice:
            'Nghỉ ngơi đủ giấc, uống nhiều nước, sử dụng miếng lót phù hợp',
          color: '#e91e63',
          bgColor: 'linear-gradient(135deg, #ffebee, #fce4ec)',
        };
      case 'follicular':
        return {
          label: 'Giai đoạn nang trứng',
          icon: '🌱',
          description: 'Cơ thể đang chuẩn bị cho chu kỳ mới',
          advice:
            'Thời điểm tốt để bắt đầu hoạt động thể chất và chế độ ăn lành mạnh',
          color: '#1976d2',
          bgColor: 'linear-gradient(135deg, #e3f2fd, #f1f8e9)',
        };
      case 'fertility':
        return {
          label: 'Thời kỳ màu mỡ',
          icon: '💕',
          description: 'Khả năng thụ thai cao nhất trong chu kỳ',
          advice: 'Nếu có kế hoạch mang thai, đây là thời điểm lý tưởng',
          color: '#ad1457',
          bgColor: 'linear-gradient(135deg, #fce4ec, #f3e5f5)',
        };
      case 'ovulation':
        return {
          label: 'Rụng trứng',
          icon: '🥚',
          description: 'Trứng đang được giải phóng từ buồng trứng',
          advice:
            'Có thể cảm thấy đau bụng nhẹ, năng lượng cao và ham muốn tăng',
          color: '#e65100',
          bgColor: 'linear-gradient(135deg, #fff3e0, #fff8e1)',
        };
      case 'luteal':
        return {
          label: 'Giai đoạn hoàng thể',
          icon: '🌙',
          description: 'Cơ thể đang chờ đợi tín hiệu mang thai',
          advice:
            'Có thể xuất hiện PMS, hãy chú ý đến chế độ ăn và tập thể dục nhẹ nhàng',
          color: '#7b1fa2',
          bgColor: 'linear-gradient(135deg, #f3e5f5, #e8eaf6)',
        };
      case 'premenstrual':
        return {
          label: 'Tiền kinh nguyệt',
          icon: '⚡',
          description: 'Cơ thể đang chuẩn bị cho kỳ kinh tiếp theo',
          advice:
            'Có thể cảm thấy căng thẳng, hãy thực hiện các hoạt động thư giãn',
          color: '#3f51b5',
          bgColor: 'linear-gradient(135deg, #e8eaf6, #e3f2fd)',
        };
      default:
        return {
          label: 'Chưa xác định',
          icon: '❓',
          description: 'Cần thêm dữ liệu để xác định giai đoạn',
          advice: 'Hãy ghi nhận thông tin chu kỳ để có dự đoán chính xác hơn',
          color: '#757575',
          bgColor: 'linear-gradient(135deg, #f5f5f5, #eeeeee)',
        };
    }
  };

  const currentPhaseInfo = getCurrentPhaseInfo(predictions.currentPhase);

  // Initialize notifications and check permissions
  useEffect(() => {
    const initNotifications = async () => {
      if ('Notification' in window) {
        const permission = await notificationService.requestPermission();
        setNotificationPermission(permission ? 'granted' : 'denied');

        if (permission && cycleData.lastPeriod) {
          notificationService.scheduleBrowserNotifications(cycleData);
        }
      }
    };

    initNotifications();
  }, [cycleData]);

  // Analytics calculations
  const getCycleAnalytics = () => {
    if (!cycleData.cycleHistory || cycleData.cycleHistory.length < 2) {
      return null;
    }

    const history = cycleData.cycleHistory;
    const cycleLengths = history.map(cycle => cycle.cycleLength);
    const avgLength =
      cycleLengths.reduce((sum, length) => sum + length, 0) /
      cycleLengths.length;
    const minLength = Math.min(...cycleLengths);
    const maxLength = Math.max(...cycleLengths);
    const variance =
      cycleLengths.reduce(
        (sum, length) => sum + Math.pow(length - avgLength, 2),
        0
      ) / cycleLengths.length;
    const regularity =
      variance < 4 ? 'Đều đặn' : variance < 9 ? 'Khá đều' : 'Không đều';

    return {
      totalCycles: history.length,
      avgLength: Math.round(avgLength),
      minLength,
      maxLength,
      regularity,
      variance: Math.round(variance * 10) / 10,
    };
  };

  // Export data functionality
  const handleExportData = () => {
    const exportData = {
      cycleData,
      predictions,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `chu-ky-sinh-san-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle notification permission
  const handleEnableNotifications = async () => {
    const permission = await notificationService.requestPermission();
    setNotificationPermission(permission ? 'granted' : 'denied');

    if (permission && cycleData.lastPeriod) {
      notificationService.scheduleBrowserNotifications(cycleData);
      notificationService.createInAppNotification({
        type: 'system',
        title: 'Thông báo đã được bật',
        message: 'Bạn sẽ nhận được nhắc nhở về chu kỳ sinh sản.',
        priority: 'low',
      });
    }
  };

  const analytics = getCycleAnalytics();

  return (
    <div className={styles.homepage}>
      {/* Header - Đồng nhất với HomePage và Dashboard */}
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
              <Link to="/cycle-tracking" className={styles.navLink}>
                Theo dõi chu kỳ
              </Link>
              <Link to="/consultation" className={styles.navLink}>
                Tư vấn
              </Link>
              <Link to="/sti-testing" className={styles.navLink}>
                Xét nghiệm
              </Link>
              <Link to="/qa" className={styles.navLink}>
                Hỏi đáp
              </Link>
            </nav>

            <div className={styles.headerActions}>
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className={styles.btnOutline}>
                    Đăng nhập
                  </Link>
                  <Link to="/register" className={styles.btnPrimary}>
                    Đăng ký
                  </Link>
                </>
              ) : (
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

      {/* Welcome/Header Section - Đồng nhất với Dashboard */}
      <section
        className={styles.about}
        style={{ paddingTop: '40px', paddingBottom: '60px' }}
      >
        <div className={styles.container}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: '700',
                lineHeight: '1.2',
                marginBottom: '16px',
                color: 'var(--text-primary)',
              }}
            >
              Theo dõi chu kỳ sinh sản
            </h1>
            <p
              style={{
                fontSize: 'clamp(16px, 2vw, 20px)',
                color: 'var(--text-secondary)',
                margin: '0 0 32px 0',
                lineHeight: '1.5',
                fontWeight: '400',
              }}
            >
              Quản lý và theo dõi sức khỏe sinh sản một cách thông minh
            </p>

            {predictions.currentPhase !== 'unknown' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '24px 32px',
                  background: currentPhaseInfo.bgColor,
                  borderRadius: 'var(--border-radius-lg)',
                  color: currentPhaseInfo.color,
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '32px',
                  border: `2px solid ${currentPhaseInfo.color}20`,
                  maxWidth: '600px',
                  margin: '0 auto 32px auto',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '20px',
                    fontWeight: '700',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>
                    {currentPhaseInfo.icon}
                  </span>
                  <span>Giai đoạn hiện tại: {currentPhaseInfo.label}</span>
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#2d3748',
                    lineHeight: '1.5',
                  }}
                >
                  <p style={{ margin: '0 0 8px 0', fontStyle: 'italic' }}>
                    {currentPhaseInfo.description}
                  </p>
                  <p
                    style={{
                      margin: '0',
                      fontSize: '14px',
                      color: '#4a5568',
                      background: 'rgba(255, 255, 255, 0.8)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    💡 <strong>Lời khuyên:</strong> {currentPhaseInfo.advice}
                  </p>
                </div>
              </div>
            )}

            {/* Header Actions - Sử dụng HomePage button styles */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={() => setShowPeriodForm(true)}
                className={styles.btnPrimary}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Droplets size={18} />
                Ghi nhận kỳ kinh
              </button>
              <button
                onClick={() => setShowHistoryModal(true)}
                className={styles.btnOutline}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <History size={18} />
                Lịch sử
              </button>
              <button
                onClick={() => setShowAnalyticsModal(true)}
                className={styles.btnOutline}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <TrendingUp size={18} />
                Phân tích
              </button>
              <button
                onClick={() => setShowExportModal(true)}
                className={styles.btnOutline}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <TrendingUp size={18} />
                Xuất dữ liệu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Đồng nhất container với HomePage */}
      <section
        style={{ background: 'var(--background-light)', padding: '60px 0' }}
      >
        <div className={styles.container}>
          {/* Smart Notifications */}
          {notifications.length > 0 && (
            <div className="notifications-section">
              <h3 className="section-title">
                <Bell size={20} />
                Thông báo thông minh
              </h3>
              <div className="notifications-list">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`notification-card ${notification.priority}`}
                  >
                    <div className="notification-icon">
                      {notification.type === 'ovulation' && <Heart size={20} />}
                      {notification.type === 'period' && <Droplets size={20} />}
                      {notification.type === 'health' && <Activity size={20} />}
                    </div>
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overview Cards */}
          <div className="cycle-overview">
            <div className="cycle-card">
              <Calendar className="cycle-icon pink" />
              <div className="cycle-card-info">
                <p>Kỳ kinh tiếp theo</p>
                <p className="cycle-card-value">
                  {getDaysUntilNextPeriod() !== null
                    ? `${getDaysUntilNextPeriod()} ngày`
                    : 'Chưa thiết lập'}
                </p>
              </div>
            </div>

            <div className="cycle-card">
              <Heart className="cycle-icon orange" />
              <div className="cycle-card-info">
                <p>Rụng trứng</p>
                <p className="cycle-card-value">
                  {getDaysUntilOvulation() !== null
                    ? `${getDaysUntilOvulation()} ngày`
                    : 'Chưa thiết lập'}
                </p>
              </div>
            </div>

            <div className="cycle-card">
              <Droplets className="cycle-icon blue" />
              <div className="cycle-card-info">
                <p>Độ dài chu kỳ</p>
                <p className="cycle-card-value">{cycleData.cycleLength} ngày</p>
              </div>
            </div>

            <div className="cycle-card">
              <div
                className={`cycle-icon ${
                  isInFertilityWindow() ? 'pink' : 'text-gray-300'
                }`}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'currentColor',
                  }}
                ></div>
              </div>
              <div className="cycle-card-info">
                <p>Thời kỳ màu mỡ</p>
                <p className="cycle-card-value">
                  {isInFertilityWindow() ? 'Đang diễn ra' : 'Không'}
                </p>
              </div>
            </div>
          </div>

          <div className="cycle-content-grid">
            {/* Calendar */}
            <div className="calendar-section">
              <div className="calendar-header">
                <h2 className="calendar-title">
                  {format(viewingMonth, 'MMMM yyyy')}
                </h2>
                <div className="calendar-nav">
                  <button
                    onClick={() => setViewingMonth(subMonths(viewingMonth, 1))}
                    className="nav-btn"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setViewingMonth(new Date())}
                    className="nav-btn today-btn"
                  >
                    Hôm nay
                  </button>
                  <button
                    onClick={() => setViewingMonth(addMonths(viewingMonth, 1))}
                    className="nav-btn"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="calendar-weekdays">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                  <div key={day} className="weekday">
                    {day}
                  </div>
                ))}
              </div>

              <div className="calendar-days">
                {monthDays.map(day => {
                  const phase = getPeriodPhase(day);
                  const isToday = isSameDay(day, today);
                  const isSelected = isSameDay(day, selectedDate);
                  const isOtherMonth = !isSameMonth(day, viewingMonth);
                  const dayData = getDataForDate(day);
                  const hasData =
                    dayData.symptoms.length > 0 ||
                    dayData.mood.length > 0 ||
                    dayData.notes.length > 0;

                  let dayClass = 'calendar-day';
                  if (isToday) dayClass += ' today';
                  if (isSelected) dayClass += ' selected';
                  if (isOtherMonth) dayClass += ' other-month';
                  if (phase) dayClass += ` ${phase}`;
                  if (hasData) dayClass += ' has-data';

                  return (
                    <div
                      key={day.toString()}
                      className={dayClass}
                      onClick={() => setSelectedDate(day)}
                    >
                      <span className="day-number">{format(day, 'd')}</span>
                      {hasData && <div className="data-indicator"></div>}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="calendar-legend">
                <div className="legend-item">
                  <div className="legend-color period"></div>
                  <span>Kỳ kinh</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color ovulation"></div>
                  <span>Rụng trứng</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color fertility"></div>
                  <span>Thời kỳ màu mỡ</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color luteal"></div>
                  <span>Hoàng thể</span>
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="side-panel">
              {/* Selected Date Info */}
              <div className="panel-card">
                <h3 className="panel-title">
                  <Info size={18} />
                  {format(selectedDate, 'dd/MM/yyyy')}
                </h3>

                {selectedDateData.symptoms.length > 0 && (
                  <div className="date-data-section">
                    <h4>Triệu chứng:</h4>
                    {selectedDateData.symptoms.map((item, index) => (
                      <span key={index} className="data-tag symptom">
                        {item.symptom}
                      </span>
                    ))}
                  </div>
                )}

                {selectedDateData.mood.length > 0 && (
                  <div className="date-data-section">
                    <h4>Tâm trạng:</h4>
                    {selectedDateData.mood.map((item, index) => {
                      const mood = moodIcons[item.mood];
                      return (
                        <span key={index} className="data-tag mood">
                          <mood.icon size={16} />
                          {mood.label}
                        </span>
                      );
                    })}
                  </div>
                )}

                {selectedDateData.notes.length > 0 && (
                  <div className="date-data-section">
                    <h4>Ghi chú:</h4>
                    {selectedDateData.notes.map((item, index) => (
                      <p key={index} className="note-text">
                        {item.note}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="panel-card">
                <h3 className="panel-title">Ghi nhận nhanh</h3>
                <div className="quick-actions">
                  <button
                    onClick={() => {
                      setModalType('symptom');
                      setShowAddModal(true);
                    }}
                    className="quick-action-btn blue"
                  >
                    <Plus className="quick-action-icon" />
                    <span>Thêm triệu chứng</span>
                  </button>

                  <button
                    onClick={() => {
                      setModalType('mood');
                      setShowAddModal(true);
                    }}
                    className="quick-action-btn green"
                  >
                    <Plus className="quick-action-icon" />
                    <span>Ghi nhận tâm trạng</span>
                  </button>

                  <button
                    onClick={() => {
                      setModalType('note');
                      setShowAddModal(true);
                    }}
                    className="quick-action-btn purple"
                  >
                    <Plus className="quick-action-icon" />
                    <span>Thêm ghi chú</span>
                  </button>
                </div>
              </div>

              {/* Cycle Insights */}
              <div className="panel-card">
                <CycleInsights
                  cycleData={cycleData}
                  predictions={predictions}
                />
              </div>

              {/* Health Recommendations */}
              {healthRecommendations.length > 0 && (
                <div className="panel-card">
                  <h3 className="panel-title">
                    <BookOpen size={18} />
                    Lời khuyên cho bạn
                  </h3>
                  <div className="recommendations-list">
                    {healthRecommendations.map((rec, index) => (
                      <div key={index} className="recommendation-item">
                        <div className="rec-icon">
                          {rec.type === 'rest' && <Moon size={16} />}
                          {rec.type === 'food' && <Sun size={16} />}
                          {rec.type === 'exercise' && <Activity size={16} />}
                          {rec.type === 'nutrition' && <Sparkles size={16} />}
                          {rec.type === 'hydration' && <Droplets size={16} />}
                          {rec.type === 'monitoring' && (
                            <TrendingUp size={16} />
                          )}
                          {rec.type === 'mood' && <Heart size={16} />}
                          {rec.type === 'preparation' && <Calendar size={16} />}
                          {rec.type === 'comfort' && <Smile size={16} />}
                        </div>
                        <p>{rec.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Services */}
              <div className="panel-card">
                <h3 className="panel-title">Dịch vụ liên quan</h3>
                <div className="services-list">
                  <Link to="/consultation" className="service-link">
                    <MessageCircle size={16} />
                    <span>Tư vấn với chuyên gia</span>
                    <ChevronRight size={16} />
                  </Link>
                  <Link to="/sti-testing" className="service-link">
                    <TestTube size={16} />
                    <span>Xét nghiệm STI</span>
                    <ChevronRight size={16} />
                  </Link>
                  <Link to="/qa" className="service-link">
                    <BookOpen size={16} />
                    <span>Hỏi đáp sức khỏe</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Settings */}
              <div className="panel-card">
                <h3 className="panel-title">
                  <Settings size={18} />
                  Thiết lập chu kỳ
                </h3>
                <div className="settings-form">
                  <div className="form-group">
                    <label className="form-label">Độ dài chu kỳ (ngày)</label>
                    <input
                      type="number"
                      value={cycleData.cycleLength}
                      onChange={e =>
                        updateCycleData({
                          cycleLength: parseInt(e.target.value),
                        })
                      }
                      className="form-input"
                      min="21"
                      max="35"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Số ngày kinh (ngày)</label>
                    <input
                      type="number"
                      value={cycleData.periodLength}
                      onChange={e =>
                        updateCycleData({
                          periodLength: parseInt(e.target.value),
                        })
                      }
                      className="form-input"
                      min="3"
                      max="7"
                    />
                  </div>

                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="advanced-settings-btn"
                  >
                    <Settings size={16} />
                    Cài đặt nâng cao
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Period Start Form Modal */}
      {showPeriodForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Ghi nhận kỳ kinh mới</h3>

            <div className="period-form">
              <div className="form-group">
                <label className="form-label">Ngày bắt đầu</label>
                <input
                  type="date"
                  value={periodFormData.startDate}
                  onChange={e =>
                    setPeriodFormData(prev => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dự kiến số ngày kinh</label>
                <input
                  type="number"
                  value={periodFormData.expectedLength}
                  onChange={e =>
                    setPeriodFormData(prev => ({
                      ...prev,
                      expectedLength: e.target.value,
                    }))
                  }
                  className="form-input"
                  min="3"
                  max="7"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => setShowPeriodForm(false)}
                className="modal-btn cancel"
              >
                Hủy
              </button>
              <button onClick={handleStartPeriod} className="modal-btn confirm">
                Lưu thông tin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Data Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              {modalType === 'symptom' && 'Thêm triệu chứng'}
              {modalType === 'mood' && 'Ghi nhận tâm trạng'}
              {modalType === 'note' && 'Thêm ghi chú'}
            </h3>

            {modalType === 'symptom' && (
              <div className="option-list">
                {symptomList.map(symptom => (
                  <button
                    key={symptom}
                    onClick={() => {
                      addSymptom(format(selectedDate, 'yyyy-MM-dd'), symptom);
                      setShowAddModal(false);
                    }}
                    className="option-item"
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            )}

            {modalType === 'mood' && (
              <div className="option-list">
                {Object.entries(moodIcons).map(([key, mood]) => (
                  <button
                    key={key}
                    onClick={() => {
                      addMood(format(selectedDate, 'yyyy-MM-dd'), key);
                      setShowAddModal(false);
                    }}
                    className="mood-item"
                  >
                    <mood.icon className={`mood-icon ${mood.color}`} />
                    {mood.label}
                  </button>
                ))}
              </div>
            )}

            {modalType === 'note' && (
              <div>
                <textarea
                  placeholder="Nhập ghi chú của bạn..."
                  className="note-input"
                  rows="3"
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                />
                <button
                  onClick={handleAddNote}
                  className="modal-btn confirm"
                  disabled={!newNoteText.trim()}
                >
                  Lưu ghi chú
                </button>
              </div>
            )}

            <div className="modal-actions">
              <button
                onClick={() => setShowAddModal(false)}
                className="modal-btn cancel"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <h3 className="modal-title">
              <History size={20} />
              Lịch sử chu kỳ
            </h3>

            <div className="history-content">
              {cycleData.cycleHistory && cycleData.cycleHistory.length > 0 ? (
                <div className="history-list">
                  {cycleData.cycleHistory.map(cycle => (
                    <div key={cycle.id} className="history-item">
                      <div className="history-dates">
                        <strong>
                          {format(new Date(cycle.startDate), 'dd/MM/yyyy')}
                        </strong>
                        <span> - </span>
                        <strong>
                          {format(new Date(cycle.endDate), 'dd/MM/yyyy')}
                        </strong>
                      </div>
                      <div className="history-info">
                        <span>Độ dài: {cycle.cycleLength} ngày</span>
                        {cycle.symptoms.length > 0 && (
                          <span>Triệu chứng: {cycle.symptoms.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-history">
                  <p>
                    Chưa có lịch sử chu kỳ. Hãy tiếp tục theo dõi để xây dựng dữ
                    liệu!
                  </p>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="modal-btn cancel"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalyticsModal && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <h3 className="modal-title">
              <TrendingUp size={20} />
              Phân tích chu kỳ
            </h3>

            <div className="analytics-content">
              {analytics ? (
                <div className="analytics-stats">
                  <div className="stat-grid">
                    <div className="stat-item">
                      <h4>Tổng số chu kỳ</h4>
                      <p className="stat-value">{analytics.totalCycles}</p>
                    </div>
                    <div className="stat-item">
                      <h4>Độ dài trung bình</h4>
                      <p className="stat-value">{analytics.avgLength} ngày</p>
                    </div>
                    <div className="stat-item">
                      <h4>Chu kỳ ngắn nhất</h4>
                      <p className="stat-value">{analytics.minLength} ngày</p>
                    </div>
                    <div className="stat-item">
                      <h4>Chu kỳ dài nhất</h4>
                      <p className="stat-value">{analytics.maxLength} ngày</p>
                    </div>
                    <div className="stat-item">
                      <h4>Độ đều đặn</h4>
                      <p className="stat-value">{analytics.regularity}</p>
                    </div>
                    <div className="stat-item">
                      <h4>Độ lệch chuẩn</h4>
                      <p className="stat-value">{analytics.variance}</p>
                    </div>
                  </div>

                  {notificationPermission !== 'granted' && (
                    <div
                      style={{
                        marginTop: '20px',
                        padding: '16px',
                        background: '#fff3cd',
                        borderRadius: '8px',
                      }}
                    >
                      <h4>Bật thông báo để nhận nhắc nhở</h4>
                      <p>
                        Cho phép thông báo để nhận nhắc nhở về chu kỳ sinh sản
                      </p>
                      <button
                        onClick={handleEnableNotifications}
                        className="modal-btn confirm"
                      >
                        <Bell size={16} />
                        Bật thông báo
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-analytics">
                  <p>
                    Cần ít nhất 2 chu kỳ để thực hiện phân tích. Hãy tiếp tục
                    theo dõi!
                  </p>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                onClick={() => setShowAnalyticsModal(false)}
                className="modal-btn cancel"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              <TrendingUp size={20} />
              Xuất dữ liệu
            </h3>

            <div className="export-content">
              <p>
                Xuất toàn bộ dữ liệu chu kỳ sinh sản của bạn để sao lưu hoặc
                chia sẻ với bác sĩ.
              </p>

              <div className="export-info">
                <h4>Dữ liệu sẽ bao gồm:</h4>
                <ul>
                  <li>Thông tin chu kỳ kinh nguyệt</li>
                  <li>Lịch sử các chu kỳ</li>
                  <li>Triệu chứng và tâm trạng</li>
                  <li>Ghi chú cá nhân</li>
                  <li>Dự đoán và phân tích</li>
                </ul>
              </div>

              {safeMode && (
                <div
                  style={{
                    padding: '12px',
                    background: '#fff3cd',
                    borderRadius: '8px',
                    marginTop: '16px',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '14px', color: '#856404' }}>
                    ⚠️ Dữ liệu đang được tải. Vui lòng đợi một chút để xuất đầy
                    đủ.
                  </p>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                onClick={() => setShowExportModal(false)}
                className="modal-btn cancel"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  handleExportData();
                  setShowExportModal(false);
                }}
                className="modal-btn confirm"
                disabled={safeMode}
              >
                Xuất dữ liệu JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              <Settings size={20} />
              Cài đặt nâng cao
            </h3>

            <div className="settings-content">
              <div className="setting-group">
                <h4>Thông báo</h4>
                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={notificationPermission === 'granted'}
                      onChange={handleEnableNotifications}
                    />
                    Bật thông báo trình duyệt
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <h4>Chu kỳ mặc định</h4>
                <div className="setting-item">
                  <label>Độ dài chu kỳ trung bình (ngày)</label>
                  <input
                    type="number"
                    value={cycleData.cycleLength}
                    onChange={e =>
                      updateCycleData({ cycleLength: parseInt(e.target.value) })
                    }
                    min="21"
                    max="35"
                  />
                </div>
                <div className="setting-item">
                  <label>Số ngày kinh trung bình</label>
                  <input
                    type="number"
                    value={cycleData.periodLength}
                    onChange={e =>
                      updateCycleData({
                        periodLength: parseInt(e.target.value),
                      })
                    }
                    min="3"
                    max="7"
                  />
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="modal-btn cancel"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CycleTracking;
