import express from 'express';
import prisma from '../config/db.js';
import { generateFinalReport } from '../utils/generateFinalReport.js';

const endInterview = async (req:express.Request, res:express.Response) => {
  const { interviewId } = req.body

  try {
    // Update Interview & Candidate Status
    const interview = await prisma.interview.update({
      where: { id: interviewId },
      data: { status: 'COMPLETED' },
      include: { questions: true, candidate: true }
    })

    await prisma.candidate.update({
      where: { id: interview.candidateId },
      data: { status: 'INTERVIEW_COMPLETED' }
    })

    //  Generate AI Result 
    generateFinalReport(interviewId)

    res.json({ success: true, message: "Interview ended successfully" })
  } 
  catch (error) {
    res.status(500).json({ error: "Failed to end interview" })
  }

}

export default endInterview