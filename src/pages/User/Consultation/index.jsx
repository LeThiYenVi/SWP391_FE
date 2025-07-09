import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
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
  Users,
  ArrowRight,
  Edit,
  Eye,
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { toast } from 'react-toastify';
//import NotificationService from '../../services/NotificationService';
import './index.css';

const Consultation = () => {
  const user = { email: 'user@example.com' }; // Giả lập user có email
  const {
    appointments,
    bookAppointment,
    cancelAppointment,
    getAvailableCounselors,
    getCounselorById,
  } = useAppointment();
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState('video'); // video, phone, chat
  const [reason, setReason] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeTab, setActiveTab] = useState('book'); // book, history
  const [highlightedAppointmentId, setHighlightedAppointmentId] =
    useState(null);

  const availableCounselors = getAvailableCounselors();

  // Generate next 14 days for booking
  const availableDates = Array.from({ length: 14 }, (_, i) =>
    addDays(new Date(), i)
  );

  const consultationTypes = [
    {
      id: 'video',
      name: 'Video call',
      description: 'Tư vấn trực tuyến qua video call, bảo mật và tiện lợi.',
      icon: Video,
      price: '300.000đ',
    },
    {
      id: 'phone',
      name: 'Gọi điện thoại',
      description: 'Tư vấn qua điện thoại, riêng tư và nhanh chóng.',
      icon: Phone,
      price: '200.000đ',
    },
    {
      id: 'chat',
      name: 'Chat trực tuyến',
      description: 'Tư vấn qua chat, dễ dàng lưu lại nội dung.',
      icon: MessageCircle,
      price: '150.000đ',
    },
  ];

  const timeSlots = selectedCounselor ? selectedCounselor.timeSlots : [];

  // Lấy các slot đã được đặt của counselor trong ngày
  const getUnavailableSlots = (counselorId, date) => {
    if (!counselorId || !date) return [];
    const dateStr = format(new Date(date), 'yyyy-MM-dd');
    return appointments
      .filter(
        appointment =>
          appointment.counselorId === counselorId &&
          appointment.date === dateStr &&
          ['scheduled', 'rescheduled'].includes(appointment.status)
      )
      .map(appointment => appointment.time);
  };

  // Kiểm tra trùng lịch
  const checkAppointmentConflict = (counselorId, date, time) => {
    return appointments.some(
      appointment =>
        appointment.counselorId === counselorId &&
        appointment.date === date &&
        appointment.time === time &&
        ['scheduled', 'rescheduled'].includes(appointment.status)
    );
  };

  // Kiểm tra slot đã qua
  const isPastSlot = (date, time) => {
    const slotDateTime = new Date(
      `${format(new Date(date), 'yyyy-MM-dd')}T${time}`
    );
    return slotDateTime <= new Date();
  };

  const handleBookAppointment = () => {
    if (!selectedCounselor) {
      toast.error('Vui lòng chọn tư vấn viên');
      return;
    }
    if (!selectedDate) {
      toast.error('Vui lòng chọn ngày tư vấn');
      return;
    }
    if (!selectedTime) {
      toast.error('Vui lòng chọn giờ tư vấn');
      return;
    }
    if (!consultationType) {
      toast.error('Vui lòng chọn hình thức tư vấn');
      return;
    }
    // Format date
    const appointmentDate = format(new Date(selectedDate), 'yyyy-MM-dd');
    // Check conflict
    if (
      checkAppointmentConflict(
        selectedCounselor.id,
        appointmentDate,
        selectedTime
      )
    ) {
      toast.error(
        'Thời gian này đã có người đặt. Vui lòng chọn thời gian khác.'
      );
      return;
    }
    // Check quá khứ
    if (isPastSlot(appointmentDate, selectedTime)) {
      toast.error(
        'Không thể đặt lịch trong quá khứ. Vui lòng chọn thời gian khác.'
      );
      return;
    }
    // Tạo dữ liệu lịch hẹn
    const appointmentData = {
      counselorId: selectedCounselor.id,
      counselorName: selectedCounselor.name,
      date: appointmentDate,
      time: selectedTime,
      type: consultationType,
      reason: reason.trim(),
    };
    const newApt = bookAppointment(appointmentData);
    toast.success('Đặt lịch tư vấn thành công!', {
      autoClose: 4000,
      className: 'booking-success-toast',
    });
    // Gửi email xác nhận (mock)
    if (user?.email) {
      NotificationService.sendBookingConfirmationEmail({
        to: user.email,
        counselorName: selectedCounselor.name,
        date: appointmentDate,
        time: selectedTime,
        type: consultationType,
      });
      // Lên lịch gửi email nhắc nhở trước 30 phút (mock)
      const selectedDateTime = new Date(`${appointmentDate}T${selectedTime}`);
      const now = new Date();
      const msToReminder = selectedDateTime - now - 30 * 60 * 1000;
      if (msToReminder > 0) {
        setTimeout(() => {
          NotificationService.sendAppointmentReminderEmail({
            to: user.email,
            counselorName: selectedCounselor.name,
            date: appointmentDate,
            time: selectedTime,
            type: consultationType,
          });
        }, msToReminder);
      }
    }
    // Reset form
    setReason('');
    setShowBookingForm(false);
    setSelectedTime('');
    setActiveTab('history');
    setHighlightedAppointmentId(newApt.id);
  };

  const handleCancelAppointment = appointmentId => {
    cancelAppointment(appointmentId);
    toast.info('Đã hủy lịch hẹn.');
  };

  const getStatusText = status => {
    switch (status) {
      case 'scheduled':
        return 'Sắp diễn ra';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      case 'rescheduled':
        return 'Đã dời lịch';
      default:
        return status;
    }
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
        {/* Tab Navigation */}
        <div className="consultation-tabs">
          <button
            className={`tab-btn ${activeTab === 'book' ? 'active' : ''}`}
            onClick={() => setActiveTab('book')}
          >
            <Calendar size={20} />
            Đặt lịch tư vấn
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Clock size={20} />
            Lịch hẹn của tôi ({appointments.length})
          </button>
        </div>

        {/* Book Appointment Tab */}
        {activeTab === 'book' && (
          <>
            {/* Consultation Types */}
            <div className="consultation-types-section">
              <div className="consultation-types-grid">
                {consultationTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.id}
                      className={`consultation-type-card ${
                        consultationType === type.id ? 'selected' : ''
                      }`}
                      onClick={() => setConsultationType(type.id)}
                    >
                      <div className="type-header">
                        <Icon size={32} />
                        <div className="type-info">
                          <h3>{type.name}</h3>
                          <p>{type.description}</p>
                        </div>
                        <div className="type-price">{type.price}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Available Counselors */}
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
                    <div className="counselor-avatar">
                      <img
                        src={counselor.avatar}
                        alt={counselor.name}
                        style={{ width: 56, height: 56, borderRadius: '50%' }}
                      />
                    </div>
                    <div className="counselor-info">
                      <h4>{counselor.name}</h4>
                      <div className="counselor-specialty">
                        {counselor.specialty}
                      </div>
                      <div className="counselor-rating">
                        <Star
                          size={16}
                          color="#FFD700"
                          style={{ marginRight: 4 }}
                        />
                        <span style={{ fontWeight: 600 }}>
                          {counselor.rating}
                        </span>
                        <span style={{ color: '#888', marginLeft: 8 }}>
                          <Users size={14} style={{ marginRight: 2 }} />
                          {counselor.consultationCount} buổi tư vấn
                        </span>
                      </div>
                    </div>
                    <div className="counselor-details">
                      <p>Kinh nghiệm: {counselor.experience}</p>
                      <p>Chuyên môn: {counselor.specialty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Book Button */}
            {consultationType && selectedCounselor && (
              <div className="book-section">
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="book-consultation-btn"
                >
                  Đặt lịch tư vấn với {selectedCounselor.name}
                  <ArrowRight size={20} />
                </button>
              </div>
            )}

            {/* Booking Form Modal */}
            {showBookingForm && (
              <div
                className="booking-form-overlay"
                onClick={() => setShowBookingForm(false)}
              >
                <div
                  className="booking-form-container"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    className="form-btn close"
                    onClick={() => setShowBookingForm(false)}
                  >
                    <X size={20} />
                  </button>
                  <h2 className="section-title">Đặt lịch tư vấn</h2>
                  {/* Date Selection */}
                  <div className="form-section">
                    <h3 className="form-section-title">Chọn ngày *</h3>
                    <div className="date-grid">
                      {availableDates.map(date => {
                        const isPastDate =
                          date < new Date().setHours(0, 0, 0, 0);
                        return (
                          <div
                            key={date.toString()}
                            className={`date-option ${
                              selectedDate === date.toString() ? 'selected' : ''
                            } ${isPastDate ? 'past-date' : ''}`}
                            onClick={() => {
                              if (!isPastDate) {
                                setSelectedDate(date.toString());
                                setSelectedTime('');
                              }
                            }}
                            title={
                              isPastDate
                                ? 'Không thể chọn ngày trong quá khứ'
                                : ''
                            }
                          >
                            <div className="date-day">
                              {format(date, 'EEE')}
                            </div>
                            <div className="date-number">
                              {format(date, 'dd/MM')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Time Selection */}
                  {selectedDate && (
                    <div className="form-section">
                      <h3 className="form-section-title">Chọn giờ *</h3>
                      <div className="time-grid">
                        {timeSlots.map(time => {
                          const unavailableSlots = getUnavailableSlots(
                            selectedCounselor.id,
                            selectedDate
                          );
                          const isUnavailable = unavailableSlots.includes(time);
                          const isPastTime = isPastSlot(selectedDate, time);
                          return (
                            <div
                              key={time}
                              className={`time-option ${
                                selectedTime === time ? 'selected' : ''
                              } ${
                                isUnavailable || isPastTime ? 'unavailable' : ''
                              }`}
                              onClick={() => {
                                if (!isUnavailable && !isPastTime) {
                                  setSelectedTime(time);
                                }
                              }}
                              title={
                                isUnavailable
                                  ? 'Đã có người đặt'
                                  : isPastTime
                                  ? 'Đã qua giờ'
                                  : ''
                              }
                            >
                              {time}
                              {isUnavailable && (
                                <span className="unavailable-badge">
                                  Đã đặt
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {/* Reason */}
                  <div className="form-section">
                    <h3 className="form-section-title">
                      Lý do tư vấn (tùy chọn)
                    </h3>
                    <textarea
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      placeholder="Mô tả ngắn gọn vấn đề bạn muốn tư vấn..."
                      className="reason-textarea"
                      maxLength={500}
                    />
                  </div>
                  {/* Confirm Button */}
                  <div className="form-section" style={{ textAlign: 'center' }}>
                    <button
                      className="form-btn confirm"
                      onClick={handleBookAppointment}
                    >
                      Xác nhận đặt lịch
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* My Appointments Tab */}
        {activeTab === 'history' && (
          <div className="appointments-history">
            <h2 className="section-title">Lịch hẹn của tôi</h2>
            {appointments.length > 0 ? (
              <div className="appointments-grid">
                {appointments
                  .sort((a, b) => {
                    const dA = new Date(`${a.date}T${a.time}`);
                    const dB = new Date(`${b.date}T${b.time}`);
                    return dA - dB;
                  })
                  .map(appointment => {
                    const counselor = getCounselorById(appointment.counselorId);
                    const isUpcoming =
                      new Date(`${appointment.date}T${appointment.time}`) >
                      new Date();
                    const canCancel =
                      isUpcoming && appointment.status === 'scheduled';
                    const canJoin =
                      !canCancel && appointment.status === 'scheduled';
                    return (
                      <div
                        key={appointment.id}
                        className={`appointment-card${
                          highlightedAppointmentId === appointment.id
                            ? ' booking-success-animation'
                            : ''
                        }`}
                        style={
                          highlightedAppointmentId === appointment.id
                            ? { border: '2px solid #568392' }
                            : {}
                        }
                      >
                        <div className="appointment-header">
                          <div className="appointment-status">
                            {getStatusText(appointment.status)}
                          </div>
                          <div className="appointment-actions">
                            <button className="action-btn" title="Xem chi tiết">
                              <Eye size={16} />
                            </button>
                            {canCancel && (
                              <button
                                className="action-btn"
                                title="Hủy lịch"
                                onClick={() =>
                                  handleCancelAppointment(appointment.id)
                                }
                              >
                                <Edit size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="appointment-content">
                          <div className="appointment-counselor">
                            <div className="counselor-avatar-small">
                              <User />
                            </div>
                            <div>
                              <h4>{appointment.counselorName}</h4>
                              <p>{counselor?.specialty || 'Tư vấn viên'}</p>
                            </div>
                          </div>
                          <div className="appointment-details">
                            <div className="detail-item">
                              <Calendar size={16} />
                              <span>{appointment.date}</span>
                            </div>
                            <div className="detail-item">
                              <Clock size={16} />
                              <span>{appointment.time}</span>
                            </div>
                            <div className="detail-item">
                              {appointment.type === 'video' && (
                                <Video size={16} />
                              )}
                              {appointment.type === 'phone' && (
                                <Phone size={16} />
                              )}
                              {appointment.type === 'chat' && (
                                <MessageCircle size={16} />
                              )}
                              <span>
                                {
                                  consultationTypes.find(
                                    t => t.id === appointment.type
                                  )?.name
                                }
                              </span>
                            </div>
                          </div>
                          {appointment.reason && (
                            <div className="appointment-reason">
                              <p>
                                <strong>Lý do tư vấn:</strong>{' '}
                                {appointment.reason}
                              </p>
                            </div>
                          )}
                          {canJoin && (
                            <div className="appointment-cta">
                              <button className="join-btn">
                                Tham gia tư vấn
                                <ArrowRight size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="empty-appointments">
                <div className="empty-icon">
                  <Calendar size={64} />
                </div>
                <h3>Chưa có lịch hẹn nào</h3>
                <p>
                  Bạn chưa đặt lịch tư vấn nào. Hãy đặt lịch với các chuyên gia
                  của chúng tôi!
                </p>
                <button
                  className="book-now-btn"
                  onClick={() => setActiveTab('book')}
                >
                  Đặt lịch ngay
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Consultation;
