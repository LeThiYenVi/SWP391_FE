import React, { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, User, Star, MapPin, Phone, Mail, Video, MessageCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import TimeslotPicker from '../../../components/TimeslotPicker';
import { useAuth } from '../../../context/AuthContext';
import { getPublicConsultantsAPI } from '../../../services/ConsultantService';
import { bookConsultationAPI, getConsultantAvailabilityAPI, getAvailableTimeSlotsAPI } from '../../../services/ConsultationService';
import ConsultationHistory from '../../../components/ConsultationHistory';
import './ConsultationNew.css';

const ConsultationNew = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('booking'); // booking, history
  const [consultants, setConsultants] = useState([]);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [loadingConsultants, setLoadingConsultants] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    notes: '',
    consultationType: 'ONLINE'
  });

  // Load consultants
  useEffect(() => {
    const loadConsultants = async () => {
      try {
        setLoadingConsultants(true);
        const response = await getPublicConsultantsAPI();
        console.log('Consultants API response:', response);

        // API trả về ApiResponse wrapper với data field
        let consultantsData = [];
        if (response && response.data && Array.isArray(response.data)) {
          consultantsData = response.data;
        } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
          consultantsData = response.data.data;
        } else if (response && Array.isArray(response)) {
          consultantsData = response;
        }

        setConsultants(consultantsData);
        if (consultantsData.length === 0) {
          toast.info('Hiện tại chưa có chuyên gia nào');
        }
      } catch (error) {
        console.error('Error loading consultants:', error);
        toast.error('Có lỗi xảy ra khi tải danh sách chuyên gia');
      } finally {
        setLoadingConsultants(false);
      }
    };

    loadConsultants();
    loadAvailableTimeSlots(); // Load all available timeslots
  }, []);

  const handleConsultantSelect = (consultant) => {
    setSelectedConsultant(consultant);
    setSelectedTimeSlot(null);
    setSelectedDate('');
    // Không cần load timeslots riêng cho consultant, sử dụng timeslots đã có
  };

  // Load all available timeslots from today to future
  const loadAvailableTimeSlots = async () => {
    try {
      setLoadingTimeSlots(true);

      // Lấy timeslots từ hôm nay đến 30 ngày tới
      const today = new Date();
      const fromDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      const toDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const result = await getAvailableTimeSlotsAPI(fromDate, toDate);

      console.log('Timeslots API response:', result);

      // API trả về ApiResponse wrapper với data field
      let timeSlotsData = [];
      if (result && result.data && Array.isArray(result.data)) {
        timeSlotsData = result.data;
      } else if (result && Array.isArray(result)) {
        timeSlotsData = result;
      }

      console.log('Processed timeslots data:', timeSlotsData);
      if (timeSlotsData.length > 0) {
        console.log('Sample timeslot structure:', timeSlotsData[0]);
      }

      setTimeSlots(timeSlotsData);

      if (timeSlotsData.length === 0) {
        toast.info('Hiện tại chưa có lịch trống nào');
      }
    } catch (error) {
      console.error('Error loading timeslots:', error);
      toast.error('Có lỗi xảy ra khi tải lịch trống');
      setTimeSlots([]);
    } finally {
      setLoadingTimeSlots(false);
    }
  };

  const handleBookingSubmit = async () => {
    if (!selectedConsultant || !selectedTimeSlot || !selectedDate) {
      toast.error('Vui lòng chọn chuyên gia, ngày và thời gian tư vấn');
      return;
    }

    setBookingLoading(true);
    try {
      console.log('Selected consultant:', selectedConsultant);
      console.log('Selected timeslot:', selectedTimeSlot);
      console.log('Selected date:', selectedDate);

      // Convert timeslot to startTime/endTime format for backend
      console.log('Timeslot structure:', selectedTimeSlot);
      console.log('All timeslot keys:', Object.keys(selectedTimeSlot));

      // Check different possible field names
      const slotDate = selectedTimeSlot.slotDate || selectedTimeSlot.date || selectedDate;
      const startTime = selectedTimeSlot.startTime || selectedTimeSlot.start;
      const endTime = selectedTimeSlot.endTime || selectedTimeSlot.end;

      console.log('Extracted - Date:', slotDate, 'Start:', startTime, 'End:', endTime);

      if (!slotDate || !startTime || !endTime) {
        toast.error('Dữ liệu timeslot không hợp lệ');
        setBookingLoading(false);
        return;
      }

      // Combine date and time to create LocalDateTime format
      const startDateTime = `${slotDate}T${startTime}`;
      const endDateTime = `${slotDate}T${endTime}`;

      console.log('DateTime format:', startDateTime, endDateTime);

      const bookingData = {
        consultantId: selectedConsultant.id,
        startTime: startDateTime,
        endTime: endDateTime,
        notes: bookingForm.notes,
        consultationType: bookingForm.consultationType
      };

      console.log('Booking data to send:', bookingData);
      const result = await bookConsultationAPI(bookingData);

      console.log('API Response:', result);

      // Backend trả về ApiResponse structure: { success, message, data }
      if (result && result.success) {
        toast.success(result.message || 'Đặt lịch tư vấn thành công!');
        setSelectedConsultant(null);
        setSelectedTimeSlot(null);
        setSelectedDate('');
        setTimeSlots([]);
        setBookingForm({ notes: '', consultationType: 'ONLINE' });
        // Switch to history tab to see the new booking
        setActiveTab('history');
      } else {
        toast.error(result?.message || 'Có lỗi xảy ra khi đặt lịch');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Có lỗi xảy ra khi đặt lịch');
    } finally {
      setBookingLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`star ${index < rating ? 'filled' : 'empty'}`}
      />
    ));
  };

  return (
    <div className="consultation-new min-h-screen" style={{
      background: 'linear-gradient(135deg, #B0B9BC 0%, #568392 100%)'
    }}>
      {/* Hero Section */}
      <div className="consultation-header relative overflow-hidden" style={{ paddingTop: '80px' }}>
        <div className="consultation-header-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tư vấn trực tuyến
            </h1>
            <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
              Đặt lịch tư vấn với các chuyên gia của chúng tôi
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="consultation-tabs flex mb-8">
          {[
            { id: 'booking', label: 'Đặt lịch tư vấn', icon: <Calendar className="w-4 h-4" /> },
            { id: 'history', label: 'Lịch sử tư vấn', icon: <Clock className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`consultation-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Booking Tab */}
        {activeTab === 'booking' && (
          <div className="space-y-8">
            {/* Available Consultants */}
            <div className="consultation-card">
              <div className="consultation-card-header">
                <div className="consultation-card-icon">
                  <User className="w-4 h-4 text-white" />
                </div>
                <h2 className="consultation-card-title">
                  Chọn chuyên gia tư vấn
                </h2>
              </div>

              {loadingConsultants ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#568392' }}></div>
                </div>
              ) : (
                <div className="consultant-grid">
                  {consultants.map((consultant) => (
                    <div
                      key={consultant.id}
                      className="consultant-card"
                      onClick={() => handleConsultantSelect(consultant)}
                    >
                      <div className="text-center">
                        <div className="consultant-avatar">
                          <img
                            src={consultant.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(consultant.fullName)}&background=568392&color=fff&size=100`}
                            alt={consultant.fullName}
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(consultant.fullName)}&background=568392&color=fff&size=100`;
                            }}
                          />
                        </div>

                        <h3 className="consultant-name">
                          {consultant.fullName}
                        </h3>
                        
                        <div className="consultant-rating">
                          {renderStars(consultant.averageRating || 5)}
                          <span className="consultant-rating-text">
                            {consultant.averageRating || 5} ({consultant.totalReviews || 0} đánh giá)
                          </span>
                        </div>

                        <p className="consultant-experience">
                          Kinh nghiệm: {consultant.experienceYears || 5}+ năm
                        </p>

                        <p className="consultant-specialization">
                          Chuyên môn: {consultant.specialization || 'Tư vấn sức khỏe sinh sản'}
                        </p>

                        <button className="consultant-book-btn">
                          <MessageCircle className="w-4 h-4" />
                          <span>ĐẶT LỊCH Tư VẤN</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="consultation-card">
            <div className="consultation-card-header">
              <div className="consultation-card-icon">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h2 className="consultation-card-title">
                Lịch sử tư vấn
              </h2>
            </div>
            <div className="p-6">
              <ConsultationHistory />
            </div>
          </div>
        )}
      </div>

        {/* Selected Consultant Info */}
        {selectedConsultant && (
          <div className="consultation-card">
            <div className="consultation-card-header">
              <div className="consultation-card-icon">
                <User className="w-4 h-4 text-white" />
              </div>
              <h2 className="consultation-card-title">
                Đã chọn: {selectedConsultant.fullName}
              </h2>
              <button
                onClick={() => setSelectedConsultant(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={selectedConsultant.profileImageUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                  alt={selectedConsultant.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2"
                  style={{ borderColor: '#667eea' }}
                  onError={(e) => {
                    e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                  }}
                />
                <div>
                  <h4 className="font-bold text-lg" style={{ color: '#764ba2' }}>
                    {selectedConsultant.fullName}
                  </h4>
                  <div className="flex items-center">
                    {renderStars(selectedConsultant.averageRating || 5)}
                    <span className="ml-2 text-sm text-gray-600">
                      {selectedConsultant.averageRating || 5}/5
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Kinh nghiệm: {selectedConsultant.experienceYears || 5}+ năm
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeslot Picker - Only show when consultant is selected and has timeslots */}
        {selectedConsultant && timeSlots.length > 0 && (
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

        {/* Booking Form - Only show when timeslot is selected */}
        {selectedConsultant && selectedTimeSlot && (
          <div className="consultation-card">
            <div className="consultation-card-header">
              <div className="consultation-card-icon">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h2 className="consultation-card-title">
                Thông tin đặt lịch
              </h2>
            </div>

            <div className="space-y-6 p-6">
              {/* Consultation Type */}
              <div className="form-group">
                <label className="form-label">
                  Hình thức tư vấn
                </label>
                <select
                  value={bookingForm.consultationType}
                  onChange={(e) => setBookingForm({
                    ...bookingForm,
                    consultationType: e.target.value
                  })}
                  className="form-select"
                >
                  <option value="ONLINE">Tư vấn trực tuyến</option>
                  <option value="OFFLINE">Tư vấn trực tiếp</option>
                </select>
              </div>

              {/* Notes */}
              <div className="form-group">
                <label className="form-label">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({
                    ...bookingForm,
                    notes: e.target.value
                  })}
                  placeholder="Mô tả vấn đề bạn muốn tư vấn..."
                  rows={3}
                  className="form-textarea"
                />
              </div>

              {/* Booking Button */}
              <div className="text-center">
                <button
                  onClick={handleBookingSubmit}
                  disabled={bookingLoading}
                  className="btn btn-primary px-8 py-3"
                >
                  {bookingLoading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Xác nhận đặt lịch</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default ConsultationNew;
