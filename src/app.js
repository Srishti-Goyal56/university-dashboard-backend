const express = require('express');
const app = express();

app.use(express.json());

// Analytics Routes
const analyticsRoutes = require('./modules/analytics/analytics.routes');
app.use('/analytics', analyticsRoutes);

// Analytics Events initialize karo
const { initAnalyticsEvents } = require('./modules/analytics/analytics.events');
initAnalyticsEvents();

module.exports = app;