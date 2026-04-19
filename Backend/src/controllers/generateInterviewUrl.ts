import type { Response, Request } from "express";
import crypto from "crypto";
import prisma from "../config/db.js" 


const generateInterviewUrl = async (req: Request, res: Response) => {
  try {
    const { candidateId } = req.query

    if (!candidateId) {
      return res.status(400).json({ message: "Candidate ID is required" })
    }

    // Generate token
    const rawToken = crypto.randomBytes(32).toString("hex")

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex")

    // Expiry (1 hour)
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000)

    // Create Interview record
    const interview = await prisma.interview.create({
      data: {
        candidateId: candidateId as string,
        token: hashedToken,
        expiresAt: expiryDate,
        status: "PENDING",
      },
      include: {
      candidate: true,
    },
    })

    // Update candidate status
    await prisma.candidate.update({
      where: { id: candidateId as string },
      data: {
        status: "INTERVIEW_PENDING",
      },
    })

    // Generate link 
    const interviewLink = `${process.env.FRONTEND_URL}/interview/${interview.id}/${rawToken}`

    return res.status(200).json({
      message: "Interview link generated successfully",
      interviewLink,
      token: rawToken,
      interviewId: interview.id,
    })

  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
      error:error
    })
  }
}

export default generateInterviewUrl;