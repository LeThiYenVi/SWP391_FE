import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Science as ScienceIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  Info as InfoIcon,
  LocalHospital as LocalHospitalIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserBookingsAPI, confirmConsultationAPI, cancelConsultationAPI } from '../../services/ConsultationService';
import BookingService from '../../services/BookingService';

const BookingConfirmation = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [pendingBookings, setPendingBookings] = useState([]);
  const [pendingConsultations, setPendingConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [bookingType, setBookingType] = useState(''); // 'booking' hoặc 'consultation'

  useEffect(() => {
    if (isAuthenticated) {
      loadPendingBookings();
      loadPendingConsultations();
    }
  }, [isAuthenticated]);

  const loadPendingBookings = async () => {
    try {
      setLoading(true);
      const result = await BookingService.getUserBookings();
      console.log('Raw booking result:', result);

      if (result.success && result.data) {
        // Lọc chỉ lấy các booking có status PENDING (do consultant tạo)
        const pending = result.data.filter(booking => booking.status === 'PENDING');
        console.log('Pending bookings:', pending);
        setPendingBookings(pending);
      } else {
        console.log('No pending bookings found');
        setPendingBookings([]);
      }
    } catch (error) {
      console.error('Error loading pending bookings:', error);
      toast.error('Không thể tải danh sách lịch hẹn');
      setPendingBookings([]);
    }
  };

  const loadPendingConsultations = async () => {
    try {
      const result = await getUserBookingsAPI();
      console.log('Raw consultation result:', result);

      if (result) {
        // Lọc chỉ lấy các consultation có status SCHEDULED
        const scheduled = result.filter(consultation => consultation.status === 'SCHEDULED');
        console.log('Scheduled consultations:', scheduled);
        setPendingConsultations(scheduled);
      } else {
        console.log('No pending consultations found');
        setPendingConsultations([]);
      }
    } catch (error) {
      console.error('Error loading pending consultations:', error);
      toast.error('Không thể tải danh sách lịch tư vấn');
      setPendingConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (id, type) => {
    try {
      console.log('Confirming booking with ID:', id, 'Type:', type);
      console.log('Selected booking:', selectedBooking);

      if (!id) {
        toast.error('Không tìm thấy ID lịch hẹn');
        return;
      }

      setConfirming(true);
      let result;

      if (type === 'booking') {
        // Xác nhận booking (STI Testing)
        result = await BookingService.confirmBooking(id);
      } else if (type === 'consultation') {
        // Xác nhận consultation (Tư vấn)
        result = await confirmConsultationAPI(id, {
          status: 'CONFIRMED',
          meetingLink: '',
          notes: 'Confirmed by user'
        });
      }

      if (result && result.success !== false) {
        toast.success('Xác nhận lịch hẹn thành công!');
        loadPendingBookings();
        loadPendingConsultations();
        setShowConfirmDialog(false);
        setSelectedBooking(null);
        setBookingType('');
      } else {
        toast.error(result?.message || 'Không thể xác nhận lịch hẹn');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast.error('Không thể xác nhận lịch hẹn');
    } finally {
      setConfirming(false);
    }
  };

  const handleCancelBooking = async (id, type) => {
    try {
      if (!id) {
        toast.error('Không tìm thấy ID lịch hẹn');
        return;
      }

      setConfirming(true);
      let result;

      if (type === 'booking') {
        // Hủy booking (STI Testing)
        result = await BookingService.cancelBooking(id);
      } else if (type === 'consultation') {
        // Hủy consultation (Tư vấn)
        result = await cancelConsultationAPI(id);
      }

      if (result && result.success !== false) {
        toast.success('Hủy lịch hẹn thành công!');
        loadPendingBookings();
        loadPendingConsultations();
        setShowConfirmDialog(false);
        setSelectedBooking(null);
        setBookingType('');
      } else {
        toast.error(result?.message || 'Không thể hủy lịch hẹn');
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
      toast.error('Không thể hủy lịch hẹn');
    } finally {
      setConfirming(false);
    }
  };

  const openConfirmDialog = (booking, type) => {
    setSelectedBooking(booking);
    setBookingType(type);
    setShowConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setSelectedBooking(null);
    setBookingType('');
    setShowConfirmDialog(false);
  };



  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5); // Format HH:mm
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'dd/MM/yyyy', { locale: vi });
  };

  if (!isAuthenticated) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Alert severity="info">
          Vui lòng đăng nhập để xem lịch hẹn cần xác nhận
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header với nút quay lại */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            mr: 2
          }}
        >
          Quay lại Dashboard
        </Button>
        <Typography variant="h4" sx={{
          fontWeight: 700,
          color: '#1976d2',
          flex: 1,
          textAlign: 'center'
        }}>
          Lịch hẹn cần xác nhận
        </Typography>
      </Box>

      {pendingBookings.length === 0 && pendingConsultations.length === 0 ? (
        <Card sx={{
          mt: 3,
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <InfoIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
              Không có lịch hẹn nào cần xác nhận
            </Typography>
            <Typography variant="body1" sx={{ color: '#999' }}>
              Tất cả lịch hẹn của bạn đã được xác nhận hoặc đã hoàn thành
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {/* Booking Section */}
          {pendingBookings.length > 0 && (
            <Box mb={4}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                Lịch xét nghiệm cần xác nhận
              </Typography>
              <Grid container spacing={3}>
                {pendingBookings.map((booking) => (
                  <Grid item xs={12} md={6} lg={4} key={booking.id}>
                    <Card sx={{
                      borderRadius: '20px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        {/* Header */}
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                          <Chip
                            label="Chờ xác nhận"
                            color="warning"
                            size="small"
                            icon={<ScheduleIcon />}
                          />
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            ID: {booking.id}
                          </Typography>
                        </Box>

                        {/* Service Info */}
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <Avatar sx={{
                            width: 48,
                            height: 48,
                            backgroundColor: '#e8f5e8'
                          }}>
                            <LocalHospitalIcon sx={{ color: '#4caf50' }} />
                          </Avatar>
                          <Box flex={1}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                              {booking.serviceName || 'Xét nghiệm STI'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                              Xét nghiệm tại phòng khám
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Time & Date */}
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <EventIcon sx={{ color: '#1976d2' }} />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {formatDate(booking.timeSlot?.slotDate)}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={2} mb={3}>
                          <AccessTimeIcon sx={{ color: '#1976d2' }} />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {formatTime(booking.timeSlot?.startTime)} - {formatTime(booking.timeSlot?.endTime)}
                          </Typography>
                        </Box>

                        {/* Action Button */}
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => openConfirmDialog(booking, 'booking')}
                          sx={{
                            borderRadius: '12px',
                            py: 1.5,
                            fontWeight: 600,
                            textTransform: 'none',
                            backgroundColor: '#1976d2',
                            '&:hover': {
                              backgroundColor: '#1565c0'
                            }
                          }}
                        >
                          Xem chi tiết & Xác nhận
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Consultation Section */}
          {pendingConsultations.length > 0 && (
            <Box>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                Lịch tư vấn cần xác nhận
              </Typography>
              <Grid container spacing={3}>
                {pendingConsultations.map((consultation) => (
                  <Grid item xs={12} md={6} lg={4} key={consultation.id}>
                    <Card sx={{
                      borderRadius: '20px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        {/* Header */}
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                          <Chip
                            label="Chờ xác nhận"
                            color="warning"
                            size="small"
                            icon={<ScheduleIcon />}
                          />
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            ID: {consultation.id}
                          </Typography>
                        </Box>

                        {/* Consultant Info */}
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <Avatar sx={{
                            width: 48,
                            height: 48,
                            backgroundColor: '#e3f2fd'
                          }}>
                            <PersonIcon sx={{ color: '#1976d2' }} />
                          </Avatar>
                          <Box flex={1}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                              {consultation.consultantName || 'Tư vấn viên'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                              Tư vấn trực tuyến
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Time & Date */}
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <EventIcon sx={{ color: '#1976d2' }} />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {formatDate(consultation.startTime)}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={2} mb={3}>
                          <AccessTimeIcon sx={{ color: '#1976d2' }} />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {formatTime(consultation.startTime)} - {formatTime(consultation.endTime)}
                          </Typography>
                        </Box>

                        {/* Action Button */}
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => openConfirmDialog(consultation, 'consultation')}
                          sx={{
                            borderRadius: '12px',
                            py: 1.5,
                            fontWeight: 600,
                            textTransform: 'none',
                            backgroundColor: '#1976d2',
                            '&:hover': {
                              backgroundColor: '#1565c0'
                            }
                          }}
                        >
                          Xem chi tiết & Xác nhận
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      )}

      {/* Confirmation Dialog */}
      <Dialog 
        open={showConfirmDialog} 
        onClose={closeConfirmDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <InfoIcon sx={{ color: '#1976d2' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {bookingType === 'booking' ? 'Xác nhận lịch xét nghiệm' : 'Xác nhận lịch tư vấn'}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {selectedBooking && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Bạn có chắc chắn muốn <strong>XÁC NHẬN</strong> {bookingType === 'booking' ? 'lịch xét nghiệm' : 'lịch tư vấn'} này?
              </Typography>

              <Card sx={{
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                p: 2,
                mb: 2
              }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Thông tin {bookingType === 'booking' ? 'lịch xét nghiệm' : 'lịch tư vấn'}:
                </Typography>

                {bookingType === 'booking' ? (
                  <>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      • Dịch vụ: {selectedBooking.serviceName || 'Xét nghiệm STI'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      • Ngày: {formatDate(selectedBooking.timeSlot?.slotDate)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      • Giờ: {formatTime(selectedBooking.timeSlot?.startTime)} - {formatTime(selectedBooking.timeSlot?.endTime)}
                    </Typography>
                    {selectedBooking.description && (
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        • Ghi chú: {selectedBooking.description}
                      </Typography>
                    )}
                  </>
                ) : (
                  <>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      • Tư vấn viên: {selectedBooking.consultantName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      • Ngày: {formatDate(selectedBooking.startTime)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      • Giờ: {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                    </Typography>
                    {selectedBooking.description && (
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        • Ghi chú: {selectedBooking.description}
                      </Typography>
                    )}
                  </>
                )}
              </Card>

              <Alert severity="info" sx={{ borderRadius: '8px' }}>
                Sau khi xác nhận, lịch hẹn sẽ được chuyển sang trạng thái "Đã xác nhận" và bạn sẽ nhận được thông báo chi tiết.
              </Alert>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={closeConfirmDialog}
            disabled={confirming}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              const id = selectedBooking?.bookingId || selectedBooking?.id;
              console.log('Button clicked - ID:', id, 'Type:', bookingType);
              handleConfirmBooking(id, bookingType);
            }}
            disabled={confirming}
            startIcon={confirming ? <CircularProgress size={16} /> : <CheckCircleIcon />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            {confirming ? 'Đang xác nhận...' : 'Xác nhận'}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              const id = selectedBooking?.bookingId || selectedBooking?.id;
              console.log('Cancel button clicked - ID:', id, 'Type:', bookingType);
              handleCancelBooking(id, bookingType);
            }}
            disabled={confirming}
            startIcon={confirming ? <CircularProgress size={16} /> : <CancelIcon />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            {confirming ? 'Đang hủy...' : 'Từ chối'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingConfirmation; 