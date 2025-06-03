from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from app.core.config import settings

# Đảm bảo URL luôn là async!
if settings.DATABASE_URL and settings.DATABASE_URL.startswith("postgresql://"):
    SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL.replace(
        "postgresql://", "postgresql+asyncpg://"
    )
elif settings.DATABASE_URL and settings.DATABASE_URL.startswith("sqlite://"):
    SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL.replace(
        "sqlite://", "sqlite+aiosqlite://"
    )
else:
    SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=False,
    future=True,
    pool_pre_ping=True,
)

AsyncSessionLocal = sessionmaker(
    bind=engine, 
    class_=AsyncSession, 
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session  # không cần finally vì async with đã đóng session
