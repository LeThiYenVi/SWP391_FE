import React, { useEffect, useState } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Pagination, IconButton, Tooltip, Typography, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArticleIcon from '@mui/icons-material/Article';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ImageIcon from '@mui/icons-material/Image';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BlogService from '../../services/BlogService';
import { toast } from 'react-toastify';

const ContentTable = ({ refreshKey, onView, onEdit, onDelete }) => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const abortController = new AbortController();

        fetchData(abortController.signal);
        loadCategories(abortController.signal);

        return () => {
            abortController.abort();
        };
    }, [page, pageSize, refreshKey]);

    const fetchData = async (signal) => {
        setLoading(true);
        try {
            // Chỉ load API /api/blog/posts với phân trang
            const response = await BlogService.getAllBlogPosts(page, pageSize, signal);

            console.log('📊 Blog posts response:', response);
            setBlogPosts(response?.content || []);
            setTotalPages(response?.totalPages || 1);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error loading blog posts:', error);
                toast.error('Lỗi khi tải danh sách bài viết');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async (signal) => {
        try {
            const response = await BlogService.getAllCategories(signal);
            console.log('📂 Categories response:', response);
            setCategories(response || []);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error loading categories:', error);
            }
        }
    };

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    // Get content icon based on type
    const getContentIcon = (type) => {
        switch (type) {
            case 'VIDEO':
                return <VideoLibraryIcon sx={{ color: '#2196F3' }} />;
            case 'IMAGE':
                return <ImageIcon sx={{ color: '#4CAF50' }} />;
            case 'NOTIFICATION':
                return <NotificationsIcon sx={{ color: '#FF9800' }} />;
            default:
                return <ArticleIcon sx={{ color: '#757575' }} />;
        }
    };

    // Get category name
    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.categoryID === categoryId);
        return category ? category.categoryName : 'Không xác định';
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    // Filter posts based on status
    const filteredPosts = blogPosts.filter(post => {
        if (statusFilter === 'published') return post.isPublished;
        if (statusFilter === 'draft') return !post.isPublished;
        return true;
    });

    return (
        <Box>
            <TableContainer 
                component={Paper} 
                sx={{ 
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(179, 204, 212, 0.25), 0 2px 8px rgba(179, 204, 212, 0.15)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(179, 204, 212, 0.3)',
                }}
            >
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', fontSize: '12px' }}>STT</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', fontSize: '12px' }}>Loại</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', fontSize: '12px' }}>Tiêu đề</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', fontSize: '12px' }}>Danh mục</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', fontSize: '12px' }}>Trạng thái</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', fontSize: '12px' }}>Lượt xem</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', fontSize: '12px' }}>Cập nhật</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', fontSize: '12px' }}>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#6b7280' }}>
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : filteredPosts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#6b7280' }}>
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPosts.map((post, index) => (
                                <TableRow key={post.id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                                    <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {getContentIcon(post.contentType)}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#111827', mb: 0.5 }}>
                                                {post.title}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {post.summary}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{getCategoryName(post.categoryId)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={post.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                                            size="small"
                                            sx={{
                                                bgcolor: post.isPublished ? '#d4edda' : '#fff3cd',
                                                color: post.isPublished ? '#155724' : '#856404',
                                                fontWeight: 600
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{post.viewCount || 0}</TableCell>
                                    <TableCell>{formatDate(post.updatedAt)}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Tooltip title="Xem chi tiết">
                                                <IconButton
                                                    onClick={() => onView && onView(post.id)}
                                                    size="small"
                                                    sx={{ color: '#2196F3', '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.04)' } }}
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Chỉnh sửa">
                                                <IconButton
                                                    onClick={() => onEdit && onEdit(post)}
                                                    size="small"
                                                    sx={{ color: '#4CAF50', '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.04)' } }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Xóa">
                                                <IconButton
                                                    onClick={() => onDelete && onDelete(post)}
                                                    size="small"
                                                    sx={{ color: '#f44336', '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.04)' } }}
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

            {/* Pagination */}
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handleChangePage}
                        color="primary"
                        size="large"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                borderRadius: '8px',
                                fontWeight: 500,
                            },
                            '& .Mui-selected': {
                                bgcolor: '#2196F3 !important',
                                color: 'white',
                            }
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default ContentTable;
