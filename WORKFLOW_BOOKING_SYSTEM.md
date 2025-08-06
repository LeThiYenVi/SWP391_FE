# WORKFLOW HỆ THỐNG ĐẶT LỊCH XÉT NGHIỆM - TECHNICAL IMPLEMENTATION

## TỔNG QUAN WORKFLOW
```
Customer đặt lịch → Staff lấy mẫu → Real-time tracking → Staff cập nhật kết quả → Customer xem kết quả
     ↓                    ↓                ↓                      ↓                    ↓
   PENDING          SAMPLE_COLLECTED    WebSocket           COMPLETED           TestResultModal
```

---

## STEP 1: CUSTOMER ĐẶT LỊCH XÉT NGHIỆM

### Frontend Flow:
**Component:** `BookingForm.jsx`
```javascript
// 1.1 Customer chọn service và timeslot
const handleSubmit = async (formData) => {
  const bookingData = {
    serviceId: selectedService.id,
    timeSlotId: selectedTimeSlot.id,
    customerNotes: formData.notes
  };

  // 1.2 API Call
  const response = await BookingService.createBooking(bookingData);
};
```

### API Call:
```
POST /api/bookings
Content-Type: application/json
Body: {
  "serviceId": 123,
  "timeSlotId": 456,
  "customerNotes": "Ghi chú của khách hàng"
}
```

### Backend Processing:
**Controller:** `BookingController.createBooking()`
**Service:** `BookingServiceImpl.createBooking()`
```java
public BookingResponseDTO createBooking(BookingRequestDTO request) {
    // 1.3 Tạo Booking entity
    Booking booking = new Booking();
    booking.setCustomerID(currentUser);
    booking.setService(testingService);
    booking.setTimeSlot(timeSlot);
    booking.setStatus("PENDING");
    booking.setCreatedAt(LocalDateTime.now());

    // 1.4 Lưu vào database
    Booking savedBooking = bookingRepository.save(booking);

    // 1.5 Convert và trả về
    return convertToDto(savedBooking);
}
```

### Data Flow:
```
BookingForm → BookingService → POST /api/bookings → BookingController
→ BookingServiceImpl → BookingRepository → Database (Bookings table)
→ BookingResponseDTO → Frontend (booking created)
```

### Response:
```json
{
  "success": true,
  "data": {
    "bookingId": 789,
    "status": "PENDING",
    "serviceName": "Xét nghiệm STI",
    "bookingDate": "2024-08-05T14:00:00",
    "timeSlot": {
      "slotDate": "2024-08-10",
      "startTime": "09:00:00"
    }
  }
}
```

---

## STEP 2: CUSTOMER TRACKING BOOKING (REAL-TIME)

### Frontend Flow:
**Component:** `TrackingPage.jsx`
```javascript
// 2.1 Load initial booking data
useEffect(() => {
  loadBookingData();
  setupWebSocket();
}, [bookingId]);

const loadBookingData = async () => {
  // 2.2 API Call để lấy thông tin booking
  const response = await TestingService.trackBooking(bookingId);
  setBooking(response.data);
};

const setupWebSocket = () => {
  // 2.3 Setup WebSocket connection
  const { subscribeToBooking } = useWebSocket();

  const unsubscribe = subscribeToBooking(bookingId, (statusUpdate) => {
    // 2.4 Nhận real-time update
    setBooking(prev => ({
      ...prev,
      status: statusUpdate.newStatus,
      doctorName: statusUpdate.doctorName,
      updatedAt: statusUpdate.timestamp
    }));

    // 2.5 Show notification
    toast.info(`Trạng thái cập nhật: ${statusUpdate.statusDisplayName}`);
  });

  return () => unsubscribe();
};
```

### API Call:
```
GET /api/bookings/track/{bookingId}
Response: BookingResponseDTO với status hiện tại
```

### WebSocket Setup:
**Frontend WebSocket Connection:**
```javascript
// WebSocketContext.js
const connectWebSocket = () => {
  const socket = new SockJS('http://localhost:8080/ws');
  const stompClient = Stomp.over(socket);

  stompClient.connect({}, () => {
    console.log('✅ WebSocket connected');
    setConnected(true);
  });
};

// Subscribe to booking updates
const subscribeToBooking = (bookingId, onMessage) => {
  return stompClient.subscribe(`/topic/booking/${bookingId}`, (message) => {
    const statusUpdate = JSON.parse(message.body);
    onMessage(statusUpdate);
  });
};
```

