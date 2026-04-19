import OpenAI from "openai";
import prisma from "../config/db.js";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
export const trasncriptAudio = async (interviewId: string, audioChunks: Buffer[], questionId: string) => {
  const filePath = path.join(process.cwd(), `temp_${interviewId}.webm`)

  try {
    const mergedBuffer = Buffer.concat(audioChunks)
    console.log("Audio buffer size:", mergedBuffer.length, "bytes")

    if (mergedBuffer.length < 1000) {
      console.error("Audio file too small - probably silence")
    }
    fs.writeFileSync(filePath, mergedBuffer)

    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
    });

    console.log("Transcribed text:", response.text);

    await prisma.question.update({
      where: { id: questionId },
      data: { answerText: response.text ?? "" },
    });

  } catch (error) {
    console.error("Whisper Error:", error);
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }
};