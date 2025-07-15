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
  Snackbar
} from '@mui/material';
import { Edit, Delete, Visibility, Add, Save, Cancel } from '@mui/icons-material';
import { getAllTestingServicesAPI } from '../../services/UsersSevices';

const TestingTable = ({ searchTerm }) => {
  const [allTestingServices, setAllTestingServices] = useState([]);
  const [filteredTestingServices, setFilteredTestingServices] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllTestingServicesAPI(1, 100); // Get more items for better search
        const items = res.data || [];
        setAllTestingServices(items);
        setFilteredTestingServices(items);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu dịch vụ:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allTestingServices.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTestingServices(filtered);
    } else {
      setFilteredTestingServices(allTestingServices);
    }
    setPage(1); // Reset to first page when search changes
  }, [searchTerm, allTestingServices]);

  // Format currency to Vietnamese Dong
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Get category color for chips
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

  const handleEdit = (id) => {
    console.log('Chỉnh sửa dịch vụ ID:', id);
    // TODO: Implement edit functionality
  };

  const handleDelete = (id) => {
    console.log('Xóa dịch vụ ID:', id);
    // TODO: Implement delete functionality
  };

  const handleView = (id) => {
    console.log('Xem chi tiết dịch vụ ID:', id);
    // TODO: Implement view details functionality
  };

  const paginatedData = filteredTestingServices.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredTestingServices.length / pageSize);

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
            {paginatedData.map((service, index) => (
              <TableRow 
                key={service.id} 
                hover
                sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                <TableCell>
                  <Chip 
                    label={service.code} 
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
                  <Tooltip title={service.description} arrow placement="top">
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        cursor: 'help',
                        '&:hover': { color: 'primary.main' }
                      }}
                    >
                      {service.name}
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
                    label={service.category} 
                    size="small"
                    sx={{ 
                      backgroundColor: getCategoryColor(service.category),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title={service.preparationRequired} arrow placement="top">
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
                      {service.preparationRequired}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={service.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    size="small"
                    color={service.status === 'active' ? 'success' : 'error'}
                    variant="filled"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Xem chi tiết">
                      <IconButton 
                        size="small" 
                        onClick={() => handleView(service.id)}
                        sx={{ color: 'info.main' }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton 
                        size="small" 
                        onClick={() => handleEdit(service.id)}
                        sx={{ color: 'warning.main' }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(service.id)}
                        sx={{ color: 'error.main' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, newPage) => setPage(newPage)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Hiển thị {paginatedData.length} trong tổng số {filteredTestingServices.length} dịch vụ
        </Typography>
      </Box>
    </Box>
  );
};

export default TestingTable;
