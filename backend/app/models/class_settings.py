from sqlalchemy import Column, Integer, Boolean, ForeignKey, String, Float, TIMESTAMP, BigInteger, func
from sqlalchemy.orm import relationship
from app.db.session import Base

class ClassSettings(Base):
    __tablename__ = "CAIDATLOPHOC"
    
    maLopHoc = Column(BigInteger, ForeignKey("LOPHOC.maLopHoc", ondelete="CASCADE"), primary_key=True, index=True)
    
    # General settings
    maxStudents = Column(Integer, nullable=False, default=40)
    allowSelfEnroll = Column(Boolean, nullable=False, default=False)
    requireApproval = Column(Boolean, nullable=False, default=True)
    
    # Notification settings
    emailNotifications = Column(Boolean, nullable=False, default=True)
    smsNotifications = Column(Boolean, nullable=False, default=False)
    parentNotifications = Column(Boolean, nullable=False, default=True)
    
    # Exam settings
    autoGrading = Column(Boolean, nullable=False, default=True)
    passingScore = Column(Float, nullable=False, default=5.0)
    retakeAllowed = Column(Boolean, nullable=False, default=True)
    maxRetakeAttempts = Column(Integer, nullable=False, default=2)
    
    # Privacy settings
    showStudentList = Column(Boolean, nullable=False, default=True)
    showScores = Column(Boolean, nullable=False, default=False)
    allowStudentComments = Column(Boolean, nullable=False, default=False)
    
    # Advanced settings
    dataRetentionDays = Column(Integer, nullable=False, default=365)
    backupFrequency = Column(String(20), nullable=False, default="weekly")
    auditLogging = Column(Boolean, nullable=False, default=True)
    
    thoiGianTao = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp())
    thoiGianCapNhat = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

    # Relationships
    lopHoc = relationship("ClassRoom", back_populates="caiDat") 