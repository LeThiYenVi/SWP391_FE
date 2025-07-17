import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import { useWebSocket } from '../context/WebSocketContext';
import { useAuth } from '../context/AuthContext';

const WebSocketDemo = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    connected, 
    notifications, 
    subscribeToBooking, 
    unsubscribeFromBooking, 
    sendMessage,
    clearNotifications 
  } = useWebSocket();
  
  const [bookingId, setBookingId] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [subscribedBookings, setSubscribedBookings] = useState(new Set());

  const handleSubscribeBooking = () => {
    if (bookingId && !subscribedBookings.has(bookingId)) {
      subscribeToBooking(bookingId, (update) => {
        console.log('Received update for booking:', bookingId, update);
      });
      setSubscribedBookings(prev => new Set([...prev, bookingId]));
      setBookingId('');
    }
  };

  const handleUnsubscribeBooking = (id) => {
    unsubscribeFromBooking(id);
    setSubscribedBookings(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleSendTestMessage = () => {
    if (testMessage) {
      const message = {
        bookingId: 1,
        status: 'TESTING',
        message: testMessage,
        timestamp: new Date().toISOString()
      };
      sendMessage('/app/booking-status-update', message);
      setTestMessage('');
    }
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

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Vui lòng đăng nhập để sử dụng WebSocket Demo
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        WebSocket Demo
      </Typography>

      {/* Connection Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Trạng thái kết nối
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={connected ? 'Đã kết nối' : 'Chưa kết nối'} 
              color={connected ? 'success' : 'error'} 
            />
            <Typography variant="body2">
              User: {user?.fullName} ({user?.role})
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        {/* Left Column - Controls */}
        <Box>
          {/* Subscribe to Booking */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Subscribe to Booking
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Booking ID"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  size="small"
                  type="number"
                />
                <Button 
                  variant="contained" 
                  onClick={handleSubscribeBooking}
                  disabled={!connected || !bookingId}
                >
                  Subscribe
                </Button>
              </Box>
              
              {/* Subscribed Bookings */}
              {subscribedBookings.size > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Đang theo dõi:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {Array.from(subscribedBookings).map(id => (
                      <Chip
                        key={id}
                        label={`Booking #${id}`}
                        onDelete={() => handleUnsubscribeBooking(id)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Send Test Message */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gửi tin nhắn test
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Test Message"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  size="small"
                  fullWidth
                />
                <Button 
                  variant="contained" 
                  onClick={handleSendTestMessage}
                  disabled={!connected || !testMessage}
                >
                  Send
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Right Column - Notifications */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Thông báo ({notifications.length})
              </Typography>
              <Button 
                size="small" 
                onClick={clearNotifications}
                disabled={notifications.length === 0}
              >
                Xóa tất cả
              </Button>
            </Box>
            
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {notifications.length === 0 ? (
                <ListItem>
                  <ListItemText 
                    primary="Chưa có thông báo"
                    secondary="Thông báo sẽ hiển thị ở đây khi có cập nhật"
                  />
                </ListItem>
              ) : (
                notifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2">
                              Booking #{notification.bookingId}
                            </Typography>
                            {notification.status && (
                              <Chip
                                label={notification.status}
                                color={getStatusColor(notification.status)}
                                size="small"
                              />
                            )}
                            {notification.isPrivate && (
                              <Chip
                                label="Private"
                                color="secondary"
                                size="small"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(notification.timestamp).toLocaleString('vi-VN')}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              )}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default WebSocketDemo;
