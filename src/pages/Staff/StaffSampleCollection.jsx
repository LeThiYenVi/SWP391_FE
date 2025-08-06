import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, TestTube, CheckCircle, AlertCircle, Clock, FileText, X } from 'lucide-react';
import { getBookingsByStatusAPI, markSampleCollectedAPI } from '../../services/StaffService';
import SampleCollectionModal from '../../components/SampleCollectionModal';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import { toast } from 'react-toastify';

const StaffSampleCollection = () => {

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



  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Chỉ lấy bookings có status CONFIRMED để lấy mẫu
      const response = await getBookingsByStatusAPI('CONFIRMED', 1, 100);

      console.log('🔍 Sample Collection API Response:', response);

      if (response && response.data && response.data.content) {
        console.log('✅ Using response.data.content:', response.data.content);
        setBookings(response.data.content);
        setFilteredBookings(response.data.content);
      } else if (response && response.content) {
        console.log('✅ Using response.content:', response.content);
        setBookings(response.content);
        setFilteredBookings(response.content);
      } else if (response && Array.isArray(response)) {
        console.log('✅ Using response array:', response);
        setBookings(response);
        setFilteredBookings(response);
      } else {
        console.log('❌ No valid data found, setting empty arrays');
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

      if (response && response.data && response.data.content) {
        setBookings(response.data.content);
        setFilteredBookings(response.data.content);
      } else if (response && response.content) {
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
        collectorFullName: data.collectorFullName,
        collectorIdCard: data.collectorIdCard,
        collectorPhoneNumber: data.collectorPhoneNumber || null,
        collectorDateOfBirth: data.collectorDateOfBirth || null,
        collectorGender: data.collectorGender || null,
        relationshipToBooker: data.relationshipToBooker,
        sampleCollectionDate: data.sampleCollectionDate,
        notes: data.notes || null
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
        return 'bg-teal-100 text-teal-800';
      case 'TESTING':
        return 'bg-cyan-100 text-cyan-800';
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
        return 'Xác nhận';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <TestTube className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Lấy mẫu xét nghiệm
                  </h1>
                  <p className="text-gray-600 mt-1">Quản lý và thực hiện lấy mẫu xét nghiệm</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Danh sách lịch hẹn đã xác nhận
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {filteredBookings.length} lịch hẹn
                </span>
              </div>
            </div>


          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Bộ lọc tìm kiếm</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm theo tên khách hàng, ID booking..."
                  className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hẹn</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || dateFilter) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter('');
                }}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Danh sách lịch hẹn</h3>
                  <p className="text-sm text-gray-600">Các lịch hẹn đã xác nhận cần lấy mẫu</p>
                </div>
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {filteredBookings.length} lịch hẹn
              </div>
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <TestTube className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lịch hẹn nào</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Hiện tại không có lịch hẹn nào đã xác nhận cần lấy mẫu xét nghiệm.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                      Dịch vụ
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ngày hẹn
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredBookings.map((booking, index) => (
                    <tr
                      key={booking.bookingId}
                      className={`hover:bg-blue-50 transition-all duration-200 cursor-pointer group ${
                        selectedBooking?.bookingId === booking.bookingId ? 'bg-blue-50 ring-2 ring-blue-200' : ''
                      }`}
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-white">#{booking.bookingId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-semibold text-sm">
                              {booking.customerFullName?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{booking.customerFullName}</div>
                            <div className="text-sm text-gray-500 lg:hidden">{booking.serviceName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="text-sm text-gray-900 font-medium">{booking.serviceName}</div>
                        <div className="text-sm text-gray-500">Dịch vụ xét nghiệm</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{formatDate(booking.appointmentDate)}</div>
                        <div className="text-sm text-gray-500">{formatTime(booking.appointmentDate)}</div>
                        <div className="md:hidden mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-current mr-1"></div>
                            {getStatusText(booking.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                          {getStatusText(booking.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCollectSample(booking);
                          }}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group-hover:scale-105"
                        >
                          <TestTube className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Lấy mẫu</span>
                          <span className="sm:hidden">Lấy</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
    </div>
  );
};

export default StaffSampleCollection;
