import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Chip,
  Button
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsNone as NotificationsNoneIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import { useWebSocket } from '../hooks/useWebSocketCompat';

const NotificationBell = () => {
  const { connected, notifications, markAsRead, clearNotifications } = useWebSocket();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return time.toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'success';
      case 'CANCELLED': return 'error';
      case 'COMPLETED': return 'primary';
      case 'SAMPLE_COLLECTED': return 'info';
      case 'TESTING': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'CANCELLED': return 'Đã hủy';
      case 'COMPLETED': return 'Hoàn thành';
      case 'SAMPLE_COLLECTED': return 'Đã lấy mẫu';
      case 'TESTING': return 'Đang xét nghiệm';
      case 'PENDING': return 'Chờ xử lý';
      default: return status;
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: connected ? 'inherit' : 'text.disabled',
          position: 'relative'
        }}
        disabled={!connected}
      >
        <Badge badgeContent={unreadCount} color="error" max={99}>
          {connected ? <NotificationsIcon /> : <NotificationsNoneIcon />}
        </Badge>
        {connected && (
          <CircleIcon
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              fontSize: 8,
              color: 'success.main'
            }}
          />
        )}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            overflow: 'auto'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Thông báo ({unreadCount})
          </Typography>
          {notifications.length > 0 && (
            <Button
              size="small"
              onClick={() => {
                clearNotifications();
                handleClose();
              }}
            >
              Xóa tất cả
            </Button>
          )}
        </Box>

        <Divider />

        {!connected && (
          <MenuItem disabled>
            <Typography color="text.secondary">
              Chưa kết nối WebSocket
            </Typography>
          </MenuItem>
        )}

        {connected && notifications.length === 0 && (
          <MenuItem disabled>
            <Typography color="text.secondary">
              Không có thông báo mới
            </Typography>
          </MenuItem>
        )}

        {notifications.map((notification, index) => (
          <MenuItem
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            sx={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              py: 1.5,
              borderLeft: notification.read ? 'none' : '3px solid',
              borderLeftColor: 'primary.main',
              bgcolor: notification.read ? 'inherit' : 'action.hover'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                Booking #{notification.bookingId}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatTime(notification.timestamp)}
              </Typography>
            </Box>

            {notification.status && (
              <Chip
                label={getStatusText(notification.status)}
                color={getStatusColor(notification.status)}
                size="small"
                sx={{ mb: 0.5 }}
              />
            )}

            <Typography variant="body2" color="text.secondary">
              {notification.message}
            </Typography>

            {notification.customerName && (
              <Typography variant="caption" color="text.secondary">
                Khách hàng: {notification.customerName}
              </Typography>
            )}

            {notification.serviceName && (
              <Typography variant="caption" color="text.secondary">
                Dịch vụ: {notification.serviceName}
              </Typography>
            )}

            {notification.isPrivate && (
              <Chip
                label="Riêng tư"
                color="secondary"
                size="small"
                sx={{ mt: 0.5 }}
              />
            )}

            {index < notifications.length - 1 && <Divider sx={{ width: '100%', mt: 1 }} />}
          </MenuItem>
        ))}

        {notifications.length > 10 && (
          <>
            <Divider />
            <MenuItem onClick={handleClose}>
              <Typography variant="body2" color="primary" sx={{ textAlign: 'center', width: '100%' }}>
                Xem tất cả thông báo
              </Typography>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
