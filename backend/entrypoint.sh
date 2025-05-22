#!/bin/bash

# Biến này thường được inject bởi Docker Compose, nhưng ta có thể đặt giá trị mặc định
DB_HOST=${DB_HOST:-db} # Tên service của PostgreSQL trong docker-compose
DB_PORT=${DB_PORT:-5432}
POSTGRES_USER=${POSTGRES_USER:-user} # Cần khớp với docker-compose
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-password} # Cần khớp với docker-compose
POSTGRES_DB_NAME=${POSTGRES_DB_NAME:-appdb} # Cần khớp với docker-compose

# Chờ PostgreSQL sẵn sàng
echo "Backend entrypoint: Waiting for PostgreSQL to start at $DB_HOST:$DB_PORT..."

# Vòng lặp kiểm tra kết nối tới PostgreSQL
# Sử dụng pg_isready là một cách tốt, nhưng nó không phải lúc nào cũng có sẵn trong image python slim.
# Thay vào đó, chúng ta có thể thử kết nối bằng psql nếu có, hoặc dùng một tool nhỏ hơn.
# Cách đơn giản là dùng netcat (nc) nếu có, hoặc một vòng lặp Python nhỏ.
# Vì image python:3.11-slim không có sẵn nc hoặc psql, chúng ta sẽ để Docker Compose healthcheck xử lý việc chờ đợi chính.
# Tuy nhiên, một chút delay hoặc kiểm tra bổ sung trong entrypoint vẫn tốt.

# Chờ đợi dựa trên healthcheck của Docker Compose là chính,
# nhưng ở đây, chúng ta vẫn có thể thêm một kiểm tra bằng Alembic hoặc một lệnh psql nhỏ nếu client được cài đặt.
# Hiện tại, chúng ta sẽ dựa vào `depends_on` và `healthcheck` trong docker-compose.yml.

echo "Backend entrypoint: Running Alembic migrations..."
# Lệnh này sẽ thất bại nếu DB chưa sẵn sàng hoàn toàn, dù healthcheck của docker-compose đã pass.
# Đó là lý do một vòng lặp chờ đợi chi tiết hơn (ví dụ dùng nc hoặc script python nhỏ) có thể cần thiết.
alembic upgrade head

if [ $? -ne 0 ]; then
    echo "Backend entrypoint: Alembic migrations failed. Exiting."
    exit 1
fi

echo "Backend entrypoint: Alembic migrations completed."

echo "Backend entrypoint: Starting Uvicorn server..."
# Chạy Uvicorn. Sử dụng --reload cho môi trường phát triển.
# Trong production, không nên dùng --reload và có thể dùng nhiều workers hơn.
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload 