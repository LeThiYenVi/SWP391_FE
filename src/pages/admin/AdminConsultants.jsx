import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Stack,
  Divider,
  Avatar,
  TextField
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  getAllConsultantsAPI,
  createConsultantAPI,
  updateConsultantAPI,
  deleteConsultantAPI
} from '../../services/AdminService';

export default function AdminConsultants() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [consultants, setConsultants] = useState([]);
  const [filteredConsultants, setFilteredConsultants] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetchConsultants();
  }, [refreshKey]);

  const fetchConsultants = async () => {
    try {
      setLoading(true);
      const response = await getAllConsultantsAPI();
      console.log('Consultants response:', response);
      
      const consultantsData = Array.isArray(response) ? response : (response.data || []);
      setConsultants(consultantsData);
      setFilteredConsultants(consultantsData);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu tư vấn viên:', err);
      setError('Không thể tải dữ liệu tư vấn viên. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = consultants.filter(consultant => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return (
        consultant.fullName?.toLowerCase().includes(lowerCaseSearchTerm) ||
        consultant.email?.toLowerCase().includes(lowerCaseSearchTerm) ||
        consultant.specialization?.toLowerCase().includes(lowerCaseSearchTerm) ||
        consultant.username?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });
    setFilteredConsultants(filtered);
  }, [searchTerm, consultants]);

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
    toast.success("Đã làm mới dữ liệu!");
  };

  const handleAddNew = () => {
    toast.info("Tính năng thêm tư vấn viên mới sẽ được phát triển!");
  };

  // Handle view
  const handleView = (consultant) => {
    setSelectedConsultant(consultant);
    setViewModalOpen(true);
  };

  // Handle edit
  const handleEdit = (consultant) => {
    setSelectedConsultant(consultant);
    setEditForm({
      fullName: consultant.fullName || '',
      email: consultant.email || '',
      phoneNumber: consultant.phoneNumber || '',
      gender: consultant.gender || '',
      birthDate: consultant.birthDate || '',
      address: consultant.address || '',
      biography: consultant.biography || '',
      qualifications: consultant.qualifications || '',
      experienceYears: consultant.experienceYears || 0,
      specialization: consultant.specialization || ''
    });
    setEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (consultant) => {
    setSelectedConsultant(consultant);
    setDeleteModalOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    try {
      setActionLoading(true);
      
      const updateData = {
        fullName: editForm.fullName,
        email: editForm.email,
        phoneNumber: editForm.phoneNumber,
        gender: editForm.gender,
        birthDate: editForm.birthDate,
        address: editForm.address,
        biography: editForm.biography,
        qualifications: editForm.qualifications,
        experienceYears: editForm.experienceYears,
        specialization: editForm.specialization
      };

      const response = await updateConsultantAPI(selectedConsultant.id, updateData);
      
      setEditModalOpen(false);
      toast.success('Cập nhật tư vấn viên thành công!');
      
      // Reload data
      fetchConsultants();
    } catch (error) {
      toast.error('Lỗi khi cập nhật tư vấn viên: ' + (error.response?.data || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true);
      const response = await deleteConsultantAPI(selectedConsultant.id);
      
      setDeleteModalOpen(false);
      toast.success('Xóa tư vấn viên thành công!');
      
      // Reload data
      fetchConsultants();
    } catch (error) {
      toast.error('Lỗi khi xóa tư vấn viên: ' + (error.response?.data || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getGenderText = (gender) => {
    switch (gender) {
      case 'MALE': return 'Nam';
      case 'FEMALE': return 'Nữ';
      case 'OTHER': return 'Khác';
      default: return 'Chưa cập nhật';
    }
  };

  const getStatusChip = (consultant) => {
    // Giả sử status được tính dựa trên một số điều kiện
    const isActive = consultant.experienceYears > 0; // Logic đơn giản
    return (
      <Chip
        label={isActive ? 'Hoạt động' : 'Tạm dừng'}
        color={isActive ? 'success' : 'warning'}
        variant="filled"
        size="small"
        sx={{ fontWeight: 'bold' }}
      />
    );
  };

  const paginatedConsultants = filteredConsultants.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredConsultants.length / pageSize);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexShrink: 0, minHeight: 64 }}>
          <Header />
        </Box>

        <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 2, overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 2, mt: 2 }}>
            <Typography variant='h3' sx={{ fontWeight: 500, color: 'gray' }}>
              Quản lý tư vấn viên
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Thêm tư vấn viên mới">
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddNew}
                    sx={{
                      bgcolor: '#4CAF50',
                      '&:hover': { bgcolor: '#45a049' },
                      color: '#fff',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      px: 3,
                      py: 1.2,
                      mr: 1
                    }}
                  >
                    Thêm mới
                  </Button>
                </Tooltip>
                <Tooltip title="Làm mới dữ liệu">
                  <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={handleRefresh}
                    sx={{
                      backgroundColor: '#2196F3',
                      '&:hover': { backgroundColor: '#1976D2' },
                      color: '#fff',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      px: 3,
                      py: 1.2
                    }}
                  >
                    Làm mới
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          {/* TABLE AREA */}
          <Box sx={{ bgcolor: '#f5f5f5', p: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Đang tải dữ liệu...</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#3B6774' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }}>STT</TableCell>
                      <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }}>Họ tên</TableCell>
                      <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }}>Số điện thoại</TableCell>
                      <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }}>Chuyên môn</TableCell>
                      <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }}>Kinh nghiệm</TableCell>
                      <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }}>Trạng thái</TableCell>
                      <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }} align="center">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedConsultants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            Không có dữ liệu tư vấn viên nào
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedConsultants.map((consultant, index) => (
                        <TableRow key={consultant.id} hover>
                          <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                                {consultant.fullName?.charAt(0) || 'T'}
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {consultant.fullName || 'Chưa cập nhật'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{consultant.email || 'Chưa cập nhật'}</TableCell>
                          <TableCell>{consultant.phoneNumber || 'Chưa cập nhật'}</TableCell>
                          <TableCell>
                            <Chip 
                              label={consultant.specialization || 'Chưa cập nhật'} 
                              size="small"
                              sx={{ 
                                backgroundColor: '#E3F2FD',
                                color: '#1976D2',
                                fontWeight: 'bold'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              {consultant.experienceYears || 0} năm
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {getStatusChip(consultant)}
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                              <Tooltip title="Xem chi tiết">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleView(consultant)}
                                  sx={{ color: 'info.main' }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Chỉnh sửa">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEdit(consultant)}
                                  sx={{ color: 'warning.main' }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xóa">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDelete(consultant)}
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
            )}

            {/* Pagination */}
            {filteredConsultants.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, px: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Hiển thị {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, filteredConsultants.length)} trong tổng số {filteredConsultants.length} tư vấn viên
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
          </Box>
        </Box>
      </Box>

      {/* View Detail Modal */}
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1976d2', color: '#fff', pb: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Chi tiết tư vấn viên
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedConsultant && (
            <Box sx={{ mt: 2 }}>
              <Card variant="outlined" sx={{ borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Thông tin tư vấn viên
                  </Typography>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Họ tên
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {selectedConsultant.fullName || 'Chưa cập nhật'}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {selectedConsultant.email || 'Chưa cập nhật'}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Số điện thoại
                      </Typography>
                      <Typography variant="body1">
                        {selectedConsultant.phoneNumber || 'Chưa cập nhật'}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Giới tính
                      </Typography>
                      <Typography variant="body1">
                        {getGenderText(selectedConsultant.gender)}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Ngày sinh
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(selectedConsultant.birthDate)}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Địa chỉ
                      </Typography>
                      <Typography variant="body1">
                        {selectedConsultant.address || 'Chưa cập nhật'}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Tiểu sử
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        {selectedConsultant.biography || 'Chưa cập nhật'}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Bằng cấp
                      </Typography>
                      <Typography variant="body1">
                        {selectedConsultant.qualifications || 'Chưa cập nhật'}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Kinh nghiệm
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color="primary">
                        {selectedConsultant.experienceYears || 0} năm
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Chuyên môn
                      </Typography>
                      <Chip 
                        label={selectedConsultant.specialization || 'Chưa cập nhật'} 
                        size="medium"
                        sx={{ 
                          backgroundColor: '#E3F2FD',
                          color: '#1976D2',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={() => setViewModalOpen(false)} variant="outlined" color="secondary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#ff9800', color: '#fff', pb: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Chỉnh sửa tư vấn viên
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedConsultant && (
            <Box sx={{ mt: 2 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Họ tên"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                  variant="outlined"
                  size="medium"
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  variant="outlined"
                  size="medium"
                />
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                  variant="outlined"
                  size="medium"
                />
                <Stack direction="row" spacing={2}>
                  <FormControl fullWidth variant="outlined" size="medium">
                    <InputLabel>Giới tính</InputLabel>
                    <Select
                      value={editForm.gender}
                      onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                      label="Giới tính"
                    >
                      <MenuItem value="MALE">Nam</MenuItem>
                      <MenuItem value="FEMALE">Nữ</MenuItem>
                      <MenuItem value="OTHER">Khác</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Kinh nghiệm (năm)"
                    type="number"
                    value={editForm.experienceYears}
                    onChange={(e) => setEditForm({...editForm, experienceYears: parseInt(e.target.value) || 0})}
                    variant="outlined"
                    size="medium"
                  />
                </Stack>
                <TextField
                  fullWidth
                  label="Chuyên môn"
                  value={editForm.specialization}
                  onChange={(e) => setEditForm({...editForm, specialization: e.target.value})}
                  variant="outlined"
                  size="medium"
                />
                <TextField
                  fullWidth
                  label="Bằng cấp"
                  value={editForm.qualifications}
                  onChange={(e) => setEditForm({...editForm, qualifications: e.target.value})}
                  variant="outlined"
                  size="medium"
                />
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  variant="outlined"
                  size="medium"
                />
                <TextField
                  fullWidth
                  label="Tiểu sử"
                  multiline
                  rows={4}
                  value={editForm.biography}
                  onChange={(e) => setEditForm({...editForm, biography: e.target.value})}
                  variant="outlined"
                  size="medium"
                  helperText="Mô tả chi tiết về kinh nghiệm và chuyên môn."
                />
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={() => setEditModalOpen(false)} variant="outlined" color="secondary" disabled={actionLoading}>
            Hủy
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary" disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Lưu thay đổi'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#f44336', color: '#fff', pb: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Xác nhận xóa tư vấn viên
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedConsultant && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Bạn có thật sự muốn xóa tư vấn viên này?
              </Typography>
              <Card variant="outlined" sx={{ mt: 2, p: 2, backgroundColor: '#ffebee', borderColor: '#f44336', borderRadius: '8px' }}>
                <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                  {selectedConsultant.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {selectedConsultant.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Chuyên môn: {selectedConsultant.specialization}
                </Typography>
              </Card>
              <Alert severity="warning" sx={{ mt: 2, borderRadius: '8px' }}>
                Hành động này không thể hoàn tác.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={() => setDeleteModalOpen(false)} variant="outlined" color="secondary" disabled={actionLoading}>
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
