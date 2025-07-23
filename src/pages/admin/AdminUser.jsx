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
  getAllUsersAPI,
  getUserByIdAPI,
  updateUserAPI,
  deleteUserAPI,
  setUserToConsultantAPI,
  registerUserAPI
} from '../../services/AdminService';

export default function AdminUser() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roleChangeModalOpen, setRoleChangeModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [openAdd, setOpenAdd] = useState(false);
  const [addData, setAddData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    gender: '',
    dateOfBirth: '',
    roleName: '',
  });

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleAddChange = (e) => setAddData({ ...addData, [e.target.name]: e.target.value });
  const handleAddSubmit = async () => {
    try {
      await registerUserAPI(addData);
      toast.success('Thêm người dùng mới thành công!');
      handleCloseAdd();
      fetchUsers();
    } catch (err) {
      toast.error('Thêm người dùng mới thất bại!');
    }
  };

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetchUsers(page);
  }, [refreshKey, page]);

  const fetchUsers = async (pageNum = page) => {
    try {
      setLoading(true);
      const response = await getAllUsersAPI(pageNum, pageSize);
      const usersData = response.content || response.items || [];
      setUsers(usersData);
      setFilteredUsers(usersData);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || usersData.length);
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu người dùng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = users.filter(user => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return (
        user.fullName?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
    toast.success("Đã làm mới dữ liệu!");
  };

  const handleAddNew = () => {
    toast.info("Tính năng thêm người dùng mới sẽ được phát triển!");
  };

  // Handle view
  const handleView = (user) => {
    console.log('Viewing user:', user);
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  // Handle edit
  const handleEdit = (user) => {
    console.log('Editing user:', user);
    setSelectedUser(user);
    setEditForm({
      fullName: user.fullName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      roleName: user.roleName || 'CUSTOMER'
    });
    setEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (user) => {
    console.log('Deleting user:', user);
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    try {
      setActionLoading(true);
      
      // Debug: Kiểm tra selectedUser
      console.log('selectedUser:', selectedUser);
      console.log('selectedUser.userId:', selectedUser?.userId);
      console.log('selectedUser.id:', selectedUser?.id);
      
      // Kiểm tra userId - có thể là userId hoặc id
      const userId = selectedUser?.userId || selectedUser?.id;
      
      if (!selectedUser || !userId) {
        toast.error('Không tìm thấy thông tin người dùng!');
        return;
      }
      
      // Kiểm tra xem có thay đổi vai trò thành CONSULTANT không
      const isRoleChangedToConsultant = editForm.roleName === 'CONSULTANT' && selectedUser.roleName !== 'CONSULTANT';
      
      console.log('Role change check:', {
        newRole: editForm.roleName,
        oldRole: selectedUser.roleName,
        isRoleChangedToConsultant: isRoleChangedToConsultant
      });
      
      // Chuẩn bị data để update user (không bao gồm roleName nếu thay đổi thành CONSULTANT)
      const updateData = {
        fullName: editForm.fullName,
        email: editForm.email,
        phoneNumber: editForm.phoneNumber,
        address: editForm.address
      };
      
      // Chỉ thêm roleName vào updateData nếu không phải thay đổi thành CONSULTANT
      if (!isRoleChangedToConsultant) {
        updateData.roleName = editForm.roleName;
      }

      console.log('Calling updateUserAPI with userId:', userId, 'and data:', updateData);
      
      // Cập nhật thông tin người dùng
      const response = await updateUserAPI(userId, updateData);
      
      // Nếu có thay đổi vai trò thành CONSULTANT, gọi API setUserToConsultant riêng
      if (isRoleChangedToConsultant) {
        console.log('Calling setUserToConsultantAPI for userId:', userId);
        try {
          await setUserToConsultantAPI(userId);
          console.log('setUserToConsultantAPI called successfully');
          toast.success('Cập nhật người dùng thành công và đã set role Consultant!', {
            autoClose: 4000,
            position: "top-right"
          });
        } catch (consultantError) {
          console.error('Lỗi khi set role Consultant:', consultantError);
          const errorMessage = consultantError.response?.data?.message || consultantError.response?.data || consultantError.message;
          toast.warning(`Cập nhật thông tin thành công nhưng có lỗi khi set role Consultant: ${errorMessage}`, {
            autoClose: 6000,
            position: "top-right"
          });
        }
      } else {
        console.log('No role change to CONSULTANT, skipping setUserToConsultantAPI');
        toast.success('Cập nhật người dùng thành công!', {
          autoClose: 3000,
          position: "top-right"
        });
      }
      
      setEditModalOpen(false);
      
      // Reload data
      fetchUsers();
    } catch (error) {
      toast.error('Lỗi khi cập nhật người dùng: ' + (error.response?.data || error.message));
    } finally {
      setActionLoading(false);
    }
  };
// Handle role change
const handleRoleChange = (user, newRole) => {
  setSelectedUser(user);
  setNewRole(newRole);
  setRoleChangeModalOpen(true);
};

// Handle confirm role change
const handleConfirmRoleChange = async () => {
  try {
    setActionLoading(true);
    const userId = selectedUser?.userId || selectedUser?.id;
    
    if (!userId) {
      toast.error('Không tìm thấy thông tin người dùng!');
      return;
    }

    console.log('Changing role for userId:', userId, 'to:', newRole);

    // Nếu thay đổi thành CONSULTANT, gọi API setUserToConsultant
    if (newRole === 'CONSULTANT') {
      try {
        await setUserToConsultantAPI(userId);
        console.log('setUserToConsultantAPI called successfully');
        toast.success('Thay đổi vai trò thành công và đã set role Consultant!', {
          autoClose: 4000,
          position: "top-right"
        });
      } catch (consultantError) {
        console.error('Lỗi khi set role Consultant:', consultantError);
        const errorMessage = consultantError.response?.data?.message || consultantError.response?.data || consultantError.message;
        toast.error(`Lỗi khi set role Consultant: ${errorMessage}`, {
          autoClose: 6000,
          position: "top-right"
        });
        return;
      }
    } else {
      // Cập nhật role thông thường
      const updateData = { roleName: newRole };
      await updateUserAPI(userId, updateData);
      toast.success('Thay đổi vai trò thành công!', {
        autoClose: 3000,
        position: "top-right"
      });
    }
    
    setRoleChangeModalOpen(false);
    
    // Reload data
    fetchUsers();
  } catch (error) {
    toast.error('Lỗi khi thay đổi vai trò: ' + (error.response?.data || error.message));
  } finally {
    setActionLoading(false);
  }
};
  // Handle confirm delete
  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true);
      const userId = selectedUser?.userId || selectedUser?.id;
      const response = await deleteUserAPI(userId);
      
      setDeleteModalOpen(false);
      toast.success('Xóa người dùng thành công!');
      
      // Reload data
      fetchUsers();
    } catch (error) {
      toast.error('Lỗi khi xóa người dùng: ' + (error.response?.data || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleChip = (roleName) => {
    let color = 'default';
    let label = roleName;
    
    switch (roleName) {
      case 'ADMIN':
        color = 'error';
        label = 'Admin';
        break;
      case 'CONSULTANT':
        color = 'primary';
        label = 'Tư vấn viên';
        break;
      case 'CUSTOMER':
        color = 'success';
        label = 'Khách hàng';
        break;
      default:
        color = 'default';
        break;
    }
    
    return <Chip label={label} color={color} variant="filled" size="small" sx={{ fontWeight: 'bold' }} />;
  };

  const getStatusChip = (user) => {
    // Giả sử status dựa trên một số điều kiện
    const isActive = !user.isDeleted; // Logic đơn giản
    return (
      <Chip
        label={isActive ? 'Hoạt động' : 'Đã xóa'}
        color={isActive ? 'success' : 'error'}
        variant="filled"
        size="small"
        sx={{ fontWeight: 'bold' }}
      />
    );
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

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
              Quản lý người dùng
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Search box */}
              <Box sx={{ display: 'flex', alignItems: 'center', width: 300, bgcolor: 'white', borderRadius: '999px', px: 2, py: '6px', boxShadow: '0 0 0 1px #ccc' }}>
                <SearchIcon sx={{ color: 'gray', mr: 1 }} />
                <InputBase
                  placeholder="Tìm kiếm người dùng..."
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
                <Tooltip title="Thêm người dùng mới">
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAdd}
                    sx={{
                      bgcolor: '#4CAF50',
                      '&:hover': { bgcolor: '#388e3c' },
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
                      <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }}>Vai trò</TableCell>
                      <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }}>Trạng thái</TableCell>
                      <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }} align="center">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            Không có dữ liệu người dùng nào
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user, index) => {
                        console.log('User data:', user); // Debug log
                        return (
                          <TableRow key={user.userId || user.id} hover>
                            <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                                  {user.fullName?.charAt(0) || 'U'}
                                </Avatar>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {user.fullName || 'Chưa cập nhật'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{user.email || 'Chưa cập nhật'}</TableCell>
                            <TableCell>{user.phoneNumber || 'Chưa cập nhật'}</TableCell>
                            <TableCell>
                              {getRoleChip(user.roleName)}
                            </TableCell>
                            <TableCell>
                              {getStatusChip(user)}
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                <Tooltip title="Xem chi tiết">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleView(user)}
                                    sx={{ color: 'info.main' }}
                                  >
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Chỉnh sửa">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleEdit(user)}
                                    sx={{ color: 'warning.main' }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Xóa">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleDelete(user)}
                                    sx={{ color: 'error.main' }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Pagination */}
            {totalElements > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, px: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Hiển thị {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalElements)} trong tổng số {totalElements} người dùng
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={page === 1}
                    onClick={handlePrevPage}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={page === totalPages}
                    onClick={handleNextPage}
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
            Chi tiết người dùng
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedUser && (
            <Box sx={{ mt: 2 }}>
              <Card variant="outlined" sx={{ borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Thông tin người dùng
                  </Typography>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        ID người dùng
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" sx={{ color: '#1976d2' }}>
                        {selectedUser.userId || selectedUser.id}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Họ tên
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {selectedUser.fullName || 'Chưa cập nhật'}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {selectedUser.email || 'Chưa cập nhật'}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Tên đăng nhập
                      </Typography>
                      <Typography variant="body1">
                        {selectedUser.username || 'Chưa cập nhật'}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Số điện thoại
                      </Typography>
                      <Typography variant="body1">
                        {selectedUser.phoneNumber || 'Chưa cập nhật'}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Địa chỉ
                      </Typography>
                      <Typography variant="body1">
                        {selectedUser.address || 'Chưa cập nhật'}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Vai trò
                      </Typography>
                      {getRoleChip(selectedUser.roleName)}
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Trạng thái
                      </Typography>
                      {getStatusChip(selectedUser)}
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Ngày tạo
                      </Typography>
                      <Typography variant="body1">
                        {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                      </Typography>
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
            Chỉnh sửa người dùng
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedUser && (
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
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  variant="outlined"
                  size="medium"
                />
                <FormControl fullWidth variant="outlined" size="medium">
                  <InputLabel>Vai trò</InputLabel>
                  <Select
                    value={editForm.roleName}
                    onChange={(e) => setEditForm({...editForm, roleName: e.target.value})}
                    label="Vai trò"
                  >
                    <MenuItem value="CUSTOMER">Khách hàng</MenuItem>
                    <MenuItem value="CONSULTANT">Tư vấn viên</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleRoleChange(selectedUser, editForm.roleName)}
                  disabled={editForm.roleName === selectedUser?.roleName}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Thay đổi vai trò
                </Button>
                {editForm.roleName === 'CONSULTANT' && (
                  <Alert severity="info" sx={{ mt: 1, borderRadius: '8px' }}>
                    <Typography variant="body2">
                      <strong>Lưu ý:</strong> Khi chọn vai trò "Tư vấn viên", hệ thống sẽ tự động gọi API setUserToConsultant để tạo lịch làm việc mặc định cho người dùng này.
                    </Typography>
                  </Alert>
                )}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={() => setEditModalOpen(false)} variant="outlined" color="secondary" disabled={actionLoading}>
            Hủy
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary" disabled={actionLoading}>
            {actionLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                <Typography variant="body2">Đang xử lý...</Typography>
              </Box>
            ) : 'Lưu thay đổi'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#f44336', color: '#fff', pb: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Xác nhận xóa người dùng
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedUser && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Bạn có thật sự muốn xóa người dùng này?
              </Typography>
              <Card variant="outlined" sx={{ mt: 2, p: 2, backgroundColor: '#ffebee', borderColor: '#f44336', borderRadius: '8px' }}>
                <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                  {selectedUser.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {selectedUser.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vai trò: {getRoleChip(selectedUser.roleName).props.label}
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

      {/* Role Change Confirmation Modal */}
      <Dialog open={roleChangeModalOpen} onClose={() => setRoleChangeModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1976d2', color: '#fff', pb: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Xác nhận thay đổi vai trò
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedUser && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Bạn có muốn thay đổi vai trò của người dùng này?
              </Typography>
              <Card variant="outlined" sx={{ mt: 2, p: 2, backgroundColor: '#e3f2fd', borderColor: '#1976d2', borderRadius: '8px' }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  {selectedUser.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {selectedUser.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vai trò hiện tại: {getRoleChip(selectedUser.roleName).props.label}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold', mt: 1 }}>
                  Vai trò mới: {getRoleChip(newRole).props.label}
                </Typography>
              </Card>
              {newRole === 'CONSULTANT' && (
                <Alert severity="info" sx={{ mt: 2, borderRadius: '8px' }}>
                  <Typography variant="body2">
                    <strong>Lưu ý:</strong> Khi thay đổi thành "Tư vấn viên", hệ thống sẽ tự động gọi API setUserToConsultant để tạo lịch làm việc mặc định.
                  </Typography>
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={() => setRoleChangeModalOpen(false)} variant="outlined" color="secondary" disabled={actionLoading}>
            Hủy
          </Button>
          <Button onClick={handleConfirmRoleChange} variant="contained" color="primary" disabled={actionLoading}>
            {actionLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                <Typography variant="body2">Đang xử lý...</Typography>
              </Box>
            ) : 'Xác nhận thay đổi'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add User Modal */}
      <Dialog open={openAdd} onClose={handleCloseAdd} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm người dùng mới</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Tên đăng nhập" name="username" value={addData.username} onChange={handleAddChange} fullWidth />
            <TextField label="Mật khẩu" name="password" type="password" value={addData.password} onChange={handleAddChange} fullWidth />
            <TextField label="Họ tên" name="fullName" value={addData.fullName} onChange={handleAddChange} fullWidth />
            <TextField label="Email" name="email" value={addData.email} onChange={handleAddChange} fullWidth />
            <TextField label="Số điện thoại" name="phoneNumber" value={addData.phoneNumber} onChange={handleAddChange} fullWidth />
            <TextField label="Địa chỉ" name="address" value={addData.address} onChange={handleAddChange} fullWidth />
            <TextField label="Giới tính" name="gender" value={addData.gender} onChange={handleAddChange} fullWidth />
            <TextField label="Ngày sinh" name="dateOfBirth" value={addData.dateOfBirth} onChange={handleAddChange} fullWidth />
            <TextField label="Vai trò" name="roleName" value={addData.roleName} onChange={handleAddChange} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Hủy</Button>
          <Button onClick={handleAddSubmit} variant="contained">Thêm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
