import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from '../../components/admin/AdminSidebar';
import Header from '../../components/admin/AdminHeader';
import { 
  Box, 
  Typography, 
  InputBase, 
  Button, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Paper, 
  TableContainer, 
  Pagination, 
  IconButton,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Grid
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function AdminCounselor() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [counselors, setCounselors] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [schedules, setSchedules] = useState({});

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetchCounselors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCounselors = async () => {
    try {
      // Mock data for counselors - replace with actual API call
      const mockCounselors = [
        {
          id: 1,
          name: 'Nguyễn Thị Lan',
          email: 'lan.nguyen@gynexa.com',
          specialization: 'Tư vấn sức khỏe sinh sản',
          status: 'active',
          experience: '5 năm',
          rating: 4.8,
          consultations: 245
        },
        {
          id: 2,
          name: 'Trần Văn Minh',
          email: 'minh.tran@gynexa.com',
          specialization: 'Tư vấn tâm lý',
          status: 'inactive',
          experience: '3 năm',
          rating: 4.6,
          consultations: 189
        },
        {
          id: 3,
          name: 'Lê Thị Hoa',
          email: 'hoa.le@gynexa.com',
          specialization: 'Tư vấn HIV/AIDS',
          status: 'active',
          experience: '7 năm',
          rating: 4.9,
          consultations: 312
        },
        {
          id: 4,
          name: 'Phạm Đức Thịnh',
          email: 'thinh.pham@gynexa.com',
          specialization: 'Tư vấn dinh dưỡng',
          status: 'active',
          experience: '4 năm',
          rating: 4.5,
          consultations: 156
        },
        {
          id: 5,
          name: 'Hoàng Thị Mai',
          email: 'mai.hoang@gynexa.com',
          specialization: 'Tư vấn kế hoạch hóa gia đình',
          status: 'active',
          experience: '6 năm',
          rating: 4.7,
          consultations: 203
        },
        {
          id: 6,
          name: 'Võ Văn Hùng',
          email: 'hung.vo@gynexa.com',
          specialization: 'Tư vấn sức khỏe nam giới',
          status: 'inactive',
          experience: '4 năm',
          rating: 4.4,
          consultations: 127
        }
      ];
      setCounselors(mockCounselors);
      setTotalPages(Math.ceil(mockCounselors.length / pageSize));
      setPage(1);
      
      // Initialize mock schedules
      const mockSchedules = {};
      mockCounselors.forEach(counselor => {
        mockSchedules[counselor.id] = generateMockSchedule();
      });
      setSchedules(mockSchedules);
    } catch (err) {
      console.error('Error fetching counselors:', err);
    }
  };

  const generateMockSchedule = () => {
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    const timeSlots = ['8:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '19:00-21:00'];
    const schedule = {};
    
    days.forEach(day => {
      schedule[day] = timeSlots.filter(() => Math.random() > 0.4);
    });
    
    return schedule;
  };

  useEffect(() => {
    const filtered = counselors.filter(counselor => 
      counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      counselor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTotalPages(Math.ceil(filtered.length / pageSize));
    setPage(1);
  }, [searchTerm, counselors]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleEditCounselor = (counselorId) => {
    toast.info(`Chỉnh sửa tư vấn viên ID: ${counselorId}`);
    // Implement edit logic here
  };

  const handleDeleteCounselor = (counselorId) => {
    toast.warning(`Xóa tư vấn viên ID: ${counselorId}`);
    // Implement delete logic here
  };

  const handleViewCounselor = (counselorId) => {
    toast.info(`Xem chi tiết tư vấn viên ID: ${counselorId}`);
    // Implement view logic here
  };

  const handleAddCounselor = () => {
    toast.info('Thêm tư vấn viên mới');
    // Implement add logic here
  };

  const handleManageSchedule = (counselor) => {
    setSelectedCounselor(counselor);
    setScheduleDialogOpen(true);
  };

  const handleScheduleDialogClose = () => {
    setScheduleDialogOpen(false);
    setSelectedCounselor(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredCounselors = counselors.filter(counselor => 
    counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    counselor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedCounselors = filteredCounselors.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexShrink: 0, minHeight: 64 }}>
          <Header />
        </Box>

        <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 2, overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 2, mt: 2 }}>
            <Typography variant='h3' sx={{ fontWeight: 500, color: 'gray'  }}>
              Quản lý tư vấn viên
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleAddCounselor}
                sx={{
                  bgcolor: '#3B6774',
                  '&:hover': { bgcolor: '#2d5a66' },
                  borderRadius: '999px',
                  px: 3,
                  py: 1
                }}
              >
                + Thêm tư vấn viên
              </Button>

              {/* Search box */}
              <Box sx={{ display: 'flex', alignItems: 'center', width: 300, bgcolor: 'white', borderRadius: '999px', px: 2, py: '6px', boxShadow: '0 0 0 1px #ccc' }}>
                <SearchIcon sx={{ color: 'gray', mr: 1 }} />
                <InputBase
                  placeholder="Tìm kiếm tư vấn viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    flex: 1,
                    color: 'gray',
                    fontSize: 16,
                    '& .MuiInputBase-input': { p: 0 },
                    '&:focus-within': { outline: 'none' }
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* TABLE AREA */}
          <Box sx={{ bgcolor: '#f5f5f5', p: 2 }}>
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#3B6774' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#f5f5f5' }}>STT</TableCell>
                    <TableCell sx={{ color: '#f5f5f5' }}>Họ tên</TableCell>
                    <TableCell sx={{ color: '#f5f5f5' }}>Email</TableCell>
                    <TableCell sx={{ color: '#f5f5f5' }}>Chuyên môn</TableCell>
                    <TableCell sx={{ color: '#f5f5f5' }}>Trạng thái</TableCell>
                    <TableCell sx={{ color: '#f5f5f5' }}>Số ca</TableCell>
                    <TableCell sx={{ color: '#f5f5f5' }}>Đánh giá</TableCell>
                    <TableCell sx={{ color: '#f5f5f5' }} align="center">Lịch làm việc</TableCell>
                    <TableCell sx={{ color: '#f5f5f5' }} align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCounselors.map((counselor, index) => (
                    <TableRow key={counselor.id}>
                      <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                      <TableCell>{counselor.name}</TableCell>
                      <TableCell>{counselor.email}</TableCell>
                      <TableCell>{counselor.specialization}</TableCell>
                      <TableCell>
                        <span style={{ 
                          color: counselor.status === 'active' ? 'green' : 'orange',
                          fontWeight: 'bold',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: counselor.status === 'active' ? '#e8f5e8' : '#fff3cd'
                        }}>
                          {counselor.status === 'active' ? 'Đang online' : 'Tạm dừng'}
                        </span>
                      </TableCell>
                      <TableCell>{counselor.consultations}</TableCell>
                      <TableCell>⭐ {counselor.rating}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ScheduleIcon />}
                          onClick={() => handleManageSchedule(counselor)}
                          sx={{
                            color: '#3B6774',
                            borderColor: '#3B6774',
                            '&:hover': {
                              backgroundColor: '#f0f7f9',
                              borderColor: '#2d5a66'
                            }
                          }}
                        >
                          Quản lý
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="info" 
                          size="small" 
                          title="Xem chi tiết"
                          onClick={() => handleViewCounselor(counselor.id)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton 
                          color="primary" 
                          size="small" 
                          title="Chỉnh sửa"
                          onClick={() => handleEditCounselor(counselor.id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          size="small" 
                          title="Xóa"
                          onClick={() => handleDeleteCounselor(counselor.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination count={totalPages} page={page} onChange={handleChangePage} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Schedule Management Dialog */}
      <Dialog
        open={scheduleDialogOpen}
        onClose={handleScheduleDialogClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon sx={{ color: '#3B6774' }} />
            <Typography variant="h6">
              Lịch làm việc - {selectedCounselor?.name}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tab label="Xem lịch" />
            <Tab label="Chỉnh sửa lịch" />
          </Tabs>

          {activeTab === 0 && selectedCounselor && schedules[selectedCounselor.id] && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: '#3B6774' }}>
                Lịch làm việc tuần này
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(schedules[selectedCounselor.id]).map(([day, timeSlots]) => (
                  <Grid item xs={12} md={6} lg={4} key={day}>
                    <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#3B6774' }}>
                        {day}
                      </Typography>
                      {timeSlots.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {timeSlots.map((slot, index) => (
                            <Chip
                              key={index}
                              label={slot}
                              variant="outlined"
                              size="small"
                              sx={{
                                backgroundColor: '#e8f5e8',
                                borderColor: '#4caf50',
                                color: '#2e7d32'
                              }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: '#999', fontStyle: 'italic' }}>
                          Không có lịch làm việc
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {activeTab === 1 && selectedCounselor && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: '#3B6774' }}>
                Chỉnh sửa lịch làm việc
              </Typography>
              <Grid container spacing={2}>
                {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map((day) => (
                  <Grid item xs={12} md={6} key={day}>
                    <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: '#3B6774' }}>
                        {day}
                      </Typography>
                      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel>Chọn ca làm việc</InputLabel>
                        <Select
                          multiple
                          value={schedules[selectedCounselor?.id]?.[day] || []}
                          label="Chọn ca làm việc"
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((value) => (
                                <Chip key={value} label={value} size="small" />
                              ))}
                            </Box>
                          )}
                          MenuProps={{
                            PaperProps: {
                              sx: { maxHeight: 200 }
                            },
                            disablePortal: true,
                            keepMounted: false
                          }}
                          onChange={(e) => {
                            const newSchedules = { ...schedules };
                            if (!newSchedules[selectedCounselor.id]) {
                              newSchedules[selectedCounselor.id] = {};
                            }
                            newSchedules[selectedCounselor.id][day] = e.target.value;
                            setSchedules(newSchedules);
                          }}
                        >
                          {['8:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '19:00-21:00'].map((timeSlot) => (
                            <MenuItem key={timeSlot} value={timeSlot}>
                              {timeSlot}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleScheduleDialogClose} color="inherit">
            Hủy
          </Button>
          {activeTab === 1 && (
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: '#3B6774', 
                '&:hover': { bgcolor: '#2d5a66' } 
              }}
              onClick={() => {
                toast.success('Cập nhật lịch làm việc thành công!');
                handleScheduleDialogClose();
              }}
            >
              Lưu thay đổi
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
