import type { Response, Request } from "express";
import prisma from "../config/db.js";

const getInterviewDetails = async (req: Request, res: Response) => {
  try {
    const { interviewId } = req.params

    if (!interviewId) {
      return res.status(400).json({ message: "Interview ID is required" })
    }

    const interview = await prisma.interview.findUnique({
      where: { id: interviewId as string },
      include: {
        candidate: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" })
    }

    return res.status(200).json({
      interviewId: interview.id,
      candidateName: interview.candidate.name,
      status: interview.status,
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error,
    })
  }
}

export default getInterviewDetails;
