# EduScan - API Xác thực

Module xác thực (`Authentication`) của hệ thống EduScan cung cấp các API để đăng ký, đăng nhập, làm mới token, đổi mật khẩu và quên mật khẩu.

## Các endpoint API

Tất cả các API đều có tiền tố: `/api/auth`

### 1. Đăng ký tài khoản

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "hoTen": "Nguyễn Văn A",
  "vaiTro": "Teacher",
  "soDienThoai": "0123456789",
  "urlAnhDaiDien": null,
  "maToChuc": null
}
```

**Response:**
```json
{
  "maNguoiDung": 1,
  "email": "user@example.com",
  "hoTen": "Nguyễn Văn A",
  "vaiTro": "Teacher",
  "soDienThoai": "0123456789",
  "urlAnhDaiDien": null,
  "maToChuc": null,
  "trangThai": true,
  "thoiGianTao": "2023-01-01T00:00:00",
  "thoiGianCapNhat": "2023-01-01T00:00:00"
}
```

### 2. Đăng nhập

**Endpoint:** `POST /auth/login`

**Request Body (Form Data):**
```
username: user@example.com
password: password123
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 3. Làm mới token

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 4. Lấy thông tin người dùng hiện tại

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "maNguoiDung": 1,
  "email": "user@example.com",
  "hoTen": "Nguyễn Văn A",
  "vaiTro": "Teacher",
  "soDienThoai": "0123456789",
  "urlAnhDaiDien": null,
  "maToChuc": null,
  "trangThai": true,
  "thoiGianTao": "2023-01-01T00:00:00",
  "thoiGianCapNhat": "2023-01-01T00:00:00"
}
```

### 5. Đổi mật khẩu

**Endpoint:** `POST /auth/change-password`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "current_password": "password123",
  "new_password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Đổi mật khẩu thành công"
}
```

### 6. Quên mật khẩu

**Endpoint:** `POST /auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Nếu email tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi"
}
```

### 7. Đặt lại mật khẩu

**Endpoint:** `POST /auth/reset-password`

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "new_password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Đặt lại mật khẩu thành công"
}
```

### 8. Đăng xuất

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "message": "Đăng xuất thành công"
}
```

## Ví dụ sử dụng cURL

### Đăng ký tài khoản

```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "passwordConfirm": "password123",
    "hoTen": "Nguyễn Văn A",
    "vaiTro": "Teacher",
    "soDienThoai": "0123456789"
  }'
```

### Đăng nhập

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -d "username=user@example.com&password=password123"
```

### Làm mới token

```bash
curl -X POST "http://localhost:8000/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

### Lấy thông tin người dùng hiện tại

```bash
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Đổi mật khẩu

```bash
curl -X POST "http://localhost:8000/api/auth/change-password" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "password123",
    "new_password": "newpassword123",
    "confirm_password": "newpassword123"
  }'
```

### Quên mật khẩu

```bash
curl -X POST "http://localhost:8000/api/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

### Đặt lại mật khẩu

```bash
curl -X POST "http://localhost:8000/api/auth/reset-password" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "new_password": "newpassword123",
    "confirm_password": "newpassword123"
  }'
```

### Đăng xuất

```bash
curl -X POST "http://localhost:8000/api/auth/logout" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Thông tin JWT Token

### Access Token
- Thời hạn: 15 phút
- Payload:
  ```json
  {
    "sub": "user@example.com",
    "exp": 1672531200,
    "iat": 1672530300,
    "roles": ["Teacher"],
    "jti": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": 1,
    "org_id": null
  }
  ```

### Refresh Token
- Thời hạn: 7 ngày
- Payload:
  ```json
  {
    "sub": "user@example.com",
    "exp": 1673136000,
    "iat": 1672531200,
    "type": "refresh",
    "jti": "550e8400-e29b-41d4-a716-446655440001"
  }
  ```

## Lưu ý bảo mật

1. Mật khẩu được mã hóa bằng bcrypt với 12 rounds
2. JWT token sử dụng thuật toán HS256
3. Access token có thời hạn 15 phút
4. Refresh token có thời hạn 7 ngày
5. Yêu cầu HTTPS cho môi trường production 