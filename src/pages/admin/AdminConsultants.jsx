/**
 * ===== COMPONENT: AdminConsultants =====
 * 
 * Mô tả: Component quản lý danh sách tư vấn viên trong admin panel
 * 
 * Chức năng chính:
 * - Hiển thị danh sách tư vấn viên dưới dạng bảng với phân trang
 * - Tìm kiếm tư vấn viên theo tên, email, chuyên môn, username
 * - Thêm mới tư vấn viên thông qua modal
 * - Xem chi tiết thông tin tư vấn viên
 * - Chỉnh sửa thông tin tư vấn viên
 * - Xóa tư vấn viên với xác nhận
 * - Tạo lịch tự động cho tư vấn viên cụ thể hoặc tạo lịch chung
 * - Refresh dữ liệu
 * 
 * State management:
 * - Quản lý danh sách tư vấn viên và trạng thái loading/error
 * - Quản lý trạng thái các modal (view, edit, delete, add)
 * - Quản lý phân trang và tìm kiếm
 * - Quản lý form data cho chỉnh sửa
 * 
 * API calls:
 * - getAllConsultantsAPI: Lấy danh sách tất cả tư vấn viên
 * - updateConsultantAPI: Cập nhật thông tin tư vấn viên
 * - deleteConsultantAPI: Xóa tư vấn viên
 * - autoCreateConsultantSlotsAPI: Tạo lịch tự động cho tư vấn viên
 * - autoCreateCommonSlotsAPI: Tạo lịch chung tự động
 */

// Import các thư viện React cần thiết
import React, { useEffect, useState } from 'react';

// Import các icon từ Material-UI
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

// Import các component layout chính
import Sidebar from '../../components/admin/AdminSidebar';
import Header from '../../components/admin/AdminHeader';

// Import các component UI từ Material-UI
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

// Import hook để xử lý navigation
import { useLocation } from 'react-router-dom';

// Import thư viện thông báo toast
import { toast } from 'react-toastify';

// Import các icon cho các thao tác CRUD
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

// Import các API service để gọi backend
import {
  getAllConsultantsAPI,        // API lấy danh sách tất cả tư vấn viên
  createConsultantAPI,         // API tạo tư vấn viên mới
  updateConsultantAPI,         // API cập nhật thông tin tư vấn viên
  deleteConsultantAPI,         // API xóa tư vấn viên
  autoCreateConsultantSlotsAPI, // API tạo lịch tự động cho tư vấn viên
  autoCreateCommonSlotsAPI     // API tạo lịch chung tự động
} from '../../services/AdminService';

// Import component modal để thêm tư vấn viên mới
import AddConsultantModal from '../../components/admin/AddConsultantModal';

