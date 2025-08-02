import React, { useState } from 'react';
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
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Biotech as TestTubeIcon,
  CloudUpload as UploadIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import StaffAppointments from './StaffAppointments';
import StaffSampleCollection from './StaffSampleCollection';
import StaffUploadResult from './StaffUploadResult';
import StaffHistory from './StaffHistory';
import StaffServiceInput from './StaffServiceInput';
import StaffResponsiveTest from './StaffResponsiveTest';
import './StaffLayout.css';

const StaffLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderCurrentPage = () => {
    const path = location.pathname;

    if (path === '/staff/sample-collection') {
      return <StaffSampleCollection />;
    } else if (path === '/staff/upload-result') {
      return <StaffUploadResult />;
    } else if (path === '/staff/history') {
      return <StaffHistory />;
    } else if (path === '/staff/service-input') {
      return <StaffServiceInput />;
    } else if (path === '/staff/responsive-test') {
      return <StaffResponsiveTest />;
    } else {
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
      path: '/staff/history',
      name: 'Lịch sử xét nghiệm',
      icon: <PersonIcon />,
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

  // Sidebar content component
  const SidebarContent = ({ onItemClick }) => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Background Effects */}
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
              onClick={() => {
                navigate(item.path);
                if (onItemClick) onItemClick();
              }}
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
                  boxShadow: isActive
                    ? '0 6px 20px rgba(53, 71, 102, 0.4)'
                    : '0 4px 12px rgba(179, 204, 212, 0.2)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? 'white' : '#354766',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '0.95rem',
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Bottom Items */}
      <Box sx={{ position: 'relative', zIndex: 1, px: 2, pb: 2 }}>
        <Divider sx={{ mb: 2, borderColor: 'rgba(179, 204, 212, 0.3)' }} />
        {bottomItems.map((item, index) => (
          <ListItemButton
            key={index}
            onClick={() => {
              item.action();
              if (onItemClick) onItemClick();
            }}
            sx={{
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#354766',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(179, 204, 212, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'rgba(244, 67, 54, 0.1)',
                color: '#f44336',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.2)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: 600,
                  fontSize: '0.95rem',
                },
              }}
            />
          </ListItemButton>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: '100%',
            background: 'linear-gradient(135deg, #B3CCD4 0%, #D4E6EA 50%, #E8F1F5 100%)',
            boxShadow: '0 2px 8px rgba(179, 204, 212, 0.25)',
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: '#354766' }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ color: '#354766', fontWeight: 700 }}
            >
              Staff Panel
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: 280,
              background: 'linear-gradient(135deg, #B3CCD4 0%, #D4E6EA 50%, #E8F1F5 100%)',
              backdropFilter: 'blur(10px)',
              borderRight: '1px solid rgba(179, 204, 212, 0.3)',
              boxShadow: '0 8px 32px rgba(179, 204, 212, 0.25), 0 2px 8px rgba(179, 204, 212, 0.15)',
            },
          }}
        >
          <Box sx={{ position: 'relative', height: '100%' }}>
            {/* Close button for mobile */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
              <IconButton onClick={handleDrawerToggle} sx={{ color: '#354766' }}>
                <CloseIcon />
              </IconButton>
            </Box>
            <SidebarContent onItemClick={handleDrawerToggle} />
          </Box>
        </Drawer>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
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
          <SidebarContent />
        </Box>
      )}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          position: 'relative',
          overflowY: 'auto', // Cho phép cuộn dọc
          overflowX: 'hidden', // Ngăn cuộn ngang
          p: isMobile ? 1 : 3,
          mt: isMobile ? '64px' : 0, // Account for mobile app bar
          height: isMobile ? 'calc(100vh - 64px)' : '100vh', // Đặt chiều cao cố định
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
              radial-gradient(circle at 20% 20%, rgba(179, 204, 212, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(179, 204, 212, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(179, 204, 212, 0.08) 0%, transparent 50%)
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
            p: isMobile ? 2 : 3,
            // Loại bỏ minHeight cố định để cho phép nội dung mở rộng tự nhiên
          }}
        >
          {renderCurrentPage()}
        </Box>
      </Box>
    </Box>
  );
};

export default StaffLayout;
