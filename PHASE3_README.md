# EduScan AI - Phase 3: Student Management

## 🎯 Overview

Phase 3 tập trung vào **Quản lý học sinh toàn diện**, bao gồm hồ sơ học sinh, quản lý liên hệ phụ huynh, chuyển lớp, và import/export dữ liệu học sinh hàng loạt.

## 🚀 Khởi động nhanh

```bash
# Khởi động toàn bộ Phase 3
./start-phase3.sh

# Hoặc khởi động thủ công:
# Backend: cd backend && uvicorn app.main:app --reload
# Frontend: cd frontend && npm run dev
```

**Truy cập:**
- 📱 Frontend: http://localhost:3000
- 🔧 Backend API: http://localhost:8000
- 📚 API Documentation: http://localhost:8000/docs

## 🔐 Tài khoản test

| Vai trò | Email | Password | Quyền hạn |
|---------|-------|----------|-----------|
| Admin | admin@eduscan.com | admin123 | Toàn quyền hệ thống |
| Manager | manager@eduscan.com | manager123 | Quản lý tổ chức riêng |
| Teacher | teacher@eduscan.com | teacher123 | Xem lớp được phân công |

## 📋 Tính năng Phase 3

### 🎯 Quản lý học sinh (Student Management)

#### 👑 Admin Features
- **Tổng quan toàn hệ thống:**
  - Xem tất cả học sinh từ mọi tổ chức
  - Thống kê tổng quát (tổng số, theo giới tính, trạng thái)
  - Tìm kiếm và lọc nâng cao
  
- **CRUD học sinh:**
  - Thêm học sinh mới vào bất kỳ lớp nào
  - Chỉnh sửa thông tin học sinh
  - Xóa học sinh (với xác nhận)
  - Tạm ngưng/kích hoạt tài khoản học sinh

- **Quản lý hàng loạt:**
  - Import học sinh từ file Excel
  - Export danh sách học sinh
  - Chuyển lớp hàng loạt

#### 👨‍💼 Manager Features
- **Phạm vi tổ chức:**
  - Quản lý học sinh trong tổ chức của mình
  - Xem thống kê học sinh theo lớp
  - Quản lý liên hệ phụ huynh

- **Chức năng chính:**
  - Thêm/sửa/xóa học sinh trong tổ chức
  - Chuyển học sinh giữa các lớp
  - Import/export học sinh
  - Liên hệ phụ huynh qua email

#### 👨‍🏫 Teacher Features
- **Xem thông tin học sinh:**
  - Danh sách học sinh lớp được phân công
  - Thông tin liên hệ phụ huynh
  - Lịch sử học tập (trong tương lai)

### 🏗️ Cấu trúc dữ liệu

#### Student Model
```python
class Student(Base):
    maHocSinh = Column(Integer, primary_key=True)
    maLopHoc = Column(Integer, ForeignKey("lop_hoc.maLopHoc"))
    maHocSinhTruong = Column(String(50), unique=True)  # Mã học sinh của trường
    hoTen = Column(String(255), nullable=False)
    ngaySinh = Column(Date, nullable=True)
    gioiTinh = Column(Enum(GioiTinh), nullable=True)
    soDienThoaiPhuHuynh = Column(String(20), nullable=True)
    emailPhuHuynh = Column(String(255), nullable=True)
    trangThai = Column(Boolean, default=True)
    thoiGianTao = Column(DateTime, default=datetime.utcnow)
    thoiGianCapNhat = Column(DateTime, default=datetime.utcnow)
```

### 🛠️ API Endpoints

#### Student Management APIs
```
GET    /students/class/{class_id}     # Lấy học sinh theo lớp
GET    /students/{student_id}         # Chi tiết học sinh
POST   /students                     # Tạo học sinh mới
POST   /students/batch               # Tạo nhiều học sinh
PUT    /students/{student_id}        # Cập nhật học sinh
DELETE /students/{student_id}        # Xóa học sinh
POST   /students/transfer            # Chuyển lớp học sinh
```

