// Define the question types
export type QuestionType =
  | "text"
  | "textarea"
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  | "date"
  | "number"
  | "email";

// Define the validation types
export type ValidationRule = {
  type:
    | "required"
    | "email"
    | "minLength"
    | "maxLength"
    | "min"
    | "max"
    | "pattern";
  value?: string | number | RegExp;
  message: string;
};

// Define the condition for showing a question
export type Condition = {
  questionId: string;
  operator: "==" | "!=" | "includes" | ">" | "<" | ">=" | "<=";
  value: string | number | boolean;
};

// Define the option type for select, multiselect, radio, and checkbox
export type Option = {
  label: string;
  value: string;
};

// Define the question interface
export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  placeholder?: string;
  helpText?: string;
  options?: Option[];
  validation?: ValidationRule[];
  conditions?: Condition[];
  step: number;
}

// Define the step interface
export interface Step {
  id: number;
  title: string;
  description?: string;
}

// Define the questionnaire interface
export interface Questionnaire {
  id: string;
  templateId: string;
  title: string;
  description?: string;
  steps: Step[];
  questions: Question[];
}

// Web Development Questionnaire
const webDevelopmentQuestionnaire: Questionnaire = {
  id: "web-development-questionnaire",
  templateId: "web-development",
  title: "Web Development Brief",
  description: "Create a detailed brief for your web development project",
  steps: [
    {
      id: 1,
      title: "Project Basics",
      description: "Let's start with the basic information about your project",
    },
    {
      id: 2,
      title: "Project Goals",
      description: "What are you trying to achieve with this project?",
    },
    {
      id: 3,
      title: "Technical Requirements",
      description: "Let's get into the technical details of your project",
    },
    {
      id: 4,
      title: "Design & UX",
      description: "Tell us about your design and user experience preferences",
    },
    {
      id: 5,
      title: "Timeline & Budget",
      description: "When do you need this completed and what's your budget?",
    },
  ],
  questions: [
    // Step 1: Project Basics
    {
      id: "project-name",
      type: "text",
      label: "Project Name",
      placeholder: "e.g., Company Website Redesign",
      validation: [{ type: "required", message: "Project name is required" }],
      step: 1,
    },
    {
      id: "project-description",
      type: "textarea",
      label: "Project Description",
      placeholder: "Briefly describe your project...",
      validation: [
        { type: "required", message: "Project description is required" },
        {
          type: "minLength",
          value: 50,
          message: "Please provide at least 50 characters",
        },
      ],
      step: 1,
    },
    {
      id: "project-type",
      type: "radio",
      label: "Project Type",
      options: [
        { label: "New Website", value: "new-website" },
        { label: "Website Redesign", value: "website-redesign" },
        { label: "Web Application", value: "web-application" },
        { label: "E-commerce Site", value: "ecommerce" },
        { label: "Landing Page", value: "landing-page" },
        { label: "Other", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please select a project type" },
      ],
      step: 1,
    },
    {
      id: "project-type-other",
      type: "text",
      label: "Please specify the project type",
      conditions: [
        { questionId: "project-type", operator: "==", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please specify the project type" },
      ],
      step: 1,
    },

    // Step 2: Project Goals
    {
      id: "primary-goals",
      type: "multiselect",
      label: "Primary Goals",
      helpText: "What are the main goals of this project?",
      options: [
        { label: "Increase brand awareness", value: "brand-awareness" },
        { label: "Generate leads", value: "lead-generation" },
        { label: "Sell products/services", value: "sales" },
        { label: "Provide information", value: "information" },
        { label: "Improve user experience", value: "ux" },
        { label: "Other", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please select at least one goal" },
      ],
      step: 2,
    },
    {
      id: "primary-goals-other",
      type: "text",
      label: "Please specify your other goal(s)",
      conditions: [
        { questionId: "primary-goals", operator: "includes", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please specify your other goal(s)" },
      ],
      step: 2,
    },
    {
      id: "target-audience",
      type: "textarea",
      label: "Target Audience",
      placeholder:
        "Describe your target audience (age, interests, demographics, etc.)",
      validation: [
        { type: "required", message: "Target audience is required" },
      ],
      step: 2,
    },
    {
      id: "success-metrics",
      type: "textarea",
      label: "Success Metrics",
      placeholder: "How will you measure the success of this project?",
      validation: [
        { type: "required", message: "Success metrics are required" },
      ],
      step: 2,
    },

    // Step 3: Technical Requirements
    {
      id: "technologies",
      type: "multiselect",
      label: "Preferred Technologies",
      helpText: "Select any specific technologies you want to use",
      options: [
        { label: "React", value: "react" },
        { label: "Angular", value: "angular" },
        { label: "Vue.js", value: "vue" },
        { label: "Node.js", value: "node" },
        { label: "PHP", value: "php" },
        { label: "WordPress", value: "wordpress" },
        { label: "Shopify", value: "shopify" },
        { label: "No preference", value: "no-preference" },
        { label: "Other", value: "other" },
      ],
      step: 3,
    },
    {
      id: "technologies-other",
      type: "text",
      label: "Please specify other technologies",
      conditions: [
        { questionId: "technologies", operator: "includes", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please specify the other technologies" },
      ],
      step: 3,
    },
    {
      id: "features",
      type: "multiselect",
      label: "Required Features",
      helpText: "Select the features you need in your project",
      options: [
        { label: "User authentication", value: "auth" },
        { label: "Content management system", value: "cms" },
        { label: "E-commerce functionality", value: "ecommerce" },
        { label: "Blog", value: "blog" },
        { label: "Search functionality", value: "search" },
        { label: "Contact form", value: "contact-form" },
        { label: "Social media integration", value: "social-media" },
        { label: "Analytics", value: "analytics" },
        { label: "Other", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please select at least one feature" },
      ],
      step: 3,
    },
    {
      id: "features-other",
      type: "textarea",
      label: "Please describe other features",
      conditions: [
        { questionId: "features", operator: "includes", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please describe the other features" },
      ],
      step: 3,
    },
    {
      id: "hosting",
      type: "radio",
      label: "Hosting Preferences",
      options: [
        {
          label: "I need hosting recommendations",
          value: "need-recommendations",
        },
        { label: "I have my own hosting", value: "own-hosting" },
        { label: "Not sure yet", value: "not-sure" },
      ],
      step: 3,
    },

    // Step 4: Design & UX
    {
      id: "design-preferences",
      type: "radio",
      label: "Design Preferences",
      options: [
        {
          label: "I have brand guidelines to follow",
          value: "brand-guidelines",
        },
        { label: "I need a completely new design", value: "new-design" },
        { label: "I have design mockups ready", value: "mockups-ready" },
        {
          label: "I need inspiration from existing sites",
          value: "need-inspiration",
        },
      ],
      validation: [
        { type: "required", message: "Please select a design preference" },
      ],
      step: 4,
    },
    {
      id: "inspiration-sites",
      type: "textarea",
      label: "Inspiration Websites",
      placeholder: "List any websites you like the design/functionality of...",
      conditions: [
        {
          questionId: "design-preferences",
          operator: "==",
          value: "need-inspiration",
        },
      ],
      validation: [
        {
          type: "required",
          message: "Please provide at least one inspiration website",
        },
      ],
      step: 4,
    },
    {
      id: "responsive-design",
      type: "checkbox",
      label: "Responsive Design Requirements",
      options: [
        { label: "Mobile-friendly", value: "mobile" },
        { label: "Tablet-friendly", value: "tablet" },
        { label: "Desktop-friendly", value: "desktop" },
      ],
      validation: [
        { type: "required", message: "Please select at least one device type" },
      ],
      step: 4,
    },
    {
      id: "accessibility",
      type: "radio",
      label: "Accessibility Requirements",
      options: [
        { label: "WCAG 2.1 AA compliance required", value: "wcag-aa" },
        { label: "WCAG 2.1 AAA compliance required", value: "wcag-aaa" },
        { label: "Basic accessibility is fine", value: "basic" },
        { label: "Not a priority", value: "not-priority" },
      ],
      step: 4,
    },

    // Step 5: Timeline & Budget
    {
      id: "timeline",
      type: "radio",
      label: "Project Timeline",
      options: [
        { label: "Less than 1 month", value: "less-than-1-month" },
        { label: "1-3 months", value: "1-3-months" },
        { label: "3-6 months", value: "3-6-months" },
        { label: "More than 6 months", value: "more-than-6-months" },
        { label: "No specific deadline", value: "no-deadline" },
      ],
      validation: [{ type: "required", message: "Please select a timeline" }],
      step: 5,
    },
    {
      id: "start-date",
      type: "date",
      label: "Desired Start Date",
      validation: [{ type: "required", message: "Please select a start date" }],
      step: 5,
    },
    {
      id: "budget-range",
      type: "radio",
      label: "Budget Range",
      options: [
        { label: "Less than $5,000", value: "less-than-5k" },
        { label: "$5,000 - $10,000", value: "5k-10k" },
        { label: "$10,000 - $25,000", value: "10k-25k" },
        { label: "$25,000 - $50,000", value: "25k-50k" },
        { label: "More than $50,000", value: "more-than-50k" },
        { label: "Not sure / Need guidance", value: "not-sure" },
      ],
      validation: [
        { type: "required", message: "Please select a budget range" },
      ],
      step: 5,
    },
    {
      id: "additional-info",
      type: "textarea",
      label: "Additional Information",
      placeholder:
        "Any other details you'd like to share about your project...",
      step: 5,
    },
  ],
};

// Add more questionnaires for other templates here
// Other templates coming soon!

// Export all questionnaires
export const questionnaires: Questionnaire[] = [webDevelopmentQuestionnaire];

// Function to get a questionnaire by template ID
export function getQuestionnaireByTemplateId(
  templateId: string
): Questionnaire | undefined {
  return questionnaires.find((q) => q.templateId === templateId);
}

// Function to get questions for a specific step
export function getQuestionsForStep(
  questionnaire: Questionnaire,
  stepId: number
): Question[] {
  return questionnaire.questions.filter((q) => q.step === stepId);
}

// Function to check if a question should be shown based on conditions
export function shouldShowQuestion(
  question: Question,
  answers: Record<string, unknown>
): boolean {
  if (!question.conditions || question.conditions.length === 0) {
    return true;
  }

  return question.conditions.every((condition) => {
    const answer = answers[condition.questionId];

    if (answer === undefined || answer === null) {
      return false;
    }

    switch (condition.operator) {
      case "==":
        return answer === condition.value;
      case "!=":
        return answer !== condition.value;
      case "includes":
        return Array.isArray(answer) && answer.includes(condition.value);
      case ">":
        return (
          typeof answer === "number" &&
          typeof condition.value === "number" &&
          answer > condition.value
        );
      case "<":
        return (
          typeof answer === "number" &&
          typeof condition.value === "number" &&
          answer < condition.value
        );
      case ">=":
        return (
          typeof answer === "number" &&
          typeof condition.value === "number" &&
          answer >= condition.value
        );
      case "<=":
        return (
          typeof answer === "number" &&
          typeof condition.value === "number" &&
          answer <= condition.value
        );
      default:
        return false;
    }
  });
}
