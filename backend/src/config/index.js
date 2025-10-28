require('dotenv').config();

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development',
    apiVersion: 'v1',
  },

  // Database Configuration
  database: {
    path: process.env.DB_PATH || './data/ciap.db',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS) || 10,
  },

  // Cache Configuration (Strategy Pattern parameters)
  cache: {
    ttl: parseInt(process.env.CACHE_TTL) || 3600, // 1 hour default
    maxSize: parseInt(process.env.CACHE_MAX_SIZE) || 100, // 100 items
    strategy: process.env.CACHE_STRATEGY || 'LRU', // LRU, LFU, FIFO
    checkPeriod: 600, // Check for expired items every 10 minutes
  },

  // Content Storage
  content: {
    uploadDir: process.env.UPLOAD_DIR || './content/uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'text/html'],
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || 'capstone-secret-change-in-production',
    jwtExpiry: process.env.JWT_EXPIRY || '24h',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
    rateLimitWindow: 15 * 60 * 1000, // 15 minutes
    rateLimitMax: 100, // 100 requests per window
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/app.log',
    errorFile: process.env.ERROR_LOG_FILE || './logs/error.log',
  },

  // Performance Monitoring
  monitoring: {
    enabled: process.env.MONITORING_ENABLED === 'true',
    metricsInterval: parseInt(process.env.METRICS_INTERVAL) || 60000, // 1 minute
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
};

/**
 * Validates configuration on startup
 * Prevents runtime errors from misconfiguration
 */
function validateConfig() {
  const required = ['security.jwtSecret'];
  
  for (const key of required) {
    const value = key.split('.').reduce((obj, k) => obj?.[k], config);
    if (!value || value.includes('change-in-production')) {
      console.warn(`⚠️  Warning: ${key} is using default value. Set in production!`);
    }
  }
  
  return true;
}

validateConfig();

module.exports = config;