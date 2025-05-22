from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from app.core.config import settings

# Tạo engine kết nối đến cơ sở dữ liệu
# Lưu ý: URL được chuyển đổi để sử dụng async driver
# PostgreSQL: postgresql:// -> postgresql+asyncpg://
# SQLite (cho testing): sqlite:// -> sqlite+aiosqlite://
if settings.DATABASE_URL and settings.DATABASE_URL.startswith("postgresql://"):
    SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL.replace(
        "postgresql://", "postgresql+asyncpg://"
    )
elif settings.DATABASE_URL and settings.DATABASE_URL.startswith("sqlite://"):
    SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL.replace(
        "sqlite://", "sqlite+aiosqlite://"
    )
else:
    # Default SQLite path cho testing nếu không có DATABASE_URL
    SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=False,  # Set True để debug SQL queries
    future=True,
    pool_pre_ping=True,  # Kiểm tra kết nối trước khi sử dụng
)

# Tạo session class sử dụng async
AsyncSessionLocal = sessionmaker(
    bind=engine, 
    class_=AsyncSession, 
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Base class cho tất cả các model
Base = declarative_base()

# Dependency cho FastAPI để lấy session
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency để lấy session async của SQLAlchemy.
    Được sử dụng trong các route với Depends().
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

# Hàm để khởi tạo tables (sẽ được sử dụng trong tests)
async def init_db() -> None:
    """
    Khởi tạo database tables (chỉ sử dụng cho tests).
    Trong thực tế, nên sử dụng Alembic migrations.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all) 