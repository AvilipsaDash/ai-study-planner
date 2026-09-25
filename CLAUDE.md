# AI Study Planner Project Rules

## 1. Form accessibility
Every form control must have a visible, descriptive label and must be usable with keyboard navigation.

## 2. Validation
User input must be validated at the form level. Study-hour values must stay between 1 and 12, and required text fields must reject empty or whitespace-only input.

## 3. Tests
Every new form behavior or validation rule must have a corresponding test in `src/App.test.jsx`. Run the test suite before committing changes.

## 4. Preserve existing AI behavior
Changes to the Settings form must not break or alter the existing AI study-plan generation behavior.

## 5. Verify before committing
After implementing a feature, run the tests and production build and review the Git diff before committing.