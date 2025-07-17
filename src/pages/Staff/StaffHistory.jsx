import React, { useState, useEffect } from 'react';
import { CheckCircle, TestTube, Search, Calendar, User, FileText } from 'lucide-react';
import { getBookingsByStatusAPI } from '../../services/StaffService';

const StaffHistory = () => {
  const [completedBookings, setCompletedBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);

  useEffect(() => {
    fetchCompletedBookings();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = completedBookings.filter(booking =>
        booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingId?.toString().includes(searchTerm)
      );
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(completedBookings);
    }
  }, [searchTerm, completedBookings]);

  const fetchCompletedBookings = async () => {
    setLoading(true);
    try {
      // Debug: Check if user is authenticated
      const token = localStorage.getItem('authToken');
      console.log('Auth token exists:', !!token);

      const response = await getBookingsByStatusAPI('COMPLETED', 1, 100);
      console.log('API Response:', response);

      if (response && response.content) {
        setCompletedBookings(response.content);
        setFilteredBookings(response.content);
      } else if (response && Array.isArray(response)) {
        setCompletedBookings(response);
        setFilteredBookings(response);
      } else {
        setCompletedBookings([]);
        setFilteredBookings([]);
      }
    } catch (err) {
      console.error('Error fetching completed bookings:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });

      if (err.response?.status === 401) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (err.response?.status === 404) {
        setError('API endpoint không tồn tại. Vui lòng kiểm tra backend.');
      } else if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        setError('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.');

        // Mock data for testing UI when backend is down
        const mockData = [
          {
            bookingId: 1,
            customerName: 'Nguyễn Văn A',
            serviceName: 'Xét nghiệm máu tổng quát',
            appointmentDate: '2024-01-15',
            sampleCollectionDate: '2024-01-15T08:30:00',
            resultDate: '2024-01-16T14:00:00',
            result: 'Kết quả bình thường. Các chỉ số trong giới hạn cho phép.'
          },
          {
            bookingId: 2,
            customerName: 'Trần Thị B',
            serviceName: 'Xét nghiệm nước tiểu',
            appointmentDate: '2024-01-14',
            sampleCollectionDate: '2024-01-14T09:00:00',
            resultDate: '2024-01-15T16:30:00',
            result: 'Phát hiện protein trong nước tiểu. Cần tái khám.'
          }
        ];
        setCompletedBookings(mockData);
        setFilteredBookings(mockData);
        setError('Đang sử dụng dữ liệu mẫu (Backend không khả dụng)');
      } else {
        setError('Không thể tải lịch sử xét nghiệm. Vui lòng thử lại sau.');
        setCompletedBookings([]);
        setFilteredBookings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <TestTube className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Đang tải lịch sử xét nghiệm...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <CheckCircle className="h-8 w-8 mr-3 text-green-600" />
                Lịch sử xét nghiệm
              </h1>
              <p className="text-gray-600 mt-2">
                Xem lại tất cả các xét nghiệm đã hoàn thành
              </p>
            </div>
            <button
              onClick={fetchCompletedBookings}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <TestTube className="h-4 w-4 mr-2" />
              Làm mới
            </button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm theo tên khách hàng, dịch vụ hoặc ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                <span>Tổng: {completedBookings.length} xét nghiệm</span>
              </div>
              <div className="flex items-center">
                <Search className="h-4 w-4 mr-1 text-blue-600" />
                <span>Hiển thị: {filteredBookings.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* History Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Danh sách xét nghiệm hoàn thành
            </h2>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <CheckCircle className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center text-lg mb-2">
                {searchTerm ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có xét nghiệm nào hoàn thành'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          ) : (
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
                      Ngày hẹn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày lấy mẫu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày có kết quả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kết quả
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.bookingId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{booking.bookingId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{booking.customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.serviceName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(booking.appointmentDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.sampleCollectionDate ? (
                          <div>
                            <div>{formatDate(booking.sampleCollectionDate)}</div>
                            <div className="text-xs text-gray-400">
                              {formatTime(booking.sampleCollectionDate)}
                            </div>
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.resultDate ? (
                          <div>
                            <div>{formatDate(booking.resultDate)}</div>
                            <div className="text-xs text-gray-400">
                              {formatTime(booking.resultDate)}
                            </div>
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                        <div className="truncate" title={booking.result}>
                          {booking.result || 'Chưa có kết quả'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffHistory;
