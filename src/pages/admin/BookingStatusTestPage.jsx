import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingStatusUpdater from '../../components/admin/BookingStatusUpdater';
import { useWebSocket } from '../../context/WebSocketContext';
import { Search, Eye, Bell, Users } from 'lucide-react';

const BookingStatusTestPage = () => {
  const navigate = useNavigate();
  const { connected, notifications } = useWebSocket();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for testing
  const mockBookings = [
    {
      bookingId: 15,
      customerName: 'Nguyễn Văn A',
      serviceName: 'Xét nghiệm HIV',
      status: 'PENDING',
      createdAt: '2024-01-15T10:30:00',
      updatedAt: '2024-01-15T10:30:00'
    },
    {
      bookingId: 16,
      customerName: 'Trần Thị B',
      serviceName: 'Xét nghiệm Syphilis',
      status: 'SAMPLE_COLLECTED',
      createdAt: '2024-01-15T09:15:00',
      updatedAt: '2024-01-15T11:20:00'
    },
    {
      bookingId: 17,
      customerName: 'Lê Văn C',
      serviceName: 'Xét nghiệm Gonorrhea',
      status: 'TESTING',
      createdAt: '2024-01-15T08:45:00',
      updatedAt: '2024-01-15T12:10:00'
    }
  ];

  useEffect(() => {
    // Load mock data
    setBookings(mockBookings);
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // In real app, this would be an API call
      // const response = await fetch('/api/bookings/all');
      // const data = await response.json();
      // setBookings(data);
      
      // For now, use mock data
      setTimeout(() => {
        setBookings(mockBookings);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = (bookingId, newStatus, result) => {
    // Update local state
    setBookings(prev => prev.map(booking => 
      booking.bookingId === bookingId 
        ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() }
        : booking
    ));
    
    console.log(`Booking ${bookingId} updated to ${newStatus}:`, result);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SAMPLE_COLLECTED': return 'bg-blue-100 text-blue-800';
      case 'TESTING': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Chờ xác nhận';
      case 'SAMPLE_COLLECTED': return 'Đã lấy mẫu';
      case 'TESTING': return 'Đang xét nghiệm';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const filteredBookings = bookings.filter(booking =>
    booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.bookingId.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🧪 Test Booking Status Updates
              </h1>
              <p className="mt-2 text-gray-600">
                Trang test để staff cập nhật trạng thái booking và kiểm tra thông báo real-time
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center px-3 py-2 rounded-lg ${
                connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  connected ? 'bg-green-500' : 'bg-red-500'
                }`} />
                {connected ? 'WebSocket Connected' : 'WebSocket Disconnected'}
              </div>
              <div className="flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-lg">
                <Bell className="h-4 w-4 mr-2" />
                {notifications.length} thông báo
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bookings List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Danh sách Bookings
                </h2>
                <button
                  onClick={fetchBookings}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Đang tải...' : 'Tải lại'}
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm booking..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.bookingId}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedBooking?.bookingId === booking.bookingId ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">
                          #{booking.bookingId}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        <Users className="inline h-3 w-3 mr-1" />
                        {booking.customerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.serviceName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Cập nhật: {new Date(booking.updatedAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <Eye className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Updater */}
          <div>
            {selectedBooking ? (
              <BookingStatusUpdater
                bookingId={selectedBooking.bookingId}
                currentStatus={selectedBooking.status}
                onStatusUpdate={(newStatus, result) => 
                  handleStatusUpdate(selectedBooking.bookingId, newStatus, result)
                }
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chọn một booking
                </h3>
                <p className="text-gray-600">
                  Chọn một booking từ danh sách bên trái để cập nhật trạng thái
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📋 Hướng dẫn test:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Mở trang tracking trong tab khác: <code className="bg-blue-100 px-2 py-1 rounded">/user/sti-testing/tracking/15</code></li>
            <li>Chọn một booking từ danh sách bên trái</li>
            <li>Thay đổi trạng thái và nhấn "Cập nhật trạng thái"</li>
            <li>Kiểm tra thông báo real-time xuất hiện trên trang tracking</li>
            <li>Nhấn nút "Tải lại" trên thông báo để refresh dữ liệu</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default BookingStatusTestPage;
