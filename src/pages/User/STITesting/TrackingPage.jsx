import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBookingTracking } from '../../../hooks/useBookingTracking';
import { Loader, CheckCircle, XCircle, Clock, FlaskConical, Check, AlertTriangle, RefreshCw } from 'lucide-react';
import bookingService from '../../../services/BookingService';
import StatusUpdateNotification from '../../../components/StatusUpdateNotification';

const steps = [
  {
    key: 'PENDING',
    label: 'Chờ xác nhận',
    icon: <Clock size={28} />,
    color: '#fbbf24',
  },
  {
    key: 'SAMPLE_COLLECTED',
    label: 'Đã lấy mẫu',
    icon: <FlaskConical size={28} />,
    color: '#3b82f6',
  },
  {
    key: 'TESTING',
    label: 'Đang xét nghiệm',
    icon: <Loader size={28} className="animate-spin" />,
    color: '#6366f1',
  },
  {
    key: 'COMPLETED',
    label: 'Hoàn thành',
    icon: <CheckCircle size={28} />, 
    color: '#22c55e',
  },
  {
    key: 'CANCELLED',
    label: 'Đã huỷ',
    icon: <XCircle size={28} />, 
    color: '#ef4444',
    isCancel: true,
  },
];

const statusToStepIndex = status => {
  switch (status) {
    case 'PENDING': return 0;
    case 'SAMPLE_COLLECTED': return 1;
    case 'TESTING': return 2;
    case 'COMPLETED': return 3;
    case 'CANCELLED': return 4;
    default: return 0;
  }
};

const TrackingPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const { connected, subscribeToBooking, unsubscribeFromBooking } = useBookingTracking();


  // Fetch booking data
  const fetchBookingData = useCallback(async () => {
    if (!bookingId) return;

    setLoading(true);
    try {
      const result = await bookingService.getBookingById(bookingId);
      if (result.success) {
        setBookingData(result.data);
        setStatus({
          status: result.data.status,
          message: getStatusMessage(result.data.status),
          timestamp: result.data.updatedAt || result.data.createdAt,
          updatedBy: 'System'
        });
      }
    } catch (error) {
      console.error('Error fetching booking data:', error);
    } finally {
      setLoading(false);
    }
  }, [bookingId, bookingService]);

  // Get status message
  const getStatusMessage = (status) => {
    switch (status) {
      case 'PENDING': return 'Booking đang chờ xác nhận từ nhân viên';
      case 'SAMPLE_COLLECTED': return 'Đã lấy mẫu xét nghiệm thành công';
      case 'TESTING': return 'Mẫu đang được xét nghiệm';
      case 'COMPLETED': return 'Xét nghiệm hoàn thành, kết quả đã sẵn sàng';
      case 'CANCELLED': return 'Booking đã bị hủy';
      default: return 'Trạng thái không xác định';
    }
  };

  // Show notification when status changes
  const showStatusNotification = (update) => {
    const message = `Trạng thái booking đã được cập nhật thành: ${steps.find(s => s.key === update.status)?.label || update.status}`;
    setNotification({
      message,
      status: update.status,
      timestamp: new Date(),
      canReload: true
    });
    setShowNotification(true);

    // Auto hide after 10 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 10000);
  };

  // Handle reload booking data
  const handleReloadData = () => {
    setShowNotification(false);
    fetchBookingData();
  };

  // Initial data fetch
  useEffect(() => {
    fetchBookingData();
  }, [fetchBookingData]);

  useEffect(() => {
    if (!bookingId || !connected) return;

    const subscription = subscribeToBooking(bookingId, (update) => {
      console.log('Received booking update:', update);

      // Update status
      setStatus(prevStatus => {
        // Only show notification if status actually changed
        if (!prevStatus || prevStatus.status !== update.status) {
          showStatusNotification(update);
        }
        return update;
      });
    });

    return () => {
      if (subscription) {
        unsubscribeFromBooking(bookingId);
      }
    };
  }, [bookingId, connected, subscribeToBooking, unsubscribeFromBooking]);

  const currentStep = status ? statusToStepIndex(status.status) : 0;
  const isCancelled = status && status.status === 'CANCELLED';

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-8 bg-gray-50">
      {/* Status Change Notification */}
      <StatusUpdateNotification
        notification={notification}
        show={showNotification}
        onReload={handleReloadData}
        onClose={() => setShowNotification(false)}
      />

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 mx-auto mt-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition"
        >
          ← Quay lại
        </button>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-900">
            Tracking trạng thái Booking #{bookingId}
          </h2>
          <button
            onClick={handleReloadData}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Đang tải...' : 'Tải lại'}
          </button>
        </div>

        <div className="mb-8 text-center text-gray-500 text-sm">
          Theo dõi tiến trình xét nghiệm của bạn realtime. Trang này sẽ tự động cập nhật khi có thay đổi.
          {bookingData && (
            <div className="mt-2 text-xs">
              <span className="font-medium">Dịch vụ:</span> {bookingData.serviceName} |
              <span className="font-medium"> Ngày tạo:</span> {new Date(bookingData.createdAt).toLocaleString('vi-VN')}
            </div>
          )}
        </div>
        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {steps.slice(0, isCancelled ? 5 : 4).map((step, idx) => {
            const isActive = idx === currentStep && (!isCancelled || step.isCancel);
            const isCompleted = idx < currentStep && !isCancelled;
            const isFuture = idx > currentStep && !isCancelled;
            return (
              <div key={step.key} className="flex-1 flex flex-col items-center relative">
                <div
                  className={`flex items-center justify-center rounded-full border-2 mb-2 transition-all ${
                    isActive
                      ? 'border-blue-600 bg-blue-50 shadow-lg scale-110'
                      : isCompleted
                      ? 'border-green-500 bg-green-50'
                      : isFuture
                      ? 'border-gray-300 bg-gray-100 opacity-60'
                      : step.isCancel && isActive
                      ? 'border-red-500 bg-red-50'
                      : ''
                  }`}
                  style={{ width: 48, height: 48, borderColor: step.color }}
                >
                  {isCompleted ? <Check size={28} color="#22c55e" /> : step.icon}
                </div>
                <div
                  className={`text-xs font-semibold text-center ${
                    isActive
                      ? 'text-blue-700'
                      : isCompleted
                      ? 'text-green-600'
                      : isFuture
                      ? 'text-gray-400'
                      : step.isCancel && isActive
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }`}
                  style={{ maxWidth: 80 }}
                >
                  {step.label}
                </div>
                {/* Line */}
                {idx < (isCancelled ? 4 : 3) && (
                  <div
                    className={`absolute top-6 left-full h-1 w-10 ${
                      isCompleted
                        ? 'bg-green-400'
                        : isActive
                        ? 'bg-blue-400'
                        : 'bg-gray-200'
                    }`}
                    style={{ zIndex: 0 }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
        {/* Status detail */}
        {connected ? (
          <div className="flex flex-col items-center justify-center py-4">
            {status ? (
              <>
                <div className="text-lg font-bold mb-2">
                  {steps[currentStep]?.label || 'Trạng thái không xác định'}
                </div>
                {status.message && (
                  <div className="text-gray-600 mb-2">{status.message}</div>
                )}
                {status.detail && (
                  <div className="text-gray-500 mb-2">{status.detail}</div>
                )}
                <div className="text-gray-500 mb-2">
                  {status.timestamp && (
                    <>
                      <span className="font-medium">Cập nhật lúc:</span>{' '}
                      {new Date(status.timestamp).toLocaleString('vi-VN')}
                    </>
                  )}
                </div>
                {status.updatedBy && (
                  <div className="text-gray-400 text-sm">Người cập nhật: {status.updatedBy}</div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center">
                <Loader size={32} className="animate-spin mb-2" color="#3b82f6" />
                <div className="text-gray-500">Đang chờ cập nhật trạng thái booking...</div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader size={48} className="animate-spin mb-4" color="#3b82f6" />
            <div className="text-lg font-semibold text-gray-700 mb-2">Đang kết nối tới hệ thống tracking...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage; 