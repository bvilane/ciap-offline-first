# CIAP Deployment Guide

Complete guide for deploying CIAP to production environments.

---

## 🎯 Deployment Strategy

**Backend**: Render (Free tier)  
**Frontend**: Netlify (Free tier)  
**Database**: SQLite (included with backend)

---

## 📋 Pre-Deployment Checklist

- [ ] All code committed to GitHub
- [ ] `.env` files NOT committed (use `.env.example`)
- [ ] Production environment variables ready
- [ ] Database seeded with demo data
- [ ] CORS configured for production URLs
- [ ] All tests passing locally

---

## 🚀 Backend Deployment (Render)

### Step 1: Prepare Backend for Production

**1.1 Update CORS in `backend/src/server.js`:**

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://YOUR-NETLIFY-SITE.netlify.app'  // Add after deploying frontend
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

**1.2 Commit and push to GitHub:**

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy to Render

**2.1 Create Render Account:**
- Go to [render.com](https://render.com)
- Sign up with GitHub

**2.2 Create New Web Service:**
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Select the repository: `ciap-offline-first`

**2.3 Configure Service:**

| Setting | Value |
|---------|-------|
| **Name** | `ciap-backend` |
| **Region** | Select closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node src/server.js` |

**2.4 Add Environment Variables:**

Click "Advanced" → "Add Environment Variable":

```
PORT=3001
SQLITE_FILE=./data/ciap.db
NODE_ENV=production
```

**2.5 Create Disk for Database:**

Under "Disks":
- Click "Add Disk"
- **Name**: `ciap-data`
- **Mount Path**: `/opt/render/project/src/backend/data`
- **Size**: 1 GB (free tier)

**2.6 Deploy:**

- Click "Create Web Service"
- Wait 5-10 minutes for first deploy
- Copy the URL: `https://ciap-backend-xxxx.onrender.com`

### Step 3: Seed Production Database

**Option A: Via Render Shell**
```bash
# In Render dashboard, open Shell
cd /opt/render/project/src
node resetDatabase.js
```

**Option B: Create seed endpoint (temporary)**
```javascript
// Add to server.js temporarily
app.post('/api/admin/seed', async (req, res) => {
  // Run seed logic
  res.json({ message: 'Database seeded' });
});
```

Call it once: `POST https://your-backend.onrender.com/api/admin/seed`

Then remove the endpoint and redeploy.

### Step 4: Verify Backend

Test endpoints:
```bash
curl https://ciap-backend-xxxx.onrender.com/health
curl https://ciap-backend-xxxx.onrender.com/api/v1/jobs?community=Acornhoek
```

---

## 🎨 Frontend Deployment (Netlify)

### Step 1: Prepare Frontend

**1.1 Update environment for production:**

Create `frontend/.env.production`:
```env
VITE_API_URL=https://ciap-backend-xxxx.onrender.com/api/v1
VITE_COMMUNITY=Acornhoek
```

**1.2 Test production build locally:**

```bash
cd frontend
npm run build
npm run preview
```

Open `http://localhost:4173` and verify everything works.

### Step 2: Deploy to Netlify

**2.1 Create Netlify Account:**
- Go to [netlify.com](https://netlify.com)
- Sign up with GitHub

**2.2 Import Project:**
- Click "Add new site" → "Import an existing project"
- Choose "GitHub"
- Select `ciap-offline-first` repository

**2.3 Configure Build Settings:**

| Setting | Value |
|---------|-------|
| **Base directory** | `frontend` |
| **Build command** | `npm run build` |
| **Publish directory** | `frontend/dist` |
| **Production branch** | `main` |

**2.4 Add Environment Variables:**

Click "Site settings" → "Environment variables" → "Add a variable":

```
VITE_API_URL=https://ciap-backend-xxxx.onrender.com/api/v1
VITE_COMMUNITY=Acornhoek
```

**2.5 Deploy:**

- Click "Deploy site"
- Wait 2-3 minutes
- Site will be live at: `https://YOUR-SITE-NAME.netlify.app`

### Step 3: Update Backend CORS

**Go back to Render**, update CORS to include your Netlify URL:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://YOUR-SITE-NAME.netlify.app'  // ← Add this
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

Commit and push, Render will auto-redeploy.

### Step 4: Verify Frontend

- Visit `https://YOUR-SITE-NAME.netlify.app`
- Check all sections load data
- Test on mobile
- Verify images show

---

## ✅ Post-Deployment Verification

### Backend Health Check

```bash
curl https://ciap-backend-xxxx.onrender.com/health
```

Expected:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-04T12:00:00Z",
  "uptime": 123.45,
  "environment": "production"
}
```

### Frontend Functionality Check

- [ ] Homepage loads
- [ ] Hero carousel works
- [ ] All sections show data
- [ ] Search works
- [ ] Community selector works
- [ ] Navigation works
- [ ] Mobile view works
- [ ] Images load from Unsplash

### API Response Check

```bash
# Jobs
curl https://ciap-backend-xxxx.onrender.com/api/v1/jobs?community=Acornhoek

# Should return JSON with 6 jobs
```

---

## 🔧 Troubleshooting

### Issue: "Application failed to respond"

**Cause**: Backend not starting  
**Fix**: 
- Check Render logs
- Verify `Start Command` is correct
- Check environment variables

### Issue: Frontend shows CORS errors

**Cause**: Backend CORS not configured for Netlify URL  
**Fix**:
- Add Netlify URL to CORS origins
- Redeploy backend

### Issue: Images not showing

**Cause**: Database not seeded  
**Fix**:
- Seed database via Render shell
- Verify image URLs in API response

### Issue: "Cannot GET /api/v1/jobs"

**Cause**: Routes not loaded  
**Fix**:
- Check backend logs for startup errors
- Verify all route files exist

---

## 📊 Monitoring & Maintenance

### Render Dashboard

Monitor:
- CPU/Memory usage
- Request logs
- Error logs
- Deploy history

### Netlify Dashboard

Monitor:
- Build logs
- Deploy previews
- Form submissions (if enabled)
- Analytics

### Health Checks

Set up automated checks:
```bash
# Backend health
curl https://ciap-backend-xxxx.onrender.com/health

# Frontend availability
curl https://YOUR-SITE-NAME.netlify.app
```

---

## 🔄 Continuous Deployment

Both Render and Netlify auto-deploy on git push:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

- **Render**: Rebuilds backend (~5 min)
- **Netlify**: Rebuilds frontend (~2 min)

---

## 💰 Cost Breakdown

### Free Tier Limits

**Render (Free):**
- 750 hours/month
- Sleeps after 15 min inactivity
- Wakes on first request (cold start ~30s)

**Netlify (Free):**
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites

### Upgrade Path

If needed:
- **Render Starter**: $7/month (no sleep, more resources)
- **Netlify Pro**: $19/month (more bandwidth, analytics)

---

## 🔐 Security Considerations

### Production Checklist

- [ ] No secrets in code
- [ ] Environment variables set
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] HTTPS enforced (automatic on both platforms)
- [ ] Database backups configured

### Render Security

- Automatic HTTPS
- DDoS protection
- Private networking (paid plans)

### Netlify Security

- Automatic HTTPS
- HTTP/2 support
- CDN caching
- Password protection (paid plans)

---

## 📝 Deployment Logs

Keep a deployment log:

| Date | Version | Changes | Status |
|------|---------|---------|--------|
| 2025-11-04 | v1.0.0 | Initial deployment | ✅ Success |
| 2025-11-05 | v1.0.1 | Fixed CORS | ✅ Success |

---

## 🔗 Deployed URLs

**Backend API**: https://ciap-backend-xxxx.onrender.com  
**Frontend**: https://YOUR-SITE-NAME.netlify.app  
**GitHub**: https://github.com/YOUR_USERNAME/ciap-offline-first

---

## 📚 Additional Resources

- [Render Docs](https://render.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [Express Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

**Deployment verified**: ✅  
**Date**: November 4, 2025  
**Deployed by**: Bavukile Vilane