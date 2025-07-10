import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Sidebar from '../../components/admin/AdminSidebar';
import Header from '../../components/admin/AdminHeader';
import { Box, Typography, InputBase, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import ContentTable from '../../components/admin/ContentTable';

export default function AdminContentManagement() {
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

        <Box sx={{ 
          flexGrow: 1,
          bgcolor: '#f5f5f5',
          p: 2,
          overflowY: 'auto' 
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            px: 2, 
            mb: 2, 
            mt: 2 
          }}>
            <Typography variant='h3' sx={{ fontWeight: 500, color: 'gray' }}>
              Quản lý nội dung
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {/* Search Box */}
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
                  placeholder="Tìm kiếm nội dung..."
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

              {/* Add New Button */}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: '#4CAF50',
                  color: 'white',
                  borderRadius: '8px',
                  px: 3,
                  py: 1,
                  '&:hover': {
                    bgcolor: '#45a049',
                  },
                }}
              >
                Thêm mới
              </Button>
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
            <ContentTable searchTerm={searchTerm} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
