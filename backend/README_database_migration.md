# Hướng dẫn Migration cơ sở dữ liệu EduScan

Hệ thống EduScan sử dụng Alembic để quản lý phiên bản và migration cơ sở dữ liệu. Tài liệu này hướng dẫn cách thực hiện các thao tác migration cơ bản.

## Cài đặt môi trường

1. Đảm bảo PostgreSQL đã được cài đặt và đang chạy
2. Tạo cơ sở dữ liệu `eduscan`
3. Cập nhật thông tin kết nối trong file `.env` hoặc `app/core/config.py`

```
DATABASE_URL=postgresql://username:password@localhost:5432/eduscan
```

## Thực hiện migration lần đầu

Khi cài đặt hệ thống lần đầu, bạn cần tạo schema và áp dụng các migration hiện có:

```bash
cd backend
alembic upgrade head
```

## Kiểm tra trạng thái migration

Để xem phiên bản hiện tại của cơ sở dữ liệu:

```bash
alembic current
```

## Tạo migration mới

Khi thay đổi model, bạn cần tạo migration mới để đồng bộ cấu trúc cơ sở dữ liệu:

```bash
alembic revision --autogenerate -m "mô tả thay đổi"
```

Lệnh này sẽ tự động phát hiện các thay đổi trong model và tạo file migration tương ứng.

## Cập nhật cơ sở dữ liệu

Để áp dụng các migration mới:

```bash
alembic upgrade head
```

## Quay lại phiên bản trước

Nếu cần rollback về phiên bản trước:

```bash
# Quay lại 1 phiên bản
alembic downgrade -1

# Hoặc quay lại phiên bản cụ thể
alembic downgrade abc123def456
```

## Lưu ý khi làm việc với Alembic và SQLAlchemy 2.x

1. **Đồng bộ model**: Đảm bảo rằng tất cả các model đã được import trong `alembic/env.py` và `app/models/__init__.py`.

2. **Migration không tự động**: Alembic không tự động phát hiện các thay đổi. Bạn cần chạy lệnh `alembic revision --autogenerate` sau khi thay đổi model.

3. **Kiểm tra file migration**: Luôn kiểm tra các file migration được tạo tự động trước khi áp dụng để đảm bảo chúng chính xác.

4. **Dữ liệu thử nghiệm**: Sau khi migration, bạn có thể chạy script để tạo dữ liệu thử nghiệm:

```bash
python -m app.scripts.seed_data
```

5. **Async engine**: Hệ thống sử dụng SQLAlchemy async engine nên cần đảm bảo asyncpg đã được cài đặt.

## Xử lý lỗi

### Lỗi "Target database is not up to date"

```bash
alembic stamp head
```

### Lỗi bảng đã tồn tại

Nếu bạn gặp lỗi về bảng đã tồn tại khi chạy migration, có thể xóa cơ sở dữ liệu và tạo lại:

```bash
# PostgreSQL
dropdb eduscan
createdb eduscan

# Sau đó chạy lại migration
alembic upgrade head
```

### Lỗi không tìm thấy module

Nếu gặp lỗi không tìm thấy module khi chạy Alembic, hãy đảm bảo rằng thư mục gốc của dự án đã được thêm vào PYTHONPATH:

```bash
export PYTHONPATH=$PYTHONPATH:/đường/dẫn/tới/dự/án
```

## Tài liệu tham khảo

- [Alembic Documentation](https://alembic.sqlalchemy.org/en/latest/)
- [SQLAlchemy 2.0 Documentation](https://docs.sqlalchemy.org/en/20/)
- [FastAPI with SQLAlchemy](https://fastapi.tiangolo.com/tutorial/sql-databases/) 