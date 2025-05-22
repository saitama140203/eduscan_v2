# EduScan - Thiết kế cơ sở dữ liệu

Tài liệu này mô tả thiết kế cơ sở dữ liệu cho hệ thống EduScan.

## Cấu trúc bảng dữ liệu

Hệ thống sử dụng PostgreSQL 15 với các bảng dữ liệu chính sau:

### TOCHUC (Tổ chức)
Lưu trữ thông tin các tổ chức sử dụng hệ thống (trường học, trung tâm giáo dục...)

| Trường dữ liệu | Kiểu dữ liệu | Mô tả |
|----------------|--------------|-------|
| maToChuc | BigInteger | Khóa chính, tự động tăng |
| tenToChuc | String(255) | Tên tổ chức |
| loaiToChuc | String(50) | Loại tổ chức (trường học, trung tâm) |
| diaChi | Text | Địa chỉ tổ chức |
| urlLogo | String(255) | Đường dẫn logo tổ chức |
| thoiGianTao | Timestamp | Thời điểm tạo |
| thoiGianCapNhat | Timestamp | Thời điểm cập nhật cuối |

### NGUOIDUNG (Người dùng)
Lưu trữ thông tin người dùng hệ thống (Admin, Manager, Teacher)

| Trường dữ liệu | Kiểu dữ liệu | Mô tả |
|----------------|--------------|-------|
| maNguoiDung | BigInteger | Khóa chính, tự động tăng |
| maToChuc | BigInteger | Khóa ngoại liên kết với bảng TOCHUC |
| email | String(255) | Email đăng nhập, duy nhất |
| matKhau | String(255) | Mật khẩu đã hash bằng bcrypt |
| hoTen | String(255) | Họ tên người dùng |
| vaiTro | String(50) | Vai trò: Admin, Manager, Teacher |
| soDienThoai | String(20) | Số điện thoại |
| urlAnhDaiDien | String(255) | Đường dẫn ảnh đại diện |
| thoiGianDangNhapCuoi | Timestamp | Thời điểm đăng nhập cuối |
| trangThai | Boolean | Trạng thái hoạt động |
| thoiGianTao | Timestamp | Thời điểm tạo |
| thoiGianCapNhat | Timestamp | Thời điểm cập nhật cuối |

### LOPHOC (Lớp học)
Lưu trữ thông tin lớp học

| Trường dữ liệu | Kiểu dữ liệu | Mô tả |
|----------------|--------------|-------|
| maLopHoc | BigInteger | Khóa chính, tự động tăng |
| maToChuc | BigInteger | Khóa ngoại liên kết với bảng TOCHUC |
| tenLop | String(100) | Tên lớp |
| capHoc | String(20) | Cấp học (tiểu học, THCS, THPT...) |
| namHoc | String(20) | Năm học |
| maGiaoVienChuNhiem | BigInteger | Khóa ngoại liên kết với bảng NGUOIDUNG |
| moTa | Text | Mô tả lớp học |
| trangThai | Boolean | Trạng thái hoạt động |
| thoiGianTao | Timestamp | Thời điểm tạo |
| thoiGianCapNhat | Timestamp | Thời điểm cập nhật cuối |

### HOCSINH (Học sinh)
Lưu trữ thông tin học sinh

| Trường dữ liệu | Kiểu dữ liệu | Mô tả |
|----------------|--------------|-------|
| maHocSinh | BigInteger | Khóa chính, tự động tăng |
| maLopHoc | BigInteger | Khóa ngoại liên kết với bảng LOPHOC |
| maHocSinhTruong | String(50) | Mã học sinh trong trường |
| hoTen | String(255) | Họ tên học sinh |
| ngaySinh | Date | Ngày sinh |
| gioiTinh | String(10) | Giới tính |
| soDienThoaiPhuHuynh | String(20) | Số điện thoại phụ huynh |
| emailPhuHuynh | String(255) | Email phụ huynh |
| trangThai | Boolean | Trạng thái hoạt động |
| thoiGianTao | Timestamp | Thời điểm tạo |
| thoiGianCapNhat | Timestamp | Thời điểm cập nhật cuối |

