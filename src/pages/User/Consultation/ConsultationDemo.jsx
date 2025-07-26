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
  Rating,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import './index.css';
import { 
  Star as StarIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  Close as CloseIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { format, addDays } from 'date-fns';
import { vi } from 'date-fns/locale';

// Mock data for demo
const mockConsultants = [
  {
    id: 1,
    fullName: 'Bác sĩ Nguyễn Thị Hương',
    specialization: 'Sản Phụ khoa',
    experienceYears: 10,
    rating: 4.5,
    consultations: 650
  },
  {
    id: 2,
    fullName: 'Bác sĩ Trần Văn Minh',
    specialization: 'Nội tiết - Sinh sản',
    experienceYears: 8,
    rating: 4.5,
    consultations: 650
  },
  {
    id: 3,
    fullName: 'Bác sĩ Lê Thị Lan',
    specialization: 'Tâm lý sức khỏe phụ nữ',
    experienceYears: 6,
    rating: 4.5,
    consultations: 650
  }
];

const mockAvailability = [
  { startTime: '08:00', endTime: '09:00' },
  { startTime: '09:00', endTime: '10:00' },
  { startTime: '10:00', endTime: '11:00' },
  { startTime: '14:00', endTime: '15:00' },
  { startTime: '15:00', endTime: '16:00' },
  { startTime: '16:00', endTime: '17:00' },
  { startTime: '17:00', endTime: '18:00' }
];

const ConsultationDemo = () => {
  const [consultants] = useState(mockConsultants);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    notes: '',
    consultationType: 'ONLINE'
  });

  // Generate available dates (next 14 days)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = addDays(today, i);
      dates.push({
        date: format(date, 'yyyy-MM-dd'),
        display: format(date, 'dd/MM/yyyy'),
        dayName: format(date, 'EEEE', { locale: vi }),
        isToday: i === 0
      });
    }
    return dates;
  };

  const availableDates = generateAvailableDates();

  const handleConsultantSelect = async (consultant) => {
    setSelectedConsultant(consultant);
    setBookingDialogOpen(true);
    
    // Simulate loading
    setAvailabilityLoading(true);
    setTimeout(() => {
      setAvailability(mockAvailability);
      setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
      setSelectedTimeSlot(null);
      setAvailabilityLoading(false);
    }, 1000);
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    
    if (selectedConsultant) {
      setAvailabilityLoading(true);
      setTimeout(() => {
        setAvailability(mockAvailability);
        setAvailabilityLoading(false);
      }, 500);
    }
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast.error('Vui lòng chọn ngày và giờ tư vấn');
      return;
    }

    try {
      setBookingLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Đặt lịch tư vấn thành công! Tư vấn viên sẽ xác nhận và gửi link meeting.');
      setBookingDialogOpen(false);
      setSelectedConsultant(null);
      setSelectedTimeSlot(null);
      setBookingForm({ notes: '', consultationType: 'ONLINE' });
      
    } catch (error) {
      console.error('Error booking consultation:', error);
      toast.error('Không thể đặt lịch tư vấn');
    } finally {
      setBookingLoading(false);
    }
  };

  const getSpecializationColor = (specialization) => {
    const colors = {
      'Dinh dưỡng & Kế hoạch hóa gia đình': 'primary',
      'Sản Phụ khoa': 'secondary',
      'Nội tiết - Sinh sản': 'success',
      'Tâm lý sức khỏe phụ nữ': 'warning',
      'default': 'default'
    };
    return colors[specialization] || colors.default;
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5); // Format HH:mm
  };

  return (
    <Box className="consultation-page">
      {/* Header */}
      <Box className="page-header">
        <Typography variant="h4" className="page-title">
          Tư vấn trực tuyến
        </Typography>
        <Typography variant="body1" className="page-subtitle">
          Đặt lịch tư vấn với các chuyên gia của chúng tôi
        </Typography>
      </Box>

      {/* Consultants Grid */}
      <Grid container spacing={3} className="consultants-grid">
        {consultants.map((consultant) => (
          <Grid item xs={12} md={4} key={consultant.id}>
            <Card className="consultant-card">
              <CardContent>
                {/* Consultant Info */}
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar 
                    className="consultant-avatar"
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      bgcolor: 'primary.main',
                      fontSize: '1.5rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {consultant.fullName?.charAt(0) || 'C'}
                  </Avatar>
                  <Box ml={2}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {consultant.fullName}
                    </Typography>
                    <Chip 
                      label={consultant.specialization || 'Tư vấn viên'}
                      color={getSpecializationColor(consultant.specialization)}
                      size="small"
                    />
                  </Box>
                </Box>

                {/* Rating */}
                <Box display="flex" alignItems="center" mb={2}>
                  <Rating 
                    value={consultant.rating} 
                    readOnly 
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {consultant.rating} • {consultant.consultations} buổi tư vấn
                  </Typography>
                </Box>

                {/* Experience */}
                <Box display="flex" alignItems="center" mb={2}>
                  <WorkIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    Kinh nghiệm: {consultant.experienceYears}+ năm kinh nghiệm
                  </Typography>
                </Box>

                {/* Expertise */}
                <Box display="flex" alignItems="center" mb={3}>
                  <PersonIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    Chuyên môn: {consultant.specialization || 'Tư vấn sức khỏe'}
                  </Typography>
                </Box>

                {/* Book Button */}
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ScheduleIcon />}
                  onClick={() => handleConsultantSelect(consultant)}
                  sx={{ mt: 'auto' }}
                >
                  Đặt lịch tư vấn
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Booking Dialog */}
      <Dialog 
        open={bookingDialogOpen} 
        onClose={() => setBookingDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" fontWeight="bold">
              Đặt lịch tư vấn
            </Typography>
            <IconButton onClick={() => setBookingDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {selectedConsultant && (
            <>
              {/* Selected Consultant Summary */}
              <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Box display="flex" alignItems="center">
                  <Avatar 
                    sx={{ 
                      width: 50, 
                      height: 50, 
                      bgcolor: 'primary.main',
                      mr: 2
                    }}
                  >
                    {selectedConsultant.fullName?.charAt(0) || 'C'}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedConsultant.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedConsultant.specialization || 'Tư vấn viên'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={3}>
                {/* Date Selection */}
                <Grid item xs={12}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Chọn ngày
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {availableDates.map((dateInfo) => (
                      <Button
                        key={dateInfo.date}
                        variant={selectedDate === dateInfo.date ? "contained" : "outlined"}
                        size="small"
                        onClick={() => handleDateChange(dateInfo.date)}
                        sx={{ 
                          minWidth: 'auto',
                          px: 2,
                          py: 1,
                          borderRadius: 2
                        }}
                      >
                        <Box textAlign="center">
                          <Typography variant="caption" display="block" fontWeight="bold">
                            {dateInfo.dayName}
                          </Typography>
                          <Typography variant="body2">
                            {dateInfo.display}
                          </Typography>
                          {dateInfo.isToday && (
                            <Typography variant="caption" color="primary" display="block">
                              Hôm nay
                            </Typography>
                          )}
                        </Box>
                      </Button>
                    ))}
                  </Box>
                </Grid>

                {/* Time Slots Grid */}
                {selectedDate && (
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Chọn giờ
                    </Typography>
                    {availabilityLoading ? (
                      <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress />
                      </Box>
                    ) : availability.length > 0 ? (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                          ✅ Có {availability.length} slot trống cho ngày {format(new Date(selectedDate), 'dd/MM/yyyy')}
                        </Typography>
                        <Grid container spacing={2}>
                          {availability.map((slot) => {
                            const isSelected = selectedTimeSlot?.startTime === slot.startTime;
                            return (
                              <Grid item xs={6} sm={4} md={3} key={slot.startTime}>
                                <Box
                                  onClick={() => handleTimeSlotSelect(slot)}
                                  sx={{
                                    p: 2,
                                    border: 2,
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 0.2s',
                                    borderColor: isSelected ? 'primary.main' : 'grey.300',
                                    bgcolor: isSelected ? 'primary.50' : 'white',
                                    '&:hover': {
                                      borderColor: 'primary.main',
                                      bgcolor: 'primary.50'
                                    }
                                  }}
                                >
                                  <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                                    <AccessTimeIcon sx={{ fontSize: 16, color: 'primary.main', mr: 0.5 }} />
                                    <Typography variant="body2" fontWeight="500">
                                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                    </Typography>
                                  </Box>
                                  <Chip 
                                    label="Còn trống" 
                                    size="small" 
                                    color="success" 
                                    variant="outlined"
                                  />
                                  {isSelected && (
                                    <Typography variant="caption" color="primary" display="block" sx={{ mt: 1 }}>
                                      ✓ Đã chọn
                                    </Typography>
                                  )}
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                    ) : (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        Không có slot trống cho ngày này. Vui lòng chọn ngày khác hoặc liên hệ tư vấn viên.
                      </Alert>
                    )}
                  </Grid>
                )}

                {/* Consultation Type */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Hình thức tư vấn</InputLabel>
                    <Select
                      value={bookingForm.consultationType}
                      onChange={(e) => setBookingForm({
                        ...bookingForm,
                        consultationType: e.target.value
                      })}
                      label="Hình thức tư vấn"
                    >
                      <MenuItem value="ONLINE">Tư vấn trực tuyến</MenuItem>
                      <MenuItem value="IN_PERSON">Tư vấn trực tiếp</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Notes */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Ghi chú (tùy chọn)"
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({
                      ...bookingForm,
                      notes: e.target.value
                    })}
                    placeholder="Mô tả vấn đề bạn muốn tư vấn..."
                  />
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setBookingDialogOpen(false)}
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={handleBookingSubmit}
            variant="contained"
            disabled={!selectedTimeSlot || bookingLoading}
            startIcon={bookingLoading ? <CircularProgress size={16} /> : null}
          >
            {bookingLoading ? 'Đang đặt lịch...' : 'Xác nhận đặt lịch'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsultationDemo; 