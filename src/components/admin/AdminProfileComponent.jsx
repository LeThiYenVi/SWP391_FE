import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Grid,
  TextField,
  Typography,
  Paper,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { jwtDecode } from 'jwt-decode';
import ChangePasswordDialog from '../both/ChangePasswordDialog';
import { updatePasswordAPI } from '../../services/UsersSevices';

const AdminProfileComponent = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    avatarSource: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserInfo({
          firstName: decoded?.Name?.split(' ')[0] || '',
          lastName: decoded?.Name?.split(' ')[1] || '',
          email: decoded?.Email || '',
          phoneNumber: decoded?.PhoneNumber || '',
          dateOfBirth: decoded?.DateOfBirth || '',
          address: decoded?.Address || '',
          avatarSource: decoded?.AvatarSource || '',
        });
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const customInputStyle = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#ccc',
      },
      '&:hover fieldset': {
        borderColor: '#3F5139',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3F5139 !important',
      },
    },
  };

  const handleChangePasswordSubmit = async ({ oldPassword, newPassword, confirmPassword }) => {
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      await updatePasswordAPI(oldPassword, newPassword);
      alert('Cập nhật mật khẩu thành công!');
      setShowChangePassword(false);
    } catch (error) {
      console.error('Lỗi đổi mật khẩu:', error);
      if (error.response?.data?.message) {
        alert(`Lỗi: ${error.response.data.message}`);
      } else {
        alert('Đã xảy ra lỗi, vui lòng thử lại.');
      }
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 1000,
        mx: 'auto',
        px: 1,
        py: 6,
        bgcolor: '#fff',
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        position: 'relative',
      }}
    >
      {/* Bánh răng góc phải */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <IconButton onClick={handleMenuOpen} sx={{ color: '#3F5139' }}>
          <SettingsIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              setShowChangePassword(true);
              handleMenuClose();
            }}
          >
            Đổi mật khẩu
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>Ngôn ngữ</MenuItem>
        </Menu>
      </Box>

      {/* Avatar + Tên */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
        <Avatar
          src={userInfo.avatarSource || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
          sx={{ width: 120, height: 120, mb: 2 }}
        />
        <Typography variant="h5" fontWeight={600}>
          {userInfo.firstName} {userInfo.lastName}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {userInfo.email}
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Họ - Tên */}
      <Grid container spacing={6} justifyContent="center" mb={5} mt={5}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Họ"
            fullWidth
            value={userInfo.firstName}
            inputProps={{ readOnly: true, tabIndex: 0 }}
            variant="outlined"
            sx={customInputStyle}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Tên"
            fullWidth
            value={userInfo.lastName}
            inputProps={{ readOnly: true, tabIndex: 0 }}
            variant="outlined"
            sx={customInputStyle}
          />
        </Grid>
      </Grid>

      {/* Email - Ngày sinh */}
      <Grid container spacing={6} justifyContent="center" mb={5} mt={5}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            fullWidth
            value={userInfo.email}
            inputProps={{ readOnly: true, tabIndex: 0 }}
            variant="outlined"
            sx={customInputStyle}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Ngày sinh"
            fullWidth
            value={userInfo.dateOfBirth}
            inputProps={{ readOnly: true, tabIndex: 0 }}
            variant="outlined"
            sx={customInputStyle}
          />
        </Grid>
      </Grid>

      {/* SĐT - Địa chỉ */}
      <Grid container spacing={6} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <TextField
            label="Số điện thoại"
            fullWidth
            value={userInfo.phoneNumber}
            inputProps={{ readOnly: true, tabIndex: 0 }}
            variant="outlined"
            sx={customInputStyle}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Địa chỉ"
            fullWidth
            value={userInfo.address}
            inputProps={{ readOnly: true, tabIndex: 0 }}
            variant="outlined"
            sx={customInputStyle}
          />
        </Grid>
      </Grid>

      {/* Dialog đổi mật khẩu */}
      <ChangePasswordDialog
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSubmit={handleChangePasswordSubmit}
      />
    </Paper>
  );
};

export default AdminProfileComponent;
