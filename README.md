# 🌐 CIAP - Community Internet Access Platform

**Offline-First Content Delivery System for Underserved Communities**

[![Software Engineering Capstone](https://img.shields.io/badge/Capstone-Software%20Engineering-blue)](https://alueducation.com)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org)

**Author:** Bavukile Vilane  
**Institution:** African Leadership University  
**Supervisor:** Ms. Ndinelao Iitumba

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Installation Instructions](#installation-instructions)
- [Running the Application](#running-the-application)
- [Testing the Offline Functionality](#testing-the-offline-functionality)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Technologies Used](#technologies-used)

---

## 🎯 Overview

CIAP is a production-grade offline-first web application designed to provide reliable internet access and content delivery in low-connectivity environments. The system demonstrates advanced software engineering principles including:

- **Design Patterns**: Strategy Pattern (caching algorithms), Singleton (database), Factory (cache creation)
- **Clean Architecture**: Layered design with clear separation of concerns
- **SOLID Principles**: Single Responsibility, Open/Closed, Dependency Inversion
- **Professional Practices**: Logging, error handling, security, testing

---

## ✨ Key Features

### Core Functionality
- ✅ **Offline-First Architecture** - Content accessible without internet
- ✅ **Intelligent Caching** - LRU and LFU cache strategies
- ✅ **Service Worker Integration** - Advanced PWA capabilities
- ✅ **Real-time Performance Metrics** - Cache hit rates, latency tracking
- ✅ **Content Management** - Upload, update, delete content
- ✅ **Admin Dashboard** - User management and system monitoring

### Technical Excellence
- ✅ **RESTful API** - Well-structured endpoints with proper HTTP methods
- ✅ **Security** - JWT authentication, rate limiting, input validation
- ✅ **Logging** - Winston logger with file rotation
- ✅ **Database Design** - Normalized schema with proper indexes
- ✅ **Error Handling** - Graceful degradation and user-friendly messages

---

## 🏗️ Architecture

```
┌─────────────────┐
│   React PWA     │
│  Service Worker │
└────────┬────────┘
         │
    HTTP/REST
         │
┌────────▼────────┐
│  Express API    │
│  (Node.js)      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼────┐
│Cache │  │SQLite │
│Layer │  │  DB   │
└──────┘  └───────┘
```

**Key Components:**
- **Frontend**: React 18 with Service Worker (offline capability)
- **Backend**: Node.js + Express (RESTful API)
- **Caching**: Strategy Pattern implementation (LRU/LFU)
- **Database**: SQLite with proper indexes
- **Deployment**: Docker-ready, cloud-deployable

---

## 🚀 Installation Instructions

### Prerequisites

Ensure you have the following installed:
- **Node.js** 18.x or higher ([Download](https://nodejs.org))
- **npm** 9.x or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com))

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/ciap-offline-first.git
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

### Step 4: Configure Environment Variables

**Backend** - Create `backend/.env`:
```env
PORT=3001
NODE_ENV=development
DB_PATH=./data/ciap.db
JWT_SECRET=your-secret-key-change-in-production
CACHE_STRATEGY=LRU
CACHE_TTL=3600
```

**Frontend** - Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:3001/api/v1
```

---

## ▶️ Running the Application

### Option 1: Development Mode (Recommended for Testing)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Backend runs at: `http://localhost:3001`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```
Frontend runs at: `http://localhost:3000`

### Option 2: Production Mode

**Build and Run Backend:**
```bash
cd backend
npm start
```

**Build Frontend:**
```bash
cd frontend
npm run build
npm install -g serve
serve -s build -p 3000
```

---

## 🧪 Testing the Offline Functionality

### Critical Demo Steps (For Video Recording)

#### Step 1: Verify Online Mode
1. Open http://localhost:3000
2. See "🌐 ONLINE" indicator at the top
3. Browse content - note the load times
4. Open Browser DevTools (F12) → Network tab

#### Step 2: Enable Offline Mode
1. **Chrome/Edge**: DevTools → Network tab → Check "Offline" checkbox
2. **Firefox**: DevTools → Network tab → Select "Offline" from throttling
3. **Physical Test**: Turn on Airplane Mode or disconnect WiFi

#### Step 3: Verify Offline Functionality
1. Observe "📴 OFFLINE MODE" banner appears
2. Try browsing content - it still works!
3. Click any content card - loads instantly
4. Check Network tab - see "Service Worker" as source
5. Load times show 0ms (from cache)

#### Step 4: Performance Comparison
1. Go back online
2. Navigate to Performance Metrics page
3. See cache hit rate, bandwidth savings
4. Compare online vs offline latencies

### Testing Checklist

- [ ] Content loads online (normal network speed)
- [ ] Service Worker registers successfully
- [ ] Offline mode indicator appears when disconnected
- [ ] All cached content accessible offline
- [ ] Search and filtering work offline
- [ ] Admin dashboard shows cache statistics
- [ ] Performance metrics display correctly
- [ ] Content upload works (admin, online)

---

## 📡 API Documentation

### Content Endpoints

**GET /api/v1/content**
- Description: Get all content items
- Query Params: `type`, `search`
- Response: Array of content objects

**GET /api/v1/content/:id**
- Description: Get single content item
- Response: Content object with metadata

**POST /api/v1/content** 🔒 Admin
- Description: Upload new content
- Body: `title`, `description`, `file`
- Response: Created content object

### Metrics Endpoints

**GET /api/v1/content/stats/cache**
- Description: Get cache statistics
- Response: Cache hit rate, size, top content

**GET /api/v1/content/stats/performance**
- Description: Get performance metrics
- Query: `timeRange` (1h, 24h, 7d)
- Response: Latency, bandwidth savings

---

## 🌐 Deployment

### Deploy to Render.com (Free Tier)

**Backend Deployment:**
1. Create account at [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Build command: `cd backend && npm install`
5. Start command: `cd backend && npm start`
6. Add environment variables

**Frontend Deployment:**
1. New → Static Site
2. Build command: `cd frontend && npm run build`
3. Publish directory: `frontend/build`

### Deploy to Vercel (Alternative)

```bash
cd frontend
npm install -g vercel
vercel --prod
```

### Local Docker Deployment

```bash
docker-compose up --build
```

---

## 🛠️ Technologies Used

### Backend
- **Node.js 18** - JavaScript runtime
- **Express 4** - Web framework
- **SQLite 3** - Embedded database
- **Winston** - Professional logging
- **JWT** - Authentication
- **Multer** - File uploads
- **Joi** - Validation

### Frontend
- **React 18** - UI library
- **Service Workers** - Offline capability
- **Workbox** - Service Worker tools
- **Axios** - HTTP client
- **React Router** - Navigation

### Testing & Quality
- **Jest** - Unit testing
- **Supertest** - API testing
- **ESLint** - Code linting

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD (optional)

---

## 📊 Performance Benchmarks

| Metric | Online | Offline |
|--------|--------|---------|
| Page Load | ~300ms | ~50ms |
| Content Fetch | ~150ms | 0-5ms |
| Cache Hit Rate | N/A | >95% |
| Bandwidth Used | High | Zero |

---

## 🎓 Academic Context

This project fulfills the requirements of the Software Engineering Capstone at African Leadership University. It demonstrates:

1. **Testing Strategies**: Unit, integration, performance testing
2. **Analysis**: Comparison of cache strategies, performance metrics
3. **Deployment**: Production-ready deployment with documentation

---

## 📝 License

MIT License - See LICENSE file

---

## 👨‍💻 Author

**Bavukile Vilane**  
BSc. Software Engineering  
African Leadership University  
b.vilane@alustudent.com

---

## 🙏 Acknowledgments

- Supervisor: Ms. Ndinelao Iitumba
- African Leadership University
- Open-source community

---

**Last Updated:** October 28, 2025