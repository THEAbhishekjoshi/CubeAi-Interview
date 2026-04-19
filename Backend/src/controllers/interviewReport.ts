import express from 'express';
import prisma from '../config/db.js';

const router = express.Router();

// GET Interview Report
const interviewReport = async (req: express.Request, res: express.Response) => {
  const { interviewId } = req.params; 

  try {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId as string },
      include: {
        candidate: true,
        questions: true 
      }
    })

    // Check if it exists
    if (!interview) {
      return res.status(404).json({ success: false, message: "No report found for this ID." })
    }

    // if the interview is completed
    if (interview.status !== 'COMPLETED') {
      return res.status(403).json({ 
        success: false, 
        message: "Interview is still pending. Report is generated only after completion." 
      })
    }

    res.json({ success: true, data: interview })
  } catch (error) {
    console.error("Error fetching report:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
};

export default interviewReport