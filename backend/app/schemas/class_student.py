from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List
from datetime import datetime, date

# --- CLASS SCHEMAS ---

# Base Class Schema
class ClassBase(BaseModel):
    tenLop: str = Field(..., min_length=2, max_length=100)
    maToChuc: int
    capHoc: Optional[str] = None
    namHoc: Optional[str] = None
    maGiaoVienChuNhiem: Optional[int] = None
    moTa: Optional[str] = None

# Schema cho việc tạo lớp học mới
class ClassCreate(ClassBase):
    pass

# Schema cho việc cập nhật lớp học
class ClassUpdate(BaseModel):
    tenLop: Optional[str] = Field(None, min_length=2, max_length=100)
    capHoc: Optional[str] = None
    namHoc: Optional[str] = None
    maGiaoVienChuNhiem: Optional[int] = None
    moTa: Optional[str] = None
    trangThai: Optional[bool] = None

# Schema đầu ra - thông tin trả về frontend
class ClassOut(ClassBase):
    maLopHoc: int
    trangThai: bool
    thoiGianTao: datetime
    thoiGianCapNhat: datetime
    tenGiaoVienChuNhiem: Optional[str] = None
    total_students: Optional[int] = None
    
    class Config:
        from_attributes = True

# Schema đầu ra có thêm thông tin chi tiết
class ClassDetail(ClassOut):
    total_students: Optional[int] = None
    
    class Config:
        from_attributes = True

# --- STUDENT SCHEMAS ---

# Base Student Schema
class StudentBase(BaseModel):
    maLopHoc: int
    maHocSinhTruong: str = Field(..., min_length=1, max_length=50)
    hoTen: str = Field(..., min_length=2, max_length=255)
    ngaySinh: Optional[date] = None
    gioiTinh: Optional[str] = Field(None, pattern="^(Nam|Nữ|Khác)$")
    soDienThoaiPhuHuynh: Optional[str] = Field(None, min_length=10, max_length=20)
    emailPhuHuynh: Optional[EmailStr] = None

# Schema cho việc tạo học sinh mới
class StudentCreate(StudentBase):
    pass

# Schema cho việc tạo nhiều học sinh cùng lúc
class StudentBatchCreate(BaseModel):
    students: List[StudentCreate]

# Schema cho việc cập nhật học sinh
class StudentUpdate(BaseModel):
    maHocSinhTruong: Optional[str] = Field(None, min_length=1, max_length=50)
    hoTen: Optional[str] = Field(None, min_length=2, max_length=255)
    ngaySinh: Optional[date] = None
    gioiTinh: Optional[str] = Field(None, pattern="^(Nam|Nữ|Khác)$")
    soDienThoaiPhuHuynh: Optional[str] = Field(None, min_length=10, max_length=20)
    emailPhuHuynh: Optional[EmailStr] = None
    trangThai: Optional[bool] = None

# Schema đầu ra - thông tin trả về frontend
class StudentOut(StudentBase):
    maHocSinh: int
    trangThai: bool
    thoiGianTao: datetime
    thoiGianCapNhat: datetime
    
    class Config:
        from_attributes = True

# Schema cho việc chuyển lớp học sinh
class StudentTransfer(BaseModel):
    maHocSinhList: List[int]
    maLopHocMoi: int
    
    @validator('maHocSinhList')
    def validate_student_list(cls, v):
        if not v or len(v) == 0:
            raise ValueError('Danh sách học sinh không được trống')
        return v 