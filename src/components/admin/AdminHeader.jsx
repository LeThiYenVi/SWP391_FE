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
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../NotificationBell';

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
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
    logout();
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
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
        minHeight: 72,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
        backdropFilter: 'blur(10px)',
        py: 1,
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(179, 204, 212, 0.2)',
        color: '#354766',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        borderBottom: '1px solid rgba(179, 204, 212, 0.3)',
      }}
    >
      {/* Search Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.6)',
          px: 2,
          py: 0.8,
          borderRadius: 2,
          width: 300,
          border: '1px solid rgba(179, 204, 212, 0.3)',
          boxShadow: '0 2px 8px rgba(179, 204, 212, 0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 12px rgba(179, 204, 212, 0.25)',
          },
        }}
      >
        <SearchIcon sx={{ mr: 1, color: '#354766' }} />
        <InputBase
          placeholder="Tìm kiếm..."
          fullWidth
          sx={{
            color: '#354766',
            '& input': {
              fontWeight: 500,
              fontSize: '0.95rem'
            }
          }}
        />
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

        {/* Notification Bell */}
        <NotificationBell />

        {/* User Info */}
        <Box
          onClick={handleUserClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.6)',
            border: '1px solid rgba(179, 204, 212, 0.3)',
            boxShadow: '0 2px 8px rgba(179, 204, 212, 0.15)',
            borderRadius: 2,
            px: 2,
            py: 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 4px 12px rgba(179, 204, 212, 0.25)',
              transform: 'translateY(-2px)'
            },
          }}
        >
          <Avatar
            alt="User"
            src={name ? `https://i.pravatar.cc/100?u=${name}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            sx={{
              width: 40,
              height: 40,
              border: '2px solid #B3CCD4'
            }}
            onError={(e) => {
              e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            }}
          />
          <Box sx={{ textAlign: 'left' }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: '#354766',
                fontSize: '0.95rem'
              }}
            >
              {name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#B3CCD4',
                fontWeight: 600,
                fontSize: '0.75rem'
              }}
            >
              {role}
            </Typography>
          </Box>
          <ArrowDropDownIcon sx={{ color: '#354766' }} />
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
