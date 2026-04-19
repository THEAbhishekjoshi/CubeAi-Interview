import { Server } from "socket.io";
import { getAiQuestion } from "../utils/getAiQuestion.js";
import { trasncriptAudio } from "../utils/transcriptAudio.js";

const audioBuffers:Record<string,Buffer[]> ={}
export const initSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id)
   
    socket.on("join-interview", async ({ interviewId }) => {
      socket.join(interviewId)
      console.log(`User joined room: ${interviewId}`)

      try{
        const response = await getAiQuestion(interviewId)
        if (response.status === "question") {
          console.log("Emitting question to room:", response.questionText, response.questionId)
          io.to(interviewId).emit("next-question", {
            question: response.questionText,
            questionId: response.questionId,
            status: 'speaking',
            isLast:false
          })
        }
      }
      catch (error) {
        console.error("Error generating question:", error);
      }
    })
    
    // audio-chunk
    socket.on("audio-chunk", ({ interviewId, chunk }) => {
      if(!audioBuffers[interviewId]) audioBuffers[interviewId] = []
      
      const buffer = Buffer.from(chunk)
      audioBuffers[interviewId].push(buffer)
    })

    // candidate finished speaking
    socket.on("candidate-finished-speaking", async ({ interviewId, questionId }) => {
      console.log("Processing full audio...for this questionid:",questionId)

      if (audioBuffers[interviewId]) {
       await trasncriptAudio(interviewId, audioBuffers[interviewId], questionId);
      }

      try {
        const response = await getAiQuestion(interviewId)
          if (response.status === "question") {
            console.log("Emitting next question:", response.questionText)
            io.to(interviewId).emit("next-question", {
              question: response.questionText,
              questionId: response.questionId,
              status: 'speaking',
              isLast:false
              
            })
          }
          else if (response.status === "completed") {
            io.to(interviewId).emit("next-question", {
                question: response.questionText,
                status: 'speaking',
                isLast: true  // end
            })
        }
      }
      catch (error) {
        console.error("Error generating next question:", error)
      }

      // clean up buffer
      delete audioBuffers[interviewId]
    })

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id)
    })
  })
}