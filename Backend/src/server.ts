import dotenv from "dotenv";
dotenv.config();

import express from "express";
import candidateRouter from "./routes/candidateRoutes.js";
import interviewRouter from "./routes/interviewRoutes.js"
import cors from "cors";
import http from "http";
import { initSocket } from "./socket/index.js";
import { Server } from "socket.io";


const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}))
app.use(express.json())


export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})

// intialise the socket connection and its events
initSocket(io)


// Ping-pong route
app.get("/", (req, res) => {
  res.send("Hello from TS backend 🚀")
})

// Candidate routes
app.use("/api", candidateRouter)

// generate interview url 
app.use("/api/interview", interviewRouter)


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})