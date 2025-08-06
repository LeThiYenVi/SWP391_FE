// Import các thư viện React cần thiết
import React, { useState, useEffect } from 'react';

// Import các icon từ Lucide React cho giao diện
import {
  TestTube,
  MapPin,
  Clock,
  FileText,
  Download,
  Eye,
  Calendar,
  Star,
  X,
  XCircle,
} from 'lucide-react';

// Import thư viện xử lý ngày tháng và hiển thị thông báo
import { format } from 'date-fns'; // Format ngày tháng theo định dạng Việt Nam
import { toast } from 'react-toastify'; // Hiển thị thông báo toast cho người dùng

// Import React Router hooks để điều hướng
import { useNavigate, useLocation } from 'react-router-dom';

// Import các API service để gọi backend
import { getTestingServicesAPI } from '../../../services/TestingService'; // API lấy danh sách dịch vụ xét nghiệm
import { getLocationsAPI } from '../../../services/LocationService'; // API lấy danh sách địa điểm

// Import Axios instance và booking services
import instance from '../../../services/customize-axios'; // Axios instance đã được customize
import BookingService, {
  createBookingAPI,
} from '../../../services/BookingService'; // Service booking chính

// Import các Context và hooks
import { useWebSocket } from '../../../hooks/useWebSocketCompat'; // Hook WebSocket cho real-time updates
import { useAuth } from '../../../context/AuthContext'; // Context xác thực người dùng

// Import các component con
import FeedbackModal from '../../../components/FeedbackModal'; // Modal đánh giá phản hồi
import FeedbackStatus from '../../../components/FeedbackStatus'; // Component hiển thị trạng thái feedback
import TestResultModal from '../../../components/TestResultModal'; // Modal hiển thị kết quả xét nghiệm chi tiết
import TimeslotPicker from '../../../components/TimeslotPicker'; // Component chọn khung giờ hẹn

