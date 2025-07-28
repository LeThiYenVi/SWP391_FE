import React from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { routes } from "../../routes";
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
// import logoGreen from '../../assets/image/logo_green.png'; // Removed Starbucks logo
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ArticleIcon from '@mui/icons-material/Article';

const menuItems = [
  { text: 'Thống kê', icon: <DashboardIcon />, route: 'adminDashboard' },
  { text: 'Dịch vụ xét nghiệm', icon: <AssignmentIcon />, route: 'adminTestingServices' },
  { text: 'Đơn hàng', icon: <ListAltIcon />, route: 'adminOrder' },
  { text: 'Tư vấn viên', icon: <PersonOutlineIcon />, route: 'adminCounselor' },
  { text: 'Người dùng', icon: <PeopleIcon />, route: 'adminUser' },
  { text: 'Quản lý nội dung', icon: <ArticleIcon />, route: 'adminContentManagement' },
];

const bottomItems = [
  { text: 'Cài đặt', icon: <SettingsIcon />, route: 'adminProfile' },
  { text: 'Đăng xuất', icon: <LogoutIcon />, route: 'login' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        background: 'linear-gradient(135deg, #B3CCD4 0%, #E8F1F5 50%, #F0F8FF 100%)',
        color: '#354766',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        py: 3,
        px: 2,
        boxSizing: 'border-box',
        boxShadow: '4px 0 20px rgba(179, 204, 212, 0.3)',
        overflowY: 'auto',
        minWidth: 240,
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          height: 80,
          mb: 4,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(179, 204, 212, 0.3)',
          boxShadow: '0 4px 16px rgba(179, 204, 212, 0.2)',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: '#354766',
              fontSize: '1.5rem',
              textShadow: '0 1px 2px rgba(179, 204, 212, 0.3)',
              mb: 0.5
            }}
          >
            Admin Panel
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#B3CCD4',
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          >
            Healthcare Management
          </Typography>
        </Box>
      </Box>

      {/* Menu Items */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map(({ text, icon, route }) => {
          const isActive = location.pathname === routes[route];
          return (
            <Link key={text} to={routes[route]} style={{ textDecoration: 'none' }}>
              <ListItemButton
                key={text}
                onClick={() => {
                  if (text === 'Logout') {
                    localStorage.removeItem('token');
                    navigate(routes.login);
                  }
                }}
                sx={{
                  mb: 1.5,
                  borderRadius: 2,
                  background: isActive
                    ? 'linear-gradient(135deg, #354766, #4a6b75)'
                    : 'rgba(255, 255, 255, 0.6)',
                  color: isActive ? 'white' : '#354766',
                  backdropFilter: 'blur(10px)',
                  border: isActive
                    ? '1px solid rgba(53, 71, 102, 0.3)'
                    : '1px solid rgba(179, 204, 212, 0.3)',
                  boxShadow: isActive
                    ? '0 4px 16px rgba(53, 71, 102, 0.3)'
                    : '0 2px 8px rgba(179, 204, 212, 0.15)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: isActive
                      ? 'linear-gradient(135deg, #354766, #4a6b75)'
                      : 'rgba(255, 255, 255, 0.8)',
                    transform: 'translateX(4px)',
                    boxShadow: isActive
                      ? '0 6px 20px rgba(53, 71, 102, 0.4)'
                      : '0 4px 12px rgba(179, 204, 212, 0.25)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'white' : '#354766',
                    minWidth: '40px',
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: isActive ? 700 : 600,
                      fontSize: '0.95rem'
                    }
                  }}
                />
              </ListItemButton>
            </Link>
          );
        })}
      </List>

      <Divider sx={{
        my: 2,
        borderColor: 'rgba(179, 204, 212, 0.5)',
        boxShadow: '0 1px 2px rgba(255, 255, 255, 0.3)'
      }} />

      {/* Bottom Items */}
      <List>
        {bottomItems.map(({ text, icon, route }) => {
          const isActive = location.pathname === routes[route];
          return (
            <Link key={text} to={routes[route]} style={{ textDecoration: 'none' }}>
              <ListItemButton
                key={text}
                onClick={() => {
                  if (text === 'Đăng xuất') {
                    logout();
                    navigate('/');
                  }
                }}
                sx={{
                  textDecoration: 'none',
                  borderRadius: 1,
                  bgcolor: isActive ? '#3F5139' : 'transparent',
                  color: isActive ? 'white' : '#2e3a25',
                  '&:hover': {
                    bgcolor: isActive ? '#3F5139' : '#e0e0e0',
                  },
                  mb: 1,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'white' : '#2e3a25',
                    minWidth: '40px',
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </Link>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;

