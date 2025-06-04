from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional


class ExamBase(BaseModel):
    maToChuc: int
    maNguoiTao: int
    maMauPhieu: Optional[int] = None
    tieuDe: str = Field(..., max_length=255)
    monHoc: str = Field(..., max_length=100)
    ngayThi: Optional[date] = None
    thoiGianLamBai: Optional[int] = None
    tongSoCau: int
    tongDiem: float = 10.0
    moTa: Optional[str] = None
    laDeTongHop: Optional[bool] = False


class ExamCreate(ExamBase):
    pass


class ExamUpdate(BaseModel):
    maToChuc: Optional[int] = None
    maNguoiTao: Optional[int] = None
    maMauPhieu: Optional[int] = None
    tieuDe: Optional[str] = Field(None, max_length=255)
    monHoc: Optional[str] = Field(None, max_length=100)
    ngayThi: Optional[date] = None
    thoiGianLamBai: Optional[int] = None
    tongSoCau: Optional[int] = None
    tongDiem: Optional[float] = None
    moTa: Optional[str] = None
    laDeTongHop: Optional[bool] = None
    trangThai: Optional[str] = None


class ExamOut(ExamBase):
    maBaiKiemTra: int
    trangThai: str
    thoiGianTao: datetime
    thoiGianCapNhat: datetime

    class Config:
        from_attributes = True
