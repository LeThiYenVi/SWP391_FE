import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from '../../components/admin/AdminSidebar';
import Header from '../../components/admin/AdminHeader';
import { Box, Typography, InputBase, TextField, MenuItem, Button, Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, Pagination, IconButton } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllAccountsAPI, getAwaitingDesignersAPI, applicationResultAPI } from '../../services/UsersSevices';

export default function AdminUser() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [mode, setMode] = useState('user');
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (mode === 'user') {
      fetchAllUsers();
    } else {
      fetchVerifyDesigners(1);
    }
  }, [mode]);

  const fetchAllUsers = async () => {
    try {
      const response = await getAllAccountsAPI();
      const items = response.items || [];
      setAllUsers(items);
      setFilteredUsers(items);
      setTotalPages(Math.ceil(items.length / pageSize));
      setPage(1);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchVerifyDesigners = async (pageNumber) => {
    try {
      const response = await getAwaitingDesignersAPI(pageNumber, pageSize);
      const items = response.items?.map(item => ({ ...item, decision: null })) || [];
      const totalCount = response.totalCount || 0;
      setDesigners(items);
      setTotalPages(Math.ceil(totalCount / pageSize));
      setPage(pageNumber);
    } catch (err) {
      console.error('Error fetching awaiting designers:', err);
    }
  };

  useEffect(() => {
    if (mode === 'user') {
      let filtered = allUsers;
      if (roleFilter !== '') {
        filtered = filtered.filter(user => user.role === parseInt(roleFilter));
      }
      if (searchTerm !== '') {
        filtered = filtered.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      setFilteredUsers(filtered);
      setTotalPages(Math.ceil(filtered.length / pageSize));
      setPage(1);
    }
  }, [searchTerm, roleFilter, allUsers, mode]);

  const handleChangePage = (event, value) => {
    if (mode === 'user') {
      setPage(value);
    } else {
      fetchVerifyDesigners(value);
    }
  };

  const handleDecision = async (email, isApproved) => {
    try {
      await applicationResultAPI(email, isApproved);
      setDesigners(prev =>
        prev.map(designer =>
          designer.email === email ? { ...designer, decision: isApproved } : designer
        )
      );
    } catch (err) {
      console.error('Error submitting application result:', err);
    }
  };

  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);
  const filteredDesigners = designers.filter(designer => designer.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexShrink: 0, minHeight: 64 }}>
          <Header />
        </Box>

        <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 2, overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 2, mt: 2 }}>
            <Typography variant='h4' sx={{ fontWeight: 500 }}>
              {mode === 'user' ? 'Người dùng' : 'Xét duyệt'}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Search box mỏng */}
              <Box sx={{ display: 'flex', alignItems: 'center', width: 300, bgcolor: 'white', borderRadius: '999px', px: 2, py: '6px', boxShadow: '0 0 0 1px #ccc' }}>
                <SearchIcon sx={{ color: 'gray', mr: 1 }} />
                <InputBase
                  placeholder={mode === 'user' ? "Tên người dùng..." : "Tên nhà thiết kế..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    flex: 1,
                    color: 'gray',
                    fontSize: 16,
                    '& .MuiInputBase-input': { p: 0 },
                    '&:focus-within': { outline: 'none' }
                  }}
                  disableUnderline
                />
              </Box>

              {/* Role filter mỏng */}
              {mode === 'user' && (
  <Box sx={{ width: 180, bgcolor: 'white', borderRadius: '999px', px: 2, py: '6px', boxShadow: '0 0 0 1px #ccc', display: 'flex', alignItems: 'center' }}>
    <TextField
      select
      variant="standard"
      value={roleFilter}
      onChange={(e) => setRoleFilter(e.target.value)}
      fullWidth
      InputProps={{ disableUnderline: true }}
      sx={{ flex: 1, '& .MuiSelect-select': { py: 0 }, fontSize: 16, color: 'gray' }}
      SelectProps={{
        displayEmpty: true,
        renderValue: (selected) => {
          if (!selected) {
            return "Tất cả";
          }
          switch (selected) {
            case "1": return "Nhà thiết kế";
            case "2": return "Khách hàng";
            case "0": return "Admin";
            default: return "";
          }
        }
      }}
    >
      <MenuItem value="">Tất cả</MenuItem>
      <MenuItem value="1">Nhà thiết kế</MenuItem>
      <MenuItem value="2">Khách hàng</MenuItem>
      <MenuItem value="0">Admin</MenuItem>
    </TextField>
  </Box>
)}


              {/* Mode switch mỏng */}
              <Box sx={{ width: 200, bgcolor: 'white', borderRadius: '999px', px: 2, py: '6px', boxShadow: '0 0 0 1px #ccc', display: 'flex', alignItems: 'center' }}>
                <TextField
                  select
                  variant="standard"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  fullWidth
                  InputProps={{ disableUnderline: true }}
                  sx={{ flex: 1, '& .MuiSelect-select': { py: 0 }, fontSize: 16, color: 'gray' }}
                >
                  <MenuItem value="user">Tất cả</MenuItem>
                  <MenuItem value="verify">Chưa duyệt</MenuItem>
                </TextField>
              </Box>
            </Box>
          </Box>

          {/* TABLE AREA */}
          <Box sx={{ bgcolor: '#f5f5f5', p: 2 }}>
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#3F5139' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#f5f5f5' }}>STT</TableCell>
                    <TableCell sx={{ color: '#f5f5f5' }}>Họ tên</TableCell>
                    <TableCell sx={{ color: '#f5f5f5' }}>Email</TableCell>
                    <TableCell sx={{ color: '#f5f5f5' }} align="center">Quản lí</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mode === 'user' ? (
                    paginatedUsers.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell align="center">
                          <IconButton color="primary" size="small"><EditIcon /></IconButton>
                          <IconButton color="error" size="small"><DeleteIcon /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredDesigners.map((designer, index) => (
                      <TableRow key={designer.id}>
                        <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                        <TableCell>{designer.name}</TableCell>
                        <TableCell>{designer.email}</TableCell>
                        <TableCell align="center">
                          {designer.decision === null ? (
                            <>
                              <Button variant="contained" color="success" size="small" sx={{ mr: 1 }}
                                onClick={() => handleDecision(designer.email, true)}>Chấp nhận</Button>
                              <Button variant="contained" color="error" size="small"
                                onClick={() => handleDecision(designer.email, false)}>Từ chối</Button>
                            </>
                          ) : (
                            <span style={{ color: designer.decision ? 'green' : 'red', fontWeight: 'bold' }}>
                              {designer.decision ? 'Đã chấp nhận' : 'Đã từ chối'}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination count={totalPages} page={page} onChange={handleChangePage} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
