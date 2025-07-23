import React from 'react';
import { Bell, RefreshCw, XCircle, CheckCircle, Clock, FlaskConical, AlertTriangle } from 'lucide-react';

const StatusUpdateNotification = ({ 
  notification, 
  onReload, 
  onClose, 
  show 
}) => {
  if (!show || !notification) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'SAMPLE_COLLECTED':
        return <FlaskConical className="h-5 w-5 text-blue-500" />;
      case 'TESTING':
        return <RefreshCw className="h-5 w-5 text-purple-500 animate-spin" />;
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'border-yellow-500 bg-yellow-50';
      case 'SAMPLE_COLLECTED': return 'border-blue-500 bg-blue-50';
      case 'TESTING': return 'border-purple-500 bg-purple-50';
      case 'COMPLETED': return 'border-green-500 bg-green-50';
      case 'CANCELLED': return 'border-red-500 bg-red-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md ${getStatusColor(notification.status)} border-l-4 rounded-lg shadow-lg p-4 transform transition-all duration-300 ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      style={{
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)'
      }}
    >
        <div className="flex items-start">
          <div className="flex-shrink-0 animate-pulse">
            {getStatusIcon(notification.status)}
          </div>
          <div className="ml-3 flex-1">
            <div className="text-sm font-semibold text-gray-900">
              🔔 Cập nhật trạng thái booking
            </div>
            <div className="mt-1 text-sm text-gray-700 font-medium">
              {notification.message}
            </div>
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {notification.timestamp.toLocaleTimeString('vi-VN')}
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex flex-col space-y-1">
            {notification.canReload && (
              <button
                onClick={onReload}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Tải lại
              </button>
            )}
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Progress bar for auto-hide */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-blue-600 h-1 rounded-full transition-all duration-[10000ms] ease-linear"
            style={{
              width: '0%'
            }}
          />
        </div>
      </div>
  );
};

export default StatusUpdateNotification;
