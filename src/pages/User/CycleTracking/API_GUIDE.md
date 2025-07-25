# API Guide - Menstrual Cycle Tracking

## Tổng quan

Đã tạo các API mới để hỗ trợ tính năng click vào ô lịch và ghi nhận nhanh trong calendar tracking.

## Backend APIs

### 1. Get Day Log
```
GET /api/menstrual-cycle/day-log/{date}
```
**Mô tả:** Lấy thông tin log của một ngày cụ thể
**Response:**
```json
{
  "success": true,
  "message": "Thành công",
  "data": {
    "date": "2025-01-15",
    "isPeriodDay": false,
    "intensity": "LIGHT",
    "symptoms": "Đau bụng nhẹ",
    "mood": "Bình thường",
    "notes": "Ghi chú cá nhân",
    "phase": "PERIOD"
  }
}
```

### 2. Update Day Log
```
POST /api/menstrual-cycle/update-day-log
```
**Mô tả:** Cập nhật thông tin log cho một ngày
**Request Body:**
```json
{
  "date": "2025-01-15",
  "isPeriodDay": true,
  "intensity": "MEDIUM",
  "symptoms": "Đau bụng, mệt mỏi",
  "mood": "Khó chịu",
  "notes": "Cần nghỉ ngơi nhiều hơn"
}
```

### 3. Quick Log
```
POST /api/menstrual-cycle/quick-log
```
**Mô tả:** Ghi nhận nhanh một loại thông tin
**Request Body:**
```json
{
  "date": "2025-01-15",
  "type": "SYMPTOMS", // SYMPTOMS, MOOD, NOTES
  "content": "Đau đầu, chóng mặt"
}
```

## Frontend Components

### 1. ModernCycleTracking (modern.jsx)
Component chính với đầy đủ tính năng:
- Click vào ô lịch → Mở modal cập nhật log
- Các nút ghi nhận nhanh hoạt động
- Tích hợp với API backend

### 2. InteractiveDemo (InteractiveDemo.jsx)
Component demo để test API:
- Có thể test offline với demo data
- Hiển thị logs đã tạo
- Fallback khi API không khả dụng

## Cách sử dụng

### 1. Click vào ô lịch
```javascript
const handleDayClick = async (day) => {
  const dayStr = day.format('YYYY-MM-DD');
  setSelectedDate(day);
  
  try {
    const response = await MenstrualCycleService.getDayLog(dayStr);
    if (response.success) {
      setDayLog(response.data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
  
  setIsModalVisible(true);
};
```

### 2. Cập nhật log ngày
```javascript
const handleUpdateDayLog = async () => {
  const logData = {
    date: selectedDate.format('YYYY-MM-DD'),
    isPeriodDay: dayLog.isPeriodDay,
    intensity: dayLog.intensity,
    symptoms: dayLog.symptoms,
    mood: dayLog.mood,
    notes: dayLog.notes
  };

  try {
    const response = await MenstrualCycleService.updateDayLog(logData);
    if (response.success) {
      message.success('Cập nhật thành công');
    }
  } catch (error) {
    message.error('Lỗi khi cập nhật');
  }
};
```

### 3. Ghi nhận nhanh
```javascript
const handleQuickLog = (type) => {
  setQuickLogType(type);
  setQuickLogModal(true);
};

const handleSubmitQuickLog = async () => {
  const logData = {
    date: dayjs().format('YYYY-MM-DD'),
    type: quickLogType,
    content: quickLogContent
  };

  try {
    const response = await MenstrualCycleService.quickLog(logData);
    if (response.success) {
      message.success('Ghi nhận thành công');
    }
  } catch (error) {
    message.error('Lỗi khi ghi nhận');
  }
};
```

## Service Methods

### MenstrualCycleService.js
```javascript
// Get day log
getDayLog: async (date) => {
  const response = await instance.get(`/api/menstrual-cycle/day-log/${date}`);
  return response.data;
},

// Update day log
updateDayLog: async (logData) => {
  const response = await instance.post('/api/menstrual-cycle/update-day-log', logData);
  return response.data;
},

// Quick log
quickLog: async (logData) => {
  const response = await instance.post('/api/menstrual-cycle/quick-log', logData);
  return response.data;
}
```

## Modal Components

### 1. Day Log Modal
- Checkbox "Có phải ngày kinh?"
- Dropdown "Cường độ" (LIGHT, MEDIUM, HEAVY)
- TextArea cho triệu chứng, tâm trạng, ghi chú

### 2. Quick Log Modal
- TextArea cho nội dung
- Tự động set ngày hiện tại
- Validate input trước khi submit

## Error Handling

### Backend
- Validation cho tất cả input
- Exception handling với meaningful messages
- Authentication check

### Frontend
- Try-catch cho tất cả API calls
- Loading states cho UX
- Fallback với demo data khi API fail

## Testing

### 1. API Testing
```bash
# Test get day log
curl -X GET "http://localhost:8080/api/menstrual-cycle/day-log/2025-01-15" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test update day log
curl -X POST "http://localhost:8080/api/menstrual-cycle/update-day-log" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "date": "2025-01-15",
    "isPeriodDay": true,
    "intensity": "MEDIUM",
    "symptoms": "Đau bụng",
    "mood": "Khó chịu",
    "notes": "Test note"
  }'

# Test quick log
curl -X POST "http://localhost:8080/api/menstrual-cycle/quick-log" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "date": "2025-01-15",
    "type": "SYMPTOMS",
    "content": "Đau đầu"
  }'
```

### 2. Frontend Testing
- Sử dụng InteractiveDemo component
- Test offline mode với demo data
- Verify UI interactions

## Notes

1. **Database Integration**: Hiện tại API trả về demo data. Cần tạo MenstrualLog entity để lưu thực tế.

2. **Authentication**: Tất cả API đều yêu cầu authentication token.

3. **Date Format**: Sử dụng ISO date format (YYYY-MM-DD) cho tất cả API calls.

4. **Error Messages**: Tất cả error messages đều bằng tiếng Việt.

5. **Responsive**: UI hoàn toàn responsive và tương thích mobile. 