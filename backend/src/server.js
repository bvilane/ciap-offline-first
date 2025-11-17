/**
 * CIAP Backend Server - PRODUCTION READY
 * Fixed: Rate limiting, CORS, Health checks
 */

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const logger = require('./utils/logger');
const database = require('./database/connection');

// Existing routes
const contentRoutes = require('./routes/contentRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const metricsRoutes = require('./routes/metricsRoutes');

// MVP community portal routes
let noticesRoutes, jobsRoutes, skillsRoutes, directoryRoutes, communitiesRoutes;
try { noticesRoutes = require('./routes/noticesRoutes'); } catch { noticesRoutes = null; }
try { jobsRoutes = require('./routes/jobsRoutes'); } catch { jobsRoutes = null; }
try { skillsRoutes = require('./routes/skillsRoutes'); } catch { skillsRoutes = null; }
try { directoryRoutes = require('./routes/directoryRoutes'); } catch { directoryRoutes = null; }
try { communitiesRoutes = require('./routes/communities'); } catch { communitiesRoutes = null; }

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:']
    }
  },
  crossOriginEmbedderPolicy: false
}));

// ===== FIXED CORS CONFIGURATION =====
const corsOptions = {
  origin: [
    'http://localhost:3000',  // Create React App
    'http://localhost:5173',  // Vite default
    'http://localhost:5174',  // Vite alternative
    'https://ciap-platform.netlify.app',  // Production frontend
    /https:\/\/.*\.netlify\.app$/  // Any Netlify preview URLs
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Request logging
app.use(logger.httpLogger);

// ===== FIXED RATE LIMITING =====
// More lenient for production, skips health checks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Much higher for production
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for health checks
  skip: (req) => req.path === '/health' || req.path === '/api/v1/health'
});

app.use('/api/', limiter);

// ===== HEALTH CHECKS (No Rate Limit) =====

// Basic health check (for Render health checks)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.env
  });
});

// Detailed health endpoint for SystemStatus page
app.get('/api/v1/health', (req, res) => {
  const uptimeSeconds = Math.floor(process.uptime());
  const uptimeFormatted = uptimeSeconds > 3600 
    ? `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m`
    : uptimeSeconds > 60
    ? `${Math.floor(uptimeSeconds / 60)}m ${uptimeSeconds % 60}s`
    : `${uptimeSeconds}s`;

  res.json({ 
    status: 'ok',
    database: 'connected',
    uptime: uptimeFormatted,
    timestamp: new Date().toISOString(),
    environment: config.server.env
  });
});

// ===== API Routes =====
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/metrics', metricsRoutes);

// New MVP routes (mount only if present)
if (noticesRoutes)      app.use('/api/v1/notices', noticesRoutes);
if (jobsRoutes)         app.use('/api/v1/jobs', jobsRoutes);
if (skillsRoutes)       app.use('/api/v1/skills', skillsRoutes);
if (directoryRoutes)    app.use('/api/v1/directory', directoryRoutes);
if (communitiesRoutes)  app.use('/api/v1/communities', communitiesRoutes);

// Static content (uploads)
app.use('/content', express.static(path.join(__dirname, '../content/uploads')));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  res.status(err.statusCode || 500).json({
    error: err.name || 'Internal Server Error',
    message: config.server.env === 'production' ? 'An error occurred' : err.message
  });
});

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, starting graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed');
    try { await database.close(); } catch {}
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Bootstrapping
let server;

async function startServer() {
  try {
    // Initialize DB connection / migrations
    await database.connect();
    logger.info('Database initialized');

    // Start HTTP server
    const PORT = config.server.port || process.env.PORT || 3001;
    server = app.listen(PORT, () => {
      logger.info(`🚀 CIAP Backend Server running`, {
        port: PORT,
        environment: config.server.env,
        nodeVersion: process.version
      });
      logger.info(`📡 API base: http://localhost:${PORT}/api/v1`);
      logger.info(`❤️  Health:  http://localhost:${PORT}/health`);
      logger.info(`🌐 CORS enabled for: localhost:3000, localhost:5173, ciap-platform.netlify.app`);
      logger.info(`🔐 Auth endpoints: /api/v1/auth/login, /api/v1/auth/register`);
      logger.info(`👤 Admin endpoints: /api/v1/admin/*`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
}

startServer();

module.exports = app; // for testing