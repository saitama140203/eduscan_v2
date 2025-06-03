from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload
from app.models.class_room import ClassRoom
from app.models.user import User
from app.models.student import Student
from app.models.organization import Organization
from app.schemas.class_student import ClassCreate, ClassUpdate, ClassOut, ClassDetail
from fastapi import HTTPException, status

class ClassService:
    @staticmethod
    async def get_list(
        db: AsyncSession, 
        maToChuc: int = None, 
        maGiaoVien: int = None, 
        search: str = None, 
        skip: int = 0, 
        limit: int = 100
    ):
        # Subquery để count students cho mỗi class
        student_count_subq = (
            select(
                Student.maLopHoc, 
                func.count(Student.maHocSinh).label('total_students')
            )
            .where(Student.trangThai == True)
            .group_by(Student.maLopHoc)
            .subquery()
        )
        
        # Main query với left join để có cả classes không có students
        stmt = (
            select(
                ClassRoom,
                func.coalesce(student_count_subq.c.total_students, 0).label('total_students')
            )
            .outerjoin(student_count_subq, ClassRoom.maLopHoc == student_count_subq.c.maLopHoc)
            .where(ClassRoom.trangThai == True)
        )
        
        if maToChuc:
            stmt = stmt.where(ClassRoom.maToChuc == maToChuc)
        if maGiaoVien:
            stmt = stmt.where(ClassRoom.maGiaoVienChuNhiem == maGiaoVien)
        if search:
            stmt = stmt.where(ClassRoom.tenLop.ilike(f"%{search}%"))
            
        stmt = stmt.offset(skip).limit(limit)
        stmt = stmt.options(
            joinedload(ClassRoom.giaoVienChuNhiem),
            joinedload(ClassRoom.toChuc)
        )

        result = await db.execute(stmt)
        rows = result.all()

        out_list = []
        for row in rows:
            class_obj = row[0]  # ClassRoom object
            total_students = row[1]  # student count
            
            tenGiaoVien = class_obj.giaoVienChuNhiem.hoTen if class_obj.giaoVienChuNhiem else None
            tenToChuc = class_obj.toChuc.tenToChuc if class_obj.toChuc else None
            
            out = ClassOut(
                **class_obj.__dict__,
                tenGiaoVienChuNhiem=tenGiaoVien,
                tenToChuc=tenToChuc,
                total_students=total_students
            )
            out_list.append(out)
        return out_list

    @staticmethod
    async def get_class_detail(db: AsyncSession, class_id: int):
        # Count students for this specific class
        student_count_stmt = (
            select(func.count(Student.maHocSinh))
            .where(Student.maLopHoc == class_id, Student.trangThai == True)
        )
        student_count_result = await db.execute(student_count_stmt)
        total_students = student_count_result.scalar() or 0
        
        stmt = select(ClassRoom).where(ClassRoom.maLopHoc == class_id)
        stmt = stmt.options(
            joinedload(ClassRoom.giaoVienChuNhiem),
            joinedload(ClassRoom.toChuc)
        )
        result = await db.execute(stmt)
        c = result.scalars().first()
        if not c:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lớp học không tồn tại."
            )
        tenGiaoVien = c.giaoVienChuNhiem.hoTen if c.giaoVienChuNhiem else None
        tenToChuc = c.toChuc.tenToChuc if c.toChuc else None
        
        out = ClassDetail(
            **c.__dict__,
            tenGiaoVienChuNhiem=tenGiaoVien,
            tenToChuc=tenToChuc,
            total_students=total_students
        )
        return out

    @staticmethod
    async def create_class(db: AsyncSession, class_create: ClassCreate):
        stmt = select(ClassRoom).where(
            ClassRoom.maToChuc == class_create.maToChuc,
            ClassRoom.tenLop == class_create.tenLop,
            ClassRoom.namHoc == class_create.namHoc,
            ClassRoom.trangThai == True
        )
        result = await db.execute(stmt)
        exists = result.scalars().first()
        if exists:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, 
                detail="Lớp học đã tồn tại trong tổ chức và năm học này."
            )
        new_class = ClassRoom(**class_create.dict())
        db.add(new_class)
        await db.commit()
        await db.refresh(new_class)
        return new_class

    @staticmethod
    async def update_class(db: AsyncSession, maLopHoc: int, class_update: ClassUpdate):
        stmt = select(ClassRoom).where(
            ClassRoom.maLopHoc == maLopHoc,
            ClassRoom.trangThai == True
        )
        result = await db.execute(stmt)
        db_class = result.scalars().first()
        if not db_class:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lớp học không tồn tại hoặc đã bị khóa."
            )
        for attr, value in class_update.dict(exclude_unset=True).items():
            setattr(db_class, attr, value)
        await db.commit()
        await db.refresh(db_class)
        return db_class

    @staticmethod
    async def delete_class(db: AsyncSession, maLopHoc: int):
        stmt = select(ClassRoom).where(
            ClassRoom.maLopHoc == maLopHoc,
            ClassRoom.trangThai == True
        )
        result = await db.execute(stmt)
        db_class = result.scalars().first()
        if not db_class:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lớp học không tồn tại hoặc đã bị khóa."
            )
        db_class.trangThai = False  # Xóa mềm
        await db.commit()
        return db_class
