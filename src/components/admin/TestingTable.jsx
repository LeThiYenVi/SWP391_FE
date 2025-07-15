import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Divider,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Visibility, 
  Add, 
  Save, 
  Cancel, 
  Refresh,
  Warning
} from '@mui/icons-material';
import { getAllTestingServicesAPI, updateTestingServiceAPI, deleteTestingServiceAPI } from '../../services/UsersSevices';

const TestingTable = ({ searchTerm, refreshKey }) => {
  const [allTestingServices, setAllTestingServices] = useState([]);
  const [filteredTestingServices, setFilteredTestingServices] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = 10;

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Loading states
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllTestingServicesAPI();
      console.log('Backend response:', response);
      
      // Kiểm tra cấu trúc response
      let services = [];
      if (Array.isArray(response)) {
        services = response;
      } else if (response && response.data) {
        services = Array.isArray(response.data) ? response.data : [];
      } else if (response && response.content) {
        services = response.content;
      }
      
      console.log('Processed services:', services);
      
      setAllTestingServices(services);
      setFilteredTestingServices(services);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu dịch vụ:', err);
      setError('Không thể tải dữ liệu dịch vụ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = allTestingServices.filter(service =>
        service.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.serviceId?.toString().includes(searchTerm) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTestingServices(filtered);
    } else {
      setFilteredTestingServices(allTestingServices);
    }
    setPage(1); // Reset to first page when search changes
  }, [searchTerm, allTestingServices]);

  // Format currency to Vietnamese Dong
  const formatPrice = (price) => {
    if (!price) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Get category color for chips - tạm thời dùng màu mặc định
  const getCategoryColor = (category) => {
    const colors = {
      'Nội tiết tố nữ': '#e91e63',
      'Nội tiết tố nam': '#2196f3',
      'Hình ảnh học': '#4caf50',
      'Tầm soát ung thư': '#ff9800',
      'Vi sinh vật': '#9c27b0',
      'Xương khớp': '#795548',
      'Nội tiết': '#3f51b5',
      'Chuyển hóa': '#00bcd4',
      'Vitamin': '#cddc39',
      'Khoáng chất': '#607d8b',
      'Chức năng cơ quan': '#ff5722',
      'Sinh sản': '#e91e63',
      'Di truyền': '#673ab7'
    };
    return colors[category] || '#757575';
  };

  // Tạo category từ serviceName hoặc description
  const getServiceCategory = (service) => {
    const name = service.serviceName?.toLowerCase() || '';
    const desc = service.description?.toLowerCase() || '';
    
    if (name.includes('hormone') || name.includes('nội tiết')) return 'Nội tiết';
    if (name.includes('siêu âm') || name.includes('ultrasound')) return 'Hình ảnh học';
    if (name.includes('pap') || name.includes('tầm soát')) return 'Tầm soát ung thư';
    if (name.includes('sinh sản') || name.includes('reproductive')) return 'Sinh sản';
    
    return 'Khác';
  };

  // Tạo preparation text từ duration
  const getPreparationText = (service) => {
    const duration = service.durationMinutes;
    if (duration <= 30) return 'Không cần chuẩn bị đặc biệt';
    if (duration <= 60) return 'Nhịn ăn 4-6 giờ trước';
    return 'Nhịn ăn 8-12 giờ trước';
  };

  // Handle view details
  const handleView = (service) => {
    setSelectedService(service);
    setViewModalOpen(true);
  };

  // Handle edit
  const handleEdit = (service) => {
    setSelectedService(service);
    setEditForm({
      serviceName: service.serviceName || '',
      description: service.description || '',
      price: service.price || 0,
      duration: service.durationMinutes || 30, // Map from durationMinutes to duration for backend
      status: service.status || 'ACTIVE'
    });
    setEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (service) => {
    setSelectedService(service);
    setDeleteModalOpen(true);
  };



  // Handle save edit
  const handleSaveEdit = async () => {
    try {
      setActionLoading(true);
      
      // Map form data to backend DTO structure
      const updateData = {
        serviceName: editForm.serviceName,
        description: editForm.description,
        price: editForm.price,
        duration: editForm.duration, // Backend expects 'duration' not 'durationMinutes'
        status: editForm.status
      };
      
      const response = await updateTestingServiceAPI(selectedService.serviceId, updateData);
      
      setEditModalOpen(false);
      setSnackbar({
        open: true,
        message: 'Cập nhật dịch vụ thành công!',
        severity: 'success'
      });
      
      // Reload data
      fetchData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Lỗi khi cập nhật dịch vụ: ' + (error.response?.data || error.message),
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true);
      const response = await deleteTestingServiceAPI(selectedService.serviceId);
      
      setDeleteModalOpen(false);
      setSnackbar({
        open: true,
        message: 'Xóa dịch vụ thành công!',
        severity: 'success'
      });
      
      // Reload data
      fetchData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Lỗi khi xóa dịch vụ: ' + (error.response?.data || error.message),
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const paginatedData = filteredTestingServices.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredTestingServices.length / pageSize);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxHeight: 600, borderRadius: 3 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 80, bgcolor: '#3B6774', color: 'white' }}>STT</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 100, bgcolor: '#3B6774', color: 'white' }}>Mã dịch vụ</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 250, bgcolor: '#3B6774', color: 'white' }}>Tên dịch vụ</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 120, bgcolor: '#3B6774', color: 'white' }}>Giá (VND)</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150, bgcolor: '#3B6774', color: 'white' }}>Danh mục</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 200, bgcolor: '#3B6774', color: 'white' }}>Chuẩn bị</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 100, bgcolor: '#3B6774', color: 'white' }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 120, bgcolor: '#3B6774', color: 'white' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Không có dữ liệu dịch vụ nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((service, index) => (
                <TableRow 
                  key={service.serviceId} 
                  hover
                  sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                >
                  <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell>
                    <Chip 
                      label={`SV${service.serviceId?.toString().padStart(3, '0')}`} 
                      size="small" 
                      variant="outlined"
                      sx={{ 
                        fontFamily: 'monospace', 
                        fontWeight: 'bold',
                        bgcolor: '#E3F2FD',
                        color: '#1976D2'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={service.description || 'Không có mô tả'} arrow placement="top">
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          cursor: 'help',
                          '&:hover': { color: 'primary.main' }
                        }}
                      >
                        {service.serviceName || 'Không có tên'}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {formatPrice(service.price)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getServiceCategory(service)} 
                      size="small"
                      sx={{ 
                        backgroundColor: getCategoryColor(getServiceCategory(service)),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={getPreparationText(service)} arrow placement="top">
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 180,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          cursor: 'help'
                        }}
                      >
                        {getPreparationText(service)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={service.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                      size="small"
                      color={service.status === 'ACTIVE' ? 'success' : 'error'}
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Xem chi tiết">
                        <IconButton 
                          size="small" 
                          onClick={() => handleView(service)}
                          sx={{ color: 'info.main' }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEdit(service)}
                          sx={{ color: 'warning.main' }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(service)}
                          sx={{ color: 'error.main' }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      {filteredTestingServices.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, px: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Hiển thị {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, filteredTestingServices.length)} trong tổng số {filteredTestingServices.length} dịch vụ
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Trước
            </Button>
            <Button
              variant="outlined"
              size="small"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Sau
            </Button>
          </Box>
        </Box>
      )}

      {/* View Details Modal */}
      <Dialog 
        open={viewModalOpen} 
        onClose={() => setViewModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Visibility color="info" />
            Chi tiết dịch vụ
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedService && (
            <Box sx={{ mt: 2 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
                    Thông tin dịch vụ
                  </Typography>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Mã dịch vụ
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" sx={{ color: '#1976d2' }}>
                        SV{selectedService.serviceId?.toString().padStart(3, '0')}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Tên dịch vụ
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {selectedService.serviceName}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Mô tả
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        {selectedService.description || 'Không có mô tả'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Giá
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color="primary" sx={{ fontSize: '1.1rem' }}>
                        {formatPrice(selectedService.price)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Thời gian thực hiện
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedService.durationMinutes} phút
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Danh mục
                      </Typography>
                      <Chip 
                        label={getServiceCategory(selectedService)}
                        size="small"
                        sx={{ 
                          backgroundColor: getCategoryColor(getServiceCategory(selectedService)),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Trạng thái
                      </Typography>
                      <Chip 
                        label={selectedService.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                        size="small"
                        color={selectedService.status === 'ACTIVE' ? 'success' : 'error'}
                        variant="filled"
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Chuẩn bị
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.5 }}>
                        {getPreparationText(selectedService)}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewModalOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog 
        open={editModalOpen} 
        onClose={() => setEditModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Edit color="warning" />
            Chỉnh sửa dịch vụ
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Tên dịch vụ"
                value={editForm.serviceName}
                onChange={(e) => setEditForm({...editForm, serviceName: e.target.value})}
                variant="outlined"
                size="medium"
              />
              <TextField
                fullWidth
                label="Giá (VND)"
                type="number"
                value={editForm.price}
                onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value) || 0})}
                variant="outlined"
                size="medium"
                InputProps={{
                  startAdornment: <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>₫</Typography>,
                }}
              />
              <TextField
                fullWidth
                label="Mô tả"
                multiline
                rows={4}
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                variant="outlined"
                size="medium"
                helperText="Mô tả chi tiết về dịch vụ xét nghiệm"
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Thời gian thực hiện (phút)"
                  type="number"
                  value={editForm.duration}
                  onChange={(e) => setEditForm({...editForm, duration: parseInt(e.target.value) || 30})}
                  variant="outlined"
                  size="medium"
                  helperText="Thời gian thực hiện dịch vụ tính bằng phút"
                  InputProps={{
                    endAdornment: <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>phút</Typography>,
                  }}
                />
                <FormControl fullWidth variant="outlined" size="medium">
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    label="Trạng thái"
                  >
                    <MenuItem value="ACTIVE">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label="Hoạt động" size="small" color="success" variant="filled" />
                      </Box>
                    </MenuItem>
                    <MenuItem value="INACTIVE">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label="Không hoạt động" size="small" color="error" variant="filled" />
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} disabled={actionLoading}>
            Hủy
          </Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained" 
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : <Save />}
          >
            {actionLoading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog 
        open={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="error" />
            Xác nhận xóa
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedService && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
                Bạn có thật sự muốn xóa dịch vụ này?
              </Typography>
              <Card variant="outlined" sx={{ p: 3, mb: 3, borderColor: 'error.main' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Warning color="error" sx={{ fontSize: 28 }} />
                  <Typography variant="h6" color="error" fontWeight="bold">
                    {selectedService.serviceName}
                  </Typography>
                </Box>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                      Mã dịch vụ:
                    </Typography>
                    <Chip 
                      label={`SV${selectedService.serviceId?.toString().padStart(3, '0')}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                      Giá:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="primary">
                      {formatPrice(selectedService.price)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                      Danh mục:
                    </Typography>
                    <Chip 
                      label={getServiceCategory(selectedService)}
                      size="small"
                      sx={{ 
                        backgroundColor: getCategoryColor(getServiceCategory(selectedService)),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                      Trạng thái:
                    </Typography>
                    <Chip 
                      label={selectedService.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                      size="small"
                      color={selectedService.status === 'ACTIVE' ? 'success' : 'error'}
                      variant="filled"
                    />
                  </Box>
                </Stack>
              </Card>
              <Alert severity="warning" sx={{ 
                '& .MuiAlert-icon': { fontSize: 24 },
                '& .MuiAlert-message': { fontSize: '0.95rem' }
              }}>
                <Typography variant="body2" fontWeight="medium">
                  ⚠️ Hành động này không thể hoàn tác. Dịch vụ sẽ bị xóa vĩnh viễn khỏi hệ thống.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} disabled={actionLoading}>
            Hủy
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            color="error"
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : <Delete />}
          >
            {actionLoading ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TestingTable;
