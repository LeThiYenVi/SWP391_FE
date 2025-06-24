import React, { useState } from 'react';
import { useAppointment } from '../../../context/AppointmentContext';
import {
  Calendar,
  Clock,
  Star,
  User,
  MessageCircle,
  Video,
  Phone,
  X,
} from 'lucide-react';
import { format, addDays, isSameDay, isToday, isTomorrow } from 'date-fns';
import { toast } from 'react-toastify';
import './index.css';

const Consultation = () => {
  const { counselors, bookAppointment, getAvailableCounselors } =
    useAppointment();
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState('video'); // video, phone, chat
  const [reason, setReason] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  const availableCounselors = getAvailableCounselors();

  // Generate next 14 days for booking
  const availableDates = Array.from({ length: 14 }, (_, i) =>
    addDays(new Date(), i)
  );

  const consultationTypes = [
    {
      id: 'video',
      name: 'Video Call',
      description: 'Tư vấn qua video call trực tuyến',
      icon: Video,
      price: '300.000đ',
    },
    {
      id: 'phone',
      name: 'Phone Call',
      description: 'Tư vấn qua điện thoại',
      icon: Phone,
      price: '200.000đ',
    },
    {
      id: 'chat',
      name: 'Live Chat',
      description: 'Tư vấn qua tin nhắn trực tuyến',
      icon: MessageCircle,
      price: '150.000đ',
    },
  ];

  const timeSlots = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
  ];

  const formatDate = date => {
    if (isToday(date)) return 'Hôm nay';
    if (isTomorrow(date)) return 'Ngày mai';
    return format(date, 'dd/MM');
  };

  const handleBookAppointment = () => {
    if (
      !selectedCounselor ||
      !selectedDate ||
      !selectedTime ||
      !consultationType ||
      !reason.trim()
    ) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const appointmentData = {
      counselorId: selectedCounselor.id,
      counselorName: selectedCounselor.name,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      type: consultationType,
      reason: reason.trim(),
    };

    bookAppointment(appointmentData);
    toast.success('Đặt lịch tư vấn thành công!');

    // Reset form
    setSelectedCounselor(null);
    setSelectedDate('');
    setSelectedTime('');
    setConsultationType('video');
    setReason('');
    setShowBookingForm(false);
  };

  return (
    <div className="consultation-container">
      {/* Header */}
      <div className="consultation-header">
        <div className="consultation-header-content">
          <h1 className="consultation-title">Tư vấn trực tuyến</h1>
          <p className="consultation-subtitle">
            Đặt lịch tư vấn với các chuyên gia của chúng tôi
          </p>
        </div>
      </div>

      <div className="consultation-main">
        {/* Consultation Types */}
        <div className="consultation-types-section">
          <h2 className="section-title">Chọn hình thức tư vấn</h2>
          <div className="consultation-types-grid">
            {consultationTypes.map(type => (
              <div
                key={type.id}
                className={`consultation-type-card ${
                  consultationType === type.id ? 'selected' : ''
                }`}
                onClick={() => setConsultationType(type.id)}
              >
                <div className="type-header">
                  <type.icon className="type-icon" />
                  <div className="type-info">
                    <h3>{type.name}</h3>
                    <p>{type.description}</p>
                  </div>
                </div>
                <div className="type-price">{type.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Counselors */}
        {consultationType && (
          <div className="counselors-section">
            <h2 className="section-title">Chọn tư vấn viên</h2>
            <div className="counselors-grid">
              {availableCounselors.map(counselor => (
                <div
                  key={counselor.id}
                  className={`counselor-card ${
                    selectedCounselor?.id === counselor.id ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedCounselor(counselor)}
                >
                  <div className="counselor-header">
                    <div className="counselor-avatar">
                      <User />
                    </div>
                    <div className="counselor-info">
                      <h3>{counselor.name}</h3>
                      <p className="specialty">{counselor.specialty}</p>
                      <div className="counselor-rating">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`rating-star ${
                              i < counselor.rating ? 'filled' : ''
                            }`}
                          />
                        ))}
                        <span className="rating-text">
                          ({counselor.rating}/5)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="counselor-details">
                    <p>Kinh nghiệm: {counselor.experience} năm</p>
                    <p>Chuyên môn: {counselor.specialty}</p>
                  </div>

                  <div className="online-status">
                    <div className="status-dot"></div>
                    <span className="status-text">Đang trực tuyến</span>
                  </div>

                  <div className="time-slots-preview">
                    <p className="slots-title">Thời gian có sẵn hôm nay:</p>
                    <div className="slots-list">
                      {timeSlots.slice(0, 3).map(slot => (
                        <span key={slot} className="slot-tag">
                          {slot}
                        </span>
                      ))}
                      <span className="slot-tag">
                        +{timeSlots.length - 3} khác
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book Button */}
        {consultationType && selectedCounselor && (
          <button
            onClick={() => setShowBookingForm(true)}
            className="book-consultation-btn"
          >
            Đặt lịch tư vấn
          </button>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="booking-form-overlay">
            <div className="booking-form-container">
              <div className="booking-form-header">
                <h2 className="booking-form-title">Đặt lịch tư vấn</h2>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="close-btn"
                >
                  <X />
                </button>
              </div>

              {/* Selected counselor summary */}
              <div className="counselor-summary">
                <div className="summary-header">
                  <div className="summary-avatar">
                    <User />
                  </div>
                  <div className="summary-info">
                    <h3>{selectedCounselor.name}</h3>
                    <p className="specialty">{selectedCounselor.specialty}</p>
                    <p className="summary-price">
                      {
                        consultationTypes.find(t => t.id === consultationType)
                          ?.price
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="form-section">
                <h3 className="form-section-title">Chọn ngày</h3>
                <div className="date-grid">
                  {availableDates.map(date => (
                    <div
                      key={date.toString()}
                      className={`date-option ${
                        selectedDate === date.toString() ? 'selected' : ''
                      }`}
                      onClick={() => setSelectedDate(date.toString())}
                    >
                      <div className="date-day">{format(date, 'EEE')}</div>
                      <div className="date-number">{formatDate(date)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="form-section">
                  <h3 className="form-section-title">Chọn giờ</h3>
                  <div className="time-grid">
                    {timeSlots.map(time => (
                      <div
                        key={time}
                        className={`time-option ${
                          selectedTime === time ? 'selected' : ''
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reason */}
              <div className="form-section">
                <h3 className="form-section-title">Lý do tư vấn (tùy chọn)</h3>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Mô tả ngắn gọn vấn đề bạn muốn tư vấn..."
                  className="reason-textarea"
                />
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="form-btn cancel"
                >
                  Hủy
                </button>
                <button
                  onClick={handleBookAppointment}
                  className="form-btn confirm"
                  disabled={!selectedDate || !selectedTime}
                >
                  Xác nhận đặt lịch
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consultation;