### Data Flow:
```
TrackingPage → TestingService.trackBooking() → GET /api/bookings/track/{id}
→ BookingController.trackBooking() → BookingResponseDTO → Frontend

Parallel:
TrackingPage → WebSocket connect → Subscribe /topic/booking/{id}
→ Ready to receive real-time updates
```

---

## STEP 3: STAFF LẤY MẪU XÉT NGHIỆM

### Frontend Flow:
**Component:** `SampleCollectionForm.jsx`
```javascript
// 3.1 Staff điền thông tin lấy mẫu
const handleSubmit = async (formData) => {
  const sampleData = {
    collectorFullName: formData.collectorFullName,
    collectorIdCard: formData.collectorIdCard,
    collectorPhoneNumber: formData.collectorPhoneNumber,
    collectorDateOfBirth: formData.collectorDateOfBirth,
    collectorGender: formData.collectorGender,
    relationshipToBooker: formData.relationshipToBooker,
    sampleCollectionDate: new Date().toISOString(),
    notes: formData.notes,
    doctorName: formData.doctorName  // Tên bác sĩ phụ trách
  };

  // 3.2 API Call
  const response = await TestingService.markSampleCollectedAPI(bookingId, sampleData);
};
```

### API Call:
```
POST /api/booking/{bookingId}/sample-collected
Content-Type: application/json
Body: {
  "collectorFullName": "Nguyễn Văn A",
  "collectorIdCard": "123456789",
  "collectorPhoneNumber": "0901234567",
  "collectorDateOfBirth": "1990-01-01",
  "collectorGender": "MALE",
  "relationshipToBooker": "SELF",
  "sampleCollectionDate": "2024-08-10T09:15:00",
  "notes": "Lấy mẫu thành công",
  "doctorName": "BS. Nguyễn Văn B"
}
```

### Backend Processing:
**Controller:** `BookingController.collectSample()`
**Service:** `BookingServiceImpl.collectSample()`
```java
public BookingResponseDTO collectSample(Integer bookingId, SampleCollectionRequestDTO request) {
    // 3.3 Tạo SampleCollectionProfile
    SampleCollectionProfile profile = new SampleCollectionProfile();
    profile.setBooking(booking);
    profile.setCollectorFullName(request.getCollectorFullName());
    profile.setCollectorIdCard(request.getCollectorIdCard());
    profile.setDoctorName(request.getDoctorName()); // Lưu tên bác sĩ
    profile.setSampleCollectionDate(request.getSampleCollectionDate());

    // 3.4 Lưu profile
    SampleCollectionProfile savedProfile = sampleCollectionProfileRepository.save(profile);

    // 3.5 Update booking status
    String previousStatus = booking.getStatus();
    booking.setStatus("SAMPLE_COLLECTED");
    booking.setSampleCollectionProfile(savedProfile);
    Booking updatedBooking = bookingRepository.save(booking);

    // 3.6 Trigger WebSocket notification
    bookingNotificationService.notifyBookingStatusChange(
        updatedBooking, "SAMPLE_COLLECTED", previousStatus, currentStaffName
    );

    return convertToDto(updatedBooking);
}
```

### WebSocket Notification:
**Backend WebSocket Service:**
```java
// BookingNotificationService.java
public void notifyBookingStatusChange(Booking booking, String newStatus, String oldStatus, String updatedBy) {
    // 3.7 Tạo notification message
    BookingStatusUpdateDTO notification = new BookingStatusUpdateDTO();
    notification.setBookingId(booking.getId());
    notification.setNewStatus(newStatus);
    notification.setOldStatus(oldStatus);
    notification.setStatusDisplayName("Đã lấy mẫu");
    notification.setTimestamp(LocalDateTime.now());
    notification.setDoctorName(booking.getSampleCollectionProfile().getDoctorName());
    notification.setUpdatedBy(updatedBy);

    // 3.8 Broadcast message đến tất cả clients đang track booking này
    messagingTemplate.convertAndSend(
        "/topic/booking/" + booking.getId(),
        notification
    );
}
```

