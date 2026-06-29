const { getAnalyticsInsights } = require('./analytics.service');

const getStudentInsights = async (req, res) => {
  try {
    const insights = await getAnalyticsInsights();
    res.json({
      success: true,
      data: insights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getStudentInsights };