### MAUPHIEUTRALOI (Mẫu phiếu trả lời)
Lưu trữ thông tin mẫu phiếu trả lời

| Trường dữ liệu | Kiểu dữ liệu | Mô tả |
|----------------|--------------|-------|
| maMauPhieu | BigInteger | Khóa chính, tự động tăng |
| maToChuc | BigInteger | Khóa ngoại liên kết với bảng TOCHUC |
| maNguoiTao | BigInteger | Khóa ngoại liên kết với bảng NGUOIDUNG |
| tenMauPhieu | String(255) | Tên mẫu phiếu |
| soCauHoi | Integer | Số câu hỏi |
| soLuaChonMoiCau | Integer | Số lựa chọn trên mỗi câu |
| khoGiay | String(10) | Khổ giấy (A4, A3...) |
| coTuLuan | Boolean | Có tự luận hay không |
| coThongTinHocSinh | Boolean | Có thông tin học sinh hay không |
| coLogo | Boolean | Có logo hay không |
| cauTrucJson | JSONB | Cấu trúc mẫu phiếu dạng JSON |
| cssFormat | Text | Định dạng CSS |
| laMacDinh | Boolean | Là mẫu mặc định hay không |
| laCongKhai | Boolean | Là mẫu công khai hay không |
| thoiGianTao | Timestamp | Thời điểm tạo |
| thoiGianCapNhat | Timestamp | Thời điểm cập nhật cuối |

### BAIKIEMTRA (Bài kiểm tra)
Lưu trữ thông tin bài kiểm tra

| Trường dữ liệu | Kiểu dữ liệu | Mô tả |
|----------------|--------------|-------|
| maBaiKiemTra | BigInteger | Khóa chính, tự động tăng |
| maToChuc | BigInteger | Khóa ngoại liên kết với bảng TOCHUC |
| maNguoiTao | BigInteger | Khóa ngoại liên kết với bảng NGUOIDUNG |
| maMauPhieu | BigInteger | Khóa ngoại liên kết với bảng MAUPHIEUTRALOI |
| tieuDe | String(255) | Tiêu đề bài kiểm tra |
| monHoc | String(100) | Môn học |
| ngayThi | Date | Ngày thi |
| thoiGianLamBai | Integer | Thời gian làm bài (phút) |
| tongSoCau | Integer | Tổng số câu |
| tongDiem | Numeric(5,2) | Tổng điểm |
| moTa | Text | Mô tả |
| laDeTongHop | Boolean | Là đề thi tổng hợp hay không |
| trangThai | String(20) | Trạng thái (nhap, xuatBan, dongDaChAm) |
| thoiGianTao | Timestamp | Thời điểm tạo |
| thoiGianCapNhat | Timestamp | Thời điểm cập nhật cuối |

### BAIKIEMTRA_LOPHOC (Quan hệ giữa bài kiểm tra và lớp học)
Lưu trữ mối quan hệ giữa bài kiểm tra và lớp học (mối quan hệ nhiều-nhiều)

| Trường dữ liệu | Kiểu dữ liệu | Mô tả |
|----------------|--------------|-------|
| maBKT_LopHoc | BigInteger | Khóa chính, tự động tăng |
| maBaiKiemTra | BigInteger | Khóa ngoại liên kết với bảng BAIKIEMTRA |
| maLopHoc | BigInteger | Khóa ngoại liên kết với bảng LOPHOC |
| thoiGianTao | Timestamp | Thời điểm tạo |

### DAPAN (Đáp án)
Lưu trữ đáp án cho bài kiểm tra

