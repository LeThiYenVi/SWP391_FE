import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Upload, FileText, CheckCircle, AlertCircle, Download, Plus } from 'lucide-react';
import { getBookingsByStatusAPI } from '../../services/StaffService';
import BookingService from '../../services/BookingService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import TestResultForm from '../../components/staff/TestResultForm';
import { toast } from 'react-toastify';
import { useWebSocket } from '../../hooks/useWebSocketCompat';

const StaffUploadResult = () => {
  const { connected, notifications } = useWebSocket();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('SAMPLE_COLLECTED');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, statusFilter, dateFilter, bookings]);

  // Listen for WebSocket notifications to auto-refresh
  useEffect(() => {
    if (connected && notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      console.log('📨 Staff Upload Result received notification:', latestNotification);

      // If it's a booking status update, refresh the list
      if (latestNotification.type === 'booking_status_update' ||
          latestNotification.message?.includes('booking') ||
          latestNotification.message?.includes('lịch hẹn') ||
          latestNotification.message?.includes('mẫu')) {
        console.log('🔄 Auto-refreshing bookings due to notification');
        toast.info('Danh sách đã được cập nhật tự động');
        fetchBookings();
      }
    }
  }, [notifications, connected]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Gọi API để lấy bookings theo status SAMPLE_COLLECTED
      const response = await getBookingsByStatusAPI('SAMPLE_COLLECTED', 1, 100);

      if (response && response.content) {
        console.log('📋 Bookings loaded:', response.content);
        console.log('📋 Sample collection profiles:', response.content.map(b => ({
          id: b.bookingId,
          profile: b.sampleCollectionProfile
        })));
        setBookings(response.content);
        setFilteredBookings(response.content);
      } else if (response && Array.isArray(response)) {
        console.log('📋 Bookings loaded (array):', response);
        setBookings(response);
        setFilteredBookings(response);
      } else {
        setBookings([]);
        setFilteredBookings([]);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Không thể tải danh sách đặt lịch. Vui lòng thử lại sau.');
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Filter by search term (name or ID)
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.customerFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.bookingId?.toString().includes(searchTerm)
      );
    }

    // Filter by status - load lại data khi thay đổi status
    if (statusFilter !== 'SAMPLE_COLLECTED') {
      // Nếu chọn status khác, load lại data với status đó
      fetchBookingsByStatus(statusFilter);
      return;
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.appointmentDate).toISOString().split('T')[0];
        return bookingDate === dateFilter;
      });
    }

    setFilteredBookings(filtered);
  };

  const fetchBookingsByStatus = async (status) => {
    setLoading(true);
    try {
      const response = await getBookingsByStatusAPI(status, 1, 100);

      if (response && response.content) {
        setBookings(response.content);
        setFilteredBookings(response.content);
      } else if (response && Array.isArray(response)) {
        setBookings(response);
        setFilteredBookings(response);
      } else {
        setBookings([]);
        setFilteredBookings([]);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Không thể tải danh sách đặt lịch. Vui lòng thử lại sau.');
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type (PDF, DOC, DOCX, JPG, PNG)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Chỉ chấp nhận file PDF, DOC, DOCX, JPG, PNG');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 10MB');
        return;
      }
      
      setResultFile(file);
    }
  };

  const handleUploadResult = async () => {
    if (!selectedBooking || !resultNotes.trim()) {
      alert('Vui lòng chọn lịch hẹn và nhập kết quả xét nghiệm');
      return;
    }

    setUploading(true);
    try {
      // Prepare result data
      const resultData = {
        result: resultNotes.trim(),
        resultType: 'Bình thường', // Sử dụng format backend mong đợi
        notes: `Kết quả xét nghiệm được cập nhật bởi staff vào ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
        resultDate: new Date(resultDate).toISOString() // Convert to ISO string for backend
      };

      console.log('📤 Sending result data:', resultData);
      console.log('📤 Booking ID:', selectedBooking.bookingId);

      // Call API to update test result
      const result = await BookingService.updateTestResult(selectedBooking.bookingId, resultData);

      if (!result.success) {
        throw new Error(result.message || 'Không thể cập nhật kết quả xét nghiệm');
      }

      // Update local state
      const updatedBookings = bookings.map(booking =>
        booking.bookingId === selectedBooking.bookingId
          ? { ...booking, status: 'COMPLETED', resultDate, result: resultNotes, resultNotes }
          : booking
      );

      setBookings(updatedBookings);
      setSelectedBooking(null);
      setResultFile(null);
      setResultNotes('');

      // Show success message with notification info
      toast.success('Đã cập nhật kết quả xét nghiệm thành công!', {
        toastId: `update-result-${selectedBooking.bookingId}`, // Prevent duplicates
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Refresh data
      fetchBookings();
    } catch (err) {
      console.error('❌ Error uploading result:', err);
      console.error('❌ Error response:', err.response?.data);
      console.error('❌ Error status:', err.response?.status);

      const errorMessage = err.response?.data?.message || err.message || 'Không thể cập nhật kết quả xét nghiệm';
      toast.error(`❌ ${errorMessage}`, {
        toastId: `error-result-${selectedBooking?.bookingId || 'unknown'}`, // Prevent duplicates
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleNewResultSuccess = (updatedBooking) => {
    // Update local state
    const updatedBookings = bookings.map(booking =>
      booking.bookingId === updatedBooking.bookingId
        ? { ...booking, ...updatedBooking, status: 'COMPLETED' }
        : booking
    );

    setBookings(updatedBookings);
    setSelectedBooking(null);

    // Refresh the list
    fetchBookings();
  };

  const handleSelectBookingForNewResult = (booking) => {
    setSelectedBooking(booking);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return 'Ngày không hợp lệ';
    }
  };

  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: vi });
    } catch (error) {
      return 'Giờ không hợp lệ';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SAMPLE_COLLECTED':
        return 'bg-purple-100 text-purple-800';
      case 'RESULTS_READY':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'SAMPLE_COLLECTED':
        return 'Đã lấy mẫu';
      case 'RESULTS_READY':
        return 'Kết quả sẵn sàng';
      case 'COMPLETED':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Lỗi!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-3 md:p-6 staff-main-content">
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Nhập kết quả xét nghiệm</h1>
          <div className="text-xs md:text-sm bg-gray-100 p-2 rounded">
            <div>WebSocket: {connected ? '✅ Kết nối' : '❌ Không kết nối'}</div>
            <div>Thông báo: {notifications.length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-4 md:mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc ID..."
            className="pl-10 pr-4 py-2 w-full text-sm md:text-base border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="SAMPLE_COLLECTED">Đã lấy mẫu - Cần cập nhật kết quả</option>
              <option value="TESTING">Đang xét nghiệm</option>
              <option value="COMPLETED">Đã hoàn thành</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="mb-6">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Không tìm thấy lịch hẹn nào cần nhập kết quả.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dịch vụ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày lấy mẫu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.bookingId}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedBooking?.bookingId === booking.bookingId ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => handleSelectBookingForNewResult(booking)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{booking.bookingId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.customerFullName}</div>
                        <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.serviceName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.sampleCollectionProfile?.sampleCollectionDate ?
                          `${formatDate(booking.sampleCollectionProfile.sampleCollectionDate)} ${formatTime(booking.sampleCollectionProfile.sampleCollectionDate)}` :
                          'Chưa lấy mẫu'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {booking.status === 'SAMPLE_COLLECTED' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectBookingForNewResult(booking);
                            }}
                            className="text-blue-600 hover:text-blue-900 flex items-center bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Cập nhật kết quả
                          </button>
                        ) : booking.status === 'TESTING' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectBookingForNewResult(booking);
                            }}
                            className="text-orange-600 hover:text-orange-900 flex items-center bg-orange-50 hover:bg-orange-100 px-3 py-1 rounded-lg transition-colors"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Hoàn thành KQ
                          </button>
                        ) : booking.status === 'COMPLETED' ? (
                          <span className="text-green-600 flex items-center px-3 py-1 bg-green-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Đã hoàn thành
                          </span>
                        ) : (
                          <span className="text-gray-400 px-3 py-1">Chưa sẵn sàng</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Result Form - Now below the table */}
      {selectedBooking ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Cập nhật kết quả xét nghiệm
            </h2>
            <button
              onClick={() => setSelectedBooking(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <TestResultForm
            booking={selectedBooking}
            onSuccess={handleNewResultSuccess}
            onCancel={() => {
              setSelectedBooking(null);
            }}
          />
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center justify-center py-8">
            <FileText className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Chọn lịch hẹn để cập nhật kết quả
            </h3>
            <p className="text-gray-500 text-center mb-4">
              Nhấp vào một booking trong bảng trên để bắt đầu cập nhật kết quả xét nghiệm
            </p>
            <div className="text-sm text-gray-400 text-center space-y-1">
              <p>• Chỉ có thể cập nhật booking có trạng thái "Đã lấy mẫu" hoặc "Đang xét nghiệm"</p>
              <p>• Kết quả sẽ được gửi thông báo tự động đến khách hàng</p>
              <p>• Form sẽ tự động điền thông tin từ booking đã chọn</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffUploadResult;
