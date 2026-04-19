import prisma from "../config/db.js";

export async function getQuestionsByInterviewId(interviewId: string) {
  try {
    const questions = await prisma.question.findMany({
      where: {
        interviewId: interviewId,
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return questions
  } catch (error) {
    console.error(error)
    throw error
  }
}