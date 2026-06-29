const service = require('./analytics.service');

/**
 * Controller Layer for Student Analytics.
 * Handles incoming Express requests (req), calls the business service layer,
 * and formats the Express responses (res) with JSON data and HTTP status codes.
 */

/**
 * GET /analytics/students/total
 * Fetch the overall total number of registered students.
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getTotalStudentsCount = async (req, res) => {
  try {
    // Call service layer to calculate total student count
    const data = await service.getTotalStudents();
    // Return HTTP 200 OK with the formatted total students JSON payload
    return res.status(200).json(data);
  } catch (error) {
    console.error('❌ Controller Error (getTotalStudentsCount):', error.message);
    // Return HTTP 500 Internal Server Error in case of database or script failures
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve total student count',
      error: error.message,
    });
  }
};

/**
 * GET /analytics/students/today
 * Fetch the number of students registered today (current calendar date).
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getStudentsCreatedTodayCount = async (req, res) => {
  try {
    // Call service layer to get student registrations for today
    const data = await service.getStudentsCreatedToday();
    return res.status(200).json(data);
  } catch (error) {
    console.error('❌ Controller Error (getStudentsCreatedTodayCount):', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve today\'s student count',
      error: error.message,
    });
  }
};

/**
 * GET /analytics/students/month
 * Fetch the number of students registered during the current calendar month.
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getStudentsCreatedThisMonthCount = async (req, res) => {
  try {
    // Call service layer to get student registrations for the current month
    const data = await service.getStudentsCreatedThisMonth();
    return res.status(200).json(data);
  } catch (error) {
    console.error('❌ Controller Error (getStudentsCreatedThisMonthCount):', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve this month\'s student count',
      error: error.message,
    });
  }
};

/**
 * GET /analytics/students/department
 * Fetch student count statistics grouped by department name (e.g. CSE, ECE).
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getStudentsCountByDepartment = async (req, res) => {
  try {
    // Call service layer to get counts grouped by department
    const data = await service.getStudentsByDepartment();
    return res.status(200).json(data);
  } catch (error) {
    console.error('❌ Controller Error (getStudentsCountByDepartment):', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve student count by department',
      error: error.message,
    });
  }
};

/**
 * GET /analytics/students/course
 * Fetch student count statistics grouped by course name (e.g. BTech, MTech).
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getStudentsCountByCourse = async (req, res) => {
  try {
    // Call service layer to get counts grouped by course
    const data = await service.getStudentsByCourse();
    return res.status(200).json(data);
  } catch (error) {
    console.error('❌ Controller Error (getStudentsCountByCourse):', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve student count by course',
      error: error.message,
    });
  }
};

module.exports = {
  getTotalStudentsCount,
  getStudentsCreatedTodayCount,
  getStudentsCreatedThisMonthCount,
  getStudentsCountByDepartment,
  getStudentsCountByCourse,
};