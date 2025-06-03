#!/bin/bash

echo "🚀 Starting EduScan Phase 3: Student Management"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

if ! command_exists python; then
    echo -e "${RED}❌ Python is not installed${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites met${NC}"

# Check if ports are available
if port_in_use 8000; then
    echo -e "${YELLOW}⚠️  Port 8000 is already in use (Backend)${NC}"
    echo "Please stop the process using port 8000 or use a different port"
    exit 1
fi

if port_in_use 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 is already in use (Frontend)${NC}"
    echo "Please stop the process using port 3000 or use a different port"
    exit 1
fi

# Kill any existing processes (cleanup)
echo -e "${BLUE}Cleaning up existing processes...${NC}"
pkill -f "uvicorn" >/dev/null 2>&1
pkill -f "next" >/dev/null 2>&1

# Start backend
echo -e "${BLUE}Starting Backend (FastAPI) on port 8000...${NC}"
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating Python virtual environment...${NC}"
    python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies if needed
if [ ! -f ".deps_installed" ]; then
    echo -e "${YELLOW}Installing Python dependencies...${NC}"
    pip install -r requirements.txt
    touch .deps_installed
fi

# Start backend in background
echo -e "${GREEN}🚀 Starting FastAPI backend...${NC}"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Check if backend started successfully
if ! port_in_use 8000; then
    echo -e "${RED}❌ Failed to start backend${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo -e "${GREEN}✅ Backend started successfully on http://localhost:8000${NC}"
echo -e "${BLUE}📚 API Documentation: http://localhost:8000/docs${NC}"

# Start frontend
echo -e "${BLUE}Starting Frontend (Next.js) on port 3000...${NC}"
cd ../frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing Node.js dependencies...${NC}"
    npm install
fi

# Start frontend in background
echo -e "${GREEN}🚀 Starting Next.js frontend...${NC}"
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 8

# Check if frontend started successfully
if ! port_in_use 3000; then
    echo -e "${RED}❌ Failed to start frontend${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo -e "${GREEN}✅ Frontend started successfully on http://localhost:3000${NC}"

# Display startup information
echo ""
echo -e "${GREEN}🎉 EduScan Phase 3 is now running!${NC}"
echo "================================================"
echo -e "${BLUE}📱 Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}🔧 Backend API:${NC} http://localhost:8000"
echo -e "${BLUE}📚 API Docs:${NC} http://localhost:8000/docs"
echo ""
echo -e "${YELLOW}Phase 3 Features:${NC}"
echo "• 👥 Student Management (CRUD)"
echo "• 📊 Student Profiles & Analytics"
echo "• 🏫 Class-Student Relationships"
echo "• 📤 Bulk Import/Export Students"
echo "• 🔄 Student Transfer Between Classes"
echo "• 👨‍👩‍👧 Parent Contact Management"
echo ""
echo -e "${BLUE}Available User Roles:${NC}"
echo "• 👑 Admin: Full system access"
echo "• 👨‍💼 Manager: Manage students in their organization"
echo "• 👨‍🏫 Teacher: View students in their classes"
echo ""
echo -e "${YELLOW}Test Accounts:${NC}"
echo "• Admin: admin@eduscan.com / admin123"
echo "• Manager: manager@eduscan.com / manager123"
echo "• Teacher: teacher@eduscan.com / teacher123"
echo ""
echo -e "${RED}Press Ctrl+C to stop both services${NC}"

# Create a cleanup function
cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ All services stopped${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID 