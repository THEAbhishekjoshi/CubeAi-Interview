import { createAgent,initChatModel} from "langchain";

import { getQuestionsByInterviewId } from "./getQuestionsByInterviewId.js";
import prisma from "../config/db.js";



export const getAiQuestion = async (interviewId: string) => {

    // get all questions from database
    const questions = await getQuestionsByInterviewId(interviewId)

    // question limit check
    if (questions.length >= 2){
        return {
           status:"completed",
            message:"Interview completed. No more questions",
            questionText:"Thank you so much for your time today! I've enjoyed learning about your teaching style. I am now finalizing your interview report. Please wait a moment while I redirect you."
        }
    }

    // formatted questions for system prompt
    const formattedQuestions = questions.map((q) => `Question: ${q.questionText}, Answer: ${q.answerText}`).join("\n")

    // system prompt
    const systemPrompt=`Your name is Cube and yoou are a cue math interviewer. Your task is to generate a question for the candidate based on the following criteria:

    1. The question should be related to test the candidate's knowledge of math concepts and how well he explains to the student.
    2. The question should be of medium difficulty level.
    3. The question should be unique and not commonly found on the internet.
    4. The question should test how good he is at explaining concepts to students.
    5. The question should have a clear problem statement.

    You must ask ONLY ONE question at a time.
    Remember, just give the direct question without any preamble or explanation. Do NOT say "Here's a question for you" or anything like that. Just give the question directly.

    Rules:
    - Total questions allowed per interview: 6
    - Questions already asked: ${questions.length}
    - Remaining questions: ${6 - questions.length}

    Instructions:
    - If remaining questions > 0 → Generate ONE new unique question
    - If remaining questions = 0 → Respond with: "Interview complete"
    
    
    
    Previously asked questions (do NOT repeat these questions, they are only for reference):
    ${formattedQuestions}
    `;
    

    // model
    const model =await initChatModel(
        "gpt-4.1",
        {temperature:0}
    )

    // create agent
    const agent = createAgent({
        model,
        systemPrompt,
    })

    // response 
    const response = await agent.invoke(
        { messages: [{ role: "user", content: "Generate the question according to the system prompt" }] }
    )
    // console.log("Generated Question:", response)
    const lastMessage = response?.messages?.[response.messages.length - 1]
    

    const questionText =typeof lastMessage?.content === "string"
    ? lastMessage.content
    : JSON.stringify(lastMessage?.content)

    let finalMessage = questionText  
    if (questions.length === 0) {
        finalMessage = `Welcome to Cuemath! I'm Cube, your AI interviewer. Before we begin, please ensure you are in a quiet place. Speak clearly, be calm, and try to explain concepts as if you're talking to a child. We have about 15 minutes. Let's start! Here is your first question: ${questionText}`
    }

    const newQuestion = await prisma.question.create({
        data:{
            interviewId,
            questionText:finalMessage,
        }
    })

    return {
        status:"question",
        questionText:finalMessage,
        questionId: newQuestion.id
    }
}