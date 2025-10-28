const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://localhost:8000',
      changeOrigin: true,
      secure: false, // Ignore SSL certificate errors for self-signed cert
    })
  );
};
