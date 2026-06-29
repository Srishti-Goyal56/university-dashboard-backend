const express = require('express');
const router = express.Router();
const controller = require('./analytics.controller');

/**
 * Routes Layer for Student Analytics.
 * Binds incoming HTTP requests to their corresponding controller methods.
 * All route paths defined in this file are relative to the root mount point '/analytics'
 * which is configured in the main express app (src/app.js).
 */

/**
 * @route   GET /analytics/students/total
 * @desc    Get the total count of all registered students in the system
 * @access  Public
 */
router.get('/students/total', controller.getTotalStudentsCount);

/**
 * @route   GET /analytics/students/today
 * @desc    Get the count of students registered on the current calendar date
 * @access  Public
 */
router.get('/students/today', controller.getStudentsCreatedTodayCount);

/**
 * @route   GET /analytics/students/month
 * @desc    Get the count of students registered in the current month
 * @access  Public
 */
router.get('/students/month', controller.getStudentsCreatedThisMonthCount);

/**
 * @route   GET /analytics/students/department
 * @desc    Get the count of registered students grouped by department name
 * @access  Public
 */
router.get('/students/department', controller.getStudentsCountByDepartment);

/**
 * @route   GET /analytics/students/course
 * @desc    Get the count of registered students grouped by course name
 * @access  Public
 */
router.get('/students/course', controller.getStudentsCountByCourse);

module.exports = router;
