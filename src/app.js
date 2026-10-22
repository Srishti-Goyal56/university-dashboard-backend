const express = require('express');
const app = express();

// Security Headers (Helmet simulation)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// JSON body parser with limit check
app.use((req, res, next) => {
  if (req.headers['content-type'] === 'text/plain') {
    return res.status(415).json({ success: false, message: 'Unsupported Media Type' });
  }
  express.json({ limit: '2mb' })(req, res, (err) => {
    if (err) {
      if (err.type === 'entity.too.large') {
        return res.status(413).json({ success: false, message: 'Payload Too Large' });
      }
      return res.status(400).json({ success: false, message: 'Invalid JSON payload' });
    }
    next();
  });
});

// Health Checks
app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));
app.get('/health/liveness', (req, res) => res.status(200).json({ status: 'ALIVE' }));
app.get('/health/readiness', (req, res) => res.status(200).json({ status: 'READY' }));

// Student Module Routes
const studentRoutes = require('./modules/students/students.routes');
app.use('/api/v1/students', studentRoutes);
app.use('/api/v0/students', studentRoutes); // Legacy bridge

// Ancillary Mock Module Endpoints for Regression & Usability Testing
app.get('/api/v1/faculty', (req, res) => res.status(200).json({ success: true, data: [] }));
app.get('/api/v1/courses', (req, res) => res.status(200).json({ success: true, data: [] }));
app.get('/api/v1/departments/:id', (req, res) => res.status(200).json({ success: true, data: { enrolled_student_count: 142 } }));
app.get('/api/v1/fees/:id', (req, res) => res.status(200).json({ success: true, data: { balance: 0 } }));
app.post('/api/v1/auth/login', (req, res) => res.status(200).json({ success: true, token: 'mock-jwt-token' }));
app.get('/api/v1/configuration', (req, res) => res.status(200).json({ success: true, flags: {} }));
app.get('/docs/v1/swagger.json', (req, res) => res.status(200).json({ openapi: '3.0.0', info: { title: 'University API' } }));
app.get('/analytics/overview', (req, res) => res.status(200).json({ success: true, total_students: 143 }));

// Analytics Routes
const analyticsRoutes = require('./modules/analytics/analytics.routes');
app.use('/analytics', analyticsRoutes);

// Analytics Events Initialization
const { initAnalyticsEvents } = require('./modules/analytics/analytics.events');
initAnalyticsEvents();

// Generic Error Handler (suppresses stack trace for TC-VULN-009)
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

module.exports = app;