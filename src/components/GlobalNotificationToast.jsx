import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, FlaskConical, AlertTriangle, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GlobalNotificationToast = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const navigate = useNavigate();

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      setProgress(100);
      
      // Auto hide after 8 seconds
      const hideTimer = setTimeout(() => {
        handleClose();
      }, 8000);

      // Progress bar animation
      const progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(progressTimer);
            return 0;
          }
          return prev - (100 / 80); // 8 seconds = 80 intervals of 100ms
        });
      }, 100);

      return () => {
        clearTimeout(hideTimer);
        clearInterval(progressTimer);
      };
    }
  }, [notification]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  const handleViewBooking = () => {
    if (notification?.bookingId) {
      navigate(`/user/sti-testing/tracking/${notification.bookingId}`);
      handleClose();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'SAMPLE_COLLECTED':
        return <FlaskConical className="h-5 w-5 text-blue-500" />;
      case 'TESTING':
        return <div className="animate-spin"><FlaskConical className="h-5 w-5 text-purple-500" /></div>;
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'border-yellow-400 bg-yellow-50';
      case 'SAMPLE_COLLECTED': return 'border-blue-400 bg-blue-50';
      case 'TESTING': return 'border-purple-400 bg-purple-50';
      case 'COMPLETED': return 'border-green-400 bg-green-50';
      case 'CANCELLED': return 'border-red-400 bg-red-50';
      default: return 'border-blue-400 bg-blue-50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'SAMPLE_COLLECTED': return 'Đã lấy mẫu';
      case 'TESTING': return 'Đang xét nghiệm';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  if (!notification) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 ${getStatusColor(notification.status)} border-l-4 rounded-lg shadow-lg transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
      style={{
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getStatusIcon(notification.status)}
            </div>
            <div className="ml-3 flex-1">
              <div className="text-sm font-semibold text-gray-900 flex items-center">
                Booking #{notification.bookingId}
                <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                  notification.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  notification.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  notification.status === 'TESTING' ? 'bg-purple-100 text-purple-800' :
                  notification.status === 'SAMPLE_COLLECTED' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {getStatusText(notification.status)}
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-700">
                {notification.message}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {new Date(notification.timestamp).toLocaleString('vi-VN')}
              </div>
            </div>
            <div className="ml-4 flex-shrink-0 flex flex-col space-y-1">
              <button
                onClick={handleViewBooking}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
                title="Xem chi tiết booking"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Xem
              </button>
              <button
                onClick={handleClose}
                className="inline-flex items-center justify-center w-5 h-5 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-blue-600 h-1 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
  );
};

export default GlobalNotificationToast;
