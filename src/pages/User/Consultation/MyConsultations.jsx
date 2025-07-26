import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  Link
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  VideoCall as VideoCallIcon,
  Person as PersonIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  Close as CloseIcon,
  Launch as LaunchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import { getUserConsultationsAPI, cancelConsultationAPI } from '../../../services/ConsultationService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const MyConsultations = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await getUserConsultationsAPI();
      setConsultations(data || []);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast.error('Không thể tải danh sách lịch hẹn tư vấn');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (consultation) => {
    setSelectedConsultation(consultation);
    setDetailDialogOpen(true);
  };

  const handleCancelConsultation = async () => {
    if (!selectedConsultation) return;

    try {
      setCancelLoading(true);
      await cancelConsultationAPI(selectedConsultation.id);
      toast.success('Đã hủy lịch hẹn tư vấn');
      setDetailDialogOpen(false);
      setSelectedConsultation(null);
      fetchConsultations();
    } catch (error) {
      console.error('Error canceling consultation:', error);
      toast.error(error.response?.data?.message || 'Không thể hủy lịch hẹn');
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'warning',
      'CONFIRMED': 'success',
      'REJECTED': 'error',
      'IN_PROGRESS': 'info',
      'COMPLETED': 'primary',
      'CANCELLED': 'default'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      'PENDING': 'Chờ xác nhận',
      'CONFIRMED': 'Đã xác nhận',
      'REJECTED': 'Đã từ chối',
      'IN_PROGRESS': 'Đang diễn ra',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy'
    };
    return texts[status] || status;
  };

  const formatDateTime = (dateTime) => {
    try {
      return format(new Date(dateTime), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      return dateTime;
    }
  };

  const canCancel = (consultation) => {
    return consultation.status === 'PENDING' || consultation.status === 'CONFIRMED';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Lịch hẹn tư vấn của tôi
      </Typography>
      <Typography variant="h6" color="text.secondary" mb={4}>
        Xem và quản lý các lịch hẹn tư vấn của bạn
      </Typography>

      {consultations.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              Bạn chưa có lịch hẹn tư vấn nào
            </Typography>
            <Button
              variant="contained"
              startIcon={<ScheduleIcon />}
              onClick={() => window.location.href = '/tu-van'}
            >
              Đặt lịch tư vấn ngay
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {consultations.map((consultation) => (
            <Grid item xs={12} md={6} lg={4} key={consultation.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent>
                  {/* Consultant Info */}
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 2, width: 50, height: 50 }}>
                      {consultation.consultantName?.charAt(0) || 'T'}
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography variant="h6" fontWeight="bold">
                        {consultation.consultantName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {consultation.consultantSpecialization || 'Tư vấn viên'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Status */}
                  <Box mb={2}>
                    <Chip 
                      label={getStatusText(consultation.status)}
                      color={getStatusColor(consultation.status)}
                      size="small"
                    />
                  </Box>

                  {/* Time */}
                  <Box display="flex" alignItems="center" mb={2}>
                    <EventIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2">
                      {formatDateTime(consultation.startTime)}
                    </Typography>
                  </Box>

                  {/* Type */}
                  <Box display="flex" alignItems="center" mb={2}>
                    <VideoCallIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2">
                      {consultation.consultationType === 'ONLINE' ? 'Tư vấn trực tuyến' : 'Tư vấn trực tiếp'}
                    </Typography>
                  </Box>

                  {/* Notes */}
                  {consultation.notes && (
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {consultation.notes}
                      </Typography>
                    </Box>
                  )}

                  {/* Actions */}
                  <Box display="flex" gap={1} mt={2}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(consultation)}
                      fullWidth
                    >
                      Xem chi tiết
                    </Button>
                    {canCancel(consultation) && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleViewDetails(consultation)}
                      >
                        Hủy
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Detail Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Chi tiết lịch hẹn tư vấn
            </Typography>
            <IconButton onClick={() => setDetailDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {selectedConsultation && (
            <Grid container spacing={3}>
              {/* Consultant Info */}
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ mr: 2, width: 60, height: 60 }}>
                    {selectedConsultation.consultantName?.charAt(0) || 'T'}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedConsultation.consultantName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedConsultation.consultantSpecialization || 'Tư vấn viên'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Status */}
              <Grid item xs={12}>
                <Chip 
                  label={getStatusText(selectedConsultation.status)}
                  color={getStatusColor(selectedConsultation.status)}
                  size="medium"
                />
              </Grid>

              {/* Time */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Thời gian bắt đầu
                </Typography>
                <Typography variant="body1">
                  {formatDateTime(selectedConsultation.startTime)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Thời gian kết thúc
                </Typography>
                <Typography variant="body1">
                  {formatDateTime(selectedConsultation.endTime)}
                </Typography>
              </Grid>

              {/* Type */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Hình thức tư vấn
                </Typography>
                <Typography variant="body1">
                  {selectedConsultation.consultationType === 'ONLINE' ? 'Tư vấn trực tuyến' : 'Tư vấn trực tiếp'}
                </Typography>
              </Grid>

              {/* Meeting Link */}
              {selectedConsultation.meetingLink && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Link Meeting
                  </Typography>
                  <Link 
                    href={selectedConsultation.meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    display="flex"
                    alignItems="center"
                    sx={{ textDecoration: 'none' }}
                  >
                    <LaunchIcon sx={{ mr: 1, fontSize: 16 }} />
                    Tham gia meeting
                  </Link>
                </Grid>
              )}

              {/* Notes */}
              {selectedConsultation.notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ghi chú
                  </Typography>
                  <Typography variant="body1">
                    {selectedConsultation.notes}
                  </Typography>
                </Grid>
              )}

              {/* Consultant Notes */}
              {selectedConsultation.consultantNotes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ghi chú từ tư vấn viên
                  </Typography>
                  <Typography variant="body1">
                    {selectedConsultation.consultantNotes}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setDetailDialogOpen(false)}
            disabled={cancelLoading}
          >
            Đóng
          </Button>
          {selectedConsultation && canCancel(selectedConsultation) && (
            <Button
              variant="contained"
              color="error"
              onClick={handleCancelConsultation}
              disabled={cancelLoading}
              startIcon={cancelLoading ? <CircularProgress size={20} /> : <CancelIcon />}
            >
              {cancelLoading ? 'Đang hủy...' : 'Hủy lịch hẹn'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyConsultations; 