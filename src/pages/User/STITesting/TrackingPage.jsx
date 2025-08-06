import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSimpleWebSocket } from '../../../context/SimpleWebSocketContext';
import { Loader, CheckCircle, XCircle, Clock, FlaskConical, Check, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import bookingService from '../../../services/BookingService';
// ✅ Removed StatusUpdateNotification import - using only toast notifications

const steps = [
  {
    key: 'CONFIRMED',
    label: 'Đã xác nhận',
    icon: <CheckCircle size={28} />,
    color: '#10b981',
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
    case 'PENDING': return -1; // Chưa có step nào active
    case 'CONFIRMED': return 0; // Step "Đã xác nhận" active
    case 'SAMPLE_COLLECTED': return 1; // Step "Đã lấy mẫu" active
    case 'TESTING': return 2; // Step "Đang xét nghiệm" active
    case 'COMPLETED': return 3; // Step "Hoàn thành" active
    case 'CANCELLED': return 4; // Step "Đã hủy" active
    default: return -1;
  }
};

const TrackingPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  // ✅ Removed notification state - using only toast notifications
  const { connected, subscribeToBooking, unsubscribeFromBooking } = useSimpleWebSocket();

  // Get status message - memoized để tránh infinite loop - ĐỊNH NGHĨA TRƯỚC
  const getStatusMessage = useCallback((status) => {
    switch (status) {
      case 'PENDING': return 'Booking đang chờ xác nhận từ nhân viên';
      case 'CONFIRMED': return 'Booking đã được xác nhận, vui lòng đến đúng giờ hẹn';
      case 'SAMPLE_COLLECTED': return 'Đã lấy mẫu xét nghiệm thành công';
      case 'TESTING': return 'Mẫu đang được xét nghiệm';
      case 'COMPLETED': return 'Xét nghiệm hoàn thành, kết quả đã sẵn sàng';
      case 'CANCELLED': return 'Booking đã bị hủy';
      default: return 'Trạng thái không xác định';
    }
  }, []);

  // Fetch booking data
  const fetchBookingData = useCallback(async (forceRefresh = false) => {
    if (!bookingId) return;

    setLoading(true);
    try {
      // ✅ Sửa lỗi URL - không thêm timestamp vào bookingId
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
      console.error('❌ Error fetching booking data:', error);
      // Handle error silently or show user-friendly message
    } finally {
      setLoading(false);
    }
  }, [bookingId, getStatusMessage]); // ✅ Thêm getStatusMessage dependency

  // ✅ Removed showStatusNotification and handleReloadData - using only toast notifications

  // Initial data fetch
  useEffect(() => {
    fetchBookingData();
  }, [fetchBookingData]);

  useEffect(() => {
    if (!bookingId || !connected) {
      return;
    }

    const subscription = subscribeToBooking(bookingId, (update) => {
      console.log('📱 Customer received booking update:', update);

      // ✅ Single clean toast notification
      if (update.status && update.message) {
        // Create status labels mapping
        const statusLabels = {
          'PENDING': 'Chờ xác nhận',
          'CONFIRMED': 'Xác nhận',
          'SAMPLE_COLLECTED': 'Đã lấy mẫu',
          'TESTING': 'Đang xét nghiệm',
          'COMPLETED': 'Hoàn thành',
          'CANCELLED': 'Đã hủy'
        };

        const statusLabel = statusLabels[update.status] || update.status;
        const message = `Trạng thái đã được cập nhật: ${statusLabel}`;

        toast.success(message, {
          toastId: `booking-update-${bookingId}-${update.status}`, // Prevent duplicates
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      // ✅ Update status locally - KHÔNG gọi API để tránh authentication issues
      setStatus(update);

      // ✅ KHÔNG force reload API để tránh authentication conflict
      // Update từ WebSocket đã đủ accurate, không cần gọi API thêm
    });

    return () => {
      if (subscription) {
        unsubscribeFromBooking(bookingId);
      }
    };
  }, [bookingId, connected, subscribeToBooking, unsubscribeFromBooking]); // ✅ Loại bỏ fetchBookingData dependency

  // ✅ XÓA useEffect này vì nó gây infinite loop và duplicate với WebSocket subscription ở trên
  // WebSocket subscription ở useEffect trước đã handle việc nhận notification rồi

  // Calculate current step - the current status step should be active, previous steps completed
  const getStepStatus = (status) => {
    if (!status) return { currentStep: -1, completedSteps: [] };

    const statusIndex = statusToStepIndex(status.status);

    // For PENDING status, no steps are completed
    if (status.status === 'PENDING') {
      return { currentStep: -1, completedSteps: [] };
    }

    // For COMPLETED status, all steps are completed
    if (status.status === 'COMPLETED') {
      return { currentStep: 3, completedSteps: [0, 1, 2, 3] };
    }

    // For other statuses, current step and all previous steps are completed
    const currentStep = statusIndex;
    const completedSteps = [];

    // Include all steps up to and including current step
    for (let i = 0; i <= statusIndex; i++) {
      completedSteps.push(i);
    }

    return { currentStep, completedSteps };
  };

  const { currentStep, completedSteps } = getStepStatus(status);
  const isCancelled = status && status.status === 'CANCELLED';



  return (
    <div className="min-h-screen py-8 bg-gray-50">
      {/* ✅ Removed StatusUpdateNotification component - using only toast notifications */}

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 mx-auto mt-8 mb-8">
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
            onClick={fetchBookingData}
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
        {/* Stepper - Layout cải tiến với alignment cố định */}
        <div className="mb-8 px-4">
          {/* Container cho circles và lines */}
          <div className="flex items-center justify-center mb-4">
            {steps.slice(0, isCancelled ? 5 : 4).map((step, idx) => {
              const isCompleted = completedSteps.includes(idx) && !isCancelled;
              const isActive = idx === currentStep && (!isCancelled || step.isCancel) && !isCompleted;
              const isFuture = idx > currentStep && !isCancelled;
              const isLastStep = idx === (isCancelled ? 4 : 3);

              return (
                <React.Fragment key={step.key}>
                  {/* Step Circle - cố định alignment */}
                  <div className="flex items-center justify-center">
                    <div
                      className={`flex items-center justify-center rounded-full border-2 transition-all ${
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
                  </div>

                  {/* Connector Line - cùng level với circles */}
                  {!isLastStep && (
                    <div className="flex-1 flex items-center justify-center mx-4">
                      <div
                        className={`h-1 w-full ${
                          completedSteps.includes(idx)
                            ? 'bg-green-400'
                            : idx === currentStep
                            ? 'bg-blue-400'
                            : 'bg-gray-200'
                        }`}
                        style={{ minWidth: '60px' }}
                      ></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Container cho labels - tách riêng để không ảnh hưởng alignment */}
          <div className="flex items-start justify-center">
            {steps.slice(0, isCancelled ? 5 : 4).map((step, idx) => {
              const isCompleted = completedSteps.includes(idx) && !isCancelled;
              const isActive = idx === currentStep && (!isCancelled || step.isCancel) && !isCompleted;
              const isFuture = idx > currentStep && !isCancelled;
              const isLastStep = idx === (isCancelled ? 4 : 3);

              return (
                <React.Fragment key={`label-${step.key}`}>
                  {/* Step Label - cố định width để đều nhau */}
                  <div className="flex justify-center" style={{ width: 48 }}>
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
                      style={{ maxWidth: 80, minHeight: 32 }}
                    >
                      {step.label}
                    </div>
                  </div>

                  {/* Spacer cho labels - tương ứng với connector lines */}
                  {!isLastStep && (
                    <div className="flex-1 mx-4" style={{ minWidth: '60px' }}>
                      {/* Empty spacer */}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
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
          <div className="flex flex-col items-center py-8">
            <Loader size={48} className="animate-spin mb-4" color="#3b82f6" />
            <div className="text-lg font-semibold text-gray-700 mb-2">Đang kết nối tới hệ thống tracking...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage; 