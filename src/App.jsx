import { useState, Suspense } from "react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
function createFallbackPlan(
  subject,
  topic,
  hours,
  difficulty,
  daysRemaining
) {
  let plan = `# Personalized Study Plan

## Overview

This is a practical study plan for **${subject} - ${topic}**. It is designed for a **${difficulty}** student with **${hours} hours per day** and covers exactly ${daysRemaining} study days.

## Daily Plan

`;

  for (let day = 1; day <= daysRemaining; day++) {
    if (day === daysRemaining) {
      plan += `### Day ${day}: Final Revision and Exam Preparation

- **Main topic:** Complete revision of ${topic}
- **Concepts to study:** Review important concepts, definitions, formulas, and algorithms.
- **Practice activity:** Solve practice questions related to ${topic}.
- **Revision activity:** Review mistakes and important notes.
- **Time allocation:** ${hours} hours total

`;
    } else {
      plan += `### Day ${day}: ${topic} Fundamentals

- **Main topic:** Learn and understand ${topic}
- **Concepts to study:** Study the important concepts and terminology.
- **Practice activity:** Solve beginner-level problems related to ${topic}.
- **Revision activity:** Review what you learned during the session.
- **Time allocation:** ${hours} hours total

`;
    }
  }

  plan += `## Final Revision

- Review the important concepts of ${topic}.
- Revisit mistakes made during practice.
- Practice questions without looking at solutions.
- Focus on weak areas before the exam.

## Practice Questions

1. What are the basic concepts of ${topic}?
2. Explain the important operations related to ${topic}.
3. Solve one beginner-level problem related to ${topic}.
4. What are common mistakes students make while studying ${topic}?

## Study Tips

1. Study consistently every day.
2. Practice problems instead of only reading theory.
3. Review your mistakes before the exam.
`;

  return plan;
}

