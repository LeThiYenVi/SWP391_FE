# 🎨 Enhanced Timeslot Picker Component

## 📋 Tổng quan

Component `TimeslotPicker` là một giao diện chọn lịch hẹn hiện đại và hấp dẫn, được thiết kế để thay thế giao diện cũ với trải nghiệm người dùng tốt hơn.

## ✨ Tính năng

### 🗓️ Calendar Features
- **Thiết kế gradient hiện đại** với background đẹp mắt
- **Navigation tháng** với animation mượt mà
- **Hiển thị ngày hôm nay** với border vàng đặc biệt
- **Indicator cho ngày có slot** với dot xanh
- **Hover effects** và transitions mượt mà
- **Responsive design** cho mobile và desktop

### ⏰ Timeslot Features
- **Card-based design** cho mỗi time slot
- **Popular badge** cho slot sắp hết chỗ
- **Location display** cho từng slot
- **Availability counter** hiển thị số chỗ còn lại
- **Selected indicator** với checkmark
- **Staggered animation** khi load slots
- **Loading state** với spinner đẹp

## 🚀 Cách sử dụng

### Basic Usage

```jsx
import TimeslotPicker from '../components/TimeslotPicker';

const MyComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  return (
    <TimeslotPicker
      timeSlots={timeSlots}
      selectedDate={selectedDate}
      selectedTimeSlot={selectedTimeSlot}
      onDateSelect={setSelectedDate}
      onTimeSlotSelect={setSelectedTimeSlot}
      loading={false}
    />
  );
};
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `timeSlots` | `Array` | ✅ | Mảng các time slot |
| `selectedDate` | `String` | ✅ | Ngày được chọn (YYYY-MM-DD) |
| `selectedTimeSlot` | `Object` | ✅ | Time slot được chọn |
| `onDateSelect` | `Function` | ✅ | Callback khi chọn ngày |
| `onTimeSlotSelect` | `Function` | ✅ | Callback khi chọn time slot |
| `loading` | `Boolean` | ❌ | Trạng thái loading (default: false) |
| `className` | `String` | ❌ | CSS class tùy chỉnh |

### TimeSlot Object Structure

```javascript
{
  timeSlotId: 1,
  slotDate: '2024-08-05',
  startTime: '08:00:00',
  endTime: '09:00:00',
  availableSlots: 5,
  location: 'Phòng A1' // Optional
}
```

## 🎨 Customization

### CSS Variables

Component sử dụng CSS custom properties để dễ dàng tùy chỉnh:

```css
.timeslot-picker {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --accent-color: #ff6b6b;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --border-radius: 24px;
  --shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}
```

### Themes

Có thể tùy chỉnh theme bằng cách override CSS:

```css
/* Medical Theme */
.timeslot-picker.medical-theme {
  --primary-gradient: linear-gradient(135deg, #3a99b7, #2d7a91);
  --accent-color: #e53e3e;
}

/* Dark Theme */
.timeslot-picker.dark-theme {
  --primary-gradient: linear-gradient(135deg, #2d3748, #1a202c);
  --text-color: #ffffff;
  --bg-color: #1a202c;
}
```

## 📱 Responsive Design

Component được thiết kế responsive với breakpoints:

- **Desktop**: Grid 7 cột cho calendar, auto-fill cho timeslots
- **Tablet**: Grid 4 cột cho calendar, 2-3 cột cho timeslots  
- **Mobile**: Grid 1 cột, stack layout

## 🔧 Integration với STITesting

Component đã được tích hợp vào trang STITesting:

```jsx
// Trong SWP391_FE/src/pages/User/STITesting/index.jsx
<TimeslotPicker
  timeSlots={timeSlots}
  selectedDate={selectedDate}
  selectedTimeSlot={selectedTimeSlot}
  onDateSelect={setSelectedDate}
  onTimeSlotSelect={setSelectedTimeSlot}
  loading={loadingTimeSlots}
  className="mb-8"
/>
```

## 🧪 Demo

Để xem demo component:

1. Chạy ứng dụng: `npm run dev`
2. Truy cập: `http://localhost:3000/demo/timeslot-picker`

Demo bao gồm:
- Mock data với nhiều time slots
- Toggle loading state
- Selection summary
- Booking simulation

## 🎯 So sánh với giao diện cũ

### Trước (Old UI)
- ❌ Thiết kế đơn điệu, không hấp dẫn
- ❌ Không có animation
- ❌ Layout cứng nhắc
- ❌ Thiếu visual feedback
- ❌ Không responsive tốt

### Sau (New UI)
- ✅ Thiết kế gradient hiện đại
- ✅ Smooth animations và transitions
- ✅ Flexible grid layout
- ✅ Rich visual feedback
- ✅ Fully responsive
- ✅ Better UX với loading states
- ✅ Popular badges và indicators
- ✅ Improved accessibility

## 🔮 Tính năng tương lai

- [ ] Dark mode support
- [ ] Multiple date selection
- [ ] Time range selection
- [ ] Recurring appointments
- [ ] Drag & drop rescheduling
- [ ] Calendar sync integration
- [ ] Accessibility improvements
- [ ] Animation customization
- [ ] Theme presets

## 🐛 Troubleshooting

### Common Issues

1. **Styles không load**: Đảm bảo import CSS file
2. **Animation lag**: Kiểm tra performance, reduce animation complexity
3. **Mobile layout broken**: Kiểm tra responsive breakpoints
4. **Date format issues**: Đảm bảo date format đúng (YYYY-MM-DD)

### Performance Tips

- Sử dụng `React.memo` cho component nếu cần
- Debounce date selection nếu có API calls
- Lazy load months nếu có nhiều data
- Optimize CSS animations với `will-change`

## 📞 Support

Nếu có vấn đề hoặc cần hỗ trợ, vui lòng tạo issue hoặc liên hệ team development.
