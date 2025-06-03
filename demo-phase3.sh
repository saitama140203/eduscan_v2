#!/bin/bash

echo "🎓 EduScan Phase 3 Demo: Student Management"
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}Khởi động Phase 3 Demo...${NC}"

# Thông tin đăng nhập
echo ""
echo -e "${GREEN}🔐 Tài khoản test Phase 3:${NC}"
echo "================================================"
echo -e "${CYAN}👑 Admin:${NC}"
echo "  Email: admin@eduscan.com"
echo "  Password: admin123"
echo "  Quyền: Toàn quyền quản lý học sinh"
echo ""
echo -e "${CYAN}👨‍💼 Manager:${NC}"
echo "  Email: manager@eduscan.com"
echo "  Password: manager123"
echo "  Quyền: Quản lý học sinh trong tổ chức"
echo ""
echo -e "${CYAN}👨‍🏫 Teacher:${NC}"
echo "  Email: teacher@eduscan.com"
echo "  Password: teacher123"
echo "  Quyền: Xem học sinh lớp được phân công"

echo ""
echo -e "${GREEN}📋 Tính năng Phase 3:${NC}"
echo "================================================"
echo "• 👥 Quản lý CRUD học sinh hoàn chỉnh"
echo "• 📊 Profile học sinh chi tiết"
echo "• 🏫 Quan hệ lớp-học sinh"
echo "• 📤 Import/Export hàng loạt"
echo "• 🔄 Chuyển lớp học sinh"
echo "• 👨‍👩‍👧 Quản lý liên hệ phụ huynh"
echo "• 🔍 Tìm kiếm và lọc nâng cao"
echo "• 📈 Thống kê real-time"
echo "• 🎨 UI phân biệt theo vai trò"

echo ""
echo -e "${GREEN}🌟 Demo Scenarios:${NC}"
echo "================================================"
echo -e "${YELLOW}1. Admin Demo:${NC}"
echo "   - Xem tất cả học sinh từ mọi tổ chức"
echo "   - Thêm/sửa/xóa học sinh"
echo "   - Chuyển lớp học sinh"
echo "   - Import danh sách học sinh"
echo "   - Liên hệ phụ huynh"

echo ""
echo -e "${YELLOW}2. Manager Demo (Theme xanh lá):${NC}"
echo "   - Quản lý học sinh trong tổ chức"
echo "   - Thống kê theo lớp"
echo "   - Export danh sách"
echo "   - Chuyển lớp trong tổ chức"
echo "   - Xem và chỉnh sửa chi tiết học sinh"

echo ""
echo -e "${YELLOW}3. Teacher Demo (Theme tím):${NC}"
echo "   - Xem học sinh lớp phụ trách"
echo "   - Liên hệ phụ huynh"
echo "   - Export danh sách lớp"
echo "   - Xem chi tiết học sinh (read-only)"

echo ""
echo -e "${GREEN}🎯 Test Cases:${NC}"
echo "================================================"
echo "1. Đăng nhập với từng role"
echo "2. Kiểm tra phân quyền truy cập"
echo "3. Thử tính năng tìm kiếm và lọc"
echo "4. Test CRUD operations"
echo "5. Thử liên hệ phụ huynh"
echo "6. Test responsive design"
echo "7. Kiểm tra theme theo role"

echo ""
echo -e "${GREEN}📱 URLs để test:${NC}"
echo "================================================"
echo "• Frontend: http://localhost:3000"
echo "• API Docs: http://localhost:8000/docs"
echo ""
echo "• Admin Students List: http://localhost:3000/dashboard/admin/students"
echo "• Admin Student Detail: http://localhost:3000/dashboard/admin/students/[id]"
echo "• Admin Student Edit: http://localhost:3000/dashboard/admin/students/[id]/edit"
echo ""
echo "• Manager Students List: http://localhost:3000/dashboard/manager/students"
echo "• Manager Student Detail: http://localhost:3000/dashboard/manager/students/[id]"
echo "• Manager Student Edit: http://localhost:3000/dashboard/manager/students/[id]/edit"
echo ""
echo "• Teacher Students List: http://localhost:3000/dashboard/teacher/students"
echo "• Teacher Student Detail: http://localhost:3000/dashboard/teacher/students/[id]"

echo ""
echo -e "${BLUE}🚀 Để khởi động Phase 3:${NC}"
echo "./start-phase3.sh"

echo ""
echo -e "${GREEN}✨ Phase 3 Demo với tất cả tính năng hoàn chỉnh! Enjoy testing! ✨${NC}" 