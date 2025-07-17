import React, { useEffect, useState } from 'react';
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
  TestTube,
  CheckCircle,
  AlertCircle,
  FileText,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import axios from '../../services/customize-axios';
import BookingService from '../../services/BookingService';

const UserProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // profile, bookings
  const [profile, setProfile] = useState({});
  const [editProfile, setEditProfile] = useState({});
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Load profile
  useEffect(() => {
    loadProfile();
  }, []);

  // Load bookings when switching to bookings tab
  useEffect(() => {
    if (activeTab === 'bookings' && bookings.length === 0) {
      loadBookings();
    }
  }, [activeTab]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/user/profile');
      // Chuyển null thành '' cho các field để form không bị undefined
      const cleanData = Object.fromEntries(
        Object.entries(res.data).map(([k, v]) => [k, v == null ? '' : v])
      );
      console.log('DATA PROFILE:', cleanData); // Debug dữ liệu trả về

      // Map dữ liệu theo UserProfileRequest format
      const mappedData = {
        username: cleanData.username || '',
        email: cleanData.email || '',
        fullName: cleanData.fullName || cleanData.fullname || cleanData.name || '',
        phoneNumber: cleanData.phoneNumber || cleanData.phone || '',
        dateOfBirth: cleanData.dateOfBirth || cleanData.dob || '',
        address: cleanData.address || '',
        gender: cleanData.gender || '',
        description: cleanData.description || '',
        medicalHistory: cleanData.medicalHistory || '',
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

  const handleInputChange = (field, value) => {
    setEditProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Tạo request body theo UserProfileRequest format
      const requestBody = {
        username: editProfile.username,
        email: editProfile.email,
        fullName: editProfile.fullName,
        phoneNumber: editProfile.phoneNumber,
        dateOfBirth: editProfile.dateOfBirth,
        address: editProfile.address,
        gender: editProfile.gender,
        description: editProfile.description,
        medicalHistory: editProfile.medicalHistory,
        createdAt: editProfile.createdAt,
        updatedAt: new Date().toISOString()
      };

      await axios.patch('/api/user/profile', requestBody);
      toast.success('Cập nhật hồ sơ thành công!');
      setProfile(editProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Cập nhật hồ sơ thất bại!');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
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
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'SAMPLE_COLLECTED':
        return 'bg-purple-100 text-purple-800';
      case 'TESTING':
        return 'bg-orange-100 text-orange-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Quay lại</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
                <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân và lịch sử dịch vụ</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#B3CCD4' }}>
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold" style={{ color: '#354766' }}>{profile.fullName || 'Chưa cập nhật'}</p>
                <p className="text-sm text-gray-600">{profile.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
          {[
            { id: 'profile', label: 'Thông tin cá nhân', icon: User },
            { id: 'bookings', label: 'Lịch sử dịch vụ', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={activeTab === tab.id ? { color: '#354766' } : {}}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Thông tin cá nhân</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                    style={{
                      color: '#354766',
                      backgroundColor: '#B3CCD4',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#9BB8C0'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#B3CCD4'}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 transition-colors"
                      style={{ backgroundColor: '#354766' }}
                      onMouseEnter={(e) => !saving && (e.target.style.backgroundColor = '#2A3A52')}
                      onMouseLeave={(e) => !saving && (e.target.style.backgroundColor = '#354766')}
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {saving ? 'Đang lưu...' : 'Lưu'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Họ và tên */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editProfile.fullName || ''}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập họ và tên"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profile.fullName || 'Chưa cập nhật'}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email
                  </label>
                  <p className="text-gray-900 py-2 bg-gray-50 px-3 rounded-lg">{profile.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editProfile.phoneNumber || ''}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập số điện thoại"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profile.phoneNumber || 'Chưa cập nhật'}</p>
                  )}
                </div>

                {/* Ngày sinh */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Ngày sinh
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editProfile.dateOfBirth || ''}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formatDate(profile.dateOfBirth)}</p>
                  )}
                </div>

                {/* Giới tính */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới tính
                  </label>
                  {isEditing ? (
                    <select
                      value={editProfile.gender || ''}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 py-2">
                      {profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'Chưa cập nhật'}
                    </p>
                  )}
                </div>

                {/* Địa chỉ */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Địa chỉ
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editProfile.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập địa chỉ"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profile.address || 'Chưa cập nhật'}</p>
                  )}
                </div>

                {/* Mô tả */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline h-4 w-4 mr-2" />
                    Mô tả
                  </label>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={editProfile.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập mô tả về bản thân"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profile.description || 'Chưa cập nhật'}</p>
                  )}
                </div>

                {/* Tiền sử bệnh */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline h-4 w-4 mr-2" />
                    Tiền sử bệnh
                  </label>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={editProfile.medicalHistory || ''}
                      onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tiền sử bệnh (nếu có)"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profile.medicalHistory || 'Chưa cập nhật'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Lịch sử dịch vụ</h2>
                <button
                  onClick={loadBookings}
                  disabled={loadingBookings}
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
                  style={{
                    color: '#354766',
                    backgroundColor: '#B3CCD4',
                  }}
                  onMouseEnter={(e) => !loadingBookings && (e.target.style.backgroundColor = '#9BB8C0')}
                  onMouseLeave={(e) => !loadingBookings && (e.target.style.backgroundColor = '#B3CCD4')}
                >
                  {loadingBookings ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600 mr-2"></div>
                  ) : (
                    <Clock className="h-4 w-4 mr-2" />
                  )}
                  {loadingBookings ? 'Đang tải...' : 'Làm mới'}
                </button>
              </div>
            </div>

            <div className="p-6">
              {loadingBookings ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <TestTube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">Chưa có lịch sử dịch vụ</p>
                  <p className="text-gray-400">Các dịch vụ bạn đã đặt sẽ hiển thị ở đây</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.bookingId}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              #{booking.bookingId}
                            </h3>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                              {getStatusText(booking.status)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <TestTube className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="font-medium">Dịch vụ:</span>
                              <span className="ml-1">{booking.serviceName}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="font-medium">Ngày đặt:</span>
                              <span className="ml-1">{formatDateTime(booking.bookingDate)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="font-medium">Lịch hẹn:</span>
                              <span className="ml-1">
                                {booking.slotDate ? formatDate(booking.slotDate) : 'Chưa có'}
                                {booking.startTime && booking.endTime && ` (${booking.startTime} - ${booking.endTime})`}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">Giá:</span>
                              <span className="ml-1 text-blue-600 font-semibold">
                                {booking.servicePrice?.toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex flex-col space-y-2">
                          {booking.status === 'COMPLETED' && booking.result && (
                            <button
                              onClick={() => {
                                alert(`Kết quả xét nghiệm:\n\n${booking.result}`);
                              }}
                              className="flex items-center px-3 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Xem kết quả
                            </button>
                          )}
                          {booking.status === 'COMPLETED' && booking.resultDate && (
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">Kết quả:</span> {formatDate(booking.resultDate)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Additional info for completed bookings */}
                      {booking.status === 'COMPLETED' && booking.result && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="bg-green-50 rounded-lg p-3">
                            <div className="flex items-center mb-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                              <span className="text-sm font-medium text-green-800">Kết quả xét nghiệm</span>
                            </div>
                            <p className="text-sm text-green-700 whitespace-pre-wrap">
                              {booking.result.length > 100
                                ? `${booking.result.substring(0, 100)}...`
                                : booking.result
                              }
                            </p>
                            {booking.description && (
                              <div className="mt-2">
                                <span className="text-sm font-medium text-green-800">Ghi chú:</span>
                                <p className="text-sm text-green-700">{booking.description}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Pending or processing status info */}
                      {(booking.status === 'PENDING' || booking.status === 'CONFIRMED' || booking.status === 'SAMPLE_COLLECTED' || booking.status === 'TESTING') && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center">
                              <AlertCircle className="h-4 w-4 text-blue-600 mr-2" />
                              <span className="text-sm text-blue-800">
                                {booking.status === 'PENDING' && 'Đang chờ xác nhận từ phòng khám'}
                                {booking.status === 'CONFIRMED' && 'Đã xác nhận, vui lòng đến đúng giờ hẹn'}
                                {booking.status === 'SAMPLE_COLLECTED' && 'Đã lấy mẫu, đang chờ kết quả xét nghiệm'}
                                {booking.status === 'TESTING' && 'Đang tiến hành xét nghiệm, kết quả sẽ có sớm'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
