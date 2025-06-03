from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.services.class_service import ClassService
from app.services.class_analytics_service import ClassAnalyticsService
from app.services.class_settings_service import ClassSettingsService
from app.schemas.class_student import ClassOut, ClassCreate, ClassUpdate, ClassDetail
from app.schemas.class_analytics import ClassAnalytics, AnalyticsFilters
from app.schemas.class_settings import ClassSettingsOut, ClassSettingsUpdate
from app.models.user import User
from app.utils.auth import (
    get_current_active_user, 
    check_manager_permission, 
    check_class_access
)

router = APIRouter(
    prefix="/classes",
    tags=["classes"],
    responses={404: {"description": "Not found"}}
)

@router.get("/", response_model=List[ClassOut])
async def read_classes(
    org_id: Optional[int] = None,
    teacher_id: Optional[int] = None,
    search: Optional[str] = Query(None, description="Tìm kiếm theo tên lớp"),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Lấy danh sách lớp học.
    Quyền truy cập:
    - Admin: xem tất cả, hoặc lọc theo org_id/teacher_id nếu có
    - Manager: chỉ xem lớp học của tổ chức mình
    - Teacher: chỉ xem lớp học mình chủ nhiệm
    """
    if current_user.vaiTro == "ADMIN":
        classes = await ClassService.get_list(
            db, 
            maToChuc=org_id, 
            maGiaoVien=teacher_id, 
            search=search, 
            skip=skip, 
            limit=limit
        )
    elif current_user.vaiTro == "MANAGER":
        # Kiểm tra quyền tổ chức
        if org_id and org_id != current_user.maToChuc:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bạn không có quyền xem lớp học từ tổ chức khác"
            )
        classes = await ClassService.get_list(
            db,
            maToChuc=current_user.maToChuc,
            maGiaoVien=teacher_id,
            search=search,
            skip=skip,
            limit=limit
        )
    else:  # TEACHER
        classes = await ClassService.get_list(
            db, 
            maGiaoVien=current_user.maNguoiDung, 
            search=search,
            skip=skip, 
            limit=limit
        )
    return classes

@router.post("/", response_model=ClassOut, status_code=status.HTTP_201_CREATED)
async def create_class(
    class_create: ClassCreate,
    current_user: User = Depends(check_manager_permission),  # Chỉ manager trở lên
    db: AsyncSession = Depends(get_db)
):
    """Tạo lớp học mới"""
    # Kiểm tra quyền tổ chức
    if current_user.vaiTro != "ADMIN" and class_create.maToChuc != current_user.maToChuc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền tạo lớp học cho tổ chức khác"
        )
    if current_user.vaiTro == "TEACHER":
        class_create.maToChuc = current_user.maToChuc
        class_create.maGiaoVienChuNhiem = current_user.maNguoiDung
    new_class = await ClassService.create_class(db, class_create)
    return new_class

@router.get("/{class_id}", response_model=ClassDetail)
async def read_class(
    class_id: int,
    db: AsyncSession = Depends(get_db),
    db_class=Depends(check_class_access)
):
    """Lấy thông tin chi tiết lớp học cụ thể"""
    class_detail = await ClassService.get_class_detail(db, class_id)
    return class_detail

@router.put("/{class_id}", response_model=ClassOut)
async def update_class(
    class_id: int,
    class_update: ClassUpdate,
    db: AsyncSession = Depends(get_db),
    db_class=Depends(check_class_access)
):
    """Cập nhật thông tin lớp học"""
    updated_class = await ClassService.update_class(db, class_id, class_update)
    return updated_class

@router.delete("/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_class(
    class_id: int,
    db: AsyncSession = Depends(get_db),
    db_class=Depends(check_class_access)
):
    """Xóa lớp học"""
    await ClassService.delete_class(db, class_id)
    return {"message": "Lớp học đã được xóa thành công"}

@router.get("/{class_id}/analytics", response_model=ClassAnalytics)
async def get_class_analytics(
    class_id: int,
    period: Optional[str] = Query("all", description="Khoảng thời gian: all, semester1, semester2, recent"),
    metric: Optional[str] = Query("average", description="Chỉ số: average, pass_rate, participation, improvement"),
    db: AsyncSession = Depends(get_db),
    db_class=Depends(check_class_access)
):
    """Lấy thống kê phân tích cho lớp học"""
    filters = AnalyticsFilters(period=period, metric=metric)
    analytics = await ClassAnalyticsService.get_class_analytics(db, class_id, filters)
    return analytics

@router.get("/{class_id}/settings", response_model=ClassSettingsOut)
async def get_class_settings(
    class_id: int,
    db: AsyncSession = Depends(get_db),
    db_class=Depends(check_class_access)
):
    """Lấy cài đặt lớp học"""
    settings = await ClassSettingsService.get_class_settings(db, class_id)
    return settings

@router.put("/{class_id}/settings", response_model=ClassSettingsOut)
async def update_class_settings(
    class_id: int,
    settings_update: ClassSettingsUpdate,
    db: AsyncSession = Depends(get_db),
    db_class=Depends(check_class_access)
):
    """Cập nhật cài đặt lớp học"""
    settings = await ClassSettingsService.update_class_settings(db, class_id, settings_update)
    return settings
