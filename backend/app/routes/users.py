from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.user_service import UserService
from app.schemas.user import UserOut, UserCreate, UserUpdate
from app.models.user import User
from app.utils.auth import get_current_active_user, check_admin_permission, check_manager_permission

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}}
)

@router.get("/", response_model=List[UserOut])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(check_manager_permission),
    db: Session = Depends(get_db)
):
    """Lấy danh sách người dùng (yêu cầu quyền Manager trở lên)"""
    users = UserService.get_users(db, skip=skip, limit=limit)
    return users

@router.get("/organization/{org_id}", response_model=List[UserOut])
async def read_users_by_organization(
    org_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(check_manager_permission),
    db: Session = Depends(get_db)
):
    """Lấy danh sách người dùng theo tổ chức (yêu cầu quyền Manager trở lên)"""
    # Nếu không phải Admin, chỉ được xem tổ chức của mình
    if current_user.vaiTro != "Admin" and current_user.maToChuc != org_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền xem người dùng từ tổ chức khác"
        )
        
    users = UserService.get_users_by_organization(db, org_id, skip=skip, limit=limit)
    return users

@router.post("/", response_model=UserOut)
async def create_user(
    user: UserCreate,
    current_user: User = Depends(check_admin_permission),
    db: Session = Depends(get_db)
):
    """Tạo người dùng mới (yêu cầu quyền Admin)"""
    return UserService.create_user(db, user)

@router.get("/{user_id}", response_model=UserOut)
async def read_user(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Lấy thông tin người dùng cụ thể"""
    # Kiểm tra quyền truy cập: Admin có thể xem tất cả, người dùng khác chỉ có thể xem thông tin của mình
    if current_user.vaiTro != "Admin" and current_user.maNguoiDung != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập thông tin của người dùng khác"
        )
        
    db_user = UserService.get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy người dùng với ID: {user_id}"
        )
    return db_user

@router.put("/{user_id}", response_model=UserOut)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Cập nhật thông tin người dùng"""
    # Kiểm tra quyền: Admin có thể cập nhật tất cả, người dùng chỉ có thể cập nhật thông tin của mình
    is_self_update = current_user.maNguoiDung == user_id
    is_admin = current_user.vaiTro == "Admin"
    
    if not (is_self_update or is_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền cập nhật thông tin của người dùng khác"
        )
    
    # Nếu là self-update, chỉ cho phép cập nhật một số thông tin cá nhân
    if is_self_update and not is_admin:
        # Loại bỏ các trường không được phép tự cập nhật
        restricted_fields = ["vaiTro", "maToChuc", "trangThai"]
        update_data = user_update.dict(exclude_unset=True)
        for field in restricted_fields:
            if field in update_data:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Bạn không có quyền cập nhật trường {field}"
                )
    
    return UserService.update_user(db, user_id, user_update)

@router.delete("/{user_id}", response_model=dict)
async def delete_user(
    user_id: int,
    current_user: User = Depends(check_admin_permission),
    db: Session = Depends(get_db)
):
    """Xóa người dùng (yêu cầu quyền Admin)"""
    # Không cho phép tự xóa tài khoản của chính mình
    if current_user.maNguoiDung == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể xóa tài khoản của chính bạn"
        )
        
    UserService.delete_user(db, user_id)
    return {"message": f"Đã xóa người dùng với ID: {user_id}"} 