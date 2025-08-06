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

  // New fields for sample collector information
  const [collectorFullName, setCollectorFullName] = useState('');
  const [collectorIdCard, setCollectorIdCard] = useState('');
  const [collectorPhoneNumber, setCollectorPhoneNumber] = useState('');
  const [collectorDateOfBirth, setCollectorDateOfBirth] = useState('');
  const [collectorGender, setCollectorGender] = useState('');
  const [relationshipToBooker, setRelationshipToBooker] = useState('SELF');

  // Error states
  const [errors, setErrors] = useState({});

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
      if (isUpdating && booking.sampleCollectionProfile) {
        const profile = booking.sampleCollectionProfile;
        setSampleCollectionDate(profile.sampleCollectionDate || '');
        setResultDeliveryDate(booking.resultDeliveryDate || '');
        setSampleNotes(profile.notes || '');
        setCollectorFullName(profile.collectorFullName || '');
        setCollectorIdCard(profile.collectorIdCard || '');
        setCollectorPhoneNumber(profile.collectorPhoneNumber || '');
        setCollectorDateOfBirth(profile.collectorDateOfBirth || '');
        setCollectorGender(profile.collectorGender || '');
        setRelationshipToBooker(profile.relationshipToBooker || 'SELF');
      } else {
        setSampleNotes('');
        // Pre-fill with customer information for SELF option
        setCollectorFullName(booking.customerFullName || '');
        setCollectorIdCard('');
        setCollectorPhoneNumber(booking.customerPhone || '');
        setCollectorDateOfBirth('');
        setCollectorGender('');
        setRelationshipToBooker('SELF');
      }
      // Clear errors when modal opens
      setErrors({});
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
    const newErrors = {};

    if (!sampleCollectionDate) {
      newErrors.sampleCollectionDate = 'Vui lòng nhập thời gian lấy mẫu';
    }

    if (!collectorFullName.trim()) {
      newErrors.collectorFullName = 'Vui lòng nhập họ tên người lấy mẫu';
    }

    if (!collectorIdCard.trim()) {
      newErrors.collectorIdCard = 'Vui lòng nhập số CCCD/CMND';
    } else {
      // Validate ID card format (9-12 digits)
      const idCardRegex = /^[0-9]{9,12}$/;
      if (!idCardRegex.test(collectorIdCard.trim())) {
        newErrors.collectorIdCard = 'Số CCCD/CMND phải từ 9-12 chữ số';
      }
    }

    // Validate phone number if provided (must be 10 digits)
    if (collectorPhoneNumber.trim()) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(collectorPhoneNumber.trim())) {
        newErrors.collectorPhoneNumber = 'Số điện thoại phải có đúng 10 chữ số';
      }
    }

    setErrors(newErrors);

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onSubmit({
      bookingId: booking.bookingId || booking.id,
      collectorFullName: collectorFullName.trim(),
      collectorIdCard: collectorIdCard.trim(),
      collectorPhoneNumber: collectorPhoneNumber.trim() || null,
      collectorDateOfBirth: collectorDateOfBirth || null,
      collectorGender: collectorGender || null,
      relationshipToBooker,
      sampleCollectionDate,
      notes: sampleNotes?.trim() || null
    });
  };

  const handleClose = () => {
    setSampleCollectionDate('');
    setResultDeliveryDate('');
    setSampleNotes('');
    setCollectorFullName('');
    setCollectorIdCard('');
    setCollectorPhoneNumber('');
    setCollectorDateOfBirth('');
    setCollectorGender('');
    setRelationshipToBooker('SELF');
    onClose();
  };

  // Handle relationship change to auto-fill customer info for SELF
  const handleRelationshipChange = (value) => {
    setRelationshipToBooker(value);
    if (value === 'SELF') {
      setCollectorFullName(booking.customerFullName || '');
      setCollectorPhoneNumber(booking.customerPhone || '');
    } else {
      setCollectorFullName('');
      setCollectorPhoneNumber('');
      setCollectorDateOfBirth('');
      setCollectorGender('');
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                {isUpdating ? (
                  <FileText className="h-6 w-6 text-white" />
                ) : (
                  <TestTube className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isUpdating ? 'Cập nhật thông tin mẫu' : 'Lấy mẫu xét nghiệm'}
                </h2>
                <p className="text-blue-100 text-sm">
                  {isUpdating ? 'Chỉnh sửa thông tin mẫu đã lấy' : 'Thực hiện quy trình lấy mẫu'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-blue-200 transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Thông tin khách hàng */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {booking.customerFullName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Thông tin khách hàng</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Khách hàng</p>
                <p className="text-sm font-medium text-gray-900">{booking.customerFullName}</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Dịch vụ</p>
                <p className="text-sm font-medium text-gray-900">{booking.serviceName}</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Ngày hẹn</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(booking.slotDate)}</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Giờ hẹn</p>
                <p className="text-sm font-medium text-gray-900">
                  {booking.startTime && booking.endTime
                    ? `${booking.startTime} - ${booking.endTime}`
                    : 'Chưa xác định'}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">ID Booking</p>
                <p className="text-sm font-medium text-gray-900">#{booking.bookingId || booking.id}</p>
              </div>
            </div>
          </div>

          {/* Thông tin người lấy mẫu */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin người lấy mẫu</h3>

            {/* Mối quan hệ */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mối quan hệ với người đặt lịch <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border-2 border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                value={relationshipToBooker}
                onChange={(e) => handleRelationshipChange(e.target.value)}
              >
                <option value="SELF">Chính chủ</option>
                <option value="FAMILY_MEMBER">Người nhà</option>
                <option value="FRIEND">Bạn bè</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Họ tên */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ tên người lấy mẫu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.collectorFullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập họ tên đầy đủ"
                  value={collectorFullName}
                  onChange={(e) => {
                    setCollectorFullName(e.target.value);
                    if (errors.collectorFullName) {
                      setErrors(prev => ({ ...prev, collectorFullName: '' }));
                    }
                  }}
                />
                {errors.collectorFullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.collectorFullName}</p>
                )}
              </div>

              {/* Số CCCD */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số CCCD/CMND <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.collectorIdCard ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập số CCCD/CMND (9-12 chữ số)"
                  value={collectorIdCard}
                  onChange={(e) => {
                    setCollectorIdCard(e.target.value);
                    if (errors.collectorIdCard) {
                      setErrors(prev => ({ ...prev, collectorIdCard: '' }));
                    }
                  }}
                />
                {errors.collectorIdCard && (
                  <p className="text-red-500 text-sm mt-1">{errors.collectorIdCard}</p>
                )}
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  className={`w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.collectorPhoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập số điện thoại (10 chữ số, tùy chọn)"
                  value={collectorPhoneNumber}
                  onChange={(e) => {
                    setCollectorPhoneNumber(e.target.value);
                    if (errors.collectorPhoneNumber) {
                      setErrors(prev => ({ ...prev, collectorPhoneNumber: '' }));
                    }
                  }}
                />
                {errors.collectorPhoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.collectorPhoneNumber}</p>
                )}
              </div>

              {/* Ngày sinh */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  className="w-full border-2 border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={collectorDateOfBirth}
                  onChange={(e) => setCollectorDateOfBirth(e.target.value)}
                />
              </div>

              {/* Giới tính */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  className="w-full border-2 border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  value={collectorGender}
                  onChange={(e) => setCollectorGender(e.target.value)}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form lấy mẫu */}
          <div className={`${
            isUpdating
              ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
              : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
          } p-6 rounded-xl border-2`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-lg ${
                isUpdating ? 'bg-orange-100' : 'bg-green-100'
              }`}>
                {isUpdating ? (
                  <FileText className={`h-6 w-6 ${isUpdating ? 'text-orange-600' : 'text-green-600'}`} />
                ) : (
                  <TestTube className={`h-6 w-6 ${isUpdating ? 'text-orange-600' : 'text-green-600'}`} />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {isUpdating ? 'Cập nhật thông tin mẫu đã lấy' : 'Thực hiện lấy mẫu'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isUpdating ? 'Chỉnh sửa thông tin mẫu' : 'Điền thông tin lấy mẫu xét nghiệm'}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Thời gian lấy mẫu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  className={`w-full border-2 rounded-xl p-4 focus:ring-2 focus:ring-offset-2 transition-all duration-200 bg-white shadow-sm ${
                    errors.sampleCollectionDate
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : isUpdating
                        ? 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  value={sampleCollectionDate}
                  onChange={(e) => {
                    setSampleCollectionDate(e.target.value);
                    if (errors.sampleCollectionDate) {
                      setErrors(prev => ({ ...prev, sampleCollectionDate: '' }));
                    }
                  }}
                />
              </div>
              {errors.sampleCollectionDate && (
                <p className="text-red-500 text-sm mt-1">{errors.sampleCollectionDate}</p>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Ghi chú {isUpdating ? 'về mẫu' : 'lấy mẫu'} <span className="text-gray-400">(Tùy chọn)</span>
              </label>
              <textarea
                rows="4"
                className={`w-full border-2 border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                  isUpdating
                    ? 'focus:ring-orange-500 focus:border-orange-500'
                    : 'focus:ring-blue-500 focus:border-blue-500'
                } bg-white shadow-sm resize-none`}
                placeholder={`Nhập ghi chú chi tiết về ${isUpdating ? 'mẫu xét nghiệm' : 'quá trình lấy mẫu'} (không bắt buộc)...`}
                value={sampleNotes}
                onChange={(e) => setSampleNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              className={`flex-1 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                isUpdating
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }`}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              {isUpdating ? 'Cập nhật thông tin' : 'Xác nhận lấy mẫu'}
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-white text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-100 border-2 border-gray-300 hover:border-gray-400 font-semibold transition-all duration-200"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleCollectionModal;
