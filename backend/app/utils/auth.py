from datetime import datetime, timedelta
from typing import Optional, List
from jose import jwt, JWTError

from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext
from fastapi import Request, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import ValidationError

from app.core.config import settings




from app.core.security import verify_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.token import TokenData


# ==================== Password Hashing ====================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Kiểm tra mật khẩu đã nhập có khớp với mật khẩu đã hash hay không"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash mật khẩu sử dụng bcrypt"""
    return pwd_context.hash(password)

# ==================== Token Creation ====================
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if 'sub' in to_encode and to_encode['sub'] is not None:
        to_encode['sub'] = str(to_encode['sub'])
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt

# ==================== Token Extraction ====================
def extract_token_from_request(request: Request) -> Optional[str]:
    """Lấy JWT từ Header (Bearer) hoặc Cookie"""
    # 1. Ưu tiên lấy từ Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ", 1)[1]
    # 2. Nếu không, lấy từ cookie
    token = request.cookies.get("access_token")
    if token:
        return token
    return None

# ==================== User Dependency ====================
# Kiểm tra quyền Admin
async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User:
    token = extract_token_from_request(request)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Chưa đăng nhập hoặc token không hợp lệ",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = verify_token(token)
        token_data = TokenData(
            email=payload.get("sub"),
            user_id=payload.get("user_id"),
            roles=payload.get("roles", []),
        )
        if not token_data.email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token thiếu thông tin email",
            )
    except (JWTError, ValidationError) as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token không hợp lệ: {str(e)}",
        )

    user = None
    # Ưu tiên lấy theo user_id
    if token_data.user_id:
        user = await db.get(User, token_data.user_id)
    # Nếu không có user_id hoặc không tìm thấy, lấy theo email
    if not user and token_data.email:
        result = await db.execute(select(User).where(User.email == token_data.email))
        user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy thông tin người dùng"
        )
    if not user.trangThai:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị vô hiệu hóa"
        )
    return user

async def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    if getattr(current_user, "vaiTro", "").lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không đủ quyền truy cập (admin only)"
        )
    return current_user
# ==================== Active User ====================
async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.trangThai:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị vô hiệu hóa"
        )
    return current_user

# ==================== Role-based Permissions ====================
def check_admin_permission(current_user: User = Depends(get_current_active_user)) -> User:
    if str(getattr(current_user, "vaiTro", "")).upper() != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền truy cập tính năng này. Yêu cầu quyền Admin."
        )
    return current_user

def check_manager_permission(current_user: User = Depends(get_current_active_user)) -> User:
    if str(getattr(current_user, "vaiTro", "")).upper() not in ["ADMIN", "MANAGER"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền truy cập tính năng này. Yêu cầu quyền Manager trở lên."
        )
    return current_user

def check_teacher_permission(current_user: User = Depends(get_current_active_user)) -> User:
    if str(getattr(current_user, "vaiTro", "")).upper() not in ["ADMIN", "MANAGER", "TEACHER"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thực hiện hành động này"
        )
    return current_user

# ==================== Organization Access ====================
def check_organization_access(org_id: int, current_user: User = Depends(get_current_active_user)) -> bool:
    if str(getattr(current_user, "vaiTro", "")).upper() == "ADMIN":
        return True
    if str(getattr(current_user, "vaiTro", "")).upper() == "MANAGER" and current_user.maToChuc == org_id:
        return True
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Bạn không có quyền truy cập tổ chức này"
    )

# ==================== Class Access ====================
def check_class_access(class_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    from app.models.class_room import ClassRoom
    db_class = db.query(ClassRoom).filter(ClassRoom.maLopHoc == class_id).first()
    if not db_class:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy lớp học với ID: {class_id}"
        )
    if str(getattr(current_user, "vaiTro", "")).upper() == "ADMIN":
        return db_class
    if str(getattr(current_user, "vaiTro", "")).upper() == "MANAGER" and current_user.maToChuc == db_class.maToChuc:
        return db_class
    if str(getattr(current_user, "vaiTro", "")).upper() == "TEACHER" and current_user.maNguoiDung == db_class.maGiaoVienChuNhiem:
        return db_class
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Bạn không có quyền truy cập lớp học này"
    )
