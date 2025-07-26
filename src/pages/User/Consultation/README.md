# Giao Diện Tư Vấn Trực Tuyến - Cải Tiến

## 🎯 Tổng Quan

Giao diện tư vấn trực tuyến đã được cải tiến để giống với booking system, hiển thị timeslot dạng grid thay vì dropdown, tạo trải nghiệm người dùng tốt hơn và đồng nhất.

## ✨ Tính Năng Mới

### 1. **Timeslot Grid Display**
- Hiển thị timeslot dạng grid cards thay vì dropdown
- Mỗi slot hiển thị thời gian và trạng thái "Còn trống"
- Visual feedback khi chọn slot (border màu, background)
- Responsive design cho mobile

### 2. **Date Selection**
- Chọn ngày từ 14 ngày tới
- Hiển thị tên ngày trong tuần (Thứ 2, Thứ 3...)
- Đánh dấu "Hôm nay" cho ngày hiện tại
- Button style thay vì date picker

### 3. **Improved UI/UX**
- Modern gradient design
- Smooth animations và transitions
- Better visual hierarchy
- Consistent với booking system

## 🎨 Giao Diện

### Consultant Cards
```
┌─────────────────────────────────┐
│  [Avatar] Bác sĩ Nguyễn Thị Hương │
│  [Chip] Sản Phụ khoa            │
│  ⭐⭐⭐⭐⭐ 4.5 • 650 buổi tư vấn   │
│  💼 Kinh nghiệm: 10+ năm        │
│  👤 Chuyên môn: Sản Phụ khoa    │
│                                 │
│  [Đặt lịch tư vấn]             │
└─────────────────────────────────┘
```

### Booking Dialog
```
┌─────────────────────────────────┐
│  Đặt lịch tư vấn          [×]  │
├─────────────────────────────────┤
│  [Avatar] Bác sĩ Nguyễn Thị Hương │
│  Sản Phụ khoa                    │
├─────────────────────────────────┤
│  Chọn ngày:                     │
│  [Thứ 2] [Thứ 3] [Thứ 4] ...    │
│  15/01   16/01   17/01          │
│  Hôm nay                        │
├─────────────────────────────────┤
│  Chọn giờ:                      │
│  ✅ Có 7 slot trống cho ngày 15/01 │
│                                 │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │
│  │08:00│ │09:00│ │10:00│ │14:00│ │
│  │Còn  │ │Còn  │ │Còn  │ │Còn  │ │
│  │trống│ │trống│ │trống│ │trống│ │
│  └─────┘ └─────┘ └─────┘ └─────┘ │
│                                 │
│  ┌─────┐ ┌─────┐ ┌─────┐        │
│  │15:00│ │16:00│ │17:00│        │
│  │Còn  │ │Còn  │ │Còn  │        │
│  │trống│ │trống│ │trống│        │
│  └─────┘ └─────┘ └─────┘        │
├─────────────────────────────────┤
│  Hình thức: [Tư vấn trực tuyến ▼] │
│  Ghi chú: [___________________] │
├─────────────────────────────────┤
│  [Hủy]        [Xác nhận đặt lịch] │
└─────────────────────────────────┘
```

## 🔧 Cách Sử Dụng

### 1. **Chọn Tư Vấn Viên**
- Xem thông tin tư vấn viên (tên, chuyên môn, kinh nghiệm)
- Click "Đặt lịch tư vấn" để mở dialog

### 2. **Chọn Ngày**
- Chọn từ 14 ngày tới
- Ngày được chọn sẽ highlight màu xanh
- "Hôm nay" được đánh dấu đặc biệt

### 3. **Chọn Giờ**
- Timeslot hiển thị dạng grid cards
- Click vào slot để chọn
- Slot được chọn sẽ có border xanh và background xanh nhạt
- Hiển thị "✓ Đã chọn" khi chọn

### 4. **Hoàn Tất Đặt Lịch**
- Chọn hình thức tư vấn (trực tuyến/trực tiếp)
- Điền ghi chú (tùy chọn)
- Click "Xác nhận đặt lịch"

## 📱 Responsive Design

### Desktop (≥1200px)
- 3 consultant cards per row
- 4 timeslot cards per row
- Full dialog width

### Tablet (768px - 1199px)
- 2 consultant cards per row
- 3 timeslot cards per row
- Medium dialog width

### Mobile (<768px)
- 1 consultant card per row
- 2 timeslot cards per row
- Compact dialog width
- Stacked date buttons

## 🎨 CSS Classes

### Main Components
```css
.consultation-page          /* Main container */
.page-header               /* Header section */
.consultants-grid          /* Grid for consultant cards */
.consultant-card           /* Individual consultant card */
.consultant-avatar         /* Consultant avatar */
```

### Dialog Components
```css
.booking-dialog            /* Booking dialog */
.consultant-summary        /* Selected consultant info */
.date-selection           /* Date selection section */
.time-slot-grid           /* Timeslot grid */
.time-slot-item           /* Individual timeslot */
```

### States
```css
.time-slot-item.selected   /* Selected timeslot */
.date-button.selected      /* Selected date */
.loading-container         /* Loading state */
```

## 🔄 API Integration

### Required APIs
```javascript
// Get consultant availability
GET /api/consultation/consultant/{consultantId}/availability?date={date}

// Book consultation
POST /api/consultation/book
{
  consultantId: number,
  startTime: string, // ISO datetime
  endTime: string,   // ISO datetime
  consultationType: string,
  notes: string
}
```

### Response Format
```javascript
// Availability response
[
  {
    startTime: "08:00",
    endTime: "09:00"
  },
  {
    startTime: "09:00", 
    endTime: "10:00"
  }
]
```

## 🚀 Demo

Để test giao diện mới, sử dụng file `ConsultationDemo.jsx`:

```javascript
import ConsultationDemo from './ConsultationDemo';

// Trong component
<ConsultationDemo />
```

File demo sử dụng mock data để test UI mà không cần backend.

## 📋 Checklist

### ✅ Đã Hoàn Thành
- [x] Timeslot grid display
- [x] Date selection buttons
- [x] Modern UI design
- [x] Responsive layout
- [x] Loading states
- [x] Error handling
- [x] Demo component
- [x] CSS styling

### 🔄 Cần Cải Thiện
- [ ] Add more animations
- [ ] Optimize performance
- [ ] Add accessibility features
- [ ] Unit tests
- [ ] Integration tests

## 🎯 Kết Quả

Giao diện consultation giờ đây:
- ✅ Đồng bộ với booking system
- ✅ Hiển thị timeslot dạng grid đẹp mắt
- ✅ UX/UI hiện đại và responsive
- ✅ Dễ sử dụng trên mọi thiết bị
- ✅ Loading states và error handling
- ✅ Consistent design language 