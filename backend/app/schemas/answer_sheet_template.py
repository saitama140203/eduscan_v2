from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime

class AnswerSheetTemplateBase(BaseModel):
    maToChuc: int
    maNguoiTao: int
    tenMauPhieu: str = Field(..., max_length=255)
    soCauHoi: int
    soLuaChonMoiCau: int = 4
    khoGiay: str = "A4"
    coTuLuan: bool = False
    coThongTinHocSinh: bool = True
    coLogo: bool = False
    cauTrucJson: Optional[Any] = None
    cssFormat: Optional[str] = None
    laMacDinh: bool = False
    laCongKhai: bool = False

class AnswerSheetTemplateCreate(AnswerSheetTemplateBase):
    pass

class AnswerSheetTemplateUpdate(BaseModel):
    tenMauPhieu: Optional[str] = None
    soCauHoi: Optional[int] = None
    soLuaChonMoiCau: Optional[int] = None
    khoGiay: Optional[str] = None
    coTuLuan: Optional[bool] = None
    coThongTinHocSinh: Optional[bool] = None
    coLogo: Optional[bool] = None
    cauTrucJson: Optional[Any] = None
    cssFormat: Optional[str] = None
    laMacDinh: Optional[bool] = None
    laCongKhai: Optional[bool] = None

class AnswerSheetTemplateOut(AnswerSheetTemplateBase):
    maMauPhieu: int
    thoiGianTao: datetime
    thoiGianCapNhat: datetime

    class Config:
        from_attributes = True
