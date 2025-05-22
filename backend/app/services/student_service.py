from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from typing import Optional, List, Dict, Any
from datetime import datetime

from app.models.student import Student
from app.models.class_room import ClassRoom
from app.schemas.class_student import StudentCreate, StudentUpdate, StudentBatchCreate, StudentTransfer

class StudentService:
    @staticmethod
    def create_student(db: Session, student_create: StudentCreate) -> Student:
        # Kiểm tra lớp học tồn tại
        db_class = db.query(ClassRoom).filter(
            ClassRoom.maLopHoc == student_create.maLopHoc,
            ClassRoom.trangThai == True
        ).first()
        
        if not db_class:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy lớp học với ID: {student_create.maLopHoc} hoặc lớp không hoạt động"
            )
        
        # Kiểm tra mã học sinh đã tồn tại trong lớp chưa
        db_student = db.query(Student).filter(
            Student.maLopHoc == student_create.maLopHoc,
            Student.maHocSinhTruong == student_create.maHocSinhTruong
        ).first()
        
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
            db.commit()
            db.refresh(db_student)
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Mã học sinh {student_create.maHocSinhTruong} đã tồn tại trong lớp này"
            )
        
        return db_student
    
    @staticmethod
    def create_students_batch(db: Session, student_batch: StudentBatchCreate) -> List[Student]:
        """Tạo nhiều học sinh cùng lúc"""
        created_students = []
        
        # Validate lớp học
        class_ids = set(student.maLopHoc for student in student_batch.students)
        for class_id in class_ids:
            db_class = db.query(ClassRoom).filter(
                ClassRoom.maLopHoc == class_id,
                ClassRoom.trangThai == True
            ).first()
            
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
            existing_students = db.query(Student.maHocSinhTruong).filter(
                Student.maLopHoc == class_id,
                Student.maHocSinhTruong.in_(student_ids)
            ).all()
            
            if existing_students:
                existing_ids = [s.maHocSinhTruong for s in existing_students]
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
            db.commit()
            for student in created_students:
                db.refresh(student)
        except IntegrityError as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Lỗi khi thêm học sinh, có thể do mã học sinh trùng lặp: {str(e)}"
            )
        
        return created_students
    
    @staticmethod
    def get_student_by_id(db: Session, student_id: int) -> Optional[Student]:
        return db.query(Student).filter(Student.maHocSinh == student_id).first()
    
    @staticmethod
    def get_student_by_school_id(db: Session, class_id: int, school_id: str) -> Optional[Student]:
        return db.query(Student).filter(
            Student.maLopHoc == class_id, 
            Student.maHocSinhTruong == school_id
        ).first()
    
    @staticmethod
    def get_students_by_class(db: Session, class_id: int, 
                             skip: int = 0, limit: int = 100,
                             search: Optional[str] = None) -> List[Student]:
        query = db.query(Student).filter(Student.maLopHoc == class_id)
        
        # Search by name or school ID
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (Student.hoTen.ilike(search_term)) | 
                (Student.maHocSinhTruong.ilike(search_term))
            )
            
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def update_student(db: Session, student_id: int, student_update: StudentUpdate) -> Student:
        # Tìm học sinh cần cập nhật
        db_student = StudentService.get_student_by_id(db, student_id)
        if not db_student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy học sinh với ID: {student_id}"
            )
        
        # Kiểm tra trùng mã học sinh trong lớp nếu có thay đổi
        if student_update.maHocSinhTruong and student_update.maHocSinhTruong != db_student.maHocSinhTruong:
            existing = db.query(Student).filter(
                Student.maLopHoc == db_student.maLopHoc,
                Student.maHocSinhTruong == student_update.maHocSinhTruong,
                Student.maHocSinh != student_id
            ).first()
            
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
            # Commit thay đổi
            db.commit()
            db.refresh(db_student)
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Lỗi khi cập nhật thông tin học sinh, có thể do mã học sinh đã tồn tại"
            )
        
        return db_student
    
    @staticmethod
    def delete_student(db: Session, student_id: int) -> bool:
        # Tìm học sinh
        db_student = StudentService.get_student_by_id(db, student_id)
        if not db_student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy học sinh với ID: {student_id}"
            )
        
        # Xóa học sinh
        db.delete(db_student)
        db.commit()
        
        return True
    
    @staticmethod
    def transfer_students(db: Session, transfer_data: StudentTransfer) -> List[Student]:
        """Chuyển học sinh sang lớp mới"""
        # Kiểm tra lớp học mới
        new_class = db.query(ClassRoom).filter(
            ClassRoom.maLopHoc == transfer_data.maLopHocMoi,
            ClassRoom.trangThai == True
        ).first()
        
        if not new_class:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy lớp học mới với ID: {transfer_data.maLopHocMoi} hoặc lớp không hoạt động"
            )
        
        # Lấy danh sách học sinh
        students = db.query(Student).filter(
            Student.maHocSinh.in_(transfer_data.maHocSinhList)
        ).all()
        
        if len(students) != len(transfer_data.maHocSinhList):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Một số học sinh không tồn tại trong hệ thống"
            )
        
        # Lấy danh sách mã học sinh của lớp mới
        existing_student_ids = db.query(Student.maHocSinhTruong).filter(
            Student.maLopHoc == transfer_data.maLopHocMoi
        ).all()
        existing_ids = [s.maHocSinhTruong for s in existing_student_ids]
        
        # Chuyển từng học sinh
        transferred_students = []
        
        for student in students:
            # Kiểm tra trùng mã học sinh trong lớp mới
            if student.maHocSinhTruong in existing_ids:
                # Tạo mã học sinh mới để tránh trùng
                new_school_id = f"{student.maHocSinhTruong}_T{datetime.now().strftime('%Y%m%d')}"
                student.maHocSinhTruong = new_school_id
            
            # Cập nhật lớp mới
            student.maLopHoc = transfer_data.maLopHocMoi
            student.thoiGianCapNhat = datetime.now()
            transferred_students.append(student)
        
        try:
            db.commit()
            for student in transferred_students:
                db.refresh(student)
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Lỗi khi chuyển lớp cho học sinh, vui lòng thử lại"
            )
        
        return transferred_students 