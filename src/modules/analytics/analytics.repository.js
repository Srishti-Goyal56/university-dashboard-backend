const db = require('../../db/db');

/**
 * Repository Layer for Student Analytics.
 * This file contains all the database queries to fetch student records
 * from the 'students' table using the pg client.
 * 
 * Each function executes a raw SQL query and returns the results.
 */

/**
 * Fetches the total number of students in the university.
 * Runs: SELECT COUNT(*)::INT AS count FROM students;
 * 
 * @returns {Promise<number>} The total count of students as an integer
 */
const getTotalStudentsCount = async () => {
  // Query to get count of all students. We cast the COUNT(*) to an integer using ::INT
  const result = await db.query('SELECT COUNT(*)::INT AS count FROM students;');
  // Return the count from the first row of results
  return result.rows[0].count;
};

/**
 * Fetches the number of students created/registered today.
 * Runs: SELECT COUNT(*)::INT AS count FROM students WHERE DATE(created_at) = CURRENT_DATE;
 * 
 * @returns {Promise<number>} The count of students created today
 */
const getStudentsCreatedTodayCount = async () => {
  // Query to get count of students whose created_at date matches the current date
  const result = await db.query('SELECT COUNT(*)::INT AS count FROM students WHERE DATE(created_at) = CURRENT_DATE;');
  return result.rows[0].count;
};

/**
 * Fetches the number of students created/registered in the current calendar month.
 * Runs: SELECT COUNT(*)::INT AS count FROM students WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE);
 * 
 * @returns {Promise<number>} The count of students created this month
 */
const getStudentsCreatedThisMonthCount = async () => {
  // Query to get count of students registered in the current month using DATE_TRUNC
  const result = await db.query(
    "SELECT COUNT(*)::INT AS count FROM students WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE);"
  );
  return result.rows[0].count;
};

/**
 * Fetches student counts grouped by their department.
 * Runs: SELECT department, COUNT(*)::INT AS count FROM students GROUP BY department;
 * 
 * @returns {Promise<Array<{department: string, count: number}>>} Array of departments with their student counts
 */
const getStudentsCountByDepartment = async () => {
  // Query to group students by department and get the count for each
  const result = await db.query('SELECT department, COUNT(*)::INT AS count FROM students GROUP BY department;');
  return result.rows;
};

/**
 * Fetches student counts grouped by their course.
 * Runs: SELECT course, COUNT(*)::INT AS count FROM students GROUP BY course;
 * 
 * @returns {Promise<Array<{course: string, count: number}>>} Array of courses with their student counts
 */
const getStudentsCountByCourse = async () => {
  // Query to group students by course and get the count for each
  const result = await db.query('SELECT course, COUNT(*)::INT AS count FROM students GROUP BY course;');
  return result.rows;
};

module.exports = {
  getTotalStudentsCount,
  getStudentsCreatedTodayCount,
  getStudentsCreatedThisMonthCount,
  getStudentsCountByDepartment,
  getStudentsCountByCourse,
};