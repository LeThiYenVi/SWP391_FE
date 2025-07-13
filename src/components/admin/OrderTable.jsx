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

    // Lọc đơn theo searchTerm và statusFilter (payment status)
    const filteredOrders = orders.filter(order => {
        const matchSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter theo trạng thái thanh toán
        let matchStatus = true;
        if (statusFilter === 'paid') {
            matchStatus = order.isPaid === true;
        } else if (statusFilter === 'unpaid') {
            matchStatus = order.isPaid === false;
        }
        // Nếu statusFilter === '' thì matchStatus = true (hiển thị tất cả)
        
        return matchSearch && matchStatus;
    });

    // Function to determine payment status
    const getPaymentStatus = (order) => {
        // Check if order has isPaid field
        if (Object.prototype.hasOwnProperty.call(order, 'isPaid')) {
            return order.isPaid;
        }
        
        // Otherwise, determine based on status
        if (order.status === 'Delivered') {
            return true;
        } else if (order.status === 'Cancelled') {
            return false;
        }
        
        return false; // Default to unpaid
    };


    return (

        <Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#3B6774' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#f5f5f5' }}>STT</TableCell>
                            <TableCell sx={{ color: '#f5f5f5' }}>Mã đơn hàng</TableCell>
                            <TableCell sx={{ color: '#f5f5f5' }}>Tư vấn viên</TableCell>
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
                                            px: 3,
                                            py: 1,
                                            borderRadius: '16px',
                                            color: "#fff",
                                            fontWeight: 600,
                                            fontSize: '12px',
                                            textAlign: 'center',
                                            display: "inline-block",
                                            bgcolor: getPaymentStatus(item) ? "#4CAF50" : "#F44336",
                                            minWidth: '120px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        {getPaymentStatus(item) ? "Đã thanh toán" : "Chưa thanh toán"}
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


