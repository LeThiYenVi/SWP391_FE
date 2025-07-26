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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Divider
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  VideoCall as VideoCallIcon,
  Person as PersonIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  Close as CloseIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { getConsultationBookingsAPI } from '../../services/ConsultantService';
import { confirmConsultationAPI, updateConsultationStatusAPI, confirmWithMeetingLinkAPI } from '../../services/ConsultationService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const ConsultantAppointments = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [confirmationForm, setConfirmationForm] = useState({
    status: 'CONFIRMED',
    meetingLink: '',
    notes: '',
    meetingPassword: '',
    meetingPlatform: 'ZOOM'
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getConsultationBookingsAPI();
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Không thể tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = (booking) => {
    setSelectedBooking(booking);
    setConfirmationForm({
      status: 'CONFIRMED',
      meetingLink: '',
      notes: '',
      meetingPassword: '',
      meetingPlatform: 'ZOOM'
    });
    setConfirmationDialogOpen(true);
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setConfirmationForm({
      status: 'CANCELLED',
      meetingLink: '',
      notes: '',
      meetingPassword: '',
      meetingPlatform: 'ZOOM'
    });
    setConfirmationDialogOpen(true);
  };

  const handleAutoConfirmBooking = async (booking) => {
    try {
      setConfirmationLoading(true);
      
      const result = await confirmWithMeetingLinkAPI(booking.id);
      
      toast.success(`Đã xác nhận lịch hẹn và tạo meeting link tự động! Link: ${result.meetingLink}`);
      fetchBookings(); // Refresh the list
      
    } catch (error) {
      console.error('Error auto-confirming booking:', error);
      toast.error(error.response?.data?.message || 'Không thể xác nhận lịch hẹn tự động');
    } finally {
      setConfirmationLoading(false);
    }
  };

  const handleConfirmationSubmit = async () => {
    if (!selectedBooking) return;

    if (confirmationForm.status === 'CONFIRMED' && !confirmationForm.meetingLink) {
      toast.error('Vui lòng nhập link meeting cho lịch hẹn đã xác nhận');
      return;
    }

    try {
      setConfirmationLoading(true);
      
      const result = await confirmConsultationAPI(selectedBooking.id, confirmationForm);
      
             toast.success(confirmationForm.status === 'CONFIRMED' 
         ? 'Đã xác nhận lịch hẹn và gửi link meeting!' 
         : 'Đã hủy lịch hẹn');
      
      setConfirmationDialogOpen(false);
      setSelectedBooking(null);
      fetchBookings(); // Refresh the list
      
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast.error(error.response?.data?.message || 'Không thể xác nhận lịch hẹn');
    } finally {
      setConfirmationLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateConsultationStatusAPI(bookingId, { status: newStatus });
      toast.success('Cập nhật trạng thái thành công');
      fetchBookings();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'SCHEDULED': 'warning',
      'CONFIRMED': 'success',
      'IN_PROGRESS': 'info',
      'COMPLETED': 'primary',
      'CANCELLED': 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      'SCHEDULED': 'Đã lên lịch',
      'CONFIRMED': 'Đã xác nhận',
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
        Lịch hẹn tư vấn
      </Typography>
      <Typography variant="h6" color="text.secondary" mb={4}>
        Quản lý và xác nhận các lịch hẹn tư vấn
      </Typography>

      {bookings.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Chưa có lịch hẹn tư vấn nào
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Ngày giờ</TableCell>
                <TableCell>Hình thức</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2, width: 40, height: 40 }}>
                        {booking.customerName?.charAt(0) || 'K'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {booking.customerName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.customerEmail}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {formatDateTime(booking.startTime)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDateTime(booking.endTime)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={booking.consultationType === 'ONLINE' ? 'Trực tuyến' : 'Trực tiếp'}
                      color={booking.consultationType === 'ONLINE' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getStatusText(booking.status)}
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {booking.notes || 'Không có ghi chú'}
                      </Typography>
                      {booking.meetingLink && (
                        <Typography 
                          variant="body2" 
                          color="primary" 
                          sx={{ 
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontSize: '0.75rem'
                          }}
                          onClick={() => window.open(booking.meetingLink, '_blank')}
                        >
                          📹 Link Meeting
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      {/* SCHEDULED: Có thể xác nhận hoặc hủy */}
                      {booking.status === 'SCHEDULED' && (
                        <>
                          <Tooltip title="Xác nhận và tạo link tự động">
                            <IconButton
                              color="success"
                              size="small"
                              onClick={() => handleAutoConfirmBooking(booking)}
                              disabled={confirmationLoading}
                            >
                              {confirmationLoading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xác nhận thủ công">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleConfirmBooking(booking)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hủy lịch hẹn">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      
                      {/* CONFIRMED: Có thể bắt đầu tư vấn hoặc hủy */}
                      {booking.status === 'CONFIRMED' && (
                        <>
                          <Tooltip title="Bắt đầu tư vấn">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleStatusUpdate(booking.id, 'IN_PROGRESS')}
                            >
                              <VideoCallIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hủy lịch hẹn">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      
                      {/* IN_PROGRESS: Có thể hoàn thành hoặc hủy */}
                      {booking.status === 'IN_PROGRESS' && (
                        <>
                          <Tooltip title="Hoàn thành tư vấn">
                            <IconButton
                              color="success"
                              size="small"
                              onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hủy lịch hẹn">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      
                      {/* COMPLETED: Không có thao tác */}
                      {booking.status === 'COMPLETED' && (
                        <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                          Đã hoàn thành
                        </Typography>
                      )}
                      
                      {/* CANCELLED: Không có thao tác */}
                      {booking.status === 'CANCELLED' && (
                        <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                          Đã hủy
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirmation Dialog */}
      <Dialog 
        open={confirmationDialogOpen} 
        onClose={() => setConfirmationDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
                 <DialogTitle>
           <Box display="flex" justifyContent="space-between" alignItems="center">
             <Typography variant="h6">
               {confirmationForm.status === 'CONFIRMED' ? 'Xác nhận lịch hẹn' : 'Hủy lịch hẹn'}
             </Typography>
             <IconButton onClick={() => setConfirmationDialogOpen(false)}>
               <CloseIcon />
             </IconButton>
           </Box>
         </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3}>
            {confirmationForm.status === 'CONFIRMED' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Link Meeting *"
                    value={confirmationForm.meetingLink}
                    onChange={(e) => setConfirmationForm({
                      ...confirmationForm,
                      meetingLink: e.target.value
                    })}
                    fullWidth
                    placeholder="https://zoom.us/j/..."
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Nền tảng</InputLabel>
                    <Select
                      value={confirmationForm.meetingPlatform}
                      onChange={(e) => setConfirmationForm({
                        ...confirmationForm,
                        meetingPlatform: e.target.value
                      })}
                      label="Nền tảng"
                    >
                      <MenuItem value="ZOOM">Zoom</MenuItem>
                      <MenuItem value="GOOGLE_MEET">Google Meet</MenuItem>
                      <MenuItem value="TEAMS">Microsoft Teams</MenuItem>
                      <MenuItem value="SKYPE">Skype</MenuItem>
                      <MenuItem value="OTHER">Khác</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Mật khẩu (tùy chọn)"
                    value={confirmationForm.meetingPassword}
                    onChange={(e) => setConfirmationForm({
                      ...confirmationForm,
                      meetingPassword: e.target.value
                    })}
                    fullWidth
                    placeholder="Nhập mật khẩu nếu có"
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                label="Ghi chú"
                multiline
                rows={3}
                value={confirmationForm.notes}
                onChange={(e) => setConfirmationForm({
                  ...confirmationForm,
                  notes: e.target.value
                })}
                fullWidth
                               placeholder={confirmationForm.status === 'CONFIRMED' 
                 ? "Ghi chú cho khách hàng..." 
                 : "Lý do hủy lịch hẹn..."}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setConfirmationDialogOpen(false)}
            disabled={confirmationLoading}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color={confirmationForm.status === 'CONFIRMED' ? 'success' : 'error'}
            onClick={handleConfirmationSubmit}
            disabled={confirmationLoading}
            startIcon={confirmationLoading ? <CircularProgress size={20} /> : 
              (confirmationForm.status === 'CONFIRMED' ? <CheckCircleIcon /> : <CancelIcon />)}
          >
                         {confirmationLoading ? 'Đang xử lý...' : 
               (confirmationForm.status === 'CONFIRMED' ? 'Xác nhận' : 'Hủy')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsultantAppointments;
