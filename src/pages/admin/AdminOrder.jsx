import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from '../../components/admin/AdminSidebar';
import Header from '../../components/admin/AdminHeader';
import { Box, Typography, InputBase, TextField, MenuItem } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import OrderTable from '../../components/admin/OrderTable';

export default function AdminOrder() {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        if (location.state?.toastMessage) {
            toast.success(location.state.toastMessage);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flexShrink: 0, minHeight: 64 }}>
                    <Header />
                </Box>

                <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 2, overflowY: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 2, mt: 2 }}>
                        <Typography variant='h3' sx={{ fontWeight: 500, color: 'gray'  }}>
                            Đơn hàng
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {/* Search box (mỏng giống Furniture) */}
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
                                    placeholder="Mã đơn hàng"
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

                            {/* Dropdown status filter (mỏng giống Furniture) */}
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
                                                case "paid":
                                                    return "Đã thanh toán";
                                                case "unpaid":
                                                    return "Chưa thanh toán";
                                                default:
                                                    return "";
                                            }
                                        }
                                    }}
                                >
                                    <MenuItem value="">Tất cả</MenuItem>
                                    <MenuItem value="paid">Đã thanh toán</MenuItem>
                                    <MenuItem value="unpaid">Chưa thanh toán</MenuItem>
                                </TextField>
                            </Box>

                        </Box>
                    </Box>

                    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 2, overflowY: 'auto' }}>
                        <OrderTable searchTerm={searchTerm} statusFilter={statusFilter} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
