import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Avatar,
  Chip,
  Divider,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  Add as AddIcon,
  Science as ScienceIcon,
  VideoCall as VideoCallIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { format, addDays, startOfDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import consultantService from '../../services/ConsultantService';
import { getTestingServicesAPI } from '../../services/TestingService';
import { useConsultant } from '../../context/ConsultantContext';

const CreateAppointment = () => {
  const { consultantProfile } = useConsultant();
  const [tabValue, setTabValue] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  
  // Form states
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [notes, setNotes] = useState('');
  
  // Consultation form states
  const [consultationType, setConsultationType] = useState('ONLINE');

  // Search states
  const [customerSearch, setCustomerSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showServiceDialog, setShowServiceDialog] = useState(false);

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

  // Filter customers and services
  const filteredCustomers = customers.filter(customer =>
    customer.fullName?.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.email?.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredServices = services.filter(service =>
    service.serviceName?.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  // Get selected customer and service objects
  const selectedCustomerObj = customers.find(c => c.id === selectedCustomer);
  const selectedServiceObj = services.find(s => s.serviceId === selectedService);
  
  // Debug service finding
  if (selectedService) {
    console.log('Looking for service with ID:', selectedService);
    console.log('Available services:', services.map(s => ({ id: s.serviceId, name: s.serviceName })));
    console.log('Found service:', selectedServiceObj);
  }
  
  console.log('Selected objects:', {
    selectedCustomer,
    selectedService,
    selectedCustomerObj,
    selectedServiceObj,
    servicesLength: services.length,
    services: services.map(s => ({ id: s.serviceId, name: s.serviceName }))
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Debug selectedService changes
  useEffect(() => {
    console.log('selectedService changed:', {
      value: selectedService,
      type: typeof selectedService,
      truthy: !!selectedService,
      isNull: selectedService === null,
      isUndefined: selectedService === undefined
    });
  }, [selectedService]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [customersRes, servicesRes] = await Promise.all([
        consultantService.getCustomers(),
        getTestingServicesAPI()
      ]);

      console.log('Customers response:', customersRes);
      
      // Xử lý customers response
      if (customersRes && customersRes.success) {
        setCustomers(customersRes.data || []);
      } else if (customersRes && Array.isArray(customersRes)) {
        setCustomers(customersRes);
      } else if (customersRes && customersRes.content && Array.isArray(customersRes.content)) {
        setCustomers(customersRes.content);
      } else {
        console.warn('Customers response is not in expected format:', customersRes);
        setCustomers([]);
      }

      // Đảm bảo services là một mảng
      console.log('Services response:', servicesRes);
      if (servicesRes && Array.isArray(servicesRes)) {
        setServices(servicesRes);
      } else if (servicesRes && servicesRes.content && Array.isArray(servicesRes.content)) {
        setServices(servicesRes.content);
      } else if (servicesRes && servicesRes.data && Array.isArray(servicesRes.data)) {
        setServices(servicesRes.data);
      } else {
        console.warn('Services response is not an array:', servicesRes);
        setServices([]);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Không thể tải dữ liệu ban đầu');
      setCustomers([]);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async (date) => {
    console.log('Date selected:', date);
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    
    try {
      setAvailabilityLoading(true);
      // Gọi API để lấy availability của consultant cho ngày này
      const result = await consultantService.getConsultantAvailability(date);
      console.log('Availability result:', result);
      if (result.success) {
        setAvailability(result.data || []);
        console.log('Set availability:', result.data || []);
      } else {
        setAvailability([]);
        toast.error('Không thể tải lịch trống');
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Không thể tải lịch trống');
      setAvailability([]);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleTimeSlotSelect = (timeSlot) => {
    console.log('Selected time slot:', timeSlot);
    setSelectedTimeSlot(timeSlot);
  };

  const handleCreateBooking = async () => {
    console.log('Debug booking data:', {
      selectedCustomer,
      selectedService,
      selectedDate,
      selectedTimeSlot,
      notes
    });
    
    console.log('Selected service details:', {
      value: selectedService,
      type: typeof selectedService,
      isNull: selectedService === null,
      isUndefined: selectedService === undefined,
      isEmptyString: selectedService === '',
      isZero: selectedService === 0,
      truthy: !!selectedService
    });
    
    // Kiểm tra chi tiết từng field
    const validationErrors = [];
    
    if (!selectedCustomer || selectedCustomer === '') {
      validationErrors.push('Chưa chọn người dùng');
    }
    
    if (!selectedService || selectedService === null || selectedService === undefined || selectedService === '') {
      validationErrors.push('Chưa chọn dịch vụ');
    }
    
    if (!selectedDate || selectedDate === '') {
      validationErrors.push('Chưa chọn ngày');
    }
    
    if (!selectedTimeSlot || Object.keys(selectedTimeSlot || {}).length === 0) {
      validationErrors.push('Chưa chọn giờ');
    }
    
    if (validationErrors.length > 0) {
      console.log('Validation failed:', {
        selectedCustomer: !!selectedCustomer,
        selectedService: !!selectedService,
        selectedDate: !!selectedDate,
        selectedTimeSlot: !!selectedTimeSlot,
        selectedTimeSlotValue: selectedTimeSlot,
        errors: validationErrors
      });
      toast.error(`Vui lòng điền đầy đủ thông tin: ${validationErrors.join(', ')}`);
      return;
    }

    try {
      setCreating(true);
      
      const bookingData = {
        userId: parseInt(selectedCustomer),
        serviceId: parseInt(selectedService),
        timeSlotId: selectedTimeSlot.slotId,
        bookingDate: `${selectedDate}T00:00:00`, // Format date cho backend
        description: notes
      };

      console.log('Final booking data:', bookingData);

      console.log('Sending booking data to API:', bookingData);
      const result = await consultantService.createBookingForUser(bookingData);
      console.log('API response:', result);
      
      if (result.success) {
        toast.success('Tạo lịch hẹn thành công! User sẽ nhận được thông báo để xác nhận.');
        resetForm();
      } else {
        toast.error(result.message || 'Không thể tạo lịch hẹn');
      }
      
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Không thể tạo lịch hẹn');
    } finally {
      setCreating(false);
    }
  };

  const handleCreateConsultation = async () => {
    console.log('Debug consultation data:', {
      selectedCustomer,
      selectedDate,
      selectedTimeSlot,
      consultationType,
      notes,
      consultantProfile: consultantProfile?.id
    });
    
    // Kiểm tra chi tiết từng field
    const validationErrors = [];
    
    if (!selectedCustomer || selectedCustomer === '') {
      validationErrors.push('Chưa chọn người dùng');
    }
    
    if (!selectedDate || selectedDate === '') {
      validationErrors.push('Chưa chọn ngày');
    }
    
    if (!selectedTimeSlot || Object.keys(selectedTimeSlot || {}).length === 0) {
      validationErrors.push('Chưa chọn giờ');
    }
    
    if (!consultationType || consultationType === '') {
      validationErrors.push('Chưa chọn loại tư vấn');
    }
    
    if (!consultantProfile?.id) {
      validationErrors.push('Không tìm thấy thông tin consultant');
    }
    
    if (validationErrors.length > 0) {
      console.log('Validation failed:', {
        selectedCustomer: !!selectedCustomer,
        selectedDate: !!selectedDate,
        selectedTimeSlot: !!selectedTimeSlot,
        selectedTimeSlotValue: selectedTimeSlot,
        consultationType: !!consultationType,
        consultantProfile: !!consultantProfile?.id,
        errors: validationErrors
      });
      toast.error(`Vui lòng điền đầy đủ thông tin: ${validationErrors.join(', ')}`);
      return;
    }

    try {
      setCreating(true);
      
      const consultationData = {
        userId: parseInt(selectedCustomer),
        consultantId: consultantProfile?.id, // Gắn ID của consultant hiện tại
        startTime: `${selectedDate}T${selectedTimeSlot.startTimeStr}`,
        endTime: `${selectedDate}T${selectedTimeSlot.endTimeStr}`,
        consultationType: consultationType,
        notes: notes
      };

      console.log('Final consultation data:', consultationData);

      const result = await consultantService.createConsultationForUser(consultationData);
      
      if (result.success) {
        toast.success('Tạo lịch tư vấn thành công! User sẽ nhận được thông báo để xác nhận và tạo meeting link.');
        resetForm();
      } else {
        toast.error(result.message || 'Không thể tạo lịch tư vấn');
      }
      
    } catch (error) {
      console.error('Error creating consultation:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Không thể tạo lịch tư vấn';
      toast.error(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setSelectedCustomer('');
    setSelectedService('');
    setSelectedDate('');
    setSelectedTimeSlot(null);
    setNotes('');
    setConsultationType('ONLINE');
  };

  const createTestCustomer = async () => {
    try {
      const result = await consultantService.createTestCustomer();
      if (result.success) {
        toast.success('Tạo test customer thành công!');
        // Refresh danh sách customers
        fetchInitialData();
      } else {
        toast.error(result.message || 'Không thể tạo test customer');
      }
    } catch (error) {
      console.error('Error creating test customer:', error);
      toast.error('Không thể tạo test customer');
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5); // Format HH:mm
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
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 700, 
        color: '#1976d2',
        mb: 3,
        textAlign: 'center'
      }}>
        Tạo lịch hẹn cho người dùng
      </Typography>
      
      <Card sx={{ 
        mt: 3, 
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 4 }}>
          {/* Tabs */}
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider', 
            mb: 4,
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            p: 1
          }}>
            <Tabs 
              value={tabValue} 
              onChange={(e, newValue) => setTabValue(newValue)}
              sx={{
                '& .MuiTab-root': {
                  minHeight: '60px',
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '8px',
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'white',
                    color: '#1976d2',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                  }
                }
              }}
            >
              <Tab 
                icon={<ScienceIcon />} 
                label="Lịch xét nghiệm" 
                iconPosition="start"
              />
              <Tab 
                icon={<VideoCallIcon />} 
                label="Lịch tư vấn" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* User and Service Selection */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* User Selection */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 600, 
                color: '#333',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <PersonIcon sx={{ color: '#1976d2' }} />
                Chọn người dùng
              </Typography>
              
              <Paper 
                elevation={0}
                sx={{ 
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#1976d2',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.1)'
                  }
                }}
                onClick={() => setShowCustomerDialog(true)}
              >
                {selectedCustomerObj ? (
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar 
                      src={selectedCustomerObj.avatarUrl}
                      sx={{ 
                        width: 48, 
                        height: 48,
                        backgroundColor: '#1976d2'
                      }}
                    >
                      {selectedCustomerObj.fullName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 600, 
                        color: '#333',
                        fontSize: '16px'
                      }}>
                        {selectedCustomerObj.fullName}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#666',
                        fontSize: '14px'
                      }}>
                        {selectedCustomerObj.email}
                      </Typography>
                    </Box>
                    <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 24 }} />
                  </Box>
                ) : (
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ 
                      width: 48, 
                      height: 48,
                      backgroundColor: '#f5f5f5'
                    }}>
                      <PersonIcon sx={{ color: '#999' }} />
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="body1" sx={{ 
                        color: '#999',
                        fontStyle: 'italic',
                        fontSize: '16px'
                      }}>
                        Chọn người dùng
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Service Selection - Only for Testing */}
            {tabValue === 0 && (
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600, 
                  color: '#333',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <ScienceIcon sx={{ color: '#1976d2' }} />
                  Chọn dịch vụ
                </Typography>
                
                <Paper 
                  elevation={0}
                  sx={{ 
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    p: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#1976d2',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.1)'
                    }
                  }}
                  onClick={() => setShowServiceDialog(true)}
                >
                  {selectedServiceObj && selectedService ? (
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '8px',
                        backgroundColor: '#e3f2fd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ScienceIcon sx={{ color: '#1976d2', fontSize: 24 }} />
                      </Box>
                      <Box flex={1}>
                        <Typography variant="body1" sx={{ 
                          fontWeight: 600, 
                          color: '#333',
                          fontSize: '16px'
                        }}>
                          {selectedServiceObj?.serviceName}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: '#666',
                          fontSize: '14px'
                        }}>
                          {selectedServiceObj?.price?.toLocaleString('vi-VN')} ₫
                        </Typography>
                      </Box>
                      <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 24 }} />
                    </Box>
                  ) : (
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '8px',
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ScienceIcon sx={{ color: '#999' }} />
                      </Box>
                      <Box flex={1}>
                        <Typography variant="body1" sx={{ 
                          color: '#999',
                          fontStyle: 'italic',
                          fontSize: '16px'
                        }}>
                          Chọn dịch vụ
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Grid>
            )}

            {/* Consultation Type - Only for Consultation */}
            {tabValue === 1 && (
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600, 
                  color: '#333',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <VideoCallIcon sx={{ color: '#1976d2' }} />
                  Loại tư vấn
                </Typography>
                
                <FormControl fullWidth>
                  <Select
                    value={consultationType}
                    onChange={(e) => setConsultationType(e.target.value)}
                    sx={{
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0',
                        borderWidth: '2px'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                        borderWidth: '2px'
                      }
                    }}
                  >
                    <MenuItem value="ONLINE">
                      <Box display="flex" alignItems="center" gap={2}>
                        <VideoCallIcon sx={{ color: '#4caf50' }} />
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Trực tuyến
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Tư vấn qua video call
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                    <MenuItem value="IN_PERSON">
                      <Box display="flex" alignItems="center" gap={2}>
                        <PersonIcon sx={{ color: '#ff9800' }} />
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Trực tiếp
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Tư vấn tại phòng khám
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>

          {/* Date Selection */}
          <Typography variant="h6" gutterBottom sx={{ 
            fontWeight: 600, 
            color: '#333',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <EventIcon sx={{ color: '#1976d2' }} />
            Chọn ngày
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {availableDates.map((date) => (
              <Grid item key={date.date}>
                <Button
                  variant={selectedDate === date.date ? "contained" : "outlined"}
                  onClick={() => handleDateChange(date.date)}
                  sx={{ 
                    minWidth: 120,
                    height: 70,
                    borderRadius: '12px',
                    border: selectedDate === date.date ? 'none' : '2px solid #e0e0e0',
                    backgroundColor: selectedDate === date.date ? '#1976d2' : 'white',
                    color: selectedDate === date.date ? 'white' : '#333',
                    boxShadow: selectedDate === date.date ? '0 4px 12px rgba(25, 118, 210, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': {
                      backgroundColor: selectedDate === date.date ? '#1565c0' : '#f8f9fa',
                      boxShadow: selectedDate === date.date ? '0 6px 16px rgba(25, 118, 210, 0.4)' : '0 4px 12px rgba(0,0,0,0.15)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <Box textAlign="center">
                    <Typography variant="caption" display="block" sx={{ 
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '11px'
                    }}>
                      {date.dayName}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600,
                      fontSize: '14px'
                    }}>
                      {date.display}
                    </Typography>
                  </Box>
                </Button>
              </Grid>
            ))}
          </Grid>

          {/* Time Selection */}
          {selectedDate && (
            <>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 600, 
                color: '#333',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <AccessTimeIcon sx={{ color: '#1976d2' }} />
                Chọn giờ
              </Typography>
              
              {tabValue === 0 ? (
                // Booking time slots
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {availabilityLoading ? (
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="center" sx={{ py: 4 }}>
                        <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                      </Box>
                    </Grid>
                  ) : Array.isArray(availability) && availability.length > 0 ? (
                    availability.map((slot) => (
                      <Grid item key={slot.slotId}>
                        <Button
                          variant={selectedTimeSlot?.slotId === slot.slotId ? "contained" : "outlined"}
                          onClick={() => handleTimeSlotSelect(slot)}
                          disabled={!slot.isAvailable}
                          sx={{
                            minWidth: 140,
                            height: 50,
                            borderRadius: '10px',
                            border: selectedTimeSlot?.slotId === slot.slotId ? 'none' : '2px solid #e0e0e0',
                            backgroundColor: selectedTimeSlot?.slotId === slot.slotId ? '#1976d2' : 'white',
                            color: selectedTimeSlot?.slotId === slot.slotId ? 'white' : '#333',
                            boxShadow: selectedTimeSlot?.slotId === slot.slotId ? '0 4px 12px rgba(25, 118, 210, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                            '&:hover': {
                              backgroundColor: selectedTimeSlot?.slotId === slot.slotId ? '#1565c0' : '#f8f9fa',
                              boxShadow: selectedTimeSlot?.slotId === slot.slotId ? '0 6px 16px rgba(25, 118, 210, 0.4)' : '0 4px 12px rgba(0,0,0,0.15)',
                              transform: 'translateY(-1px)'
                            },
                            '&:disabled': {
                              backgroundColor: '#f5f5f5',
                              color: '#999',
                              boxShadow: 'none'
                            },
                            transition: 'all 0.2s ease-in-out'
                          }}
                        >
                          <AccessTimeIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {formatTime(slot.startTimeStr)} - {formatTime(slot.endTimeStr)}
                          </Typography>
                        </Button>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Alert severity="info" sx={{ 
                        borderRadius: '10px',
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        '& .MuiAlert-icon': {
                          color: '#1976d2'
                        }
                      }}>
                        Không có lịch trống cho ngày này
                      </Alert>
                    </Grid>
                  )}
                </Grid>
                             ) : (
                 // Consultation time slots (same as booking)
                 <Grid container spacing={2} sx={{ mb: 4 }}>
                   {availabilityLoading ? (
                     <Grid item xs={12}>
                       <Box display="flex" justifyContent="center" sx={{ py: 4 }}>
                         <CircularProgress size={40} sx={{ color: '#1976d2' }} />
                       </Box>
                     </Grid>
                   ) : Array.isArray(availability) && availability.length > 0 ? (
                     availability.map((slot) => (
                       <Grid item key={slot.slotId}>
                         <Button
                           variant={selectedTimeSlot?.slotId === slot.slotId ? "contained" : "outlined"}
                           onClick={() => handleTimeSlotSelect(slot)}
                           disabled={!slot.isAvailable}
                           sx={{
                             minWidth: 140,
                             height: 50,
                             borderRadius: '10px',
                             border: selectedTimeSlot?.slotId === slot.slotId ? 'none' : '2px solid #e0e0e0',
                             backgroundColor: selectedTimeSlot?.slotId === slot.slotId ? '#1976d2' : 'white',
                             color: selectedTimeSlot?.slotId === slot.slotId ? 'white' : '#333',
                             boxShadow: selectedTimeSlot?.slotId === slot.slotId ? '0 4px 12px rgba(25, 118, 210, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                             '&:hover': {
                               backgroundColor: selectedTimeSlot?.slotId === slot.slotId ? '#1565c0' : '#f8f9fa',
                               boxShadow: selectedTimeSlot?.slotId === slot.slotId ? '0 6px 16px rgba(25, 118, 210, 0.4)' : '0 4px 12px rgba(0,0,0,0.15)',
                               transform: 'translateY(-1px)'
                             },
                             '&:disabled': {
                               backgroundColor: '#f5f5f5',
                               color: '#999',
                               boxShadow: 'none'
                             },
                             transition: 'all 0.2s ease-in-out'
                           }}
                         >
                           <AccessTimeIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                           <Typography variant="body2" sx={{ fontWeight: 500 }}>
                             {formatTime(slot.startTimeStr)} - {formatTime(slot.endTimeStr)}
                           </Typography>
                         </Button>
                       </Grid>
                     ))
                   ) : (
                     <Grid item xs={12}>
                       <Alert severity="info" sx={{ 
                         borderRadius: '10px',
                         backgroundColor: '#e3f2fd',
                         color: '#1976d2',
                         '& .MuiAlert-icon': {
                           color: '#1976d2'
                         }
                       }}>
                         Không có lịch trống cho ngày này
                       </Alert>
                     </Grid>
                   )}
                 </Grid>
               )}
            </>
          )}

          {/* Notes */}
          <Typography variant="h6" gutterBottom sx={{ 
            fontWeight: 600, 
            color: '#333',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <ScheduleIcon sx={{ color: '#1976d2' }} />
            Ghi chú
          </Typography>
          
          <TextField
            fullWidth
            label="Ghi chú (tùy chọn)"
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập ghi chú cho lịch hẹn..."
            sx={{ 
              mb: 4,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                },
                '&.Mui-focused': {
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                }
              }
            }}
          />

          {/* Submit Button */}
          <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              onClick={tabValue === 0 ? handleCreateBooking : handleCreateConsultation}
              disabled={creating}
              startIcon={creating ? <CircularProgress size={20} /> : <AddIcon />}
              sx={{
                borderRadius: '12px',
                padding: '16px 48px',
                fontSize: '18px',
                fontWeight: 600,
                textTransform: 'none',
                backgroundColor: '#1976d2',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  backgroundColor: '#1565c0',
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  boxShadow: 'none',
                  transform: 'none'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {creating ? 'Đang tạo...' : (tabValue === 0 ? 'Tạo lịch xét nghiệm' : 'Tạo lịch tư vấn')}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Customer Selection Dialog */}
      <Dialog 
        open={showCustomerDialog} 
        onClose={() => setShowCustomerDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            maxHeight: '70vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Chọn người dùng
          </Typography>
          <IconButton onClick={() => setShowCustomerDialog(false)}>
            <ClearIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Tìm kiếm người dùng..."
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />
          
          <List sx={{ p: 0 }}>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <ListItem 
                  key={customer.id}
                  disablePadding
                  sx={{ mb: 1 }}
                >
                  <ListItemButton
                    onClick={() => {
                      console.log('Customer selected:', customer);
                      setSelectedCustomer(customer.id);
                      setShowCustomerDialog(false);
                      setCustomerSearch('');
                    }}
                    sx={{
                      borderRadius: '12px',
                      border: selectedCustomer === customer.id ? '2px solid #1976d2' : '2px solid #f0f0f0',
                      backgroundColor: selectedCustomer === customer.id ? '#e3f2fd' : 'white',
                      '&:hover': {
                        backgroundColor: selectedCustomer === customer.id ? '#bbdefb' : '#f8f9fa'
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        src={customer.avatarUrl}
                        sx={{ 
                          width: 48, 
                          height: 48,
                          backgroundColor: '#1976d2'
                        }}
                      >
                        {customer.fullName?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {customer.fullName}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {customer.email}
                        </Typography>
                      }
                    />
                    {selectedCustomer === customer.id && (
                      <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 24 }} />
                    )}
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <Box display="flex" flexDirection="column" alignItems="center" sx={{ py: 4 }}>
                <PersonIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                <Typography variant="body1" sx={{ color: '#999', mb: 2 }}>
                  Không tìm thấy người dùng
                </Typography>
                <Button
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    createTestCustomer();
                  }}
                >
                  Tạo test customer
                </Button>
              </Box>
            )}
          </List>
        </DialogContent>
      </Dialog>

      {/* Service Selection Dialog */}
      <Dialog 
        open={showServiceDialog} 
        onClose={() => setShowServiceDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            maxHeight: '70vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Chọn dịch vụ
          </Typography>
          <IconButton onClick={() => setShowServiceDialog(false)}>
            <ClearIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Tìm kiếm dịch vụ..."
            value={serviceSearch}
            onChange={(e) => setServiceSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />
          
          <List sx={{ p: 0 }}>
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <ListItem 
                  key={service.serviceId}
                  disablePadding
                  sx={{ mb: 1 }}
                >
                  <ListItemButton
                    onClick={() => {
                      console.log('Service selected:', service);
                      console.log('Service ID to be set:', service.serviceId);
                      console.log('Service ID type:', typeof service.serviceId);
                      setSelectedService(service.serviceId);
                      setShowServiceDialog(false);
                      setServiceSearch('');
                    }}
                    sx={{
                      borderRadius: '12px',
                      border: selectedService === service.serviceId ? '2px solid #1976d2' : '2px solid #f0f0f0',
                      backgroundColor: selectedService === service.serviceId ? '#e3f2fd' : 'white',
                      '&:hover': {
                        backgroundColor: selectedService === service.serviceId ? '#bbdefb' : '#f8f9fa'
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '8px',
                        backgroundColor: '#e3f2fd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ScienceIcon sx={{ color: '#1976d2', fontSize: 24 }} />
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {service.serviceName}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {service.price?.toLocaleString('vi-VN')} ₫
                        </Typography>
                      }
                    />
                    {selectedService === service.serviceId && (
                      <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 24 }} />
                    )}
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <Box display="flex" flexDirection="column" alignItems="center" sx={{ py: 4 }}>
                <ScienceIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                <Typography variant="body1" sx={{ color: '#999' }}>
                  Không tìm thấy dịch vụ
                </Typography>
              </Box>
            )}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CreateAppointment; 