from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.class_room import ClassRoom
from app.models.class_settings import ClassSettings
from app.schemas.class_settings import ClassSettingsOut, ClassSettingsCreate, ClassSettingsUpdate
from fastapi import HTTPException, status

class ClassSettingsService:
    @staticmethod
    async def get_class_settings(db: AsyncSession, class_id: int) -> ClassSettingsOut:
        # Verify class exists
        class_stmt = select(ClassRoom).where(ClassRoom.maLopHoc == class_id)
        class_result = await db.execute(class_stmt)
        class_obj = class_result.scalars().first()
        
        if not class_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lớp học không tồn tại"
            )
        
        # Get or create settings
        settings_stmt = select(ClassSettings).where(ClassSettings.maLopHoc == class_id)
        settings_result = await db.execute(settings_stmt)
        settings = settings_result.scalars().first()
        
        if not settings:
            # Create default settings
            settings = ClassSettings(maLopHoc=class_id)
            db.add(settings)
            await db.commit()
            await db.refresh(settings)
        
        return ClassSettingsOut(
            maLopHoc=settings.maLopHoc,
            maxStudents=settings.maxStudents,
            allowSelfEnroll=settings.allowSelfEnroll,
            requireApproval=settings.requireApproval,
            emailNotifications=settings.emailNotifications,
            smsNotifications=settings.smsNotifications,
            parentNotifications=settings.parentNotifications,
            autoGrading=settings.autoGrading,
            passingScore=settings.passingScore,
            retakeAllowed=settings.retakeAllowed,
            maxRetakeAttempts=settings.maxRetakeAttempts,
            showStudentList=settings.showStudentList,
            showScores=settings.showScores,
            allowStudentComments=settings.allowStudentComments,
            dataRetentionDays=settings.dataRetentionDays,
            backupFrequency=settings.backupFrequency,
            auditLogging=settings.auditLogging
        )
    
    @staticmethod
    async def update_class_settings(
        db: AsyncSession, 
        class_id: int, 
        settings_update: ClassSettingsUpdate
    ) -> ClassSettingsOut:
        # Verify class exists
        class_stmt = select(ClassRoom).where(ClassRoom.maLopHoc == class_id)
        class_result = await db.execute(class_stmt)
        class_obj = class_result.scalars().first()
        
        if not class_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lớp học không tồn tại"
            )
        
        # Get or create settings
        settings_stmt = select(ClassSettings).where(ClassSettings.maLopHoc == class_id)
        settings_result = await db.execute(settings_stmt)
        settings = settings_result.scalars().first()
        
        if not settings:
            # Create with defaults
            settings = ClassSettings(maLopHoc=class_id)
            db.add(settings)
        
        # Update with provided values
        update_data = settings_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            if hasattr(settings, field):
                setattr(settings, field, value)
        
        await db.commit()
        await db.refresh(settings)
        
        return ClassSettingsOut(
            maLopHoc=settings.maLopHoc,
            maxStudents=settings.maxStudents,
            allowSelfEnroll=settings.allowSelfEnroll,
            requireApproval=settings.requireApproval,
            emailNotifications=settings.emailNotifications,
            smsNotifications=settings.smsNotifications,
            parentNotifications=settings.parentNotifications,
            autoGrading=settings.autoGrading,
            passingScore=settings.passingScore,
            retakeAllowed=settings.retakeAllowed,
            maxRetakeAttempts=settings.maxRetakeAttempts,
            showStudentList=settings.showStudentList,
            showScores=settings.showScores,
            allowStudentComments=settings.allowStudentComments,
            dataRetentionDays=settings.dataRetentionDays,
            backupFrequency=settings.backupFrequency,
            auditLogging=settings.auditLogging
        ) 