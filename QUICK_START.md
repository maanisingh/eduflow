# EduFlow - Quick Start Guide

## 🚀 Deploy in 2 Minutes

### Step 1: Prerequisites
Make sure you have Docker installed:
```bash
docker --version
docker-compose --version
```

If not installed, get Docker from: https://docs.docker.com/get-docker/

### Step 2: Deploy
```bash
./deploy.sh
```

That's it! Wait 30 seconds and open: **http://localhost:3000**

---

## 📱 Access the Platform

### Landing Page
Open: http://localhost:3000

### Login
Click "Login" and use these credentials:

**Admin Dashboard:**
- Email: `admin@eduflow.com`
- Password: `admin123`

**Teacher Dashboard:**
- Email: `teacher@eduflow.com`
- Password: `teacher123`

**Student Dashboard:**
- Email: `student@eduflow.com`
- Password: `student123`

---

## 🎨 Customization

### Change Branding
1. Edit `.env` - Update `APP_NAME`
2. Edit `frontend/src/App.css` - Change `--primary` color
3. Replace "EduFlow" in all files with your school name

### Change Port
Edit `.env`:
```env
PORT=9000  # Change from 8447 to any port
```

Then restart:
```bash
docker-compose down
docker-compose up -d
```

---

## 📦 Package for Another Machine

Create a transfer package:
```bash
./package.sh
```

This creates a `.tar.gz` file you can copy to any machine.

**On the new machine:**
```bash
tar -xzf eduflow-deployment-*.tar.gz
cd eduflow-deployment-*
./deploy.sh
```

---

## 🔧 Useful Commands

**View logs:**
```bash
docker-compose logs -f
```

**Stop everything:**
```bash
docker-compose down
```

**Restart:**
```bash
docker-compose restart
```

**Access database:**
```bash
docker-compose exec db psql -U eduflow_user -d eduflow
```

---

## 🌐 Deploy to Production Domain

1. Update `.env`:
```env
CORS_ORIGIN=https://yourschool.com
VITE_API_URL=https://yourschool.com/api
```

2. Set up reverse proxy (Nginx/Caddy)

3. Get SSL certificate (Let's Encrypt)

4. Restart containers:
```bash
docker-compose down
docker-compose up -d
```

---

## ❓ Troubleshooting

**Port already in use?**
```bash
# Change port in .env
nano .env
# Update PORT=8448 (or any free port)
```

**Can't connect to database?**
```bash
# Check logs
docker-compose logs db

# Restart database
docker-compose restart db
```

**Frontend not loading?**
```bash
# Rebuild frontend
docker-compose up -d --build frontend
```

---

## 📞 Need Help?

Check `README.md` for full documentation.

---

**Built by AlexandraTechLab**