const STITesting = () => {
  // Hooks điều hướng và lấy thông tin route
  const navigate = useNavigate();
  const location = useLocation();

  // Hook WebSocket để nhận cập nhật real-time và context người dùng
  const { connected, subscribeToBooking, unsubscribeFromBooking } =
    useWebSocket();
  const { user } = useAuth();

  // === STATE QUẢN LÝ FORM ĐẶT LỊCH ===
  // State cho việc chọn dịch vụ, địa điểm và thời gian
  const [selectedTest, setSelectedTest] = useState(null); // ID dịch vụ xét nghiệm được chọn
  const [selectedDate, setSelectedDate] = useState(''); // Ngày được chọn (format: YYYY-MM-DD)
  const [selectedLocation, setSelectedLocation] = useState(null); // ID địa điểm được chọn
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null); // Object time slot được chọn
  const [showBookingForm, setShowBookingForm] = useState(false); // Hiển thị form booking (hiện tại không dùng)

  // State quản lý tab hiện tại (booking/history/results)
  const [activeTab, setActiveTab] = useState('booking');

  // === STATE QUẢN LÝ DỮ LIỆU MASTER ===
  // Dữ liệu từ API backend
  const [availableTests, setAvailableTests] = useState([]); // Danh sách dịch vụ xét nghiệm
  const [locations, setLocations] = useState([]); // Danh sách địa điểm xét nghiệm
  const [timeSlots, setTimeSlots] = useState([]); // Danh sách khung giờ available
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false); // Loading state cho time slots

  // === STATE QUẢN LÝ LỊCH SỬ VÀ THEO DÕI ===
  const [bookingHistory, setBookingHistory] = useState([]); // Lịch sử các lần đặt xét nghiệm
  const [loadingHistory, setLoadingHistory] = useState(false); // Loading state cho lịch sử
  const [trackingBookingId, setTrackingBookingId] = useState(null); // ID booking đang tracking
  const [trackingStatus, setTrackingStatus] = useState(null); // Trạng thái real-time từ WebSocket
  const [trackingOpen, setTrackingOpen] = useState(false); // Hiển thị modal tracking

  // === STATE QUẢN LÝ FEEDBACK VÀ ĐÁNH GIÁ ===
  const [feedbackRefreshKey, setFeedbackRefreshKey] = useState(0); // Key để force refresh feedback components
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false); // Hiển thị modal feedback
  const [selectedBooking, setSelectedBooking] = useState(null); // Booking được chọn để feedback

  // === STATE QUẢN LÝ KẾT QUẢ XÉT NGHIỆM ===
  const [selectedResult, setSelectedResult] = useState(null); // Kết quả được chọn để xem chi tiết
  const [isResultModalOpen, setIsResultModalOpen] = useState(false); // Hiển thị modal kết quả

  // === STATE QUẢN LÝ XÁC NHẬN ĐẶT LỊCH ===
  // Modal xác nhận thông tin trước khi đặt lịch
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); // Hiển thị modal xác nhận
  const [bookingData, setBookingData] = useState(null); // Dữ liệu booking để xác nhận
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false); // Đang submit booking

  // === STATE QUẢN LÝ HỦY LỊCH HẸN ===
  const [cancellingBookingId, setCancellingBookingId] = useState(null); // ID booking đang được hủy
  const [showCancelConfirm, setShowCancelConfirm] = useState(false); // Hiển thị modal xác nhận hủy
  const [bookingToCancel, setBookingToCancel] = useState(null); // Booking sẽ được hủy

  // === EFFECT HOOKS - QUẢN LÝ SIDE EFFECTS ===

  /**
   * Effect 1: Load danh sách dịch vụ xét nghiệm khi component mount
   * Gọi API để lấy tất cả dịch vụ xét nghiệm STI có sẵn
   */
  useEffect(() => {
    getTestingServicesAPI()
      .then(data => {
        // API trả về format: { success, message, data: PageResponse }
        // PageResponse có format: { content: [...], pageNumber, pageSize, ... }
        // Danh sách dịch vụ nằm trong data.data.content
        const testsArray = data.data?.content || [];
        setAvailableTests(testsArray);
      })
      .catch(err => {
        console.error('API TestService error:', err);
        toast.error('Không thể tải danh sách dịch vụ xét nghiệm!');
      });
  }, []); // Chỉ chạy 1 lần khi component mount

  /**
   * Effect 2: Load danh sách địa điểm khi đã chọn dịch vụ
   * Chỉ gọi API locations khi người dùng đã chọn dịch vụ xét nghiệm
   */
  useEffect(() => {
    if (selectedTest) {
      getLocationsAPI()
        .then(data => {
          // API trả về format: { success, message, data: List<LocationResponseDTO> }
          // Danh sách địa điểm nằm trực tiếp trong data.data
          const locationsArray = data.data || [];
          setLocations(locationsArray);
        })
        .catch(err => {
          console.error('API Locations error:', err);
          toast.error('Không thể tải danh sách địa điểm!');
        });
    } else {
      // Reset locations khi chưa chọn dịch vụ
      setLocations([]);
    }
  }, [selectedTest]); // Chạy lại khi selectedTest thay đổi

  /**
   * Effect 3: Load time slots khi đã chọn cả dịch vụ và địa điểm
   * Gọi API để lấy các khung giờ trống theo ngày
   */
  useEffect(() => {
    if (selectedTest && selectedLocation) {
      // Lấy ngày hiện tại làm điểm bắt đầu
      const today = new Date();
      const fromDate = today.toISOString().slice(0, 10); // Format: YYYY-MM-DD

      setLoadingTimeSlots(true);

      // Gọi API facility time slots trực tiếp bằng axios instance
      instance
        .get('/api/time-slots/facility', {
          params: { date: fromDate },
        })
        .then(response => {
          // API trả về format: { success, message, data: List<TimeSlotResponseDTO> }
          // Danh sách time slots nằm trong response.data.data
          const timeSlotData = response.data?.data || [];
          setTimeSlots(timeSlotData);
          if (timeSlotData.length === 0) {
            toast.info(
              'Không có slot trống cho ngày hôm nay, vui lòng chọn ngày khác'
            );
          }
        })
        .catch(err => {
          console.error('TimeSlots API error:', err);
          toast.error(
            'Không thể tải danh sách ngày giờ! Vui lòng thử lại sau.'
          );
          setTimeSlots([]);
        })
        .finally(() => {
          setLoadingTimeSlots(false);
        });
    } else {
      // Reset time slots khi chưa chọn đủ thông tin
      setTimeSlots([]);
      setLoadingTimeSlots(false);
    }
  }, [selectedTest, selectedLocation]); // Chạy lại khi selectedTest hoặc selectedLocation thay đổi

  /**
   * Effect 4: Load lịch sử booking khi chuyển sang tab history hoặc results
   * Gọi API để lấy tất cả booking của user hiện tại
   */
  useEffect(() => {
    if (activeTab === 'history' || activeTab === 'results') {
      setLoadingHistory(true);
      BookingService.getUserBookings().then(result => {
        console.log('BookingService.getUserBookings result:', result);
        if (result.success) {
          console.log('Setting bookingHistory with data:', result.data);
          setBookingHistory(result.data);
        } else {
          console.log('BookingService failed:', result.message);
          setBookingHistory([]);
          toast.error(result.message || 'Không thể tải lịch sử xét nghiệm');
        }
        setLoadingHistory(false);
      });
    }
  }, [activeTab]); // Chạy lại khi activeTab thay đổi

  /**
   * Effect 5: Quản lý WebSocket subscription cho real-time tracking
   * Subscribe/unsubscribe khỏi topic cập nhật trạng thái booking theo thời gian thực
   */
  useEffect(() => {
    if (trackingBookingId && trackingOpen) {
      // Subscribe vào topic WebSocket cho booking cụ thể
      const subscription = subscribeToBooking(trackingBookingId, update => {
        // Callback được gọi khi có cập nhật trạng thái mới
        setTrackingStatus(update);
      });

      // Cleanup function: unsubscribe khi component unmount hoặc tracking đóng
      return () => {
        if (subscription) {
          unsubscribeFromBooking(trackingBookingId);
        }
        setTrackingStatus(null);
      };
    }
  }, [
    trackingBookingId,
    trackingOpen,
    subscribeToBooking,
    unsubscribeFromBooking,
  ]); // Chạy lại khi các dependency thay đổi

  // === HELPER FUNCTIONS - CÁC HÀM TIỆN ÍCH ===

  /**
   * Xử lý khi người dùng chọn dịch vụ xét nghiệm
   * @param {number} serviceId - ID của dịch vụ xét nghiệm được chọn
   */
  const handleTestSelection = serviceId => {
    setSelectedTest(Number(serviceId));
    // Reset các selection phụ thuộc
    // setSelectedLocation(null); // Có thể uncomment nếu muốn reset location khi đổi test
    // setSelectedDate('');
    // setSelectedTimeSlot(null);
  };

  /**
   * Tính tổng chi phí dựa trên dịch vụ đã chọn
   * @returns {number} Tổng chi phí (VND)
   */
  const calculateTotal = () => {
    if (!Array.isArray(availableTests)) return 0;
    const test = availableTests.find(t => t.serviceId === selectedTest);
    return test ? test.price : 0;
  };

  // === FEEDBACK & RATING HANDLERS - XỬ LÝ ĐÁNH GIÁ ===

  /**
   * Xử lý khi người dùng click vào nút đánh giá
   * @param {Object} booking - Object booking cần đánh giá
   */
  const handleFeedbackClick = booking => {
    setSelectedBooking(booking);
    setFeedbackModalOpen(true);
  };

  /**
   * Xử lý sau khi submit feedback thành công
   * Refresh lại các component liên quan để hiển thị trạng thái mới
   */
  const handleFeedbackSubmitted = () => {
    setFeedbackModalOpen(false);
    setSelectedBooking(null);
    // Force refresh FeedbackStatus components bằng cách thay đổi key
    setFeedbackRefreshKey(prev => prev + 1);
    // Refresh booking history để hiển thị trạng thái feedback mới
    if (activeTab === 'history') {
      fetchBookingHistory();
    }
  };

  // === CANCEL BOOKING HANDLERS - XỬ LÝ HỦY LỊCH HẸN ===

  /**
   * Xử lý khi người dùng click vào nút hủy lịch hẹn
   * @param {Object} booking - Object booking cần hủy
   */
  const handleCancelClick = booking => {
    setBookingToCancel(booking);
    setShowCancelConfirm(true);
  };

  /**
   * Xử lý xác nhận hủy lịch hẹn
   * Gọi API hủy booking và cập nhật danh sách
   */
  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;

    setCancellingBookingId(bookingToCancel.bookingId);
    try {
      const result = await BookingService.cancelBooking(
        bookingToCancel.bookingId
      );
      if (result.success) {
        toast.success('Hủy lịch hẹn thành công!');
        fetchBookingHistory(); // Refresh danh sách
      } else {
        toast.error(result.message || 'Không thể hủy lịch hẹn');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Có lỗi xảy ra khi hủy lịch hẹn');
    } finally {
      setCancellingBookingId(null);
      setShowCancelConfirm(false);
      setBookingToCancel(null);
    }
  };

  /**
   * Xử lý hủy bỏ việc hủy lịch hẹn (không hủy nữa)
   */
  const handleCancelCancel = () => {
    setShowCancelConfirm(false);
    setBookingToCancel(null);
  };

  /**
   * Hàm fetch lại booking history từ API
   * Được dùng để refresh danh sách sau khi có thay đổi
   */
  const fetchBookingHistory = async () => {
    setLoadingHistory(true);
    try {
      const result = await BookingService.getUserBookings();
      if (result.success) {
        setBookingHistory(result.data);
      } else {
        setBookingHistory([]);
        toast.error(result.message || 'Không thể tải lịch sử xét nghiệm');
      }
    } catch (error) {
      console.error('Error fetching booking history:', error);
      setBookingHistory([]);
      toast.error('Không thể tải lịch sử xét nghiệm');
    } finally {
      setLoadingHistory(false);
    }
  };

  // === BOOKING HANDLERS - XỬ LÝ ĐẶT LỊCH ===

  /**
   * Xử lý khi người dùng click nút "Xác nhận đặt lịch"
   * Kiểm tra validation và hiển thị modal xác nhận
   */
  const handleBooking = () => {
    // Validation: Kiểm tra đã chọn đủ thông tin chưa
    if (
      !selectedTest ||
      !selectedLocation ||
      !selectedDate ||
      !selectedTimeSlot
    ) {
      toast.error('Vui lòng chọn đầy đủ thông tin');
      return;
    }

    // Lấy thông tin chi tiết từ các state
    const selectedService = Array.isArray(availableTests)
      ? availableTests.find(t => t.serviceId === selectedTest)
      : null;
    const selectedLocationData = locations.find(l => l.id === selectedLocation);

    // Tạo object chứa tất cả thông tin booking để hiển thị trong modal xác nhận
    const newBookingData = {
      serviceId: selectedTest,
      serviceName: selectedService?.serviceName,
      serviceDescription: selectedService?.description,
      price: selectedService?.price,
      locationId: selectedLocation,
      locationName: selectedLocationData?.name,
      locationAddress: selectedLocationData?.address,
      locationPhone: selectedLocationData?.phone,
      selectedDate: selectedDate,
      selectedTimeSlot: selectedTimeSlot,
    };

    // Hiển thị modal xác nhận thay vì chuyển hướng trực tiếp
    setBookingData(newBookingData);
    setIsBookingModalOpen(true);
  };

  /**
   * Xử lý xác nhận đặt lịch sau khi người dùng đã review thông tin
   * Gọi API tạo booking thực tế
   */
  const handleConfirmBooking = async () => {
    if (!bookingData) return;

    setIsSubmittingBooking(true);
    try {
      // Tạo object request theo format API yêu cầu
      const bookingRequest = {
        serviceId: bookingData.serviceId,
        timeSlotId: bookingData.selectedTimeSlot.timeSlotId,
        locationId: bookingData.locationId,
        bookingDate: bookingData.selectedDate,
        notes: '', // Có thể thêm ghi chú nếu cần
      };

      // Gọi API tạo booking
      const response = await createBookingAPI(bookingRequest);

      if (response) {
        toast.success('Đặt lịch xét nghiệm thành công!');

        // Reset form về trạng thái ban đầu
        setSelectedTest(null);
        setSelectedLocation(null);
        setSelectedDate('');
        setSelectedTimeSlot(null);
        setIsBookingModalOpen(false);
        setBookingData(null);

        // Reload trang để cập nhật dữ liệu mới
        window.location.reload();
      }
    } catch (error) {
      console.error('Lỗi khi đặt lịch:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi đặt lịch xét nghiệm');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // === COMPUTED VALUES - CÁC GIÁ TRỊ TÍNH TOÁN ===

  /**
   * Lấy thông tin dịch vụ đã chọn để hiển thị
   * Dùng để show tên dịch vụ trong UI
   */
  const selectedService = Array.isArray(availableTests)
    ? availableTests.find(t => t.serviceId === selectedTest)
    : null;
  const selectedServiceName = selectedService
    ? selectedService.serviceName
    : '';

  // === JSX RENDER - GIAO DIỆN NGƯỜI DÙNG ===
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* === HEADER SECTION - PHẦN TIÊU ĐỀ TRANG === */}
      <div
        className="bg-white shadow-lg border-b-4"
        style={{ borderBottomColor: '#3a99b7' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            {/* Icon và tiêu đề chính */}
            <div className="flex items-center justify-center mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                style={{
                  background: 'linear-gradient(135deg, #3a99b7, #2d7a91)',
                }}
              >
                <TestTube className="w-6 h-6 text-white" />
              </div>
              <h1
                className="text-4xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #3a99b7, #2d7a91)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Xét nghiệm STIs
              </h1>
            </div>
            {/* Mô tả ngắn về dịch vụ */}
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Dịch vụ xét nghiệm chuyên nghiệp, an toàn và bảo mật cho sức khỏe
              sinh sản của bạn
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* === TAB NAVIGATION - ĐIỀU HƯỚNG TAB === */}
        {/* 3 tab chính: Đặt lịch, Theo dõi, Kết quả */}
        <div
          className="flex space-x-1 bg-white rounded-xl p-1 mb-8 shadow-lg border"
          style={{ borderColor: '#3a99b7' }}
        >
          {[
            {
              id: 'booking',
              label: 'Đặt lịch xét nghiệm',
              icon: <Calendar className="w-4 h-4" />,
            },
            {
              id: 'history',
              label: 'Theo dõi xét nghiệm',
              icon: <Clock className="w-4 h-4" />,
            },
            {
              id: 'results',
              label: 'Kết quả xét nghiệm',
              icon: <FileText className="w-4 h-4" />,
            },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-6 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                activeTab === tab.id
                  ? 'text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={{
                background:
                  activeTab === tab.id
                    ? 'linear-gradient(135deg, #3a99b7, #2d7a91)'
                    : 'transparent',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* === TAB CONTENT - NỘI DUNG CÁC TAB === */}

        {/* === BOOKING TAB - TAB ĐẶT LỊCH XÉT NGHIỆM === */}
        {activeTab === 'booking' && (
          <div className="space-y-8">
            {/* === SECTION 1: CHỌN GÓI XÉT NGHIỆM === */}
            {/* Hiển thị grid các dịch vụ xét nghiệm có sẵn */}
            <div
              className="bg-white rounded-xl shadow-lg p-6 border"
              style={{ borderColor: '#3a99b7' }}
            >
              <div className="flex items-center mb-6">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                  style={{
                    background: 'linear-gradient(135deg, #3a99b7, #2d7a91)',
                  }}
                >
                  <TestTube className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: '#2d7a91' }}>
                  Chọn gói xét nghiệm
                </h2>
              </div>
              {/* Grid hiển thị các card dịch vụ xét nghiệm */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Render danh sách dịch vụ từ API */}
                {Array.isArray(availableTests) &&
                  availableTests.map((test, index) => (
                    <div
                      key={test.serviceId}
                      onClick={() => handleTestSelection(test.serviceId)}
                      className={`bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 border-2 hover:shadow-xl transform hover:-translate-y-1 ${
                        selectedTest === test.serviceId
                          ? 'shadow-xl scale-105'
                          : 'shadow-md hover:shadow-lg'
                      }`}
                      style={{
                        borderColor:
                          selectedTest === test.serviceId
                            ? '#3a99b7'
                            : '#e5e7eb',
                        background:
                          selectedTest === test.serviceId
                            ? 'linear-gradient(135deg, rgba(58, 153, 183, 0.05), rgba(45, 122, 145, 0.05))'
                            : 'white',
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                            style={{
                              background:
                                selectedTest === test.serviceId
                                  ? 'linear-gradient(135deg, #3a99b7, #2d7a91)'
                                  : '#f3f4f6',
                            }}
                          >
                            <TestTube
                              className={`h-5 w-5 ${
                                selectedTest === test.serviceId
                                  ? 'text-white'
                                  : 'text-gray-600'
                              }`}
                            />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {test.serviceName}
                          </h3>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedTest === test.serviceId
                              ? 'border-transparent'
                              : 'border-gray-300'
                          }`}
                          style={{
                            background:
                              selectedTest === test.serviceId
                                ? 'linear-gradient(135deg, #3a99b7, #2d7a91)'
                                : 'transparent',
                          }}
                        >
                          {selectedTest === test.serviceId && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {test.description}
                      </p>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-gray-600 font-medium">
                            Giá:
                          </span>
                          <span
                            className="text-xl font-bold"
                            style={{ color: '#3a99b7' }}
                          >
                            {test.price?.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Thời gian:</span>
                          <span className="text-gray-900 bg-gray-100 px-2 py-1 rounded-full text-xs">
                            {test.durationMinutes
                              ? `${test.durationMinutes} phút`
                              : '30 phút'}
                          </span>
                        </div>
                        {test.preparation && (
                          <div className="text-xs text-gray-500 mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                            <strong className="text-yellow-700">
                              Chuẩn bị:
                            </strong>{' '}
                            {test.preparation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                {/* Debug fallback */}
                {!Array.isArray(availableTests) && (
                  <div className="col-span-full text-center text-red-500">
                    ❌ availableTests không phải là Array
                  </div>
                )}

                {Array.isArray(availableTests) &&
                  availableTests.length === 0 && (
                    <div className="col-span-full text-center text-gray-500">
                      📭 Không có test nào available
                    </div>
                  )}
              </div>

              {selectedTest && (
                <div
                  className="mt-6 rounded-xl p-6 border-2"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(58, 153, 183, 0.1), rgba(45, 122, 145, 0.1))',
                    borderColor: '#3a99b7',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                        style={{
                          background:
                            'linear-gradient(135deg, #3a99b7, #2d7a91)',
                        }}
                      >
                        <TestTube className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3
                          className="font-semibold text-lg"
                          style={{ color: '#2d7a91' }}
                        >
                          Đã chọn: {selectedServiceName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Gói xét nghiệm đã được chọn
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-2xl font-bold"
                        style={{ color: '#3a99b7' }}
                      >
                        {calculateTotal().toLocaleString('vi-VN')}đ
                      </p>
                      <p className="text-sm text-gray-600">Tổng chi phí</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Location Selection */}
            {selectedTest && (
              <div
                className="bg-white rounded-xl shadow-lg p-6 border"
                style={{ borderColor: '#3a99b7' }}
              >
                <div className="flex items-center mb-6">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                    style={{
                      background: 'linear-gradient(135deg, #3a99b7, #2d7a91)',
                    }}
                  >
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: '#2d7a91' }}
                  >
                    Chọn địa điểm xét nghiệm
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.isArray(locations) &&
                    locations.map(loc => (
                      <div
                        key={loc.id}
                        onClick={() => {
                          setSelectedLocation(loc.id);
                        }}
                        className={`bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 border-2 hover:shadow-xl transform hover:-translate-y-1 ${
                          selectedLocation === loc.id
                            ? 'shadow-xl scale-105'
                            : 'shadow-md hover:shadow-lg'
                        }`}
                        style={{
                          borderColor:
                            selectedLocation === loc.id ? '#3a99b7' : '#e5e7eb',
                          background:
                            selectedLocation === loc.id
                              ? 'linear-gradient(135deg, rgba(58, 153, 183, 0.05), rgba(45, 122, 145, 0.05))'
                              : 'white',
                        }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{
                              background:
                                selectedLocation === loc.id
                                  ? 'linear-gradient(135deg, #3a99b7, #2d7a91)'
                                  : '#f3f4f6',
                            }}
                          >
                            <MapPin
                              className={`h-5 w-5 ${
                                selectedLocation === loc.id
                                  ? 'text-white'
                                  : 'text-gray-600'
                              }`}
                            />
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedLocation === loc.id
                                ? 'border-transparent'
                                : 'border-gray-300'
                            }`}
                            style={{
                              background:
                                selectedLocation === loc.id
                                  ? 'linear-gradient(135deg, #3a99b7, #2d7a91)'
                                  : 'transparent',
                            }}
                          >
                            {selectedLocation === loc.id && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <div className="font-bold text-lg mb-3 text-gray-900">
                          {loc.name}
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-start">
                            <span className="mr-2">📍</span>
                            <span>{loc.address}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2">📞</span>
                            <span>{loc.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2">🕒</span>
                            <span>{loc.hours}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Enhanced Timeslot Picker */}
            {selectedTest && selectedLocation && (
              <TimeslotPicker
                timeSlots={timeSlots}
                selectedDate={selectedDate}
                selectedTimeSlot={selectedTimeSlot}
                onDateSelect={setSelectedDate}
                onTimeSlotSelect={setSelectedTimeSlot}
                loading={loadingTimeSlots}
                className="mb-8"
              />
            )}

            {/* Booking Button */}
            {selectedTest &&
              selectedLocation &&
              selectedDate &&
              selectedTimeSlot && (
                <div className="text-center mt-8">
                  <button
                    onClick={handleBooking}
                    className="text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    style={{
                      background: 'linear-gradient(135deg, #3a99b7, #2d7a91)',
                      boxShadow: '0 4px 15px rgba(58, 153, 183, 0.3)',
                    }}
                    onMouseEnter={e => {
                      e.target.style.background =
                        'linear-gradient(135deg, #2d7a91, #1e5a6b)';
                      e.target.style.boxShadow =
                        '0 6px 20px rgba(58, 153, 183, 0.4)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.background =
                        'linear-gradient(135deg, #3a99b7, #2d7a91)';
                      e.target.style.boxShadow =
                        '0 4px 15px rgba(58, 153, 183, 0.3)';
                    }}
                  >
                    🔬 Xác nhận đặt lịch xét nghiệm
                  </button>
                  <p className="text-gray-600 text-sm mt-3">
                    Bạn sẽ được chuyển đến trang xác nhận thông tin
                  </p>
                </div>
              )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div
            className="bg-white rounded-xl shadow-lg p-6 border"
            style={{ borderColor: '#3a99b7' }}
          >
            <div className="flex items-center mb-8">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                style={{
                  background: 'linear-gradient(135deg, #3a99b7, #2d7a91)',
                }}
              >
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: '#2d7a91' }}>
                Theo dõi xét nghiệm
              </h2>
            </div>
            <div className="space-y-6">
              {loadingHistory ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div
                      className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent mx-auto mb-4"
                      style={{
                        borderColor: '#3a99b7',
                        borderTopColor: 'transparent',
                      }}
                    ></div>
                    <p className="text-gray-600 font-medium">
                      Đang tải lịch sử xét nghiệm...
                    </p>
                  </div>
                </div>
              ) : bookingHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(58, 153, 183, 0.1), rgba(45, 122, 145, 0.1))',
                    }}
                  >
                    <FileText
                      className="h-8 w-8"
                      style={{ color: '#3a99b7' }}
                    />
                  </div>
                  <p className="text-gray-700 font-semibold text-lg mb-2">
                    Chưa có lịch sử xét nghiệm
                  </p>
                  <p className="text-gray-500">
                    Hãy đặt lịch xét nghiệm đầu tiên của bạn
                  </p>
                </div>
              ) : (
                Array.isArray(bookingHistory) &&
                bookingHistory.map(record => (
                  <div
                    key={record.bookingId}
                    className="bg-white rounded-xl p-6 shadow-md border-2 hover:shadow-lg transition-all duration-300"
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-4">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                            style={{
                              background:
                                'linear-gradient(135deg, #3a99b7, #2d7a91)',
                            }}
                          >
                            <TestTube className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <span className="font-bold text-lg text-gray-900">
                              {record.bookingDate
                                ? format(
                                    new Date(record.bookingDate),
                                    'dd/MM/yyyy'
                                  )
                                : ''}
                            </span>
                            <div className="flex items-center mt-1">
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  record.status === 'COMPLETED'
                                    ? 'bg-green-100 text-green-800'
                                    : record.status === 'PENDING'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : record.status === 'CONFIRMED'
                                    ? 'bg-blue-100 text-blue-800'
                                    : record.status === 'CANCELLED'
                                    ? 'bg-red-100 text-red-800'
                                    : record.status === 'SAMPLE_COLLECTED'
                                    ? 'bg-purple-100 text-purple-800'
                                    : record.status === 'TESTING'
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {record.status === 'COMPLETED'
                                  ? '✅ Hoàn thành'
                                  : record.status === 'PENDING'
                                  ? '⏳ Đang chờ'
                                  : record.status === 'CONFIRMED'
                                  ? '📅 Đã xác nhận'
                                  : record.status === 'CANCELLED'
                                  ? '❌ Đã hủy'
                                  : record.status === 'SAMPLE_COLLECTED'
                                  ? '🧪 Đã lấy mẫu'
                                  : record.status === 'TESTING'
                                  ? '🔬 Đang xét nghiệm'
                                  : record.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <span className="text-gray-500 w-24">
                                Xét nghiệm:
                              </span>
                              <span className="font-semibold text-gray-900">
                                {record.serviceName}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-500 w-24">
                                Ngày hẹn:
                              </span>
                              <span className="font-medium text-gray-700">
                                {record.slotDate
                                  ? format(
                                      new Date(record.slotDate),
                                      'dd/MM/yyyy'
                                    )
                                  : '---'}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-500 w-24">Giờ:</span>
                              <span className="font-medium text-gray-700">
                                {record.startTime} - {record.endTime}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <span className="text-gray-500 w-28">
                                Kết quả:
                              </span>
                              <span className="font-medium text-gray-700">
                                {record.resultDate
                                  ? format(
                                      new Date(record.resultDate),
                                      'dd/MM/yyyy'
                                    )
                                  : 'Chưa có'}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-500 w-28">
                                Chi phí:
                              </span>
                              <span
                                className="font-bold text-lg"
                                style={{ color: '#3a99b7' }}
                              >
                                {record.servicePrice?.toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Feedback Status for completed bookings */}
                        {record.status === 'COMPLETED' && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <FeedbackStatus
                              key={`${record.bookingId}-${feedbackRefreshKey}`}
                              bookingId={record.bookingId}
                              onFeedbackSubmitted={handleFeedbackSubmitted}
                              onFeedbackClick={() =>
                                handleFeedbackClick(record)
                              }
                            />
                          </div>
                        )}
                      </div>
                      <div className="ml-6 flex flex-col gap-3">
                        <button
                          className="text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg"
                          style={{
                            background:
                              'linear-gradient(135deg, #3a99b7, #2d7a91)',
                          }}
                          onClick={() => {
                            navigate(
                              `/sti-testing/tracking/${record.bookingId}`
                            );
                          }}
                        >
                          📊 Theo dõi
                        </button>

                        {/* Cancel button for pending/confirmed bookings */}
                        {(record.status === 'PENDING' ||
                          record.status === 'CONFIRMED') && (
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleCancelClick(record)}
                            disabled={cancellingBookingId === record.bookingId}
                          >
                            {cancellingBookingId === record.bookingId ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Đang hủy...
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4" />
                                Hủy lịch hẹn
                              </>
                            )}
                          </button>
                        )}

                        {/* Feedback button for completed bookings */}
                        {record.status === 'COMPLETED' && (
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg"
                            onClick={() => handleFeedbackClick(record)}
                          >
                            <Star className="h-4 w-4" />
                            Đánh giá
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Modal tracking */}
            {trackingOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 min-w-[350px] relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    onClick={() => setTrackingOpen(false)}
                  >
                    Đóng
                  </button>
                  <h3 className="text-lg font-bold mb-4">
                    Tracking trạng thái booking #{trackingBookingId}
                  </h3>
                  {trackingStatus ? (
                    <div>
                      <div className="mb-2">
                        <span className="font-semibold">Trạng thái mới: </span>
                        <span className="text-blue-700">
                          {trackingStatus.status}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Thông báo: </span>
                        <span>{trackingStatus.message}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Thời gian: </span>
                        <span>
                          {trackingStatus.timestamp &&
                            new Date(trackingStatus.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Người cập nhật: </span>
                        <span>{trackingStatus.updatedBy}</span>
                      </div>
                    </div>
                  ) : (
                    <div>Đang kết nối tracking...</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div
            className="bg-white rounded-xl shadow-lg p-6 border"
            style={{ borderColor: '#3a99b7' }}
          >
            <div className="flex items-center mb-8">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                style={{
                  background: 'linear-gradient(135deg, #3a99b7, #2d7a91)',
                }}
              >
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: '#2d7a91' }}>
                Kết quả xét nghiệm
              </h2>
            </div>
            <div className="space-y-6">
              {loadingHistory ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div
                      className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent mx-auto mb-4"
                      style={{
                        borderColor: '#3a99b7',
                        borderTopColor: 'transparent',
                      }}
                    ></div>
                    <p className="text-gray-600 font-medium">
                      Đang tải kết quả xét nghiệm...
                    </p>
                  </div>
                </div>
              ) : bookingHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(58, 153, 183, 0.1), rgba(45, 122, 145, 0.1))',
                    }}
                  >
                    <FileText
                      className="h-8 w-8"
                      style={{ color: '#3a99b7' }}
                    />
                  </div>
                  <p className="text-gray-700 font-semibold text-lg mb-2">
                    Chưa có kết quả xét nghiệm
                  </p>
                  <p className="text-gray-500">
                    Kết quả sẽ hiển thị sau khi xét nghiệm hoàn tất
                  </p>
                </div>
              ) : (
                Array.isArray(bookingHistory) &&
                bookingHistory
                  .filter(
                    record => record.status === 'COMPLETED' && record.result
                  )
                  .map(record => (
                    <div
                      key={record.bookingId}
                      className="bg-white rounded-xl p-6 shadow-md border-2 hover:shadow-lg transition-all duration-300"
                      style={{ borderColor: '#e5e7eb' }}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                            style={{
                              background:
                                'linear-gradient(135deg, #3a99b7, #2d7a91)',
                            }}
                          >
                            <FileText className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-gray-900">
                              Kết quả ngày{' '}
                              {record.resultDate
                                ? format(
                                    new Date(record.resultDate),
                                    'dd/MM/yyyy'
                                  )
                                : 'N/A'}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              {record.serviceName}
                            </p>
                            <div className="flex items-center mt-2">
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                                ✅ Đã có kết quả
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            className="flex items-center text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg"
                            style={{
                              background:
                                'linear-gradient(135deg, #3a99b7, #2d7a91)',
                            }}
                            onClick={() => {
                              setSelectedResult(record);
                              setIsResultModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </button>
                          <button
                            className="flex items-center bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg"
                            onClick={() => {
                              // Download result as PDF or print
                              toast.info(
                                'Tính năng tải về đang được phát triển'
                              );
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Tải về
                          </button>
                        </div>
                      </div>

                      <div
                        className="border-t pt-6"
                        style={{ borderColor: '#e5e7eb' }}
                      >
                        <div
                          className="rounded-xl p-6 border-2"
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(58, 153, 183, 0.05), rgba(45, 122, 145, 0.05))',
                            borderColor: '#3a99b7',
                          }}
                        >
                          <h4
                            className="font-bold text-lg mb-4"
                            style={{ color: '#2d7a91' }}
                          >
                            📋 Kết quả xét nghiệm:
                          </h4>
                          <div className="bg-white rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap border border-gray-200">
                            {record.result || 'Chưa có kết quả chi tiết'}
                          </div>
                          {record.description && (
                            <div className="mt-4">
                              <h5 className="font-semibold text-gray-900 mb-2">
                                💬 Ghi chú từ bác sĩ:
                              </h5>
                              <div className="bg-white rounded-lg p-4 text-sm text-gray-600 whitespace-pre-wrap border border-gray-200">
                                {record.description}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              )}

              {/* Show message if no completed results */}
              {!loadingHistory &&
                bookingHistory.length > 0 &&
                bookingHistory.filter(
                  record => record.status === 'COMPLETED' && record.result
                ).length === 0 && (
                  <div className="text-center py-12">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(58, 153, 183, 0.1), rgba(45, 122, 145, 0.1))',
                      }}
                    >
                      <FileText
                        className="h-8 w-8"
                        style={{ color: '#3a99b7' }}
                      />
                    </div>
                    <p className="text-gray-700 font-semibold text-lg mb-2">
                      Chưa có kết quả xét nghiệm hoàn thành
                    </p>
                    <p className="text-gray-500">
                      Kết quả sẽ hiển thị sau khi quá trình xét nghiệm hoàn tất
                    </p>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/* Result Detail Modal */}
      <TestResultModal
        isOpen={isResultModalOpen}
        onClose={() => {
          setIsResultModalOpen(false);
          setSelectedResult(null);
        }}
        result={selectedResult}
        patientInfo={
          selectedResult?.sampleCollectionProfile
            ? {
                fullName:
                  selectedResult.sampleCollectionProfile.collectorFullName,
                dateOfBirth:
                  selectedResult.sampleCollectionProfile.collectorDateOfBirth,
                gender: selectedResult.sampleCollectionProfile.collectorGender,
                phoneNumber:
                  selectedResult.sampleCollectionProfile.collectorPhoneNumber,
                address:
                  selectedResult.sampleCollectionProfile.collectorAddress,
                id: selectedResult.sampleCollectionProfile.collectorIdCard,
                relationship:
                  selectedResult.sampleCollectionProfile.relationshipToBooker,
              }
            : user
        }
      />

      {/* Booking Confirmation Modal */}
      {isBookingModalOpen && bookingData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div
              className="p-6 border-b-4"
              style={{ borderBottomColor: '#3a99b7' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                    style={{
                      background: 'linear-gradient(135deg, #3a99b7, #2d7a91)',
                    }}
                  >
                    <TestTube className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3
                      className="text-2xl font-bold"
                      style={{ color: '#2d7a91' }}
                    >
                      Xác nhận đặt lịch xét nghiệm
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Vui lòng kiểm tra thông tin trước khi xác nhận
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmittingBooking}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Service Info */}
              <div
                className="rounded-xl p-6 border-2"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(58, 153, 183, 0.05), rgba(45, 122, 145, 0.05))',
                  borderColor: '#3a99b7',
                }}
              >
                <h4
                  className="font-bold text-lg mb-4"
                  style={{ color: '#2d7a91' }}
                >
                  🔬 Thông tin xét nghiệm
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600 text-sm">Dịch vụ:</span>
                    <p className="font-semibold text-gray-900">
                      {bookingData.serviceName}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Chi phí:</span>
                    <p
                      className="font-bold text-xl"
                      style={{ color: '#3a99b7' }}
                    >
                      {bookingData.price?.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>
                {bookingData.serviceDescription && (
                  <div className="mt-3">
                    <span className="text-gray-600 text-sm">Mô tả:</span>
                    <p className="text-gray-700 text-sm mt-1">
                      {bookingData.serviceDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* Location & Time Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin
                      className="h-4 w-4 mr-2"
                      style={{ color: '#3a99b7' }}
                    />
                    Địa điểm
                  </h5>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{bookingData.locationName}</p>
                    <p className="text-gray-600">
                      {bookingData.locationAddress}
                    </p>
                    <p className="text-gray-600">
                      📞 {bookingData.locationPhone}
                    </p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Calendar
                      className="h-4 w-4 mr-2"
                      style={{ color: '#3a99b7' }}
                    />
                    Thời gian
                  </h5>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">
                      {new Date(bookingData.selectedDate).toLocaleDateString(
                        'vi-VN',
                        {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </p>
                    <p className="text-gray-600">
                      🕒 {bookingData.selectedTimeSlot.startTime} -{' '}
                      {bookingData.selectedTimeSlot.endTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
                  ⚠️ Lưu ý quan trọng
                </h5>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>
                    • Vui lòng đến đúng giờ đã đặt để tránh ảnh hưởng đến lịch
                    trình
                  </li>
                  <li>• Mang theo CMND/CCCD và thẻ bảo hiểm y tế (nếu có)</li>
                  <li>
                    • Nhịn ăn 8-12 tiếng trước khi xét nghiệm (nếu cần thiết)
                  </li>
                  <li>• Liên hệ trung tâm nếu cần thay đổi lịch hẹn</li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmittingBooking}
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmittingBooking}
                className="px-8 py-2 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                style={{
                  background: isSubmittingBooking
                    ? '#9ca3af'
                    : 'linear-gradient(135deg, #3a99b7, #2d7a91)',
                }}
              >
                {isSubmittingBooking ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>✅ Xác nhận đặt lịch</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        booking={selectedBooking}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Xác nhận hủy lịch hẹn
                </h3>
                <p className="text-sm text-gray-600">
                  Booking #{bookingToCancel?.bookingId}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Bạn có chắc chắn muốn hủy lịch hẹn xét nghiệm này không?
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Lưu ý:</strong> Sau khi hủy, bạn sẽ không thể khôi
                  phục lại lịch hẹn này.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelCancel}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Không hủy
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={cancellingBookingId}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {cancellingBookingId ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Đang hủy...
                  </>
                ) : (
                  'Xác nhận hủy'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default STITesting;
