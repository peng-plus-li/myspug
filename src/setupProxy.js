// src/setupProxy.js

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    // 将原来的 proxy 改为 createProxyMiddleware 
    createProxyMiddleware(
      '/pengjiali',
      {
        target: 'https://www.cnblogs.com/',
        changeOrigin: true
      }
    )
  )
}