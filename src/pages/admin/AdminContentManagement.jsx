/**
 * ===== COMPONENT: AdminContentManagement =====
 *
 * Mô tả: Component quản lý nội dung blog và danh mục trong admin panel
 *
 * Chức năng chính:
 * - Quản lý blog posts: CRUD (Create, Read, Update, Delete)
 * - Quản lý categories: CRUD cho danh mục bài viết
 * - Tìm kiếm và lọc blog posts theo tiêu đề, tác giả, trạng thái
 * - Phân trang cho danh sách blog posts
 * - Upload ảnh bìa cho blog posts
 * - Chuyển trạng thái published/draft cho blog posts
 *
 * State management:
 * - Blog posts state: danh sách, loading, pagination
 * - Categories state: danh sách danh mục
 * - Modal states: quản lý các modal form
 * - Search & filter states: tìm kiếm và lọc dữ liệu
 * - Form states: dữ liệu form cho blog và category
 *
 * API calls:
 * - BlogService.getAllBlogPosts: Lấy danh sách blog posts có phân trang
 * - BlogService.getAllCategories: Lấy danh sách categories
 * - BlogService.createBlogPost/updateBlogPost/deleteBlogPost: CRUD blog
 * - BlogService.createCategory/updateCategory/deleteCategory: CRUD category
 */

// Import React hooks cần thiết
import React, { useState, useEffect } from 'react';

// Import các component UI từ Material-UI
import {
  Box, // Container component
  Typography, // Text component với variant
  Table, // Bảng dữ liệu
  TableBody, // Body của bảng
  TableCell, // Cell trong bảng
  TableContainer, // Container bao bọc bảng
  TableHead, // Header của bảng
  TableRow, // Row trong bảng
  Paper, // Surface component với elevation
  Pagination, // Component phân trang
  CircularProgress, // Loading spinner
  Chip, // Badge/tag component
  InputBase, // Input không viền
  TextField, // Input có viền và label
  MenuItem, // Menu item cho Select
  Button, // Button component
  Tooltip, // Tooltip hiển thị khi hover
  Switch, // Toggle switch
  FormControlLabel, // Label cho form control
  // Tabs,                // Tab navigation (đã comment vì không dùng)
  // Tab                  // Tab item (đã comment vì không dùng)
} from '@mui/material';

// Import các icon từ Material-UI Icons
import SearchIcon from '@mui/icons-material/Search'; // Icon tìm kiếm
import AddIcon from '@mui/icons-material/Add'; // Icon thêm mới
import RefreshIcon from '@mui/icons-material/Refresh'; // Icon làm mới
import DeleteIcon from '@mui/icons-material/Delete'; // Icon xóa
import EditIcon from '@mui/icons-material/Edit'; // Icon chỉnh sửa

// Import các component Dialog từ Material-UI
import Dialog from '@mui/material/Dialog'; // Modal dialog
import DialogTitle from '@mui/material/DialogTitle'; // Title của dialog
import DialogContent from '@mui/material/DialogContent'; // Content của dialog
import DialogActions from '@mui/material/DialogActions'; // Actions của dialog

// Import các component layout chính
import Sidebar from '../../components/admin/AdminSidebar'; // Sidebar navigation
import Header from '../../components/admin/AdminHeader'; // Header component

// Import service để gọi API
import BlogService from '../../services/BlogService'; // Service xử lý blog API

// Import thư viện thông báo toast
import { toast } from 'react-toastify'; // Thông báo toast

