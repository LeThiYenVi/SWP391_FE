import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  InputBase
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import staffService from '../../services/StaffService';

const StaffServiceInput = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [newService, setNewService] = useState({
    serviceName: '',
    description: '',
    price: '',
    durationMinutes: '',
    category: '',
    preparationInstructions: '',
    status: 'ACTIVE'
  });
  const [editForm, setEditForm] = useState({});
  const [formErrors, setFormErrors] = useState([]);
  const [editFormErrors, setEditFormErrors] = useState([]);

  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const categories = [
    'Xét nghiệm máu',
    'Xét nghiệm nước tiểu',
    'Xét nghiệm phân',
    'Xét nghiệm vi sinh',
    'Xét nghiệm hóa sinh',
    'Xét nghiệm miễn dịch',
    'Xét nghiệm di truyền',
    'Khác'
  ];

  useEffect(() => {
    console.log('🔄 Component mounted, fetching services...');
    fetchServices();
  }, [refreshKey]);

  useEffect(() => {
    filterServices();
  }, [searchTerm, services]);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Fetching services...');
      const response = await staffService.getAllTestingServices();
      console.log('📦 Full response:', response);

      if (response.success) {
        const servicesData = response.data || [];
        console.log('✅ Services data:', servicesData);
        console.log('📊 Services count:', servicesData.length);
        setServices(servicesData);
        setFilteredServices(servicesData);
      } else {
        console.log('❌ Response failed:', response.message);
        setError(response.message || 'Không thể tải danh sách dịch vụ');
      }
    } catch (err) {
      console.error('💥 Error fetching services:', err);
      setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    if (!searchTerm) {
      setFilteredServices(services);
      return;
    }

    const filtered = services.filter(
      (service) =>
        service.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.serviceId?.toString().includes(searchTerm)
    );
    setFilteredServices(filtered);
  };

  // Validation function
  const validateForm = () => {
    const errors = [];

    if (!newService.serviceName.trim()) {
      errors.push('Tên dịch vụ không được để trống');
    }

    if (!newService.description.trim()) {
      errors.push('Mô tả không được để trống');
    }

    if (!newService.price || isNaN(newService.price) || parseFloat(newService.price) <= 0) {
      errors.push('Giá phải là số dương lớn hơn 0');
    }

    if (!newService.durationMinutes || isNaN(newService.durationMinutes) || parseInt(newService.durationMinutes) <= 0) {
      errors.push('Thời gian thực hiện phải là số nguyên dương lớn hơn 0');
    }

    if (!newService.category.trim()) {
      errors.push('Danh mục không được để trống');
    }

    return errors;
  };

  // Validation function for edit form
  const validateEditForm = () => {
    const errors = [];

    if (!editForm.serviceName?.trim()) {
      errors.push('Tên dịch vụ không được để trống');
    }

    if (!editForm.description?.trim()) {
      errors.push('Mô tả không được để trống');
    }

    if (!editForm.price || isNaN(editForm.price) || parseFloat(editForm.price) <= 0) {
      errors.push('Giá phải là số dương lớn hơn 0');
    }

    if (!editForm.durationMinutes || isNaN(editForm.durationMinutes) || parseInt(editForm.durationMinutes) <= 0) {
      errors.push('Thời gian thực hiện phải là số nguyên dương lớn hơn 0');
    }

    if (!editForm.category?.trim()) {
      errors.push('Danh mục không được để trống');
    }

    return errors;
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    fetchServices();
    setSnackbar({
      open: true,
      message: 'Đã làm mới dữ liệu!',
      severity: 'success'
    });
  };



  const formatCurrency = (amount) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setEditForm({
      serviceName: service.serviceName,
      description: service.description,
      price: service.price.toString(),
      durationMinutes: service.durationMinutes?.toString() || '',
      category: service.category || '',
      preparationInstructions: service.preparationInstructions || '',
      status: service.status || 'ACTIVE'
    });
    setEditModalOpen(true);
  };

  const handleDelete = (service) => {
    setSelectedService(service);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedService) return;

    setActionLoading(true);
    try {
      const response = await staffService.deleteTestingService(selectedService.serviceId);
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Xóa dịch vụ thành công!',
          severity: 'success'
        });
        setRefreshKey(prev => prev + 1);
        setDeleteModalOpen(false);
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Không thể xóa dịch vụ',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa dịch vụ',
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddSubmit = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors([]); // Clear previous errors

    setActionLoading(true);
    try {
      const serviceData = {
        ...newService,
        price: Number(newService.price),
        durationMinutes: Number(newService.durationMinutes)
      };

      const response = await staffService.createTestingService(serviceData);
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Thêm dịch vụ thành công!',
          severity: 'success'
        });
        setRefreshKey(prev => prev + 1);
        setShowAddModal(false);
        setNewService({
          serviceName: '',
          description: '',
          price: '',
          durationMinutes: '',
          category: '',
          preparationInstructions: '',
          status: 'ACTIVE'
        });
      } else {
        setFormErrors([response.message || 'Không thể thêm dịch vụ']);
      }
    } catch (error) {
      console.error('Error adding service:', error);
      setFormErrors(['Có lỗi xảy ra khi thêm dịch vụ']);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    const validationErrors = validateEditForm();
    if (validationErrors.length > 0) {
      setEditFormErrors(validationErrors);
      return;
    }

    setEditFormErrors([]); // Clear previous errors

    setActionLoading(true);
    try {
      const serviceData = {
        ...editForm,
        price: Number(editForm.price),
        durationMinutes: Number(editForm.durationMinutes)
      };

      const response = await staffService.updateTestingService(selectedService.serviceId, serviceData);
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Cập nhật dịch vụ thành công!',
          severity: 'success'
        });
        setRefreshKey(prev => prev + 1);
        setEditModalOpen(false);
      } else {
        setEditFormErrors([response.message || 'Không thể cập nhật dịch vụ']);
      }
    } catch (error) {
      console.error('Error updating service:', error);
      setEditFormErrors(['Có lỗi xảy ra khi cập nhật dịch vụ']);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress sx={{ color: '#3B6774' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', p: 2, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 2, mt: 2 }}>
        <Typography variant='h3' sx={{ fontWeight: 500, color: 'gray' }}>
          Quản lý dịch vụ xét nghiệm
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search and Action Buttons */}
      <Box sx={{
        bgcolor: 'white',
        borderRadius: 3,
        p: 2,
        mb: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          {/* Search Box */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#f8f9fa',
            borderRadius: '20px',
            px: 2,
            py: 1,
            minWidth: 300,
            flex: 1,
            maxWidth: 500
          }}>
            <SearchIcon sx={{ color: '#6c757d', mr: 1 }} />
            <InputBase
              placeholder="Tìm kiếm dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                flex: 1,
                '& input': {
                  padding: 0,
                  fontSize: '14px'
                }
              }}
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Thêm dịch vụ mới">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowAddModal(true)}
                sx={{
                  bgcolor: '#3B6774',
                  color: 'white',
                  borderRadius: '20px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(59, 103, 116, 0.3)',
                  '&:hover': {
                    bgcolor: '#2d5259',
                    boxShadow: '0 4px 12px rgba(59, 103, 116, 0.4)',
                  }
                }}
              >
                Thêm mới
              </Button>
            </Tooltip>

            <Tooltip title="Làm mới dữ liệu">
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                sx={{
                  borderColor: '#3B6774',
                  color: '#3B6774',
                  borderRadius: '20px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#2d5259',
                    bgcolor: 'rgba(59, 103, 116, 0.04)',
                  }
                }}
              >
                Làm mới
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Box>



      {/* Services Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 80, bgcolor: '#3B6774', color: 'white' }}>STT</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 100, bgcolor: '#3B6774', color: 'white' }}>Mã dịch vụ</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 250, bgcolor: '#3B6774', color: 'white' }}>Tên dịch vụ</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 120, bgcolor: '#3B6774', color: 'white' }}>Giá (VND)</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 100, bgcolor: '#3B6774', color: 'white' }}>Thời gian (phút)</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150, bgcolor: '#3B6774', color: 'white' }}>Danh mục</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 200, bgcolor: '#3B6774', color: 'white' }}>Chuẩn bị</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 100, bgcolor: '#3B6774', color: 'white' }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 120, bgcolor: '#3B6774', color: 'white' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Không có dữ liệu dịch vụ nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredServices.map((service, index) => (
                <TableRow
                  key={service.serviceId}
                  hover
                  sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {service.serviceId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {service.serviceName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="primary" fontWeight="medium">
                      {formatCurrency(service.price)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.primary" fontWeight="medium">
                      {service.durationMinutes || 0} phút
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={service.category || 'Chưa phân loại'}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: '#3B6774',
                        color: '#3B6774',
                        fontSize: '0.75rem'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={service.preparationInstructions || 'Không có hướng dẫn'}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {service.preparationInstructions || 'Không có hướng dẫn'}
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
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(service)}
                          sx={{ color: 'warning.main' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(service)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon fontSize="small" />
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

      {/* Add Service Modal */}
      <Dialog open={showAddModal} onClose={() => {
        setShowAddModal(false);
        setFormErrors([]);
      }} maxWidth="md" fullWidth>
        <DialogTitle>Thêm dịch vụ mới</DialogTitle>
        <DialogContent>
          {/* Error Display */}
          {formErrors.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {formErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Tên dịch vụ"
              value={newService.serviceName}
              onChange={(e) => setNewService({...newService, serviceName: e.target.value})}
              fullWidth
              required
            />
            <TextField
              label="Mô tả"
              value={newService.description}
              onChange={(e) => setNewService({...newService, description: e.target.value})}
              fullWidth
              multiline
              rows={3}
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Giá (VND)"
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({...newService, price: e.target.value})}
                fullWidth
                required
                inputProps={{ min: 0, step: 1000 }}
              />
              <TextField
                label="Thời gian (phút)"
                type="number"
                value={newService.durationMinutes}
                onChange={(e) => setNewService({...newService, durationMinutes: e.target.value})}
                fullWidth
                required
                inputProps={{ min: 1, step: 1 }}
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={newService.category}
                onChange={(e) => setNewService({...newService, category: e.target.value})}
                label="Danh mục"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Hướng dẫn chuẩn bị"
              value={newService.preparationInstructions}
              onChange={(e) => setNewService({...newService, preparationInstructions: e.target.value})}
              fullWidth
              multiline
              rows={2}
            />
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={newService.status}
                onChange={(e) => setNewService({...newService, status: e.target.value})}
                label="Trạng thái"
              >
                <MenuItem value="ACTIVE">Hoạt động</MenuItem>
                <MenuItem value="INACTIVE">Không hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowAddModal(false);
            setFormErrors([]);
          }}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleAddSubmit}
            disabled={actionLoading}
            sx={{ bgcolor: '#3B6774', '&:hover': { bgcolor: '#2d5259' } }}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Thêm dịch vụ'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Service Modal */}
      <Dialog open={editModalOpen} onClose={() => {
        setEditModalOpen(false);
        setEditFormErrors([]);
      }} maxWidth="md" fullWidth>
        <DialogTitle>Chỉnh sửa dịch vụ</DialogTitle>
        <DialogContent>
          {/* Error Display */}
          {editFormErrors.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {editFormErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Tên dịch vụ"
              value={editForm.serviceName || ''}
              onChange={(e) => setEditForm({...editForm, serviceName: e.target.value})}
              fullWidth
              required
            />
            <TextField
              label="Mô tả"
              value={editForm.description || ''}
              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              fullWidth
              multiline
              rows={3}
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Giá (VND)"
                type="number"
                value={editForm.price || ''}
                onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                fullWidth
                required
                inputProps={{ min: 0, step: 1000 }}
              />
              <TextField
                label="Thời gian (phút)"
                type="number"
                value={editForm.durationMinutes || ''}
                onChange={(e) => setEditForm({...editForm, durationMinutes: e.target.value})}
                fullWidth
                required
                inputProps={{ min: 1, step: 1 }}
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={editForm.category || ''}
                onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                label="Danh mục"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Hướng dẫn chuẩn bị"
              value={editForm.preparationInstructions || ''}
              onChange={(e) => setEditForm({...editForm, preparationInstructions: e.target.value})}
              fullWidth
              multiline
              rows={2}
            />
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={editForm.status || 'ACTIVE'}
                onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                label="Trạng thái"
              >
                <MenuItem value="ACTIVE">Hoạt động</MenuItem>
                <MenuItem value="INACTIVE">Không hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEditModalOpen(false);
            setEditFormErrors([]);
          }}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleEditSubmit}
            disabled={actionLoading}
            sx={{ bgcolor: '#3B6774', '&:hover': { bgcolor: '#2d5259' } }}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Cập nhật'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa dịch vụ "{selectedService?.serviceName}" không?
          </Typography>
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
            startIcon={actionLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
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

export default StaffServiceInput;
