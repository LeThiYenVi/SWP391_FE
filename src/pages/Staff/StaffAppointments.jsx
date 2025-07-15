import React, { useState, useEffect } from 'react';
import { getAllBookingsForStaffAPI, updateBookingStatusAPI } from '../../services/TestingService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  InputAdornment,
  CircularProgress,
  Alert,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  AccessTime as ClockIcon,
  Person as UserIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

const StaffAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [expandedAppointment, setExpandedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, statusFilter, dateFilter, appointments]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await getAllBookingsForStaffAPI();
      setAppointments(response.data || []);
      setFilteredAppointments(response.data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Không thể tải danh sách lịch hẹn. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    // Filter by search term (name or ID)
    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.bookingId?.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((appointment) => appointment.status === statusFilter);
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate).toISOString().split('T')[0];
        return appointmentDate === dateFilter;
      });
    }

    setFilteredAppointments(filtered);
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await updateBookingStatusAPI(appointmentId, newStatus);
      // Update local state
      setAppointments(
        appointments.map((appointment) =>
          appointment.bookingId === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
      // Show success message - you can replace this with a toast notification
      alert(`Trạng thái lịch hẹn đã được cập nhật thành ${newStatus}`);
    } catch (err) {
      console.error('Error updating appointment status:', err);
      alert('Không thể cập nhật trạng thái lịch hẹn. Vui lòng thử lại sau.');
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return 'Ngày không hợp lệ';
    }
  };

  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: vi });
    } catch (error) {
      return 'Giờ không hợp lệ';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Box className="staff-loading">
        <CircularProgress size={60} sx={{ color: '#354766' }} />
        <Typography variant="h6" sx={{ ml: 2, color: '#354766' }}>
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 3 }}>
        <Typography variant="h6">Lỗi!</Typography>
        {error}
      </Alert>
    );
  }

  return (
    <Box className="fade-in-up">
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: '#354766',
          mb: 4,
          textShadow: '0 1px 2px rgba(179, 204, 212, 0.3)',
        }}
      >
        Quản lý lịch xét nghiệm
      </Typography>

      {/* Filters */}
      <Box className="staff-form-container" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Tìm theo tên hoặc ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="staff-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#354766' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#354766',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#354766',
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Trạng thái"
                className="staff-input"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterIcon sx={{ color: '#354766' }} />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#354766',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#354766',
                  },
                }}
              >
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                <MenuItem value="PENDING">Chờ xác nhận</MenuItem>
                <MenuItem value="CONFIRMED">Đã xác nhận</MenuItem>
                <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
                <MenuItem value="CANCELLED">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Ngày"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="staff-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon sx={{ color: '#354766' }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#354766',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#354766',
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <Box className="staff-card" sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ color: '#354766' }}>
            Không tìm thấy lịch hẹn nào phù hợp với bộ lọc.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredAppointments.map((appointment) => (
            <Grid item xs={12} key={appointment.bookingId}>
              <Card className="staff-card">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: '#354766',
                          mb: 1,
                        }}
                      >
                        #{appointment.bookingId} - {appointment.customerName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarIcon sx={{ fontSize: 16, color: '#B3CCD4' }} />
                          <Typography variant="body2" sx={{ color: '#4a6b75' }}>
                            {formatDate(appointment.appointmentDate)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ClockIcon sx={{ fontSize: 16, color: '#B3CCD4' }} />
                          <Typography variant="body2" sx={{ color: '#4a6b75' }}>
                            {appointment.appointmentTime}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#4a6b75', mb: 1 }}>
                        Dịch vụ: {appointment.serviceName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                      <Chip
                        label={getStatusText(appointment.status)}
                        color={getStatusColor(appointment.status)}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          borderRadius: '12px',
                        }}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {appointment.status === 'PENDING' && (
                          <Button
                            size="small"
                            className="staff-button-primary"
                            onClick={() => handleStatusUpdate(appointment.bookingId, 'CONFIRMED')}
                          >
                            Xác nhận
                          </Button>
                        )}
                        {appointment.status === 'CONFIRMED' && (
                          <Button
                            size="small"
                            className="staff-button-primary"
                            onClick={() => handleStatusUpdate(appointment.bookingId, 'COMPLETED')}
                          >
                            Hoàn thành
                          </Button>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => setExpandedAppointment(
                            expandedAppointment === appointment.bookingId ? null : appointment.bookingId
                          )}
                          sx={{ color: '#354766' }}
                        >
                          {expandedAppointment === appointment.bookingId ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>

                  <Collapse in={expandedAppointment === appointment.bookingId}>
                    <Box
                      sx={{
                        mt: 2,
                        pt: 2,
                        borderTop: '1px solid rgba(179, 204, 212, 0.3)',
                        background: 'rgba(179, 204, 212, 0.1)',
                        borderRadius: 2,
                        p: 2,
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#354766', mb: 0.5 }}>
                            Thông tin khách hàng:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#4a6b75', mb: 1 }}>
                            Email: {appointment.customerEmail}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#4a6b75', mb: 1 }}>
                            SĐT: {appointment.customerPhone}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#354766', mb: 0.5 }}>
                            Chi tiết dịch vụ:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#4a6b75', mb: 1 }}>
                            Giá: {appointment.price?.toLocaleString()} VNĐ
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#4a6b75', mb: 1 }}>
                            Ngày tạo: {formatDate(appointment.createdAt)}
                          </Typography>
                        </Grid>
                        {appointment.notes && (
                          <Grid item xs={12}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#354766', mb: 0.5 }}>
                              Ghi chú:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#4a6b75' }}>
                              {appointment.notes}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default StaffAppointments;
