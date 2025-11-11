# EduFlow - School Management Platform

A modern, full-stack school management system built with React, Node.js, Express, and PostgreSQL.

## Features

- ✅ **Public Landing Page** - Professional website for your school
- ✅ **Admin Dashboard** - Complete system management (students, teachers, classes)
- ✅ **Teacher Dashboard** - Manage classes and enter student marks
- ✅ **Student Dashboard** - View grades, reports, and class information
- ✅ **Role-Based Access Control** - Secure authentication with JWT
- ✅ **RESTful API** - Full backend API with PostgreSQL
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Docker Ready** - Complete containerization for easy deployment

## Tech Stack

### Frontend
- React 18 + Vite
- React Router for navigation
- TanStack Query for data fetching
- Lucide React for icons
- Modern CSS with custom design system

### Backend
- Node.js + Express
- PostgreSQL database
- JWT authentication
- bcryptjs for password hashing
- CORS, Helmet for security

### DevOps
- Docker & Docker Compose
- Nginx for production frontend
- Health checks and auto-restart

## Quick Start

### 🚂 Deploy to Railway (Fastest)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/maanisingh/eduflow)

See [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md) for detailed Railway deployment instructions.

### 🐳 Local Docker Deployment

#### Prerequisites
- Docker and Docker Compose
- Git

#### Installation

1. **Clone this repository**
   ```bash
   git clone https://github.com/maanisingh/eduflow.git
   cd eduflow
   ```

2. **Configure environment (optional)**
   ```bash
   # Edit .env file to customize settings
   nano .env
   ```

3. **Deploy with one command**
   ```bash
   ./deploy.sh
   ```

That's it! The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8447
- **Database**: localhost:5432

### Default Credentials

**Admin Account:**
- Email: `admin@eduflow.com`
- Password: `admin123`

**Teacher Account:**
- Email: `teacher@eduflow.com`
- Password: `teacher123`

**Student Account:**
- Email: `student@eduflow.com`
- Password: `student123`

## Manual Deployment (without Docker)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Create database
psql -U postgres -c "CREATE DATABASE eduflow;"
psql -U postgres -d eduflow -f database/schema.sql

# Start server
npm start
```

Backend will run on port 8447.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Or build for production
npm run build
```

Frontend will run on port 3000.

## Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# View running containers
docker-compose ps

# Access database
docker-compose exec db psql -U eduflow_user -d eduflow
```

## Project Structure

```
eduflow/
├── backend/
│   ├── config/          # Database configuration
│   ├── database/        # SQL schema
│   ├── middleware/      # Authentication middleware
│   ├── server.js        # Express server
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   └── dashboards/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── TeacherDashboard.jsx
│   │   │       └── StudentDashboard.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── deploy.sh
├── .env
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Classes
- `GET /api/classes` - List classes
- `POST /api/classes` - Create class (Admin/Teacher)

### Students
- `GET /api/students` - List students
- `POST /api/students` - Create student (Admin)

### Teachers
- `GET /api/teachers` - List teachers (Admin)
- `POST /api/teachers` - Create teacher (Admin)

### Marks/Grades
- `GET /api/marks` - Get marks
- `POST /api/marks` - Enter marks (Teacher/Admin)

### Subjects
- `GET /api/subjects` - List subjects

### Dashboard Stats
- `GET /api/stats/dashboard` - Get role-specific statistics

## Customization

### Branding

1. **Update Logo**: Replace `BookOpen` icon in components with your logo
2. **Colors**: Edit CSS variables in `frontend/src/App.css`:
   ```css
   :root {
     --primary: #7c3aed;     /* Your brand color */
     --secondary: #1e293b;
   }
   ```
3. **Name**: Search and replace "EduFlow" throughout the project

### Adding Features

- **Frontend**: Add new pages in `frontend/src/pages/`
- **Backend**: Add new endpoints in `backend/server.js`
- **Database**: Add migrations in `backend/database/`

## Production Deployment

### Using a Custom Domain

1. Update `.env`:
   ```env
   CORS_ORIGIN=https://yourdomain.com
   VITE_API_URL=https://yourdomain.com:8447
   ```

2. Set up reverse proxy (Nginx example):
   ```nginx
   server {
       listen 443 ssl;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
       }

       location /api {
           proxy_pass http://localhost:8447;
       }
   }
   ```

### Environment Variables

Key variables in `.env`:
- `PORT` - Backend port (default: 8447)
- `DB_PASSWORD` - **Change this in production!**
- `JWT_SECRET` - **Change this in production!**
- `CORS_ORIGIN` - Your domain
- `NODE_ENV` - Set to `production`

## Backup & Restore

### Backup Database
```bash
docker-compose exec db pg_dump -U eduflow_user eduflow > backup.sql
```

### Restore Database
```bash
docker-compose exec -T db psql -U eduflow_user eduflow < backup.sql
```

## Troubleshooting

### Containers won't start
```bash
docker-compose logs
docker-compose down -v  # Remove volumes
docker-compose up -d
```

### Database connection issues
```bash
# Check if database is running
docker-compose ps

# Check database logs
docker-compose logs db

# Verify credentials in .env match docker-compose.yml
```

### Frontend can't connect to backend
- Check CORS_ORIGIN in `.env`
- Verify VITE_API_URL points to correct backend URL
- Check browser console for errors

## Support & Development

- **Author**: AlexandraTechLab
- **License**: MIT
- **Version**: 1.0.0

## Roadmap

- [ ] Attendance tracking
- [ ] Report card generation
- [ ] Parent portal
- [ ] Announcements system
- [ ] File uploads
- [ ] Email notifications
- [ ] Mobile app

---

**Built with ❤️ by AlexandraTechLab**
