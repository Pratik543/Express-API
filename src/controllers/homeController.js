/**
 * Home page controller
 */

const getHome = (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Express App API',
    version: '1.0.0',
    documentation: '/api/v1/docs',
  });
};

const getVersion = (req, res) => {
  res.json({
    success: true,
    data: {
      version: '1.0.0',
      build: process.env.BUILD_NUMBER || 'dev',
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = {
  getHome,
  getVersion,
};
