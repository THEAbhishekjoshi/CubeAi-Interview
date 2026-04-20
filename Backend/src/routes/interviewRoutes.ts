import express from "express"
import generateInterviewUrl from "../controllers/generateInterviewUrl.js"
import endInterview from "../controllers/endInterview.js"
import interviewReport from "../controllers/interviewReport.js"
import getInterviewDetails from "../controllers/getInterviewDetails.js"

const router = express.Router()

router.get("/generate-url", generateInterviewUrl)
router.get("/:interviewId", getInterviewDetails)
router.post("/end",endInterview)
router.post("/report/:interviewId",interviewReport)
export default router
