import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  CircularProgress,
  Chip,
  InputBase,
  TextField,
  MenuItem,
  Button,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import Sidebar from '../../components/admin/AdminSidebar';
import Header from '../../components/admin/AdminHeader';
import BlogService from '../../services/BlogService';
import { toast } from 'react-toastify';

const AdminContentManagement = () => {
  // States
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Load blog posts from API
  const loadBlogPosts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const response = await BlogService.getAllBlogPosts(pageNumber, pageSize);

      console.log('API Response:', response); // Debug log

      if (response && response.content) {
        setBlogPosts(response.content || []);
        setTotalPages(response.totalPages || 1);
        toast.success('Đã tải dữ liệu thành công!');
      } else {
        toast.error('Không thể tải danh sách bài viết!');
      }
    } catch (error) {
      console.error('Error loading blog posts:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu!');

      // Fallback to sample data if API fails
      setBlogPosts([
        {
          postID: 1,
          title: "Hướng dẫn chăm sóc sức khỏe phụ nữ",
          author: { fullName: "Dr. Nguyễn Thị A" },
          category: { categoryName: "Sức khỏe phụ nữ" },
          isPublished: true,
          createdAt: "2024-01-15T10:30:00",
          viewCount: 1250
        },
        {
          postID: 2,
          title: "Tầm quan trọng của xét nghiệm định kỳ",
          author: { fullName: "Dr. Trần Văn B" },
          category: { categoryName: "Xét nghiệm" },
          isPublished: false,
          createdAt: "2024-01-14T14:20:00",
          viewCount: 890
        }
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await BlogService.getAllCategories();
      if (response && Array.isArray(response)) {
        setCategories(response);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Get category name by ID
  const getCategoryName = (categoryIds) => {
    if (!categoryIds || categoryIds.length === 0) return 'N/A';
    const category = categories.find(cat => cat.id === categoryIds[0]);
    return category ? category.name : `Category ${categoryIds[0]}`;
  };

  // Load data when component mounts or page changes
  useEffect(() => {
    loadCategories();
    loadBlogPosts(page);
  }, [page, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle page change
  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast.success('Đã làm mới dữ liệu!');
  };

  // Handle add new
  const handleAddNew = () => {
    toast.info('Tính năng thêm bài viết mới sẽ được phát triển!');
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Get status chip
  const getStatusChip = (isPublished) => {
    return (
      <Chip
        label={isPublished ? 'Đã xuất bản' : 'Nháp'}
        color={isPublished ? 'success' : 'default'}
        size="small"
      />
    );
  };

  // Filter blog posts based on search term and status
  const filteredBlogPosts = blogPosts.filter(post => {
    const matchSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       post.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       post.id?.toString().includes(searchTerm);

    let matchStatus = true;
    if (statusFilter === 'published') {
      matchStatus = post.isPublished === true;
    } else if (statusFilter === 'draft') {
      matchStatus = post.isPublished === false;
    }

    return matchSearch && matchStatus;
  });



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
              Quản lý nội dung
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Search box */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: 300,
                  bgcolor: 'white',
                  borderRadius: '999px',
                  px: 2,
                  py: '6px',
                  boxShadow: '0 0 0 1px #ccc',
                }}
              >
                <SearchIcon sx={{ color: 'gray', mr: 1 }} />
                <InputBase
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    flex: 1,
                    color: 'gray',
                    fontSize: 16,
                    '& .MuiInputBase-input': {
                      p: 0,
                    },
                    '&:focus-within': {
                      outline: 'none',
                    },
                  }}
                />
              </Box>

              {/* Dropdown status filter */}
              <Box
                sx={{
                  width: 200,
                  bgcolor: 'white',
                  borderRadius: '999px',
                  px: 2,
                  py: '6px',
                  boxShadow: '0 0 0 1px #ccc',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <TextField
                  select
                  variant="standard"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  fullWidth
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    flex: 1,
                    '& .MuiSelect-select': { py: 0 },
                    fontSize: 16,
                    color: 'gray',
                  }}
                  SelectProps={{
                    displayEmpty: true,
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          maxHeight: 200,
                          mt: 1,
                        }
                      },
                      disablePortal: true,
                      keepMounted: false
                    },
                    renderValue: (selected) => {
                      if (!selected) {
                        return "Tất cả";
                      }
                      switch (selected) {
                        case "published":
                          return "Đã xuất bản";
                        case "draft":
                          return "Bản nháp";
                        default:
                          return "";
                      }
                    }
                  }}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="published">Đã xuất bản</MenuItem>
                  <MenuItem value="draft">Bản nháp</MenuItem>
                </TextField>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Thêm bài viết mới">
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddNew}
                    sx={{
                      bgcolor: '#4CAF50',
                      color: 'white',
                      borderRadius: '20px',
                      px: 3,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                      '&:hover': {
                        bgcolor: '#45a049',
                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
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
                      borderColor: '#2196F3',
                      color: '#2196F3',
                      borderRadius: '20px',
                      px: 3,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#1976D2',
                        bgcolor: 'rgba(33, 150, 243, 0.04)',
                      }
                    }}
                  >
                    Làm mới
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 2, overflowY: 'auto' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#3B6774' }}>
                      <TableRow>
                        <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>ID</TableCell>
                        <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Tiêu đề</TableCell>
                        <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Tác giả</TableCell>
                        <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Danh mục</TableCell>
                        <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Trạng thái</TableCell>
                        <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Ngày tạo</TableCell>
                        <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Lượt xem</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredBlogPosts.length > 0 ? (
                        filteredBlogPosts.map((post) => (
                          <TableRow key={post.id} hover>
                            <TableCell>{post.id}</TableCell>
                            <TableCell sx={{ maxWidth: 200 }}>
                              <Typography variant="body2" noWrap>
                                {post.title}
                              </Typography>
                            </TableCell>
                            <TableCell>{post.authorName || 'N/A'}</TableCell>
                            <TableCell>{getCategoryName(post.categoryIds)}</TableCell>
                            <TableCell>{getStatusChip(post.isPublished || false)}</TableCell>
                            <TableCell>{formatDate(post.createdAt)}</TableCell>
                            <TableCell>{post.viewCount || 0}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body1" color="text.secondary">
                              {searchTerm || statusFilter ? 'Không tìm thấy bài viết nào phù hợp' : 'Chưa có bài viết nào'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminContentManagement;