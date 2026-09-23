# AI Study Planner

## Live Demo

[Open the deployed AI Study Planner](https://ai-study-planner-omega-one.vercel.app/)

An AI-enhanced study planning application that creates personalized study plans based on a student's subject, topic, available study time, difficulty level, and exam date.

## Project Overview

The AI Study Planner helps students organize their preparation into a practical daily study schedule.

Users provide:

* Subject
* Topic
* Available study time per day
* Difficulty level
* Exam date

The application calculates the remaining study days and generates a personalized study plan using Gemini AI.

If the AI service is temporarily unavailable, the application provides a built-in fallback study plan so that the core functionality remains usable.

## Features

* Personalized study plan generation
* Gemini AI integration
* Exam countdown / remaining-day calculation
* Beginner, Intermediate, and Advanced difficulty levels
* Study-time validation
* Future exam-date validation
* AI-generated daily study tasks
* Practice questions
* Study tips
* Final revision strategy
* Markdown-formatted study plans
* Loading state while generating a plan
* User-friendly error messages
* Fallback plan when the AI service is unavailable
* Responsive user interface
* Accessible form labels and error messages

## AI Capability

The application uses Google's Gemini AI to generate study plans dynamically from the user's inputs.

The AI prompt includes:

* Subject
* Topic
* Available study hours
* Difficulty
* Exam date
* Number of days remaining

The prompt instructs the model to create a practical day-by-day plan and avoid generating more study days than are available.

## Error Handling

The application handles several edge cases:

* Empty required fields
* Study time below 1 hour
* Study time above 12 hours
* Exam date that is not in the future
* Missing Gemini API key
* Gemini API errors
* Rate-limit errors
* Empty AI responses
* Temporary AI service unavailability

When Gemini cannot generate a response, a fallback study plan is displayed instead of leaving the user without a result.

## Tech Stack

* React
* Vite
* JavaScript
* Google Gemini AI
* `@google/genai`
* React Markdown
* Vitest
* React Testing Library
* HTML
* CSS

## Architecture

The application uses a React frontend built with Vite.

- `App.jsx` — manages the form, input validation, AI request, fallback logic, and displays the study plan.
- `ReactMarkdown` — renders the generated study plan.
- `@google/genai` — communicates with Gemini AI.
- `App.test.jsx` — contains automated component tests.
- `vite.config.js` — configures the Vite development and testing environment.
- `.env` — stores the Gemini API key locally and is not committed to Git.

## Project Structure

```text
ai-study-planner/
├── public/
├── server/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── App.test.jsx
│   ├── index.css
│   ├── main.jsx
│   └── setupTests.js
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AvilipsaDash/ai-study-planner.git
cd ai-study-planner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the Gemini API key

Create a `.env` file in the project root:

```text
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Do not commit or publish this file.

The project `.gitignore` excludes local environment files.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL shown by Vite in the terminal.

## Testing

The project includes automated tests using Vitest and React Testing Library.

Run:

```bash
npm test
```

The tests cover:

* Study planner form rendering
* Required-field validation
* Maximum study-time validation
* Minimum study-time validation
* Exam-date validation
* Difficulty selection

### Test Results

All 6 automated tests pass successfully.

Test coverage measured using Vitest's V8 coverage provider:

- Statements: 54.54%
- Branches: 50%
- Functions: 77.77%
- Lines: 55.38%

The tests verify the main form rendering and input-validation behavior of the study planner.
## Production Build

Create a production build with:

```bash
npm run build
```

The production build should complete successfully.

To preview the production build locally:

```bash
npm run preview
```

## Accessibility

The application uses semantic HTML and accessible form controls, including:

* Labels connected to form inputs
* Descriptive input labels
* Accessible error messages using `role="alert"`
* Keyboard-accessible form controls
* Disabled button state during AI generation
* `aria-busy` during loading

## Performance

The application is built with Vite and optimized for production using Vite's production build process.

The application also displays a loading state while waiting for the AI response so users receive feedback during longer operations.

## Resilience

The application is designed to remain useful when the AI service cannot be reached.

If Gemini returns an error or is temporarily unavailable, the application generates a local fallback study plan based on the user's inputs.

This prevents the application from becoming unusable because of a temporary external AI-service failure.

## Deployment Checklist

- [x] Application runs successfully locally
- [x] Production build completed
- [x] Application deployed to Vercel
- [x] Live deployment tested
- [x] Gemini API environment variable configured
- [x] API failure and fallback behavior tested
- [x] User input validation tested
- [x] Lighthouse audit completed
- [x] Lighthouse Performance score: 98
- [x] Lighthouse Accessibility score: 100
- [x] Lighthouse Best Practices score: 100
- [x] Lighthouse SEO score: 90
- [x] Automated tests passing: 6/6
- [x] Test coverage checked
- [x] README documentation completed

### Rollback Plan

If a production deployment introduces a problem, the previous working Vercel deployment can be restored through the Vercel dashboard. The Git repository can also be reverted to the last known working commit and redeployed.

## Known Limitation

The Gemini API is subject to API availability and rate limits. When the service is unavailable or the request limit is reached, the application uses its fallback study-plan generation.

The Gemini API key must be configured locally through an environment variable for AI generation.

## Future Improvements

Possible future improvements include:

* Saving study plans in local storage
* Progress tracking
* Daily study reminders
* More detailed subject-specific planning
* User accounts
* Study-plan history
* Improved AI response validation
* Deployment with a secure backend API layer

## Reflection

The hardest part of this project was making the AI integration reliable instead of only making it work in the normal case. Initially, the application could generate a study plan successfully, but production readiness required thinking about invalid inputs, API failures, missing API keys, rate limits, and situations where the AI does not return a usable response. Building the fallback study-plan system helped me understand that an AI-powered application should still provide useful functionality when an external AI service is unavailable.

If I were building the project again, I would plan the testing and error-handling structure earlier. I would also consider using a backend API layer instead of exposing an AI API key through a frontend environment variable. This would provide a more secure architecture for a production application.

One thing that surprised me was how much work is involved after the main feature is already working. Building the study-plan generator was only one part of the project. Testing, accessibility, Lighthouse performance, error handling, deployment, documentation, and rollback planning were also important parts of making the application production-ready. The project helped me understand that shipping a frontend application involves much more than writing the main feature.

## Author

Avilipsa Dash

## License

This project was created as an academic/project assignment.
