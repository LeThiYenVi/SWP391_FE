import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, TestTube, CheckCircle, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import BookingService from '../../../services/BookingService';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;
  const [isLoading, setIsLoading] = useState(false);

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không có thông tin đặt lịch</h2>
          <p className="text-gray-600 mb-4">Vui lòng quay lại trang đặt lịch</p>
          <button
            onClick={() => navigate('/sti-testing')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const handleConfirmBooking = async () => {
    if (!bookingData) {
      toast.error('Không có thông tin đặt lịch');
      return;
    }

    setIsLoading(true);
    try {
      // Tạo booking data theo format BE yêu cầu
      const bookingRequest = {
        serviceId: bookingData.serviceId,
        timeSlotId: bookingData.selectedTimeSlot.timeSlotId,
        // Các field khác sẽ được BE tự động lấy từ user hiện tại
      };

      console.log('Sending booking request:', bookingRequest);

      const result = await BookingService.createBooking(bookingRequest);
      
      if (result.success) {
        toast.success('Đặt lịch xét nghiệm thành công!');
        navigate('/sti-testing');
      } else {
        toast.error('Đặt lịch thất bại: ' + result.message);
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Đặt lịch thất bại: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/sti-testing', { state: { returnToBooking: true } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Xác nhận đặt lịch</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Booking Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              Thông tin đặt lịch
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Information */}
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <TestTube className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-blue-900">Dịch vụ xét nghiệm</h3>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{bookingData.serviceName}</p>
                  <p className="text-sm text-gray-600">{bookingData.serviceDescription}</p>
                  <p className="text-lg font-bold text-blue-600">
                    {bookingData.price?.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-green-900">Địa điểm</h3>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{bookingData.locationName}</p>
                  <p className="text-sm text-gray-600">{bookingData.locationAddress}</p>
                  <p className="text-sm text-gray-600">📞 {bookingData.locationPhone}</p>
                </div>
              </div>

              {/* Date & Time Information */}
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="h-6 w-6 text-purple-600 mr-3" />
                  <h3 className="text-lg font-semibold text-purple-900">Ngày hẹn</h3>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">
                    {format(new Date(bookingData.selectedDate), 'EEEE, dd/MM/yyyy')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(bookingData.selectedDate), 'dd/MM/yyyy')}
                  </p>
                </div>
              </div>

              {/* Time Slot Information */}
              <div className="bg-orange-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-orange-600 mr-3" />
                  <h3 className="text-lg font-semibold text-orange-900">Giờ hẹn</h3>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">
                    {bookingData.selectedTimeSlot?.startTime} - {bookingData.selectedTimeSlot?.endTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    Còn {bookingData.selectedTimeSlot?.availableSlots} chỗ trống
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Total Cost */}
          <div className="border-t border-gray-200 pt-6 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Tổng chi phí:</span>
              <span className="text-2xl font-bold text-blue-600">
                {bookingData.price?.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Chỉnh sửa
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={isLoading}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Xác nhận đặt lịch'
              )}
            </button>
          </div>

          {/* Additional Information */}
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Lưu ý quan trọng:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục</li>
              <li>• Mang theo CMND/CCCD khi đến xét nghiệm</li>
              <li>• Nhịn ăn ít nhất 8 giờ trước khi xét nghiệm (nếu có yêu cầu)</li>
              <li>• Kết quả sẽ có sau 2-3 ngày làm việc</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 