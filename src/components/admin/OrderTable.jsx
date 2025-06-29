import React, { useEffect, useState } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Pagination,
} from '@mui/material';
import { getAllOrdersAPI } from '../../services/UsersSevices';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';

const OrderTable = ({ searchTerm, statusFilter }) => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(6);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllOrdersAPI(page, pageSize);
                setOrders(res.items || []);
                setTotalPages(res.totalPages || 1);
            } catch (err) {
                console.error('Error fetching orders:', err);
            }
        };

        fetchData();
    }, [page, pageSize]);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // Lọc đơn theo searchTerm và statusFilter
    const filteredOrders = orders.filter(order => {
        const matchSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === '' || order.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const statusColorMap = {
        Pending: "#9E9E9E",
        Processing: "#FF9800",
        Delivered: "#347433",
        Refunded: "#FF6F3C",
        Cancelled: "#B22222",
    };

    const statusLabelMap = {
        Pending: "Chờ xác nhận",
        Processing: "Đang xử lý",
        Delivered: "Đã giao hàng",
        Refunded: "Hoàn tiền",
        Cancelled: "Đã hủy",
    };


    return (

        <Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#3B6774' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#f5f5f5' }}>STT</TableCell>
                            <TableCell sx={{ color: '#f5f5f5' }}>Mã đơn hàng</TableCell>
                            <TableCell sx={{ color: '#f5f5f5' }}>Nhà thiết kế</TableCell>
                            <TableCell sx={{ color: '#f5f5f5' }}>Người mua</TableCell>
                            <TableCell sx={{ color: '#f5f5f5' }}>Tổng giá</TableCell>
                            <TableCell sx={{ color: '#f5f5f5' }}>Ngày tạo</TableCell>
                            <TableCell sx={{ color: '#f5f5f5' }}>Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.map((item, index) => (
                            <TableRow
                                key={item.id}
                                hover
                                onClick={() => navigate(routes.adminOrderDetail.replace(':orderId', item.id))}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.designer.name}</TableCell>
                                <TableCell>{item.customer.name}</TableCell>
                                <TableCell>{item.orderPrice.toLocaleString()}đ</TableCell>
                                <TableCell>{formatDate(item.date)}</TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 2,
                                            color: "#fff",
                                            fontWeight: 500,
                                            display: "inline-block",
                                            bgcolor: statusColorMap[item.status] || "#F5F5F5",
                                        }}
                                    >
                                        {statusLabelMap[item.status] || "Không xác định"}
                                    </Box>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination count={totalPages} page={page} onChange={handleChangePage} />
            </Box>

        </Box>
    );
};

export default OrderTable;


