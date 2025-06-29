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
                console.log('OrderDetail: fetched data:', data);

                if (!data) {
                    setError('Không tìm thấy dữ liệu đơn hàng');
                    setOrder(null);
                } else {
                    setOrder({
                        ...data,
                        orderDetails: data.orderDetails || [],
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


    console.log('OrderDetail render with orderId:', orderId, 'order:', order);

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleString('vi-VN');
    };

    if (loading) return <Typography>Đang tải dữ liệu đơn hàng...</Typography>;

    if (error) return <Typography color="error">{error}</Typography>;

    if (!order) return <Typography>Không có dữ liệu đơn hàng để hiển thị.</Typography>;

    const statusLabelMap = {
        Pending: 'Chờ xác nhận',
        Processing: 'Đang xử lý',
        Delivered: 'Đã giao hàng',
        Refund: 'Hoàn tiền',
        Cancelled: 'Đã hủy',
        Completed: 'Hoàn tất',
        Buy: 'Đã mua',
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Chi tiết đơn hàng #{order.id}
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1">👤 Khách hàng: {order.customer?.name || 'N/A'}</Typography>
                <Typography variant="subtitle1">🎨 Nhà thiết kế: {order.designer?.name || 'N/A'}</Typography>
                <Typography variant="subtitle1">
                    💰 Tổng giá: {order.orderPrice?.toLocaleString() || 0}đ
                </Typography>
                <Typography variant="subtitle1">
                    📌 Trạng thái hiện tại:
                    <Chip
                        label={statusLabelMap[order.status] || order.status}
                        sx={{
                            ml: 1,
                            color: '#fff',
                            bgcolor:
                                order.status === 'Pending'
                                    ? '#9E9E9E'
                                    : order.status === 'Processing'
                                        ? '#FF9800'
                                        : order.status === 'Delivered'
                                            ? '#347433'
                                            : order.status === 'Refund'
                                                ? '#FF6F3C'
                                                : order.status === 'Cancelled'
                                                    ? '#B22222'
                                                    : '#B22222',
                            minWidth: 120,
                            textAlign: 'center'
                        }}
                    />

                </Typography>
            </Paper>

            <Typography variant="h6" sx={{ mb: 1 }}>
                🛒 Danh sách sản phẩm
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Tên sản phẩm</TableCell>
                        <TableCell>Giá</TableCell>
                        <TableCell>Số lượng</TableCell>
                        <TableCell>Thành tiền</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {order.orderDetails.map((detail, index) => (
                        <TableRow key={index}>
                            <TableCell>{detail.product?.name || 'N/A'}</TableCell>
                            <TableCell>{detail.product?.price?.toLocaleString() || 0}đ</TableCell>
                            <TableCell>{detail.quantity || 0}</TableCell>
                            <TableCell>{detail.detailPrice?.toLocaleString() || 0}đ</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" sx={{ mb: 1 }}>
                ⏱️ Lịch sử trạng thái
            </Typography>
            {order.statuses.map((s, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                    <Chip
                        label={statusLabelMap[s.name] || s.name}
                        sx={{
                            mr: 2,
                            color: '#fff',
                            bgcolor:
                                s.name === 'Pending'
                                    ? '#9E9E9E'
                                    : s.name === 'Processing'
                                        ? '#FF9800'
                                        : s.name === 'Delivered'
                                            ? '#347433'
                                            : s.name === 'Refund'
                                                ? '#FF6F3C'
                                                : s.name === 'Cancelled'
                                                    ? '#B22222'
                                                    : '#B22222',
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