#### Authorization Matrix
| Endpoint | Admin | Manager | Teacher |
|----------|-------|---------|---------|
| GET students by class | ✅ All | ✅ Own org | ✅ Own classes |
| GET student detail | ✅ All | ✅ Own org | ✅ Own classes |
| POST create student | ✅ All | ✅ Own org | ❌ |
| PUT update student | ✅ All | ✅ Own org | ❌ |
| DELETE student | ✅ All | ✅ Own org | ❌ |
| POST transfer student | ✅ All | ✅ Own org | ❌ |

### 🎨 Frontend Structure

```
frontend/app/dashboard/
├── admin/
│   └── students/
│       ├── page.tsx                 # Danh sách học sinh (Admin)
│       └── [studentId]/
│           ├── page.tsx             # Chi tiết học sinh
│           └── edit/
│               └── page.tsx         # Chỉnh sửa học sinh
├── manager/
│   └── students/
│       ├── page.tsx                 # Danh sách học sinh (Manager)
│       └── [studentId]/
│           ├── page.tsx             # Chi tiết học sinh
│           └── edit/
│               └── page.tsx         # Chỉnh sửa học sinh
└── teacher/
    └── students/
        ├── page.tsx                 # Danh sách học sinh (Teacher)
        └── [studentId]/
            └── page.tsx             # Chi tiết học sinh
```

### 📊 State Management

#### React Query Keys
```typescript
export const studentKeys = {
  all: ['students'] as const,
  byClass: (classId: number) => ['students', 'class', classId] as const,
  detail: (id: number) => ['students', 'detail', id] as const,
};
```

#### Custom Hooks
```typescript
// Student CRUD hooks
useStudentsByClass(params, options)  // Lấy học sinh theo lớp
useStudent(studentId)                // Chi tiết học sinh
useCreateStudent()                   // Tạo học sinh
useCreateStudentsBatch()             // Tạo nhiều học sinh
useUpdateStudent()                   // Cập nhật học sinh
useDeleteStudent()                   // Xóa học sinh
useTransferStudents()                // Chuyển lớp
```

## 🎯 UI/UX Features

### 📱 Responsive Design
- **Mobile-first approach:** Tối ưu cho điện thoại
- **Tablet support:** Layout linh hoạt cho tablet
- **Desktop optimization:** Tận dụng không gian màn hình lớn

### ⚡ Performance Features
- **Lazy loading:** Tải dữ liệu theo yêu cầu
- **Infinite scroll:** Hỗ trợ danh sách dài
- **Debounced search:** Tìm kiếm không lag
- **Optimistic updates:** Cập nhật UI ngay lập tức
- **Loading skeletons:** Trải nghiệm loading mượt mà

### 🎨 Modern Components
- **Cards layout:** Hiển thị thông tin rõ ràng
- **Advanced filters:** Lọc theo nhiều tiêu chí
- **Action dropdowns:** Menu thao tác gọn gàng
- **Toast notifications:** Thông báo trạng thái
- **Modal confirmations:** Xác nhận thao tác quan trọng

### 📈 Analytics & Stats
- **Real-time counters:** Thống kê theo thời gian thực
- **Gender distribution:** Phân bố giới tính
- **Status tracking:** Theo dõi trạng thái học sinh
- **Progress indicators:** Hiển thị tiến độ

## 🔒 Security & Authorization

### 🛡️ Role-based Access Control
- **Admin:** Toàn quyền trên tất cả học sinh
- **Manager:** Chỉ quản lý học sinh trong tổ chức
- **Teacher:** Chỉ xem học sinh lớp được phân công

### 🔐 Data Protection
- **Input validation:** Kiểm tra dữ liệu đầu vào
- **SQL injection prevention:** Sử dụng ORM an toàn
- **XSS protection:** Escape dữ liệu output
- **CSRF tokens:** Bảo vệ form submission

