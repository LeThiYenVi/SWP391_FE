import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import { routes } from '../routes';

const Unauthorized = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          403
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Không có quyền truy cập
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là lỗi.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            component={Link}
            to={routes.landing}
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
          >
            Về trang chủ
          </Button>
          <Button
            component={Link}
            to={routes.login}
            variant="outlined"
            color="primary"
          >
            Đăng nhập lại
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Unauthorized; 