// Component chính quản lý tư vấn viên
export default function AdminConsultants() {
  // Hook để lấy thông tin location từ router (dùng để hiển thị toast message)
  const location = useLocation();
  
  // ===== STATE VARIABLES =====
  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
  
  // State cho dữ liệu tư vấn viên
  const [consultants, setConsultants] = useState([]); // Tất cả tư vấn viên từ API
  const [filteredConsultants, setFilteredConsultants] = useState([]); // Danh sách sau khi lọc/tìm kiếm
  
  // State cho phân trang
  const [page, setPage] = useState(1); // Trang hiện tại
  const pageSize = 10; // Số item trên mỗi trang
  
  // State cho loading và error
  const [loading, setLoading] = useState(true); // Trạng thái loading khi fetch data
  const [error, setError] = useState(null); // Lưu thông báo lỗi nếu có
  const [refreshKey, setRefreshKey] = useState(0); // Key để trigger refresh data
  
  // ===== MODAL STATES =====
  const [viewModalOpen, setViewModalOpen] = useState(false); // Modal xem chi tiết
  const [editModalOpen, setEditModalOpen] = useState(false); // Modal chỉnh sửa
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Modal xác nhận xóa
  const [selectedConsultant, setSelectedConsultant] = useState(null); // Tư vấn viên được chọn
  const [editForm, setEditForm] = useState({}); // Form data cho chỉnh sửa
  const [actionLoading, setActionLoading] = useState(false); // Loading cho các action (edit, delete)
  const [showAddModal, setShowAddModal] = useState(false); // Modal thêm tư vấn viên mới
  const [selectedConsultantId, setSelectedConsultantId] = useState(null); // ID tư vấn viên cho tạo lịch tự động

  // ===== USEEFFECT HOOKS =====
  // Effect để hiển thị toast message khi navigate đến trang này
  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      // Xóa state để tránh hiển thị lại khi refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Effect để fetch dữ liệu tư vấn viên khi component mount hoặc khi refreshKey thay đổi
  useEffect(() => {
    fetchConsultants();
  }, [refreshKey]);

  // ===== API FUNCTIONS =====
  // Hàm fetch danh sách tư vấn viên từ API
  const fetchConsultants = async () => {
    try {
      setLoading(true); // Bật loading
      const response = await getAllConsultantsAPI();
      console.log('Consultants response:', response);
      
      // Xử lý response data (có thể là array trực tiếp hoặc trong response.data)
      const consultantsData = Array.isArray(response) ? response : (response.data || []);
      setConsultants(consultantsData); // Set data gốc
      setFilteredConsultants(consultantsData); // Set data cho hiển thị
      setError(null); // Clear error nếu thành công
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu tư vấn viên:', err);
      setError('Không thể tải dữ liệu tư vấn viên. Vui lòng thử lại sau.');
    } finally {
      setLoading(false); // Tắt loading
    }
  };

  // Effect để lọc danh sách tư vấn viên dựa trên từ khóa tìm kiếm
  useEffect(() => {
    const filtered = consultants.filter(consultant => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return (
        // Tìm kiếm theo họ tên
        consultant.fullName?.toLowerCase().includes(lowerCaseSearchTerm) ||
        // Tìm kiếm theo email
        consultant.email?.toLowerCase().includes(lowerCaseSearchTerm) ||
        // Tìm kiếm theo chuyên môn
        consultant.specialization?.toLowerCase().includes(lowerCaseSearchTerm) ||
        // Tìm kiếm theo username
        consultant.username?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });
    setFilteredConsultants(filtered);
  }, [searchTerm, consultants]);

  // ===== EVENT HANDLERS =====
  // Hàm xử lý refresh dữ liệu
  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1); // Tăng refreshKey để trigger useEffect
    toast.success("Đã làm mới dữ liệu!");
  };

  // Hàm mở modal thêm tư vấn viên mới
  const handleAddNew = () => {
    setShowAddModal(true);
  };

  // ===== VIEW, EDIT, DELETE HANDLERS =====
  // Hàm xử lý xem chi tiết tư vấn viên
  const handleView = (consultant) => {
    setSelectedConsultant(consultant); // Set tư vấn viên được chọn
    setViewModalOpen(true); // Mở modal xem chi tiết
  };

  // Hàm xử lý chỉnh sửa tư vấn viên
  const handleEdit = (consultant) => {
  // Hàm xử lý chỉnh sửa tư vấn viên
  const handleEdit = (consultant) => {
    setSelectedConsultant(consultant); // Set tư vấn viên được chọn
    // Khởi tạo form với dữ liệu hiện tại của tư vấn viên
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
    setEditModalOpen(true); // Mở modal chỉnh sửa
  };

  // Hàm xử lý xóa tư vấn viên
  const handleDelete = (consultant) => {
    setSelectedConsultant(consultant); // Set tư vấn viên được chọn
    setDeleteModalOpen(true); // Mở modal xác nhận xóa
  };

  // ===== SAVE AND DELETE HANDLERS =====
  // Hàm lưu thay đổi sau khi chỉnh sửa
  const handleSaveEdit = async () => {
    try {
      setActionLoading(true); // Bật loading cho action
      
      // Chuẩn bị dữ liệu để gửi API
      const updateData = {
        id: selectedConsultant.id,
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
      
      // Gọi API cập nhật
      const response = await updateConsultantAPI(selectedConsultant.id, updateData);
      
      setEditModalOpen(false); // Đóng modal
      toast.success('Cập nhật tư vấn viên thành công!');
      
      // Reload lại dữ liệu để hiển thị thông tin mới
      fetchConsultants();
    } catch (error) {
      toast.error('Lỗi khi cập nhật tư vấn viên: ' + (error.response?.data || error.message));
    } finally {
      setActionLoading(false); // Tắt loading
    }
  };

  // Hàm xác nhận xóa tư vấn viên
  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true); // Bật loading
      
      // Gọi API xóa tư vấn viên
      const response = await deleteConsultantAPI(selectedConsultant.id);
      
      setDeleteModalOpen(false); // Đóng modal
      toast.success('Xóa tư vấn viên thành công!');
      
      // Reload lại dữ liệu
      fetchConsultants();
    } catch (error) {
      toast.error('Lỗi khi xóa tư vấn viên: ' + (error.response?.data || error.message));
    } finally {
      setActionLoading(false); // Tắt loading
    }
  };

  // ===== AUTO CREATE SLOTS HANDLERS =====
  // Hàm tạo lịch tự động cho một tư vấn viên cụ thể
  const handleAutoCreateSlots = async () => {
    // Kiểm tra xem đã chọn tư vấn viên chưa
    if (!selectedConsultantId) {
      toast.error('Vui lòng chọn tư vấn viên để tạo lịch!');
      return;
    }
    try {
      // Gọi API tạo lịch tự động với các tham số mặc định
      await autoCreateConsultantSlotsAPI(selectedConsultantId, {
        slotType: 'CONSULTATION',      // Loại lịch: tư vấn
        capacity: 5,                   // Sức chứa: 5 người
        description: 'Lịch tự động 7 ngày', // Mô tả
        duration: 120,                 // Thời lượng: 120 phút
        days: 7                        // Tạo lịch cho 7 ngày
      });
      toast.success('Đã tạo lịch tự động 7 ngày cho tư vấn viên!');
    } catch (err) {
      toast.error('Tạo lịch tự động thất bại!');
    }
  };

  // Hàm tạo lịch chung tự động cho toàn hệ thống
  const handleAutoCreateCommonSlots = async () => {
    try {
      // Gọi API tạo lịch chung với các tham số mặc định
      await autoCreateCommonSlotsAPI({
        slotType: 'CONSULTATION',          // Loại lịch: tư vấn
        capacity: 5,                       // Sức chứa: 5 người
        description: 'Lịch chung tự động 7 ngày', // Mô tả
        duration: 120,                     // Thời lượng: 120 phút
        days: 7                            // Tạo lịch cho 7 ngày
      });
      toast.success('Đã tạo lịch chung tự động 7 ngày cho hệ thống!');
    } catch (err) {
      toast.error('Tạo lịch chung tự động thất bại!');
    }
  };

  // ===== UTILITY FUNCTIONS =====
  // Hàm format ngày tháng hiển thị
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN'); // Format theo chuẩn Việt Nam
  };

  // Hàm chuyển đổi gender code thành text hiển thị
  const getGenderText = (gender) => {
    switch (gender) {
      case 'MALE': return 'Nam';
      case 'FEMALE': return 'Nữ';
      case 'OTHER': return 'Khác';
      default: return 'Chưa cập nhật';
    }
  };

  // Hàm tạo status chip dựa trên logic kinh nghiệm
  const getStatusChip = (consultant) => {
    // Logic đơn giản: có kinh nghiệm > 0 thì hoạt động
    const isActive = consultant.experienceYears > 0;
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

  // ===== PAGINATION LOGIC =====
  // Tính toán dữ liệu cho trang hiện tại
  const paginatedConsultants = filteredConsultants.slice(
    (page - 1) * pageSize,  // Vị trí bắt đầu
    page * pageSize         // Vị trí kết thúc
  );

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredConsultants.length / pageSize);

  // ===== RENDER UI =====
  return (
    // Layout chính với Sidebar và Content
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar navigation */}
      <Sidebar />
      
      {/* Main content area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header cố định */}
        <Box sx={{ flexShrink: 0, minHeight: 64 }}>
          <Header />
        </Box>

        {/* Content area có thể scroll */}
        <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 2, overflowY: 'auto' }}>
          {/* Title và Search/Action buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 2, mt: 2 }}>
            {/* Page title */}
            <Typography variant='h3' sx={{ fontWeight: 500, color: 'gray' }}>
              Quản lý tư vấn viên
            </Typography>

            {/* Search box và Action buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Search input */}
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
                {/* Button tạo lịch chung */}
                <Tooltip title="Tạo lịch chung 7 ngày tự động">
                  <IconButton
                    size="large"
                    onClick={handleAutoCreateCommonSlots}
                    sx={{
                      color: '#fff',
                      bgcolor: '#43a047',
                      borderRadius: '8px',
                      p: 1.2,
                      '&:hover': { bgcolor: '#2e7031' }
                    }}
                  >
                    <EventAvailableIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
                
                {/* Button tạo lịch cho tư vấn viên */}
                <Tooltip title="Tạo lịch 7 ngày tự động cho tư vấn viên">
                  <IconButton
                    size="large"
                    onClick={handleAutoCreateSlots}
                    sx={{
                      color: '#fff',
                      bgcolor: '#1976d2',
                      borderRadius: '8px',
                      p: 1.2,
                      '&:hover': { bgcolor: '#1565c0' }
                    }}
                  >
                    <EventAvailableIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
                
                {/* Button thêm mới */}
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
                
                {/* Button refresh */}
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

          {/* Dropdown chọn tư vấn viên để tạo lịch */}
          <Box sx={{ mb: 2, width: 260 }}>
            <TextField
              select
              label="Chọn tư vấn viên để tạo lịch tự động"
              value={selectedConsultantId || ''}
              onChange={e => setSelectedConsultantId(e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">-- Chọn tư vấn viên --</MenuItem>
              {consultants.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.fullName || c.email}</MenuItem>
              ))}
            </TextField>
          </Box>

          {/* ===== TABLE AREA ===== */}
          <Box sx={{ bgcolor: '#f5f5f5', p: 2 }}>
            {/* Hiển thị thông báo lỗi nếu có */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {/* Hiển thị loading hoặc bảng dữ liệu */}
            {loading ? (
              // Loading state
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Đang tải dữ liệu...</Typography>
              </Box>
            ) : (
              // Data table
              <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                  {/* Table header */}
                  <TableHead sx={{ backgroundColor: '#3B6774' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }}>STT</TableCell>
                      <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }}>Họ tên</TableCell>
                      <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }}>Số điện thoại</TableCell>
                      <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }} align="center">Chuyên môn</TableCell>
                      <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }}>Kinh nghiệm</TableCell>
                      <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }} align="center">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  {/* Table body */}
                  <TableBody>
                    {/* Hiển thị thông báo nếu không có dữ liệu */}
                    {paginatedConsultants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            Không có dữ liệu tư vấn viên nào
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      // Render từng row tư vấn viên
                      paginatedConsultants.map((consultant, index) => (
                        <TableRow key={consultant.id} hover>
                          {/* Cột STT */}
                          <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                          {/* Cột Họ tên với Avatar */}
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
                          {/* Cột Email */}
                          <TableCell>{consultant.email || 'Chưa cập nhật'}</TableCell>
                          {/* Cột Số điện thoại */}
                          <TableCell>{consultant.phoneNumber || 'Chưa cập nhật'}</TableCell>
                          {/* Cột Chuyên môn với Chip */}
                          <TableCell align="center">
                            <Chip 
                              label={consultant.specialization || 'Chưa cập nhật'} 
                              size="small"
                              sx={{ 
                                backgroundColor: '#E3F2FD',
                                color: '#1976D2',
                                fontWeight: 'bold',
                                justifyContent: 'center'
                              }}
                            />
                          </TableCell>
                          {/* Cột Kinh nghiệm */}
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              {consultant.experienceYears || 0} năm
                            </Typography>
                          </TableCell>
                          {/* Cột Action buttons */}
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                              {/* Button tạo lịch tự động */}
                              <Tooltip title="Tạo lịch 7 ngày tự động">
                                <IconButton size="small" onClick={() => handleAutoCreateSlots(consultant.id)} sx={{ color: 'success.main' }}>
                                  <EventAvailableIcon fontSize="medium" />
                                </IconButton>
                              </Tooltip>
                              {/* Button xem chi tiết */}
                              <Tooltip title="Xem chi tiết">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleView(consultant)}
                                  sx={{ color: 'info.main' }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {/* Button chỉnh sửa */}
                              <Tooltip title="Chỉnh sửa">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEdit(consultant)}
                                  sx={{ color: 'warning.main' }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {/* Button xóa */}
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

            {/* ===== PAGINATION ===== */}
            {filteredConsultants.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, px: 2 }}>
                {/* Thông tin hiển thị số lượng record */}
                <Typography variant="body2" color="text.secondary">
                  Hiển thị {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, filteredConsultants.length)} trong tổng số {filteredConsultants.length} tư vấn viên
                </Typography>
                
                {/* Navigation buttons */}
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

      {/* ===== MODAL DIALOGS ===== */}
      {/* Modal xem chi tiết tư vấn viên */}
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

      {/* Modal chỉnh sửa tư vấn viên */}
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

      {/* Modal xác nhận xóa tư vấn viên */}
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

      {/* Modal thêm tư vấn viên mới */}
      <AddConsultantModal open={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={fetchConsultants} />
    </Box>
  );
}
