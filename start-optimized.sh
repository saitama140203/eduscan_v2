#!/bin/bash

# 🚀 EduScan Phase 3 - Optimized Startup Script
echo "🚀 Starting EduScan Phase 3 - Optimized Mode"
echo "=================================================="

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Stop any existing processes
print_info "Stopping existing processes..."
pkill -f "next-server" 2>/dev/null || true
pkill -f "backend" 2>/dev/null || true

# Set working directory
cd "$(dirname "$0")"

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

print_status "Docker is running"

# Start backend services
print_info "Starting backend services..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    print_warning "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install backend dependencies if needed
if [ ! -f "requirements_installed.flag" ]; then
    print_info "Installing backend dependencies..."
    pip install -r requirements.txt
    touch requirements_installed.flag
fi

# Start database
print_info "Starting database..."
docker-compose up -d

# Wait for database to be ready
print_info "Waiting for database to be ready..."
sleep 5

# Run database migrations
print_info "Running database setup..."
python app/database.py

# Start backend server
print_info "Starting backend server..."
nohup python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > ../backend.log 2>&1 &
BACKEND_PID=$!

cd ..

# Setup frontend
print_info "Setting up optimized frontend..."
cd frontend

# Clean cache if needed
if [ "$1" = "--clean" ]; then
    print_warning "Cleaning frontend cache..."
    rm -rf .next node_modules/.cache
fi

# Check if node_modules exists and is up to date
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    print_info "Installing/updating frontend dependencies..."
    npm install --legacy-peer-deps --no-audit
fi

# Wait for backend to be ready
print_info "Waiting for backend to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:8000/health >/dev/null 2>&1; then
        print_status "Backend is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Backend failed to start in time"
        exit 1
    fi
    sleep 1
done

# Start frontend with optimizations
print_info "Starting optimized frontend..."
export NODE_ENV=development
export NEXT_TELEMETRY_DISABLED=1

# Start Next.js with turbo mode
npm run dev &
FRONTEND_PID=$!

# Wait a bit for frontend to start
sleep 3

cd ..

# Print startup information
echo ""
echo "=================================================="
print_status "🎉 EduScan Phase 3 is now running!"
echo "=================================================="
print_info "🌐 Frontend: http://localhost:3000"
print_info "🔧 Backend API: http://localhost:8000"
print_info "📚 API Docs: http://localhost:8000/docs"
print_info "🔍 Backend Logs: tail -f backend.log"
echo ""
print_info "📱 Quick Navigation:"
echo "   • Classes: http://localhost:3000/dashboard/admin/classes"
echo "   • Create Class: http://localhost:3000/dashboard/admin/classes/create"
echo "   • Analytics: http://localhost:3000/dashboard/admin/classes/[id]/analytics"
echo "   • Settings: http://localhost:3000/dashboard/admin/classes/[id]/settings"
echo ""
print_warning "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    print_info "Shutting down services..."
    kill $FRONTEND_PID 2>/dev/null || true
    kill $BACKEND_PID 2>/dev/null || true
    pkill -f "next-server" 2>/dev/null || true
    cd backend && docker-compose down
    print_status "Services stopped"
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup INT

# Keep script running and monitor processes
while true; do
    # Check if processes are still running
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        print_error "Frontend process died. Restarting..."
        cd frontend
        npm run dev &
        FRONTEND_PID=$!
        cd ..
    fi
    
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        print_error "Backend process died. Restarting..."
        cd backend
        source venv/bin/activate
        nohup python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > ../backend.log 2>&1 &
        BACKEND_PID=$!
        cd ..
    fi
    
    sleep 5
done 