import { initChatModel } from "langchain/chat_models/universal";
import prisma from "../config/db.js";

export const generateFinalReport = async (interviewId: string) => {
    try {
        //  Fetch all questions and answers
        const interviewData = await prisma.interview.findUnique({
            where: { id: interviewId },
            include: { 
                questions: true,
                candidate: true 
            }
        })

        if (!interviewData || interviewData.questions.length === 0) {
            console.error("No interview data found to generate report.")
            return
        }

        // 
        const transcript = interviewData.questions
            .map((q, i) => `Q${i + 1}: ${q.questionText}\nA${i + 1}: ${q.answerText || "No answer provided."}`)
            .join("\n\n")

        // 
        const systemPrompt = `You are a Senior Academic Recruiter at Cuemath. Your task is to evaluate a tutor candidate based on their interview transcript.

        Evaluation Rubrics:
        1. Clarity: Simplicity and effectiveness of math explanations.
        2. Warmth: Tone, energy, and suitability for teaching children.
        3. Accuracy: Correctness of the mathematical concepts explained.

        Transcript:
        ${transcript}

        Instructions:
        - overallScore: Calculate average out of 5.0.
        - recommendation: If overallScore >= 3.5 then "PASS", otherwise "FAIL".
        - strengths: List 3 specific pedagogical strengths.
        - improvements: List 3 specific areas where the candidate can improve.
        - feedback: A concise 2-sentence executive summary.

        You MUST respond ONLY with a valid JSON object:
        {
            "overallScore": 4.2,
            "recommendation": "PASS",
            "feedback": "...",
            "strengths": ["Clear use of analogies", "Encouraging tone", "Accurate math"],
            "improvements": ["Speak slower", "Simplify jargon", "Better eye contact"],
            "rubricScores": {
                "clarity": 4,
                "warmth": 4,
                "accuracy": 4.5
            }
        }
        `

        //  Model
        const model = await initChatModel(
            "gpt-4o", 
            { temperature: 0 }
        );

        // invoke AI
        const response = await model.invoke([
            { role: "system", content: systemPrompt },
            { role: "user", content: "Generate the final assessment report." }
        ])

        const content = typeof response.content === "string" 
            ? response.content 
            : JSON.stringify(response.content);
        
        const cleanedJson = content.replace(/```json|```/g, "").trim()
        const analysis = JSON.parse(cleanedJson)

        // 6. Update Database with new fields
        await prisma.interview.update({
            where: { id: interviewId },
            data: {
                overallScore: analysis.overallScore,
                feedback: analysis.feedback,
                rubricScores: analysis.rubricScores,
                strengths: analysis.strengths,       // New field
                improvements: analysis.improvements, // New field
                recommendation: analysis.recommendation, // New field
                status: 'COMPLETED'
            }
        })

        // 7. Also update Candidate status
        await prisma.candidate.update({
            where: { id: interviewData.candidateId },
            data: { 
                status: analysis.recommendation === "PASS" ? "SELECTED" : "REJECTED" 
            }
        })

        console.log(`Report generated and Candidate status updated for: ${interviewId}`)

    } catch (error) {
        console.error("Error generating final report:", error)
    }
}