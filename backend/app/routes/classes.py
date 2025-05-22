from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.class_service import ClassService
from app.schemas.class_student import ClassOut, ClassCreate, ClassUpdate, ClassDetail
from app.models.user import User
from app.utils.auth import (
    get_current_active_user, 
    check_admin_permission, 
    check_manager_permission, 
    check_teacher_permission,
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
    db: Session = Depends(get_db)
):
    """Lấy danh sách lớp học"""
    # Quyền truy cập: 
    # - Admin có thể xem tất cả lớp học hoặc lọc theo tổ chức/giáo viên
    # - Manager chỉ có thể xem lớp học của tổ chức của mình
    # - Teacher chỉ có thể xem lớp học của mình
    
    if current_user.vaiTro == "ADMIN":
        # Admin có thể xem tất cả, hoặc lọc theo org_id/teacher_id nếu có
        classes = ClassService.get_classes(db, org_id=org_id, teacher_id=teacher_id, skip=skip, limit=limit)
    
    elif current_user.vaiTro == "MANAGER":
        # Manager chỉ có thể xem lớp học trong tổ chức của mình
        if org_id and org_id != current_user.maToChuc:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bạn không có quyền xem lớp học từ tổ chức khác"
            )
        
        # Nếu có teacher_id, kiểm tra giáo viên thuộc tổ chức của manager
        if teacher_id:
            teacher = db.query(User).filter(User.maNguoiDung == teacher_id).first()
            if not teacher or teacher.maToChuc != current_user.maToChuc:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Bạn không có quyền xem lớp học của giáo viên từ tổ chức khác"
                )
                
        classes = ClassService.get_classes(
            db, 
            org_id=current_user.maToChuc, 
            teacher_id=teacher_id, 
            search=search,
            skip=skip, 
            limit=limit
        )
    
    else:  # Teacher
        # Teacher chỉ có thể xem lớp học của mình
        classes = ClassService.get_classes(
            db, 
            teacher_id=current_user.maNguoiDung, 
            search=search,
            skip=skip, 
            limit=limit
        )
    
    return classes

@router.post("/", response_model=ClassOut, status_code=status.HTTP_201_CREATED)
async def create_class(
    class_create: ClassCreate,
    current_user: User = Depends(check_manager_permission),  # Yêu cầu quyền Manager trở lên
    db: Session = Depends(get_db)
):
    """Tạo lớp học mới"""
    # Kiểm tra quyền: Admin có thể tạo lớp cho bất kỳ tổ chức nào, Manager chỉ tạo cho tổ chức của mình
    if current_user.vaiTro != "ADMIN" and class_create.maToChuc != current_user.maToChuc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền tạo lớp học cho tổ chức khác"
        )
    
    # Teacher chỉ có thể tạo lớp cho tổ chức của mình và mặc định họ là GVCN
    if current_user.vaiTro == "TEACHER":
        # Ghi đè maToChuc
        class_create.maToChuc = current_user.maToChuc
        # Thiết lập giáo viên chủ nhiệm là người tạo
        class_create.maGiaoVienChuNhiem = current_user.maNguoiDung
        
    new_class = ClassService.create_class(db, class_create)
    return new_class

@router.get("/{class_id}", response_model=ClassDetail)
async def read_class(
    class_id: int,
    db: Session = Depends(get_db),
    # Sử dụng middleware kiểm tra quyền truy cập lớp học
    db_class = Depends(check_class_access)
):
    """Lấy thông tin chi tiết lớp học cụ thể"""
    # Quyền truy cập đã được kiểm tra qua middleware check_class_access
    class_detail = ClassService.get_class_detail(db, class_id)
    return class_detail

@router.put("/{class_id}", response_model=ClassOut)
async def update_class(
    class_id: int,
    class_update: ClassUpdate,
    db: Session = Depends(get_db),
    # Sử dụng middleware kiểm tra quyền truy cập lớp học
    db_class = Depends(check_class_access)
):
    """Cập nhật thông tin lớp học"""
    # Quyền truy cập đã được kiểm tra qua middleware check_class_access
    updated_class = ClassService.update_class(db, class_id, class_update)
    return updated_class

@router.delete("/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_class(
    class_id: int,
    db: Session = Depends(get_db),
    # Sử dụng middleware kiểm tra quyền truy cập lớp học
    db_class = Depends(check_class_access)
):
    """Xóa lớp học"""
    # Quyền truy cập đã được kiểm tra qua middleware check_class_access
    ClassService.delete_class(db, class_id)
    return {"message": "Lớp học đã được xóa thành công"} 