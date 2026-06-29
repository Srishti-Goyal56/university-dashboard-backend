const StudentInsightSchema = {
  month: String,
  total_students: Number,
  new_students: Number,
  trend: String,
  created_at: Date,
};

module.exports = { StudentInsightSchema };