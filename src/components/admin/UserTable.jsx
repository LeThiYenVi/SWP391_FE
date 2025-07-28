import React, { useEffect, useState } from 'react';
import {
    Box, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead,
    TableRow, 
    Paper, 
    IconButton, 
    Pagination,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllUsersAPI } from '../../services/AdminService';

const UserTable = ({ searchTerm, roleFilter, onEdit, onDelete }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 6;
    const [editUser, setEditUser] = useState(null);
    const [editData, setEditData] = useState({});
    const [openEdit, setOpenEdit] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await getAllUsersAPI();
            const items = response.content || response.items || [];
            setAllUsers(items);
            setFilteredUsers(items);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    useEffect(() => {
        let filtered = allUsers;
        if (roleFilter !== '') {
            filtered = filtered.filter((user) => user.role === parseInt(roleFilter));
        }
        if (searchTerm !== '') {
            filtered = filtered.filter((user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredUsers(filtered);
        setPage(1);
    }, [searchTerm, roleFilter, allUsers]);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

    const handleOpenEdit = (user) => {
        setEditUser(user);
        setEditData({
            fullName: user.fullName || user.name || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            address: user.address || '',
            gender: user.gender || '',
            dateOfBirth: user.dateOfBirth || '',
            roleName: user.roleName || '',
        });
        setOpenEdit(true);
    };
    const handleCloseEdit = () => {
        setOpenEdit(false);
        setEditUser(null);
    };
    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };
    const handleEditSubmit = () => {
        if (onEdit && editUser) {
            onEdit(editUser.id, editData);
        }
        handleCloseEdit();
    };
    const handleDelete = (user) => {
        if (onDelete) onDelete(user.id);
    };

    return (
        <Box>
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#3B6774' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#f5f5f5' }}>STT</TableCell>
                            <TableCell sx={{ color: '#f5f5f5' }}>Họ tên</TableCell>
                            <TableCell sx={{ color: '#f5f5f5' }}>Email</TableCell>
                            <TableCell sx={{ color: '#f5f5f5' }}>Role</TableCell>
                            <TableCell sx={{ color: '#f5f5f5' }} align="center">Quản lí</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedUsers.map((user, index) => (
                            <TableRow key={user.id}>
                                <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                                <TableCell>{user.fullName || user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.roleName || (user.role === 1 ? 'Tư vấn viên' : user.role === 2 ? 'Khách hàng' : 'Admin')}</TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" size="small" onClick={() => handleOpenEdit(user)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" size="small" onClick={() => handleDelete(user)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination count={totalPages} page={page} onChange={handleChangePage} />
            </Box>

            <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
                <DialogTitle>Cập nhật người dùng</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField label="Họ tên" name="fullName" value={editData.fullName} onChange={handleEditChange} fullWidth />
                        <TextField label="Email" name="email" value={editData.email} onChange={handleEditChange} fullWidth />
                        <TextField label="Số điện thoại" name="phoneNumber" value={editData.phoneNumber} onChange={handleEditChange} fullWidth />
                        <TextField label="Địa chỉ" name="address" value={editData.address} onChange={handleEditChange} fullWidth />
                        <TextField label="Giới tính" name="gender" value={editData.gender} onChange={handleEditChange} fullWidth />
                        <TextField label="Ngày sinh" name="dateOfBirth" value={editData.dateOfBirth} onChange={handleEditChange} fullWidth />
                        <TextField label="Vai trò" name="roleName" value={editData.roleName} onChange={handleEditChange} fullWidth />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit}>Hủy</Button>
                    <Button onClick={handleEditSubmit} variant="contained">Lưu</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserTable;
