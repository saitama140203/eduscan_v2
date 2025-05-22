from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from typing import Optional, List, Dict, Any
from datetime import datetime

from app.models.class_room import ClassRoom
from app.models.student import Student
from app.models.user import User
from app.models.organization import Organization
from app.schemas.class_student import ClassCreate, ClassUpdate, ClassDetail

class ClassService:
    @staticmethod
    def create_class(db: Session, class_create: ClassCreate) -> ClassRoom:
        # Kiểm tra tổ chức tồn tại
        db_org = db.query(Organization).filter(Organization.maToChuc == class_create.maToChuc).first()
        if not db_org:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy tổ chức với ID: {class_create.maToChuc}"
            )
        
        # Kiểm tra giáo viên chủ nhiệm nếu có
        if class_create.maGiaoVienChuNhiem:
            db_teacher = db.query(User).filter(
                User.maNguoiDung == class_create.maGiaoVienChuNhiem,
                User.vaiTro == "Teacher"
            ).first()
            
            if not db_teacher:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Không tìm thấy giáo viên với ID: {class_create.maGiaoVienChuNhiem}"
                )
        
        # Tạo lớp học mới
        db_class = ClassRoom(
            maToChuc=class_create.maToChuc,
            tenLop=class_create.tenLop,
            capHoc=class_create.capHoc,
            namHoc=class_create.namHoc,
            maGiaoVienChuNhiem=class_create.maGiaoVienChuNhiem,
            moTa=class_create.moTa,
            trangThai=True
        )
        
        # Thêm vào DB và commit
        db.add(db_class)
        db.commit()
        db.refresh(db_class)
        
        return db_class
    
    @staticmethod
    def get_class_by_id(db: Session, class_id: int) -> Optional[ClassRoom]:
        return db.query(ClassRoom).filter(ClassRoom.maLopHoc == class_id).first()
    
    @staticmethod
    def get_class_detail(db: Session, class_id: int) -> Optional[Dict[str, Any]]:
        db_class = ClassService.get_class_by_id(db, class_id)
        
        if not db_class:
            return None
            
        # Đếm số học sinh trong lớp
        student_count = db.query(func.count(Student.maHocSinh))\
            .filter(Student.maLopHoc == class_id, Student.trangThai == True)\
            .scalar()
        
        # Lấy thông tin tên giáo viên chủ nhiệm
        if db_class.maGiaoVienChuNhiem:
            teacher = db.query(User).filter(User.maNguoiDung == db_class.maGiaoVienChuNhiem).first()
            if teacher:
                setattr(db_class, "tenGiaoVienChuNhiem", teacher.hoTen)
            else:
                setattr(db_class, "tenGiaoVienChuNhiem", None)
        else:
            setattr(db_class, "tenGiaoVienChuNhiem", None)
            
        class_detail = ClassDetail.from_orm(db_class)
        class_detail.total_students = student_count
        
        return class_detail
    
    @staticmethod
    def get_classes(db: Session, org_id: Optional[int] = None, teacher_id: Optional[int] = None, 
                   skip: int = 0, limit: int = 100) -> List[ClassRoom]:
        query = db.query(ClassRoom)
        
        # Lọc theo tổ chức
        if org_id:
            query = query.filter(ClassRoom.maToChuc == org_id)
            
        # Lọc theo giáo viên chủ nhiệm
        if teacher_id:
            query = query.filter(ClassRoom.maGiaoVienChuNhiem == teacher_id)
        
        classes = query.offset(skip).limit(limit).all()
        
        # Lấy thông tin tên giáo viên chủ nhiệm và số học sinh
        for class_item in classes:
            # Lấy tên giáo viên chủ nhiệm
            if class_item.maGiaoVienChuNhiem:
                teacher = db.query(User).filter(User.maNguoiDung == class_item.maGiaoVienChuNhiem).first()
                if teacher:
                    setattr(class_item, "tenGiaoVienChuNhiem", teacher.hoTen)
                else:
                    setattr(class_item, "tenGiaoVienChuNhiem", None)
            else:
                setattr(class_item, "tenGiaoVienChuNhiem", None)
            
            # Đếm số học sinh trong lớp
            student_count = db.query(func.count(Student.maHocSinh))\
                .filter(Student.maLopHoc == class_item.maLopHoc, Student.trangThai == True)\
                .scalar()
            setattr(class_item, "total_students", student_count)
        
        return classes
    
    @staticmethod
    def update_class(db: Session, class_id: int, class_update: ClassUpdate) -> ClassRoom:
        # Tìm lớp học cần cập nhật
        db_class = ClassService.get_class_by_id(db, class_id)
        if not db_class:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy lớp học với ID: {class_id}"
            )
        
        # Kiểm tra giáo viên chủ nhiệm mới nếu có cập nhật
        if class_update.maGiaoVienChuNhiem and class_update.maGiaoVienChuNhiem != db_class.maGiaoVienChuNhiem:
            db_teacher = db.query(User).filter(
                User.maNguoiDung == class_update.maGiaoVienChuNhiem,
                User.vaiTro == "Teacher"
            ).first()
            
            if not db_teacher:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Không tìm thấy giáo viên với ID: {class_update.maGiaoVienChuNhiem}"
                )
        
        # Cập nhật thông tin
        update_data = class_update.dict(exclude_unset=True)
        
        for key, value in update_data.items():
            setattr(db_class, key, value)
        
        # Cập nhật thời gian
        db_class.thoiGianCapNhat = datetime.now()
        
        # Commit thay đổi
        db.commit()
        db.refresh(db_class)
        
        return db_class
    
    @staticmethod
    def delete_class(db: Session, class_id: int) -> bool:
        # Tìm lớp học
        db_class = ClassService.get_class_by_id(db, class_id)
        if not db_class:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy lớp học với ID: {class_id}"
            )
        
        # Kiểm tra xem lớp học có học sinh không
        student_count = db.query(func.count(Student.maHocSinh))\
            .filter(Student.maLopHoc == class_id)\
            .scalar()
            
        if student_count > 0:
            # Nếu có học sinh, chỉ đánh dấu lớp học là không active
            db_class.trangThai = False
            db_class.thoiGianCapNhat = datetime.now()
            db.commit()
        else:
            # Nếu không có học sinh, xóa lớp học
            db.delete(db_class)
            db.commit()
        
        return True 