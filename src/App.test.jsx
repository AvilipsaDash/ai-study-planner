import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("AI Study Planner", () => {
  it("shows the study planner form", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "AI Study Planner" })
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Subject")).toBeInTheDocument();

    expect(screen.getByLabelText("Topic")).toBeInTheDocument();

    expect(
      screen.getByLabelText("Available study time (hours per day)")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Difficulty level")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Exam date")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Generate Study Plan",
      })
    ).toBeInTheDocument();
  });

  it("shows an error when required fields are empty", () => {
    render(<App />);

    const button = screen.getByRole("button", {
      name: "Generate Study Plan",
    });

    fireEvent.click(button);

    expect(
      screen.getByText("Please fill in all required fields.")
    ).toBeInTheDocument();
  });

  it("shows an error when study time is greater than 12 hours", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Subject"), {
      target: { value: "Data Structures" },
    });

    fireEvent.change(screen.getByLabelText("Topic"), {
      target: { value: "Arrays" },
    });

    fireEvent.change(
      screen.getByLabelText(
        "Available study time (hours per day)"
      ),
      {
        target: { value: "15" },
      }
    );

    fireEvent.change(screen.getByLabelText("Exam date"), {
      target: { value: "2027-01-01" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Generate Study Plan",
      })
    );

    expect(
      screen.getByText(
        "Study time must be between 1 and 12 hours."
      )
    ).toBeInTheDocument();
  });

  it("shows an error when study time is less than 1 hour", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Subject"), {
      target: { value: "Data Structures" },
    });

    fireEvent.change(screen.getByLabelText("Topic"), {
      target: { value: "Arrays" },
    });

    fireEvent.change(
      screen.getByLabelText(
        "Available study time (hours per day)"
      ),
      {
        target: { value: "0" },
      }
    );

    fireEvent.change(screen.getByLabelText("Exam date"), {
      target: { value: "2027-01-01" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Generate Study Plan",
      })
    );

    expect(
      screen.getByText(
        "Study time must be between 1 and 12 hours."
      )
    ).toBeInTheDocument();
  });

  it("shows an error when the exam date is today", () => {
    render(<App />);

    const today = new Date()
      .toISOString()
      .split("T")[0];

    fireEvent.change(screen.getByLabelText("Subject"), {
      target: { value: "Data Structures" },
    });

    fireEvent.change(screen.getByLabelText("Topic"), {
      target: { value: "Arrays" },
    });

    fireEvent.change(
      screen.getByLabelText(
        "Available study time (hours per day)"
      ),
      {
        target: { value: "2" },
      }
    );

    fireEvent.change(screen.getByLabelText("Exam date"), {
      target: { value: today },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Generate Study Plan",
      })
    );

    expect(
      screen.getByText("Please select a future exam date.")
    ).toBeInTheDocument();
  });

  it("allows the user to change the difficulty level", () => {
    render(<App />);

    const difficulty = screen.getByLabelText(
      "Difficulty level"
    );

    expect(difficulty).toHaveValue("Beginner");

    fireEvent.change(difficulty, {
      target: { value: "Advanced" },
    });

    expect(difficulty).toHaveValue("Advanced");
  });
});