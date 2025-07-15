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
  Chip
} from '@mui/material';
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
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle page change
  const handlePageChange = (_, newPage) => {
    setPage(newPage);
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



  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexShrink: 0, minHeight: 64 }}>
          <Header />
        </Box>

        <Box sx={{
          flexGrow: 1,
          background: 'linear-gradient(135deg, #B3CCD4 0%, #E8F1F5 50%, #F0F8FF 100%)',
          p: 3,
          overflowY: 'auto',
          position: 'relative',
          minHeight: 'calc(100vh - 72px)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 20%, rgba(179, 204, 212, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(179, 204, 212, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(179, 204, 212, 0.1) 0%, transparent 50%)
            `,
            pointerEvents: 'none',
            zIndex: 0,
          }
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant='h3' sx={{
              fontWeight: 800,
              color: '#354766',
              fontSize: '2.2rem',
              textShadow: '0 1px 2px rgba(179, 204, 212, 0.3)',
              mb: 3
            }}>
              Quản lý nội dung
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} sx={{ mb: 3, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Tiêu đề</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Tác giả</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Danh mục</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Lượt xem</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {blogPosts.map((post) => (
                        <TableRow key={post.id} hover>
                          <TableCell>{post.id}</TableCell>
                          <TableCell sx={{ maxWidth: 200 }}>
                            <Typography variant="body2" noWrap>
                              {post.title}
                            </Typography>
                          </TableCell>
                          <TableCell>{post.authorName || 'N/A'}</TableCell>
                          <TableCell>{getCategoryName(post.categoryIds)}</TableCell>
                          <TableCell>{getStatusChip(true)}</TableCell>
                          <TableCell>{formatDate(post.createdAt)}</TableCell>
                          <TableCell>0</TableCell>
                        </TableRow>
                      ))}
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