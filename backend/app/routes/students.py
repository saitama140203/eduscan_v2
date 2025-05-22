from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.student_service import StudentService
from app.services.class_service import ClassService
from app.schemas.class_student import StudentOut, StudentCreate, StudentUpdate, StudentBatchCreate, StudentTransfer
from app.models.user import User
from app.models.class_room import ClassRoom
from app.utils.auth import (
    get_current_active_user, 
    check_admin_permission, 
    check_manager_permission,
    check_teacher_permission,
    check_class_access
)

router = APIRouter(
    prefix="/students",
    tags=["students"],
    responses={404: {"description": "Not found"}}
)

@router.get("/class/{class_id}", response_model=List[StudentOut])
async def read_students_by_class(
    class_id: int,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    # Kiểm tra quyền truy cập lớp học
    db_class = Depends(check_class_access)
):
    """Lấy danh sách học sinh theo lớp học"""
    # Quyền truy cập đã được kiểm tra qua middleware check_class_access
    
    # Lấy danh sách học sinh
    students = StudentService.get_students_by_class(db, class_id, skip=skip, limit=limit, search=search)
    return students

@router.post("/", response_model=StudentOut, status_code=status.HTTP_201_CREATED)
async def create_student(
    student_create: StudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Tạo học sinh mới"""
    # Kiểm tra quyền truy cập lớp học
    db_class = check_class_access(student_create.maLopHoc, db, current_user)
    
    # Tạo học sinh mới
    return StudentService.create_student(db, student_create)

@router.post("/batch", response_model=List[StudentOut], status_code=status.HTTP_201_CREATED)
async def create_students_batch(
    student_batch: StudentBatchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Tạo nhiều học sinh cùng lúc"""
    if not student_batch.students:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Danh sách học sinh không được trống"
        )
    
    # Kiểm tra quyền truy cập cho tất cả lớp học
    class_ids = set(student.maLopHoc for student in student_batch.students)
    
    for class_id in class_ids:
        # Kiểm tra quyền truy cập từng lớp học
        check_class_access(class_id, db, current_user)
    
    # Tạo học sinh mới
    return StudentService.create_students_batch(db, student_batch)

@router.get("/{student_id}", response_model=StudentOut)
async def read_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Lấy thông tin học sinh cụ thể"""
    # Lấy thông tin học sinh
    db_student = StudentService.get_student_by_id(db, student_id)
    if not db_student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy học sinh với ID: {student_id}"
        )
    
    # Kiểm tra quyền truy cập lớp học của học sinh
    check_class_access(db_student.maLopHoc, db, current_user)
    
    return db_student

@router.put("/{student_id}", response_model=StudentOut)
async def update_student(
    student_id: int,
    student_update: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Cập nhật thông tin học sinh"""
    # Lấy thông tin học sinh
    db_student = StudentService.get_student_by_id(db, student_id)
    if not db_student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy học sinh với ID: {student_id}"
        )
    
    # Kiểm tra quyền truy cập lớp học của học sinh
    check_class_access(db_student.maLopHoc, db, current_user)
    
    return StudentService.update_student(db, student_id, student_update)

@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Xóa học sinh"""
    # Lấy thông tin học sinh
    db_student = StudentService.get_student_by_id(db, student_id)
    if not db_student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy học sinh với ID: {student_id}"
        )
    
    # Kiểm tra quyền truy cập lớp học của học sinh
    check_class_access(db_student.maLopHoc, db, current_user)
    
    # Xóa học sinh
    StudentService.delete_student(db, student_id)
    return {"message": "Học sinh đã được xóa thành công"}

@router.post("/transfer", response_model=List[StudentOut])
async def transfer_students(
    transfer_data: StudentTransfer,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Chuyển học sinh sang lớp khác"""
    # Lấy danh sách học sinh
    students = []
    for student_id in transfer_data.maHocSinhList:
        db_student = StudentService.get_student_by_id(db, student_id)
        if not db_student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy học sinh với ID: {student_id}"
            )
        students.append(db_student)
    
    # Admin có quyền chuyển bất kỳ học sinh nào
    if current_user.vaiTro == "ADMIN":
        pass
    # Manager chỉ có thể chuyển trong cùng tổ chức
    elif current_user.vaiTro == "MANAGER":
        # Kiểm tra lớp đích thuộc tổ chức của manager
        db_target_class = ClassService.get_class_by_id(db, transfer_data.maLopHocMoi)
        if not db_target_class:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy lớp học đích với ID: {transfer_data.maLopHocMoi}"
            )
            
        if db_target_class.maToChuc != current_user.maToChuc:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bạn không có quyền chuyển học sinh vào lớp học thuộc tổ chức khác"
            )
            
        # Kiểm tra học sinh thuộc tổ chức của manager
        for student in students:
            db_student_class = ClassService.get_class_by_id(db, student.maLopHoc)
            if db_student_class.maToChuc != current_user.maToChuc:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Bạn không có quyền chuyển học sinh với ID: {student.maHocSinh}"
                )
    
    # Teacher không có quyền chuyển học sinh sang lớp khác
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền chuyển học sinh sang lớp khác"
        )
    
    # Thực hiện chuyển lớp
    return StudentService.transfer_students(db, transfer_data) 