### Real-time Update Flow:
```
Staff submits form → POST /api/booking/{id}/sample-collected
→ BookingServiceImpl.collectSample() → Save to database
→ BookingNotificationService.notifyBookingStatusChange()
→ WebSocket broadcast → /topic/booking/{id}
→ Customer's browser receives message → UI updates → Toast notification
```

### WebSocket Message Format:
```json
{
  "bookingId": 789,
  "newStatus": "SAMPLE_COLLECTED",
  "oldStatus": "PENDING",
  "statusDisplayName": "Đã lấy mẫu",
  "timestamp": "2024-08-10T09:15:00",
  "doctorName": "BS. Nguyễn Văn B",
  "updatedBy": "staff_user"
}
```

---

## STEP 4: STAFF CẬP NHẬT KẾT QUẢ XÉT NGHIỆM

### Frontend Flow:
**Component:** `TestResultForm.jsx`
```javascript
// 4.1 Staff nhập kết quả xét nghiệm
const handleSubmit = async (formData) => {
  // 4.2 First: Update test result
  const resultData = {
    result: formData.result.trim(),
    resultType: formData.resultType,
    notes: formData.notes.trim(),
    resultDate: new Date(formData.resultDate).toISOString()
  };

  const response = await TestingService.uploadTestResultAPI(bookingId, resultData);
};
```

### API Call:
```
POST /api/services/testing-services/bookings/{bookingId}/results
Body: {
  "result": "Kết quả xét nghiệm chi tiết...",
  "resultType": "Bình thường",
  "notes": "Ghi chú của bác sĩ",
  "resultDate": "2024-08-12T14:00:00"
}
```

### Backend Processing:
**Service:** `BookingServiceImpl.updateTestResult()`
```java
public BookingResponseDTO updateTestResult(Integer bookingId, UpdateTestResultRequestDTO request) {
    // 4.6 Update booking với kết quả
    booking.setResult(request.getResult());
    booking.setResultType(request.getResultType());
    booking.setResultDate(request.getResultDate());
    booking.setStatus("COMPLETED");
    booking.setUpdatedAt(LocalDateTime.now());

    // 4.7 Save booking
    Booking updatedBooking = bookingRepository.save(booking);

    // 4.8 Trigger WebSocket notification
    bookingNotificationService.notifyBookingStatusChange(
        updatedBooking, "COMPLETED", previousStatus, currentStaffName
    );

    return convertToDto(updatedBooking);
}
```

### WebSocket Message:
```json
{
  "bookingId": 789,
  "newStatus": "COMPLETED",
  "oldStatus": "SAMPLE_COLLECTED",
  "statusDisplayName": "Hoàn thành",
  "timestamp": "2024-08-12T14:00:00",
  "doctorName": "BS. Nguyễn Văn C",
  "updatedBy": "staff_user"
}
```

### Data Flow:
```
TestResultForm → TestingService.uploadTestResultAPI() → POST /api/services/testing-services/bookings/{id}/results
→ TestingServiceController.uploadTestResult() → Update Booking entity → Database
→ BookingNotificationService → WebSocket broadcast → Customer receives update
```

---

## STEP 5: CUSTOMER XEM KẾT QUẢ XÉT NGHIỆM

### Frontend Flow:
**Component:** `TestResultModal.jsx`
```javascript
// 5.1 Customer click "Xem kết quả" từ notification hoặc booking list
const openTestResult = async (bookingId) => {
  // 5.2 Load booking data với kết quả
  const response = await TestingService.getBookingById(bookingId);
  setResult(response.data);
  setShowModal(true);
};

// 5.3 Hiển thị kết quả với tên bác sĩ
const renderDoctorName = () => {
  // Priority: result.doctorName > sampleCollectionProfile.doctorName > fallback
  return result.doctorName ||
         result.sampleCollectionProfile?.doctorName ||
         "BS. Nguyễn Văn A"; // fallback
};
```

### API Call:
```
GET /api/bookings/{bookingId}
Response: BookingResponseDTO với đầy đủ thông tin kết quả
```