function App() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [studyTime, setStudyTime] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [examDate, setExamDate] = useState("");

  const [error, setError] = useState("");
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setStudyPlan(null);

    // Check required fields
    if (
      !subject.trim() ||
      !topic.trim() ||
      !studyTime ||
      !examDate
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const hours = Number(studyTime);

    // Check study time
    if (hours < 1 || hours > 12) {
      setError("Study time must be between 1 and 12 hours.");
      return;
    }

    // Calculate remaining days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);

    const difference = exam.getTime() - today.getTime();

    const daysRemaining = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    // Exam date validation
    if (daysRemaining <= 0) {
      setError("Please select a future exam date.");
      return;
    }

    setLoading(true);

    try {
      // Get API key
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error("API key is missing.");
      }

      // Create Gemini client
      const ai = new GoogleGenAI({
        apiKey: apiKey,
      });

      // Create prompt
      const prompt = `
You are an AI study planner.

Create a personalized study plan using the following information:

Subject: ${subject}
Topic: ${topic}
Study time per day: ${hours} hours
Difficulty: ${difficulty}
Exam date: ${examDate}
Days remaining: ${daysRemaining}

IMPORTANT RULES:

1. Create exactly ${daysRemaining} study days.
2. Never create more than ${daysRemaining} days.
3. Do not create a 10-day plan unless there are 10 days remaining.
4. Do not create a monthly plan.
5. Do not create a long-term revision plan.
6. Each day must not exceed ${hours} hours.
7. The final day must include revision and exam preparation.
8. Keep the plan practical and realistic.
9. Keep the plan focused only on ${subject} and ${topic}.
10. Make the plan suitable for a ${difficulty} student.

For every day include:

- Main topic
- Concepts to study
- Practice activity
- Revision activity
- Time allocation

Also include:

## Final Revision
Give a short revision strategy.

## Practice Questions
Give 3 to 5 practice questions.

## Study Tips
Give 3 useful study tips.

IMPORTANT:
The response must contain exactly ${daysRemaining} study days.
`;

      // Generate AI response
      const interaction = await ai.interactions.create({
        model: "gemini-3.6-flash",
        input: prompt,
      });

      const generatedText = interaction.output_text;

      // Check AI response
      if (!generatedText) {
        throw new Error("Gemini did not return a study plan.");
      }

      // Save AI study plan
      setStudyPlan({
        subject: subject,
        topic: topic,
        studyTime: hours,
        difficulty: difficulty,
        examDate: examDate,
        daysRemaining: daysRemaining,
        aiPlan: generatedText,
      });
    } catch (err) {
      console.error("Gemini error:", err);

      // If Gemini fails, use backup plan
      const fallbackPlan = createFallbackPlan(
        subject,
        topic,
        hours,
        difficulty,
        daysRemaining
      );

      setStudyPlan({
        subject: subject,
        topic: topic,
        studyTime: hours,
        difficulty: difficulty,
        examDate: examDate,
        daysRemaining: daysRemaining,
        aiPlan: fallbackPlan,
      });

      const errorMessage = err?.message || "";

      if (
        errorMessage.includes("429") ||
        errorMessage.toLowerCase().includes("rate limit")
      ) {
        setError(
          "Gemini is temporarily unavailable because the free request limit has been reached. A backup study plan is shown below."
        );
      } else if (
        errorMessage.toLowerCase().includes("api key")
      ) {
        setError(
          "Gemini API key is missing or invalid. A backup study plan is shown below."
        );
      } else {
        setError(
          "Gemini could not generate the plan right now. A backup study plan is shown below."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setError("");
  };

  return (
    <main>
      <h1>AI Study Planner</h1>

      <p>
        Create a personalized study plan with the help of Gemini AI.
      </p>
      <form
          onSubmit={handleSubmit}
          aria-busy={loading}
          aria-label="Create a personalized study plan"
          noValidate
      >
        {error && (
          <div className="error-message" role="alert">
            <p>{error}</p>

            <button
              type="button"
              onClick={handleTryAgain}
            >
              Try Again
            </button>
          </div>
        )}

        <label htmlFor="subject">
          Subject
        </label>

        <input
          id="subject"
          type="text"
          placeholder="e.g. Data Structures"
          value={subject}
          onChange={(event) =>
            setSubject(event.target.value)
          }
          required
        />

        <label htmlFor="topic">
          Topic
        </label>

        <input
          id="topic"
          type="text"
          placeholder="e.g. Arrays"
          value={topic}
          onChange={(event) =>
            setTopic(event.target.value)
          }
          required
        />

        <label htmlFor="studyTime">
          Available study time (hours per day)
        </label>

        <input
          id="studyTime"
          type="number"
          min="1"
          max="12"
          placeholder="e.g. 2"
          value={studyTime}
          onChange={(event) =>
            setStudyTime(event.target.value)
          }
          required
        />

        <label htmlFor="difficulty">
          Difficulty level
        </label>

        <select
          id="difficulty"
          value={difficulty}
          onChange={(event) =>
            setDifficulty(event.target.value)
          }
        >
          <option value="Beginner">
            Beginner
          </option>

          <option value="Intermediate">
            Intermediate
          </option>

          <option value="Advanced">
            Advanced
          </option>
        </select>

        <label htmlFor="examDate">
          Exam date
        </label>

        <input
          id="examDate"
          type="date"
          value={examDate}
          onChange={(event) =>
            setExamDate(event.target.value)
          }
          required
        />
        <button
          type="submit"
          disabled={loading}
          aria-disabled={loading}
        >
          {loading ? "Generating..." : "Generate Study Plan"}
        </button>
        
      </form>

      {studyPlan && (
        <section aria-label="Study plan"
            aria-live="polite"
            >
          <h2>Your AI Study Plan</h2>

          <p>
            <strong>Subject:</strong>{" "}
            {studyPlan.subject}
          </p>

          <p>
            <strong>Topic:</strong>{" "}
            {studyPlan.topic}
          </p>

          <p>
            <strong>Study Time:</strong>{" "}
            {studyPlan.studyTime} hours/day
          </p>

          <p>
            <strong>Difficulty:</strong>{" "}
            {studyPlan.difficulty}
          </p>

          <p>
            <strong>Exam Date:</strong>{" "}
            {studyPlan.examDate}
          </p>

          <p>
            <strong>Days Remaining:</strong>{" "}
            {studyPlan.daysRemaining}
          </p>

          <h3>Personalized Study Plan</h3>

          <div className="study-plan-content">
            <Suspense fallback={<p>Formatting study plan...</p>}>
              <ReactMarkdown>
                {studyPlan.aiPlan}
              </ReactMarkdown>
            </Suspense>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;