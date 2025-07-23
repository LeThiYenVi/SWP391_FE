import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Calendar, FileText, Save } from 'lucide-react';
import BookingService from '../../services/BookingService';

const TestResultForm = ({ booking, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    result: '',
    resultType: 'Bình thường',
    notes: '',
    resultDate: new Date().toISOString().slice(0, 16) // Format for datetime-local input
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const resultTypes = [
    { value: 'Bình thường', label: 'Bình thường', color: 'text-green-600 bg-green-100' },
    { value: 'Bất thường', label: 'Bất thường', color: 'text-red-600 bg-red-100' },
    { value: 'Chờ kết quả', label: 'Chờ kết quả', color: 'text-yellow-600 bg-yellow-100' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.result.trim()) {
      newErrors.result = 'Vui lòng nhập kết quả xét nghiệm';
    }
    
    if (!formData.resultDate) {
      newErrors.resultDate = 'Vui lòng chọn ngày trả kết quả';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const resultData = {
        result: formData.result.trim(),
        resultType: formData.resultType,
        notes: formData.notes.trim(),
        resultDate: new Date(formData.resultDate).toISOString()
      };

      const response = await BookingService.updateTestResult(booking.bookingId, resultData);

      if (response.success) {
        alert('✅ Đã cập nhật kết quả xét nghiệm thành công!');
        onSuccess?.(response.data);
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error updating test result:', error);
      alert(`❌ Lỗi khi cập nhật kết quả: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getResultTypeIcon = (type) => {
    switch (type) {
      case 'Bình thường': return <CheckCircle className="h-4 w-4" />;
      case 'Bất thường': return <XCircle className="h-4 w-4" />;
      case 'Chờ kết quả': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Cập nhật kết quả xét nghiệm
        </h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">
                Booking #{booking.bookingId} - {booking.customerName}
              </p>
              <p className="text-sm text-blue-700">
                Dịch vụ: {booking.serviceName}
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                booking.status === 'TESTING' ? 'bg-purple-100 text-purple-800' :
                booking.status === 'SAMPLE_COLLECTED' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {booking.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Result Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Kết quả xét nghiệm <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {resultTypes.map((type) => (
              <label key={type.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="resultType"
                  value={type.value}
                  checked={formData.resultType === type.value}
                  onChange={(e) => handleInputChange('resultType', e.target.value)}
                  className="sr-only"
                />
                <div className={`flex items-center justify-center p-3 border-2 rounded-lg transition-all ${
                  formData.resultType === type.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className={`flex items-center space-x-2 ${
                    formData.resultType === type.value ? 'text-blue-700' : 'text-gray-600'
                  }`}>
                    {getResultTypeIcon(type.value)}
                    <span className="text-sm font-medium">{type.label}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Detailed Result */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chi tiết kết quả <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={formData.result}
            onChange={(e) => handleInputChange('result', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.result ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nhập chi tiết kết quả xét nghiệm..."
          />
          {errors.result && (
            <p className="mt-1 text-sm text-red-600">{errors.result}</p>
          )}
        </div>

        {/* Result Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngày trả kết quả <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="datetime-local"
              value={formData.resultDate}
              onChange={(e) => handleInputChange('resultDate', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.resultDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.resultDate && (
            <p className="mt-1 text-sm text-red-600">{errors.resultDate}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú thêm
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ghi chú thêm từ bác sĩ/kỹ thuật viên (tùy chọn)..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Đang cập nhật...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Cập nhật kết quả
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestResultForm;
