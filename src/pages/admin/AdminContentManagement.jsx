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
  Tooltip,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Autocomplete,
  Checkbox,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  // Tabs,
  // Tab
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
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
  const [tab, setTab] = useState('blog');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryEditMode, setCategoryEditMode] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ categoryName: '', description: '', slug: '', thumbnailUrl: '' });
  const [categoryError, setCategoryError] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [categorySearch, setCategorySearch] = useState('');

  // State cho modal blog
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [blogEditMode, setBlogEditMode] = useState(false);
  const [blogForm, setBlogForm] = useState({ 
    title: '', 
    content: '', 
    summary: '',
    tags: '',
    categoryIds: [],
    isPublished: false
  });
  const [blogError, setBlogError] = useState({});
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [deleteBlogId, setDeleteBlogId] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

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
        setBlogPosts([]);
        setTotalPages(1);
        toast.info('Chưa có bài viết nào trong hệ thống');
      }
    } catch (error) {
      console.error('Error loading blog posts:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu: ' + error.message);
      setBlogPosts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await BlogService.getAllCategories();
      console.log('Categories API Response:', response); // Debug log

      if (response && Array.isArray(response)) {
        console.log('Categories loaded successfully:', response);
        console.log('First category structure:', response[0]);
        setCategories(response);
        toast.success('Đã tải danh mục thành công!');
      } else {
        setCategories([]);
        toast.info('Chưa có danh mục nào trong hệ thống');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Lỗi khi tải danh mục: ' + (error.message || 'Không xác định'));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Get category name by ID
  const getCategoryName = (categoryIds) => {
    if (!categoryIds || categoryIds.length === 0) return 'N/A';
    const category = categories.find(cat => cat.id === categoryIds[0]);
    return category ? category.name : `Category ${categoryIds[0]}`;
  };

  // Thay thế hàm getCategoryName bằng getCategoryNames
  const getCategoryNames = (categoryIds) => {
    if (!categoryIds || categoryIds.length === 0) return 'N/A';
    return categoryIds
      .map(id => {
        const cat = categories.find(c => c.categoryID === id);
        return cat ? cat.categoryName : `Category ${id}`;
      })
      .join(', ');
  };

  // Load data when component mounts or page changes
  useEffect(() => {
    if (tab === 'blog') {
      loadBlogPosts(page);
    } else if (tab === 'category') {
      loadCategories();
    }
  }, [page, refreshKey, tab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load categories for blog form
  useEffect(() => {
    loadCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle page change
  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  // Handle refresh
  const handleRefresh = () => {
    if (tab === 'blog') {
      loadBlogPosts(page);
    } else if (tab === 'category') {
      loadCategories();
    }
    toast.success('Đã làm mới dữ liệu!');
  };

  // Handle add new
  const handleAddNew = () => {
    toast.info('Tính năng thêm bài viết mới sẽ được phát triển!');
  };

  // const handleTabChange = (event, newValue) => setTab(newValue); // Xóa

  const openAddCategory = () => {
    setCategoryEditMode(false);
    setCategoryForm({ categoryName: '', description: '', slug: '', thumbnailUrl: '' });
    setCategoryError({});
    setCategoryModalOpen(true);
  };
  const openEditCategory = (cat) => {
    setCategoryEditMode(true);
    setCategoryForm({
      categoryName: cat.categoryName || '',
      description: cat.description || '',
      slug: cat.slug || '',
      thumbnailUrl: cat.thumbnailUrl || ''
    });
    setSelectedCategory(cat);
    setCategoryError({});
    setCategoryModalOpen(true);
  };
  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
    setSelectedCategory(null);
  };
  const handleCategoryFormChange = (e) => {
    setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
  };
  const validateCategory = () => {
    const err = {};
    if (!categoryForm.categoryName || !categoryForm.categoryName.trim()) err.categoryName = 'Tên danh mục không được để trống';
    if (categoryForm.categoryName && categoryForm.categoryName.length > 100) err.categoryName = 'Tên danh mục tối đa 100 ký tự';
    if (categoryForm.description && categoryForm.description.length > 500) err.description = 'Mô tả tối đa 500 ký tự';
    if (categoryForm.slug && categoryForm.slug.length > 100) err.slug = 'Slug tối đa 100 ký tự';
    if (categoryForm.thumbnailUrl && categoryForm.thumbnailUrl.length > 500) err.thumbnailUrl = 'URL thumbnail tối đa 500 ký tự';

    // Kiểm tra trùng tên (FE)
    if (categoryForm.categoryName && categoryForm.categoryName.trim()) {
      const lower = categoryForm.categoryName.trim().toLowerCase();
      const duplicate = categories.some(cat =>
        cat.categoryName &&
        cat.categoryName.trim().toLowerCase() === lower &&
        (!categoryEditMode || cat.categoryID !== selectedCategory?.categoryID)
      );
      if (duplicate) err.categoryName = 'Tên danh mục đã tồn tại';
    }
    setCategoryError(err);
    return Object.keys(err).length === 0;
  };
  const handleCategorySubmit = async () => {
    console.log('handleCategorySubmit called');
    console.log('categoryEditMode:', categoryEditMode);
    console.log('selectedCategory:', selectedCategory);
    console.log('categoryForm:', categoryForm);
    
    if (!validateCategory()) {
      console.log('Validation failed');
      return;
    }
    
    try {
      if (categoryEditMode && selectedCategory) {
        console.log('Updating category with ID:', selectedCategory.categoryID);
        await BlogService.updateCategory(selectedCategory.categoryID, categoryForm);
        toast.success('Cập nhật danh mục thành công!');
      } else {
        console.log('Creating new category');
        await BlogService.createCategory(categoryForm);
        toast.success('Thêm danh mục thành công!');
      }
      closeCategoryModal();
      loadCategories();
    } catch (err) {
      console.error('Category submit error:', err);
      let errorMsg = 'Lỗi khi lưu danh mục!';

      if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.response?.data) {
        errorMsg = err.response.data;
      } else if (err?.message) {
        errorMsg = err.message;
      }

      toast.error(errorMsg);
    }
  };
  const handleDeleteCategory = async () => {
    if (!deleteCategoryId) return;
    try {
      await BlogService.deleteCategory(deleteCategoryId);
      toast.success('Xóa danh mục thành công!');
      setDeleteCategoryId(null);
      loadCategories();
    } catch (err) {
      console.error('Delete category error:', err);
      let errorMsg = 'Không thể xóa danh mục!';

      if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.response?.data) {
        errorMsg = err.response.data;
      }

      toast.error(errorMsg);
    }
  };
  const filteredCategories = categories.filter(cat => (cat.categoryName || '').toLowerCase().includes(categorySearch.toLowerCase()));

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
                       (post.author?.name || post.author?.fullName)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       post.id?.toString().includes(searchTerm);

    let matchStatus = true;
    if (statusFilter === 'published') {
      matchStatus = (post.featured || post.isPublished) === true;
    } else if (statusFilter === 'draft') {
      matchStatus = (post.featured || post.isPublished) === false;
    }

    return matchSearch && matchStatus;
  });

  const openAddBlog = () => {
    setBlogEditMode(false);
    setBlogForm({
      title: '',
      content: '',
      summary: '',
      tags: '',
      categoryIds: [],
      isPublished: false
    });
    setBlogError({});
    setCoverImage(null);
    setBlogModalOpen(true);

    // Load categories nếu chưa có
    if (!categories || categories.length === 0) {
      console.log('Loading categories for blog modal...');
      loadCategories();
    }

    // Debug: Kiểm tra categories
    console.log('Categories when opening blog modal:', categories);
    console.log('Categories length:', categories.length);
  };
  const openEditBlog = (post) => {
    setBlogEditMode(true);
    setBlogForm({
      title: post.title || '',
      content: post.content || '',
      summary: post.summary || '',
      tags: post.tags || '',
      categoryIds: post.categories ? post.categories.map(cat => Number(cat.categoryID || cat.id)) : [],
      isPublished: post.isPublished || false
    });
    setSelectedBlog(post);
    setBlogError({});
    setCoverImage(null);
    setBlogModalOpen(true);

    // Load categories nếu chưa có
    if (!categories || categories.length === 0) {
      console.log('Loading categories for edit blog modal...');
      loadCategories();
    }
  };
  const closeBlogModal = () => {
    setBlogModalOpen(false);
    setSelectedBlog(null);
  };
  const handleBlogFormChange = (e) => {
    setBlogForm({ ...blogForm, [e.target.name]: e.target.value });
  };
  const handleBlogCategoryChange = (e) => {
    setBlogForm({ ...blogForm, categoryIds: e.target.value });
  };

  // Handle category card selection
  const handleCategoryCardClick = (categoryId) => {
    console.log('=== Category Click Debug ===');
    console.log('Clicked categoryId:', categoryId, typeof categoryId);
    console.log('Current blogForm.categoryIds:', blogForm.categoryIds);

    // Ensure categoryId is a number for consistent comparison
    const numericCategoryId = Number(categoryId);
    const currentIds = (blogForm.categoryIds || []).map(Number);

    console.log('Numeric categoryId:', numericCategoryId);
    console.log('Current numeric IDs:', currentIds);
    console.log('Includes check:', currentIds.includes(numericCategoryId));

    let newIds;

    if (currentIds.includes(numericCategoryId)) {
      // Unselect category
      newIds = currentIds.filter(id => id !== numericCategoryId);
      console.log('Unselecting, new IDs:', newIds);
    } else {
      // Select category
      newIds = [...currentIds, numericCategoryId];
      console.log('Selecting, new IDs:', newIds);
    }

    setBlogForm({ ...blogForm, categoryIds: newIds });
    console.log('Updated blogForm will have categoryIds:', newIds);

    // Clear error if at least one category is selected
    if (newIds.length > 0 && blogError.categoryIds) {
      setBlogError({ ...blogError, categoryIds: null });
    }
  };
  const validateBlog = () => {
    const err = {};
    if (!blogForm.title || !blogForm.title.trim()) err.title = 'Tiêu đề không được để trống';
    if (blogForm.title && blogForm.title.length > 200) err.title = 'Tiêu đề tối đa 200 ký tự';
    if (!blogForm.content || !blogForm.content.trim()) err.content = 'Nội dung không được để trống';
    if (blogForm.summary && blogForm.summary.length > 500) err.summary = 'Tóm tắt tối đa 500 ký tự';
    if (!blogForm.categoryIds || blogForm.categoryIds.length === 0) err.categoryIds = 'Chọn ít nhất 1 danh mục';
    setBlogError(err);
    return Object.keys(err).length === 0;
  };

  const handleBlogSubmit = async () => {
    if (!validateBlog()) return;
    
    try {
      const formData = new FormData();
      
      // Tạo payload cho blog post
      const blogPayload = {
        title: blogForm.title.trim(),
        content: blogForm.content.trim(),
        summary: blogForm.summary.trim(),
        tags: blogForm.tags.trim(),
        categoryIds: (blogForm.categoryIds || []).map(Number),
        isPublished: blogForm.isPublished
      };
      
      // Thêm blog data vào FormData
      formData.append('blogPost', new Blob([JSON.stringify(blogPayload)], {
        type: 'application/json'
      }));
      
      // Thêm cover image nếu có
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }
      
      if (blogEditMode && selectedBlog) {
        await BlogService.updateBlogPost(selectedBlog.id, formData);
        toast.success('Cập nhật bài viết thành công!');
      } else {
        await BlogService.createBlogPost(formData);
        toast.success('Thêm bài viết thành công!');
      }
      closeBlogModal();
      loadBlogPosts(page);
    } catch (err) {
      console.error('Blog submit error:', err);
      const errorMsg = err?.response?.data?.message || 'Lỗi khi lưu bài viết!';
      toast.error(errorMsg);
    }
  };
  const handleDeleteBlog = async () => {
    if (!deleteBlogId) return;
    try {
      await BlogService.deleteBlogPost(deleteBlogId);
      toast.success('Xóa bài viết thành công!');
      setDeleteBlogId(null);
      loadBlogPosts(page);
    } catch (err) {
      toast.error('Không thể xóa bài viết!');
    }
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
              Quản lý nội dung
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant={tab === 'blog' ? 'contained' : 'outlined'}
                onClick={() => setTab('blog')}
                sx={{
                  borderRadius: '999px',
                  px: 5,
                  py: 1.2,
                  fontWeight: 700,
                  fontSize: 18,
                  bgcolor: tab === 'blog' ? '#1976d2' : 'white',
                  color: tab === 'blog' ? 'white' : '#1976d2',
                  boxShadow: tab === 'blog' ? '0 2px 8px rgba(25, 118, 210, 0.12)' : 'none',
                  border: tab === 'blog' ? 'none' : '2px solid #1976d2',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: tab === 'blog' ? '#1565c0' : '#e3f2fd',
                    color: tab === 'blog' ? 'white' : '#1976d2',
                    boxShadow: '0 4px 16px rgba(25, 118, 210, 0.18)'
                  }
                }}
              >
                BLOG
              </Button>
              <Button
                variant={tab === 'category' ? 'contained' : 'outlined'}
                onClick={() => setTab('category')}
                sx={{
                  borderRadius: '999px',
                  px: 5,
                  py: 1.2,
                  fontWeight: 700,
                  fontSize: 18,
                  bgcolor: tab === 'category' ? '#43a047' : 'white',
                  color: tab === 'category' ? 'white' : '#43a047',
                  boxShadow: tab === 'category' ? '0 2px 8px rgba(67, 160, 71, 0.12)' : 'none',
                  border: tab === 'category' ? 'none' : '2px solid #43a047',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: tab === 'category' ? '#388e3c' : '#e8f5e9',
                    color: tab === 'category' ? 'white' : '#43a047',
                    boxShadow: '0 4px 16px rgba(67, 160, 71, 0.18)'
                  }
                }}
              >
                CATEGORY
              </Button>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 2, overflowY: 'auto' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {tab === 'blog' && (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 2, mt: 2 }}>
                      <Typography variant='h3' sx={{ fontWeight: 500, color: 'gray' }}>
                        Quản lý bài viết
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
                              onClick={openAddBlog}
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
                            <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Thao tác</TableCell>
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
                                 <TableCell>{post.author?.name || post.author?.fullName || 'N/A'}</TableCell>
                                 <TableCell>
                                   {post.categories && post.categories.length > 0 
                                     ? post.categories.map(cat => cat.name || cat.categoryName).join(', ')
                                     : 'N/A'
                                   }
                                 </TableCell>
                                 <TableCell>{getStatusChip(post.featured || post.isPublished || false)}</TableCell>
                                 <TableCell>{formatDate(post.createdAt)}</TableCell>
                                 <TableCell>{post.views || 0}</TableCell>
                                 <TableCell>
                                   <Button size="small" color="primary" onClick={() => openEditBlog(post)} startIcon={<EditIcon />}>Sửa</Button>
                                   <Button size="small" color="error" onClick={() => setDeleteBlogId(post.id)} startIcon={<DeleteIcon />}>Xóa</Button>
                                 </TableCell>
                               </TableRow>
                             ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
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
                {tab === 'category' && (
                  <Box sx={{ bgcolor: '#f5f5f5', p: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>Quản lý danh mục bài viết</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                      <InputBase
                        placeholder="Tìm kiếm danh mục..."
                        value={categorySearch}
                        onChange={e => setCategorySearch(e.target.value)}
                        sx={{ bgcolor: 'white', borderRadius: 2, px: 2, py: 1, boxShadow: '0 0 0 1px #ccc', width: 300 }}
                      />
                      <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleRefresh}
                        sx={{ borderRadius: 2, px: 3, py: 1, fontWeight: 600 }}
                      >
                        Làm mới
                      </Button>
                      <Button variant="contained" startIcon={<AddIcon />} onClick={openAddCategory} sx={{ bgcolor: '#4CAF50', color: 'white', borderRadius: 2, px: 3, py: 1, fontWeight: 600 }}>
                        Thêm mới
                      </Button>
                    </Box>
                    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <Table>
                        <TableHead sx={{ backgroundColor: '#3B6774' }}>
                          <TableRow>
                            <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>ID</TableCell>
                            <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Tên danh mục</TableCell>
                            <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Slug</TableCell>
                            <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Mô tả</TableCell>
                            <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Ngày tạo</TableCell>
                            <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Thao tác</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredCategories.length > 0 ? filteredCategories.map(cat => (
                            <TableRow key={cat.categoryID} hover>
                              <TableCell>{cat.categoryID}</TableCell>
                              <TableCell>{cat.categoryName}</TableCell>
                              <TableCell>
                                <Chip
                                  label={cat.slug || 'N/A'}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontFamily: 'monospace' }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{
                                  maxWidth: 200,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {cat.description || 'Chưa có mô tả'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {cat.createdAt ? formatDate(cat.createdAt) : 'N/A'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Button size="small" color="primary" onClick={() => openEditCategory(cat)} startIcon={<EditIcon />} sx={{ mr: 1 }}>
                                  Sửa
                                </Button>
                                <Button size="small" color="error" onClick={() => setDeleteCategoryId(cat.categoryID)} startIcon={<DeleteIcon />}>
                                  Xóa
                                </Button>
                              </TableCell>
                            </TableRow>
                          )) : (
                            <TableRow>
                              <TableCell colSpan={6} align="center">Không có danh mục nào</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {/* Modal thêm/sửa category */}
                    <Dialog open={categoryModalOpen} onClose={closeCategoryModal} maxWidth="xs" fullWidth>
                      <DialogTitle>{categoryEditMode ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}</DialogTitle>
                      <DialogContent>
                        <TextField
                          label="Tên danh mục"
                          name="categoryName"
                          value={categoryForm.categoryName}
                          onChange={handleCategoryFormChange}
                          error={!!categoryError.categoryName}
                          helperText={categoryError.categoryName}
                          fullWidth
                          sx={{ mb: 2 }}
                          required
                        />
                        <TextField
                          label="Slug (tùy chọn)"
                          name="slug"
                          value={categoryForm.slug}
                          onChange={handleCategoryFormChange}
                          error={!!categoryError.slug}
                          helperText={categoryError.slug || "Để trống để tự động tạo từ tên danh mục"}
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          label="Mô tả"
                          name="description"
                          value={categoryForm.description}
                          onChange={handleCategoryFormChange}
                          error={!!categoryError.description}
                          helperText={categoryError.description}
                          fullWidth
                          multiline
                          minRows={2}
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          label="URL Thumbnail (tùy chọn)"
                          name="thumbnailUrl"
                          value={categoryForm.thumbnailUrl}
                          onChange={handleCategoryFormChange}
                          error={!!categoryError.thumbnailUrl}
                          helperText={categoryError.thumbnailUrl}
                          fullWidth
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={closeCategoryModal}>Hủy</Button>
                        <Button onClick={handleCategorySubmit} variant="contained">{categoryEditMode ? 'Lưu' : 'Thêm'}</Button>
                      </DialogActions>
                    </Dialog>
                    {/* Xác nhận xóa */}
                    <Dialog open={!!deleteCategoryId} onClose={() => setDeleteCategoryId(null)} maxWidth="xs" fullWidth>
                      <DialogTitle>Xác nhận xóa danh mục</DialogTitle>
                      <DialogContent>Bạn có chắc chắn muốn xóa danh mục này không?</DialogContent>
                      <DialogActions>
                        <Button onClick={() => setDeleteCategoryId(null)}>Hủy</Button>
                        <Button onClick={handleDeleteCategory} color="error" variant="contained">Xóa</Button>
                      </DialogActions>
                    </Dialog>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
             {/* Modal thêm/sửa blog */}
       <Dialog open={blogModalOpen} onClose={closeBlogModal} maxWidth="md" fullWidth>
         <DialogTitle>{blogEditMode ? 'Cập nhật bài viết' : 'Thêm bài viết mới'}</DialogTitle>
         <DialogContent>
           <TextField
             label="Tiêu đề"
             name="title"
             value={blogForm.title}
             onChange={handleBlogFormChange}
             error={!!blogError.title}
             helperText={blogError.title}
             fullWidth
             sx={{ mb: 2 }}
           />
           <TextField
             label="Tóm tắt"
             name="summary"
             value={blogForm.summary}
             onChange={handleBlogFormChange}
             error={!!blogError.summary}
             helperText={blogError.summary}
             fullWidth
             multiline
             minRows={2}
             maxRows={3}
             sx={{ mb: 2 }}
           />
           <TextField
             label="Tags (phân cách bằng dấu phẩy)"
             name="tags"
             value={blogForm.tags}
             onChange={handleBlogFormChange}
             fullWidth
             sx={{ mb: 2 }}
             placeholder="sức khỏe, phụ nữ, dinh dưỡng"
           />
           <TextField
             label="Nội dung"
             name="content"
             value={blogForm.content}
             onChange={handleBlogFormChange}
             error={!!blogError.content}
             helperText={blogError.content}
             fullWidth
             multiline
             minRows={6}
             sx={{ mb: 2 }}
           />
           <Box sx={{ mb: 2 }}>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
               <Typography variant="subtitle2">Danh mục</Typography>
               <Button
                 size="small"
                 onClick={() => {
                   console.log('Force loading categories...');
                   loadCategories();
                 }}
                 startIcon={<RefreshIcon />}
                 sx={{ fontSize: '0.75rem' }}
               >
                 Tải lại
               </Button>
               <Typography variant="caption" color="text.secondary">
                 ({categories.length} danh mục)
               </Typography>
               {categories.length === 0 && (
                 <Button
                   size="small"
                   color="primary"
                   onClick={() => {
                     closeBlogModal();
                     setTab('category');
                   }}
                   sx={{ fontSize: '0.75rem' }}
                 >
                   Tạo danh mục
                 </Button>
               )}
             </Box>
             {/* Category Selection Grid */}
             <Box sx={{ mb: 2 }}>
               <Typography variant="subtitle2" sx={{ mb: 2, color: blogError.categoryIds ? 'error.main' : 'text.primary' }}>
                 Chọn danh mục ({(blogForm.categoryIds || []).length} đã chọn)
                 {/* Debug info */}
                 <span style={{ fontSize: '12px', color: 'gray', marginLeft: '10px' }}>
                   [Debug: {JSON.stringify(blogForm.categoryIds)}]
                 </span>
               </Typography>

               {categories && categories.length > 0 ? (
                 <Grid container spacing={2}>
                   {categories.map((category) => {
                     const categoryId = Number(category.categoryID);
                     const selectedIds = (blogForm.categoryIds || []);
                     const isSelected = selectedIds.some(id => Number(id) === categoryId);

                     console.log(`Category ${category.categoryName} (ID: ${categoryId}):`, {
                       selectedIds,
                       isSelected,
                       categoryId
                     });

                     return (
                       <Grid item xs={12} sm={6} md={4} lg={3} key={category.categoryID}>
                         <Card
                           sx={{
                             cursor: 'pointer',
                             border: isSelected ? '2px solid' : '1px solid',
                             borderColor: isSelected ? 'primary.main' : 'grey.300',
                             backgroundColor: isSelected ? 'primary.50' : 'background.paper',
                             transition: 'all 0.2s ease-in-out',
                             '&:hover': {
                               transform: 'translateY(-2px)',
                               boxShadow: 3,
                               borderColor: isSelected ? 'primary.dark' : 'primary.light',
                             },
                             height: '100%',
                             display: 'flex',
                             flexDirection: 'column'
                           }}
                           onClick={() => handleCategoryCardClick(category.categoryID)}
                         >
                           <CardActionArea sx={{ flexGrow: 1, p: 0 }}>
                             <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                               {/* Category Name */}
                               <Typography
                                 variant="subtitle2"
                                 sx={{
                                   fontWeight: 600,
                                   color: isSelected ? 'primary.main' : 'text.primary',
                                   mb: 1,
                                   lineHeight: 1.2
                                 }}
                               >
                                 {category.categoryName}
                               </Typography>

                               {/* Category Description */}
                               {category.description && (
                                 <Typography
                                   variant="caption"
                                   sx={{
                                     color: 'text.secondary',
                                     display: '-webkit-box',
                                     WebkitLineClamp: 2,
                                     WebkitBoxOrient: 'vertical',
                                     overflow: 'hidden',
                                     flexGrow: 1
                                   }}
                                 >
                                   {category.description}
                                 </Typography>
                               )}

                               {/* Selection Indicator */}
                               {isSelected && (
                                 <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                   <Chip
                                     label="Đã chọn"
                                     size="small"
                                     color="primary"
                                     variant="filled"
                                     sx={{ fontSize: '0.7rem', height: 20 }}
                                   />
                                 </Box>
                               )}
                             </CardContent>
                           </CardActionArea>
                         </Card>
                       </Grid>
                     );
                   })}
                 </Grid>
               ) : (
                 /* Empty State */
                 <Box
                   sx={{
                     textAlign: 'center',
                     py: 4,
                     border: '2px dashed',
                     borderColor: 'grey.300',
                     borderRadius: 2,
                     backgroundColor: 'grey.50'
                   }}
                 >
                   <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                     {loading ? 'Đang tải danh mục...' : 'Chưa có danh mục nào'}
                   </Typography>
                   {!loading && (
                     <Button
                       variant="outlined"
                       color="primary"
                       onClick={() => {
                         closeBlogModal();
                         setTab('category');
                       }}
                       startIcon={<AddIcon />}
                       size="small"
                     >
                       Tạo danh mục mới
                     </Button>
                   )}
                 </Box>
               )}

               {/* Error Message */}
               {blogError.categoryIds && (
                 <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                   {blogError.categoryIds}
                 </Typography>
               )}
             </Box>
           </Box>
           
           {/* Cover Image Upload */}
           <Box sx={{ mb: 2 }}>
             <Typography variant="subtitle2" sx={{ mb: 1 }}>Ảnh bìa</Typography>
             <input
               type="file"
               accept="image/*"
               onChange={(e) => setCoverImage(e.target.files[0])}
               style={{ width: '100%' }}
             />
             {coverImage && (
               <Typography variant="caption" color="success.main">
                 Đã chọn: {coverImage.name}
               </Typography>
             )}
           </Box>
           
           {/* Published Status */}
           <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
             <Typography variant="subtitle2" sx={{ mr: 2 }}>Trạng thái:</Typography>
             <Chip
               label={blogForm.isPublished ? 'Đã xuất bản' : 'Nháp'}
               color={blogForm.isPublished ? 'success' : 'default'}
               onClick={() => setBlogForm({ ...blogForm, isPublished: !blogForm.isPublished })}
               sx={{ cursor: 'pointer' }}
             />
           </Box>
         </DialogContent>
         <DialogActions>
           <Button onClick={closeBlogModal}>Hủy</Button>
           <Button onClick={handleBlogSubmit} variant="contained">{blogEditMode ? 'Lưu' : 'Thêm'}</Button>
         </DialogActions>
       </Dialog>
      {/* Xác nhận xóa blog */}
      <Dialog open={!!deleteBlogId} onClose={() => setDeleteBlogId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Xác nhận xóa bài viết</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa bài viết này không?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteBlogId(null)}>Hủy</Button>
          <Button onClick={handleDeleteBlog} color="error" variant="contained">Xóa</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminContentManagement;