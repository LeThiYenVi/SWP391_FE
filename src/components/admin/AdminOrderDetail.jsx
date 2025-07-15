import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Divider,
    Chip,
} from '@mui/material';
import { getOrdersById } from '../../services/UsersSevices';

const AdminOrderDetail = ({ orderId }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!orderId) {
            console.warn('OrderDetail: orderId is missing or invalid');
            return;
        }

        const fetchOrder = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getOrdersById(orderId);
                
                if (!data) {
                    setError('Không tìm thấy dữ liệu đơn hàng');
                    setOrder(null);
                } else {
                    setOrder({
                        ...data,
                        orderDetails: data.orderDetails || data.items || [],
                        statuses: data.statuses || [],
                    });
                }
            } catch (err) {
                console.error('OrderDetail: Error fetching order:', err);
                setError('Lỗi khi lấy dữ liệu đơn hàng');
                setOrder(null);
            }
            setLoading(false);
        };

        fetchOrder();
    }, [orderId]);

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleString('vi-VN');
    };

    if (loading) return <Typography>Đang tải dữ liệu đơn hàng...</Typography>;

    if (error) return <Typography color="error">{error}</Typography>;

    if (!order) return <Typography>Không có dữ liệu đơn hàng để hiển thị.</Typography>;

    const statusLabelMap = {
        Pending: 'Chờ xác nhận',
        Processing: 'Đang điều trị',
        Completed: 'Hoàn tất',
        Cancelled: 'Đã hủy',
        Refund: 'Hoàn tiền',
        // Payment status mapping for backward compatibility
        Delivered: 'Đã thanh toán',
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return '#9E9E9E'; // Gray
            case 'Processing':
                return '#FF9800'; // Orange
            case 'Completed':
            case 'Delivered':
                return '#4CAF50'; // Green
            case 'Cancelled':
                return '#F44336'; // Red
            case 'Refund':
                return '#FF6F3C'; // Orange-red
            default:
                return '#9E9E9E';
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Chi tiết đơn hàng #{order.id}
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1">👤 Bệnh nhân: {order.customer?.name || 'N/A'}</Typography>
                <Typography variant="subtitle1">🩺 Tư vấn viên: {order.designer?.name || 'N/A'}</Typography>
                <Typography variant="subtitle1">🏥 Chuyên khoa: {order.designer?.specialty || 'N/A'}</Typography>
                <Typography variant="subtitle1">🎂 Tuổi: {order.customer?.age || 'N/A'}</Typography>
                <Typography variant="subtitle1">⚤ Giới tính: {order.customer?.gender || 'N/A'}</Typography>
                <Typography variant="subtitle1">
                    💰 Tổng chi phí: {order.orderPrice?.toLocaleString() || 0}đ
                </Typography>
                <Typography variant="subtitle1">
                    📌 Trạng thái hiện tại:
                    <Chip
                        label={statusLabelMap[order.status] || order.status}
                        sx={{
                            ml: 1,
                            color: '#fff',
                            bgcolor: getStatusColor(order.status),
                            minWidth: 120,
                            textAlign: 'center'
                        }}
                    />
                </Typography>
                <Typography variant="subtitle1">
                    💳 Thanh toán: 
                    <Chip
                        label={order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        sx={{
                            ml: 1,
                            color: '#fff',
                            bgcolor: order.isPaid ? '#4CAF50' : '#F44336',
                            minWidth: 120,
                            textAlign: 'center'
                        }}
                    />
                </Typography>
            </Paper>

            <Typography variant="h6" sx={{ mb: 1 }}>
                🏥 Danh sách dịch vụ y tế
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Tên dịch vụ</TableCell>
                        <TableCell>Mã dịch vụ</TableCell>
                        <TableCell>Giá</TableCell>
                        <TableCell>Số lượng</TableCell>
                        <TableCell>Thành tiền</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {order.orderDetails.map((detail, index) => (
                        <TableRow key={index}>
                            <TableCell>{detail.product?.name || 'N/A'}</TableCell>
                            <TableCell>
                                <Typography 
                                    variant="body2"
                                    sx={{ 
                                        fontFamily: 'monospace',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        color: '#1976D2'
                                    }}
                                >
                                    {detail.product?.code || detail.product?.id || `SV${String(index + 1).padStart(3, '0')}`}
                                </Typography>
                            </TableCell>
                            <TableCell>{detail.product?.price?.toLocaleString() || 0}đ</TableCell>
                            <TableCell>{detail.quantity || 0}</TableCell>
                            <TableCell>{detail.detailPrice?.toLocaleString() || 0}đ</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" sx={{ mb: 1 }}>
                ⏱️ Lịch sử trạng thái điều trị
            </Typography>
            {order.statuses.map((s, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                    <Chip
                        label={statusLabelMap[s.name] || s.name}
                        sx={{
                            mr: 2,
                            color: '#fff',
                            bgcolor: getStatusColor(s.name),
                            minWidth: 120,
                            textAlign: 'center'
                        }}
                    />
                    <Typography component="span">{formatDateTime(s.time)}</Typography>
                </Box>
            ))}
        </Box>
    );
};

export default AdminOrderDetail;
