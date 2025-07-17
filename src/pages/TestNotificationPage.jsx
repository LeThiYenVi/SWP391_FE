import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../context/WebSocketContext';
import { Bell, Wifi, WifiOff, ExternalLink, RefreshCw } from 'lucide-react';

const TestNotificationPage = () => {
  const navigate = useNavigate();
  const { connected, notifications, sendMessage } = useWebSocket();
  const [testBookingId, setTestBookingId] = useState('15');
  const [testStatus, setTestStatus] = useState('SAMPLE_COLLECTED');
  const [testMessage, setTestMessage] = useState('Đã lấy mẫu xét nghiệm thành công');

  const statusOptions = [
    { value: 'PENDING', label: 'Chờ xác nhận', message: 'Booking đang chờ xác nhận từ nhân viên' },
    { value: 'SAMPLE_COLLECTED', label: 'Đã lấy mẫu', message: 'Đã lấy mẫu xét nghiệm thành công' },
    { value: 'TESTING', label: 'Đang xét nghiệm', message: 'Mẫu đang được xét nghiệm trong phòng lab' },
    { value: 'COMPLETED', label: 'Hoàn thành', message: 'Xét nghiệm hoàn thành, kết quả đã sẵn sàng' },
    { value: 'CANCELLED', label: 'Đã hủy', message: 'Booking đã bị hủy' }
  ];

  const handleStatusChange = (status) => {
    setTestStatus(status);
    const option = statusOptions.find(opt => opt.value === status);
    if (option) {
      setTestMessage(option.message);
    }
  };

  const sendTestNotification = () => {
    if (!connected) {
      alert('WebSocket chưa kết nối!');
      return;
    }

    const testUpdate = {
      bookingId: parseInt(testBookingId),
      status: testStatus,
      message: testMessage,
      timestamp: new Date().toISOString(),
      customerName: 'Nguyễn Test User',
      serviceName: 'Xét nghiệm HIV Test',
      updatedBy: 'Staff Test'
    };

    try {
      sendMessage('/app/booking-status-update', testUpdate);
      alert('✅ Đã gửi test notification!');
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert('❌ Lỗi khi gửi notification!');
    }
  };

  const openTrackingPage = () => {
    const url = `/user/sti-testing/tracking/${testBookingId}`;
    window.open(url, '_blank');
  };

  const openAdminTestPage = () => {
    navigate('/admin/booking-status-test');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧪 Test Real-time Notifications
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trang test để kiểm tra tính năng thông báo real-time khi staff cập nhật trạng thái booking.
            User sẽ nhận được thông báo và có nút reload để cập nhật thông tin.
          </p>
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {connected ? (
                <>
                  <Wifi className="h-6 w-6 text-green-500 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-700">WebSocket Connected</h3>
                    <p className="text-sm text-green-600">Sẵn sàng nhận thông báo real-time</p>
                  </div>
                </>
              ) : (
                <>
                  <WifiOff className="h-6 w-6 text-red-500 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-700">WebSocket Disconnected</h3>
                    <p className="text-sm text-red-600">Không thể nhận thông báo real-time</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-lg">
                <Bell className="h-4 w-4 mr-2" />
                {notifications.length} thông báo
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              🎮 Test Controls
            </h2>

            <div className="space-y-4">
              {/* Booking ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking ID:
                </label>
                <input
                  type="number"
                  value={testBookingId}
                  onChange={(e) => setTestBookingId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập booking ID"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái mới:
                </label>
                <select
                  value={testStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thông báo:
                </label>
                <textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập nội dung thông báo"
                />
              </div>

              {/* Send Button */}
              <button
                onClick={sendTestNotification}
                disabled={!connected}
                className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                  connected
                    ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <Bell className="h-4 w-4 mr-2" />
                Gửi Test Notification
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              🚀 Quick Actions
            </h2>

            <div className="space-y-4">
              <button
                onClick={openTrackingPage}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Mở Tracking Page (Tab mới)
              </button>

              <button
                onClick={openAdminTestPage}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Admin Test Page
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h4 className="text-sm font-semibold text-yellow-800 mb-2">
                📋 Hướng dẫn test:
              </h4>
              <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                <li>Mở Tracking Page trong tab mới</li>
                <li>Chọn trạng thái và nhập thông báo</li>
                <li>Nhấn "Gửi Test Notification"</li>
                <li>Kiểm tra thông báo xuất hiện trên Tracking Page</li>
                <li>Test nút "Tải lại" trên thông báo</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📨 Recent Notifications ({notifications.length})
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {notifications.slice(0, 5).map((notification, index) => (
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
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                    notification.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    notification.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    notification.status === 'TESTING' ? 'bg-purple-100 text-purple-800' :
                    notification.status === 'SAMPLE_COLLECTED' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {notification.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestNotificationPage;
