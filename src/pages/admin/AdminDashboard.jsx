import React, { useEffect } from 'react';
import Sidebar from '../../components/admin/AdminSidebar';
import Header from '../../components/admin/AdminHeader';
import AdminSystemInfo from '../../components/admin/AdminSystemInfo';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Dashboard from '../../components/admin/Dashboard';

export default function AdminDashboard() {
const location = useLocation();
  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexShrink: 0, minHeight: 64 }}>
          <Header />
        </Box>

        <Box sx={{
          flexGrow: 1,
          background: 'linear-gradient(135deg, #B3CCD4 0%, #E8F1F5 50%, #F0F8FF 100%)',
          p: 3,
          overflowY: 'auto',
          position: 'relative',
          minHeight: 'calc(100vh - 72px)',
          '&::before': {
            content: '""',
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
          }
        }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              mb: 4,
              mt: 2,
              position: 'relative',
              zIndex: 1
            }}
          >
            <Typography
              variant='h3'
              sx={{
                fontWeight: 800,
                color: '#354766',
                fontSize: '2.2rem',
                textShadow: '0 1px 2px rgba(179, 204, 212, 0.3)'
              }}
            >
              Thống kê
            </Typography>
          </Box>

          <Box sx={{ position: 'relative', zIndex: 1, mb: 4 }}>
            <AdminSystemInfo />
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              position: 'relative',
              zIndex: 1,
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(179, 204, 212, 0.25), 0 2px 8px rgba(179, 204, 212, 0.15)',
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(179, 204, 212, 0.3)',
              p: 3
            }}
          >
            <Dashboard />
          </Box>

        </Box>
      </Box>
    </Box>
  );
}
