from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from typing import Optional, List, Dict, Any
from datetime import datetime

from app.models.student import Student
from app.models.class_room import ClassRoom
from app.schemas.class_student import StudentCreate, StudentUpdate, StudentBatchCreate, StudentTransfer

class StudentService:
    @staticmethod
    async def create_student(db: AsyncSession, student_create: StudentCreate) -> Student:
        # Kiểm tra lớp học tồn tại
        stmt = select(ClassRoom).where(
            ClassRoom.maLopHoc == student_create.maLopHoc,
            ClassRoom.trangThai == True
        )
        result = await db.execute(stmt)
        db_class = result.scalars().first()
        
        if not db_class:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy lớp học với ID: {student_create.maLopHoc} hoặc lớp không hoạt động"
            )
        
        # Kiểm tra mã học sinh đã tồn tại trong lớp chưa
        stmt = select(Student).where(
            Student.maLopHoc == student_create.maLopHoc,
            Student.maHocSinhTruong == student_create.maHocSinhTruong
        )
        result = await db.execute(stmt)
        db_student = result.scalars().first()
        
        if db_student:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Mã học sinh {student_create.maHocSinhTruong} đã tồn tại trong lớp này"
            )
        
        # Tạo học sinh mới
        db_student = Student(
            maLopHoc=student_create.maLopHoc,
            maHocSinhTruong=student_create.maHocSinhTruong,
            hoTen=student_create.hoTen,
            ngaySinh=student_create.ngaySinh,
            gioiTinh=student_create.gioiTinh,
            soDienThoaiPhuHuynh=student_create.soDienThoaiPhuHuynh,
            emailPhuHuynh=student_create.emailPhuHuynh,
            trangThai=True
        )
        
        # Thêm vào DB và commit
        db.add(db_student)
        
        try:
            await db.commit()
            await db.refresh(db_student)
        except IntegrityError:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Mã học sinh {student_create.maHocSinhTruong} đã tồn tại trong lớp này"
            )
        
        return db_student
    
    @staticmethod
    async def create_students_batch(db: AsyncSession, student_batch: StudentBatchCreate) -> List[Student]:
        """Tạo nhiều học sinh cùng lúc"""
        created_students = []
        
        # Validate lớp học
        class_ids = set(student.maLopHoc for student in student_batch.students)
        for class_id in class_ids:
            stmt = select(ClassRoom).where(
                ClassRoom.maLopHoc == class_id,
                ClassRoom.trangThai == True
            )
            result = await db.execute(stmt)
            db_class = result.scalars().first()
            
            if not db_class:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Không tìm thấy lớp học với ID: {class_id} hoặc lớp không hoạt động"
                )
                
        # Check for duplicate student IDs within the same class
        student_ids_by_class = {}
        for student in student_batch.students:
            if student.maLopHoc not in student_ids_by_class:
                student_ids_by_class[student.maLopHoc] = set()
            
            if student.maHocSinhTruong in student_ids_by_class[student.maLopHoc]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Mã học sinh {student.maHocSinhTruong} bị trùng lặp trong lớp {student.maLopHoc}"
                )
            
            student_ids_by_class[student.maLopHoc].add(student.maHocSinhTruong)
        
        # Check for existing student IDs in database
        for class_id, student_ids in student_ids_by_class.items():
            stmt = select(Student.maHocSinhTruong).where(
                Student.maLopHoc == class_id,
                Student.maHocSinhTruong.in_(student_ids)
            )
            result = await db.execute(stmt)
            existing_students = result.scalars().all()
            
            if existing_students:
                existing_ids = list(existing_students)
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Mã học sinh {', '.join(existing_ids)} đã tồn tại trong lớp {class_id}"
                )
        
        # Create students
        for student_create in student_batch.students:
            db_student = Student(
                maLopHoc=student_create.maLopHoc,
                maHocSinhTruong=student_create.maHocSinhTruong,
                hoTen=student_create.hoTen,
                ngaySinh=student_create.ngaySinh,
                gioiTinh=student_create.gioiTinh,
                soDienThoaiPhuHuynh=student_create.soDienThoaiPhuHuynh,
                emailPhuHuynh=student_create.emailPhuHuynh,
                trangThai=True
            )
            db.add(db_student)
            created_students.append(db_student)
        
        try:
            await db.commit()
            for student in created_students:
                await db.refresh(student)
        except IntegrityError as e:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Lỗi khi thêm học sinh, có thể do mã học sinh trùng lặp: {str(e)}"
            )
        
        return created_students
    
    @staticmethod
    async def get_student_by_id(db: AsyncSession, student_id: int) -> Optional[Student]:
        stmt = select(Student).where(Student.maHocSinh == student_id)
        result = await db.execute(stmt)
        return result.scalars().first()
    
    @staticmethod
    async def get_student_by_school_id(db: AsyncSession, class_id: int, school_id: str) -> Optional[Student]:
        stmt = select(Student).where(
            Student.maLopHoc == class_id, 
            Student.maHocSinhTruong == school_id
        )
        result = await db.execute(stmt)
        return result.scalars().first()
    
    @staticmethod
    async def get_students_by_class(db: AsyncSession, class_id: int, 
                             skip: int = 0, limit: int = 100,
                             search: Optional[str] = None) -> List[Student]:
        stmt = select(Student).where(Student.maLopHoc == class_id)
        
        # Search by name or school ID
        if search:
            search_term = f"%{search}%"
            stmt = stmt.where(
                (Student.hoTen.ilike(search_term)) | 
                (Student.maHocSinhTruong.ilike(search_term))
            )
            
        stmt = stmt.offset(skip).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()
    
    @staticmethod
    async def update_student(db: AsyncSession, student_id: int, student_update: StudentUpdate) -> Student:
        # Tìm học sinh cần cập nhật
        db_student = await StudentService.get_student_by_id(db, student_id)
        if not db_student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy học sinh với ID: {student_id}"
            )
        
        # Kiểm tra trùng mã học sinh trong lớp nếu có thay đổi
        if student_update.maHocSinhTruong and student_update.maHocSinhTruong != db_student.maHocSinhTruong:
            stmt = select(Student).where(
                Student.maLopHoc == db_student.maLopHoc,
                Student.maHocSinhTruong == student_update.maHocSinhTruong,
                Student.maHocSinh != student_id
            )
            result = await db.execute(stmt)
            existing = result.scalars().first()
            
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Mã học sinh {student_update.maHocSinhTruong} đã tồn tại trong lớp này"
                )
        
        # Cập nhật thông tin
        update_data = student_update.dict(exclude_unset=True)
        
        for key, value in update_data.items():
            setattr(db_student, key, value)
        
        # Cập nhật thời gian
        db_student.thoiGianCapNhat = datetime.now()
        
        try:
            await db.commit()
            await db.refresh(db_student)
        except IntegrityError:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Lỗi khi cập nhật học sinh"
            )
        
        return db_student
    
    @staticmethod
    async def delete_student(db: AsyncSession, student_id: int) -> bool:
        # Tìm học sinh
        db_student = await StudentService.get_student_by_id(db, student_id)
        if not db_student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy học sinh với ID: {student_id}"
            )
        
        # Xóa mềm - set trangThai = False
        db_student.trangThai = False
        db_student.thoiGianCapNhat = datetime.now()
        
        await db.commit()
        return True
    
    @staticmethod
    async def transfer_students(db: AsyncSession, transfer_data: StudentTransfer) -> List[Student]:
        """Chuyển học sinh sang lớp mới"""
        transferred_students = []
        
        # Kiểm tra lớp đích tồn tại
        stmt = select(ClassRoom).where(
            ClassRoom.maLopHoc == transfer_data.maLopHocMoi,
            ClassRoom.trangThai == True
        )
        result = await db.execute(stmt)
        target_class = result.scalars().first()
        
        if not target_class:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy lớp học đích với ID: {transfer_data.maLopHocMoi}"
            )
        
        # Cập nhật lớp học cho từng học sinh
        for student_id in transfer_data.maHocSinhList:
            db_student = await StudentService.get_student_by_id(db, student_id)
            if db_student:
                db_student.maLopHoc = transfer_data.maLopHocMoi
                db_student.thoiGianCapNhat = datetime.now()
                transferred_students.append(db_student)
        
        await db.commit()
        
        for student in transferred_students:        
                await db.refresh(student)
        
        return transferred_students 