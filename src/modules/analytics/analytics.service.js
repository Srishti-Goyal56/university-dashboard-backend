const repository = require('./analytics.repository');
const { eventBus } = require('../../shared/events/event-bus');
const { EVENT_TYPES } = require('../../shared/events/event-types');

/**
 * Service Layer for Student Analytics.
 * This layer contains the business logic. It coordinates between repository database queries
 * and controller requests, formats the response payloads, and handles event-driven pub/sub flows.
 */

/**
 * Event handler for when a student is created in the university system.
 * Consumes: EVENT_TYPES.STUDENT_CREATED
 * Produces: EVENT_TYPES.INSIGHTS_GENERATED
 * 
 * @param {object} studentData - The data payload of the newly created student
 */
const handleStudentCreated = async (studentData) => {
  try {
    console.log('📥 Student created event received in service:', studentData);

    // Get the name of the current month (e.g. "June")
    const month = new Date().toLocaleString('default', { month: 'long' });
    
    // Fetch the updated registered student count for the current month
    const monthlyCount = await repository.getStudentsCreatedThisMonthCount();

    // Publish an 'insights.generated' event to notify other modules
    eventBus.publish(EVENT_TYPES.INSIGHTS_GENERATED, {
      type: 'student_insight',
      description: `New student registration processed. Total registered this month: ${monthlyCount}`,
      month,
      currentMonthCount: monthlyCount,
      timestamp: new Date(),
    });

  } catch (error) {
    console.error('❌ Error handling student creation event:', error.message);
  }
};

/**
 * Fetches the total number of students and formats it for the API response.
 * 
 * @returns {Promise<{totalStudents: number}>} Object containing total students
 */
const getTotalStudents = async () => {
  const total = await repository.getTotalStudentsCount();
  return { totalStudents: total };
};

/**
 * Fetches the count of students registered today and formats it for the API response.
 * 
 * @returns {Promise<{studentsCreatedToday: number}>} Object containing today's new students
 */
const getStudentsCreatedToday = async () => {
  const todayCount = await repository.getStudentsCreatedTodayCount();
  return { studentsCreatedToday: todayCount };
};

/**
 * Fetches the count of students registered this month and formats it for the API response.
 * 
 * @returns {Promise<{studentsCreatedThisMonth: number}>} Object containing this month's new students
 */
const getStudentsCreatedThisMonth = async () => {
  const monthCount = await repository.getStudentsCreatedThisMonthCount();
  return { studentsCreatedThisMonth: monthCount };
};

/**
 * Fetches student counts grouped by department.
 * Since the repository already returns the format [{ department: '...', count: ... }],
 * we return the result directly.
 * 
 * @returns {Promise<Array<{department: string, count: number}>>} Grouped department counts
 */
const getStudentsByDepartment = async () => {
  return await repository.getStudentsCountByDepartment();
};

/**
 * Fetches student counts grouped by course.
 * Since the repository already returns the format [{ course: '...', count: ... }],
 * we return the result directly.
 * 
 * @returns {Promise<Array<{course: string, count: number}>>} Grouped course counts
 */
const getStudentsByCourse = async () => {
  return await repository.getStudentsCountByCourse();
};

module.exports = {
  handleStudentCreated,
  getTotalStudents,
  getStudentsCreatedToday,
  getStudentsCreatedThisMonth,
  getStudentsByDepartment,
  getStudentsByCourse,
};