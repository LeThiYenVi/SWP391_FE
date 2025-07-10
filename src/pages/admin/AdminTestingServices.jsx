import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from '../../components/admin/AdminSidebar';
import Header from '../../components/admin/AdminHeader';
import { Box, Typography, InputBase } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import TestingTable from '../../components/admin/TestingTable';

export default function AdminTestingServices() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
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

        <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 2, overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 2, mt:2 }}>
            <Typography variant='h3' sx={{ fontWeight: 500 , color: 'gray' }}>
              Dịch vụ xét nghiệm
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: 300,
                bgcolor: 'white',
                borderRadius: '999px',
                px: 2,
                py: '6px',
                boxShadow: '0 0 0 1px #ccc',
              }}
            >
              <SearchIcon sx={{ color: 'gray', mr: 1 }} />
              <InputBase
                placeholder="Tên dịch vụ xét nghiệm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  flex: 1,
                  color: 'gray',
                  fontSize: 16,
                  '& .MuiInputBase-input': {
                    p: 0,
                  },
                  '&:focus-within': {
                    outline: 'none',
                  },
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: '#f5f5f5',
              p: 2,
              overflowY: 'auto',
            }}
          >
            <TestingTable searchTerm={searchTerm}/>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}
