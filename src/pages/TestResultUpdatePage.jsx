import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, TestTube, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import TestResultForm from '../components/staff/TestResultForm';
import { useWebSocket } from '../context/WebSocketContext';

const TestResultUpdatePage = () => {
  const navigate = useNavigate();
  const { connected, notifications } = useWebSocket();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResultForm, setShowResultForm] = useState(false);

  // Mock data for testing
  const mockBookings = [
    {
      bookingId: 15,
      customerName: 'Nguyễn Văn A',
      serviceName: 'Xét nghiệm HIV',
      status: 'TESTING',
      createdAt: '2024-01-15T10:30:00',
      updatedAt: '2024-01-15T10:30:00',
      sampleCollectionDate: '2024-01-15T11:00:00'
    },
    {
      bookingId: 16,
      customerName: 'Trần Thị B',
      serviceName: 'Xét nghiệm Syphilis',
      status: 'SAMPLE_COLLECTED',
      createdAt: '2024-01-15T09:15:00',
      updatedAt: '2024-01-15T11:20:00',
      sampleCollectionDate: '2024-01-15T12:00:00'
    },
    {
      bookingId: 17,
      customerName: 'Lê Văn C',
      serviceName: 'Xét nghiệm Gonorrhea',
      status: 'TESTING',
      createdAt: '2024-01-15T08:45:00',
      updatedAt: '2024-01-15T12:10:00',
      sampleCollectionDate: '2024-01-15T13:00:00'
    },
    {
      bookingId: 18,
      customerName: 'Phạm Thị D',
      serviceName: 'Xét nghiệm Chlamydia',
      status: 'COMPLETED',
      createdAt: '2024-01-14T08:45:00',
      updatedAt: '2024-01-15T14:10:00',
      result: 'Kết quả âm tính',
      resultDate: '2024-01-15T14:00:00'
    }
  ];

  useEffect(() => {
    setBookings(mockBookings);
  }, []);

  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking);
    setShowResultForm(true);
  };

  const handleResultSuccess = (updatedBooking) => {
    // Update local state
    const updatedBookings = bookings.map(booking => 
      booking.bookingId === updatedBooking.bookingId 
        ? { ...booking, ...updatedBooking, status: 'COMPLETED' }
        : booking
    );
    
    setBookings(updatedBookings);
    setShowResultForm(false);
    setSelectedBooking(null);
    
    console.log('Result updated successfully:', updatedBooking);
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

  const canUpdateResult = (status) => {
    return status === 'TESTING' || status === 'SAMPLE_COLLECTED';
  };

  const filteredBookings = bookings.filter(booking =>
    booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.bookingId.toString().includes(searchTerm)
  );

  const testableBookings = filteredBookings.filter(booking => canUpdateResult(booking.status));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🧪 Test Result Update API
              </h1>
              <p className="mt-2 text-gray-600">
                Trang test API cập nhật kết quả xét nghiệm và chuyển trạng thái sang COMPLETED
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
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bookings List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Bookings cần cập nhật kết quả ({testableBookings.length})
                </h2>
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
              {testableBookings.map((booking) => (
                <div
                  key={booking.bookingId}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedBooking?.bookingId === booking.bookingId ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => handleSelectBooking(booking)}
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
                        <TestTube className="inline h-3 w-3 mr-1" />
                        {booking.customerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.serviceName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Lấy mẫu: {booking.sampleCollectionDate ? 
                          new Date(booking.sampleCollectionDate).toLocaleString('vi-VN') : 
                          'Chưa có thông tin'
                        }
                      </p>
                    </div>
                    <Eye className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
              
              {testableBookings.length === 0 && (
                <div className="p-8 text-center">
                  <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Không có booking nào cần cập nhật kết quả</p>
                </div>
              )}
            </div>
          </div>

          {/* Result Form */}
          <div>
            {showResultForm && selectedBooking ? (
              <TestResultForm
                booking={selectedBooking}
                onSuccess={handleResultSuccess}
                onCancel={() => {
                  setShowResultForm(false);
                  setSelectedBooking(null);
                }}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chọn một booking
                </h3>
                <p className="text-gray-600">
                  Chọn một booking từ danh sách bên trái để cập nhật kết quả xét nghiệm
                </p>
              </div>
            )}
          </div>
        </div>

        {/* API Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📋 API Information:
          </h3>
          <div className="space-y-2 text-blue-800">
            <p><strong>Endpoint:</strong> <code className="bg-blue-100 px-2 py-1 rounded">PATCH /api/bookings/{`{bookingId}`}/test-result</code></p>
            <p><strong>Request Body:</strong></p>
            <pre className="bg-blue-100 p-3 rounded text-sm overflow-x-auto">
{`{
  "result": "Chi tiết kết quả xét nghiệm",
  "resultType": "Bình thường|Bất thường|Chờ kết quả",
  "notes": "Ghi chú thêm từ bác sĩ",
  "resultDate": "2024-01-15T14:30:00"
}`}
            </pre>
            <p><strong>Tính năng:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Tự động chuyển trạng thái booking sang COMPLETED</li>
              <li>Gửi thông báo real-time cho customer</li>
              <li>Cập nhật resultDate có thể tùy chọn</li>
              <li>Lưu notes vào description của booking</li>
              <li>Validate trạng thái booking trước khi cập nhật</li>
            </ul>
          </div>
        </div>

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📨 Recent Notifications ({notifications.length})
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {notifications.slice(0, 3).map((notification, index) => (
                <div key={notification.id || index} className="p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      Booking #{notification.bookingId}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.timestamp).toLocaleTimeString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestResultUpdatePage;
