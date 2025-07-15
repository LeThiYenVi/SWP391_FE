# Danh sách API Endpoint Backend (BE-SWP391)

> **Dùng cho FE: SWP391_FE**

---

## 1. AuthController (`/api/auth`)
- `POST /api/auth/login` — Đăng nhập
- `POST /api/auth/register` — Đăng ký
- `POST /api/auth/refresh-token` — Làm mới token
- `POST /api/auth/forgot-password` — Gửi email quên mật khẩu
- `POST /api/auth/validate-otp` — Xác thực OTP
- `POST /api/auth/reset-password` — Đặt lại mật khẩu bằng OTP
- `POST /api/auth/login-by-google` — Đăng nhập bằng Google
- `POST /api/auth/logout` — Đăng xuất

---

## 2. UserController (`/api/user`)
- `PUT /api/user/profile` — Cập nhật thông tin cá nhân
- `GET /api/user/profile` — Lấy thông tin cá nhân
- `GET /api/user/booking-history` — Lịch sử đặt lịch của user
- `POST /api/user/menstrual-cycle` — Thêm/cập nhật chu kỳ kinh nguyệt
- `POST /api/user/menstrual-cycle/log` — Ghi nhật ký chu kỳ kinh nguyệt
- `GET /api/user/menstrual-cycle/tracker` — Lấy thông tin theo dõi chu kỳ
- `GET /api/user/reminders` — Lấy danh sách nhắc nhở của user

---

## 3. BookingController (`/api/bookings`)
- `POST /api/bookings` — Tạo booking mới
- `GET /api/bookings/my-bookings` — Lấy booking của user hiện tại
- `GET /api/bookings/{bookingId}/my-booking` — Lấy booking chi tiết của user hiện tại
- `GET /api/bookings/{bookingId}/admin` — Lấy booking chi tiết cho admin
- `PATCH /api/bookings/{bookingId}/status` — Cập nhật trạng thái booking
- `PATCH /api/bookings/{bookingId}/cancel` — Hủy booking
- `GET /api/bookings/all` — Lấy tất cả booking cho staff/manager

---

## 4. BlogController (`/api/blog`)
- `GET /api/blog/posts` — Lấy danh sách bài viết
- `GET /api/blog/posts/{postId}` — Lấy chi tiết bài viết
- `POST /api/blog/posts` — Tạo bài viết mới
- `PUT /api/blog/posts/{postId}` — Cập nhật bài viết
- `DELETE /api/blog/posts/{postId}` — Xóa bài viết
- `GET /api/blog/posts/category/{categoryId}` — Lấy bài viết theo danh mục
- `GET /api/blog/posts/search?keyword=...` — Tìm kiếm bài viết
- `GET /api/blog/posts/featured` — Lấy bài viết nổi bật
- `GET /api/blog/categories` — Lấy danh mục blog
- `GET /api/blog/categories/{categoryId}` — Lấy chi tiết danh mục
- `POST /api/blog/categories` — Tạo danh mục mới
- `PUT /api/blog/categories/{categoryId}` — Cập nhật danh mục
- `DELETE /api/blog/categories/{categoryId}` — Xóa danh mục
- `GET /api/blog/categories/{categoryId}/with-posts` — Lấy danh mục kèm bài viết
- `GET /api/blog/categories/with-posts` — Lấy tất cả danh mục kèm bài viết

---

## 5. AdminController (`/api/admin`)
### Quản lý dịch vụ xét nghiệm
- `POST /api/admin/testing-services` — Tạo dịch vụ xét nghiệm
- `PUT /api/admin/testing-services/{serviceId}` — Cập nhật dịch vụ
- `DELETE /api/admin/testing-services/{serviceId}` — Xóa dịch vụ
- `GET /api/admin/testing-services/bookings` — Xem tất cả booking xét nghiệm
- `PUT /api/admin/testing-services/bookings/{bookingId}/results` — Quản lý kết quả xét nghiệm

### Quản lý feedback
- `GET /api/admin/feedback` — Xem tất cả feedback
- `PUT /api/admin/feedback/{feedbackId}/status` — Duyệt feedback

### Quản lý tư vấn viên
- `GET /api/admin/consultants/{consultantId}` — Lấy chi tiết tư vấn viên
- `GET /api/admin/consultants/{consultantId}/schedule` — Lấy lịch tư vấn viên
- `POST /api/admin/consultants/{consultantId}/unavailability` — Thêm lịch nghỉ
- `GET /api/admin/listConsultant` — Lấy danh sách tư vấn viên
- `POST /api/admin/consultants` — Tạo tư vấn viên mới
- `PUT /api/admin/setUserToConsultant/{id}` — Set user thành consultant
- `PUT /api/admin/consultants/{consultantId}` — Cập nhật tư vấn viên
- `DELETE /api/admin/consultants/{consultantId}` — Xóa tư vấn viên

### Quản lý user
- `GET /api/admin/users/{userId}` — Lấy chi tiết user
- `GET /api/admin/users` — Lấy danh sách user
- `PUT /api/admin/users/{userId}` — Cập nhật user
- `DELETE /api/admin/users/{userId}` — Xóa user

### Quản lý booking tư vấn
- `GET /api/admin/consultation-bookings` — Lấy tất cả booking tư vấn
- `GET /api/admin/consultation-bookings/{bookingId}` — Lấy chi tiết booking tư vấn
- `POST /api/admin/consultation-bookings/{bookingId}/cancel` — Hủy booking tư vấn
- `POST /api/admin/consultation-bookings/{bookingId}/reschedule` — Đặt lại lịch booking tư vấn

### Quản lý chu kỳ kinh nguyệt
- `GET /api/admin/menstrual-cycles/{userId}` — Lấy chi tiết chu kỳ của user

### Quản lý nhắc nhở
- `GET /api/admin/patient/{userId}/reminders` — Lấy nhắc nhở của user
- `POST /api/admin/patient/reminder` — Tạo nhắc nhở
- `GET /api/admin/patient/reminder/{id}` — Lấy chi tiết nhắc nhở
- `PUT /api/admin/patient/reminder/{id}` — Cập nhật nhắc nhở
- `DELETE /api/admin/patient/reminder/{id}` — Xóa nhắc nhở

### Báo cáo/thống kê
- `GET /api/admin/reports/dashboard` — Báo cáo dashboard
- `GET /api/admin/reports/overview` — Báo cáo tổng quan
- `GET /api/admin/reports/bookings` — Báo cáo booking
- `GET /api/admin/reports/financials` — Báo cáo tài chính
- `GET /api/admin/reports/users` — Báo cáo user
- `GET /api/admin/reports/consultants` — Báo cáo tư vấn viên
- `GET /api/admin/reports/services` — Báo cáo dịch vụ

---

> Nếu cần chi tiết controller khác (QA, Payment, Service, Feedback, Homepage, ...), hãy bổ sung thêm vào file này! 