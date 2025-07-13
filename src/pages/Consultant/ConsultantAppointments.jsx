import React, { useState, useEffect } from 'react';
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
import { getConsultationBookingsAPI } from '../../services/ConsultantService';
import instance from '../../services/customize-axios';

const ConsultantAppointments = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Appointments data - sẽ được thay thế bằng API calls
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedConsultationId, setSelectedConsultationId] = useState(null);
  const [consultationDetail, setConsultationDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getConsultationBookingsAPI();
        if (Array.isArray(data)) {
          setAppointments(data);
        } else {
          setAppointments([]);
        }
      } catch (err) {
        setError('Không thể tải danh sách cuộc hẹn');
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, []);

  // Mapping lại dữ liệu từ API
  const mappedAppointments = appointments.map(item => ({
    id: item.id,
    patientName: item.userName,
    patientId: item.userId,
    consultantName: item.consultantName,
    consultantId: item.consultantId,
    startTime: item.startTime,
    endTime: item.endTime,
    status: item.status?.toLowerCase(),
    type: item.consultationType?.toLowerCase(),
    notes: item.notes,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    // FE có thể bổ sung avatar nếu backend trả về
    avatar: '',
    // FE có thể bổ sung các trường khác nếu backend trả về
  }));

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
      case 'scheduled':
        return 'Đã lên lịch'; // hoặc 'Sắp tới'
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

  const handleViewDetails = async (appointmentId) => {
    setSelectedConsultationId(appointmentId);
    setShowDetailModal(true);
    setDetailLoading(true);
    setDetailError(null);
    setConsultationDetail(null);
    try {
      const res = await instance.get(`/api/consultation/${appointmentId}`);
      setConsultationDetail(res.data);
    } catch (err) {
      setDetailError('Không thể tải chi tiết cuộc hẹn');
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredAppointments = mappedAppointments.filter(appointment => {
    const matchesSearch =
      appointment.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || appointment.status === statusFilter;
    const matchesType = typeFilter === 'all' || appointment.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Tách danh sách theo trạng thái
  const upcomingAppointments = filteredAppointments.filter(
    apt => apt.status === 'scheduled' || apt.status === 'confirmed' || apt.status === 'pending'
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
              <img src={appointment.avatar || 'https://i.pravatar.cc/100?u=' + appointment.patientId} alt={appointment.patientName} />
            </div>
            <div className="patient-details">
              <h4>{appointment.patientName}</h4>
              <p className="appointment-reason">{appointment.notes || 'Không có ghi chú'}</p>
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
              {appointment.startTime ? new Date(appointment.startTime).toLocaleString('vi-VN') : '--'}
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
        {/* Footer actions giữ nguyên */}
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
    );
  };

  // Render danh sách theo tab
  let currentList = [];
  if (activeTab === 'upcoming') currentList = upcomingAppointments;
  if (activeTab === 'completed') currentList = completedAppointments;
  if (activeTab === 'cancelled') currentList = cancelledAppointments;

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

      {loading ? (
        <div style={{textAlign:'center',padding:'2rem'}}>
          <span>Đang tải dữ liệu...</span>
        </div>
      ) : error ? (
        <div style={{textAlign:'center',padding:'2rem',color:'#ef4444'}}>{error}</div>
      ) : (
        <div className="appointments-content">
          <div className="appointments-tabs">
            <div className={`tab${activeTab==='upcoming'?' active':''}`} onClick={()=>setActiveTab('upcoming')}>
              <span>Sắp tới</span>
              <span className="tab-count">{upcomingAppointments.length}</span>
            </div>
            <div className={`tab${activeTab==='completed'?' active':''}`} onClick={()=>setActiveTab('completed')}>
              <span>Hoàn thành</span>
              <span className="tab-count">{completedAppointments.length}</span>
            </div>
            <div className={`tab${activeTab==='cancelled'?' active':''}`} onClick={()=>setActiveTab('cancelled')}>
              <span>Đã hủy</span>
              <span className="tab-count">{cancelledAppointments.length}</span>
            </div>
          </div>
          <div className="appointments-grid">
            {currentList.map(renderAppointmentCard)}
            {currentList.length === 0 && (
              <div className="empty-state">
                <Calendar size={48} />
                <h3>Không có cuộc hẹn nào</h3>
                <p>Bạn chưa có cuộc hẹn nào ở mục này</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal chi tiết consultation */}
      {showDetailModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{minWidth:400,maxWidth:600,background:'#fff',borderRadius:12,padding:24,boxShadow:'0 2px 16px rgba(0,0,0,0.12)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <h2 style={{fontSize:'1.2rem',fontWeight:700}}>Chi tiết cuộc hẹn</h2>
              <button onClick={()=>setShowDetailModal(false)} style={{background:'none',border:'none',fontSize:20,cursor:'pointer'}}>&times;</button>
            </div>
            {detailLoading ? (
              <div style={{textAlign:'center',padding:'2rem'}}>Đang tải chi tiết...</div>
            ) : detailError ? (
              <div style={{color:'#ef4444',textAlign:'center'}}>{detailError}</div>
            ) : consultationDetail ? (
              <div style={{lineHeight:1.7}}>
                <div><b>Bệnh nhân:</b> {consultationDetail.userName}</div>
                <div><b>Bác sĩ:</b> {consultationDetail.consultantName}</div>
                <div><b>Thời gian:</b> {consultationDetail.timeSlot && consultationDetail.timeSlot.slotDate ? new Date(consultationDetail.timeSlot.slotDate).toLocaleDateString('vi-VN') : '--'}</div>
                <div><b>Trạng thái:</b> {getStatusText(consultationDetail.status?.toLowerCase())}</div>
                <div><b>Loại tư vấn:</b> {consultationDetail.timeSlot && consultationDetail.timeSlot.slotType ? (consultationDetail.timeSlot.slotType === 'FACILITY' ? 'Xét nghiệm' : (consultationDetail.timeSlot.slotType === 'CONSULTATION' ? 'Tư vấn' : consultationDetail.timeSlot.slotType)) : '--'}</div>
                <div><b>Meeting link:</b> {consultationDetail.meetingLink ? <a href={consultationDetail.meetingLink} target="_blank" rel="noopener noreferrer">{consultationDetail.meetingLink}</a> : '--'}</div>
                <div><b>Ghi chú:</b> {consultationDetail.notes || '--'}</div>
                <div><b>Ngày tạo:</b> {consultationDetail.createdAt ? new Date(consultationDetail.createdAt).toLocaleString('vi-VN') : '--'}</div>
              </div>
            ) : null}
          </div>
          <div className="modal-backdrop" onClick={()=>setShowDetailModal(false)} style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.15)',zIndex:10}}></div>
        </div>
      )}
    </div>
  );
};

export default ConsultantAppointments;
