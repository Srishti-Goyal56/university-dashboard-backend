const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const upsertStudentInsight = async (month) => {
  const existing = await prisma.studentInsight.findFirst({
    where: { month },
  });

  if (existing) {
    return await prisma.studentInsight.update({
      where: { id: existing.id },
      data: {
        total_students: { increment: 1 },
        new_students: { increment: 1 },
      },
    });
  } else {
    return await prisma.studentInsight.create({
      data: {
        month,
        total_students: 1,
        new_students: 1,
        trend: 'up',
      },
    });
  }
};

const getStudentInsights = async () => {
  return await prisma.studentInsight.findMany({
    orderBy: { created_at: 'desc' },
  });
};

module.exports = { upsertStudentInsight, getStudentInsights };