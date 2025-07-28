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
  Rating,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Star as StarIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  VideoCall as VideoCallIcon,
  Message as MessageIcon,
  ThumbUp as ThumbUpIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import { getUserConsultationsAPI, cancelConsultationAPI } from '../../../services/ConsultationService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import FeedbackModal from '../../../components/FeedbackModal';
import FeedbackStatus from '../../../components/FeedbackStatus';

const MyConsultations = () => {
  const { user, isAuthenticated } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConsultations();
    }
  }, [isAuthenticated]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const response = await getUserConsultationsAPI();
      if (response.success && response.data) {
        setConsultations(response.data);
      } else {
        toast.error('Không thể tải danh sách lịch hẹn');
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast.error('Có lỗi xảy ra khi tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConsultation = async (consultationId) => {
    try {
      setCancellingId(consultationId);
      const response = await cancelConsultationAPI(consultationId);
      if (response.success) {
        toast.success('Hủy lịch hẹn thành công');
        fetchConsultations(); // Refresh list
      } else {
        toast.error(response.message || 'Không thể hủy lịch hẹn');
      }
    } catch (error) {
      console.error('Error cancelling consultation:', error);
      toast.error('Có lỗi xảy ra khi hủy lịch hẹn');
    } finally {
      setCancellingId(null);
      setCancelDialogOpen(false);
    }
  };

  const handleFeedbackClick = (consultation) => {
    setSelectedConsultation(consultation);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSubmitted = () => {
    fetchConsultations(); // Refresh to show feedback status
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'SCHEDULED':
        return 'warning';
      case 'CONFIRMED':
        return 'info';
      case 'IN_PROGRESS':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case 'SCHEDULED':
        return 'Đã lên lịch';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'IN_PROGRESS':
        return 'Đang diễn ra';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'SCHEDULED':
        return <PendingIcon />;
      case 'CONFIRMED':
        return <CheckCircleIcon />;
      case 'IN_PROGRESS':
        return <VideoCallIcon />;
      case 'COMPLETED':
        return <CheckCircleIcon />;
      case 'CANCELLED':
        return <CancelIcon />;
      default:
        return <PendingIcon />;
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    try {
      return format(new Date(dateTime), 'HH:mm - dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return dateTime;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Lịch hẹn tư vấn của tôi
      </Typography>

      {consultations.length === 0 ? (
        <Alert severity="info">
          Bạn chưa có lịch hẹn tư vấn nào. 
          <Button 
            color="primary" 
            sx={{ ml: 1 }}
            onClick={() => window.location.href = '/consultation'}
          >
            Đặt lịch ngay
          </Button>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {consultations.map((consultation) => (
            <Grid item xs={12} md={6} lg={4} key={consultation.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="div">
                        {consultation.consultantName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tư vấn viên
                      </Typography>
                    </Box>
                    <Chip
                      icon={getStatusIcon(consultation.status)}
                      label={getStatusText(consultation.status)}
                      color={getStatusColor(consultation.status)}
                      size="small"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Time Info */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {formatDateTime(consultation.startTime)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Notes */}
                  {consultation.notes && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Ghi chú: {consultation.notes}
                      </Typography>
                    </Box>
                  )}

                  {/* Meeting Link */}
                  {consultation.meetingLink && consultation.status === 'CONFIRMED' && (
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VideoCallIcon />}
                        href={consultation.meetingLink}
                        target="_blank"
                        fullWidth
                      >
                        Tham gia cuộc họp
                      </Button>
                    </Box>
                  )}

                  {/* Actions */}
                  <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Grid container spacing={1}>
                      {consultation.status === 'SCHEDULED' && (
                        <Grid item xs={6}>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<CancelIcon />}
                            onClick={() => {
                              setSelectedConsultation(consultation);
                              setCancelDialogOpen(true);
                            }}
                            fullWidth
                          >
                            Hủy lịch
                          </Button>
                        </Grid>
                      )}
                      
                      {consultation.status === 'COMPLETED' && (
                        <Grid item xs={12}>
                          <FeedbackStatus 
                            consultationId={consultation.id}
                            onFeedbackSubmitted={handleFeedbackSubmitted}
                            onFeedbackClick={() => handleFeedbackClick(consultation)}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Xác nhận hủy lịch hẹn</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn hủy lịch hẹn với {selectedConsultation?.consultantName}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            Không
          </Button>
          <Button 
            onClick={() => handleCancelConsultation(selectedConsultation?.id)}
            color="error"
            disabled={cancellingId === selectedConsultation?.id}
            startIcon={cancellingId === selectedConsultation?.id ? <CircularProgress size={16} /> : null}
          >
            {cancellingId === selectedConsultation?.id ? 'Đang hủy...' : 'Hủy lịch'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Modal */}
      <FeedbackModal
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        consultation={selectedConsultation}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />
    </Box>
  );
};

export default MyConsultations; 