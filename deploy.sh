#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              EduFlow Deployment Script                       ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose found"
echo ""

# Stop any running containers
echo "📦 Stopping existing containers..."
docker-compose down

# Build and start containers
echo "🔨 Building Docker images..."
docker-compose build

echo "🚀 Starting EduFlow containers..."
docker-compose up -d

# Wait for services to be healthy
echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║              ✅ EduFlow Deployed Successfully!               ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    echo "📍 Access URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8447/api/health"
    echo "   Database: localhost:5432"
    echo ""
    echo "🔐 Default Login Credentials:"
    echo "   Admin: admin@eduflow.com / admin123"
    echo "   Teacher: teacher@eduflow.com / teacher123"
    echo "   Student: student@eduflow.com / student123"
    echo ""
    echo "📝 Useful commands:"
    echo "   View logs: docker-compose logs -f"
    echo "   Stop: docker-compose down"
    echo "   Restart: docker-compose restart"
    echo ""
else
    echo "❌ Deployment failed. Check logs with: docker-compose logs"
    exit 1
fi
