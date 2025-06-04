from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from typing import List, Optional
from datetime import datetime

from app.models.exam import Exam
from app.schemas.exam import ExamCreate, ExamUpdate, ExamOut

class ExamService:
    @staticmethod
    async def get_list(db: AsyncSession, maToChuc: Optional[int] = None, maNguoiTao: Optional[int] = None) -> List[ExamOut]:
        stmt = select(Exam)
        if maToChuc:
            stmt = stmt.where(Exam.maToChuc == maToChuc)
        if maNguoiTao:
            stmt = stmt.where(Exam.maNguoiTao == maNguoiTao)
        result = await db.execute(stmt)
        exams = result.scalars().all()
        return exams

    @staticmethod
    async def get_exam(db: AsyncSession, exam_id: int) -> Exam:
        result = await db.execute(select(Exam).where(Exam.maBaiKiemTra == exam_id))
        exam = result.scalars().first()
        if not exam:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bài kiểm tra không tồn tại")
        return exam

    @staticmethod
    async def create_exam(db: AsyncSession, exam_in: ExamCreate) -> Exam:
        new_exam = Exam(**exam_in.dict())
        db.add(new_exam)
        await db.commit()
        await db.refresh(new_exam)
        return new_exam

    @staticmethod
    async def update_exam(db: AsyncSession, exam_id: int, exam_update: ExamUpdate) -> Exam:
        exam = await ExamService.get_exam(db, exam_id)
        for attr, value in exam_update.dict(exclude_unset=True).items():
            setattr(exam, attr, value)
        exam.thoiGianCapNhat = datetime.utcnow()
        await db.commit()
        await db.refresh(exam)
        return exam

    @staticmethod
    async def delete_exam(db: AsyncSession, exam_id: int) -> None:
        exam = await ExamService.get_exam(db, exam_id)
        await db.delete(exam)
        await db.commit()

