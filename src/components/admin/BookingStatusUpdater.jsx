import React, { useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, Clock, FlaskConical, AlertTriangle } from 'lucide-react';
import instance from '../../services/customize-axios';

const BookingStatusUpdater = ({ bookingId, currentStatus, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus || 'PENDING');

  const statusOptions = [
    { value: 'PENDING', label: 'Chờ xác nhận', icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
    { value: 'SAMPLE_COLLECTED', label: 'Đã lấy mẫu', icon: FlaskConical, color: 'text-blue-600 bg-blue-100' },
    { value: 'TESTING', label: 'Đang xét nghiệm', icon: RefreshCw, color: 'text-purple-600 bg-purple-100' },
    { value: 'COMPLETED', label: 'Hoàn thành', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
    { value: 'CANCELLED', label: 'Đã hủy', icon: XCircle, color: 'text-red-600 bg-red-100' }
  ];

  const handleStatusUpdate = async () => {
    if (selectedStatus === currentStatus) {
      alert('Trạng thái không thay đổi!');
      return;
    }

    setLoading(true);
    try {
      // Call API to update status using axios instance
      const response = await instance.patch(`/api/bookings/${bookingId}/status`, {
        status: selectedStatus
      });

      if (response.data) {
        onStatusUpdate?.(selectedStatus, response.data);
        alert(`✅ Đã cập nhật trạng thái thành: ${statusOptions.find(s => s.value === selectedStatus)?.label}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định';
      alert(`❌ Lỗi khi cập nhật trạng thái: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStatusInfo = () => {
    return statusOptions.find(s => s.value === currentStatus) || statusOptions[0];
  };

  const getSelectedStatusInfo = () => {
    return statusOptions.find(s => s.value === selectedStatus) || statusOptions[0];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Cập nhật trạng thái Booking #{bookingId}
      </h3>
      
      {/* Current Status */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Trạng thái hiện tại:
        </label>
        <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getCurrentStatusInfo().color}`}>
          <getCurrentStatusInfo().icon className="h-4 w-4 mr-2" />
          {getCurrentStatusInfo().label}
        </div>
      </div>

      {/* Status Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chọn trạng thái mới:
        </label>
        <div className="space-y-2">
          {statusOptions.map((option) => {
            const Icon = option.icon;
            return (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={selectedStatus === option.value}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="sr-only"
                />
                <div className={`flex items-center px-3 py-2 rounded-lg border-2 transition-all ${
                  selectedStatus === option.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <Icon className={`h-4 w-4 mr-2 ${
                    selectedStatus === option.value ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    selectedStatus === option.value ? 'text-blue-900' : 'text-gray-700'
                  }`}>
                    {option.label}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Update Button */}
      <button
        onClick={handleStatusUpdate}
        disabled={loading || selectedStatus === currentStatus}
        className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
          loading || selectedStatus === currentStatus
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
      >
        {loading ? (
          <>
            <RefreshCw className="animate-spin h-4 w-4 mr-2" />
            Đang cập nhật...
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Cập nhật trạng thái
          </>
        )}
      </button>

      {selectedStatus !== currentStatus && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Bạn đang thay đổi từ <strong>{getCurrentStatusInfo().label}</strong> sang <strong>{getSelectedStatusInfo().label}</strong>
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Khách hàng sẽ nhận được thông báo real-time về thay đổi này.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingStatusUpdater;
