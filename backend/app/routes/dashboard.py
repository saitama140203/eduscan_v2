from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.user import User
from app.utils.auth import get_current_active_user
from app.services.dashboard_service import DashboardService
from app.schemas.dashboard import AdminStats, ManagerStats, TeacherStats

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/overview", response_model=dict)
async def get_overview_stats(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.vaiTro.upper() == "ADMIN":
        return await DashboardService.admin_stats(db)
    elif current_user.vaiTro.upper() == "MANAGER":
        return await DashboardService.manager_stats(db, current_user.maToChuc)
    else:
        return await DashboardService.teacher_stats(db, current_user.maNguoiDung)

