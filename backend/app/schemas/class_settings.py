from pydantic import BaseModel
from typing import Optional

class ClassSettingsBase(BaseModel):
    # General settings
    maxStudents: int = 40
    allowSelfEnroll: bool = False
    requireApproval: bool = True
    
    # Notification settings
    emailNotifications: bool = True
    smsNotifications: bool = False
    parentNotifications: bool = True
    
    # Exam settings
    autoGrading: bool = True
    passingScore: float = 5.0
    retakeAllowed: bool = True
    maxRetakeAttempts: int = 2
    
    # Privacy settings
    showStudentList: bool = True
    showScores: bool = False
    allowStudentComments: bool = False
    
    # Advanced settings
    dataRetentionDays: int = 365
    backupFrequency: str = "weekly"
    auditLogging: bool = True

class ClassSettingsCreate(ClassSettingsBase):
    maLopHoc: int

class ClassSettingsUpdate(BaseModel):
    maxStudents: Optional[int] = None
    allowSelfEnroll: Optional[bool] = None
    requireApproval: Optional[bool] = None
    emailNotifications: Optional[bool] = None
    smsNotifications: Optional[bool] = None
    parentNotifications: Optional[bool] = None
    autoGrading: Optional[bool] = None
    passingScore: Optional[float] = None
    retakeAllowed: Optional[bool] = None
    maxRetakeAttempts: Optional[int] = None
    showStudentList: Optional[bool] = None
    showScores: Optional[bool] = None
    allowStudentComments: Optional[bool] = None
    dataRetentionDays: Optional[int] = None
    backupFrequency: Optional[str] = None
    auditLogging: Optional[bool] = None

class ClassSettingsOut(ClassSettingsBase):
    maLopHoc: int
    
    class Config:
        from_attributes = True 