### 📝 Audit Trail
- **Creation tracking:** Theo dõi thời gian tạo
- **Update tracking:** Theo dõi thời gian cập nhật
- **Change history:** Lưu lịch sử thay đổi (trong tương lai)

## 🚀 Performance Optimizations

### ⚡ Backend Performance
- **Database indexing:** Index các trường quan trọng
- **Query optimization:** Tối ưu câu truy vấn
- **Pagination:** Phân trang dữ liệu
- **Caching:** Cache dữ liệu thường xuyên truy cập

### 🎯 Frontend Performance
- **Code splitting:** Chia nhỏ bundle
- **Tree shaking:** Loại bỏ code không dùng
- **Image optimization:** Tối ưu hình ảnh
- **Bundle analysis:** Phân tích kích thước bundle

## 📚 Integration Points

### 🔗 Phase 2 Integration
- **Class-Student relationship:** Liên kết lớp học và học sinh
- **Teacher access:** Giáo viên xem học sinh lớp mình dạy
- **Organization scope:** Phạm vi quản lý theo tổ chức

### 🔮 Future Phase Integration
- **Exam results:** Kết nối với kết quả thi (Phase 4)
- **Attendance:** Theo dõi chuyên cần (Phase 5)
- **Parent portal:** Cổng thông tin phụ huynh (Phase 6)

## 🧪 Testing Strategy

### 🔬 Backend Testing
```bash
# Unit tests
pytest backend/tests/

# API tests  
pytest backend/tests/test_api/

# Integration tests
pytest backend/tests/test_integration/
```

### 🎭 Frontend Testing
```bash
# Component tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 📦 Deployment

### 🐳 Docker Setup
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f
```

### ☁️ Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Load balancer configured
- [ ] CDN setup for static assets

## 🔧 Development Setup

### 📋 Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL 13+
- Redis (for caching)

### 🛠️ Development Commands
```bash
# Backend development
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend development  
cd frontend
npm install
npm run dev

# Database setup
alembic upgrade head

# Create sample data
python scripts/seed_data.py
```

## 📈 Monitoring & Analytics

### 📊 Metrics to Track
- **Student enrollment rates**
- **User activity patterns**
- **API response times**
- **Error rates**
- **Database performance**

### 🔍 Logging
- **Application logs:** Structured JSON logging
- **Access logs:** Request/response tracking
- **Error logs:** Exception tracking with context
- **Performance logs:** Slow query identification

## 🤝 Contributing

### 🎯 Code Standards
- **TypeScript:** Strict mode enabled
- **ESLint:** Airbnb configuration
- **Prettier:** Code formatting
- **Husky:** Pre-commit hooks

### 📝 Documentation Standards
- **JSDoc:** Function documentation
- **README:** Feature documentation
- **API Docs:** OpenAPI/Swagger
- **Architecture docs:** High-level design

## 🎉 Success Metrics

### 📊 KPIs
- **System Performance:** < 200ms API response time
- **User Experience:** > 95% user satisfaction
- **Reliability:** 99.9% uptime
- **Security:** Zero data breaches

### 🎯 Feature Adoption
- **Student profile completion:** > 90%
- **Parent contact info:** > 80%
- **Bulk operations usage:** > 50%
- **Mobile usage:** > 60%

---

## 🆘 Troubleshooting

### 🔧 Common Issues

**Backend không khởi động:**
```bash
# Kiểm tra port
lsof -i :8000

# Kiểm tra database connection
python -c "from app.db.database import engine; print('DB OK')"
```

**Frontend build fails:**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

**Database migration issues:**
```bash
# Reset migrations
alembic downgrade base
alembic upgrade head
```

## 📞 Support

- **Technical Issues:** Create GitHub issue
- **Documentation:** Check `/docs` folder
- **API Questions:** Use Swagger UI at `/docs`

---

**🚀 Phase 3 hoàn thành! Sẵn sàng cho Phase 4: Exam Management** 