# Calendar với Màu sắc Đẹp - Hướng dẫn sử dụng

## 🎨 Tổng quan

Calendar đã được cải thiện với màu sắc đẹp từ ảnh 2, giúp user hiểu rõ hơn về các giai đoạn chu kỳ kinh nguyệt.

## 🌈 Màu sắc và Ý nghĩa

### 1. **🩸 Kỳ kinh (Period)**
- **Màu**: Hồng nhạt gradient (#ff9a9e → #fecfef)
- **Ý nghĩa**: Giai đoạn kinh nguyệt thực tế
- **Icon**: 🩸
- **Tooltip**: "Kỳ kinh - Giai đoạn kinh nguyệt"

### 2. **⭐ Rụng trứng (Ovulation)**
- **Màu**: Xanh lá gradient (#a8edea → #fed6e3)
- **Ý nghĩa**: Ngày có khả năng thụ thai cao nhất
- **Icon**: ⭐ (có animation twinkle)
- **Tooltip**: "Rụng trứng - Ngày có khả năng thụ thai cao nhất"

### 3. **🌸 Thời kỳ màu mỡ (Fertile)**
- **Màu**: Cam nhạt gradient (#ffecd2 → #fcb69f)
- **Ý nghĩa**: Khoảng thời gian có khả năng thụ thai
- **Icon**: 🌸
- **Tooltip**: "Thời kỳ màu mỡ - Có khả năng thụ thai"

### 4. **📅 Kỳ kinh dự đoán (Predicted Period)**
- **Màu**: Hồng đậm gradient (#fce4ec → #f8bbd9)
- **Ý nghĩa**: Dự đoán dựa trên chu kỳ trước
- **Icon**: 📅
- **Tooltip**: "Kỳ kinh dự đoán - Dựa trên chu kỳ trước"

## ✨ Tính năng mới

### 1. **Tooltip thông minh**
- Hover vào bất kỳ ngày nào để xem thông tin chi tiết
- Hiển thị emoji và mô tả rõ ràng
- Responsive trên mobile

### 2. **Animation mượt mà**
- Hiệu ứng hover với gradient shine
- Animation pulse cho ngày rụng trứng
- Fade-in animation cho các card

### 3. **Help tooltip**
- Icon "?" bên cạnh các tiêu đề
- Hover để xem giải thích chi tiết
- Hỗ trợ user hiểu rõ hơn

### 4. **Responsive design**
- Tương thích với mọi thiết bị
- Layout tự động điều chỉnh
- Font size phù hợp với màn hình

## 🎯 Cách sử dụng

### 1. **Xem calendar**
- Calendar hiển thị tháng hiện tại
- Sử dụng nút mũi tên để chuyển tháng
- Các ngày được màu sắc theo giai đoạn

### 2. **Hiểu màu sắc**
- Xem legend ở dưới calendar
- Hover vào legend để xem giải thích
- Tooltip hiển thị khi hover vào ngày

### 3. **Ghi nhận thông tin**
- Click vào ngày để mở modal
- Thêm triệu chứng, tâm trạng, ghi chú
- Bắt đầu kỳ kinh với nút "Bắt đầu kỳ kinh"

### 4. **Xem thông tin chu kỳ**
- Overview cards hiển thị thông tin tổng quan
- Sidebar có thông tin chi tiết về các giai đoạn
- Help tooltip giải thích mọi thứ

## 🎨 Thiết kế màu sắc

### Gradient chính
```css
/* Header gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Card gradient */
background: linear-gradient(135deg, #f8f9ff, #e8ecff);

/* Button gradient */
background: linear-gradient(135deg, #ff6b6b, #ee5a24);
```

### Màu sắc giai đoạn
```css
/* Period */
background: linear-gradient(135deg, #ff9a9e, #fecfef);

/* Ovulation */
background: linear-gradient(135deg, #a8edea, #fed6e3);

/* Fertile */
background: linear-gradient(135deg, #ffecd2, #fcb69f);

/* Predicted */
background: linear-gradient(135deg, #fce4ec, #f8bbd9);
```

## 📱 Responsive

### Desktop (>1024px)
- Grid 2 cột: Calendar + Sidebar
- Overview cards 4 cột
- Full tooltip và animation

### Tablet (768px-1024px)
- Grid 1 cột
- Overview cards tự động điều chỉnh
- Tooltip rút gọn

### Mobile (<768px)
- Layout dọc
- Font size nhỏ hơn
- Touch-friendly buttons

## 🚀 Cách chạy demo

1. Import component:
```jsx
import CalendarDemo from './CalendarDemo';
```

2. Sử dụng trong route:
```jsx
<Route path="/calendar-demo" element={<CalendarDemo />} />
```

3. Hoặc thay thế component hiện tại:
```jsx
// Thay thế ModernCycleTracking bằng CalendarDemo
import CalendarDemo from './CalendarDemo';
```

## 💡 Tips cho user

1. **Hover để học**: Hover vào mọi thứ để xem tooltip
2. **Click để tương tác**: Click vào ngày để thêm thông tin
3. **Xem legend**: Luôn xem legend để hiểu màu sắc
4. **Sử dụng help**: Icon "?" giúp giải thích mọi thứ
5. **Responsive**: Calendar hoạt động tốt trên mọi thiết bị

## 🎯 Mục tiêu đạt được

✅ **Màu sắc đẹp**: Sử dụng gradient và màu sắc từ ảnh 2
✅ **User hiểu rõ**: Tooltip và help text giải thích mọi thứ
✅ **Animation mượt**: Hiệu ứng đẹp mắt và chuyên nghiệp
✅ **Responsive**: Hoạt động tốt trên mọi thiết bị
✅ **Accessibility**: Hỗ trợ user hiểu và sử dụng dễ dàng 