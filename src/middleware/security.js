/**
 * Security middleware for production-ready Express app
 */

const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
};

const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent') || 'Unknown',
      timestamp: new Date().toISOString(),
    };
    
    const logLevel = res.statusCode >= 500 ? 'ERROR' :
      res.statusCode >= 400 ? 'WARN' : 'INFO';
    
    console.log(JSON.stringify({ level: logLevel, ...logData }));
  });
  
  next();
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  securityHeaders,
  requestLogger,
  asyncHandler,
};
