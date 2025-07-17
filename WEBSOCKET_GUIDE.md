# WebSocket Integration Guide

## 🚀 Tổng quan

Hệ thống WebSocket đã được tích hợp để tự động kết nối khi user đăng nhập và subscribe các topic phù hợp theo role.

## 📡 Cách hoạt động

### 1. **Tự động kết nối khi đăng nhập**
```jsx
// Trong WebSocketContext.jsx
useEffect(() => {
  if (isAuthenticated && user && !connected) {
    connectWebSocket(); // Tự động kết nối
  } else if (!isAuthenticated && connected) {
    disconnectWebSocket(); // Tự động ngắt kết nối khi logout
  }
}, [isAuthenticated, user]);
```

### 2. **Subscribe theo role**
- **Customer**: Subscribe `/topic/booking-updates` và `/user/{userId}/queue/booking-updates`
- **Staff/Admin**: Subscribe `/topic/staff/booking-updates` và `/topic/booking-updates`

### 3. **Thông báo real-time**
- Hiển thị toast notifications
- Lưu trữ trong notifications state
- Hiển thị qua NotificationBell component

## 🔧 Cách sử dụng

### 1. **Trong component**
```jsx
import { useWebSocket } from '../context/WebSocketContext';

const MyComponent = () => {
  const { connected, notifications, subscribeToBooking } = useWebSocket();
  
  // Subscribe to specific booking
  useEffect(() => {
    if (connected && bookingId) {
      const subscription = subscribeToBooking(bookingId, (update) => {
        console.log('Booking update:', update);
      });
      
      return () => unsubscribeFromBooking(bookingId);
    }
  }, [connected, bookingId]);
};
```

### 2. **Sử dụng hook tương thích**
```jsx
import { useBookingTracking } from '../hooks/useBookingTracking';

const TrackingComponent = () => {
  const { connected, subscribeBooking, unsubscribeBooking } = useBookingTracking();
  
  // Tương thích với code cũ
  useEffect(() => {
    if (connected) {
      subscribeBooking(bookingId, handleUpdate);
    }
    return () => unsubscribeBooking(bookingId);
  }, [connected, bookingId]);
};
```

### 3. **Thêm NotificationBell vào header**
```jsx
import NotificationBell from '../components/NotificationBell';

const Header = () => {
  return (
    <Box>
      {/* Other header content */}
      <NotificationBell />
      {/* User menu */}
    </Box>
  );
};
```

## 📋 WebSocket Topics

### Backend Topics:
- `/topic/booking-updates` - Tất cả booking updates
- `/topic/booking-updates/{bookingId}` - Updates cho booking cụ thể
- `/topic/staff/booking-updates` - Updates cho staff
- `/user/{userId}/queue/booking-updates` - Private messages cho user

### Frontend Subscriptions:
- **Customer**: General + Private queue
- **Staff/Admin**: Staff + General topics

## 🎯 Khi nào WebSocket được trigger:

1. **Tạo booking mới** → `notifyNewBooking()`
2. **Cập nhật trạng thái** → `notifyBookingStatusChange()`
3. **Hủy booking** → `notifyBookingStatusChange()`
4. **Lấy mẫu** → `notifySampleCollected()`
5. **Kết quả sẵn sàng** → `notifyTestResultReady()`
6. **Hoàn thành** → `notifyBookingCompleted()`

## 🔄 Luồng hoạt động:

```
User Login → WebSocket Connect → Subscribe Topics → Receive Updates → Show Notifications
     ↓              ↓                    ↓               ↓                ↓
AuthContext → WebSocketContext → Role-based → Toast + Bell → User sees update
```

## 🛠️ Components đã tích hợp:

1. **WebSocketContext** - Quản lý connection và subscriptions
2. **NotificationBell** - Hiển thị thông báo trong header
3. **useBookingTracking** - Hook tương thích với code cũ
4. **AdminHeader** - Đã thêm NotificationBell
5. **TrackingPage** - Đã cập nhật sử dụng WebSocket context

## 🧪 Testing:

1. **WebSocketDemo page** - `/websocket-demo` để test các chức năng
2. **Browser DevTools** - Xem WebSocket connections trong Network tab
3. **Backend logs** - Theo dõi subscription và message sending

## 📱 Notifications:

- **Toast notifications** - Hiển thị ngay khi có update
- **Bell notifications** - Lưu trữ và hiển thị trong dropdown
- **Real-time updates** - Cập nhật UI ngay lập tức
- **Role-based filtering** - Chỉ nhận notifications phù hợp với role

## 🔒 Security:

- WebSocket chỉ kết nối khi user đã authenticated
- Private messages chỉ gửi tới user cụ thể
- Role-based topic subscriptions
- Tự động disconnect khi logout

## 🚨 Troubleshooting:

1. **Không kết nối được**: Kiểm tra user đã login chưa
2. **Không nhận notifications**: Kiểm tra role và topic subscriptions
3. **Connection drops**: WebSocket sẽ tự động reconnect
4. **Performance**: Notifications được giới hạn tối đa 50 items

## 📝 Migration từ code cũ:

Code cũ vẫn hoạt động nhờ `useBookingTracking` hook, nhưng nên migrate sang `useWebSocket` để có đầy đủ tính năng.

```jsx
// Cũ
import BookingTrackingService from '../services/BookingTrackingService';

// Mới  
import { useWebSocket } from '../context/WebSocketContext';
```