// Component chính quản lý nội dung
const AdminContentManagement = () => {
  // ===== STATE VARIABLES =====

  // ===== BLOG POSTS STATE =====
  const [blogPosts, setBlogPosts] = useState([]); // Danh sách blog posts từ API
  const [categories, setCategories] = useState([]); // Danh sách categories từ API
  const [loading, setLoading] = useState(false); // Trạng thái loading khi fetch data
  const [page, setPage] = useState(1); // Trang hiện tại cho pagination
  const [pageSize] = useState(10); // Số item trên mỗi trang (const)
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang từ API
  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm blog
  const [statusFilter, setStatusFilter] = useState(''); // Filter theo trạng thái (published/draft)
  const [refreshKey, setRefreshKey] = useState(0); // Key để trigger refresh data

  // ===== TAB & UI STATE =====
  const [tab, setTab] = useState('blog'); // Tab hiện tại (blog/category)

  // ===== CATEGORY MODAL STATE =====
  const [categoryModalOpen, setCategoryModalOpen] = useState(false); // Trạng thái mở modal category
  const [categoryEditMode, setCategoryEditMode] = useState(false); // Chế độ edit (true) hay add (false)
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
  }); // Form data cho category
  const [categoryError, setCategoryError] = useState({}); // Lỗi validation cho category form
  const [selectedCategory, setSelectedCategory] = useState(null); // Category được chọn để edit
  const [deleteCategoryId, setDeleteCategoryId] = useState(null); // ID category cần xóa
  const [categorySearch, setCategorySearch] = useState(''); // Từ khóa tìm kiếm category

  // ===== BLOG MODAL STATE =====
  const [blogModalOpen, setBlogModalOpen] = useState(false); // Trạng thái mở modal blog
  const [blogEditMode, setBlogEditMode] = useState(false); // Chế độ edit (true) hay add (false)
  const [blogForm, setBlogForm] = useState({
    // Form data cho blog
    title: '', // Tiêu đề bài viết
    content: '', // Nội dung bài viết
    summary: '', // Tóm tắt bài viết
    tags: '', // Tags (phân cách bằng dấu phẩy)
    categoryIds: [], // Mảng ID các category được chọn
    isPublished: false, // Trạng thái published/draft
  });
  const [blogError, setBlogError] = useState({}); // Lỗi validation cho blog form
  const [selectedBlog, setSelectedBlog] = useState(null); // Blog được chọn để edit
  const [deleteBlogId, setDeleteBlogId] = useState(null); // ID blog cần xóa
  const [coverImage, setCoverImage] = useState(null); // File ảnh bìa được upload

  // ===== API FUNCTIONS =====

  // Hàm load danh sách blog posts từ API với phân trang
  const loadBlogPosts = async (pageNumber = 1) => {
    try {
      setLoading(true); // Bật loading state
      const response = await BlogService.getAllBlogPosts(pageNumber, pageSize);

      console.log('API Response:', response); // Debug log để kiểm tra response

      // Kiểm tra và xử lý response data
      if (response && response.content) {
        setBlogPosts(response.content || []); // Set danh sách blog posts
        setTotalPages(response.totalPages || 1); // Set tổng số trang
        toast.success('Đã tải dữ liệu thành công!');
      } else {
        // Trường hợp không có data
        setBlogPosts([]);
        setTotalPages(1);
        toast.info('Chưa có bài viết nào trong hệ thống');
      }
    } catch (error) {
      console.error('Error loading blog posts:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu: ' + error.message);
      // Reset state khi có lỗi
      setBlogPosts([]);
      setTotalPages(1);
    } finally {
      setLoading(false); // Tắt loading state
    }
  };

  // Hàm load danh sách categories từ API
  const loadCategories = async () => {
    try {
      const response = await BlogService.getAllCategories();
      // Kiểm tra response là array trước khi set state
      if (response && Array.isArray(response)) {
        setCategories(response);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // Không hiển thị toast error cho categories vì không critical
    }
  };

  // ===== UTILITY FUNCTIONS =====

  // Hàm lấy tên category theo ID (phiên bản cũ - chỉ lấy category đầu tiên)
  const getCategoryName = categoryIds => {
    if (!categoryIds || categoryIds.length === 0) return 'N/A';
    const category = categories.find(cat => cat.id === categoryIds[0]);
    return category ? category.name : `Category ${categoryIds[0]}`;
  };

  // Hàm lấy tên các categories theo array IDs (phiên bản mới - hỗ trợ multiple categories)
  const getCategoryNames = categoryIds => {
    if (!categoryIds || categoryIds.length === 0) return 'N/A';
    return categoryIds
      .map(id => {
        // Tìm category theo categoryID
        const cat = categories.find(c => c.categoryID === id);
        return cat ? cat.categoryName : `Category ${id}`;
      })
      .join(', '); // Nối các tên category bằng dấu phẩy
  };

  // ===== USEEFFECT HOOKS =====

  // Effect chính: Load dữ liệu khi component mount hoặc khi page/refreshKey thay đổi
  useEffect(() => {
    loadCategories(); // Load categories một lần
    loadBlogPosts(page); // Load blog posts theo trang hiện tại
  }, [page, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // ===== EVENT HANDLERS =====

  // Hàm xử lý thay đổi trang trong pagination
  const handlePageChange = (_, newPage) => {
    setPage(newPage); // Set trang mới, sẽ trigger useEffect để load data
  };

  // Hàm xử lý refresh dữ liệu
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1); // Tăng refreshKey để trigger useEffect
    toast.success('Đã làm mới dữ liệu!');
  };

  // Hàm xử lý thêm mới (placeholder - chưa implement)
  const handleAddNew = () => {
    toast.info('Tính năng thêm bài viết mới sẽ được phát triển!');
  };

  // ===== CATEGORY MANAGEMENT FUNCTIONS =====

  // Hàm mở modal thêm category mới
  const openAddCategory = () => {
    setCategoryEditMode(false); // Set chế độ thêm mới
    setCategoryForm({ name: '', description: '' }); // Reset form
    setCategoryError({}); // Clear errors
    setCategoryModalOpen(true); // Mở modal
  };

  // Hàm mở modal chỉnh sửa category
  const openEditCategory = cat => {
    setCategoryEditMode(true); // Set chế độ chỉnh sửa
    setCategoryForm({ name: cat.name, description: cat.description || '' }); // Populate form với data hiện tại
    setSelectedCategory(cat); // Set category được chọn
    setCategoryError({}); // Clear errors
    setCategoryModalOpen(true); // Mở modal
  };

  // Hàm đóng modal category
  const closeCategoryModal = () => {
    setCategoryModalOpen(false); // Đóng modal
    setSelectedCategory(null); // Clear selected category
  };

  // Hàm xử lý thay đổi form category
  const handleCategoryFormChange = e => {
    setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
  };

  // Hàm validate form category
  const validateCategory = () => {
    const err = {};

    // Validate tên category
    if (!categoryForm.name || !categoryForm.name.trim()) {
      err.name = 'Tên danh mục không được để trống';
    }
    if (categoryForm.name && categoryForm.name.length > 100) {
      err.name = 'Tên danh mục tối đa 100 ký tự';
    }

    // Validate mô tả category
    if (categoryForm.description && categoryForm.description.length > 255) {
      err.description = 'Mô tả tối đa 255 ký tự';
    }

    // Kiểm tra trùng tên category (validate phía frontend)
    const lower = categoryForm.name.trim().toLowerCase();
    const duplicate = categories.some(
      cat =>
        cat.categoryName.trim().toLowerCase() === lower &&
        (!categoryEditMode || cat.categoryID !== selectedCategory?.categoryID)
    );
    if (duplicate) {
      err.name = 'Tên danh mục đã tồn tại';
    }

    setCategoryError(err);
    return Object.keys(err).length === 0; // Return true nếu không có lỗi
  };

  // Hàm submit form category (thêm mới hoặc cập nhật)
  const handleCategorySubmit = async () => {
    console.log('handleCategorySubmit called');
    console.log('categoryEditMode:', categoryEditMode);
    console.log('selectedCategory:', selectedCategory);
    console.log('categoryForm:', categoryForm);

    // Validate form trước khi submit
    if (!validateCategory()) {
      console.log('Validation failed');
      return;
    }

    try {
      if (categoryEditMode && selectedCategory) {
        // Chế độ chỉnh sửa
        console.log('Updating category with ID:', selectedCategory.categoryID);
        await BlogService.updateCategory(
          selectedCategory.categoryID,
          categoryForm
        );
        toast.success('Cập nhật danh mục thành công!');
      } else {
        // Chế độ thêm mới
        console.log('Creating new category');
        await BlogService.createCategory(categoryForm);
        toast.success('Thêm danh mục thành công!');
      }
      closeCategoryModal(); // Đóng modal
      loadCategories(); // Reload danh sách categories
    } catch (err) {
      console.error('Category submit error:', err);
      const errorMsg = err?.response?.data || 'Lỗi khi lưu danh mục!';
      toast.error(errorMsg);
    }
  };

  // Hàm xóa category
  const handleDeleteCategory = async () => {
    if (!deleteCategoryId) return;
    try {
      await BlogService.deleteCategory(deleteCategoryId);
      toast.success('Xóa danh mục thành công!');
      setDeleteCategoryId(null); // Clear delete ID
      loadCategories(); // Reload danh sách
    } catch (err) {
      toast.error('Không thể xóa danh mục (có thể đang có bài viết liên kết)!');
    }
  };

  // Computed property: Lọc categories theo từ khóa tìm kiếm
  const filteredCategories = categories.filter(cat =>
    (cat.categoryName || '')
      .toLowerCase()
      .includes(categorySearch.toLowerCase())
  );

  // ===== DISPLAY HELPER FUNCTIONS =====

  // Hàm format ngày tháng cho hiển thị
  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN'); // Format theo chuẩn Việt Nam
  };

  // Hàm tạo status chip cho blog post
  const getStatusChip = isPublished => {
    return (
      <Chip
        label={isPublished ? 'Đã xuất bản' : 'Nháp'} // Label theo trạng thái
        color={isPublished ? 'success' : 'default'} // Màu green cho published, gray cho draft
        size="small" // Size nhỏ cho tiết kiệm không gian
      />
    );
  };

  // ===== FILTERING LOGIC =====

  // Computed property: Lọc blog posts theo search term và status filter
  const filteredBlogPosts = blogPosts.filter(post => {
    // Tìm kiếm theo tiêu đề, tác giả, hoặc ID
    const matchSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.author?.name || post.author?.fullName)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      post.id?.toString().includes(searchTerm);

    // Lọc theo trạng thái published/draft
    let matchStatus = true;
    if (statusFilter === 'published') {
      matchStatus = (post.featured || post.isPublished) === true;
    } else if (statusFilter === 'draft') {
      matchStatus = (post.featured || post.isPublished) === false;
    }
    // Nếu statusFilter === '' thì matchStatus = true (hiển thị tất cả)

    return matchSearch && matchStatus; // Cả 2 điều kiện đều phải thỏa mãn
  });

  // ===== BLOG MANAGEMENT FUNCTIONS =====

  // Hàm mở modal thêm blog mới
  const openAddBlog = () => {
    setBlogEditMode(false); // Set chế độ thêm mới
    setBlogForm({
      // Reset form về trạng thái ban đầu
      title: '',
      content: '',
      summary: '',
      tags: '',
      categoryIds: [],
      isPublished: false,
    });
    setBlogError({}); // Clear errors
    setCoverImage(null); // Clear cover image
    setBlogModalOpen(true); // Mở modal
  };

  // Hàm mở modal chỉnh sửa blog
  const openEditBlog = post => {
    setBlogEditMode(true); // Set chế độ chỉnh sửa
    setBlogForm({
      // Populate form với data hiện tại
      title: post.title || '',
      content: post.content || '',
      summary: post.summary || '',
      tags: post.tags || '',
      // Map categories sang array IDs
      categoryIds: post.categories
        ? post.categories.map(cat => cat.categoryID || cat.id)
        : [],
      isPublished: post.isPublished || false,
    });
    setSelectedBlog(post); // Set blog được chọn
    setBlogError({}); // Clear errors
    setCoverImage(null); // Reset cover image (sẽ upload mới nếu cần)
    setBlogModalOpen(true); // Mở modal
  };

  // Hàm đóng modal blog
  const closeBlogModal = () => {
    setBlogModalOpen(false); // Đóng modal
    setSelectedBlog(null); // Clear selected blog
  };

  // Hàm xử lý thay đổi form blog (text fields)
  const handleBlogFormChange = e => {
    setBlogForm({ ...blogForm, [e.target.name]: e.target.value });
  };

  // Hàm xử lý thay đổi categories (multiple select)
  const handleBlogCategoryChange = e => {
    setBlogForm({ ...blogForm, categoryIds: e.target.value });
  };

  // Hàm validate form blog
  const validateBlog = () => {
    const err = {};

    // Validate tiêu đề
    if (!blogForm.title || !blogForm.title.trim()) {
      err.title = 'Tiêu đề không được để trống';
    }
    if (blogForm.title && blogForm.title.length > 200) {
      err.title = 'Tiêu đề tối đa 200 ký tự';
    }

    // Validate nội dung
    if (!blogForm.content || !blogForm.content.trim()) {
      err.content = 'Nội dung không được để trống';
    }

    // Validate tóm tắt
    if (blogForm.summary && blogForm.summary.length > 500) {
      err.summary = 'Tóm tắt tối đa 500 ký tự';
    }

    // Validate categories
    if (!blogForm.categoryIds || blogForm.categoryIds.length === 0) {
      err.categoryIds = 'Chọn ít nhất 1 danh mục';
    }

    setBlogError(err);
    return Object.keys(err).length === 0; // Return true nếu không có lỗi
  };

  // Hàm submit form blog (thêm mới hoặc cập nhật)
  const handleBlogSubmit = async () => {
    // Validate form trước khi submit
    if (!validateBlog()) return;

    try {
      // Tạo FormData để hỗ trợ upload file
      const formData = new FormData();

      // Chuẩn bị payload cho blog post
      const blogPayload = {
        title: blogForm.title.trim(),
        content: blogForm.content.trim(),
        summary: blogForm.summary.trim(),
        tags: blogForm.tags.trim(),
        categoryIds: (blogForm.categoryIds || []).map(Number), // Convert sang number array
        isPublished: blogForm.isPublished,
      };

      // Thêm blog data vào FormData dưới dạng JSON blob
      formData.append(
        'blogPost',
        new Blob([JSON.stringify(blogPayload)], {
          type: 'application/json',
        })
      );

      // Thêm cover image nếu có file được chọn
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      if (blogEditMode && selectedBlog) {
        // Chế độ cập nhật
        await BlogService.updateBlogPost(selectedBlog.id, formData);
        toast.success('Cập nhật bài viết thành công!');
      } else {
        // Chế độ thêm mới
        await BlogService.createBlogPost(formData);
        toast.success('Thêm bài viết thành công!');
      }
      closeBlogModal(); // Đóng modal
      loadBlogPosts(page); // Reload danh sách blog posts
    } catch (err) {
      console.error('Blog submit error:', err);
      const errorMsg = err?.response?.data?.message || 'Lỗi khi lưu bài viết!';
      toast.error(errorMsg);
    }
  };

  // Hàm xóa blog post
  const handleDeleteBlog = async () => {
    if (!deleteBlogId) return;
    try {
      await BlogService.deleteBlogPost(deleteBlogId);
      toast.success('Xóa bài viết thành công!');
      setDeleteBlogId(null); // Clear delete ID
      loadBlogPosts(page); // Reload danh sách
    } catch (err) {
      toast.error('Không thể xóa bài viết!');
    }
  };

  // ===== RENDER UI =====
  return (
    // Layout chính với Sidebar và Main Content
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header cố định */}
        <Box sx={{ flexShrink: 0, minHeight: 64 }}>
          <Header />
        </Box>

        {/* Scrollable content area */}
        <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 2, overflowY: 'auto' }}>
          {/* Page title và Tab navigation */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              mb: 2,
              mt: 2,
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 500, color: 'gray' }}>
              Quản lý nội dung
            </Typography>
            {/* Tab buttons cho Blog và Category */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Tab Blog */}
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
                  boxShadow:
                    tab === 'blog'
                      ? '0 2px 8px rgba(25, 118, 210, 0.12)'
                      : 'none',
                  border: tab === 'blog' ? 'none' : '2px solid #1976d2',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: tab === 'blog' ? '#1565c0' : '#e3f2fd',
                    color: tab === 'blog' ? 'white' : '#1976d2',
                    boxShadow: '0 4px 16px rgba(25, 118, 210, 0.18)',
                  },
                }}
              >
                BLOG
              </Button>
              {/* Tab Category */}
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
                  boxShadow:
                    tab === 'category'
                      ? '0 2px 8px rgba(67, 160, 71, 0.12)'
                      : 'none',
                  border: tab === 'category' ? 'none' : '2px solid #43a047',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: tab === 'category' ? '#388e3c' : '#e8f5e9',
                    color: tab === 'category' ? 'white' : '#43a047',
                    boxShadow: '0 4px 16px rgba(67, 160, 71, 0.18)',
                  },
                }}
              >
                CATEGORY
              </Button>
            </Box>
          </Box>

          {/* Main content container */}
          <Box
            sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 2, overflowY: 'auto' }}
          >
            {/* Loading state hoặc nội dung chính */}
            {loading ? (
              // Loading spinner khi đang fetch data
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {/* ===== BLOG TAB CONTENT ===== */}
                {/* ===== BLOG TAB CONTENT ===== */}
                {tab === 'blog' && (
                  <>
                    {/* Header section với title, search, filter và action buttons */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 2,
                        mb: 2,
                        mt: 2,
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{ fontWeight: 500, color: 'gray' }}
                      >
                        Quản lý bài viết
                      </Typography>

                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
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
                            onChange={e => setSearchTerm(e.target.value)}
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

                        {/* Status filter dropdown */}
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
                            onChange={e => setStatusFilter(e.target.value)}
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
                                  },
                                },
                                disablePortal: true,
                                keepMounted: false,
                              },
                              // Custom render cho placeholder và values
                              renderValue: selected => {
                                if (!selected) {
                                  return 'Tất cả';
                                }
                                switch (selected) {
                                  case 'published':
                                    return 'Đã xuất bản';
                                  case 'draft':
                                    return 'Bản nháp';
                                  default:
                                    return '';
                                }
                              },
                            }}
                          >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="published">Đã xuất bản</MenuItem>
                            <MenuItem value="draft">Bản nháp</MenuItem>
                          </TextField>
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {/* Button thêm blog mới */}
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
                                  boxShadow:
                                    '0 4px 12px rgba(76, 175, 80, 0.4)',
                                },
                              }}
                            >
                              Thêm mới
                            </Button>
                          </Tooltip>

                          {/* Button refresh data */}
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
                                },
                              }}
                            >
                              Làm mới
                            </Button>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>

                    {/* Blog posts table */}
                    <TableContainer
                      component={Paper}
                      sx={{
                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Table>
                        {/* Table header */}
                        <TableHead sx={{ backgroundColor: '#3B6774' }}>
                          <TableRow>
                            <TableCell
                              sx={{ color: '#f5f5f5', fontWeight: 600 }}
                            >
                              ID
                            </TableCell>
                            <TableCell
                              sx={{ color: '#f5f5f5', fontWeight: 600 }}
                            >
                              Tiêu đề
                            </TableCell>
                            <TableCell
                              sx={{ color: '#f5f5f5', fontWeight: 600 }}
                            >
                              Tác giả
                            </TableCell>
                            <TableCell
                              sx={{ color: '#f5f5f5', fontWeight: 600 }}
                            >
                              Danh mục
                            </TableCell>
                            <TableCell
                              sx={{ color: '#f5f5f5', fontWeight: 600 }}
                            >
                              Trạng thái
                            </TableCell>
                            <TableCell
                              sx={{ color: '#f5f5f5', fontWeight: 600 }}
                            >
                              Ngày tạo
                            </TableCell>
                            <TableCell
                              sx={{ color: '#f5f5f5', fontWeight: 600 }}
                            >
                              Lượt xem
                            </TableCell>
                            <TableCell
                              sx={{ color: '#f5f5f5', fontWeight: 600 }}
                            >
                              Thao tác
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        {/* Table body */}
                        <TableBody>
                          {/* Hiển thị dữ liệu hoặc thông báo không có data */}
                          {filteredBlogPosts.length > 0 ? (
                            // Render từng blog post
                            filteredBlogPosts.map(post => (
                              <TableRow key={post.id} hover>
                                <TableCell>{post.id}</TableCell>
                                <TableCell sx={{ maxWidth: 200 }}>
                                  <Typography variant="body2" noWrap>
                                    {post.title}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  {post.author?.name ||
                                    post.author?.fullName ||
                                    'N/A'}
                                </TableCell>
                                <TableCell>
                                  {/* Hiển thị tên categories */}
                                  {post.categories && post.categories.length > 0
                                    ? post.categories
                                        .map(
                                          cat => cat.name || cat.categoryName
                                        )
                                        .join(', ')
                                    : 'N/A'}
                                </TableCell>
                                <TableCell>
                                  {getStatusChip(
                                    post.featured || post.isPublished || false
                                  )}
                                </TableCell>
                                <TableCell>
                                  {formatDate(post.createdAt)}
                                </TableCell>
                                <TableCell>{post.views || 0}</TableCell>
                                <TableCell>
                                  {/* Action buttons */}
                                  <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => openEditBlog(post)}
                                    startIcon={<EditIcon />}
                                  >
                                    Sửa
                                  </Button>
                                  <Button
                                    size="small"
                                    color="error"
                                    onClick={() => setDeleteBlogId(post.id)}
                                    startIcon={<DeleteIcon />}
                                  >
                                    Xóa
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            // Thông báo khi không có data
                            <TableRow>
                              <TableCell
                                colSpan={8}
                                sx={{ textAlign: 'center', py: 4 }}
                              >
                                <Typography
                                  variant="body1"
                                  color="text.secondary"
                                >
                                  {searchTerm || statusFilter
                                    ? 'Không tìm thấy bài viết nào phù hợp'
                                    : 'Chưa có bài viết nào'}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Pagination - chỉ hiển thị khi có nhiều trang */}
                    {totalPages > 1 && (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          mt: 3,
                        }}
                      >
                        <Pagination
                          count={totalPages} // Tổng số trang
                          page={page} // Trang hiện tại
                          onChange={handlePageChange} // Handler khi thay đổi trang
                          color="primary"
                          size="large"
                        />
                      </Box>
                    )}
                  </>
                )}
                {/* ===== CATEGORY TAB CONTENT ===== */}
                {tab === 'category' && (
                  <Box sx={{ bgcolor: '#f5f5f5', p: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
                      Quản lý danh mục bài viết
                    </Typography>
                    {/* Header với search và button thêm mới */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        gap: 2,
                      }}
                    >
                      {/* Search input */}
                      <InputBase
                        placeholder="Tìm kiếm danh mục..."
                        value={categorySearch}
                        onChange={e => setCategorySearch(e.target.value)}
                        sx={{
                          bgcolor: 'white',
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          boxShadow: '0 0 0 1px #ccc',
                          width: 300,
                        }}
                      />
                      {/* Button thêm danh mục mới */}
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={openAddCategory}
                        sx={{
                          bgcolor: '#4CAF50',
                          color: 'white',
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                          fontWeight: 600,
                        }}
                      >
                        Thêm mới
                      </Button>
                    </Box>
                    {/* Categories table */}
                    <TableContainer
                      component={Paper}
                      sx={{
                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Table>
                        <TableHead sx={{ backgroundColor: '#3B6774' }}>
                          <TableRow>
                            <TableCell
                              sx={{ color: '#f5f5f5', fontWeight: 600 }}
                            >
                              ID
                            </TableCell>
                            <TableCell
                              sx={{ color: '#f5f5f5', fontWeight: 600 }}
                            >
                              Tên danh mục
                            </TableCell>
                            <TableCell
                              sx={{ color: '#f5f5f5', fontWeight: 600 }}
                            >
                              Mô tả
                            </TableCell>
                            <TableCell
                              sx={{ color: '#f5f5f5', fontWeight: 600 }}
                            >
                              Thao tác
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* Hiển thị danh sách categories hoặc thông báo trống */}
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map(cat => (
                              <TableRow key={cat.categoryID} hover>
                                <TableCell>{cat.categoryID}</TableCell>
                                <TableCell>{cat.categoryName}</TableCell>
                                <TableCell>{cat.description}</TableCell>
                                <TableCell>
                                  {/* Action buttons */}
                                  <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => openEditCategory(cat)}
                                    startIcon={<EditIcon />}
                                  >
                                    Sửa
                                  </Button>
                                  <Button
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      setDeleteCategoryId(cat.categoryID)
                                    }
                                    startIcon={<DeleteIcon />}
                                  >
                                    Xóa
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
                                Không có danh mục nào
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {/* ===== CATEGORY MODALS ===== */}

                    {/* Modal thêm/sửa category */}
                    <Dialog
                      open={categoryModalOpen}
                      onClose={closeCategoryModal}
                      maxWidth="xs"
                      fullWidth
                    >
                      <DialogTitle>
                        {categoryEditMode
                          ? 'Cập nhật danh mục'
                          : 'Thêm danh mục mới'}
                      </DialogTitle>
                      <DialogContent>
                        {/* Form field: Tên danh mục */}
                        <TextField
                          label="Tên danh mục"
                          name="name"
                          value={categoryForm.name}
                          onChange={handleCategoryFormChange}
                          error={!!categoryError.name}
                          helperText={categoryError.name}
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                        {/* Form field: Mô tả */}
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
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={closeCategoryModal}>Hủy</Button>
                        <Button
                          onClick={handleCategorySubmit}
                          variant="contained"
                        >
                          {categoryEditMode ? 'Lưu' : 'Thêm'}
                        </Button>
                      </DialogActions>
                    </Dialog>

                    {/* Modal xác nhận xóa category */}
                    <Dialog
                      open={!!deleteCategoryId}
                      onClose={() => setDeleteCategoryId(null)}
                      maxWidth="xs"
                      fullWidth
                    >
                      <DialogTitle>Xác nhận xóa danh mục</DialogTitle>
                      <DialogContent>
                        Bạn có chắc chắn muốn xóa danh mục này không?
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setDeleteCategoryId(null)}>
                          Hủy
                        </Button>
                        <Button
                          onClick={handleDeleteCategory}
                          color="error"
                          variant="contained"
                        >
                          Xóa
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* ===== BLOG MODALS (OUTSIDE MAIN CONTAINER) ===== */}

      {/* Modal thêm/sửa blog */}
      <Dialog
        open={blogModalOpen}
        onClose={closeBlogModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {blogEditMode ? 'Cập nhật bài viết' : 'Thêm bài viết mới'}
        </DialogTitle>
        <DialogContent>
          {/* Form field: Tiêu đề */}
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
          {/* Form field: Tóm tắt */}
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
          {/* Form field: Tags */}
          <TextField
            label="Tags (phân cách bằng dấu phẩy)"
            name="tags"
            value={blogForm.tags}
            onChange={handleBlogFormChange}
            fullWidth
            sx={{ mb: 2 }}
            placeholder="sức khỏe, phụ nữ, dinh dưỡng"
          />
          {/* Form field: Nội dung */}
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
          {/* Form field: Categories (multiple select) */}
          <TextField
            select
            label="Danh mục"
            name="categoryIds"
            value={blogForm.categoryIds}
            onChange={handleBlogCategoryChange}
            SelectProps={{ multiple: true }} // Cho phép chọn nhiều
            error={!!blogError.categoryIds}
            helperText={blogError.categoryIds}
            fullWidth
            sx={{ mb: 2 }}
          >
            {categories.map(cat => (
              <MenuItem key={cat.categoryID} value={cat.categoryID}>
                {cat.categoryName}
              </MenuItem>
            ))}
          </TextField>

          {/* Cover Image Upload */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Ảnh bìa
            </Typography>
            <input
              type="file"
              accept="image/*" // Chỉ chấp nhận file ảnh
              onChange={e => setCoverImage(e.target.files[0])}
              style={{ width: '100%' }}
            />
            {/* Hiển thị tên file đã chọn */}
            {coverImage && (
              <Typography variant="caption" color="success.main">
                Đã chọn: {coverImage.name}
              </Typography>
            )}
          </Box>

          {/* Published Status Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mr: 2 }}>
              Trạng thái:
            </Typography>
            <Chip
              label={blogForm.isPublished ? 'Đã xuất bản' : 'Nháp'}
              color={blogForm.isPublished ? 'success' : 'default'}
              onClick={() =>
                setBlogForm({ ...blogForm, isPublished: !blogForm.isPublished })
              }
              sx={{ cursor: 'pointer' }} // Click để toggle trạng thái
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeBlogModal}>Hủy</Button>
          <Button onClick={handleBlogSubmit} variant="contained">
            {blogEditMode ? 'Lưu' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal xác nhận xóa blog */}
      <Dialog
        open={!!deleteBlogId}
        onClose={() => setDeleteBlogId(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Xác nhận xóa bài viết</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa bài viết này không?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteBlogId(null)}>Hủy</Button>
          <Button onClick={handleDeleteBlog} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Export component để sử dụng trong admin routes
export default AdminContentManagement;
