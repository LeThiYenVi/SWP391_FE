import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';
import BookingService from '../../services/BookingService';
import { toast } from 'react-toastify';
import { format, differenceInYears, isAfter, isBefore, subHours, addMinutes } from 'date-fns';
import { vi } from 'date-fns/locale';
import './TestResultForm.css';

const TestResultForm = ({ booking, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    result: '',
    resultType: 'Bình thường',
    notes: '',
    resultDate: new Date().toISOString().slice(0, 16), // Format for datetime-local input
    sampleDate: new Date().toISOString().slice(0, 16), // Thời gian lấy mẫu
    // Thông tin người lấy mẫu (read-only từ sampleCollectionProfile)
    patientInfo: {
      fullName: '',
      age: '',
      dateOfBirth: '',
      gender: '',
      phoneNumber: '',
      address: '',
      idCard: '',
      relationship: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const resultTypes = [
    { value: 'Bình thường', label: 'Bình thường', color: 'text-green-600 bg-green-100' },
    { value: 'Bất thường', label: 'Bất thường', color: 'text-red-600 bg-red-100' },
    { value: 'Chờ kết quả', label: 'Chờ kết quả', color: 'text-yellow-600 bg-yellow-100' }
  ];

  // Tự động điền thông tin từ booking và sampleCollectionProfile
  useEffect(() => {
    if (booking) {
      const calculateAge = (birthDate) => {
        if (!birthDate) return '';
        try {
          return differenceInYears(new Date(), new Date(birthDate));
        } catch {
          return '';
        }
      };

      // Ưu tiên thông tin từ sampleCollectionProfile nếu có
      const sampleProfile = booking.sampleCollectionProfile;

      setFormData(prev => ({
        ...prev,
        // Nếu có sampleCollectionProfile, sử dụng thời gian lấy mẫu từ đó
        sampleDate: sampleProfile?.sampleCollectionDate
          ? new Date(sampleProfile.sampleCollectionDate).toISOString().slice(0, 16)
          : prev.sampleDate,
        patientInfo: {
          fullName: sampleProfile?.collectorFullName || booking.customerFullName || booking.fullName || '',
          age: sampleProfile?.collectorDateOfBirth ? calculateAge(sampleProfile.collectorDateOfBirth) :
               (booking.dateOfBirth ? calculateAge(booking.dateOfBirth) : ''),
          dateOfBirth: sampleProfile?.collectorDateOfBirth ?
                      format(new Date(sampleProfile.collectorDateOfBirth), 'dd/MM/yyyy') :
                      (booking.dateOfBirth ? format(new Date(booking.dateOfBirth), 'dd/MM/yyyy') : ''),
          gender: sampleProfile?.collectorGender === 'MALE' ? 'Nam' :
                  sampleProfile?.collectorGender === 'FEMALE' ? 'Nữ' :
                  sampleProfile?.collectorGender ||
                  (booking.gender === 'MALE' ? 'Nam' : booking.gender === 'FEMALE' ? 'Nữ' : booking.gender || ''),
          phoneNumber: sampleProfile?.collectorPhoneNumber || booking.phoneNumber || booking.customerPhone || '',
          address: booking.address || booking.customerAddress || '',
          idCard: sampleProfile?.collectorIdCard || '',
          relationship: sampleProfile?.relationshipToBooker || ''
        }
      }));
    }
  }, [booking]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      // Handle nested fields like 'patientInfo.fullName'
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

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
    const now = new Date();

    // Validate kết quả xét nghiệm
    if (!formData.result.trim()) {
      newErrors.result = 'Vui lòng nhập kết quả xét nghiệm';
    }

    // Validate thời gian trả kết quả
    if (!formData.resultDate) {
      newErrors.resultDate = 'Vui lòng chọn thời gian dự kiến trả kết quả';
    } else {
      const resultDateTime = new Date(formData.resultDate);
      if (isBefore(resultDateTime, now)) {
        newErrors.resultDate = 'Thời gian trả kết quả phải từ hiện tại trở về tương lai';
      }

      // Kiểm tra thời gian trả kết quả phải sau thời gian lấy mẫu (nếu có)
      if (formData.sampleDate) {
        const sampleDateTime = new Date(formData.sampleDate);
        if (isBefore(resultDateTime, sampleDateTime)) {
          newErrors.resultDate = 'Thời gian trả kết quả phải sau thời gian lấy mẫu';
        }
      }
    }

    // Thông tin lấy mẫu và bệnh nhân đã có từ sampleCollectionProfile, không cần validate

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('🔄 Form submitted');
    console.log('📝 Form data:', formData);

    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    console.log('✅ Form validation passed');

    setLoading(true);
    try {
      const resultData = {
        result: formData.result.trim(),
        resultType: formData.resultType,
        notes: formData.notes.trim(),
        resultDate: new Date(formData.resultDate).toISOString()
      };

      console.log('📤 Sending result data:', resultData);
      console.log('📤 Booking ID:', booking.bookingId);

      const response = await BookingService.updateTestResult(booking.bookingId, resultData);

      if (response.success) {
        toast.success('✅ Đã cập nhật kết quả xét nghiệm thành công!', {
          toastId: `test-result-form-${booking.bookingId}`, // Prevent duplicates
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        onSuccess?.(response.data);
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error updating test result:', error);
      toast.error(`Lỗi khi cập nhật kết quả: ${error.message}`, {
        toastId: `test-result-form-error-${booking.bookingId}`, // Prevent duplicates
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Cập nhật kết quả - #{booking.bookingId}
        </h3>
        <div className="bg-gray-50 rounded p-3 text-sm">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">{booking.customerFullName}</span>
              <span className="text-gray-600 ml-2">• {booking.serviceName}</span>
            </div>
            <span className="text-xs px-2 py-1 bg-gray-200 rounded">
              {booking.status}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Thông tin người lấy mẫu */}
        <div className="border border-gray-200 rounded p-3 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Thông tin người lấy mẫu
            {booking?.sampleCollectionProfile?.relationshipToBooker === 'SELF' && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Chính chủ
              </span>
            )}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <div className="w-full px-2 py-1.5 text-sm bg-white border border-gray-200 rounded">
                {formData.patientInfo.fullName || 'Chưa có thông tin'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Ngày sinh
              </label>
              <div className="w-full px-2 py-1.5 text-sm bg-white border border-gray-200 rounded">
                {formData.patientInfo.dateOfBirth || 'Chưa có thông tin'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tuổi
              </label>
              <div className="w-full px-2 py-1.5 text-sm bg-white border border-gray-200 rounded">
                {formData.patientInfo.age ? `${formData.patientInfo.age} tuổi` : 'Chưa có thông tin'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Giới tính
              </label>
              <div className="w-full px-2 py-1.5 text-sm bg-white border border-gray-200 rounded">
                {formData.patientInfo.gender || 'Chưa có thông tin'}
              </div>
            </div>

          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <div className="w-full px-2 py-1.5 text-sm bg-white border border-gray-200 rounded">
                {formData.patientInfo.phoneNumber || 'Chưa có thông tin'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                CCCD/CMND
              </label>
              <div className="w-full px-2 py-1.5 text-sm bg-white border border-gray-200 rounded">
                {formData.patientInfo.idCard || 'Chưa có thông tin'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Mối quan hệ
              </label>
              <div className="w-full px-2 py-1.5 text-sm bg-white border border-gray-200 rounded">
                {formData.patientInfo.relationship === 'SELF' ? 'Chính chủ' :
                 formData.patientInfo.relationship === 'FAMILY' ? 'Gia đình' :
                 formData.patientInfo.relationship === 'OTHER' ? 'Khác' :
                 formData.patientInfo.relationship || 'Chưa có thông tin'}
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin lấy mẫu */}
        <div className="border border-gray-200 rounded p-3 bg-blue-50">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Thông tin lấy mẫu
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Thời gian lấy mẫu
              </label>
              <div className="w-full px-2 py-1.5 text-sm bg-white border border-gray-200 rounded">
                {formData.sampleDate ?
                  format(new Date(formData.sampleDate), 'dd/MM/yyyy HH:mm', { locale: vi }) :
                  'Chưa có thông tin'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Trạng thái mẫu
              </label>
              <div className="w-full px-2 py-1.5 text-sm bg-white border border-gray-200 rounded">
                <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  ✓ Đã lấy mẫu
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Result Type Selection */}
        <div className="border border-gray-200 rounded p-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kết quả xét nghiệm <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
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
                <div className={`flex items-center justify-center p-2 border rounded text-xs ${
                  formData.resultType === type.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}>
                  <span className="font-medium">{type.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Detailed Result */}
        <div className="border border-gray-200 rounded p-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chi tiết kết quả <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={formData.result}
            onChange={(e) => handleInputChange('result', e.target.value)}
            className={`w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 ${
              errors.result ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nhập chi tiết kết quả xét nghiệm..."
          />
          {errors.result && (
            <p className="mt-1 text-xs text-red-600">{errors.result}</p>
          )}
        </div>

        {/* Result Date */}
        <div className="border border-gray-200 rounded p-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dự kiến trả kết quả <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={formData.resultDate}
            onChange={(e) => handleInputChange('resultDate', e.target.value)}
            className={`w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 ${
              errors.resultDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.resultDate && (
            <p className="mt-1 text-xs text-red-600">{errors.resultDate}</p>
          )}
        </div>

        {/* Notes Section */}
        <div className="border border-gray-200 rounded p-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú
          </label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
            placeholder="Nhập ghi chú chi tiết về kết quả (không bắt buộc)..."
          />
        </div>

        {/* Debug Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs mb-3">
          <strong>Debug:</strong> Result: "{formData.result}", Date: "{formData.resultDate}", Errors: {JSON.stringify(errors)}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-2"></div>
                Đang cập nhật...
              </>
            ) : (
              'Cập nhật kết quả'
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestResultForm;