| Trường dữ liệu | Kiểu dữ liệu | Mô tả |
|----------------|--------------|-------|
| maDapAn | BigInteger | Khóa chính, tự động tăng |
| maBaiKiemTra | BigInteger | Khóa ngoại liên kết với bảng BAIKIEMTRA |
| dapAnJSON | JSONB | Đáp án dạng JSON |
| diemMoiCauJSON | JSONB | Điểm cho mỗi câu dạng JSON |
| thoiGianTao | Timestamp | Thời điểm tạo |
| thoiGianCapNhat | Timestamp | Thời điểm cập nhật cuối |

### PHIEUTRALOI (Phiếu trả lời)
Lưu trữ thông tin phiếu trả lời đã quét

| Trường dữ liệu | Kiểu dữ liệu | Mô tả |
|----------------|--------------|-------|
| maPhieuTraLoi | BigInteger | Khóa chính, tự động tăng |
| maBaiKiemTra | BigInteger | Khóa ngoại liên kết với bảng BAIKIEMTRA |
| maHocSinh | BigInteger | Khóa ngoại liên kết với bảng HOCSINH |
| maNguoiQuet | BigInteger | Khóa ngoại liên kết với bảng NGUOIDUNG |
| urlHinhAnh | String(255) | Đường dẫn hình ảnh gốc |
| urlHinhAnhXuLy | String(255) | Đường dẫn hình ảnh đã xử lý |
| cauTraLoiJSON | JSONB | Câu trả lời dạng JSON |
| daXuLyHoanTat | Boolean | Đã xử lý hoàn tất hay chưa |
| doTinCay | Numeric(5,2) | Độ tin cậy của kết quả xử lý |
| canhBaoJSON | JSONB | Các cảnh báo dạng JSON |
| thoiGianQuet | Timestamp | Thời điểm quét |
| thoiGianTao | Timestamp | Thời điểm tạo |
| thoiGianCapNhat | Timestamp | Thời điểm cập nhật cuối |

### KETQUA (Kết quả)
Lưu trữ kết quả chấm điểm

| Trường dữ liệu | Kiểu dữ liệu | Mô tả |
|----------------|--------------|-------|
| maKetQua | BigInteger | Khóa chính, tự động tăng |
| maPhieuTraLoi | BigInteger | Khóa ngoại liên kết với bảng PHIEUTRALOI |
| maBaiKiemTra | BigInteger | Khóa ngoại liên kết với bảng BAIKIEMTRA |
| maHocSinh | BigInteger | Khóa ngoại liên kết với bảng HOCSINH |
| diem | Numeric(5,2) | Điểm số |
| soCauDung | Integer | Số câu đúng |
| soCauSai | Integer | Số câu sai |
| soCauChuaTraLoi | Integer | Số câu chưa trả lời |
| chiTietJSON | JSONB | Chi tiết kết quả dạng JSON |
| diemTheoMonJSON | JSONB | Điểm theo môn dạng JSON |
| thuHangTrongLop | Integer | Thứ hạng trong lớp |
| thoiGianTao | Timestamp | Thời điểm tạo |
| thoiGianCapNhat | Timestamp | Thời điểm cập nhật cuối |

### THONGKEKIEMTRA (Thống kê kiểm tra)
Lưu trữ thống kê kiểm tra theo lớp

| Trường dữ liệu | Kiểu dữ liệu | Mô tả |
|----------------|--------------|-------|
| maThongKe | BigInteger | Khóa chính, tự động tăng |
| maBaiKiemTra | BigInteger | Khóa ngoại liên kết với bảng BAIKIEMTRA |
| maLopHoc | BigInteger | Khóa ngoại liên kết với bảng LOPHOC |
| soLuongThamGia | Integer | Số lượng học sinh tham gia |
| diemTrungBinh | Numeric(5,2) | Điểm trung bình |
| diemCaoNhat | Numeric(5,2) | Điểm cao nhất |
| diemThapNhat | Numeric(5,2) | Điểm thấp nhất |
| diemTrungVi | Numeric(5,2) | Điểm trung vị |
| doLechChuan | Numeric(5,2) | Độ lệch chuẩn |
| thongKeCauHoiJSON | JSONB | Thống kê câu hỏi dạng JSON |
| phanLoaiDoKhoJSON | JSONB | Phân loại độ khó dạng JSON |
| phanBoDiemJSON | JSONB | Phân bố điểm dạng JSON |
| thoiGianTao | Timestamp | Thời điểm tạo |
| thoiGianCapNhat | Timestamp | Thời điểm cập nhật cuối |

