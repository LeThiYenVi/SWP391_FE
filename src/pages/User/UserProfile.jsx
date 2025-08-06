import React, { useEffect, useState, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit3,
  Save,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Eye,
  ArrowLeft,
  Shield,
  Heart,
  Activity,
  Star,
  Award,
  Settings,
  Bell,
  ChevronRight,
  Plus,
  Trash2,
  Download,
  Share2,
  Camera,
  Upload,
  RefreshCw
} from 'lucide-react';
import { Science as TestTubeIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import instance from '../../services/customize-axios';
import BookingService from '../../services/BookingService';
import { getUserBookingsAPI } from '../../services/ConsultationService';
import { getUserProfileWithTrendsAPI } from '../../services/UsersSevices';
import Avatar from '../../components/Avatar';
import notificationService from '../../services/NotificationService';

// Component hiển thị các cuộc hẹn sắp tới
const UpcomingAppointments = () => {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [upcomingConsultations, setUpcomingConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUpcomingAppointments();
  }, []);

  const loadUpcomingAppointments = async () => {
    try {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Load bookings
      const bookingResult = await BookingService.getUserBookings();
      if (bookingResult.success) {
        const futureBookings = bookingResult.data.filter(booking => {
          if (!booking.timeSlot?.date) return false;
          const bookingDate = new Date(booking.timeSlot.date);
          return bookingDate >= today && booking.status !== 'CANCELLED';
        });
        setUpcomingBookings(futureBookings);
      }

      // Load consultations
      const consultationResult = await getUserBookingsAPI();
      if (consultationResult.success) {
        const futureConsultations = consultationResult.data.filter(consultation => {
          if (!consultation.consultationDate) return false;
          const consultationDate = new Date(consultation.consultationDate);
          return consultationDate >= today && consultation.status !== 'CANCELLED';
        });
        setUpcomingConsultations(futureConsultations);
      }
    } catch (error) {
      console.error('Error loading upcoming appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Đang tải lịch hẹn...</span>
      </div>
    );
  }

  const totalAppointments = upcomingBookings.length + upcomingConsultations.length;

  if (totalAppointments === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có lịch hẹn sắp tới</h3>
        <p className="text-gray-600 mb-4">Bạn chưa có lịch hẹn nào trong thời gian tới</p>
        <div className="text-sm text-gray-500">
          <p>• Đặt lịch xét nghiệm STI</p>
          <p>• Đặt lịch tư vấn với chuyên gia</p>
          <p>• Theo dõi kết quả xét nghiệm</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Lịch hẹn sắp tới ({totalAppointments})
        </h3>
      </div>

      {/* STI Testing Bookings */}
      {upcomingBookings.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-md font-medium text-gray-700 flex items-center">
            <TestTubeIcon className="h-4 w-4 mr-2 text-blue-500" />
            Xét nghiệm STI ({upcomingBookings.length})
          </h4>
          {upcomingBookings.map((booking) => (
            <div key={booking.id} className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <h4 className="font-semibold text-gray-900">
                      {booking.testingService?.serviceName || 'Xét nghiệm STI'}
                    </h4>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(booking.timeSlot?.date)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {formatTime(booking.timeSlot?.startTime)} - {formatTime(booking.timeSlot?.endTime)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {booking.testingService?.location || 'Địa chỉ sẽ được thông báo'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {booking.status === 'PENDING' ? 'Chờ xác nhận' :
                     booking.status === 'CONFIRMED' ? 'Xác nhận' : booking.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Consultation Bookings */}
      {upcomingConsultations.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-md font-medium text-gray-700 flex items-center">
            <User className="h-4 w-4 mr-2 text-green-500" />
            Tư vấn ({upcomingConsultations.length})
          </h4>
          {upcomingConsultations.map((consultation) => (
            <div key={consultation.id} className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <h4 className="font-semibold text-gray-900">
                      Tư vấn với {consultation.consultant?.fullName || 'Chuyên gia'}
                    </h4>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(consultation.consultationDate)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {formatTime(consultation.startTime)} - {formatTime(consultation.endTime)}
                    </div>
                    {consultation.notes && (
                      <div className="flex items-start">
                        <FileText className="h-4 w-4 mr-2 mt-0.5" />
                        <span className="text-xs">{consultation.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {consultation.status === 'PENDING' ? 'Chờ xác nhận' :
                     consultation.status === 'CONFIRMED' ? 'Xác nhận' : consultation.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const UserProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({});
  const [editProfile, setEditProfile] = useState({});
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [deletingAvatar, setDeletingAvatar] = useState(false);
  const [trendData, setTrendData] = useState(null);
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfile();
    loadTrends();
    loadNotifications();
  }, []);

  useEffect(() => {
    if (activeTab === 'bookings' && bookings.length === 0) {
      loadBookings();
    }
    if (activeTab === 'notifications' && notifications.length === 0) {
      loadNotifications();
    }
  }, [activeTab]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await instance.get('/api/user/profile');
      
      // API trả về format: { success: true, content: UserResponseDTO, message: "..." }
      const userData = res.data.content || res.data.data || res.data;
      
      const cleanData = Object.fromEntries(
        Object.entries(userData).map(([k, v]) => [k, v == null ? '' : v])
      );

      const mappedData = {
        id: cleanData.id || cleanData.userId,
        username: cleanData.username || '',
        email: cleanData.email || '',
        fullName: cleanData.fullName || cleanData.fullname || cleanData.name || '',
        phoneNumber: cleanData.phoneNumber || cleanData.phone || '',
        dateOfBirth: cleanData.dateOfBirth || cleanData.dob || '',
        address: cleanData.address || '',
        gender: cleanData.gender || '',
        description: cleanData.description || '',
        medicalHistory: cleanData.medicalHistory || '',
        avatarUrl: cleanData.avatarUrl || '',
        avatarPublicId: cleanData.avatarPublicId || '',
        roleName: cleanData.roleName || '',
        status: cleanData.status || '',
        createdAt: cleanData.createdAt || '',
        updatedAt: cleanData.updatedAt || ''
      };
      setProfile(mappedData);
      setEditProfile(mappedData);
    } catch (error) {
      toast.error('Không thể tải thông tin hồ sơ!');
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    setLoadingBookings(true);
    try {
      const result = await BookingService.getUserBookings();
      if (result.success) {
        setBookings(result.data || []);
      } else {
        toast.error(result.message || 'Không thể tải lịch sử booking');
      }
    } catch (error) {
      toast.error('Không thể tải lịch sử booking');
    } finally {
      setLoadingBookings(false);
    }
  };

  const loadTrends = async () => {
    setLoadingTrends(true);
    try {
      const result = await getUserProfileWithTrendsAPI();
      if (result.success) {
        setTrendData(result.content?.trendData || null);
      } else {
        // Không thể tải dữ liệu trends
      }
    } catch (error) {
      // Không thể tải dữ liệu trends
    } finally {
      setLoadingTrends(false);
    }
  };

  const loadNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const notificationsData = await notificationService.fetchUserNotifications();
      // Xử lý trường hợp API trả về null, undefined hoặc không phải array
      if (notificationsData && Array.isArray(notificationsData)) {
        setNotifications(notificationsData);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      toast.error('Không thể tải thông báo');
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const requestBody = {
        username: editProfile.username,
        email: editProfile.email,
        fullName: editProfile.fullName,
        phoneNumber: editProfile.phoneNumber,
        dateOfBirth: editProfile.dateOfBirth,
        address: editProfile.address,
        gender: editProfile.gender,
        description: editProfile.description,
        medicalHistory: editProfile.medicalHistory
      };

      const response = await instance.patch('/api/user/profile', requestBody);
      console.log('Update profile response:', response);

      // Kiểm tra status code thành công (200-299)
      if (response.status >= 200 && response.status < 300) {
        // API có thể trả về nhiều format khác nhau
        const updatedUser = response.data.content || response.data.data || response.data;
        const updatedProfile = {
          ...editProfile,
          ...updatedUser
        };
        setProfile(updatedProfile);
        toast.success(response.data.message || 'Cập nhật hồ sơ thành công!');
        setIsEditing(false);
      } else {
        toast.error(response.data.message || 'Cập nhật hồ sơ thất bại!');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Cập nhật hồ sơ thất bại!');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  const handleAvatarUpload = async (file) => {
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await instance.post('/api/user/avatar/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Avatar upload response:', response);

      // Kiểm tra status code thành công (200-299)
      if (response.status >= 200 && response.status < 300) {
        const responseData = response.data.data || response.data.content || response.data;

        // Update profile with new avatar information
        if (responseData) {
          const { user, avatarUrl, publicId } = responseData;
          setProfile(prev => ({
            ...prev,
            avatarUrl: avatarUrl || responseData.avatarUrl,
            avatarPublicId: publicId || responseData.publicId,
            ...(user || {})
          }));
        }

        toast.success(response.data.message || 'Cập nhật ảnh đại diện thành công!');
      } else {
        toast.error(response.data.message || 'Không thể cập nhật ảnh đại diện!');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error(error.response?.data?.message || 'Không thể cập nhật ảnh đại diện!');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ảnh đại diện?')) {
      return;
    }

    setDeletingAvatar(true);
    try {
      const response = await instance.delete('/api/user/avatar/delete');
      console.log('Delete avatar response:', response);

      // Kiểm tra status code thành công (200-299)
      if (response.status >= 200 && response.status < 300) {
        const updatedUser = response.data.content || response.data.data || response.data;

        // Update profile
        setProfile(prev => ({
          ...prev,
          avatarUrl: null,
          avatarPublicId: null,
          ...(updatedUser || {})
        }));

        toast.success(response.data.message || 'Đã xóa ảnh đại diện thành công!');
      } else {
        toast.error(response.data.message || 'Không thể xóa ảnh đại diện!');
      }
    } catch (error) {
      console.error('Delete avatar error:', error);
      toast.error(error.response?.data?.message || 'Không thể xóa ảnh đại diện!');
    } finally {
      setDeletingAvatar(false);
    }
  };

  const checkAvatar = async () => {
    try {
      const response = await instance.get('/api/user/avatar/check');
      
      // API trả về format: { success: true, content: { hasAvatar, avatarUrl }, message: "..." }
      if (response.data.success) {
        const responseData = response.data.content || response.data.data;
        const { hasAvatar, avatarUrl } = responseData;
        
        if (hasAvatar && avatarUrl !== profile.avatarUrl) {
          setProfile(prev => ({ ...prev, avatarUrl: avatarUrl }));
          toast.info('Đã cập nhật ảnh đại diện!');
        }
      }
    } catch (error) {
      // Không thể kiểm tra avatar
    }
  };

  // Check avatar khi component mount
  useEffect(() => {
    if (profile?.avatarUrl) {
      checkAvatar();
    }
  }, [profile?.avatarUrl]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return 'Ngày không hợp lệ';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      return 'Ngày không hợp lệ';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white';
      case 'CONFIRMED':
        return 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white';
      case 'SAMPLE_COLLECTED':
        return 'bg-gradient-to-r from-purple-400 to-pink-400 text-white';
      case 'TESTING':
        return 'bg-gradient-to-r from-orange-400 to-red-400 text-white';
      case 'COMPLETED':
        return 'bg-gradient-to-r from-green-400 to-emerald-400 text-white';
      case 'CANCELLED':
        return 'bg-gradient-to-r from-red-400 to-pink-400 text-white';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'SAMPLE_COLLECTED':
        return 'Đã lấy mẫu';
      case 'TESTING':
        return 'Đang xét nghiệm';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getCompletionRate = () => {
    const fields = ['fullName', 'phoneNumber', 'dateOfBirth', 'address', 'gender', 'description'];
    const filledFields = fields.filter(field => profile[field] && profile[field].trim() !== '');
    return Math.round((filledFields.length / fields.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 backdrop-blur-sm"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Quay lại</span>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Hồ sơ cá nhân</h1>
                <p className="text-blue-100 text-lg">Quản lý thông tin cá nhân và lịch sử dịch vụ</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="relative group">
                <Avatar
                  src={profile.avatarUrl && profile.avatarUrl.trim() !== '' ? profile.avatarUrl : null}
                  alt={profile.fullName || "User Avatar"}
                  size="lg"
                  className="mx-auto"
                />
                <button
                  onClick={triggerFileInput}
                  disabled={uploadingAvatar || deletingAvatar}
                  className="absolute inset-0 w-16 h-16 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 disabled:opacity-75"
                >
                  {uploadingAvatar ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Camera className="h-6 w-6 text-white" />
                  )}
                </button>
                {profile.avatarUrl && (
                  <button
                    onClick={handleDeleteAvatar}
                    disabled={deletingAvatar}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors duration-300 disabled:opacity-75"
                  >
                    {deletingAvatar ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
              <div>
                <p className="font-bold text-white text-lg">{profile.fullName || 'Chưa cập nhật'}</p>
                <p className="text-blue-100">{profile.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Completion Card */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Hoàn thiện hồ sơ</h3>
                  <p className="text-sm text-gray-600">Cập nhật thông tin để có trải nghiệm tốt hơn</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{getCompletionRate()}%</div>
                <div className="text-xs text-gray-500">Hoàn thành</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getCompletionRate()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-1 mb-6 border border-gray-100">
          <div className="flex space-x-1">
            {[
              { id: 'profile', label: 'Thông tin cá nhân', icon: User },
              // { id: 'bookings', label: 'Lịch sử dịch vụ', icon: FileText }, // Hidden per user request
              { id: 'trends', label: 'Thống kê & Xu hướng', icon: Activity },
              { id: 'notifications', label: 'Thông báo', icon: Bell },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md transform scale-102'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Thông tin cá nhân</h2>
                    <p className="text-blue-100">Quản lý thông tin cá nhân của bạn</p>
                  </div>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-6 py-3 text-sm font-semibold text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center px-6 py-3 text-sm font-semibold text-white bg-green-500 rounded-xl hover:bg-green-600 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center px-6 py-3 text-sm font-semibold text-gray-600 bg-white rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-500" />
                    Thông tin cơ bản
                  </h3>
                  
                  {/* Full Name */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-500" />
                      Họ và tên
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editProfile.fullName || ''}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                        placeholder="Nhập họ và tên"
                      />
                    ) : (
                      <p className="text-gray-900 py-2 font-medium">{profile.fullName || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-blue-500" />
                      Email
                    </label>
                    <p className="text-gray-900 py-2 font-medium bg-white px-4 py-3 rounded-lg border border-gray-200">{profile.email}</p>
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      Email không thể thay đổi
                    </p>
                  </div>

                  {/* Phone Number */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-blue-500" />
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editProfile.phoneNumber || ''}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                        placeholder="Nhập số điện thoại"
                      />
                    ) : (
                      <p className="text-gray-900 py-2 font-medium">{profile.phoneNumber || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-blue-500" />
                      Giới tính
                    </label>
                    {isEditing ? (
                      <select
                        value={editProfile.gender || ''}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 py-2 font-medium">
                        {profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-blue-500" />
                    Thông tin bổ sung
                  </h3>

                  {/* Date of Birth */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      Ngày sinh
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editProfile.dateOfBirth || ''}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                      />
                    ) : (
                      <p className="text-gray-900 py-2 font-medium">{formatDate(profile.dateOfBirth)}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                      Địa chỉ
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editProfile.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                        placeholder="Nhập địa chỉ"
                      />
                    ) : (
                      <p className="text-gray-900 py-2 font-medium">{profile.address || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-500" />
                      Mô tả
                    </label>
                    {isEditing ? (
                      <textarea
                        rows={3}
                        value={editProfile.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white resize-none"
                        placeholder="Nhập mô tả về bản thân"
                      />
                    ) : (
                      <p className="text-gray-900 py-2 font-medium">{profile.description || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  {/* Medical History */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-500" />
                      Tiền sử bệnh
                    </label>
                    {isEditing ? (
                      <textarea
                        rows={3}
                        value={editProfile.medicalHistory || ''}
                        onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white resize-none"
                        placeholder="Nhập tiền sử bệnh (nếu có)"
                      />
                    ) : (
                      <p className="text-gray-900 py-2 font-medium">{profile.medicalHistory || 'Chưa cập nhật'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab - Hidden per user request */}
        {false && activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Lịch sử dịch vụ</h2>
                    <p className="text-green-100">Xem lại các dịch vụ đã sử dụng</p>
                  </div>
                </div>
                <button
                  onClick={loadBookings}
                  disabled={loadingBookings}
                  className="flex items-center px-6 py-3 text-sm font-semibold text-green-600 bg-white rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {loadingBookings ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent mr-2"></div>
                  ) : (
                    <Clock className="h-4 w-4 mr-2" />
                  )}
                  {loadingBookings ? 'Đang tải...' : 'Làm mới'}
                </button>
              </div>
            </div>

            <div className="p-8">
              {loadingBookings ? (
                <div className="flex justify-center items-center py-16">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Đang tải lịch sử...</p>
                  </div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
                    <TestTubeIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có lịch sử dịch vụ</h3>
                  <p className="text-gray-500 mb-6">Các dịch vụ bạn đã đặt sẽ hiển thị ở đây</p>
                  <button
                    onClick={() => navigate('/xet-nghiem-sti')}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Đặt dịch vụ ngay
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div
                      key={booking.bookingId}
                      className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02]"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                              <span className="text-white font-bold text-lg">#{booking.bookingId}</span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{booking.serviceName}</h3>
                              <span className={`px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                {getStatusText(booking.status)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100">
                              <TestTubeIcon className="h-5 w-5 text-blue-500" />
                              <div>
                                <p className="text-sm text-gray-500">Dịch vụ</p>
                                <p className="font-semibold text-gray-900">{booking.serviceName}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100">
                              <Calendar className="h-5 w-5 text-green-500" />
                              <div>
                                <p className="text-sm text-gray-500">Ngày đặt</p>
                                <p className="font-semibold text-gray-900">{formatDateTime(booking.bookingDate)}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100">
                              <Clock className="h-5 w-5 text-purple-500" />
                              <div>
                                <p className="text-sm text-gray-500">Lịch hẹn</p>
                                <p className="font-semibold text-gray-900">
                                  {booking.slotDate ? formatDate(booking.slotDate) : 'Chưa có'}
                                  {booking.startTime && booking.endTime && ` (${booking.startTime} - ${booking.endTime})`}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100">
                              <Award className="h-5 w-5 text-orange-500" />
                              <div>
                                <p className="text-sm text-gray-500">Giá dịch vụ</p>
                                <p className="font-bold text-green-600 text-lg">
                                  {booking.servicePrice?.toLocaleString('vi-VN')}đ
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex space-x-3">
                          {booking.status === 'COMPLETED' && booking.result && (
                            <button
                              onClick={() => {
                                alert(`Kết quả xét nghiệm:\n\n${booking.result}`);
                              }}
                              className="flex items-center px-4 py-2 text-sm font-semibold text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-all duration-300"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Xem kết quả
                            </button>
                          )}
                          {booking.status === 'COMPLETED' && (
                            <button className="flex items-center px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-300">
                              <Download className="h-4 w-4 mr-2" />
                              Tải PDF
                            </button>
                          )}
                        </div>
                        
                        {booking.status === 'COMPLETED' && booking.resultDate && (
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">Kết quả:</span> {formatDate(booking.resultDate)}
                          </div>
                        )}
                      </div>

                      {/* Status Info */}
                      {(booking.status === 'PENDING' || booking.status === 'CONFIRMED' || booking.status === 'SAMPLE_COLLECTED' || booking.status === 'TESTING') && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                          <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-blue-600 mr-3" />
                            <span className="text-blue-800 font-medium">
                              {booking.status === 'PENDING' && 'Đang chờ xác nhận từ phòng khám'}
                              {booking.status === 'CONFIRMED' && 'Xác nhận, vui lòng đến đúng giờ hẹn'}
                              {booking.status === 'SAMPLE_COLLECTED' && 'Đã lấy mẫu, đang chờ kết quả xét nghiệm'}
                              {booking.status === 'TESTING' && 'Đang tiến hành xét nghiệm, kết quả sẽ có sớm'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Result Info */}
                      {booking.status === 'COMPLETED' && booking.result && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                          <div className="flex items-center mb-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                            <span className="text-green-800 font-semibold">Kết quả xét nghiệm</span>
                          </div>
                          <p className="text-green-700 whitespace-pre-wrap text-sm">
                            {booking.result.length > 150
                              ? `${booking.result.substring(0, 150)}...`
                              : booking.result
                            }
                          </p>
                          {booking.description && (
                            <div className="mt-3 pt-3 border-t border-green-200">
                              <span className="text-green-800 font-medium text-sm">Ghi chú:</span>
                              <p className="text-green-700 text-sm mt-1">{booking.description}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Thống kê & Xu hướng</h2>
                    <p className="text-purple-100">Theo dõi hoạt động và xu hướng sử dụng dịch vụ</p>
                  </div>
                </div>
                <button
                  onClick={loadTrends}
                  disabled={loadingTrends}
                  className="flex items-center px-6 py-3 text-sm font-semibold text-purple-600 bg-white rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {loadingTrends ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent mr-2"></div>
                  ) : (
                    <Activity className="h-4 w-4 mr-2" />
                  )}
                  {loadingTrends ? 'Đang tải...' : 'Làm mới'}
                </button>
              </div>
            </div>

            <div className="p-8">
              {loadingTrends ? (
                <div className="flex justify-center items-center py-16">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Đang tải dữ liệu thống kê...</p>
                  </div>
                </div>
              ) : !trendData ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
                    <Activity className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có dữ liệu thống kê</h3>
                  <p className="text-gray-500 mb-6">Dữ liệu thống kê sẽ hiển thị sau khi bạn sử dụng dịch vụ</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Overview Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm">Tổng đặt lịch</p>
                          <p className="text-2xl font-bold">{trendData.totalBookings || 0}</p>
                        </div>
                        <FileText className="h-8 w-8 text-blue-200" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm">Hoàn thành</p>
                          <p className="text-2xl font-bold">{trendData.completedBookings || 0}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-200" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm">Tư vấn</p>
                          <p className="text-2xl font-bold">{trendData.totalConsultations || 0}</p>
                        </div>
                        <User className="h-8 w-8 text-purple-200" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-sm">Tổng chi tiêu</p>
                          <p className="text-2xl font-bold">{(trendData.totalSpent || 0).toLocaleString('vi-VN')}đ</p>
                        </div>
                        <Award className="h-8 w-8 text-orange-200" />
                      </div>
                    </div>
                  </div>

                  {/* Monthly Trends */}
                  {trendData.monthlyTrends && trendData.monthlyTrends.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Xu hướng theo tháng</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {trendData.monthlyTrends.slice(-6).map((trend, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-2">{trend.month}</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Đặt lịch:</span>
                                <span className="font-medium">{trend.bookings}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tư vấn:</span>
                                <span className="font-medium">{trend.consultations}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Chi tiêu:</span>
                                <span className="font-medium">{trend.spending.toLocaleString('vi-VN')}đ</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top Services */}
                  {trendData.topServices && trendData.topServices.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Dịch vụ sử dụng nhiều nhất</h3>
                      <div className="space-y-3">
                        {trendData.topServices.map((service, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900">{service.serviceName}</h4>
                                <p className="text-sm text-gray-600">Sử dụng {service.usageCount} lần</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-600">{service.totalSpent.toLocaleString('vi-VN')}đ</p>
                                <p className="text-sm text-gray-500">Tổng chi tiêu</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Activities */}
                  {trendData.recentActivities && trendData.recentActivities.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
                      <div className="space-y-3">
                        {trendData.recentActivities.map((activity, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">{activity.icon === 'test-tube' ? '🧪' : activity.icon === 'user-md' ? '👨‍⚕️' : '❓'}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                                <p className="text-sm text-gray-600">{activity.description}</p>
                                <p className="text-xs text-gray-500">{activity.date}</p>
                              </div>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                activity.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                activity.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {activity.status === 'COMPLETED' ? 'Hoàn thành' :
                                 activity.status === 'PENDING' ? 'Chờ xử lý' : activity.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Health Insights */}
                  {trendData.healthInsights && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                      <h3 className="text-lg font-semibold text-green-900 mb-4">Thông tin sức khỏe</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-green-700 mb-1">Trạng thái chu kỳ:</p>
                          <p className="font-semibold text-green-900">{trendData.healthInsights.cycleStatus === 'REGULAR' ? 'Đều đặn' : 'Không đều'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-green-700 mb-1">Độ dài trung bình:</p>
                          <p className="font-semibold text-green-900">{trendData.healthInsights.averageCycleLength} ngày</p>
                        </div>
                        <div>
                          <p className="text-sm text-green-700 mb-1">Dự đoán kỳ tiếp theo:</p>
                          <p className="font-semibold text-green-900">{trendData.healthInsights.nextPeriodPrediction}</p>
                        </div>
                        <div>
                          <p className="text-sm text-green-700 mb-1">Điểm sức khỏe:</p>
                          <p className="font-semibold text-green-900">{trendData.healthInsights.wellnessScore}/100</p>
                        </div>
                      </div>
                      {trendData.healthInsights.healthRecommendation && (
                        <div className="mt-4 p-3 bg-white rounded-lg">
                          <p className="text-sm text-green-800">{trendData.healthInsights.healthRecommendation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Thông báo</h2>
                    <p className="text-orange-100">Quản lý thông báo của bạn</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={loadNotifications}
                    disabled={loadingNotifications}
                    className="flex items-center px-4 py-2 text-sm font-semibold text-orange-600 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all duration-300"
                  >
                    {loadingNotifications ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-600 border-t-transparent mr-2"></div>
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Làm mới
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await notificationService.markAllNotificationsAsReadAPI();
                        await loadNotifications();
                        toast.success('Đã đánh dấu tất cả thông báo đã đọc');
                      } catch (error) {
                        toast.error('Không thể đánh dấu tất cả thông báo đã đọc');
                      }
                    }}
                    className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-all duration-300"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Đánh dấu tất cả đã đọc
                  </button>

                </div>
              </div>
            </div>

            <div className="p-6">
              {loadingNotifications ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
                  <span className="ml-3 text-gray-600">Đang tải thông báo...</span>
                </div>
              ) : (!notifications || notifications.length === 0) ? (
                <UpcomingAppointments />

              ) : (
                <div className="space-y-4">
                  {notifications.filter(notification => notification && notification.id).map((notification) => (
                    <div
                      key={notification.id}
                      className={`bg-gray-50 rounded-xl p-4 border-l-4 transition-all duration-300 hover:shadow-md ${
                        notification.isRead 
                          ? 'border-gray-300 opacity-75' 
                          : 'border-orange-500 bg-orange-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`w-2 h-2 rounded-full ${
                              notification.isRead ? 'bg-gray-400' : 'bg-orange-500'
                            }`}></div>
                            <h4 className="font-semibold text-gray-900">
                              {notification.title || 'Thông báo mới'}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {notification.createdAt ? formatDateTime(notification.createdAt) : 'Vừa xong'}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{notification.message || 'Không có nội dung'}</p>
                          {notification.type && (
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                              notification.type === 'CONSULTATION' ? 'bg-blue-100 text-blue-800' :
                              notification.type === 'TEST_RESULT' ? 'bg-green-100 text-green-800' :
                              notification.type === 'CYCLE_REMINDER' ? 'bg-purple-100 text-purple-800' :
                              notification.type === 'QUESTION_ANSWERED' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {notification.type === 'CONSULTATION' ? 'Tư vấn' :
                               notification.type === 'TEST_RESULT' ? 'Kết quả xét nghiệm' :
                               notification.type === 'CYCLE_REMINDER' ? 'Nhắc nhở chu kỳ' :
                               notification.type === 'QUESTION_ANSWERED' ? 'Câu hỏi được trả lời' :
                               notification.type}
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {!notification.isRead && (
                            <button
                              onClick={async () => {
                                try {
                                  await notificationService.markNotificationAsReadAPI(notification.id);
                                  await loadNotifications();
                                  toast.success('Đã đánh dấu thông báo đã đọc');
                                } catch (error) {
                                  toast.error('Không thể đánh dấu thông báo đã đọc');
                                }
                              }}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                              title="Đánh dấu đã đọc"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          {notification.link && (
                            <button
                              onClick={() => {
                                if (notification.link.startsWith('/')) {
                                  navigate(notification.link);
                                } else {
                                  window.open(notification.link, '_blank');
                                }
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Xem chi tiết"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleAvatarUpload(e.target.files[0]);
          }
        }}
        className="hidden"
      />
    </div>
  );
};

export default UserProfile;
