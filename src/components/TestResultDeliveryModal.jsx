import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { deliverTestResultAPI } from '../services/StaffService';
import { toast } from 'react-toastify';

const TestResultDeliveryModal = ({ isOpen, onClose, booking, onSubmit }) => {
  const [resultDeliveryDate, setResultDeliveryDate] = useState('');
  const [testResult, setTestResult] = useState('');
  const [resultNotes, setResultNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && booking) {
      // Pre-fill with current date/time if new delivery
      if (!booking.resultDate) {
        const now = new Date();
        const localDateTime = format(now, "yyyy-MM-dd'T'HH:mm");
        setResultDeliveryDate(localDateTime);
      } else {
        // If updating existing result
        const existingDate = new Date(booking.resultDate);
        const localDateTime = format(existingDate, "yyyy-MM-dd'T'HH:mm");
        setResultDeliveryDate(localDateTime);
        setTestResult(booking.result || '');
      }
      
      setResultNotes('');
      setErrors({});
    }
  }, [isOpen, booking]);

  const validateForm = () => {
    const newErrors = {};

    if (!resultDeliveryDate) {
      newErrors.resultDeliveryDate = 'Vui lòng chọn ngày trả kết quả';
    } else {
      const selectedDate = new Date(resultDeliveryDate);
      const now = new Date();
      if (selectedDate > now) {
        newErrors.resultDeliveryDate = 'Ngày trả kết quả không thể trong tương lai';
      }
      
      // Check if delivery date is after sample collection date
      if (booking?.sampleCollectionProfile?.sampleCollectionDate) {
        const sampleDate = new Date(booking.sampleCollectionProfile.sampleCollectionDate);
        if (selectedDate < sampleDate) {
          newErrors.resultDeliveryDate = 'Ngày trả kết quả phải sau ngày lấy mẫu';
        }
      }
    }

    if (testResult && testResult.length > 500) {
      newErrors.testResult = 'Kết quả xét nghiệm không được vượt quá 500 ký tự';
    }

    if (resultNotes && resultNotes.length > 1000) {
      newErrors.resultNotes = 'Ghi chú không được vượt quá 1000 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const resultData = {
        resultDeliveryDate: new Date(resultDeliveryDate).toISOString(),
        testResult: testResult.trim() || null,
        resultNotes: resultNotes.trim() || null
      };

      const response = await deliverTestResultAPI(booking.bookingId || booking.id, resultData);
      
      if (response.success) {
        toast.success(response.message || 'Trả kết quả xét nghiệm thành công!');
        onSubmit && onSubmit(resultData);
        handleClose();
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi trả kết quả');
      }
    } catch (error) {
      console.error('Error delivering test result:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi trả kết quả';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setResultDeliveryDate('');
    setTestResult('');
    setResultNotes('');
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      return 'Ngày không hợp lệ';
    }
  };

  if (!isOpen || !booking) return null;

  const isUpdate = booking.status === 'COMPLETED';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isUpdate ? 'Cập nhật kết quả xét nghiệm' : 'Trả kết quả xét nghiệm'}
              </h2>
              <p className="text-sm text-gray-500">
                Booking #{booking.bookingId || booking.id} - {booking.customerFullName}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Booking Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Thông tin booking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Dịch vụ:</span>
                <p className="font-medium">{booking.serviceName}</p>
              </div>
              <div>
                <span className="text-gray-500">Người lấy mẫu:</span>
                <p className="font-medium">
                  {booking.sampleCollectionProfile?.collectorFullName}
                  {booking.sampleCollectionProfile?.relationshipToBooker === 'SELF' ? ' (Chính chủ)' : ''}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Thời gian lấy mẫu:</span>
                <p className="font-medium">
                  {formatDate(booking.sampleCollectionProfile?.sampleCollectionDate)}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Trạng thái:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'COMPLETED' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {booking.status === 'COMPLETED' ? 'Hoàn thành' : 'Đã lấy mẫu'}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Result Delivery Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Ngày trả kết quả *
              </label>
              <input
                type="datetime-local"
                className={`w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.resultDeliveryDate ? 'border-red-300' : 'border-gray-300'
                }`}
                value={resultDeliveryDate}
                onChange={(e) => setResultDeliveryDate(e.target.value)}
                disabled={isSubmitting}
                required
              />
              {errors.resultDeliveryDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.resultDeliveryDate}
                </p>
              )}
            </div>

            {/* Test Result */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Kết quả xét nghiệm
              </label>
              <textarea
                className={`w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
                  errors.testResult ? 'border-red-300' : 'border-gray-300'
                }`}
                rows="4"
                placeholder="Nhập kết quả xét nghiệm (tùy chọn)"
                value={testResult}
                onChange={(e) => setTestResult(e.target.value)}
                disabled={isSubmitting}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.testResult && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.testResult}
                  </p>
                )}
                <p className="text-gray-500 text-sm ml-auto">
                  {testResult.length}/500 ký tự
                </p>
              </div>
            </div>

            {/* Result Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Ghi chú kết quả
              </label>
              <textarea
                className={`w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
                  errors.resultNotes ? 'border-red-300' : 'border-gray-300'
                }`}
                rows="3"
                placeholder="Nhập ghi chú về kết quả (tùy chọn)"
                value={resultNotes}
                onChange={(e) => setResultNotes(e.target.value)}
                disabled={isSubmitting}
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.resultNotes && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.resultNotes}
                  </p>
                )}
                <p className="text-gray-500 text-sm ml-auto">
                  {resultNotes.length}/1000 ký tự
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    {isUpdate ? 'Cập nhật kết quả' : 'Trả kết quả'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestResultDeliveryModal;
