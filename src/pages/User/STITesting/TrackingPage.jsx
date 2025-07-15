import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingTrackingService from '../../../services/BookingTrackingService';
import { Loader, CheckCircle, XCircle, Clock, FlaskConical, Check, AlertTriangle } from 'lucide-react';

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
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    BookingTrackingService.connect(() => {
      setConnected(true);
      BookingTrackingService.subscribeBooking(bookingId, (update) => {
        setStatus(update);
      });
    });
    return () => {
      BookingTrackingService.unsubscribeBooking(bookingId);
      BookingTrackingService.disconnect();
      setConnected(false);
    };
  }, [bookingId]);

  const currentStep = status ? statusToStepIndex(status.status) : 0;
  const isCancelled = status && status.status === 'CANCELLED';

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-8 bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 mx-auto mt-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition"
        >
          ← Quay lại
        </button>
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-2">
          Tracking trạng thái Booking #{bookingId}
        </h2>
        <div className="mb-8 text-center text-gray-500 text-sm">
          Theo dõi tiến trình xét nghiệm của bạn realtime. Trang này sẽ tự động cập nhật khi có thay đổi.
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