const { eventBus } = require('../../shared/events/event-bus');
const { EVENT_TYPES } = require('../../shared/events/event-types');
const { handleStudentCreated } = require('./analytics.service');

const initAnalyticsEvents = () => {
  eventBus.subscribe(EVENT_TYPES.STUDENT_CREATED, async (data) => {
    console.log('👂 Student Created event suna!');
    await handleStudentCreated(data);
  });

  console.log('✅ Analytics events initialized!');
};

module.exports = { initAnalyticsEvents };