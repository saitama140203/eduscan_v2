from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, or_
from sqlalchemy.exc import IntegrityError
from typing import Optional, Dict, Any, List
from datetime import datetime

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import verify_password, get_password_hash

class UserService:
    @staticmethod
    async def get_by_email(db: AsyncSession, email: str) -> Optional[User]:
        """
        Lấy người dùng theo email
        """
        result = await db.execute(select(User).filter(User.email == email))
        return result.scalars().first()
    
    @staticmethod
    async def get_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
        """
        Lấy người dùng theo ID
        """
        return await db.get(User, user_id)
    
    @staticmethod
    async def authenticate(db: AsyncSession, email: str, password: str) -> Optional[User]:
        """
        Xác thực người dùng với email và mật khẩu
        """
        user = await UserService.get_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.matKhauMaHoa):
            return None
        return user
    
    @staticmethod
    async def create_user(db: AsyncSession, user_in: UserCreate) -> User:
        """
        Tạo người dùng mới
        """
        # Kiểm tra email có tồn tại không
        existing_user = await UserService.get_by_email(db, user_in.email)
        if existing_user:
            raise ValueError("Email đã được sử dụng")
        
        # Tạo hash mật khẩu
        hashed_password = get_password_hash(user_in.password)
        
        # Tạo người dùng mới
        db_user = User(
            email=user_in.email,
            matKhauMaHoa=hashed_password,
            hoTen=user_in.hoTen,
            vaiTro=user_in.vaiTro,
            soDienThoai=user_in.soDienThoai,
            urlAnhDaiDien=user_in.urlAnhDaiDien,
            maToChuc=user_in.maToChuc,
            trangThai=True,  # Mặc định là active
            thoiGianTao=datetime.utcnow(),
            thoiGianCapNhat=datetime.utcnow()
        )
        
        try:
            # Thêm và lưu người dùng vào database
            db.add(db_user)
            await db.commit()
            await db.refresh(db_user)
            return db_user
        except IntegrityError:
            await db.rollback()
            raise ValueError("Lỗi khi tạo người dùng, có thể email đã tồn tại")
    
    @staticmethod
    async def update_user(
        db: AsyncSession, 
        user_id: int, 
        user_in: UserUpdate
    ) -> Optional[User]:
        """
        Cập nhật thông tin người dùng
        """
        # Lấy thông tin người dùng hiện có
        user = await UserService.get_by_id(db, user_id)
        if not user:
            return None
        
        # Chuẩn bị dữ liệu cập nhật
        update_data = user_in.model_dump(exclude_unset=True)
        
        # Cập nhật thời gian
        update_data["thoiGianCapNhat"] = datetime.utcnow()
        
        try:
            # Thực hiện cập nhật
            await db.execute(
                update(User)
                .where(User.maNguoiDung == user_id)
                .values(**update_data)
            )
            await db.commit()
            
            # Lấy người dùng đã cập nhật
            return await UserService.get_by_id(db, user_id)
        except IntegrityError:
            await db.rollback()
            raise ValueError("Lỗi khi cập nhật thông tin người dùng")
    
    @staticmethod
    async def change_password(
        db: AsyncSession,
        user_id: int,
        current_password: str,
        new_password: str
    ) -> bool:
        """
        Thay đổi mật khẩu người dùng
        """
        # Lấy thông tin người dùng
        user = await UserService.get_by_id(db, user_id)
        if not user:
            return False
        
        # Xác minh mật khẩu hiện tại
        if not verify_password(current_password, user.matKhauMaHoa):
            raise ValueError("Mật khẩu hiện tại không đúng")
        
        # Hash mật khẩu mới
        hashed_password = get_password_hash(new_password)
        
        try:
            # Cập nhật mật khẩu
            await db.execute(
                update(User)
                .where(User.maNguoiDung == user_id)
                .values(
                    matKhauMaHoa=hashed_password,
                    thoiGianCapNhat=datetime.utcnow()
                )
            )
            await db.commit()
            return True
        except Exception:
            await db.rollback()
            raise ValueError("Lỗi khi thay đổi mật khẩu")
    
    @staticmethod
    async def reset_password(
        db: AsyncSession,
        email: str,
        new_password: str
    ) -> bool:
        """
        Đặt lại mật khẩu cho người dùng
        """
        # Lấy người dùng theo email
        user = await UserService.get_by_email(db, email)
        if not user:
            return False
        
        # Hash mật khẩu mới
        hashed_password = get_password_hash(new_password)
        
        try:
            # Cập nhật mật khẩu
            await db.execute(
                update(User)
                .where(User.email == email)
                .values(
                    matKhauMaHoa=hashed_password,
                    thoiGianCapNhat=datetime.utcnow()
                )
            )
            await db.commit()
            return True
        except Exception:
            await db.rollback()
            return False
    
    @staticmethod
    async def get_all_users(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
        filters: Dict[str, Any] = None
    ) -> List[User]:
        """
        Lấy danh sách người dùng với các bộ lọc
        """
        query = select(User)
        
        # Thêm các điều kiện lọc nếu có
        if filters:
            conditions = []
            if filters.get("email"):
                conditions.append(User.email.ilike(f"%{filters['email']}%"))
            if filters.get("hoTen"):
                conditions.append(User.hoTen.ilike(f"%{filters['hoTen']}%"))
            if filters.get("vaiTro"):
                conditions.append(User.vaiTro == filters["vaiTro"])
            if filters.get("trangThai") is not None:
                conditions.append(User.trangThai == filters["trangThai"])
            if filters.get("maToChuc"):
                conditions.append(User.maToChuc == filters["maToChuc"])
            
            if conditions:
                query = query.where(or_(*conditions))
        
        # Phân trang
        query = query.offset(skip).limit(limit)
        
        # Thực hiện truy vấn
        result = await db.execute(query)
        return list(result.scalars().all()) 