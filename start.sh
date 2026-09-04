#!/bin/bash
echo ""
echo "========================================"
echo "  GigWallet - Starting All Services"
echo "========================================"
echo ""

cleanup() {
  echo ""
  echo "Stopping all services..."
  kill $PID1 $PID2 $PID3 2>/dev/null
  echo "Services stopped."
  exit 0
}
trap cleanup SIGINT SIGTERM

echo "[1/3] Starting Mock Platform APIs (port 3001)..."
cd mock-platforms && (npm start 2>/dev/null || node server.js) &
PID1=$!
cd ..
sleep 2

echo "[2/3] Starting Backend API (port 3000)..."
cd backend && (npm run start:dev 2>/dev/null || npm start) &
PID2=$!
cd ..
sleep 3

echo "[3/3] Starting Admin Dashboard (port 5173)..."
cd admin-dashboard && npm run dev &
PID3=$!
cd ..
sleep 3

echo ""
echo "========================================"
echo "  All services started!"
echo "  Admin Dashboard: http://localhost:5173"
echo "  Backend API:     http://localhost:3000"
echo "  Mock Platforms:  http://localhost:3001"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop all services..."

# Open browser
if command -v xdg-open &>/dev/null; then xdg-open http://localhost:5173;
elif command -v open &>/dev/null; then open http://localhost:5173; fi

wait
