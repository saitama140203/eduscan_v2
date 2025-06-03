from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.services.user_service import UserService
from app.schemas.user import UserOut, UserCreate, UserUpdate
from app.models.user import User
from app.utils.auth import get_current_active_user, check_admin_permission, check_manager_permission
from app.services.organization_service import OrganizationService
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
    db: AsyncSession = Depends(get_db)
):
    return await UserService.get_all_users_with_org(db, skip=skip, limit=limit)

@router.get("/organization/{org_id}", response_model=List[UserOut])
async def read_users_by_organization(
    org_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(check_manager_permission),
    db: AsyncSession = Depends(get_db)
):
    if current_user.vaiTro == "ADMIN":
        return await UserService.get_users_by_organization(db, org_id, skip, limit)
    elif current_user.vaiTro == "MANAGER":
        if current_user.maToChuc != org_id:
            raise HTTPException(status_code=403, detail="Không có quyền xem tổ chức khác")
        return await UserService.get_users_by_organization(db, org_id, skip, limit)
    else:
        raise HTTPException(status_code=403, detail="Không có quyền")

@router.post("/", response_model=UserOut)
async def create_user( 
    user: UserCreate,
    current_user: User = Depends(check_admin_permission),
    db: AsyncSession = Depends(get_db)
):
    return await UserService.create_user(db, user)

@router.get("/{user_id}", response_model=UserOut)
async def read_user(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.vaiTro != "ADMIN" and current_user.maNguoiDung != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập thông tin người dùng khác"
        )
    user = await UserService.get_user_with_org(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Không tìm thấy người dùng với ID: {user_id}")
    return user

@router.put("/{user_id}", response_model=UserOut)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    is_self_update = current_user.maNguoiDung == user_id
    is_admin = current_user.vaiTro == "ADMIN"
    if not (is_self_update or is_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền cập nhật thông tin người dùng khác"
        )
    if is_self_update and not is_admin:
        restricted_fields = ["vaiTro", "maToChuc", "trangThai"]
        update_data = user_update.dict(exclude_unset=True)
        for field in restricted_fields:
            if field in update_data:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Không thể cập nhật trường {field}"
                )
    user = await UserService.update_user(db, user_id, user_update)
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy user")
    return user

@router.delete("/{user_id}", response_model=dict)
async def delete_user(
    user_id: int,
    current_user: User = Depends(check_admin_permission),
    db: AsyncSession = Depends(get_db)
):
    if current_user.maNguoiDung == user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Không thể xóa tài khoản của chính bạn")
    await UserService.deactivate_user(db, user_id)
    return {"message": f"Đã xóa người dùng với ID: {user_id}"}
