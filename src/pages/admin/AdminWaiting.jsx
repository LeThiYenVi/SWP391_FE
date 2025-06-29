import React, { useEffect } from 'react';
import Sidebar from '../../components/admin/AdminSidebar';
import Header from '../../components/admin/AdminHeader';
import { Box, Typography,  } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import WaitingTable from '../../components/admin/WaitingTable';

export default function AdminWaiting() {
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

        <Box sx={{ lexGrow: 1,
              bgcolor: '#f5f5f5',
              p: 2,
              overflowY: 'auto', }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 2, mt:2 }}>
            <Typography variant='h4' sx={{ fontWeight: 500 }}>
              Sản phẩm chờ
            </Typography>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: '#f5f5f5',
              p: 2,
              overflowY: 'auto',
            }}
          >
            <WaitingTable />
          </Box>

        </Box>
      </Box>
    </Box>
  );
}
