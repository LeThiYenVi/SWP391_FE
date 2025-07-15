import React from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import { getAppVersion, clearCache, forceReload } from '../../utils/cacheUtils';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

const AdminSystemInfo = () => {
  const appVersion = getAppVersion();
  const buildTime = import.meta.env.DEV ? 'Development' : 'Production';

  const handleClearCache = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ cache? Trang sẽ được reload.')) {
      clearCache();
    }
  };

  const handleForceReload = () => {
    forceReload();
  };

  return (
    <Box sx={{ 
      p: 2, 
      bgcolor: '#f8f9fa', 
      borderRadius: 1, 
      border: '1px solid #e9ecef',
      mb: 2 
    }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#495057' }}>
        🔧 Thông tin hệ thống
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Chip 
          label={`Version: ${appVersion}`} 
          color="primary" 
          variant="outlined" 
        />
        <Chip 
          label={`Build: ${buildTime}`} 
          color={import.meta.env.DEV ? 'warning' : 'success'} 
          variant="outlined" 
        />
        <Chip 
          label={`Vite: ${import.meta.env.VITE ? 'Active' : 'Inactive'}`} 
          color="info" 
          variant="outlined" 
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<DeleteSweepIcon />}
          onClick={handleClearCache}
          sx={{ textTransform: 'none' }}
        >
          Clear Cache
        </Button>
        
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={handleForceReload}
          sx={{ textTransform: 'none' }}
        >
          Force Reload
        </Button>
      </Box>

      <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#6c757d' }}>
        💡 Cache sẽ tự động clear khi có version mới. 
        {import.meta.env.DEV && ' Development mode: Cache busting tự động bật.'}
      </Typography>
    </Box>
  );
};

export default AdminSystemInfo;
