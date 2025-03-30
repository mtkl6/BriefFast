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
  // New templates for tech solopreneurs
  {
    id: "tech-product-saas",
    title: "Tech Product/SaaS",
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
          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
        />
      </svg>
    ),
    bestFor:
      "Building a tech product or SaaS solution as a solopreneur and need to clarify your product vision.",
    questionCount: 12,
    description:
      "This template helps tech solopreneurs define their product strategy, core features, and launch plan for a new SaaS or tech product.",
  },
  {
    id: "personal-tech-brand",
    title: "Personal Tech Brand",
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
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    bestFor:
      "Establishing your personal brand as a tech professional or thought leader in your technical domain.",
    questionCount: 10,
    description:
      "This template helps tech professionals define their personal brand strategy, positioning, and content approach to build authority in their niche.",
  },
  {
    id: "tech-solopreneur-website",
    title: "Tech Solopreneur Website",
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
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
    bestFor:
      "Creating a professional website for your solo tech business, consultancy, or portfolio.",
    questionCount: 12,
    description:
      "This template helps tech solopreneurs plan an effective website that showcases their work, attracts clients, and converts visitors.",
  },
  {
    id: "indie-tech-marketing",
    title: "Indie Tech Marketing",
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
          d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
        />
      </svg>
    ),
    bestFor:
      "Planning a marketing campaign for your indie tech product launch or growth initiative.",
    questionCount: 11,
    description:
      "This template helps indie tech creators plan focused marketing campaigns with limited resources to maximize impact and results.",
  },
  {
    id: "tech-content-strategy",
    title: "Tech Content Strategy",
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
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      </svg>
    ),
    bestFor:
      "Creating a sustainable content strategy to build authority and attract clients or users to your tech business.",
    questionCount: 10,
    description:
      "This template helps tech solopreneurs develop a focused content strategy that builds credibility and attracts their target audience.",
  },
];

// Function to get a template by ID
export function getTemplateById(id: string): Template | undefined {
  return templates.find((template) => template.id === id);
}
