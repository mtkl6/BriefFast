import { ReactNode } from "react";

// Define the template interface
export interface Template {
  id: string;
  title: string;
  icon: ReactNode;
  bestFor: string;
  questionCount: number;
  description?: string;
}

// Template definitions
export const templates: Template[] = [
  {
    id: "web-development",
    title: "Web Development",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    bestFor:
      "Need a website, web application, or online platform built from scratch or redesigned.",
    questionCount: 15,
    description:
      "This template helps you define requirements for web development projects including frontend, backend, and infrastructure needs.",
  },
  // Other templates coming soon!
];

// Function to get a template by ID
export function getTemplateById(id: string): Template | undefined {
  return templates.find((template) => template.id === id);
}
