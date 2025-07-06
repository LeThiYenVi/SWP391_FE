import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MessageCircle,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Phone as PhoneIcon,
  Video as VideoIcon,
  MessageSquare,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import './ConsultantAppointments.css';

const ConsultantAppointments = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock appointments data
  const appointments = [
    {
      id: 1,
      patientName: 'Nguyễn Thị Mai',
      patientPhone: '0901234567',
      patientEmail: 'mai.nguyen@email.com',
      date: '2024-01-15',
      time: '10:00',
      duration: 30,
      type: 'video',
      status: 'confirmed',
      reason: 'Tư vấn chu kỳ kinh nguyệt',
      notes: 'Bệnh nhân cần tư vấn về chu kỳ không đều',
      avatar: '/images/patient1.jpg',
      isFirstTime: false,
      paymentStatus: 'paid',
    },
    {
      id: 2,
      patientName: 'Trần Thị Lan',
      patientPhone: '0901234568',
      patientEmail: 'lan.tran@email.com',
      date: '2024-01-15',
      time: '11:30',
      duration: 45,
      type: 'chat',
      status: 'pending',
      reason: 'Tư vấn kế hoạch hóa gia đình',
      notes: 'Bệnh nhân mới, cần tư vấn về biện pháp tránh thai',
      avatar: '/images/patient2.jpg',
      isFirstTime: true,
      paymentStatus: 'pending',
    },
    {
      id: 3,
      patientName: 'Lê Thị Hoa',
      patientPhone: '0901234569',
      patientEmail: 'hoa.le@email.com',
      date: '2024-01-15',
      time: '14:00',
      duration: 30,
      type: 'phone',
      status: 'confirmed',
      reason: 'Tư vấn sức khỏe sinh sản',
      notes: 'Theo dõi sau điều trị',
      avatar: '/images/patient3.jpg',
      isFirstTime: false,
      paymentStatus: 'paid',
    },
    {
      id: 4,
      patientName: 'Phạm Thị Ngọc',
      patientPhone: '0901234570',
      patientEmail: 'ngoc.pham@email.com',
      date: '2024-01-15',
      time: '15:30',
      duration: 30,
      type: 'video',
      status: 'completed',
      reason: 'Tư vấn thai sản',
      notes: 'Đã hoàn thành buổi tư vấn',
      avatar: '/images/patient4.jpg',
      isFirstTime: false,
      paymentStatus: 'paid',
    },
    {
      id: 5,
      patientName: 'Vũ Thị Trang',
      patientPhone: '0901234571',
      patientEmail: 'trang.vu@email.com',
      date: '2024-01-15',
      time: '16:00',
      duration: 30,
      type: 'chat',
      status: 'cancelled',
      reason: 'Tư vấn dinh dưỡng',
      notes: 'Bệnh nhân hủy lịch',
      avatar: '/images/patient5.jpg',
      isFirstTime: false,
      paymentStatus: 'refunded',
    },
  ];

  const getStatusColor = status => {
    switch (status) {
      case 'confirmed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'completed':
        return '#3b82f6';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const getTypeIcon = type => {
    switch (type) {
      case 'video':
        return VideoIcon;
      case 'phone':
        return PhoneIcon;
      case 'chat':
        return MessageSquare;
      default:
        return MessageCircle;
    }
  };

  const getTypeText = type => {
    switch (type) {
      case 'video':
        return 'Video Call';
      case 'phone':
        return 'Phone Call';
      case 'chat':
        return 'Chat';
      default:
        return 'Unknown';
    }
  };

  const handleConfirmAppointment = appointmentId => {
    console.log('Confirm appointment:', appointmentId);
  };

  const handleCancelAppointment = appointmentId => {
    console.log('Cancel appointment:', appointmentId);
  };

  const handleStartConsultation = (appointmentId, type) => {
    console.log('Start consultation:', appointmentId, type);
    // Navigate to consultation interface based on type
    if (type === 'video') {
      navigate(`/consultant/video-call/${appointmentId}`);
    } else if (type === 'phone') {
      navigate(`/consultant/phone-call/${appointmentId}`);
    } else if (type === 'chat') {
      navigate(`/consultant/chat/${appointmentId}`);
    }
  };

  const handleViewDetails = appointmentId => {
    navigate(`/consultant/appointment-details/${appointmentId}`);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch =
      appointment.patientName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || appointment.status === statusFilter;
    const matchesType = typeFilter === 'all' || appointment.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const upcomingAppointments = filteredAppointments.filter(
    apt => apt.status === 'confirmed' || apt.status === 'pending'
  );

  const completedAppointments = filteredAppointments.filter(
    apt => apt.status === 'completed'
  );

  const cancelledAppointments = filteredAppointments.filter(
    apt => apt.status === 'cancelled'
  );

  const renderAppointmentCard = appointment => {
    const TypeIcon = getTypeIcon(appointment.type);

    return (
      <div key={appointment.id} className="appointment-card">
        <div className="appointment-header">
          <div className="patient-info">
            <div className="patient-avatar">
              <img src={appointment.avatar} alt={appointment.patientName} />
              {appointment.isFirstTime && (
                <span className="first-time-badge">Lần đầu</span>
              )}
            </div>
            <div className="patient-details">
              <h4>{appointment.patientName}</h4>
              <p className="patient-contact">
                {appointment.patientPhone} • {appointment.patientEmail}
              </p>
              <p className="appointment-reason">{appointment.reason}</p>
            </div>
          </div>
          <div className="appointment-actions">
            <button
              className="action-btn"
              onClick={() => handleViewDetails(appointment.id)}
            >
              <Eye size={16} />
            </button>
            <button className="action-btn">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        <div className="appointment-meta">
          <div className="meta-item">
            <Clock size={16} />
            <span>
              {appointment.time} - {appointment.duration} phút
            </span>
          </div>
          <div className="meta-item">
            <TypeIcon size={16} />
            <span>{getTypeText(appointment.type)}</span>
          </div>
          <div className="meta-item">
            <div
              className="status-badge"
              style={{ backgroundColor: getStatusColor(appointment.status) }}
            >
              {getStatusText(appointment.status)}
            </div>
          </div>
        </div>

        {appointment.notes && (
          <div className="appointment-notes">
            <p>{appointment.notes}</p>
          </div>
        )}

        <div className="appointment-footer">
          {appointment.status === 'pending' && (
            <div className="appointment-actions-footer">
              <button
                className="btn btn-outline"
                onClick={() => handleCancelAppointment(appointment.id)}
              >
                <XCircle size={16} />
                Từ chối
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleConfirmAppointment(appointment.id)}
              >
                <CheckCircle size={16} />
                Xác nhận
              </button>
            </div>
          )}

          {appointment.status === 'confirmed' && (
            <div className="appointment-actions-footer">
              <button
                className="btn btn-outline"
                onClick={() => handleCancelAppointment(appointment.id)}
              >
                Hủy lịch
              </button>
              <button
                className="btn btn-success"
                onClick={() =>
                  handleStartConsultation(appointment.id, appointment.type)
                }
              >
                <TypeIcon size={16} />
                Bắt đầu tư vấn
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="consultant-appointments">
      <div className="appointments-header">
        <div className="header-content">
          <h1>Quản lý cuộc hẹn</h1>
          <p>Xem và quản lý tất cả các cuộc hẹn của bạn</p>
        </div>

        <div className="header-actions">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm bệnh nhân..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className="filter-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Lọc
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Trạng thái:</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Loại tư vấn:</label>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="video">Video Call</option>
              <option value="phone">Phone Call</option>
              <option value="chat">Chat</option>
            </select>
          </div>
        </div>
      )}

      <div className="appointments-content">
        <div className="appointments-tabs">
          <div className="tab active">
            <span>Sắp tới</span>
            <span className="tab-count">{upcomingAppointments.length}</span>
          </div>
          <div className="tab">
            <span>Hoàn thành</span>
            <span className="tab-count">{completedAppointments.length}</span>
          </div>
          <div className="tab">
            <span>Đã hủy</span>
            <span className="tab-count">{cancelledAppointments.length}</span>
          </div>
        </div>

        <div className="appointments-grid">
          {upcomingAppointments.map(renderAppointmentCard)}
          {upcomingAppointments.length === 0 && (
            <div className="empty-state">
              <Calendar size={48} />
              <h3>Không có cuộc hẹn nào</h3>
              <p>Bạn chưa có cuộc hẹn nào được lên lịch</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultantAppointments;
