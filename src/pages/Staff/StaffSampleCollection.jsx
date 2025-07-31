import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, TestTube, CheckCircle, AlertCircle, Clock, FileText } from 'lucide-react';
import { getAllBookingsAPI, getBookingsByStatusAPI, markSampleCollectedAPI } from '../../services/StaffService';
import SampleCollectionModal from '../../components/SampleCollectionModal';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useWebSocket } from '../../context/WebSocketContext';
import { toast } from 'react-toastify';

const StaffSampleCollection = () => {
  const { connected, notifications } = useWebSocket();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // Removed statusFilter since we only show CONFIRMED bookings
  const [dateFilter, setDateFilter] = useState('');
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, dateFilter, bookings]);

  // Listen for WebSocket notifications to auto-refresh
  useEffect(() => {
    if (connected && notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      console.log('📨 Staff received notification:', latestNotification);

      // If it's a booking status update, refresh the list
      if (latestNotification.type === 'booking_status_update' ||
          latestNotification.message?.includes('booking') ||
          latestNotification.message?.includes('lịch hẹn')) {
        console.log('🔄 Auto-refreshing bookings due to notification');
        toast.info('Danh sách đã được cập nhật tự động');
        fetchBookings();
      }
    }
  }, [notifications, connected]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Chỉ lấy bookings có status CONFIRMED để lấy mẫu
      const response = await getBookingsByStatusAPI('CONFIRMED', 1, 100);

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





  const handleSampleCollection = async (data) => {
    try {
      const trackingData = {
        sampleCollectionDate: data.sampleCollectionDate,
        resultDeliveryDate: data.resultDeliveryDate,
        resultDate: data.resultDeliveryDate, // Thêm resultDate cho API
        notes: data.sampleNotes,
        sampleNotes: data.sampleNotes // Thêm sampleNotes cho API
      };

      console.log('🧪 Updating sample collection for booking:', data.bookingId);
      await markSampleCollectedAPI(data.bookingId, trackingData);

      // Update local state instead of refetching
      setBookings(prevBookings =>
        prevBookings.filter(booking => booking.id !== data.bookingId)
      );
      setFilteredBookings(prevBookings =>
        prevBookings.filter(booking => booking.id !== data.bookingId)
      );

      // Close modal and reset
      setIsModalOpen(false);
      setSelectedBooking(null);
      setIsUpdating(false);

      console.log('✅ Sample collection updated successfully');
      toast.success('✅ Đã cập nhật thông tin lấy mẫu thành công!');

      // Force refresh after a short delay to ensure WebSocket has time to propagate
      setTimeout(() => {
        console.log('🔄 Force refreshing bookings after sample collection');
        fetchBookings();
      }, 1000);

    } catch (error) {
      console.error('❌ Error updating sample collection:', error);
      toast.error('❌ Có lỗi xảy ra khi cập nhật thông tin lấy mẫu');
    }
  };

  const handleCollectSample = (booking) => {
    setSelectedBooking(booking);
    setIsUpdating(false);
    setIsModalOpen(true);
  };

  // Removed handleUpdateSample since we only handle CONFIRMED bookings

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
    setIsUpdating(false);
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
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'SAMPLE_COLLECTED':
        return 'bg-purple-100 text-purple-800';
      case 'TESTING':
        return 'bg-indigo-100 text-indigo-800';
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Lấy mẫu xét nghiệm</h1>
            <p className="text-gray-600">Danh sách các lịch hẹn đã xác nhận cần lấy mẫu xét nghiệm</p>
          </div>
          <div className="text-sm bg-gray-100 p-2 rounded">
            <div>WebSocket: {connected ? '✅ Kết nối' : '❌ Không kết nối'}</div>
            <div>Thông báo: {notifications.length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc ID..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              placeholder="Lọc theo ngày hẹn"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="w-full">
        <div className="w-full">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Không có lịch hẹn nào đã xác nhận cần lấy mẫu.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200 table-auto w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      ID
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                      Khách hàng
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-60">
                      Dịch vụ
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                      Ngày hẹn
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.bookingId}
                      className={`hover:bg-gray-50 cursor-pointer ${selectedBooking?.bookingId === booking.bookingId ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{booking.bookingId}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        <div className="max-w-40 truncate" title={booking.customerFullName}>
                          {booking.customerFullName}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        <div className="max-w-60 truncate" title={booking.serviceName}>
                          {booking.serviceName}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="text-xs">
                          <div>{formatDate(booking.appointmentDate)}</div>
                          <div className="text-gray-400">{formatTime(booking.appointmentDate)}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCollectSample(booking);
                          }}
                          className="text-blue-600 hover:text-blue-900 flex items-center bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors"
                        >
                          <TestTube className="h-4 w-4 mr-1" />
                          Lấy mẫu
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Sample Collection Modal */}
      <SampleCollectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        booking={selectedBooking}
        onSubmit={handleSampleCollection}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default StaffSampleCollection;
