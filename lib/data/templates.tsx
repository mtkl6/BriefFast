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
  {
    id: "graphic-design",
    title: "Graphic Design",
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
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    bestFor:
      "Want to create logos, branding materials, marketing collateral, or other visual assets.",
    questionCount: 12,
    description:
      "This template helps you specify design requirements, brand guidelines, and deliverable formats for graphic design projects.",
  },
  {
    id: "content-writing",
    title: "Content Writing",
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
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
    bestFor:
      "Need blog posts, articles, website copy, or other written content created.",
    questionCount: 10,
    description:
      "This template helps you define content requirements, tone of voice, target audience, and SEO considerations for writing projects.",
  },
  {
    id: "mobile-app",
    title: "Mobile App Development",
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
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    bestFor:
      "Want to build a native or cross-platform mobile application for iOS or Android.",
    questionCount: 18,
    description:
      "This template helps you specify app features, platform requirements, and user experience considerations for mobile app projects.",
  },
];

// Function to get a template by ID
export function getTemplateById(id: string): Template | undefined {
  return templates.find((template) => template.id === id);
}
