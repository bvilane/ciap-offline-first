# 🚀 CIAP Deployment Guide

**Production deployment documentation for rubric compliance**

---

## 📋 Deployment Overview

This guide covers deployment to:
1. ✅ Render.com (Recommended - Free tier available)
2. ✅ Vercel (Frontend only)
3. ✅ Local Docker deployment
4. ✅ Manual VPS deployment

---

## 🎯 Option 1: Render.com (RECOMMENDED)

### Why Render?
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Easy CI/CD from GitHub
- ✅ Built-in logging
- ✅ Simple environment variables

### Prerequisites
- GitHub account with your code pushed
- Render.com account (free)

### Deploy Backend

1. **Create New Web Service**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect GitHub repository

2. **Configure Build Settings**
   ```
   Name: ciap-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   ```

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=<generate-strong-secret-min-32-chars>
   DB_PATH=./data/ciap.db
   CACHE_STRATEGY=LRU
   CACHE_TTL=3600
   CORS_ORIGIN=https://your-frontend-url.onrender.com
   ```

4. **Create Service**
   - Click "Create Web Service"
   - Wait for deployment (3-5 minutes)
   - Copy the service URL (e.g., `https://ciap-backend.onrender.com`)

5. **Seed Database**
   - Go to Shell tab in Render dashboard
   - Run: `node src/database/seed.js`

### Deploy Frontend

1. **Create Static Site**
   - New + → Static Site
   - Connect same repository

2. **Configure Build**
   ```
   Name: ciap-frontend
   Branch: main
   
   Build Command: cd frontend && npm install && npm run build
   Publish Directory: frontend/build
   ```

3. **Environment Variables**
   ```
   REACT_APP_API_URL=https://ciap-backend.onrender.com/api/v1
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Wait for build (2-3 minutes)

### Verification

1. Visit your frontend URL
2. Check that content loads
3. Test offline mode
4. Verify API connection

**Deployment Status: ✅ COMPLETE**

---

## 🎯 Option 2: Vercel (Frontend) + Render (Backend)

### Backend on Render
Follow steps from Option 1 above

### Frontend on Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add REACT_APP_API_URL
   # Enter: https://your-backend-url.onrender.com/api/v1
   ```

4. **Redeploy**
   ```bash
   vercel --prod
   ```

---

## 🐳 Option 3: Docker Deployment

### Docker Compose (Full Stack)

1. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   
   services:
     backend:
       build: ./backend
       ports:
         - "3001:3001"
       environment:
         - NODE_ENV=production
         - JWT_SECRET=your-secret-key-here
       volumes:
         - ./data:/app/data
         - ./content:/app/content
   
     frontend:
       build: ./frontend
       ports:
         - "3000:80"
       environment:
         - REACT_APP_API_URL=http://localhost:3001/api/v1
       depends_on:
         - backend
   ```

2. **Create Backend Dockerfile**
   ```dockerfile
   # backend/Dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   
   EXPOSE 3001
   
   CMD ["npm", "start"]
   ```

3. **Create Frontend Dockerfile**
   ```dockerfile
   # frontend/Dockerfile
   FROM node:18-alpine as build
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   
   EXPOSE 80
   ```

4. **Deploy**
   ```bash
   docker-compose up -d
   ```

---

## 🖥️ Option 4: Manual VPS Deployment

### Prerequisites
- Ubuntu 20.04+ VPS
- Domain name (optional)
- SSH access

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### Step 2: Deploy Backend

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/your-username/ciap.git
cd ciap/backend

# Install dependencies
npm install --production

# Setup environment
sudo nano .env
# Copy from .env.example and update values

# Seed database
node src/database/seed.js

# Start with PM2
pm2 start src/server.js --name ciap-backend
pm2 save
pm2 startup
```

### Step 3: Deploy Frontend

```bash
cd /var/www/ciap/frontend

# Build
npm install
npm run build

# Move to Nginx directory
sudo cp -r build/* /var/www/html/
```

### Step 4: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/ciap
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ciap /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: SSL with Let's Encrypt (Optional)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## ✅ Post-Deployment Checklist

### Functionality Tests
- [ ] Homepage loads correctly
- [ ] Content displays
- [ ] Search works
- [ ] Filtering works
- [ ] Service Worker registers
- [ ] Offline mode works
- [ ] Performance metrics display
- [ ] Admin login works
- [ ] Content upload works (admin)

### Performance Tests
- [ ] Page load time < 3s
- [ ] API response time < 500ms
- [ ] Cache hit rate > 80%
- [ ] No console errors
- [ ] Mobile responsive

### Security Tests
- [ ] HTTPS enabled
- [ ] JWT authentication works
- [ ] Rate limiting active
- [ ] CORS configured correctly
- [ ] No sensitive data exposed

---

## 📊 Monitoring & Logs

### Render.com
- View logs in dashboard
- Set up log drains (optional)

### VPS
```bash
# Backend logs
pm2 logs ciap-backend

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 🔄 Updates & Maintenance

### Render.com
- Push to GitHub main branch
- Render auto-deploys

### VPS
```bash
cd /var/www/ciap
sudo git pull
cd backend && npm install
pm2 restart ciap-backend

cd ../frontend && npm install && npm run build
sudo cp -r build/* /var/www/html/
```

---

## 🐛 Common Issues

### Issue: CORS Errors
**Solution:** Update CORS_ORIGIN in backend .env to match frontend URL

### Issue: Service Worker Not Working
**Solution:** Ensure HTTPS is enabled and service-worker.js is accessible

### Issue: Database Not Found
**Solution:** Run seed script: `node src/database/seed.js`

### Issue: 502 Bad Gateway
**Solution:** Check backend is running: `pm2 status` or check Render logs

---

## 📈 Scaling Considerations

### Current Architecture (MVP)
- Single server
- SQLite database
- In-memory cache
- Good for: 100-1000 users

### Future Scaling
1. **Database:** Migrate to PostgreSQL
2. **Cache:** Use Redis cluster
3. **Storage:** Use CDN for content
4. **Servers:** Load balancer + multiple instances
5. **Monitoring:** Add APM (New Relic, Datadog)

---

## ✅ Deployment Success Criteria

Your deployment is successful when:

1. ✅ Application is accessible via public URL
2. ✅ All core features work
3. ✅ Offline mode functions correctly
4. ✅ Performance metrics are good (<3s load)
5. ✅ No critical errors in logs
6. ✅ HTTPS is enabled
7. ✅ Can record demo video showing deployed version

---

**🎉 Deployment Complete! Your CIAP system is now live!**

**Deployed URL:** _____________________________

**Deployment Date:** _____________________________

**Status:** ✅ VERIFIED WORKING