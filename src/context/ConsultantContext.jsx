import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import consultantService from '../services/ConsultantService';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const ConsultantContext = createContext();

export const useConsultant = () => {
  const context = useContext(ConsultantContext);
  if (!context) {
    throw new Error('useConsultant must be used within a ConsultantProvider');
  }
  return context;
};

export const ConsultantProvider = ({ children }) => {
  const { user } = useAuth();
  const [consultantProfile, setConsultantProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Load consultant profile
  const loadConsultantProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await consultantService.getConsultantProfile();
      if (response.success) {
        setConsultantProfile(response.data);
        setIsOnline(response.data.onlineStatus);
      }
    } catch (error) {
      console.error('Error loading consultant profile:', error);
      toast.error('Không thể tải thông tin profile');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update consultant profile
  const updateProfile = useCallback(async profileData => {
    try {
      setLoading(true);
      const response = await consultantService.updateConsultantProfile(
        profileData
      );
      if (response.success) {
        setConsultantProfile(response.data);
        toast.success('Cập nhật profile thành công');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Không thể cập nhật profile');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      setLoading(true);
      const response = await consultantService.changePassword(
        oldPassword,
        newPassword
      );
      if (response.success) {
        toast.success(response.message);
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Không thể thay đổi mật khẩu');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load appointments
  const loadAppointments = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const response = await consultantService.getAppointments(filters);
      if (response.success) {
        setAppointments(response.data);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Không thể tải danh sách cuộc hẹn');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update appointment status
  const updateAppointmentStatus = useCallback(async (appointmentId, status, notes = '') => {
    try {
      const response = await consultantService.updateAppointmentStatus(
        appointmentId,
        status,
        notes
      );
      if (response.success) {
        setAppointments(prev =>
          prev.map(apt =>
            apt.id === appointmentId ? { ...apt, status, notes } : apt
          )
        );
        toast.success('Cập nhật trạng thái cuộc hẹn thành công');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Không thể cập nhật trạng thái cuộc hẹn');
      return false;
    }
  }, []);

  // Reschedule appointment
  const rescheduleAppointment = useCallback(async (appointmentId, newDate, newTime) => {
    try {
      const response = await consultantService.rescheduleAppointment(
        appointmentId,
        newDate,
        newTime
      );
      if (response.success) {
        setAppointments(prev =>
          prev.map(apt =>
            apt.id === appointmentId
              ? { ...apt, date: newDate, time: newTime }
              : apt
          )
        );
        toast.success('Đổi lịch hẹn thành công');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      toast.error('Không thể đổi lịch hẹn');
      return false;
    }
  }, []);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await consultantService.getConversations();
      if (response.success) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Không thể tải danh sách tin nhắn');
    } finally {
      setLoading(false);
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (conversationId, message) => {
    try {
      const response = await consultantService.sendMessage(
        conversationId,
        message
      );
      if (response.success) {
        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, response.data],
                  lastMessage: message,
                  timestamp: new Date().toISOString(),
                }
              : conv
          )
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Không thể gửi tin nhắn');
      return false;
    }
  }, []);

  // Load dashboard stats
  const loadDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await consultantService.getDashboardStats();
      if (response.success) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast.error('Không thể tải thống kê dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load analytics
  const loadAnalytics = useCallback(async (period = 'month') => {
    try {
      setLoading(true);
      const response = await consultantService.getAnalytics(period);
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Không thể tải dữ liệu phân tích');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update online status
  const updateOnlineStatus = useCallback(async online => {
    try {
      const response = await consultantService.updateOnlineStatus(online);
      if (response.success) {
        setIsOnline(online);
        setConsultantProfile(prev => ({ ...prev, onlineStatus: online }));
        toast.success(`Đã ${online ? 'bật' : 'tắt'} trạng thái trực tuyến`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating online status:', error);
      toast.error('Không thể cập nhật trạng thái trực tuyến');
      return false;
    }
  }, []);

  // Update working hours
  const updateWorkingHours = useCallback(async workingHours => {
    try {
      const response = await consultantService.updateWorkingHours(workingHours);
      if (response.success) {
        setConsultantProfile(prev => ({ ...prev, workingHours }));
        toast.success('Cập nhật giờ làm việc thành công');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating working hours:', error);
      toast.error('Không thể cập nhật giờ làm việc');
      return false;
    }
  }, []);

  // Get patient info
  const getPatientInfo = useCallback(async patientId => {
    try {
      const response = await consultantService.getPatientInfo(patientId);
      if (response.success) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error getting patient info:', error);
      return null;
    }
  }, []);

  // Initialize data on mount - chỉ load profile, các data khác sẽ được load từ component cụ thể
  useEffect(() => {
    console.log('ConsultantContext useEffect triggered:', {
      userRole: user?.role,
      shouldLoadProfile: user?.role === 'ROLE_CONSULTANT'
    });
    
    if (user?.role === 'ROLE_CONSULTANT') {
      console.log('Loading consultant profile...');
      loadConsultantProfile();
    }
  }, [user?.role]); // Chỉ chạy khi role thay đổi

  // Helper functions
  const getUpcomingAppointments = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments
      .filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= today && apt.status === 'scheduled';
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [appointments]);

  const getTodayAppointments = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === today);
  }, [appointments]);

  const getUnreadMessagesCount = useCallback(() => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  }, [conversations]);

  const getActiveConversations = useCallback(() => {
    return conversations.filter(conv => conv.status === 'active');
  }, [conversations]);

  const value = {
    // State
    consultantProfile,
    appointments,
    conversations,
    dashboardStats,
    analytics,
    loading,
    isOnline,

    // Actions
    loadConsultantProfile,
    updateProfile,
    changePassword,
    loadAppointments,
    updateAppointmentStatus,
    rescheduleAppointment,
    loadConversations,
    sendMessage,
    loadDashboardStats,
    loadAnalytics,
    updateOnlineStatus,
    updateWorkingHours,
    getPatientInfo,

    // Helper functions
    getUpcomingAppointments,
    getTodayAppointments,
    getUnreadMessagesCount,
    getActiveConversations,
  };

  return (
    <ConsultantContext.Provider value={value}>
      {children}
    </ConsultantContext.Provider>
  );
};

export default ConsultantContext;
