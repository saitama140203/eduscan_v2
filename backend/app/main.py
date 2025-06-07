from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
import os
import time
import uvicorn

from app.core.config import settings
from app.routes import auth, users, organizations, classes, students, exams, dashboard, settings as settings_router, answer_templates, websocket, admin
from app.db.session import Base, engine

# Import tất cả các model để đảm bảo chúng được đăng ký với Base
from app.models.user import User
from app.models.organization import Organization
from app.models.class_room import ClassRoom
from app.models.student import Student
from app.models.answer_sheet_template import AnswerSheetTemplate
from app.models.exam import Exam, ExamClassRoom, Answer, AnswerSheet, Result, ExamStatistic
from app.models.file import File
from app.models.setting import Setting

# Base.metadata.create_all(bind=engine, checkfirst=True) # Vô hiệu hóa vì CSDL sẽ được quản lý bởi script SQL / Alembic

# Tạo thư mục upload nếu chưa tồn tại
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# Khởi tạo ứng dụng FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    description="API của hệ thống quét và chấm điểm bài thi trắc nghiệm EduScan",
    version="1.0.0"
)

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép tất cả origins trong development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware để đo thời gian xử lý request
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Đăng ký các router
app.include_router(auth.router, prefix=f"{settings.API_PREFIX}/v1")
app.include_router(users.router, prefix=f"{settings.API_PREFIX}/v1")
app.include_router(organizations.router, prefix=f"{settings.API_PREFIX}/v1")
app.include_router(classes.router, prefix=f"{settings.API_PREFIX}/v1")
app.include_router(students.router, prefix=f"{settings.API_PREFIX}/v1")
app.include_router(exams.router, prefix=f"{settings.API_PREFIX}/v1")
app.include_router(dashboard.router, prefix=f"{settings.API_PREFIX}/v1")
app.include_router(settings_router.router, prefix=f"{settings.API_PREFIX}/v1")
app.include_router(answer_templates.router, prefix=f"{settings.API_PREFIX}/v1")
app.include_router(websocket.router, prefix=f"{settings.API_PREFIX}/v1")
app.include_router(admin.router, prefix=f"{settings.API_PREFIX}/v1")


# Root endpoint
@app.get("/")
async def root():
    return {"message": "Chào mừng đến với EduScan API! Xem tài liệu API tại /api/docs", "status": "ok"}

# Health endpoints (multiple locations for compatibility)
@app.get("/health")
async def health_check_root():
    return {
        "status": "ok",
        "api_version": "v1",
        "app_name": settings.APP_NAME,
        "message": "EduScan Backend is running!"
    }

@app.get(f"{settings.API_PREFIX}/health")
async def health_check():
    return {
        "status": "ok",
        "api_version": "v1",
        "app_name": settings.APP_NAME,
        "message": "EduScan Backend is running!"
    }

# Xử lý exception toàn cục
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    if settings.DEBUG:
        return JSONResponse(
            status_code=500,
            content={"message": f"Lỗi hệ thống: {str(exc)}"}
        )
    else:
        return JSONResponse(
            status_code=500,
            content={"message": "Lỗi hệ thống, vui lòng liên hệ quản trị viên"}
        )

# Thực thi ứng dụng với uvicorn nếu chạy trực tiếp file này
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 