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
    Pagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllUsersAPI } from '../../services/AdminService';

const UserTable = ({ searchTerm, roleFilter }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 6;

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
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    {user.role === 1 ? 'Tư vấn viên' :
                                        user.role === 2 ? 'Khách hàng' : 'Admin'}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" size="small">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" size="small">
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
        </Box>
    );
};

export default UserTable;
