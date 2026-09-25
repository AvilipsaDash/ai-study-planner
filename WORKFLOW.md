# AI Development Workflow

## Feature

For this drill, I added a Settings form to the AI Study Planner twice. The first implementation used a deliberately vague prompt, while the second used a detailed specification with file references, constraints, examples, tests, and verification steps.

## Round 1: Vague Prompt

The first prompt only asked the AI to add a useful settings form with validation and make it look good. The resulting implementation added a Study Settings section with controls for daily study goal, focus session, break length, reminders, and preferred study days. The round produced 8 passing tests.

Because the prompt did not specify exact requirements, the AI made its own decisions about the fields and validation behavior. I had to review the generated UI and behavior manually.

## Round 2: Precise Prompt

The second prompt explicitly referenced `App.jsx`, `App.test.jsx`, `index.css`, and `package.json`. It specified student name validation, 1–12 daily study hours, preferred study time, accessible labels, keyboard navigation, edge cases, examples, tests, and production-build verification.

The Git diff between the branches shows 95 additional lines in `App.jsx`, 61 in `App.test.jsx`, and 48 in `index.css`, for 204 added lines. Round 2 finished with 10/10 tests passing, a successful production build, and no diagnostics errors.

## Correctness and Accessibility

The precise workflow produced more explicitly defined behavior. It required invalid values such as 0 and 13 study hours and whitespace-only names to be handled. It also explicitly required visible labels and keyboard-friendly controls, making accessibility part of the implementation requirements rather than something left to chance.

## Edge Cases and AI Review

The detailed prompt made edge cases testable instead of relying only on visual review. One useful lesson was that the AI's first implementation needed accessibility attention, which reinforced the importance of checking labels and keyboard behavior rather than assuming generated UI is accessible.

## Review Effort

The vague round was faster to request but required more manual interpretation and review because the requirements were unspecified. The precise round took longer to specify but included tests and build verification, reducing uncertainty during review. This showed that a more structured AI workflow can shift effort from fixing ambiguous output toward verifying clearly defined behavior.

## Conclusion

For future project work, I will use an explore-plan-code-verify workflow: inspect the relevant files, define constraints and examples, implement the feature, write tests, run the tests and production build, and review the resulting diff before committing.