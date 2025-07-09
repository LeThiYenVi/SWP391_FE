// hooks/useUserDashboard.js - Custom hook for dashboard logic
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useCycle } from '../../../context/CycleContext';
import { useAppointment } from '../../../context/AppointmentContext';
import { toast } from 'react-toastify';

export const useUserDashboard = () => {
  const { user, logout } = useAuth();
  const { getDaysUntilNextPeriod, getDaysUntilOvulation, isInFertilityWindow } = useCycle();
  const { getUpcomingAppointments } = useAppointment();

  const [dashboardData, setDashboardData] = useState({
    loading: true,
    error: null,
    stats: {},
    notifications: [],
    recentActivities: []
  });

  // Memoized calculations for performance
  const healthStats = useMemo(() => {
    const daysUntilPeriod = getDaysUntilNextPeriod();
    const daysUntilOvulation = getDaysUntilOvulation();
    const inFertilityWindow = isInFertilityWindow();
    const upcomingAppointments = getUpcomingAppointments();

    return [
      {
        id: 'period',
        title: 'Chu kỳ kinh nguyệt',
        value: daysUntilPeriod !== null ? `${daysUntilPeriod} ngày` : 'Chưa thiết lập',
        label: 'đến kỳ kinh tiếp theo',
        icon: 'Calendar',
        color: '#e91e63',
        bgColor: 'rgba(233, 30, 99, 0.1)',
        trend: daysUntilPeriod <= 3 ? 'warning' : 'normal'
      },
      {
        id: 'ovulation',
        title: 'Rụng trứng',
        value: daysUntilOvulation !== null ? `${daysUntilOvulation} ngày` : 'Chưa thiết lập',
        label: inFertilityWindow ? 'Đang trong thời kỳ màu mỡ' : 'đến thời kỳ rụng trứng',
        icon: 'Heart',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        trend: inFertilityWindow ? 'active' : 'normal'
      },
      {
        id: 'appointments',
        title: 'Lịch hẹn',
        value: upcomingAppointments.length,
        label: 'lịch hẹn sắp tới',
        icon: 'MessageCircle',
        color: 'var(--primary-color)',
        bgColor: 'rgba(86, 131, 146, 0.1)',
        trend: upcomingAppointments.length > 0 ? 'active' : 'normal'
      }
    ];
  }, [getDaysUntilNextPeriod, getDaysUntilOvulation, isInFertilityWindow, getUpcomingAppointments]);

  const quickActions = useMemo(() => [
    {
      id: 'cycle-tracking',
      title: 'Theo dõi chu kỳ',
      description: 'Ghi nhận chu kỳ và triệu chứng',
      icon: 'Calendar',
      link: '/theo-doi-chu-ky',
      color: 'pink',
      requireAuth: true,
      isActive: true
    },
    {
      id: 'consultation',
      title: 'Tư vấn trực tuyến',
      description: 'Tư vấn với chuyên gia',
      icon: 'MessageCircle',
      link: '/tu-van',
      color: 'blue',
      requireAuth: true,
      isActive: true
    },
    {
      id: 'sti-testing',
      title: 'Xét nghiệm STIs',
      description: 'Đặt lịch xét nghiệm',
      icon: 'TestTube',
      link: '/xet-nghiem-sti',
      color: 'green',
      requireAuth: true,
      isActive: true
    },
    {
      id: 'qa',
      title: 'Hỏi đáp',
      description: 'Gửi câu hỏi cho tư vấn viên',
      icon: 'Heart',
      link: '/hoi-dap',
      color: 'purple',
      requireAuth: true,
      isActive: true
    }
  ], []);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setDashboardData(prev => ({ ...prev, loading: true }));
        
        // TODO: Replace with actual API calls
        const [statsRes, notificationsRes, activitiesRes] = await Promise.all([
          fetchUserStats(),
          fetchNotifications(),
          fetchRecentActivities()
        ]);

        setDashboardData({
          loading: false,
          error: null,
          stats: statsRes,
          notifications: notificationsRes,
          recentActivities: activitiesRes
        });
      } catch (error) {
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: 'Không thể tải dữ liệu dashboard'
        }));
        toast.error('Có lỗi xảy ra khi tải dữ liệu');
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  // Mock API functions - replace with real ones
  const fetchUserStats = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      totalConsultations: 5,
      totalSTITests: 2,
      totalQuestions: 8,
      newNotifications: 3
    };
  };

  const fetchNotifications = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: 1,
        type: 'period',
        title: 'Nhắc nhở kỳ kinh',
        message: 'Kỳ kinh dự kiến bắt đầu trong 2 ngày nữa',
        time: '2 giờ trước',
        read: false,
        priority: 'high'
      },
      {
        id: 2,
        type: 'appointment',
        title: 'Lịch tư vấn sắp tới',
        message: 'Bạn có lịch tư vấn với Dr. Hoa vào 14:00 ngày mai',
        time: '1 ngày trước',
        read: false,
        priority: 'medium'
      }
    ];
  };

  const fetchRecentActivities = async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      {
        id: 1,
        type: 'cycle_log',
        title: 'Ghi nhận chu kỳ',
        description: 'Đã ghi nhận triệu chứng và tâm trạng',
        timestamp: '2024-01-15T10:30:00Z',
        icon: 'Calendar'
      },
      {
        id: 2,
        type: 'consultation',
        title: 'Hoàn thành tư vấn',
        description: 'Tư vấn với Dr. Nguyễn Hoa',
        timestamp: '2024-01-14T14:00:00Z',
        icon: 'MessageCircle'
      }
    ];
  };

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất thành công');
  };

  return {
    user,
    dashboardData,
    healthStats,
    quickActions,
    handleLogout,
    refreshDashboard: () => {
      if (user) {
        // Trigger reload
        setDashboardData(prev => ({ ...prev, loading: true }));
      }
    }
  };
};
