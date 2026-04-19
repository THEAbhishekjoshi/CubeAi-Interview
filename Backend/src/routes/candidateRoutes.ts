import { Router } from "express"
import createCandidate from "../controllers/createCandidate.js"
import getCandidates from "../controllers/getCandidates.js"

const candidateRouter = Router()

// candidateRouter.get("/", (req, res) => {
//   res.send("Hello from TS backend 🚀")
// })

candidateRouter.get("/candidates", getCandidates)
candidateRouter.post("/candidates", createCandidate)

export default candidateRouter