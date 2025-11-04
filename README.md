# CIAP - Community Internet Access Platform

**Offline-First Community Portal for Underserved South African Communities**

A web-based system designed to provide low-bandwidth digital access in underserved communities using intelligent caching and local content delivery.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Demo Users](#demo-users)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

---

## ✨ Features

- **Community Portal**: Browse local jobs, skills/tutorials, notices, and business directory
- **Offline-First**: Content cached locally for access without internet
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Community Switching**: View content for different communities
- **Search**: Find relevant opportunities and resources
- **Role-Based Content**: User, Moderator, and Admin roles
- **Real-time Updates**: Sync with backend when connectivity returns

---

## 🛠 Tech Stack

### Frontend
- React 18 (Vite)
- Axios for API calls
- Progressive Web App (PWA) support
- Responsive CSS

### Backend
- Node.js + Express
- SQLite database
- RESTful API
- CORS enabled

### Deployment
- Backend: Render
- Frontend: Netlify
- Database: SQLite (file-based)

---

## 📦 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ciap-offline-first.git
cd ciap-offline-first
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Step 4: Create Environment Files

**Backend** (`backend/.env`):
```env
PORT=3001
SQLITE_FILE=./data/ciap.db
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3001/api/v1
VITE_COMMUNITY=Acornhoek
```

### Step 5: Seed the Database

```bash
cd backend
node resetDatabase.js
```

**Expected output:**
```
🔥 RESETTING DATABASE...
✅ Old database deleted
📋 Creating fresh database with schema...
✅ Tables created
🌱 Inserting seed data...
✅ Inserted 3 communities
✅ Inserted 6 jobs
✅ Inserted 5 skills
✅ Inserted 5 notices
✅ Inserted 6 directory entries
✅ Created 3 demo users
🎉 DATABASE RESET COMPLETE!
```

---

## 🏃 Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server will start on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will start on `http://localhost:5173`

### Option 2: Run Both Servers Concurrently (if configured)

From project root:
```bash
npm run dev
```

---

## 👥 Demo Users

The seed script creates these test accounts:

| Email | Password | Role |
|-------|----------|------|
| admin@ciap.local | password123 | Admin |
| moderator@ciap.local | password123 | Moderator |
| user@ciap.local | password123 | User |

---

## 📁 Project Structure

```
ciap-offline-first/
├── backend/
│   ├── data/
│   │   └── ciap.db              # SQLite database
│   ├── database/
│   │   ├── connection.js        # Database connection
│   │   ├── schema.sql           # Database schema
│   │   └── seeders/
│   │       └── fixedQuickSeed.js
│   ├── src/
│   │   ├── routes/              # API routes
│   │   │   ├── jobsRoutes.js
│   │   │   ├── skillsRoutes.js
│   │   │   ├── noticesRoutes.js
│   │   │   └── directoryRoutes.js
│   │   └── server.js            # Express server
│   ├── resetDatabase.js         # Database reset + seed
│   └── package.json
│
└── frontend/
    ├── public/
    │   ├── assets/              # Logo images
    │   └── hero/                # Hero carousel images
    ├── src/
    │   ├── components/
    │   │   ├── home/            # Home page sections
    │   │   ├── Footer.jsx       # Desktop footer
    │   │   └── BottomNav.jsx    # Mobile navigation
    │   ├── config/
    │   │   └── appConfig.jsx    # API configuration
    │   └── App.jsx              # Main app component
    └── package.json
```

---

## 🧪 Testing

### Manual Testing Checklist

**Desktop View (>900px):**
- [ ] Header with navigation visible
- [ ] Hero carousel with 3 slides
- [ ] Category chips scroll horizontally
- [ ] All sections show data (Jobs, Skills, Notices, Directory)
- [ ] Desktop footer visible at bottom
- [ ] "View All" buttons work
- [ ] Search bar functional
- [ ] Community selector switches content

**Mobile View (<900px):**
- [ ] Burger menu appears
- [ ] Bottom navigation bar visible
- [ ] Sections stack vertically
- [ ] Cards responsive on small screens
- [ ] Tel: links work for phone numbers

**API Testing:**

Test endpoints directly:
```bash
# Jobs
curl http://localhost:3001/api/v1/jobs?community=Acornhoek

# Skills  
curl http://localhost:3001/api/v1/skills?community=Acornhoek

# Notices
curl http://localhost:3001/api/v1/notices?community=Acornhoek

# Directory
curl http://localhost:3001/api/v1/directory?community=Acornhoek
```

### Automated Tests (Future)

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

---

## 🌐 Deployment

### Backend Deployment (Render)

1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Environment**: Add `PORT=3001`
5. Deploy

### Frontend Deployment (Netlify)

1. Create account at [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your repo
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Environment variables:
   - `VITE_API_URL`: Your Render backend URL
   - `VITE_COMMUNITY`: `Acornhoek`
6. Deploy

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.**

---

## 📸 Screenshots

### Desktop View
![Desktop Home](./screenshots/desktop-home.png)
*Home page showing hero carousel and category navigation*

![Jobs Section](./screenshots/jobs-section.png)
*Jobs & Opportunities with real images*

### Mobile View
![Mobile Home](./screenshots/mobile-home.png)
*Responsive mobile layout with bottom navigation*

---

## 🎯 Core Functionalities Demonstrated

1. **Community Content Portal** - Browse jobs, skills, notices, and local businesses
2. **Responsive Design** - Works seamlessly on desktop and mobile
3. **Real-time Data** - Content fetched from backend API
4. **Search & Filter** - Find relevant opportunities
5. **Offline-First Architecture** - Service worker caches content
6. **Community Switching** - View different community content

---

## 🔧 Troubleshooting

**Issue: Backend won't start**
- Check if port 3001 is available
- Verify `.env` file exists in backend folder
- Run `npm install` again

**Issue: Frontend shows empty sections**
- Verify backend is running on port 3001
- Check CORS configuration in backend
- Open browser console (F12) for errors

**Issue: Images not showing**
- Run `node resetDatabase.js` to reseed with images
- Check `image_url` field in database
- Verify Unsplash URLs are accessible

**Issue: CORS errors**
- Update `backend/src/server.js` CORS origin to match frontend URL
- Restart backend after changes

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Author

**Bavukile Vilane**  
African Leadership University - Software Engineering Capstone  
Supervisor: Ms. Ndinelao Iitumba

---

## 🔗 Links

- **GitHub Repository**: [Link to repo]
- **Live Demo**: [Deployed frontend URL]
- **Demo Video**: [YouTube/Loom link]
- **Project Proposal**: [Link to proposal]

---

## 📚 Additional Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- [TESTING.md](./TESTING.md) - Testing strategies and results
- [ANALYSIS.md](./ANALYSIS.md) - Project analysis and objectives
- [API.md](./API.md) - API documentation

---

**Built with ❤️ for offline-first access in underserved communities**