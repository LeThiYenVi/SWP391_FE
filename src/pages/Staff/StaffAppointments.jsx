import React, { useState, useEffect } from 'react';
import { getAllBookingsForStaffAPI } from '../../services/TestingService';
import { updateBookingStatusAPI } from '../../services/StaffService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { useWebSocket } from '../../hooks/useWebSocketCompat';
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
  Pagination,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  AccessTime as ClockIcon,
  Person as UserIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import instance from '../../services/customize-axios';

const StaffAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // WebSocket hook để nhận real-time updates
  const { connected, notifications } = useWebSocket();

  const [dateFilter, setDateFilter] = useState('');
  const [expandedAppointment, setExpandedAppointment] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [bookingStats, setBookingStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0
  });

  useEffect(() => {
    fetchAppointments();
  }, [currentPage]);

  // Debug WebSocket connection
  useEffect(() => {
    console.log('🔌 WebSocket connected:', connected);
    console.log('📱 Notifications count:', notifications.length);
  }, [connected, notifications]);

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, dateFilter, appointments]);

  // WebSocket effect để listen real-time updates từ notifications
  useEffect(() => {
    if (!connected || notifications.length === 0) return;

    // Lấy notification mới nhất
    const latestNotification = notifications[notifications.length - 1];

    console.log('📱 Staff received notification:', latestNotification);

    // Kiểm tra nếu là booking update
    if (latestNotification && latestNotification.bookingId) {
      // Tự động reload data khi có update
      setTimeout(() => {
        fetchAppointments();
      }, 500);

      // Hiển thị toast notification với toastId để tránh duplicate
      toast.info(`Lịch hẹn #${latestNotification.bookingId} đã được cập nhật`, {
        toastId: `booking-update-${latestNotification.bookingId}`, // Prevent duplicates
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    }
  }, [notifications, connected]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Lấy appointments theo status PENDING
      const response = await instance.get(`/api/bookings/status/PENDING?pageNumber=${currentPage}&pageSize=${pageSize}`);

      if (response.data && response.data.content) {
        setAppointments(response.data.content);
        setFilteredAppointments(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
        setBookingStats({
          totalBookings: response.data.totalBookings || 0,
          pendingBookings: response.data.pendingBookings || 0,
          completedBookings: response.data.completedBookings || 0,
          cancelledBookings: response.data.cancelledBookings || 0
        });
      }
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
          appointment.customerFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.bookingId?.toString().includes(searchTerm) ||
          appointment.customerEmailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.customerPhone?.includes(searchTerm)
      );
    }



    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter((appointment) => {
        const appointmentDate = new Date(appointment.bookingDate).toISOString().split('T')[0];
        return appointmentDate === dateFilter;
      });
    }

    setFilteredAppointments(filtered);
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await updateBookingStatusAPI(appointmentId, newStatus);

      // WebSocket sẽ tự động reload data khi nhận được notification từ backend
      // Không cần gọi fetchAppointments() ở đây để tránh double reload

      // Show success toast with status translation
      const statusText = getStatusText(newStatus);
      toast.success(`✅ Đã cập nhật trạng thái thành "${statusText}" thành công!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error('Error updating appointment status:', err);
      toast.error('❌ Không thể cập nhật trạng thái lịch hẹn. Vui lòng thử lại sau.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetchAppointments();
    } catch (err) {
      console.error('Error refreshing appointments:', err);
    } finally {
      setLoading(false);
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
      case 'SAMPLE_COLLECTED':
        return 'info';
      case 'TESTING':
        return 'secondary';
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
      case 'SAMPLE_COLLECTED':
        return 'Đã lấy mẫu';
      case 'TESTING':
        return 'Đang xét nghiệm';
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={40} sx={{ color: '#354766' }} />
          <Typography variant="h6" sx={{ color: '#354766', fontWeight: 600 }}>
            Đang tải dữ liệu...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <Box sx={{
          p: 3,
          backgroundColor: '#f8d7da',
          borderRadius: '12px',
          border: '1px solid #f5c6cb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          maxWidth: '400px'
        }}>
          <Typography variant="h6" sx={{ color: '#721c24', fontWeight: 600 }}>
            Có lỗi xảy ra!
          </Typography>
          <Typography variant="body2" sx={{ color: '#721c24', textAlign: 'center' }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{
              backgroundColor: '#f44336',
              color: 'white',
              borderRadius: '8px',
              fontWeight: 500,
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#d32f2f',
              }
            }}
          >
            Thử lại
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#354766',
          }}
        >
          Lịch xét nghiệm chờ xác nhận
        </Typography>

        {/* Debug WebSocket Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={connected ? '🟢 WebSocket Connected' : '🔴 WebSocket Disconnected'}
            color={connected ? 'success' : 'error'}
            size="small"
          />
          <Chip
            label={`📱 ${notifications.length} notifications`}
            color="info"
            size="small"
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              console.log('🔄 Manual refresh');
              fetchAppointments();
            }}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(179, 204, 212, 0.3)',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(53, 71, 102, 0.1)',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 16px rgba(53, 71, 102, 0.15)',
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Box sx={{ fontSize: '24px', mb: 1 }}>📊</Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#354766', mb: 0.5 }}>
                {bookingStats.totalBookings}
              </Typography>
              <Typography variant="body2" sx={{ color: '#B3CCD4', fontWeight: 600, fontSize: '12px' }}>
                Tổng số lịch hẹn
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(255, 193, 7, 0.1)',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 16px rgba(255, 193, 7, 0.2)',
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Box sx={{ fontSize: '24px', mb: 1 }}>⏳</Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff9800', mb: 0.5 }}>
                {bookingStats.pendingBookings}
              </Typography>
              <Typography variant="body2" sx={{ color: '#856404', fontWeight: 600, fontSize: '12px' }}>
                Chờ xác nhận
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.1)',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 16px rgba(76, 175, 80, 0.2)',
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Box sx={{ fontSize: '24px', mb: 1 }}>🎉</Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50', mb: 0.5 }}>
                {bookingStats.completedBookings}
              </Typography>
              <Typography variant="body2" sx={{ color: '#155724', fontWeight: 600, fontSize: '12px' }}>
                Đã hoàn thành
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(244, 67, 54, 0.1)',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 16px rgba(244, 67, 54, 0.2)',
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Box sx={{ fontSize: '24px', mb: 1 }}>❌</Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f44336', mb: 0.5 }}>
                {bookingStats.cancelledBookings}
              </Typography>
              <Typography variant="body2" sx={{ color: '#721c24', fontWeight: 600, fontSize: '12px' }}>
                Đã hủy
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Box
        sx={{
          mb: 3,
          p: 2,
          backgroundColor: 'rgba(179, 204, 212, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(179, 204, 212, 0.3)',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#354766', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          🔍 Tìm kiếm và lọc
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              size="small"
              fullWidth
              placeholder="Tìm theo tên, email, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#B3CCD4', fontSize: '1.1rem' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  '& fieldset': {
                    borderColor: '#B3CCD4',
                  },
                  '&:hover fieldset': {
                    borderColor: '#354766',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#354766',
                  },
                },
              }}
            />
          </Grid>



          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CalendarIcon sx={{ color: '#354766', fontSize: '1.1rem' }} />
              <Typography
                variant="body2"
                sx={{
                  color: '#354766',
                  fontWeight: 500,
                  minWidth: 'fit-content',
                }}
              >
                Ngày lịch hẹn
              </Typography>
              <TextField
                size="small"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    '& fieldset': {
                      borderColor: '#B3CCD4',
                    },
                    '&:hover fieldset': {
                      borderColor: '#354766',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#354766',
                    },
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            backgroundColor: 'rgba(179, 204, 212, 0.1)',
            border: '1px dashed rgba(179, 204, 212, 0.4)',
            borderRadius: '12px',
          }}
        >
          <Box sx={{ fontSize: '32px', mb: 1 }}>📅</Box>
          <Typography variant="h6" sx={{ color: '#354766', fontWeight: 600, mb: 0.5 }}>
            Không có lịch hẹn chờ xác nhận
          </Typography>
          <Typography variant="body2" sx={{ color: '#B3CCD4' }}>
            Hiện tại không có lịch hẹn nào đang chờ xác nhận.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {filteredAppointments.map((appointment, index) => (
            <Card
              key={appointment.bookingId}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(179, 204, 212, 0.3)',
                borderRadius: index === 0 ? '12px 12px 0 0' : index === filteredAppointments.length - 1 ? '0 0 12px 12px' : '0',
                borderTop: index === 0 ? '1px solid rgba(179, 204, 212, 0.3)' : 'none',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(179, 204, 212, 0.05)',
                  borderColor: 'rgba(53, 71, 102, 0.3)',
                }
              }}
            >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '8px',
                          backgroundColor: '#354766',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '12px',
                        }}
                      >
                        #{appointment.bookingId}
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#354766', fontSize: '16px', mb: 0.5 }}>
                          {appointment.customerFullName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarIcon sx={{ fontSize: 16, color: '#B3CCD4' }} />
                            <Typography variant="body2" sx={{ color: '#4a6b75', fontSize: '13px' }}>
                              {formatDate(appointment.bookingDate)}
                            </Typography>
                          </Box>
                          {appointment.startTime && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <ClockIcon sx={{ fontSize: 16, color: '#B3CCD4' }} />
                              <Typography variant="body2" sx={{ color: '#4a6b75', fontSize: '13px' }}>
                                {appointment.startTime} - {appointment.endTime}
                              </Typography>
                            </Box>
                          )}
                          <Typography variant="body2" sx={{ color: '#4a6b75', fontSize: '13px' }}>
                            {appointment.serviceName}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={getStatusText(appointment.status)}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '11px',
                          height: '24px',
                          ...(appointment.status === 'PENDING' && {
                            backgroundColor: '#fff3cd',
                            color: '#856404',
                          }),
                          ...(appointment.status === 'CONFIRMED' && {
                            backgroundColor: '#cce5ff',
                            color: '#004085',
                          }),
                          ...(appointment.status === 'SAMPLE_COLLECTED' && {
                            backgroundColor: '#d1ecf1',
                            color: '#0c5460',
                          }),
                          ...(appointment.status === 'TESTING' && {
                            backgroundColor: '#e2e3f1',
                            color: '#383d3d',
                          }),
                          ...(appointment.status === 'COMPLETED' && {
                            backgroundColor: '#d4edda',
                            color: '#155724',
                          }),
                          ...(appointment.status === 'CANCELLED' && {
                            backgroundColor: '#f8d7da',
                            color: '#721c24',
                          })
                        }}
                      />

                      {appointment.status === 'PENDING' && (
                        <Button
                          size="small"
                          onClick={() => handleStatusUpdate(appointment.bookingId, 'CONFIRMED')}
                          sx={{
                            backgroundColor: '#354766',
                            color: 'white',
                            borderRadius: '6px',
                            fontWeight: 500,
                            textTransform: 'none',
                            px: 2,
                            py: 0.5,
                            fontSize: '12px',
                            minWidth: 'auto',
                            '&:hover': {
                              backgroundColor: '#2a3a52',
                            },
                          }}
                        >
                          Xác nhận
                        </Button>
                      )}

                      <Button
                        size="small"
                        onClick={() => setExpandedAppointment(
                          expandedAppointment === appointment.bookingId ? null : appointment.bookingId
                        )}
                        sx={{
                          color: '#354766',
                          borderRadius: '6px',
                          fontWeight: 500,
                          textTransform: 'none',
                          px: 1,
                          py: 0.5,
                          fontSize: '12px',
                          minWidth: 'auto',
                          '&:hover': {
                            backgroundColor: 'rgba(179, 204, 212, 0.2)',
                          },
                        }}
                      >
                        {expandedAppointment === appointment.bookingId ? '▲' : '▼'}
                      </Button>
                    </Box>
                  </Box>

                  <Collapse in={expandedAppointment === appointment.bookingId}>
                    <Box
                      sx={{
                        mt: 2,
                        pt: 2,
                        borderTop: '1px solid rgba(179, 204, 212, 0.3)',
                        backgroundColor: 'rgba(179, 204, 212, 0.05)',
                        borderRadius: '8px',
                        p: 2,
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#354766', mb: 1 }}>
                            Thông tin khách hàng:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#4a6b75', mb: 0.5, fontSize: '13px' }}>
                            Email: {appointment.customerEmailAddress}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#4a6b75', fontSize: '13px' }}>
                            SĐT: {appointment.customerPhone}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#354766', mb: 1 }}>
                            Chi tiết dịch vụ:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#4a6b75', mb: 0.5, fontSize: '13px' }}>
                            Giá: {appointment.servicePrice?.toLocaleString()} VNĐ
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#4a6b75', fontSize: '13px' }}>
                            Ngày tạo: {formatDate(appointment.createdAt)}
                          </Typography>
                          {appointment.serviceDescription && (
                            <Typography variant="body2" sx={{ color: '#4a6b75', mt: 0.5, fontSize: '13px' }}>
                              Mô tả: {appointment.serviceDescription}
                            </Typography>
                          )}
                        </Grid>
                        {appointment.notes && (
                          <Grid item xs={12}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#354766', mb: 0.5 }}>
                              Ghi chú:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#4a6b75', fontSize: '13px' }}>
                              {appointment.notes}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
          ))}
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Stack spacing={2} alignItems="center">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary"
              size="medium"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#354766',
                  fontWeight: 500,
                  '&.Mui-selected': {
                    backgroundColor: '#354766',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#2a3a52',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(53, 71, 102, 0.1)',
                  },
                },
              }}
            />
            <Typography variant="body2" sx={{ textAlign: 'center', color: '#B3CCD4' }}>
              Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalElements)} trong tổng số {totalElements} lịch hẹn
            </Typography>
          </Stack>
        </Box>
      )}

      {/* Reload Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
        <Button
          variant="outlined"
          onClick={handleRefresh}
          disabled={loading}
          startIcon={<RefreshIcon />}
          sx={{
            borderColor: '#B3CCD4',
            color: '#354766',
            fontWeight: 600,
            borderRadius: '12px',
            px: 4,
            py: 1.5,
            '&:hover': {
              borderColor: '#354766',
              backgroundColor: 'rgba(179, 204, 212, 0.1)',
            },
            '&:disabled': {
              borderColor: '#B3CCD4',
              color: '#B3CCD4',
            },
          }}
        >
          {loading ? 'Đang tải...' : 'Làm mới danh sách'}
        </Button>
      </Box>
    </Box>
  );
};

export default StaffAppointments;
