from fastapi import APIRouter, Depends, status
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.services.answer_sheet_template_service import AnswerSheetTemplateService
from app.schemas.answer_sheet_template import (
    AnswerSheetTemplateCreate,
    AnswerSheetTemplateUpdate,
    AnswerSheetTemplateOut,
)
from app.models.user import User
from app.utils.auth import check_admin_permission

router = APIRouter(prefix="/answer-templates", tags=["answer_templates"])

@router.get("/", response_model=List[AnswerSheetTemplateOut])
async def read_templates(ma_to_chuc: Optional[int] = None, current_user: User = Depends(check_admin_permission), db: AsyncSession = Depends(get_db)):
    return await AnswerSheetTemplateService.get_list(db, ma_to_chuc)

@router.post("/", response_model=AnswerSheetTemplateOut, status_code=status.HTTP_201_CREATED)
async def create_template(template: AnswerSheetTemplateCreate, current_user: User = Depends(check_admin_permission), db: AsyncSession = Depends(get_db)):
    return await AnswerSheetTemplateService.create_template(db, template)

@router.get("/{template_id}", response_model=AnswerSheetTemplateOut)
async def get_template(template_id: int, current_user: User = Depends(check_admin_permission), db: AsyncSession = Depends(get_db)):
    return await AnswerSheetTemplateService.get_template(db, template_id)

@router.put("/{template_id}", response_model=AnswerSheetTemplateOut)
async def update_template(template_id: int, template_update: AnswerSheetTemplateUpdate, current_user: User = Depends(check_admin_permission), db: AsyncSession = Depends(get_db)):
    return await AnswerSheetTemplateService.update_template(db, template_id, template_update)

@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(template_id: int, current_user: User = Depends(check_admin_permission), db: AsyncSession = Depends(get_db)):
    await AnswerSheetTemplateService.delete_template(db, template_id)
    return {"message": "deleted"}
