const express = require('express');
const router = express.Router();
const { getStudentInsights } = require('./analytics.controller');

router.get('/students', getStudentInsights);

module.exports = router;
