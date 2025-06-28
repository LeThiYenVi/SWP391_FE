import React, { useState, useEffect } from 'react';
import {
  Box,
  InputBase,
  Avatar,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  const navigate = useNavigate();
  const [anchorElLang, setAnchorElLang] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [name, setName] = useState('Người dùng');
  const [role, setRole] = useState('');

  const handleLangClick = (event) => setAnchorElLang(event.currentTarget);
  const handleUserClick = (event) => setAnchorElUser(event.currentTarget);
  const handleClose = () => {
    setAnchorElLang(null);
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('TOKEN:', token);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('DECODED:', decoded);
        setName(decoded?.Name || 'Người dùng');
        setRole(decoded?.Role || '')
      } catch (error) {
        console.error('Lỗi giải mã token:', error);
      }
    }
  }, []);


  return (
    <Box
      sx={{
        minHeight: 70,
        bgcolor: '#fff',
        py: 1,
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0px 2px 0px rgba(0,0,0,0.1)',
        color: '#2e3a25',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Search Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#f1f1f1',
          px: 2,
          py: 0.5,
          borderRadius: 2,
          width: 300,
          '&:hover': { bgcolor: '#e0e0e0' },
        }}
      >
        <SearchIcon sx={{ mr: 1, color: '#2e3a25' }} />
        <InputBase placeholder="Tìm kiếm..." fullWidth sx={{ color: '#2e3a25' }} />
      </Box>

      {/* Right Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>

        {/* Language Menu */}
        <Box
          onClick={handleLangClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 },
          }}
        >
          <img
            src="https://flagcdn.com/w40/vn.png"
            alt="Vietnam"
            style={{ width: 24, height: 16, borderRadius: 2 }}
          />
          <Typography variant="body2">Tiếng Việt</Typography>
          <ArrowDropDownIcon />
        </Box>

        <Menu anchorEl={anchorElLang} open={Boolean(anchorElLang)} onClose={handleClose}>
          <MenuItem onClick={handleClose}>
            <img
              src="https://flagcdn.com/w40/gb.png"
              alt="English"
              style={{ width: 24, height: 16, marginRight: 8 }}
            />
            English
          </MenuItem>
        </Menu>

        {/* User Info */}
        <Box
          onClick={handleUserClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 },
          }}
        >
          <Avatar alt="User" src="https://cdn-icons-png.flaticon.com/512/149/149071.png" />
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="body2" fontWeight="bold">
              {name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {role}
            </Typography>
          </Box>
          <ArrowDropDownIcon />
        </Box>

        <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleClose}>
          <MenuItem onClick={() => {
            handleClose();
            navigate('/admin/profile')
          }}>Hồ sơ
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              handleLogout();
            }}
          >
            Đăng xuất
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;
