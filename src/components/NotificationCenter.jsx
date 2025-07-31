import React, { useState, useEffect } from 'react';
import { MessageCircle, FileText, Heart, HelpCircle, Check, X } from 'lucide-react';
import DashboardService from '../services/DashboardService';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await DashboardService.getNotifications();
      setNotifications(data);
    } catch (error) {
      // Silent error handling
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await DashboardService.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    } catch (error) {
      // Silent error handling
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await DashboardService.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Lỗi khi đánh dấu đã đọc:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'CONSULTATION':
        return <MessageCircle size={20} className="text-blue-500" />;
      case 'TEST_RESULT':
        return <FileText size={20} className="text-green-500" />;
      case 'CYCLE_REMINDER':
        return <Heart size={20} className="text-pink-500" />;
      case 'QUESTION_ANSWERED':
        return <HelpCircle size={20} className="text-purple-500" />;
      default:
        return <MessageCircle size={20} className="text-gray-500" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notif.isRead;
    if (activeTab === 'important') return notif.type === 'CONSULTATION' || notif.type === 'TEST_RESULT';
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Trung tâm thông báo
        </h1>
        <p className="text-gray-600">
          Theo dõi tất cả thông báo và cập nhật quan trọng
        </p>
      </div>

      {/* Tabs and Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'unread'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Chưa đọc ({unreadCount})
          </button>
          <button
            onClick={() => setActiveTab('important')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'important'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Quan trọng
          </button>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          <Check size={16} />
          <span>Đánh dấu đã đọc tất cả</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MessageCircle size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500">Không có thông báo nào</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg border p-4 transition-all hover:shadow-md ${
                !notification.isRead ? 'border-l-4 border-l-teal-500 bg-teal-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`text-sm font-semibold ${
                        !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatTime(notification.createdAt)}
                      </span>
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-teal-500 hover:text-teal-700"
                        >
                          <Check size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter; 