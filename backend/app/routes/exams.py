from fastapi import APIRouter, Depends, status
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.services.exam_service import ExamService
from app.schemas.exam import ExamCreate, ExamUpdate, ExamOut
from app.models.user import User
from app.utils.auth import get_current_active_user, check_manager_permission

router = APIRouter(prefix="/exams", tags=["exams"])


@router.get("/", response_model=List[ExamOut])
async def read_exams(
    org_id: Optional[int] = None,
    creator_id: Optional[int] = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.vaiTro == "ADMIN":
        exams = await ExamService.get_list(db, maToChuc=org_id, maNguoiTao=creator_id)
    elif current_user.vaiTro == "MANAGER":
        exams = await ExamService.get_list(db, maToChuc=current_user.maToChuc)
    else:
        exams = await ExamService.get_list(db, maNguoiTao=current_user.maNguoiDung)
    return exams


@router.post("/", response_model=ExamOut, status_code=status.HTTP_201_CREATED)
async def create_exam(
    exam_create: ExamCreate,
    current_user: User = Depends(check_manager_permission),
    db: AsyncSession = Depends(get_db),
):
    if current_user.vaiTro != "ADMIN" and exam_create.maToChuc != current_user.maToChuc:
        exam_create.maToChuc = current_user.maToChuc
    if current_user.vaiTro == "TEACHER":
        exam_create.maNguoiTao = current_user.maNguoiDung
    new_exam = await ExamService.create_exam(db, exam_create)
    return new_exam


@router.get("/{exam_id}", response_model=ExamOut)
async def read_exam(
    exam_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    exam = await ExamService.get_exam(db, exam_id)
    if current_user.vaiTro == "MANAGER" and exam.maToChuc != current_user.maToChuc:
        return status.HTTP_403_FORBIDDEN
    if current_user.vaiTro == "TEACHER" and exam.maNguoiTao != current_user.maNguoiDung:
        return status.HTTP_403_FORBIDDEN
    return exam


@router.put("/{exam_id}", response_model=ExamOut)
async def update_exam(
    exam_id: int,
    exam_update: ExamUpdate,
    current_user: User = Depends(check_manager_permission),
    db: AsyncSession = Depends(get_db),
):
    exam = await ExamService.get_exam(db, exam_id)
    if current_user.vaiTro == "MANAGER" and exam.maToChuc != current_user.maToChuc:
        return status.HTTP_403_FORBIDDEN
    if current_user.vaiTro == "TEACHER" and exam.maNguoiTao != current_user.maNguoiDung:
        return status.HTTP_403_FORBIDDEN
    updated_exam = await ExamService.update_exam(db, exam_id, exam_update)
    return updated_exam


@router.delete("/{exam_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_exam(
    exam_id: int,
    current_user: User = Depends(check_manager_permission),
    db: AsyncSession = Depends(get_db),
):
    exam = await ExamService.get_exam(db, exam_id)
    if current_user.vaiTro == "MANAGER" and exam.maToChuc != current_user.maToChuc:
        return status.HTTP_403_FORBIDDEN
    if current_user.vaiTro == "TEACHER" and exam.maNguoiTao != current_user.maNguoiDung:
        return status.HTTP_403_FORBIDDEN
    await ExamService.delete_exam(db, exam_id)
    return {"message": "deleted"}
