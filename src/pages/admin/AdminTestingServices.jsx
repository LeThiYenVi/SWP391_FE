import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import Sidebar from '../../components/admin/AdminSidebar';
import Header from '../../components/admin/AdminHeader';
import { Box, Typography, InputBase, Button, Tooltip } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import TestingTable from '../../components/admin/TestingTable';

export default function AdminTestingServices() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast.success('Đã làm mới dữ liệu!');
  };

  const handleAddNew = () => {
    toast.info('Tính năng thêm dịch vụ mới sẽ được phát triển!');
  };

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

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Search box */}
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

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Thêm dịch vụ mới">
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddNew}
                    sx={{
                      bgcolor: '#4CAF50',
                      color: 'white',
                      borderRadius: '20px',
                      px: 3,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                      '&:hover': {
                        bgcolor: '#45a049',
                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                      }
                    }}
                  >
                    Thêm mới
                  </Button>
                </Tooltip>

                <Tooltip title="Làm mới dữ liệu">
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleRefresh}
                    sx={{
                      borderColor: '#2196F3',
                      color: '#2196F3',
                      borderRadius: '20px',
                      px: 3,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#1976D2',
                        bgcolor: 'rgba(33, 150, 243, 0.04)',
                      }
                    }}
                  >
                    Làm mới
                  </Button>
                </Tooltip>
              </Box>
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
            <TestingTable searchTerm={searchTerm} refreshKey={refreshKey} />
          </Box>

        </Box>
      </Box>
    </Box>
  );
}
