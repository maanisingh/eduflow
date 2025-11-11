# 🚂 Railway Deployment Guide

Deploy EduFlow to Railway in minutes!

## Quick Deploy to Railway

### Option 1: One-Click Deploy (Easiest)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/eduflow)

### Option 2: Manual Deploy

#### Step 1: Prerequisites
- Railway account (sign up at https://railway.app)
- This GitHub repository forked/cloned

#### Step 2: Create New Project

1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose **maanisingh/eduflow**

#### Step 3: Configure Services

Railway will detect the `docker-compose.yml` and create 3 services:
- **Database** (PostgreSQL)
- **Backend** (Node.js API)
- **Frontend** (React app)

#### Step 4: Set Environment Variables

**For Backend Service:**
```env
PORT=8447
NODE_ENV=production
DB_HOST=${{Postgres.RAILWAY_PRIVATE_DOMAIN}}
DB_PORT=5432
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
```

**For Frontend Service:**
```env
VITE_API_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}
```

#### Step 5: Deploy

Click **"Deploy"** and Railway will:
1. Pull your code from GitHub
2. Build Docker images
3. Start all services
4. Assign public URLs

#### Step 6: Access Your App

After deployment (2-3 minutes):
- Frontend: `https://your-app.railway.app`
- Backend API: `https://your-api.railway.app`

### Default Credentials

**Admin:**
- Email: `admin@eduflow.com`
- Password: `admin123`

**Teacher:**
- Email: `teacher@eduflow.com`
- Password: `teacher123`

**Student:**
- Email: `student@eduflow.com`
- Password: `student123`

⚠️ **Change these immediately after first login!**

---

## Detailed Railway Configuration

### Database Setup

Railway automatically provisions PostgreSQL. The database schema will be initialized on first run from `backend/database/schema.sql`.

**Verify database:**
```bash
railway run psql
```

### Custom Domain

1. Go to your Frontend service settings
2. Click **"Settings" > "Networking"**
3. Add your custom domain
4. Update `CORS_ORIGIN` in backend to match your domain

### Scaling

Railway auto-scales based on traffic. For production:

1. **Backend**:
   - Min instances: 1
   - Max instances: 5
   - Memory: 512MB

2. **Frontend**:
   - Min instances: 1
   - Max instances: 3
   - Memory: 256MB

3. **Database**:
   - Shared PostgreSQL (free tier)
   - Upgrade to dedicated for production

### Monitoring

Railway provides built-in monitoring:
- **Metrics**: CPU, Memory, Network
- **Logs**: Real-time application logs
- **Deployments**: Version history

Access via: Dashboard > Your Project > Metrics

---

## Alternative: Railway CLI Deploy

### Install Railway CLI

```bash
npm install -g @railway/cli
```

### Login

```bash
railway login
```

### Deploy

```bash
# Initialize Railway project
railway init

# Link to existing project (optional)
railway link

# Deploy all services
railway up

# View logs
railway logs
```

---

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| PORT | Backend port | 8447 | Yes |
| NODE_ENV | Environment | production | Yes |
| DB_HOST | Database host | Railway auto | Yes |
| DB_PORT | Database port | 5432 | Yes |
| DB_NAME | Database name | Railway auto | Yes |
| DB_USER | Database user | Railway auto | Yes |
| DB_PASSWORD | Database password | Railway auto | Yes |
| JWT_SECRET | JWT secret key | - | Yes |
| JWT_EXPIRES_IN | Token expiry | 7d | No |
| CORS_ORIGIN | Allowed origins | * | Yes |

### Frontend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL | Yes |

---

## Troubleshooting

### Build Fails

**Check logs:**
```bash
railway logs --service backend
railway logs --service frontend
```

**Common issues:**
- Missing environment variables
- Database connection failure
- Docker build errors

**Solution:**
1. Verify all env vars are set
2. Check database is running
3. Review build logs for errors

### Database Connection Issues

**Check connection:**
```bash
railway run psql
\dt  # List tables
```

**If schema not loaded:**
```bash
railway run psql < backend/database/schema.sql
```

### Frontend Can't Connect to Backend

**Verify CORS:**
- Check `CORS_ORIGIN` in backend matches frontend domain
- Update `VITE_API_URL` to backend public URL

### Slow Performance

**Optimize:**
1. Upgrade database plan
2. Increase backend memory
3. Enable caching
4. Use Railway's CDN for frontend

---

## Cost Estimate

Railway Pricing (as of 2024):

**Free Tier:**
- $5 free credit/month
- Shared resources
- Good for testing

**Pro Plan ($20/month):**
- Dedicated resources
- Custom domains
- Better performance
- Recommended for production

**Estimated Monthly Cost:**
- Database: $5-10
- Backend: $10-15
- Frontend: $5-10
- **Total: ~$20-35/month**

---

## Production Checklist

Before going live:

- [ ] Change default passwords
- [ ] Update JWT_SECRET to strong random string
- [ ] Set up custom domain
- [ ] Configure SSL (Railway auto)
- [ ] Enable database backups
- [ ] Set up monitoring alerts
- [ ] Update CORS_ORIGIN to your domain
- [ ] Test all user flows
- [ ] Load test with expected traffic
- [ ] Set up error tracking (Sentry)

---

## Backup & Restore

### Backup Database

```bash
railway run pg_dump > backup.sql
```

### Restore Database

```bash
railway run psql < backup.sql
```

### Automated Backups

Railway Pro includes automatic daily backups.

---

## CI/CD with Railway

Railway auto-deploys on git push:

1. Push to main branch
2. Railway detects changes
3. Rebuilds and redeploys
4. Zero downtime deployment

**Configure auto-deploy:**
- Dashboard > Settings > Auto Deploy: ON

---

## Support

**Railway Documentation:**
https://docs.railway.app

**EduFlow Issues:**
https://github.com/maanisingh/eduflow/issues

**Railway Community:**
https://discord.gg/railway

---

## Quick Commands Cheat Sheet

```bash
# Deploy
railway up

# View logs
railway logs

# Run database migrations
railway run psql < schema.sql

# SSH into service
railway shell

# Environment variables
railway variables

# Restart service
railway restart

# Check status
railway status
```

---

**Happy Deploying! 🚂**

Built with ❤️ by AlexandraTechLab