### Backend Processing:
**Service:** `BookingServiceImpl.getBookingByIdForUser()`
```java
public BookingResponseDTO getBookingByIdForUser(Integer bookingId) {
    // 5.4 Lấy booking từ database
    Booking booking = bookingRepository.findById(bookingId);

    // 5.5 Convert sang DTO với đầy đủ thông tin
    return convertToDto(booking);
}

private BookingResponseDTO convertToDto(Booking booking) {
    BookingResponseDTO dto = new BookingResponseDTO();
    dto.setBookingId(booking.getId());
    dto.setResult(booking.getResult());
    dto.setResultType(booking.getResultType());
    dto.setResultDate(booking.getResultDate());

    // 5.6 Map sample collection profile
    if (booking.getSampleCollectionProfile() != null) {
        dto.setSampleCollectionProfile(convertSampleCollectionToDto(booking.getSampleCollectionProfile()));
        // 5.7 Set direct doctorName field for easier access
        dto.setDoctorName(booking.getSampleCollectionProfile().getDoctorName());
    }

    return dto;
}
```

### Response Format:
```json
{
  "success": true,
  "data": {
    "bookingId": 789,
    "customerFullName": "Nguyễn Văn A",
    "serviceName": "Xét nghiệm STI",
    "status": "COMPLETED",
    "result": "Kết quả xét nghiệm chi tiết...",
    "resultType": "Bình thường",
    "resultDate": "2024-08-12T14:00:00",
    "doctorName": "BS. Nguyễn Văn C",
    "sampleCollectionProfile": {
      "collectorFullName": "Nguyễn Văn A",
      "sampleCollectionDate": "2024-08-10T09:15:00",
      "doctorName": "BS. Nguyễn Văn C",
      "notes": "Lấy mẫu thành công"
    }
  }
}
```

### Data Flow:
```
TestResultModal → TestingService.getBookingById() → GET /api/bookings/{id}
→ BookingController.getBookingByIdForUser() → BookingServiceImpl.getBookingByIdForUser()
→ BookingRepository.findById() → convertToDto() → BookingResponseDTO
→ Frontend renders result với doctorName
```

---

## WEBSOCKET COMMUNICATION SUMMARY

### Client-Server Roles:
```
CLIENT (Frontend React):
- Role: Message Consumer
- Actions: Connect, Subscribe, Receive, Update UI
- Connection: ws://localhost:8080/ws
- Topics: /topic/booking/{bookingId}

SERVER (Backend Spring Boot):
- Role: Message Producer
- Actions: Broadcast messages when status changes
- Triggers: Staff updates booking status
- Message Format: BookingStatusUpdateDTO
```

### Message Flow Sequence:
```
1. Customer opens TrackingPage
2. Frontend connects WebSocket + subscribes /topic/booking/{id}
3. Staff updates booking status (any step)
4. Backend saves to database
5. Backend triggers BookingNotificationService
6. Server broadcasts message to /topic/booking/{id}
7. All subscribed clients receive message
8. Frontend updates UI + shows notification
```

### WebSocket Lifecycle:
```
Connect: Auto-connect when page loads
Subscribe: Subscribe to specific booking topic
Receive: Handle incoming status updates
Update: Update UI state and show notifications
Cleanup: Auto-unsubscribe when page unmounts
```

---

## DATA MAPPING SUMMARY

### Key Entities & Fields:
```
Booking:
- id, status, result, resultType, resultDate
- customerID, serviceID, timeSlotID
- sampleCollectionProfile (relationship)

SampleCollectionProfile:
- id, bookingId, doctorName (NEW FIELD)
- collectorFullName, collectorIdCard
- sampleCollectionDate, notes

BookingResponseDTO:
- bookingId, status, result, resultDate
- doctorName (direct field for easy access)
- sampleCollectionProfile (nested object)
```

### Doctor Name Priority:
```
Frontend Display Priority:
1. result.doctorName (direct field)
2. result.sampleCollectionProfile.doctorName (nested)
3. doctorInfo.name (hardcoded fallback)

Backend Mapping:
SampleCollectionProfile.doctorName → BookingResponseDTO.doctorName
```
```