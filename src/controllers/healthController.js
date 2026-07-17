/**
 * Health check controller
 */

const getHealth = (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
  };

  res.status(200).json({
    success: true,
    data: healthCheck,
  });
};

const getDetailedHealth = (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    environment: process.env.NODE_ENV,
    platform: process.platform,
    nodeVersion: process.version,
  };

  res.status(200).json({
    success: true,
    data: healthCheck,
  });
};

module.exports = {
  getHealth,
  getDetailedHealth,
};
