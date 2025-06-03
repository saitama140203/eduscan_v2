from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List
from datetime import datetime, date

# --- CLASS SCHEMAS ---
class ClassBase(BaseModel):
    tenLop: str = Field(..., min_length=2, max_length=100)
    maToChuc: int
    capHoc: Optional[str] = None
    namHoc: Optional[str] = None
    maGiaoVienChuNhiem: Optional[int] = None
    moTa: Optional[str] = None

class ClassCreate(ClassBase):
    pass

class ClassUpdate(BaseModel):
    tenLop: Optional[str] = Field(None, min_length=2, max_length=100)
    capHoc: Optional[str] = None
    namHoc: Optional[str] = None
    maGiaoVienChuNhiem: Optional[int] = None
    moTa: Optional[str] = None
    trangThai: Optional[bool] = None

class ClassOut(ClassBase):
    maLopHoc: int
    trangThai: bool
    thoiGianTao: datetime
    thoiGianCapNhat: datetime
    tenGiaoVienChuNhiem: Optional[str] = None
    tenToChuc: Optional[str] = None
    total_students: Optional[int] = None
    
    class Config:
        from_attributes = True

class ClassDetail(ClassOut):
    tenToChuc: Optional[str] = None
    total_students: Optional[int] = None
    class Config:
        from_attributes = True

# --- STUDENT SCHEMAS ---
class StudentBase(BaseModel):
    maLopHoc: int
    maHocSinhTruong: str = Field(..., min_length=1, max_length=50)
    hoTen: str = Field(..., min_length=2, max_length=255)
    ngaySinh: Optional[date] = None
    gioiTinh: Optional[str] = Field(None, pattern="^(Nam|Nữ|Khác)$")
    soDienThoaiPhuHuynh: Optional[str] = Field(None, min_length=10, max_length=20)
    emailPhuHuynh: Optional[EmailStr] = None

class StudentCreate(StudentBase):
    pass

class StudentBatchCreate(BaseModel):
    students: List[StudentCreate]

class StudentUpdate(BaseModel):
    maHocSinhTruong: Optional[str] = Field(None, min_length=1, max_length=50)
    hoTen: Optional[str] = Field(None, min_length=2, max_length=255)
    ngaySinh: Optional[date] = None
    gioiTinh: Optional[str] = Field(None, pattern="^(Nam|Nữ|Khác)$")
    soDienThoaiPhuHuynh: Optional[str] = Field(None, min_length=10, max_length=20)
    emailPhuHuynh: Optional[EmailStr] = None
    trangThai: Optional[bool] = None

class StudentOut(StudentBase):
    maHocSinh: int
    trangThai: bool
    thoiGianTao: datetime
    thoiGianCapNhat: datetime
    
    class Config:
        from_attributes = True

class StudentTransfer(BaseModel):
    maHocSinhList: List[int]
    maLopHocMoi: int
    
    @validator('maHocSinhList')
    def validate_student_list(cls, v):
        if not v or len(v) == 0:
            raise ValueError('Danh sách học sinh không được trống')
        return v 
