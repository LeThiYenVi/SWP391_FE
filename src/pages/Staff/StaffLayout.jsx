import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Biotech as TestTubeIcon,
  CloudUpload as UploadIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import StaffAppointments from './StaffAppointments';
import StaffSampleCollection from './StaffSampleCollection';
import StaffUploadResult from './StaffUploadResult';
import StaffServiceInput from './StaffServiceInput';
import './StaffLayout.css';

const StaffLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const renderCurrentPage = () => {
    const path = location.pathname;

    if (path === '/staff/sample-collection') {
      return <StaffSampleCollection />;
    } else if (path === '/staff/upload-result') {
      return <StaffUploadResult />;
    } else if (path === '/staff/service-input') {
      return <StaffServiceInput />;
    } else {
      // Default to appointments for /staff and /staff/appointments
      return <StaffAppointments />;
    }
  };

  const menuItems = [
    {
      path: '/staff/appointments',
      name: 'Lịch xét nghiệm',
      icon: <CalendarIcon />,
    },
    {
      path: '/staff/sample-collection',
      name: 'Lấy mẫu xét nghiệm',
      icon: <TestTubeIcon />,
    },
    {
      path: '/staff/upload-result',
      name: 'Kết quả xét nghiệm',
      icon: <UploadIcon />,
    },
    {
      path: '/staff/service-input',
      name: 'Quản lý dịch vụ',
      icon: <SettingsIcon />,
    },
  ];

  const bottomItems = [
    { text: 'Đăng xuất', icon: <LogoutIcon />, action: handleLogout },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Box
        className="staff-sidebar"
        sx={{
          width: 280,
          background: 'linear-gradient(135deg, #B3CCD4 0%, #D4E6EA 50%, #E8F1F5 100%)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(179, 204, 212, 0.3)',
          boxShadow: '0 8px 32px rgba(179, 204, 212, 0.25), 0 2px 8px rgba(179, 204, 212, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 20%, rgba(179, 204, 212, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(179, 204, 212, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(179, 204, 212, 0.1) 0%, transparent 50%)
            `,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

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
            position: 'relative',
            zIndex: 1,
            mx: 2,
            mt: 2,
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
              Staff Panel
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
        <List sx={{ flexGrow: 1, position: 'relative', zIndex: 1, px: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.path}
                onClick={() => navigate(item.path)}
                className="staff-menu-item"
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  background: isActive
                    ? 'linear-gradient(135deg, #354766, #4a6b75)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: isActive ? 'white' : '#354766',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(179, 204, 212, 0.3)',
                  boxShadow: isActive
                    ? '0 4px 16px rgba(53, 71, 102, 0.3)'
                    : '0 2px 8px rgba(179, 204, 212, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: isActive
                      ? 'linear-gradient(135deg, #354766, #4a6b75)'
                      : 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(179, 204, 212, 0.3)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'white' : '#354766',
                    minWidth: '40px',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: isActive ? 700 : 600,
                      fontSize: '0.95rem'
                    }
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        <Divider sx={{
          my: 2,
          borderColor: 'rgba(179, 204, 212, 0.5)',
          boxShadow: '0 1px 2px rgba(255, 255, 255, 0.3)',
          position: 'relative',
          zIndex: 1,
        }} />

        {/* Bottom Items */}
        <List sx={{ position: 'relative', zIndex: 1, px: 2, pb: 2 }}>
          {bottomItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={item.action}
              className="staff-menu-item"
              sx={{
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#dc2626',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(220, 38, 38, 0.2)',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'rgba(220, 38, 38, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(220, 38, 38, 0.2)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: '#dc2626',
                  minWidth: '40px',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: 600,
                    fontSize: '0.95rem'
                  }
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <AppBar
          position="static"
          className="staff-header"
          sx={{
            background: 'linear-gradient(135deg, #B3CCD4 0%, #E8F1F5 50%, #F0F8FF 100%)',
            boxShadow: '0 2px 8px rgba(179, 204, 212, 0.15)',
            borderBottom: '1px solid rgba(179, 204, 212, 0.3)',
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                color: '#354766',
                fontSize: '1.25rem',
                textShadow: '0 1px 2px rgba(179, 204, 212, 0.1)',
              }}
            >
              {menuItems.find(item => item.path === location.pathname)?.name || 'Trang nhân viên'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ color: '#354766', mr: 1 }} />
              <Typography
                variant="body2"
                sx={{
                  color: '#354766',
                  fontWeight: 600,
                }}
              >
                Nhân viên
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box
          className="staff-content"
          sx={{
            flexGrow: 1,
            background: 'linear-gradient(135deg, #B3CCD4 0%, #E8F1F5 50%, #F0F8FF 100%)',
            p: 3,
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 20%, rgba(179, 204, 212, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(179, 204, 212, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(179, 204, 212, 0.1) 0%, transparent 50%)
              `,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Content Wrapper */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(179, 204, 212, 0.25), 0 2px 8px rgba(179, 204, 212, 0.15)',
              border: '1px solid rgba(179, 204, 212, 0.3)',
              p: 3,
              minHeight: 'calc(100vh - 120px)',
            }}
          >
            {renderCurrentPage()}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StaffLayout;
