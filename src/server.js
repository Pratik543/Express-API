require('dotenv').config();
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { requestLogger, securityHeaders } = require('./middleware/security');

const app = express();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// === MIDDLEWARE CONFIGURATION ===

// Security headers
app.use(helmet());
app.use(securityHeaders);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(requestLogger);
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.API_RATE_LIMIT_MAX, 10) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// === ROUTES ===

// Public root routes (welcome + version)
app.use('/', require('./routes/home'));

// Health check endpoint (no rate limiting)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// API v1 routes
app.use('/api/v1', require('./routes/api'));

// === ERROR HANDLING ===

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server only when run directly (not when imported by tests)
let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  });

  // Fail loudly if the port is already in use (e.g. a stale instance)
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `\nPort ${PORT} is already in use. Another instance of this app may still be running.\n` +
        'Stop it first, e.g.:\n' +
        `  Windows:  taskkill /PID <pid> /F   (find pid:  netstat -ano | findstr :${PORT})\n` +
        `  Linux/Mac: lsof -ti:${PORT} | xargs kill -9\n`
      );
      process.exit(1);
    } else {
      console.error('Server failed to start:', err);
      process.exit(1);
    }
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down gracefully`);
    if (server) {
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = { app, server };
