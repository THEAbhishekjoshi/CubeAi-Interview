import type { Request, Response } from "express"
import prisma from "../config/db.js"

const getCandidates = async (_req: Request, res: Response) => {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        interviews: {
          orderBy: {
            createdAt: "desc", // latest interview first
          },
          take: 1, // only latest interview
        },
      },
    })

    const formatted = candidates.map((candidate:any) => {
      const latestInterview = candidate.interviews[0]

      return {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        status: candidate.status,

        interview: latestInterview
          ? {
              interviewId: latestInterview.id,
              token: latestInterview.token,
              status: latestInterview.status,
              expiresAt: latestInterview.expiresAt,
              interviewUrl: `${process.env.FRONTEND_URL}/interview/${latestInterview.id}/${latestInterview.token}`,
            }
          : null,
      }
    })

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch candidates",
    })
  }
}

export default getCandidates