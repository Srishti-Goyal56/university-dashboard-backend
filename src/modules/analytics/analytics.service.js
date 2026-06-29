const { upsertStudentInsight, getStudentInsights } = require('./analytics.repository');
const { eventBus } = require('../../shared/events/event-bus');
const { EVENT_TYPES } = require('../../shared/events/event-types');

const handleStudentCreated = async (studentData) => {
  try {
    console.log('📥 Student created event mila:', studentData);

    const month = new Date().toLocaleString('default', { month: 'long' });
    const insight = await upsertStudentInsight(month);
    console.log('📊 Student insight updated:', insight);

    eventBus.publish(EVENT_TYPES.INSIGHTS_GENERATED, {
      type: 'student_insight',
      description: 'Naya student university mein aaya',
      month,
      data: insight,
      timestamp: new Date(),
    });

  } catch (error) {
    console.error('❌ Error in handleStudentCreated:', error);
  }
};

const getAnalyticsInsights = async () => {
  return await getStudentInsights();
};

module.exports = { handleStudentCreated, getAnalyticsInsights };