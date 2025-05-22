from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional, List
from datetime import datetime

from app.models.user import Organization
from app.schemas.organization import OrganizationCreate, OrganizationUpdate

class OrganizationService:
    @staticmethod
    def create_organization(db: Session, org_create: OrganizationCreate) -> Organization:
        # Tạo organization mới
        db_org = Organization(
            tenToChuc=org_create.tenToChuc,
            loaiToChuc=org_create.loaiToChuc,
            diaChi=org_create.diaChi,
            urlLogo=org_create.urlLogo
        )
        
        # Thêm vào DB và commit
        db.add(db_org)
        db.commit()
        db.refresh(db_org)
        
        return db_org
    
    @staticmethod
    def get_organization_by_id(db: Session, org_id: int) -> Optional[Organization]:
        return db.query(Organization).filter(Organization.maToChuc == org_id).first()
    
    @staticmethod
    def get_organizations(db: Session, skip: int = 0, limit: int = 100) -> List[Organization]:
        return db.query(Organization).offset(skip).limit(limit).all()
    
    @staticmethod
    def update_organization(db: Session, org_id: int, org_update: OrganizationUpdate) -> Organization:
        # Tìm organization cần cập nhật
        db_org = OrganizationService.get_organization_by_id(db, org_id)
        if not db_org:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy tổ chức với ID: {org_id}"
            )
        
        # Cập nhật thông tin
        update_data = org_update.dict(exclude_unset=True)
        
        for key, value in update_data.items():
            setattr(db_org, key, value)
        
        # Cập nhật thời gian
        db_org.thoiGianCapNhat = datetime.now()
        
        # Commit thay đổi
        db.commit()
        db.refresh(db_org)
        
        return db_org
    
    @staticmethod
    def delete_organization(db: Session, org_id: int) -> bool:
        # Tìm organization
        db_org = OrganizationService.get_organization_by_id(db, org_id)
        if not db_org:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy tổ chức với ID: {org_id}"
            )
        
        # Xóa organization
        db.delete(db_org)
        db.commit()
        
        return True 