### CAIDAT (Cài đặt)
Lưu trữ cài đặt hệ thống cho từng tổ chức

| Trường dữ liệu | Kiểu dữ liệu | Mô tả |
|----------------|--------------|-------|
| maCaiDat | BigInteger | Khóa chính, tự động tăng |
| maToChuc | BigInteger | Khóa ngoại liên kết với bảng TOCHUC |
| tuKhoa | String(100) | Từ khóa cài đặt |
| giaTri | Text | Giá trị cài đặt |
| thoiGianTao | Timestamp | Thời điểm tạo |
| thoiGianCapNhat | Timestamp | Thời điểm cập nhật cuối |

### TAPTIN (Tập tin)
Lưu trữ thông tin tập tin

| Trường dữ liệu | Kiểu dữ liệu | Mô tả |
|----------------|--------------|-------|
| maTapTin | BigInteger | Khóa chính, tự động tăng |
| maNguoiDung | BigInteger | Khóa ngoại liên kết với bảng NGUOIDUNG |
| maToChuc | BigInteger | Khóa ngoại liên kết với bảng TOCHUC |
| tenTapTin | String(255) | Tên tập tin |
| duongDan | String(500) | Đường dẫn tập tin |
| loaiTapTin | String(100) | Loại tập tin |
| kichThuoc | Integer | Kích thước tập tin (byte) |
| thucTheNguon | String(50) | Thực thể nguồn |
| maThucTheNguon | BigInteger | Mã thực thể nguồn |
| thoiGianTao | Timestamp | Thời điểm tạo |

## Quan hệ giữa các bảng

1. Một **TOCHUC** có nhiều **NGUOIDUNG**, **LOPHOC**, **MAUPHIEUTRALOI**, **BAIKIEMTRA**, **CAIDAT**, **TAPTIN**
2. Một **NGUOIDUNG** tạo nhiều **MAUPHIEUTRALOI**, **BAIKIEMTRA**, **TAPTIN**
3. Một **NGUOIDUNG** quản lý nhiều **LOPHOC**
4. Một **LOPHOC** có nhiều **HOCSINH**, được phân công nhiều **BAIKIEMTRA**
5. Một **HOCSINH** có nhiều **PHIEUTRALOI**, **KETQUA**
6. Một **BAIKIEMTRA** có một **DAPAN**, nhiều **PHIEUTRALOI**, nhiều **KETQUA**, nhiều **THONGKEKIEMTRA**
7. Một **PHIEUTRALOI** có một **KETQUA**

## Sử dụng SQLAlchemy

Hệ thống sử dụng SQLAlchemy 2.x với asyncio để tương tác với cơ sở dữ liệu PostgreSQL. Tất cả các model được định nghĩa trong thư mục `app/models`.

## Migrations

Alembic được sử dụng để quản lý migration cơ sở dữ liệu. Các câu lệnh migration cơ bản:

```bash
# Tạo migration mới
alembic revision --autogenerate -m "add column xyz"

# Thực hiện migration
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## Mối quan hệ kế thừa

Các model SQLAlchemy đều kế thừa từ class `Base` được định nghĩa trong module `app.db.session`.

## Thông tin index

Các index được tạo tự động cho các khóa chính và khóa ngoại để tối ưu hiệu năng truy vấn. 