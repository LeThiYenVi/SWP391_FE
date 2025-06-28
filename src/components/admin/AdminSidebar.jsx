import React from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { routes } from "../../routes";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import WeekendIcon from '@mui/icons-material/Weekend';
import BrushIcon from '@mui/icons-material/Brush';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import logoGreen from '../../assets/image/logo_green.png';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';

const menuItems = [
  { text: 'Thống kê', icon: <DashboardIcon />, route: 'adminDashboard' },
  { text: 'Nội thất', icon: <WeekendIcon />, route: 'adminFurniture' },
  { text: 'Thiết kế', icon: <BrushIcon />, route: 'adminDesign' },
  { text: 'Đơn hàng', icon: <ListAltIcon />, route: 'adminOrder' },
  { text: 'Người dùng', icon: <PeopleIcon />, route: 'adminUser' },
  { text: 'Sản phẩm chờ', icon: <HourglassTopIcon />, route: 'adminWaiting' },
];

const bottomItems = [
  { text: 'Cài đặt', icon: <SettingsIcon />, route: '#' },
  { text: 'Đăng xuất', icon: <LogoutIcon />, route: 'login' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        bgcolor: '#fff',
        color: '#2e3a25',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        py: 1,
        px: 2,
        boxSizing: 'border-box',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          height: 60,
          mb: 4,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={logoGreen}
          alt="SnapRoom Logo"
          style={{
            maxHeight: '80%',
            maxWidth: '80%',
            objectFit: 'contain',
          }}
        />
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
                  mb: 1,
                  borderRadius: 1,
                  bgcolor: isActive ? '#3F5139' : 'transparent',
                  color: isActive ? 'white' : '#2e3a25',
                  '&:hover': {
                    bgcolor: isActive ? '#3F5139' : '#e0e0e0',
                  },
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

      <Divider sx={{ my: 2 }} />

      {/* Bottom Items */}
      <List>
        {bottomItems.map(({ text, icon, route }) => {
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

