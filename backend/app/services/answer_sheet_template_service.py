from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from typing import List, Optional

from app.models.answer_sheet_template import AnswerSheetTemplate
from app.schemas.answer_sheet_template import (
    AnswerSheetTemplateCreate,
    AnswerSheetTemplateUpdate,
    AnswerSheetTemplateOut,
)

class AnswerSheetTemplateService:
    @staticmethod
    async def get_list(db: AsyncSession, maToChuc: Optional[int] = None) -> List[AnswerSheetTemplateOut]:
        stmt = select(AnswerSheetTemplate)
        if maToChuc:
            stmt = stmt.where(AnswerSheetTemplate.maToChuc == maToChuc)
        result = await db.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def get_template(db: AsyncSession, template_id: int) -> AnswerSheetTemplate:
        template = await db.get(AnswerSheetTemplate, template_id)
        if not template:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
        return template

    @staticmethod
    async def create_template(db: AsyncSession, template_in: AnswerSheetTemplateCreate) -> AnswerSheetTemplate:
        template = AnswerSheetTemplate(**template_in.dict())
        db.add(template)
        await db.commit()
        await db.refresh(template)
        return template

    @staticmethod
    async def update_template(db: AsyncSession, template_id: int, template_upd: AnswerSheetTemplateUpdate) -> AnswerSheetTemplate:
        template = await AnswerSheetTemplateService.get_template(db, template_id)
        for attr, value in template_upd.dict(exclude_unset=True).items():
            setattr(template, attr, value)
        await db.commit()
        await db.refresh(template)
        return template

    @staticmethod
    async def delete_template(db: AsyncSession, template_id: int) -> None:
        template = await AnswerSheetTemplateService.get_template(db, template_id)
        await db.delete(template)
        await db.commit()
