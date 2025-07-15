
import React, { useState, useEffect } from 'react';
import { TestTube, MapPin, Clock, FileText, Download, Eye, Calendar } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTestingServicesAPI } from '../../../services/TestingService';
import { getLocationsAPI } from '../../../services/LocationService';
import TimeSlotService from '../../../services/TimeSlotService';
import instance from '../../../services/customize-axios';
import BookingService from '../../../services/BookingService';
import BookingTrackingService from '../../../services/BookingTrackingService';

const STITesting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeTab, setActiveTab] = useState('booking'); // booking, history, results
  const [availableTests, setAvailableTests] = useState([]);
  const [locations, setLocations] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [trackingBookingId, setTrackingBookingId] = useState(null);
  const [trackingStatus, setTrackingStatus] = useState(null);
  const [trackingOpen, setTrackingOpen] = useState(false);


  useEffect(() => {
    console.log("STITesting useEffect chạy");
    getTestingServicesAPI()
      .then(data => setAvailableTests(data.content || data))
      .catch(err => {
        toast.error('Không thể tải danh sách dịch vụ xét nghiệm!');
      });
  }, []);

  // Gọi API location khi đã chọn dịch vụ
  useEffect(() => {
    if (selectedTest) {
      getLocationsAPI()
        .then(data => setLocations(data))
        .catch(err => {
          toast.error('Không thể tải danh sách địa điểm!');
        });
    } else {
      setLocations([]);
    }
  }, [selectedTest]);

  // Gọi API time slot khi đã chọn dịch vụ, địa điểm
  useEffect(() => {
    console.log('selectedTest:', selectedTest, 'selectedLocation:', selectedLocation);
    if (selectedTest && selectedLocation) {
      console.log('GỌI API TIMESLOT');
      // Lấy khoảng ngày hiển thị (ví dụ: 14 ngày tới)
      const today = new Date();
      const fromDate = today.toISOString().slice(0, 10);
      
      // Gọi API facility time slots
      TimeSlotService.getAvailableFacilityTimeSlots(fromDate)
        .then(result => {
          console.log('Time slot API response:', result);
          if (result.success) {
            setTimeSlots(result.data);
            console.log('Set time slots:', result.data);
          } else {
            console.log('Time slot API error:', result);
            toast.error('Không thể tải danh sách ngày giờ!');
          }
        })
        .catch(err => {
          console.error('Time slot API error:', err);
          // Thử trực tiếp với API call
          instance.get('/api/time-slots/facility', {
            params: { date: fromDate }
          })
          .then(response => {
            console.log('Direct API response:', response.data);
            setTimeSlots(response.data);
          })
          .catch(directErr => {
            console.error('Direct API error:', directErr);
            toast.error('Không thể tải danh sách ngày giờ!');
          });
        });
    } else {
      setTimeSlots([]);
    }
  }, [selectedTest, selectedLocation]);

  useEffect(() => {
    if (activeTab === 'history' || activeTab === 'results') {
      setLoadingHistory(true);
      BookingService.getUserBookings().then(result => {
        if (result.success) {
          setBookingHistory(result.data);
        } else {
          setBookingHistory([]);
          toast.error(result.message || 'Không thể tải lịch sử xét nghiệm');
        }
        setLoadingHistory(false);
      });
    }
  }, [activeTab]);

  useEffect(() => {
    if (trackingBookingId && trackingOpen) {
      BookingTrackingService.connect(() => {
        BookingTrackingService.subscribeBooking(trackingBookingId, (update) => {
          setTrackingStatus(update);
        });
      });
      return () => {
        BookingTrackingService.unsubscribeBooking(trackingBookingId);
        BookingTrackingService.disconnect();
        setTrackingStatus(null);
      };
    }
  }, [trackingBookingId, trackingOpen]);

  const testLocations = [
    {
      id: 'center1',
      name: 'Trung tâm Y tế Gynexa - Quận 1',
      address: '123 Đường Nguyễn Huệ, Quận 1, TP.HCM',
      phone: '028 1234 5678',
      hours: 'T2-T7: 7:00-17:00, CN: 7:00-12:00',
    },
    {
      id: 'center2',
      name: 'Trung tâm Y tế Gynexa - Quận 3',
      address: '456 Đường Võ Văn Tần, Quận 3, TP.HCM',
      phone: '028 8765 4321',
      hours: 'T2-T7: 7:00-17:00, CN: Nghỉ',
    },
    {
      id: 'center3',
      name: 'Trung tâm Y tế Gynexa - Thủ Đức',
      address: '789 Đường Võ Văn Ngân, TP. Thủ Đức, TP.HCM',
      phone: '028 9999 8888',
      hours: 'T2-T7: 6:30-16:30, CN: 7:00-11:00',
    },
  ];

  const testHistory = [
    {
      id: 1,
      date: '2024-01-15',
      tests: ['HIV', 'Giang mai'],
      status: 'completed',
      location: 'Trung tâm Y tế Gynexa - Quận 1',
      resultDate: '2024-01-17',
      totalCost: 350000,
    },
    {
      id: 2,
      date: '2024-01-20',
      tests: ['Chlamydia', 'Lậu'],
      status: 'pending',
      location: 'Trung tâm Y tế Gynexa - Quận 3',
      resultDate: '2024-01-22',
      totalCost: 350000,
    },
  ];

  const handleTestSelection = (serviceId) => {
    setSelectedTest(Number(serviceId));
    console.log('Chọn dịch vụ:', serviceId);
  };

  // Sửa calculateTotal chỉ tính cho 1 dịch vụ
  const calculateTotal = () => {
    const test = availableTests.find(t => t.serviceId === selectedTest);
    return test ? test.price : 0;
  };

  const handleBooking = () => {
    if (!selectedTest || !selectedLocation || !selectedDate || !selectedTimeSlot) {
      toast.error('Vui lòng chọn đầy đủ thông tin');
      return;
    }

    // Lấy thông tin dịch vụ đã chọn
    const selectedService = availableTests.find(t => t.serviceId === selectedTest);
    const selectedLocationData = locations.find(l => l.id === selectedLocation);

    // Tạo booking data
    const bookingData = {
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

    // Chuyển sang trang booking confirmation
    navigate('/sti-testing/booking-confirmation', { 
      state: { bookingData } 
    });
  };

  const generateAvailableDates = () => {
    return Array.from({ length: 14 }, (_, i) => {
      const date = addDays(new Date(), i + 1);
      return format(date, 'yyyy-MM-dd');
    });
  };

  // Nếu có hiển thị tên dịch vụ đã chọn
  const selectedService = availableTests.find(t => t.serviceId === selectedTest);
  const selectedServiceName = selectedService ? selectedService.serviceName : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <button
        onClick={() => navigate('/')}
        style={{
          margin: '16px 0',
          padding: '8px 16px',
          background: '#3a99b7',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
        }}
      >
        🏠 Về trang chủ
      </button>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Xét nghiệm STIs
            </h1>
            <p className="text-gray-600 mt-2">
              Tầm soát và theo dõi sức khỏe sinh sản an toàn, bảo mật
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
          {[
            { id: 'booking', label: 'Đặt lịch xét nghiệm' },
            { id: 'history', label: 'Lịch sử xét nghiệm' },
            { id: 'results', label: 'Kết quả xét nghiệm' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Booking Tab */}
        {activeTab === 'booking' && (
          <div className="space-y-8">
            {/* Available Tests */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Chọn xét nghiệm
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableTests.map(test => (
                  <div
                    key={test.serviceId}
                    onClick={() => handleTestSelection(test.serviceId)}
                    className={`bg-white rounded-lg p-6 shadow-sm cursor-pointer transition-all ${
                      selectedTest === test.serviceId
                        ? 'ring-2 ring-blue-500 bg-blue-50'
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <TestTube
                          className={`h-6 w-6 mr-3 ${
                            selectedTest === test.serviceId
                              ? 'text-blue-600'
                              : 'text-gray-600'
                          }`}
                        />
                        <h3 className="font-semibold text-gray-900">
                          {test.serviceName}
                        </h3>
                      </div>
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedTest === test.serviceId
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedTest === test.serviceId && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {test.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Giá:</span>
                        <span className="font-semibold text-blue-600">
                          {test.price?.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Thời gian:</span>
                        <span className="text-gray-900">{test.durationMinutes ? `${test.durationMinutes} phút` : ''}</span>
                      </div>
                      {test.preparation && (
                        <div className="text-xs text-gray-500 mt-2">
                          <strong>Chuẩn bị:</strong> {test.preparation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selectedTest && (
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-900">
                        Đã chọn xét nghiệm: {selectedServiceName}
                      </h3>
                      <p className="text-sm text-blue-700">
                        {selectedServiceName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-900">
                        Tổng: {calculateTotal().toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Location Selection */}
            {selectedTest && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Chọn địa điểm</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {locations.map(loc => (
                    <div
                      key={loc.id}
                      onClick={() => {
                        setSelectedLocation(loc.id);
                        console.log('Chọn địa điểm:', loc.id);
                      }}
                      className={`bg-white rounded-lg p-6 shadow-sm cursor-pointer transition-all ${
                        selectedLocation === loc.id
                          ? 'ring-2 ring-blue-500 bg-blue-50'
                          : 'hover:shadow-md'
                      }`}
                    >
                      <div className="font-bold text-lg mb-2">{loc.name}</div>
                      <div className="mb-1">{loc.address}</div>
                      <div className="mb-1">📞 {loc.phone}</div>
                      <div className="mb-1">🕒 {loc.hours}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Date Selection */}
            {selectedTest && selectedLocation && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Chọn ngày</h2>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
                  {Array.from(new Set(timeSlots.map(ts => ts.slotDate))).map(date => {
                    const d = new Date(date);
                    const day = d.toLocaleDateString('en-US', { weekday: 'short' });
                    const dayNum = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                    const isSelected = selectedDate === date;
                    return (
                      <div 
                        key={date} 
                        onClick={() => setSelectedDate(date)}
                        className={`bg-white rounded-lg p-4 shadow-sm text-center cursor-pointer transition-all ${
                          isSelected 
                            ? 'ring-2 ring-blue-500 bg-blue-50' 
                            : 'hover:shadow-md'
                        }`}
                      >
                        <div className="font-semibold">{day}</div>
                        <div className="text-lg font-bold">{dayNum}</div>
                        {isSelected && (
                          <div className="mt-2 text-xs text-blue-600 font-medium">
                            Đã chọn
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Time Slots for Selected Date */}
            {selectedTest && selectedLocation && selectedDate && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Chọn giờ</h2>
                <div className="mb-4 text-sm text-gray-600">
                  Debug: {timeSlots.length} time slots, selectedDate: {selectedDate}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {timeSlots
                    .filter(ts => ts.slotDate === selectedDate)
                    .map(timeSlot => {
                      const isSelected = selectedTimeSlot?.timeSlotId === timeSlot.timeSlotId;
                      return (
                        <div
                          key={timeSlot.timeSlotId}
                          onClick={() => setSelectedTimeSlot(timeSlot)}
                          className={`bg-white rounded-lg p-4 shadow-sm text-center cursor-pointer transition-all ${
                            isSelected 
                              ? 'ring-2 ring-blue-500 bg-blue-50' 
                              : 'hover:shadow-md'
                          }`}
                        >
                          <div className="font-semibold text-gray-900">
                            {timeSlot.startTime} - {timeSlot.endTime}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Còn {timeSlot.availableSlots} chỗ
                          </div>
                          {isSelected && (
                            <div className="mt-2 text-xs text-blue-600 font-medium">
                              Đã chọn
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Booking Button */}
            {selectedTest && selectedLocation && selectedDate && selectedTimeSlot && (
              <div className="text-center mt-6">
                <button
                  onClick={handleBooking}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
                >
                  Xác nhận đặt lịch xét nghiệm
                </button>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Lịch sử xét nghiệm
            </h2>
            <div className="space-y-4">
              {loadingHistory ? (
                <div>Đang tải...</div>
              ) : bookingHistory.length === 0 ? (
                <div>Chưa có lịch sử xét nghiệm</div>
              ) : (
                bookingHistory.map(record => (
                  <div
                    key={record.bookingId}
                    className="bg-white rounded-lg p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="font-semibold text-gray-900">
                            {record.bookingDate ? format(new Date(record.bookingDate), 'dd/MM/yyyy') : ''}
                          </span>
                          <span
                            className={`ml-3 px-2 py-1 text-xs rounded-full ${
                              record.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-800'
                                : record.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {record.status === 'COMPLETED'
                              ? 'Hoàn thành'
                              : record.status === 'PENDING'
                              ? 'Đang chờ'
                              : record.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <strong>Xét nghiệm:</strong> {record.serviceName}
                          </p>
                          <p>
                            <strong>Ngày hẹn:</strong> {record.slotDate ? format(new Date(record.slotDate), 'dd/MM/yyyy') : ''}
                          </p>
                          <p>
                            <strong>Giờ:</strong> {record.startTime} - {record.endTime}
                          </p>
                          <p>
                            <strong>Ngày có kết quả:</strong>{' '}
                            {record.resultDate ? format(new Date(record.resultDate), 'dd/MM/yyyy') : '---'}
                          </p>
                          <p>
                            <strong>Chi phí:</strong>{' '}
                            {record.servicePrice?.toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                      </div>
                      <div className="ml-4">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                          onClick={() => {
                            navigate(`/sti-testing/tracking/${record.bookingId}`);
                          }}
                        >
                          Tracking trạng thái
                        </button>
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
                  <h3 className="text-lg font-bold mb-4">Tracking trạng thái booking #{trackingBookingId}</h3>
                  {trackingStatus ? (
                    <div>
                      <div className="mb-2">
                        <span className="font-semibold">Trạng thái mới: </span>
                        <span className="text-blue-700">{trackingStatus.status}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Thông báo: </span>
                        <span>{trackingStatus.message}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Thời gian: </span>
                        <span>{trackingStatus.timestamp && new Date(trackingStatus.timestamp).toLocaleString()}</span>
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
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Kết quả xét nghiệm
            </h2>
            <div className="space-y-4">
              {testHistory
                .filter(record => record.status === 'completed')
                .map(record => (
                  <div
                    key={record.id}
                    className="bg-white rounded-lg p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Kết quả ngày{' '}
                          {format(new Date(record.resultDate), 'dd/MM/yyyy')}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {record.tests.join(', ')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </button>
                        <button className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">
                          <Download className="h-4 w-4 mr-2" />
                          Tải về
                        </button>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {record.tests.map((test, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                          >
                            <span className="font-medium text-gray-900">
                              {test}
                            </span>
                            <span className="text-green-600 font-semibold">
                              Âm tính
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default STITesting;
