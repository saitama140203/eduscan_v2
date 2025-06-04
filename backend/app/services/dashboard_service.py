from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Dict

from app.models.organization import Organization
from app.models.class_room import ClassRoom
from app.models.user import User
from app.models.exam import Exam
from app.models.student import Student
from app.models.exam import Result

class DashboardService:
    @staticmethod
    async def admin_stats(db: AsyncSession) -> Dict[str, float]:
        orgs = await db.scalar(select(func.count()).select_from(Organization))
        classes = await db.scalar(select(func.count()).select_from(ClassRoom))
        managers = await db.scalar(select(func.count()).select_from(User).where(User.vaiTro == "MANAGER"))
        teachers = await db.scalar(select(func.count()).select_from(User).where(User.vaiTro == "TEACHER"))
        exams = await db.scalar(select(func.count()).select_from(Exam))
        students = await db.scalar(select(func.count()).select_from(Student))
        avg_score = await db.scalar(select(func.avg(Result.diem)))
        return {
            "organizations": orgs or 0,
            "classes": classes or 0,
            "managers": managers or 0,
            "teachers": teachers or 0,
            "exams": exams or 0,
            "students": students or 0,
            "averageScore": float(avg_score) if avg_score is not None else None,
        }

    @staticmethod
    async def manager_stats(db: AsyncSession, org_id: int) -> Dict[str, float]:
        classes = await db.scalar(select(func.count()).select_from(ClassRoom).where(ClassRoom.maToChuc == org_id))
        teachers = await db.scalar(select(func.count()).select_from(User).where(User.maToChuc == org_id, User.vaiTro == "TEACHER"))
        exams = await db.scalar(select(func.count()).select_from(Exam).where(Exam.maToChuc == org_id))
        students = await db.scalar(
            select(func.count()).select_from(Student).join(ClassRoom, Student.maLopHoc == ClassRoom.maLopHoc).where(ClassRoom.maToChuc == org_id)
        )
        avg_score = await db.scalar(
            select(func.avg(Result.diem)).join(Exam, Result.maBaiKiemTra == Exam.maBaiKiemTra).where(Exam.maToChuc == org_id)
        )
        return {
            "classes": classes or 0,
            "teachers": teachers or 0,
            "exams": exams or 0,
            "students": students or 0,
            "averageScore": float(avg_score) if avg_score is not None else None,
        }

    @staticmethod
    async def teacher_stats(db: AsyncSession, teacher_id: int) -> Dict[str, float]:
        classes = await db.scalar(select(func.count()).select_from(ClassRoom).where(ClassRoom.maGiaoVienChuNhiem == teacher_id))
        exams = await db.scalar(select(func.count()).select_from(Exam).where(Exam.maNguoiTao == teacher_id))
        answer_sheets = await db.scalar(select(func.count()).select_from(Result).where(Result.maBaiKiemTra.in_(
            select(Exam.maBaiKiemTra).where(Exam.maNguoiTao == teacher_id)
        )))
        avg_score = await db.scalar(
            select(func.avg(Result.diem)).join(Exam, Result.maBaiKiemTra == Exam.maBaiKiemTra).where(Exam.maNguoiTao == teacher_id)
        )
        return {
            "classes": classes or 0,
            "exams": exams or 0,
            "answerSheets": answer_sheets or 0,
            "averageScore": float(avg_score) if avg_score is not None else None,
        }

