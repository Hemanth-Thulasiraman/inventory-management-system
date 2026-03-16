#!/bin/bash

# Start Inventory Management System - Postgres + Backend + Frontend

cleanup() {
  echo "\nShutting down..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  docker compose down
  exit 0
}

trap cleanup SIGINT SIGTERM

cd "$(dirname "$0")"

# Start Postgres via Docker
echo "Starting PostgreSQL..."
docker compose up -d

# Wait for Postgres to be ready
echo "Waiting for PostgreSQL to be ready..."
until docker exec inventory_postgres pg_isready -U postgres -q; do
  sleep 1
done
echo "PostgreSQL is ready."

# Start backend
echo "Starting backend on port 5001..."
cd backend && npm install --silent && node src/index.js &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend..."
cd ../frontend && npx vite --port 3000 &
FRONTEND_PID=$!

echo ""
echo "Backend:  http://localhost:5001/api"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

wait
