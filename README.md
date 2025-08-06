<!--  --># SWP391 - Healthcare Management System

Hệ thống quản lý dịch vụ chăm sóc sức khỏe phụ khoa với Spring Boot Backend và React Frontend.

## 📋 Yêu cầu hệ thống

### Backend Requirements
- **Java**: JDK 17 hoặc cao hơn
- **Maven**: 3.6+ (hoặc sử dụng Maven wrapper có sẵn)
- **SQL Server**: 2019 hoặc cao hơn
- **IDE**: IntelliJ IDEA (khuyến nghị), Eclipse, hoặc VS Code

### Frontend Requirements  
- **Node.js**: 18.0.0 hoặc cao hơn
- **npm**: 9.0.0 hoặc cao hơn
- **Browser**: Chrome, Firefox, Safari (phiên bản mới nhất)

## 🚀 Hướng dẫn chạy project

### Bước 1: Chuẩn bị Database

#### 1.1. Cài đặt SQL Server
- Tải và cài đặt SQL Server 2019+
- Tạo user `sa` với password `12345`
- Đảm bảo SQL Server đang chạy trên port `1433`
- Tạo database `HS_New` (nếu chưa có)

#### 1.2. Reset Database (nếu cần)
**⚠️ Chỉ chạy khi database đã có data và muốn xóa hết để bắt đầu lại:**

1. Mở **SQL Server Management Studio (SSMS)**
2. Kết nối vào SQL Server với user `sa`
3. Mở file `SWP391_FE/DeleteDB.sql`
4. Chạy script này để xóa hết tất cả bảng và data
5. Script sẽ xóa hoàn toàn mọi thứ trong database `HS_New`

### Bước 2: Chạy Backend

#### 2.1. Sử dụng IntelliJ IDEA (Khuyến nghị)
1. Mở IntelliJ IDEA
2. **File** → **Open** → Chọn thư mục `BE-SWP391`
3. Đợi IntelliJ import project và download dependencies
4. Tìm file `GenderHealthcareServiceApplication.java` trong `src/main/java`
5. **Click chuột phải** → **Run 'GenderHealthcareServiceApplication'**
6. Hoặc nhấn nút **▶️ Run** ở góc trên bên phải

#### 2.2. Sử dụng Command Line (Thay thế)
```bash
cd BE-SWP391
mvn clean install
mvn spring-boot:run
```

**Backend sẽ chạy tại:** `http://localhost:8080`

### Bước 3: Chạy Frontend

#### 3.1. Cài đặt dependencies
```bash
cd SWP391_FE
npm install
```

#### 3.2. Chạy development server
```bash
npm run dev
```

**Frontend sẽ chạy tại:** `http://localhost:3000`

## 🔄 Quy trình khởi động hàng ngày

### Nếu database HS_New đã có data:
1. **Chạy script xóa DB:** Mở `SWP391_FE/DeleteDB.sql` trong SSMS và execute
2. **Chạy Backend:** Mở IntelliJ → Run `GenderHealthcareServiceApplication`
3. **Chạy Frontend:** `cd SWP391_FE` → `npm run dev`

### Nếu database HS_New trống hoặc chưa có:
1. **Chạy Backend:** Mở IntelliJ → Run `GenderHealthcareServiceApplication`
2. **Chạy Frontend:** `cd SWP391_FE` → `npm run dev`

## 🗃️ Cấu trúc Database

Database `HS_New` sẽ được tự động tạo các bảng khi chạy backend lần đầu (JPA auto-create).

### Các bảng chính:
- `users` - Quản lý người dùng
- `roles` - Phân quyền
- `services` - Dịch vụ xét nghiệm  
- `appointments` - Lịch hẹn
- `test_results` - Kết quả xét nghiệm
- `medical_records` - Hồ sơ bệnh án

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/refresh` - Refresh token

### Services Management
- `GET /api/services` - Lấy danh sách dịch vụ
- `POST /api/services` - Tạo dịch vụ mới
- `PUT /api/services/{id}` - Cập nhật dịch vụ
- `DELETE /api/services/{id}` - Xóa dịch vụ

## 👥 Phân quyền người dùng

- **ADMIN**: Quản lý toàn hệ thống
- **STAFF**: Nhân viên y tế
- **CUSTOMER**: Khách hàng/Bệnh nhân

## 🔧 Scripts hữu ích

### Backend Scripts
```bash
# Clean và rebuild
mvn clean install

# Chạy với profile cụ thể
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Tạo JAR file
mvn clean package
```

### Frontend Scripts
```bash
# Development
npm run dev              # Chạy dev server
npm run build           # Build production
npm run preview         # Preview production build

# Maintenance
npm run lint            # Kiểm tra code style
npm run lint:fix        # Tự động fix lỗi lint
npm run cache:clear     # Xóa cache
```

## 🔍 Troubleshooting

### Lỗi thường gặp:

#### Backend không kết nối được Database
```bash
# Kiểm tra SQL Server đang chạy
# Kiểm tra thông tin kết nối trong application.properties
# Đảm bảo database HS_New đã được tạo
```

#### Frontend không gọi được API
```bash
# Kiểm tra backend đang chạy tại localhost:8080
# Kiểm tra CORS configuration
# Xem console browser để debug
```

#### Port đã được sử dụng
```bash
# Backend (8080):
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Frontend (3000):
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs trong console
2. Đảm bảo tất cả services đang chạy
3. Kiểm tra network connectivity
4. Liên hệ team development

---

**Phiên bản:** 3.0.0  
**Cập nhật:** 2025-08-02
