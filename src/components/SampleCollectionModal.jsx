import React, { useState, useEffect } from 'react';
import { X, TestTube, CheckCircle, FileText } from 'lucide-react';

const SampleCollectionModal = ({ 
  isOpen, 
  onClose, 
  booking, 
  onSubmit,
  isUpdating = false 
}) => {
  const [sampleCollectionDate, setSampleCollectionDate] = useState('');
  const [resultDeliveryDate, setResultDeliveryDate] = useState('');
  const [sampleNotes, setSampleNotes] = useState('');

  useEffect(() => {
    if (isOpen && booking) {
      // Set current time as default for sample collection
      const now = new Date();
      const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setSampleCollectionDate(localDateTime);

      // Set delivery date 3 days from now as default
      const deliveryDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      const localDeliveryDateTime = new Date(deliveryDate.getTime() - deliveryDate.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setResultDeliveryDate(localDeliveryDateTime);

      // If updating, load existing data
      if (isUpdating && booking.sampleCollectionDate) {
        setSampleCollectionDate(booking.sampleCollectionDate);
        setResultDeliveryDate(booking.resultDeliveryDate || '');
        setSampleNotes(booking.sampleNotes || '');
      } else {
        setSampleNotes('');
      }
    }
  }, [isOpen, booking, isUpdating]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmit = () => {
    if (!sampleCollectionDate) {
      alert('Vui lòng nhập thời gian lấy mẫu');
      return;
    }

    if (!sampleNotes || sampleNotes.trim() === '') {
      alert('Vui lòng nhập ghi chú về quá trình lấy mẫu');
      return;
    }

    onSubmit({
      bookingId: booking.bookingId || booking.id,
      sampleCollectionDate,
      resultDeliveryDate,
      sampleNotes
    });
  };

  const handleClose = () => {
    setSampleCollectionDate('');
    setResultDeliveryDate('');
    setSampleNotes('');
    onClose();
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {isUpdating ? 'Cập nhật thông tin mẫu' : 'Lấy mẫu xét nghiệm'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Thông tin khách hàng */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Thông tin khách hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Khách hàng:</span> {booking.customerFullName}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Dịch vụ:</span> {booking.serviceName}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Ngày hẹn:</span> {formatDate(booking.appointmentDate)}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">ID Booking:</span> #{booking.bookingId || booking.id}
              </p>
            </div>
          </div>

          {/* Form lấy mẫu */}
          <div className={`${isUpdating ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-200'} p-4 rounded-lg border`}>
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              {isUpdating ? (
                <FileText className="h-5 w-5 mr-2 text-orange-600" />
              ) : (
                <TestTube className="h-5 w-5 mr-2 text-yellow-600" />
              )}
              {isUpdating ? 'Cập nhật thông tin mẫu đã lấy' : 'Thực hiện lấy mẫu'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian lấy mẫu <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  className={`w-full border border-gray-300 rounded-lg p-3 focus:ring-2 ${
                    isUpdating 
                      ? 'focus:ring-orange-500 focus:border-orange-500' 
                      : 'focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  value={sampleCollectionDate}
                  onChange={(e) => setSampleCollectionDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dự kiến trả kết quả
                </label>
                <input
                  type="datetime-local"
                  className={`w-full border border-gray-300 rounded-lg p-3 focus:ring-2 ${
                    isUpdating 
                      ? 'focus:ring-orange-500 focus:border-orange-500' 
                      : 'focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  value={resultDeliveryDate}
                  onChange={(e) => setResultDeliveryDate(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú {isUpdating ? 'về mẫu' : 'lấy mẫu'}
              </label>
              <textarea
                rows="3"
                className={`w-full border border-gray-300 rounded-lg p-3 focus:ring-2 ${
                  isUpdating 
                    ? 'focus:ring-orange-500 focus:border-orange-500' 
                    : 'focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder={`Nhập ghi chú về ${isUpdating ? 'mẫu xét nghiệm' : 'quá trình lấy mẫu'}...`}
                value={sampleNotes}
                onChange={(e) => setSampleNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleSubmit}
            className={`flex-1 text-white py-3 px-6 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium flex items-center justify-center ${
              isUpdating 
                ? 'bg-orange-600 focus:ring-orange-500' 
                : 'bg-blue-600 focus:ring-blue-500'
            }`}
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            {isUpdating ? 'Cập nhật thông tin' : 'Xác nhận lấy mẫu'}
          </button>
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-medium"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default SampleCollectionModal;
