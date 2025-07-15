import React, { useEffect, useState } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Pagination, Button, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions, Typography,
    Chip, Divider, Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAllBookingsAPI } from '../../services/UsersSevices';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';
import { toast } from 'react-toastify';

const OrderTable = ({ searchTerm, statusFilter, refreshKey }) => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    
    // Modal states
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchData();
    }, [page, pageSize, refreshKey]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllBookingsAPI(page, pageSize);
            console.log('Bookings response:', res);
            setOrders(res.content || []);
            setTotalPages(res.totalPages || 1);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            toast.error('Không thể tải dữ liệu đơn hàng!');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    };

    // Lọc đơn theo searchTerm và statusFilter (booking status)
    const filteredOrders = orders.filter(booking => {
        const matchSearch = booking.bookingId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.customerFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter theo trạng thái booking
        let matchStatus = true;
        if (statusFilter === 'paid') {
            matchStatus = booking.status === 'COMPLETED';
        } else if (statusFilter === 'unpaid') {
            matchStatus = booking.status === 'PENDING' || booking.status === 'SAMPLE_COLLECTED' || booking.status === 'TESTING';
        }
        
        return matchSearch && matchStatus;
    });

    // Function to determine booking status
    const getBookingStatus = (booking) => {
        switch (booking.status) {
            case 'COMPLETED':
                return { text: 'Hoàn thành', color: '#4CAF50' };
            case 'PENDING':
                return { text: 'Chờ xử lý', color: '#FF9800' };
            case 'SAMPLE_COLLECTED':
                return { text: 'Đã lấy mẫu', color: '#2196F3' };
            case 'TESTING':
                return { text: 'Đang xét nghiệm', color: '#9C27B0' };
            case 'CANCELLED':
                return { text: 'Đã hủy', color: '#F44336' };
            default:
                return { text: 'Không xác định', color: '#757575' };
        }
    };

    // Modal handlers
    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setViewModalOpen(true);
    };

    const handleEditOrder = (order) => {
        setSelectedOrder(order);
        setEditModalOpen(true);
    };

    const handleDeleteOrder = (order) => {
        setSelectedOrder(order);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        // TODO: Implement delete API call
        toast.success('Đã xóa đơn hàng thành công!');
        setDeleteModalOpen(false);
        fetchData(); // Refresh data
    };

    const handleSaveEdit = () => {
        // TODO: Implement update API call
        toast.success('Đã cập nhật đơn hàng thành công!');
        setEditModalOpen(false);
        fetchData(); // Refresh data
    };

    return (
        <Box>
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#3B6774' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>STT</TableCell>
                            <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Mã đơn hàng</TableCell>
                            <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Dịch vụ</TableCell>
                            <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Khách hàng</TableCell>
                            <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Tổng giá</TableCell>
                            <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Ngày tạo</TableCell>
                            <TableCell sx={{ color: '#f5f5f5', fontWeight: 600 }}>Trạng thái</TableCell>
                            <TableCell sx={{ color: '#f5f5f5', fontWeight: 600, textAlign: 'center' }}>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.map((booking, index) => {
                            const statusInfo = getBookingStatus(booking);
                            return (
                                <TableRow
                                    key={booking.bookingId}
                                    hover
                                    sx={{ 
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'rgba(59, 103, 116, 0.04)'
                                        }
                                    }}
                                >
                                    <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#3B6774' }}>
                                            #{booking.bookingId}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{booking.serviceName}</TableCell>
                                    <TableCell>{booking.customerFullName}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                                            {booking.servicePrice?.toLocaleString()}đ
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{formatDate(booking.createdAt)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={statusInfo.text}
                                            sx={{
                                                bgcolor: statusInfo.color,
                                                color: 'white',
                                                fontWeight: 600,
                                                fontSize: '12px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                            <Tooltip title="Xem chi tiết">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewOrder(booking);
                                                    }}
                                                    sx={{
                                                        color: '#2196F3',
                                                        '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.1)' }
                                                    }}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Chỉnh sửa">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditOrder(booking);
                                                    }}
                                                    sx={{
                                                        color: '#FF9800',
                                                        '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.1)' }
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Xóa">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteOrder(booking);
                                                    }}
                                                    sx={{
                                                        color: '#F44336',
                                                        '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)' }
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handleChangePage}
                    color="primary"
                    size="large"
                />
            </Box>

            {/* View Modal */}
            <Dialog 
                open={viewModalOpen} 
                onClose={() => setViewModalOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ bgcolor: '#3B6774', color: 'white' }}>
                    Chi tiết đơn hàng #{selectedOrder?.bookingId}
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    {selectedOrder && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ mb: 2, color: '#3B6774' }}>
                                    Thông tin đơn hàng
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="textSecondary">Mã đơn hàng</Typography>
                                <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                                    #{selectedOrder.bookingId}
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="textSecondary">Dịch vụ</Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {selectedOrder.serviceName}
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="textSecondary">Khách hàng</Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {selectedOrder.customerFullName}
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="textSecondary">Giá dịch vụ</Typography>
                                <Typography variant="body1" sx={{ mb: 2, fontWeight: 600, color: '#4CAF50' }}>
                                    {selectedOrder.servicePrice?.toLocaleString()}đ
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="textSecondary">Ngày tạo</Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {formatDateTime(selectedOrder.createdAt)}
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="textSecondary">Trạng thái</Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Chip
                                        label={getBookingStatus(selectedOrder).text}
                                        sx={{
                                            bgcolor: getBookingStatus(selectedOrder).color,
                                            color: 'white',
                                            fontWeight: 600
                                        }}
                                    />
                                </Box>
                            </Grid>
                            
                            {selectedOrder.result && (
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="textSecondary">Kết quả</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {selectedOrder.result}
                                    </Typography>
                                </Grid>
                            )}
                            
                            {selectedOrder.resultDate && (
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="textSecondary">Ngày có kết quả</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {formatDateTime(selectedOrder.resultDate)}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button 
                        onClick={() => setViewModalOpen(false)}
                        variant="outlined"
                        sx={{ borderRadius: '20px', px: 3 }}
                    >
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Modal */}
            <Dialog 
                open={editModalOpen} 
                onClose={() => setEditModalOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ bgcolor: '#FF9800', color: 'white' }}>
                    Chỉnh sửa đơn hàng #{selectedOrder?.bookingId}
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    {selectedOrder && (
                        <Box>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Tính năng chỉnh sửa đơn hàng sẽ được phát triển trong phiên bản tiếp theo.
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Hiện tại bạn có thể xem chi tiết hoặc xóa đơn hàng.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button 
                        onClick={() => setEditModalOpen(false)}
                        variant="outlined"
                        sx={{ borderRadius: '20px', px: 3 }}
                    >
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleSaveEdit}
                        variant="contained"
                        sx={{ 
                            borderRadius: '20px', 
                            px: 3,
                            bgcolor: '#FF9800',
                            '&:hover': { bgcolor: '#F57C00' }
                        }}
                    >
                        Lưu thay đổi
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog 
                open={deleteModalOpen} 
                onClose={() => setDeleteModalOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ bgcolor: '#F44336', color: 'white' }}>
                    Xác nhận xóa đơn hàng
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Bạn có chắc chắn muốn xóa đơn hàng #{selectedOrder?.bookingId}?
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Hành động này không thể hoàn tác. Đơn hàng sẽ bị xóa vĩnh viễn.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button 
                        onClick={() => setDeleteModalOpen(false)}
                        variant="outlined"
                        sx={{ borderRadius: '20px', px: 3 }}
                    >
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete}
                        variant="contained"
                        sx={{ 
                            borderRadius: '20px', 
                            px: 3,
                            bgcolor: '#F44336',
                            '&:hover': { bgcolor: '#D32F2F' }
                        }}
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrderTable;


