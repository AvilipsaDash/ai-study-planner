import "dotenv/config"
import express from "express"
import cors from "cors"
import { GoogleGenAI } from "@google/genai"

const app = express()

app.use(cors())
app.use(express.json())

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  vertexai: false,
})

app.get("/", (req, res) => {
  res.json({
    message: "AI Study Planner server is running",
  })
})

app.post("/api/generate-plan", async (req, res) => {
  try {
    const {
      subject,
      topic,
      studyTime,
      difficulty,
      examDate,
    } = req.body

    if (!subject || !topic || !studyTime || !difficulty || !examDate) {
      return res.status(400).json({
        error: "All study information is required.",
      })
    }

    const prompt = `
You are an expert study planner.

Create a practical study plan for a student.

Student information:
- Subject: ${subject}
- Topic: ${topic}
- Available study time: ${studyTime} hours per day
- Difficulty: ${difficulty}
- Exam date: ${examDate}

Create:
1. Three study tasks for today.
2. One revision activity.
3. One useful study tip.

Return ONLY valid JSON in exactly this format:

{
  "tasks": [
    "task 1",
    "task 2",
    "task 3"
  ],
  "revision": "revision activity",
  "tip": "study tip"
}
`

    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: prompt,
      response_format: {
        type: "text",
        mime_type: "application/json",
      },
    })
    const aiPlan = JSON.parse(interaction.output_text)

    if (
        !aiPlan ||
        !Array.isArray(aiPlan.tasks) ||
        aiPlan.tasks.length === 0 ||
        typeof aiPlan.revision !== "string" ||
        typeof aiPlan.tip !== "string"
    ) {
        throw new Error("AI returned an invalid study plan.")
    }

    res.json({
      subject,
      topic,
      studyTime,
      difficulty,
      examDate,
      tasks: aiPlan.tasks,
      revision: aiPlan.revision,
      tip: aiPlan.tip,
    })
  } catch (error) {
    console.error("AI generation error:", error)

    res.status(500).json({
      error: "Unable to generate the study plan right now.",
    })
  }
})

app.listen(3001, () => {
  console.log("Server running at http://localhost:3001")
})