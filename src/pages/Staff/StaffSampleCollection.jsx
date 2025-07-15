import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, TestTube, CheckCircle, AlertCircle } from 'lucide-react';
import { getAllBookingsForStaffAPI, markSampleCollectedAPI } from '../../services/TestingService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const StaffSampleCollection = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('CONFIRMED');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [sampleNotes, setSampleNotes] = useState('');
  const [sampleCollectionDate, setSampleCollectionDate] = useState(
    format(new Date(), 'yyyy-MM-dd\'T\'HH:mm')
  );

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, statusFilter, dateFilter, bookings]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await getAllBookingsForStaffAPI();
      setBookings(response.data || []);
      setFilteredBookings(response.data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Không thể tải danh sách đặt lịch. Vui lòng thử lại sau.');
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
          booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.bookingId?.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
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

  const handleSampleCollection = async () => {
    if (!selectedBooking) return;

    try {
      const trackingData = {
        sampleCollectionDate: sampleCollectionDate,
        notes: sampleNotes
      };

      await markSampleCollectedAPI(selectedBooking.bookingId, trackingData);
      
      // Update local state
      const updatedBookings = bookings.map(booking => 
        booking.bookingId === selectedBooking.bookingId 
          ? { ...booking, status: 'SAMPLE_COLLECTED', sampleCollectionDate, sampleNotes } 
          : booking
      );
      
      setBookings(updatedBookings);
      setSelectedBooking(null);
      setSampleNotes('');
      
      // Show success message
      alert('Đã cập nhật trạng thái lấy mẫu thành công!');
    } catch (err) {
      console.error('Error updating sample collection status:', err);
      alert('Không thể cập nhật trạng thái lấy mẫu. Vui lòng thử lại sau.');
    }
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cập nhật trạng thái lấy mẫu</h1>

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
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="SAMPLE_COLLECTED">Đã lấy mẫu</option>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Không tìm thấy lịch hẹn nào cần lấy mẫu.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-gray-50 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dịch vụ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày hẹn
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr 
                      key={booking.bookingId} 
                      className={`hover:bg-gray-50 ${selectedBooking?.bookingId === booking.bookingId ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{booking.bookingId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.serviceName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(booking.appointmentDate)} {formatTime(booking.appointmentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {booking.status === 'CONFIRMED' ? (
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          >
                            <TestTube className="h-4 w-4 mr-1" />
                            Lấy mẫu
                          </button>
                        ) : (
                          <span className="text-gray-400 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Đã lấy mẫu
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sample Collection Form */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {selectedBooking ? 'Cập nhật trạng thái lấy mẫu' : 'Chọn lịch hẹn để lấy mẫu'}
          </h2>

          {selectedBooking ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Khách hàng:</span> {selectedBooking.customerName}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Dịch vụ:</span> {selectedBooking.serviceName}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Ngày hẹn:</span> {formatDate(selectedBooking.appointmentDate)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian lấy mẫu
                </label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-pink-500 focus:border-pink-500"
                  value={sampleCollectionDate}
                  onChange={(e) => setSampleCollectionDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Nhập ghi chú về mẫu xét nghiệm..."
                  value={sampleNotes}
                  onChange={(e) => setSampleNotes(e.target.value)}
                ></textarea>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleSampleCollection}
                  className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Xác nhận lấy mẫu
                  </div>
                </button>
                <button
                  onClick={() => {
                    setSelectedBooking(null);
                    setSampleNotes('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500 text-center">Vui lòng chọn một lịch hẹn từ danh sách để cập nhật trạng thái lấy mẫu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffSampleCollection;
