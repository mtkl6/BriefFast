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

// Tech Product/SaaS Questionnaire
const techProductSaasQuestionnaire: Questionnaire = {
  id: "tech-product-saas-questionnaire",
  templateId: "tech-product-saas",
  title: "Tech Product/SaaS Brief",
  description:
    "Create a focused brief for your tech product or SaaS as a solopreneur",
  steps: [
    {
      id: 1,
      title: "Product Basics",
      description: "Let's start with the core information about your product",
    },
    {
      id: 2,
      title: "Target Users & Goals",
      description:
        "Define who your product serves and what it helps them achieve",
    },
    {
      id: 3,
      title: "Features & Technical",
      description: "Outline your product's key features and technical approach",
    },
    {
      id: 4,
      title: "Launch Strategy",
      description: "Plan how you'll bring your product to market",
    },
  ],
  questions: [
    // Step 1: Product Basics
    {
      id: "product-name",
      type: "text",
      label: "Product Name",
      placeholder: "e.g., CodeSync, DevFlow, PixelPerfect",
      validation: [{ type: "required", message: "Product name is required" }],
      step: 1,
    },
    {
      id: "problem-solved",
      type: "textarea",
      label: "Problem Your Product Solves",
      placeholder: "In 1-2 sentences, what problem does your product solve?",
      helpText: "Be specific about the pain point your solution addresses",
      validation: [
        { type: "required", message: "Problem statement is required" },
        {
          type: "maxLength",
          value: 300,
          message: "Keep it concise (max 300 chars)",
        },
      ],
      step: 1,
    },
    {
      id: "product-type",
      type: "radio",
      label: "Product Type",
      options: [
        { label: "SaaS Application", value: "saas" },
        { label: "Mobile App", value: "mobile-app" },
        { label: "Developer Tool", value: "dev-tool" },
        { label: "API or Service", value: "api" },
        { label: "Plugin/Extension", value: "plugin" },
        { label: "Other", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please select a product type" },
      ],
      step: 1,
    },
    {
      id: "product-type-other",
      type: "text",
      label: "Please specify the product type",
      conditions: [
        { questionId: "product-type", operator: "==", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please specify the product type" },
      ],
      step: 1,
    },

    // Step 2: Target Users & Goals
    {
      id: "target-users",
      type: "textarea",
      label: "Target User Profile",
      placeholder:
        "Describe your ideal users (job roles, company size, technical level, etc.)",
      validation: [
        { type: "required", message: "Target user profile is required" },
      ],
      step: 2,
    },
    {
      id: "user-pain-point",
      type: "textarea",
      label: "Primary User Pain Point",
      placeholder:
        "What specific frustration or challenge does your user face that your product solves?",
      helpText: "This should align with the problem your product solves",
      validation: [
        { type: "required", message: "User pain point is required" },
      ],
      step: 2,
    },
    {
      id: "success-metrics",
      type: "multiselect",
      label: "Success Metrics",
      helpText: "How will you measure if your product is successful?",
      options: [
        { label: "User signups/adoption", value: "signups" },
        { label: "Monthly Recurring Revenue (MRR)", value: "mrr" },
        { label: "User engagement/retention", value: "engagement" },
        { label: "Task completion rate", value: "task-completion" },
        { label: "Free-to-paid conversion", value: "conversion" },
        { label: "Other", value: "other" },
      ],
      validation: [
        {
          type: "required",
          message: "Please select at least one success metric",
        },
      ],
      step: 2,
    },
    {
      id: "success-metrics-other",
      type: "text",
      label: "Other success metric",
      conditions: [
        { questionId: "success-metrics", operator: "includes", value: "other" },
      ],
      validation: [
        {
          type: "required",
          message: "Please specify your other success metric",
        },
      ],
      step: 2,
    },

    // Step 3: Features & Technical
    {
      id: "core-features",
      type: "textarea",
      label: "Core Features (Max 5)",
      placeholder:
        "List the 5 most essential features your product needs at launch",
      helpText: "Focus on must-haves, not nice-to-haves",
      validation: [{ type: "required", message: "Core features are required" }],
      step: 3,
    },
    {
      id: "tech-stack",
      type: "multiselect",
      label: "Preferred Tech Stack",
      helpText:
        "Select technologies you plan to use or are most comfortable with",
      options: [
        { label: "React/Next.js", value: "react" },
        { label: "Vue/Nuxt.js", value: "vue" },
        { label: "Node.js", value: "node" },
        { label: "Python/Django/Flask", value: "python" },
        { label: "Ruby on Rails", value: "rails" },
        { label: "PHP/Laravel", value: "php" },
        { label: "Mobile Native (Swift/Kotlin)", value: "mobile-native" },
        { label: "React Native/Flutter", value: "cross-platform" },
        { label: "Other", value: "other" },
      ],
      step: 3,
    },
    {
      id: "tech-stack-other",
      type: "text",
      label: "Other technology",
      conditions: [
        { questionId: "tech-stack", operator: "includes", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please specify the other technology" },
      ],
      step: 3,
    },
    {
      id: "monetization",
      type: "radio",
      label: "Monetization Model",
      options: [
        { label: "Free (no monetization yet)", value: "free" },
        { label: "Freemium (free + paid features)", value: "freemium" },
        { label: "Subscription", value: "subscription" },
        { label: "One-time purchase", value: "one-time" },
        { label: "Usage-based pricing", value: "usage" },
        { label: "Other", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please select a monetization model" },
      ],
      step: 3,
    },
    {
      id: "monetization-other",
      type: "text",
      label: "Please specify your monetization model",
      conditions: [
        { questionId: "monetization", operator: "==", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please specify your monetization model" },
      ],
      step: 3,
    },

    // Step 4: Launch Strategy
    {
      id: "mvp-scope",
      type: "textarea",
      label: "Minimum Viable Product Scope",
      placeholder:
        "What's the smallest version of your product that delivers value?",
      helpText:
        "Define what features and functionality are essential for initial launch",
      validation: [{ type: "required", message: "MVP scope is required" }],
      step: 4,
    },
    {
      id: "differentiator",
      type: "textarea",
      label: "Key Differentiator",
      placeholder: "What makes your product different from existing solutions?",
      validation: [{ type: "required", message: "Differentiator is required" }],
      step: 4,
    },
    {
      id: "marketing-channels",
      type: "multiselect",
      label: "Initial Marketing Channels",
      helpText: "Where will you promote your product first?",
      options: [
        { label: "Product Hunt", value: "product-hunt" },
        { label: "Twitter/X", value: "twitter" },
        { label: "LinkedIn", value: "linkedin" },
        { label: "Reddit", value: "reddit" },
        { label: "Hacker News", value: "hacker-news" },
        { label: "Email list", value: "email" },
        { label: "Content marketing/blog", value: "content" },
        { label: "Other", value: "other" },
      ],
      validation: [
        {
          type: "required",
          message: "Please select at least one marketing channel",
        },
      ],
      step: 4,
    },
    {
      id: "marketing-channels-other",
      type: "text",
      label: "Other marketing channel",
      conditions: [
        {
          questionId: "marketing-channels",
          operator: "includes",
          value: "other",
        },
      ],
      validation: [
        {
          type: "required",
          message: "Please specify the other marketing channel",
        },
      ],
      step: 4,
    },
    {
      id: "development-timeline",
      type: "radio",
      label: "Development Timeline",
      options: [
        { label: "1 month or less", value: "1-month" },
        { label: "1-3 months", value: "1-3-months" },
        { label: "3-6 months", value: "3-6-months" },
        { label: "6+ months", value: "6-plus-months" },
      ],
      validation: [
        { type: "required", message: "Please select a development timeline" },
      ],
      step: 4,
    },
  ],
};

// Personal Tech Brand Questionnaire
const personalTechBrandQuestionnaire: Questionnaire = {
  id: "personal-tech-brand-questionnaire",
  templateId: "personal-tech-brand",
  title: "Personal Tech Brand Brief",
  description:
    "Create a strategy for your personal tech brand as a solopreneur",
  steps: [
    {
      id: 1,
      title: "Brand Positioning",
      description: "Define your niche and unique expertise",
    },
    {
      id: 2,
      title: "Brand Assets",
      description: "Plan your visual identity and brand presentation",
    },
    {
      id: 3,
      title: "Content & Visibility",
      description: "Outline your content strategy and community involvement",
    },
  ],
  questions: [
    // Step 1: Brand Positioning
    {
      id: "brand-name",
      type: "text",
      label: "Your Name/Brand Name",
      placeholder: "e.g., Jane Dev, CodeMagician, TechByAlex",
      validation: [{ type: "required", message: "Brand name is required" }],
      step: 1,
    },
    {
      id: "tech-niche",
      type: "text",
      label: "Tech Niche/Specialty",
      placeholder:
        "e.g., Frontend Performance, AI Development, DevOps Automation",
      helpText: "Be specific about your technical focus area",
      validation: [{ type: "required", message: "Tech niche is required" }],
      step: 1,
    },
    {
      id: "primary-expertise",
      type: "radio",
      label: "Primary Expertise",
      options: [
        { label: "Software Development", value: "development" },
        { label: "Design/UX", value: "design" },
        { label: "DevOps/Infrastructure", value: "devops" },
        { label: "Data Science/AI", value: "data-ai" },
        { label: "Technical Marketing", value: "tech-marketing" },
        { label: "Product Management", value: "product" },
        { label: "Other", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please select your primary expertise" },
      ],
      step: 1,
    },
    {
      id: "primary-expertise-other",
      type: "text",
      label: "Please specify your expertise",
      conditions: [
        { questionId: "primary-expertise", operator: "==", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please specify your expertise" },
      ],
      step: 1,
    },
    {
      id: "target-audience",
      type: "textarea",
      label: "Target Audience in Tech Space",
      placeholder:
        "Describe who you want to reach with your content and expertise",
      validation: [
        { type: "required", message: "Target audience is required" },
      ],
      step: 1,
    },
    {
      id: "value-proposition",
      type: "textarea",
      label: "Value Proposition",
      placeholder: "What unique perspective or value do you offer?",
      helpText:
        "What makes your approach or expertise different from others in your field?",
      validation: [
        { type: "required", message: "Value proposition is required" },
      ],
      step: 1,
    },

    // Step 2: Brand Assets
    {
      id: "brand-personality",
      type: "multiselect",
      label: "Brand Personality",
      helpText:
        "Select traits that describe your personal brand voice and style",
      options: [
        { label: "Technical authority", value: "technical" },
        { label: "Approachable expert", value: "approachable" },
        { label: "Innovative thinker", value: "innovative" },
        { label: "Pragmatic problem-solver", value: "pragmatic" },
        { label: "Educator/mentor", value: "educator" },
        { label: "Bold/challenging status quo", value: "bold" },
        { label: "Other", value: "other" },
      ],
      validation: [
        {
          type: "required",
          message: "Please select at least one personality trait",
        },
      ],
      step: 2,
    },
    {
      id: "brand-personality-other",
      type: "text",
      label: "Other personality trait",
      conditions: [
        {
          questionId: "brand-personality",
          operator: "includes",
          value: "other",
        },
      ],
      validation: [
        {
          type: "required",
          message: "Please specify the other personality trait",
        },
      ],
      step: 2,
    },
    {
      id: "visual-identity",
      type: "multiselect",
      label: "Visual Identity Needs",
      helpText: "What brand assets do you need to develop?",
      options: [
        { label: "Logo", value: "logo" },
        { label: "Color scheme", value: "colors" },
        { label: "Typography system", value: "typography" },
        { label: "Profile photos", value: "photos" },
        { label: "Social media templates", value: "social-templates" },
        { label: "Presentation templates", value: "presentations" },
        { label: "Other", value: "other" },
      ],
      step: 2,
    },
    {
      id: "visual-identity-other",
      type: "text",
      label: "Other visual identity need",
      conditions: [
        { questionId: "visual-identity", operator: "includes", value: "other" },
      ],
      validation: [
        {
          type: "required",
          message: "Please specify the other visual identity need",
        },
      ],
      step: 2,
    },

    // Step 3: Content & Visibility
    {
      id: "primary-platform",
      type: "radio",
      label: "Primary Platform for Brand Building",
      helpText: "Where will you focus most of your effort?",
      options: [
        { label: "Twitter/X", value: "twitter" },
        { label: "LinkedIn", value: "linkedin" },
        { label: "GitHub", value: "github" },
        { label: "Personal blog/website", value: "blog" },
        { label: "YouTube", value: "youtube" },
        { label: "Other", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please select a primary platform" },
      ],
      step: 3,
    },
    {
      id: "primary-platform-other",
      type: "text",
      label: "Other primary platform",
      conditions: [
        { questionId: "primary-platform", operator: "==", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please specify the other platform" },
      ],
      step: 3,
    },
    {
      id: "content-types",
      type: "multiselect",
      label: "Content Types to Establish Authority",
      helpText: "What content will you create to showcase your expertise?",
      options: [
        { label: "Technical tutorials", value: "tutorials" },
        { label: "Case studies", value: "case-studies" },
        { label: "Open source projects", value: "open-source" },
        { label: "Opinion pieces/thought leadership", value: "opinion" },
        { label: "Technical reviews", value: "reviews" },
        { label: "Code snippets/examples", value: "code-snippets" },
        { label: "Other", value: "other" },
      ],
      validation: [
        {
          type: "required",
          message: "Please select at least one content type",
        },
      ],
      step: 3,
    },
    {
      id: "content-types-other",
      type: "text",
      label: "Other content type",
      conditions: [
        { questionId: "content-types", operator: "includes", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please specify the other content type" },
      ],
      step: 3,
    },
    {
      id: "networking-strategy",
      type: "multiselect",
      label: "Networking & Community Strategy",
      helpText: "How will you connect with others in your field?",
      options: [
        { label: "Speaking at events/conferences", value: "speaking" },
        { label: "Participating in online communities", value: "communities" },
        { label: "Mentoring/teaching", value: "mentoring" },
        {
          label: "Collaborations with other creators",
          value: "collaborations",
        },
        { label: "Open source contributions", value: "open-source" },
        { label: "Other", value: "other" },
      ],
      step: 3,
    },
    {
      id: "networking-strategy-other",
      type: "text",
      label: "Other networking approach",
      conditions: [
        {
          questionId: "networking-strategy",
          operator: "includes",
          value: "other",
        },
      ],
      validation: [
        {
          type: "required",
          message: "Please specify the other networking approach",
        },
      ],
      step: 3,
    },
  ],
};

// Tech Solopreneur Website Questionnaire
const techSolopreneurWebsiteQuestionnaire: Questionnaire = {
  id: "tech-solopreneur-website-questionnaire",
  templateId: "tech-solopreneur-website",
  title: "Tech Solopreneur Website Brief",
  description: "Create a plan for your professional tech website",
  steps: [
    {
      id: 1,
      title: "Website Purpose",
      description: "Define the goals and primary functions of your website",
    },
    {
      id: 2,
      title: "Content & Features",
      description: "Plan the core content and functionality of your site",
    },
    {
      id: 3,
      title: "Technical Requirements",
      description:
        "Outline your technical approach and implementation preferences",
    },
    {
      id: 4,
      title: "Growth Strategy",
      description: "Plan how your website will support your business growth",
    },
  ],
  questions: [
    // Step 1: Website Purpose
    {
      id: "website-purpose",
      type: "radio",
      label: "Primary Website Purpose",
      options: [
        { label: "Professional portfolio", value: "portfolio" },
        { label: "SaaS/product landing page", value: "saas" },
        { label: "Freelance/consultancy services", value: "services" },
        { label: "Content hub/blog", value: "content" },
        { label: "Personal brand site", value: "personal-brand" },
        { label: "Other", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please select a website purpose" },
      ],
      step: 1,
    },
    {
      id: "website-purpose-other",
      type: "text",
      label: "Please specify the website purpose",
      conditions: [
        { questionId: "website-purpose", operator: "==", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please specify the website purpose" },
      ],
      step: 1,
    },
    {
      id: "primary-call-to-action",
      type: "text",
      label: "Primary Call-to-Action",
      placeholder:
        "e.g., Book a consultation, Sign up for beta, Download free guide",
      helpText: "What is the main action you want visitors to take?",
      validation: [{ type: "required", message: "Primary CTA is required" }],
      step: 1,
    },
    {
      id: "key-pages",
      type: "multiselect",
      label: "Key Pages Needed",
      helpText: "Select the main pages your website should have",
      options: [
        { label: "Home", value: "home" },
        { label: "About/Bio", value: "about" },
        { label: "Services/Products", value: "services" },
        { label: "Portfolio/Work", value: "portfolio" },
        { label: "Blog/Articles", value: "blog" },
        { label: "Contact", value: "contact" },
        { label: "Testimonials", value: "testimonials" },
        { label: "Pricing", value: "pricing" },
        { label: "Other", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please select at least one key page" },
      ],
      step: 1,
    },
    {
      id: "key-pages-other",
      type: "text",
      label: "Other page(s) needed",
      conditions: [
        { questionId: "key-pages", operator: "includes", value: "other" },
      ],
      validation: [
        {
          type: "required",
          message: "Please specify the other page(s) needed",
        },
      ],
      step: 1,
    },

    // Step 2: Content & Features
    {
      id: "must-have-features",
      type: "multiselect",
      label: "Must-Have Features",
      helpText: "Select the features your website needs to achieve its purpose",
      options: [
        { label: "Contact form", value: "contact-form" },
        { label: "Newsletter signup", value: "newsletter" },
        { label: "Portfolio showcase", value: "portfolio" },
        { label: "Testimonials display", value: "testimonials" },
        { label: "Blog/content system", value: "blog" },
        { label: "Project/case study section", value: "case-studies" },
        { label: "Service details/packages", value: "services" },
        { label: "Booking/scheduling system", value: "booking" },
        { label: "Other", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please select at least one feature" },
      ],
      step: 2,
    },
    {
      id: "must-have-features-other",
      type: "text",
      label: "Other must-have feature",
      conditions: [
        {
          questionId: "must-have-features",
          operator: "includes",
          value: "other",
        },
      ],
      validation: [
        { type: "required", message: "Please specify the other feature" },
      ],
      step: 2,
    },
    {
      id: "content-management",
      type: "multiselect",
      label: "Content Management Needs",
      helpText: "What type of content will you need to regularly update?",
      options: [
        { label: "Blog posts/articles", value: "blog" },
        { label: "Portfolio items", value: "portfolio" },
        { label: "Case studies", value: "case-studies" },
        { label: "Testimonials", value: "testimonials" },
        { label: "Services/offerings", value: "services" },
        { label: "Other", value: "other" },
      ],
      step: 2,
    },
    {
      id: "content-management-other",
      type: "text",
      label: "Other content to manage",
      conditions: [
        {
          questionId: "content-management",
          operator: "includes",
          value: "other",
        },
      ],
      validation: [
        { type: "required", message: "Please specify the other content type" },
      ],
      step: 2,
    },
    {
      id: "design-preferences",
      type: "radio",
      label: "Design Preferences",
      options: [
        { label: "Minimal and clean", value: "minimal" },
        { label: "Bold and distinctive", value: "bold" },
        { label: "Code-inspired/technical", value: "code" },
        { label: "Corporate/professional", value: "corporate" },
        { label: "Creative/artistic", value: "creative" },
        { label: "Other", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please select a design preference" },
      ],
      step: 2,
    },
    {
      id: "design-preferences-other",
      type: "text",
      label: "Please specify your design preference",
      conditions: [
        { questionId: "design-preferences", operator: "==", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please specify your design preference" },
      ],
      step: 2,
    },

    // Step 3: Technical Requirements
    {
      id: "tech-requirements",
      type: "radio",
      label: "Technical Approach",
      helpText: "How do you want to build and maintain your site?",
      options: [
        { label: "Static site (e.g., Next.js, Astro)", value: "static" },
        { label: "Content Management System (e.g., WordPress)", value: "cms" },
        { label: "Custom built web application", value: "custom" },
        { label: "Website builder (e.g., Wix, Squarespace)", value: "builder" },
        { label: "Other", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please select a technical approach" },
      ],
      step: 3,
    },
    {
      id: "tech-requirements-other",
      type: "text",
      label: "Please specify your technical approach",
      conditions: [
        { questionId: "tech-requirements", operator: "==", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please specify your technical approach" },
      ],
      step: 3,
    },
    {
      id: "seo-importance",
      type: "radio",
      label: "SEO Importance",
      helpText: "How important is search engine optimization for your site?",
      options: [
        { label: "Critical - main traffic source", value: "critical" },
        { label: "Important - need good rankings", value: "important" },
        { label: "Somewhat important", value: "somewhat" },
        { label: "Not important for my needs", value: "not-important" },
      ],
      validation: [
        { type: "required", message: "Please select SEO importance" },
      ],
      step: 3,
    },
    {
      id: "analytics-requirements",
      type: "multiselect",
      label: "Analytics Requirements",
      helpText: "What website data do you need to track?",
      options: [
        { label: "Basic visitor analytics", value: "basic" },
        { label: "Conversion tracking", value: "conversion" },
        { label: "User behavior/flow", value: "behavior" },
        { label: "Content performance", value: "content" },
        { label: "Custom events", value: "events" },
        { label: "Other", value: "other" },
      ],
      step: 3,
    },
    {
      id: "analytics-requirements-other",
      type: "text",
      label: "Other analytics requirement",
      conditions: [
        {
          questionId: "analytics-requirements",
          operator: "includes",
          value: "other",
        },
      ],
      validation: [
        {
          type: "required",
          message: "Please specify the other analytics requirement",
        },
      ],
      step: 3,
    },
    {
      id: "build-preference",
      type: "radio",
      label: "Build Preference",
      helpText: "How do you plan to build the website?",
      options: [
        { label: "I'll build it myself", value: "self" },
        { label: "I'll use a template/theme", value: "template" },
        { label: "I'll hire someone to build it", value: "hire" },
        { label: "Not sure yet", value: "undecided" },
      ],
      step: 3,
    },

    // Step 4: Growth Strategy
    {
      id: "lead-capture",
      type: "multiselect",
      label: "Lead Capture Strategy",
      helpText: "How will you convert visitors into leads/customers?",
      options: [
        { label: "Contact form", value: "contact" },
        { label: "Email newsletter signup", value: "newsletter" },
        { label: "Free resource download", value: "resource" },
        { label: "Demo/consultation booking", value: "booking" },
        { label: "Product trial/freemium", value: "trial" },
        { label: "Other", value: "other" },
      ],
      validation: [
        {
          type: "required",
          message: "Please select at least one lead capture method",
        },
      ],
      step: 4,
    },
    {
      id: "lead-capture-other",
      type: "text",
      label: "Other lead capture method",
      conditions: [
        { questionId: "lead-capture", operator: "includes", value: "other" },
      ],
      validation: [
        {
          type: "required",
          message: "Please specify the other lead capture method",
        },
      ],
      step: 4,
    },
    {
      id: "maintenance-capacity",
      type: "radio",
      label: "Ongoing Maintenance Capacity",
      helpText: "How much time can you dedicate to website maintenance?",
      options: [
        { label: "Less than 1 hour per week", value: "minimal" },
        { label: "1-3 hours per week", value: "low" },
        { label: "3-5 hours per week", value: "medium" },
        { label: "5+ hours per week", value: "high" },
      ],
      validation: [
        {
          type: "required",
          message: "Please select your maintenance capacity",
        },
      ],
      step: 4,
    },
  ],
};

// Indie Tech Marketing Questionnaire
const indieTechMarketingQuestionnaire: Questionnaire = {
  id: "indie-tech-marketing-questionnaire",
  templateId: "indie-tech-marketing",
  title: "Indie Tech Marketing Brief",
  description:
    "Create a focused marketing campaign for your tech product or service",
  steps: [
    {
      id: 1,
      title: "Campaign Goal",
      description: "Define the primary objective of your marketing campaign",
    },
    {
      id: 2,
      title: "Audience & Message",
      description: "Identify your target audience and core message",
    },
    {
      id: 3,
      title: "Execution Strategy",
      description: "Plan your channels, content, and resources",
    },
    {
      id: 4,
      title: "Measurement",
      description: "Define success metrics and follow-up approach",
    },
  ],
  questions: [
    // Step 1: Campaign Goal
    {
      id: "campaign-objective",
      type: "radio",
      label: "Campaign Objective",
      options: [
        { label: "Product/feature launch", value: "launch" },
        { label: "User/customer acquisition", value: "acquisition" },
        { label: "Brand awareness", value: "awareness" },
        { label: "Lead generation", value: "leads" },
        { label: "Retention/engagement", value: "retention" },
        { label: "Other", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please select a campaign objective" },
      ],
      step: 1,
    },
    {
      id: "campaign-objective-other",
      type: "text",
      label: "Please specify your campaign objective",
      conditions: [
        { questionId: "campaign-objective", operator: "==", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please specify your campaign objective" },
      ],
      step: 1,
    },
    {
      id: "campaign-specifics",
      type: "textarea",
      label: "Campaign Specifics",
      placeholder:
        "Briefly describe what you're promoting (product, feature, service)",
      validation: [
        { type: "required", message: "Campaign specifics are required" },
      ],
      step: 1,
    },
    {
      id: "campaign-duration",
      type: "radio",
      label: "Campaign Duration",
      options: [
        { label: "One-time event/announcement", value: "one-time" },
        { label: "Short campaign (1-2 weeks)", value: "short" },
        { label: "Medium campaign (2-4 weeks)", value: "medium" },
        { label: "Extended campaign (1-3 months)", value: "extended" },
        { label: "Ongoing/evergreen", value: "ongoing" },
      ],
      validation: [
        { type: "required", message: "Please select a campaign duration" },
      ],
      step: 1,
    },

    // Step 2: Audience & Message
    {
      id: "target-audience",
      type: "textarea",
      label: "Target Tech Audience Segment",
      placeholder: "Describe the specific tech audience you want to reach",
      helpText: "Be specific about roles, interests, or communities",
      validation: [
        { type: "required", message: "Target audience is required" },
      ],
      step: 2,
    },
    {
      id: "selling-proposition",
      type: "textarea",
      label: "Unique Selling Proposition",
      placeholder: "In one sentence, why should your audience care?",
      helpText: "Focus on the specific value or benefit you offer",
      validation: [
        { type: "required", message: "Selling proposition is required" },
        {
          type: "maxLength",
          value: 150,
          message: "Keep it to one sentence (max 150 chars)",
        },
      ],
      step: 2,
    },
    {
      id: "call-to-action",
      type: "text",
      label: "Call-to-Action",
      placeholder: "e.g., Sign up for early access, Download the free tool",
      helpText: "What specific action do you want people to take?",
      validation: [{ type: "required", message: "Call-to-action is required" }],
      step: 2,
    },

    // Step 3: Execution Strategy
    {
      id: "primary-channel",
      type: "radio",
      label: "Primary Marketing Channel",
      helpText: "Where will you focus most of your marketing efforts?",
      options: [
        { label: "Product Hunt", value: "product-hunt" },
        { label: "Twitter/X", value: "twitter" },
        { label: "LinkedIn", value: "linkedin" },
        { label: "Reddit", value: "reddit" },
        { label: "Hacker News", value: "hacker-news" },
        { label: "Developer communities", value: "dev-communities" },
        { label: "Email newsletter", value: "email" },
        { label: "Other", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please select a primary channel" },
      ],
      step: 3,
    },
    {
      id: "primary-channel-other",
      type: "text",
      label: "Please specify your primary channel",
      conditions: [
        { questionId: "primary-channel", operator: "==", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please specify your primary channel" },
      ],
      step: 3,
    },
    {
      id: "secondary-channels",
      type: "multiselect",
      label: "Secondary Channels (Max 2)",
      helpText:
        "Select up to 2 additional channels to support your primary channel",
      options: [
        { label: "Product Hunt", value: "product-hunt" },
        { label: "Twitter/X", value: "twitter" },
        { label: "LinkedIn", value: "linkedin" },
        { label: "Reddit", value: "reddit" },
        { label: "Hacker News", value: "hacker-news" },
        { label: "Developer communities", value: "dev-communities" },
        { label: "Email newsletter", value: "email" },
        { label: "Personal network", value: "network" },
        { label: "Content marketing/blog", value: "content" },
        { label: "Other", value: "other" },
      ],
      step: 3,
    },
    {
      id: "secondary-channels-other",
      type: "text",
      label: "Other secondary channel",
      conditions: [
        {
          questionId: "secondary-channels",
          operator: "includes",
          value: "other",
        },
      ],
      validation: [
        { type: "required", message: "Please specify the other channel" },
      ],
      step: 3,
    },
    {
      id: "content-assets",
      type: "multiselect",
      label: "Content Assets Needed",
      helpText: "What content will you need to create for this campaign?",
      options: [
        { label: "Product screenshots/demos", value: "screenshots" },
        { label: "Explainer video", value: "video" },
        { label: "Case studies/testimonials", value: "testimonials" },
        { label: "Blog post/announcement", value: "blog" },
        { label: "Social media graphics", value: "social" },
        { label: "Landing page", value: "landing-page" },
        { label: "Email templates", value: "email" },
        { label: "Other", value: "other" },
      ],
      validation: [
        {
          type: "required",
          message: "Please select at least one content asset",
        },
      ],
      step: 3,
    },
    {
      id: "content-assets-other",
      type: "text",
      label: "Other content asset",
      conditions: [
        { questionId: "content-assets", operator: "includes", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please specify the other content asset" },
      ],
      step: 3,
    },
    {
      id: "budget-allocation",
      type: "radio",
      label: "Budget Allocation",
      helpText: "What resources will you commit to this campaign?",
      options: [
        { label: "Time only - no monetary budget", value: "time-only" },
        { label: "Minimal budget (<$500)", value: "minimal" },
        { label: "Moderate budget ($500-$2000)", value: "moderate" },
        { label: "Significant budget (>$2000)", value: "significant" },
      ],
      validation: [
        { type: "required", message: "Please select a budget allocation" },
      ],
      step: 3,
    },

    // Step 4: Measurement
    {
      id: "success-metrics",
      type: "multiselect",
      label: "Success Metrics",
      helpText: "How will you measure the success of this campaign?",
      options: [
        { label: "Signups/registrations", value: "signups" },
        { label: "Website traffic", value: "traffic" },
        { label: "Social media engagement", value: "engagement" },
        { label: "Product Hunt upvotes/ranking", value: "product-hunt" },
        { label: "Downloads/installations", value: "downloads" },
        { label: "Media/blog mentions", value: "mentions" },
        { label: "Direct revenue", value: "revenue" },
        { label: "Other", value: "other" },
      ],
      validation: [
        {
          type: "required",
          message: "Please select at least one success metric",
        },
      ],
      step: 4,
    },
    {
      id: "success-metrics-other",
      type: "text",
      label: "Other success metric",
      conditions: [
        { questionId: "success-metrics", operator: "includes", value: "other" },
      ],
      validation: [
        {
          type: "required",
          message: "Please specify the other success metric",
        },
      ],
      step: 4,
    },
    {
      id: "target-numbers",
      type: "textarea",
      label: "Target Numbers (Optional)",
      placeholder: "e.g., 500 signups, 5000 website visitors, 100 upvotes",
      helpText: "If you have specific targets, list them here",
      step: 4,
    },
    {
      id: "follow-up-strategy",
      type: "textarea",
      label: "Follow-up Strategy",
      placeholder: "How will you follow up with leads or interest generated?",
      validation: [
        { type: "required", message: "Follow-up strategy is required" },
      ],
      step: 4,
    },
  ],
};

// Tech Content Strategy Questionnaire
const techContentStrategyQuestionnaire: Questionnaire = {
  id: "tech-content-strategy-questionnaire",
  templateId: "tech-content-strategy",
  title: "Tech Content Strategy Brief",
  description: "Create a focused content strategy for your tech business",
  steps: [
    {
      id: 1,
      title: "Content Goals",
      description: "Define the purpose and objectives of your content",
    },
    {
      id: 2,
      title: "Content Topics",
      description: "Identify your core content themes and approach",
    },
    {
      id: 3,
      title: "Distribution",
      description: "Plan how you'll share and promote your content",
    },
    {
      id: 4,
      title: "Measurement",
      description: "Define how you'll track content success",
    },
  ],
  questions: [
    // Step 1: Content Goals
    {
      id: "content-purpose",
      type: "radio",
      label: "Content Purpose",
      options: [
        { label: "Lead generation", value: "leads" },
        { label: "Authority building/thought leadership", value: "authority" },
        { label: "SEO/organic traffic", value: "seo" },
        { label: "Customer education/support", value: "education" },
        { label: "Community building", value: "community" },
        { label: "Other", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please select a content purpose" },
      ],
      step: 1,
    },
    {
      id: "content-purpose-other",
      type: "text",
      label: "Please specify your content purpose",
      conditions: [
        { questionId: "content-purpose", operator: "==", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please specify your content purpose" },
      ],
      step: 1,
    },
    {
      id: "current-status",
      type: "radio",
      label: "Current Content Status",
      options: [
        { label: "No content yet", value: "none" },
        { label: "Limited content (a few pieces)", value: "limited" },
        { label: "Moderate content (inconsistent)", value: "moderate" },
        { label: "Extensive content (regular schedule)", value: "extensive" },
      ],
      validation: [
        {
          type: "required",
          message: "Please select your current content status",
        },
      ],
      step: 1,
    },
    {
      id: "target-audience",
      type: "textarea",
      label: "Target Audience",
      placeholder: "Describe who you're creating content for",
      helpText: "Consider technical level, job roles, interests, etc.",
      validation: [
        { type: "required", message: "Target audience is required" },
      ],
      step: 1,
    },

    // Step 2: Content Topics
    {
      id: "content-tone",
      type: "radio",
      label: "Content Tone",
      options: [
        { label: "Technical/detailed", value: "technical" },
        { label: "Educational/instructional", value: "educational" },
        { label: "Conversational/approachable", value: "conversational" },
        { label: "Professional/formal", value: "professional" },
        { label: "Opinionated/thought-provoking", value: "opinionated" },
        { label: "Other", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please select a content tone" },
      ],
      step: 2,
    },
    {
      id: "content-tone-other",
      type: "text",
      label: "Please specify your content tone",
      conditions: [
        { questionId: "content-tone", operator: "==", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please specify your content tone" },
      ],
      step: 2,
    },
    {
      id: "content-types",
      type: "multiselect",
      label: "Content Types Preferred",
      helpText: "Select the formats that best suit your skills and audience",
      options: [
        { label: "Technical blog posts/articles", value: "blog" },
        { label: "Tutorials/how-to guides", value: "tutorials" },
        { label: "Video content", value: "video" },
        { label: "Code snippets/examples", value: "code" },
        { label: "Infographics/visual content", value: "visual" },
        { label: "Case studies", value: "case-studies" },
        { label: "Podcasts/audio", value: "podcast" },
        { label: "Newsletter", value: "newsletter" },
        { label: "Other", value: "other" },
      ],
      validation: [
        {
          type: "required",
          message: "Please select at least one content type",
        },
      ],
      step: 2,
    },
    {
      id: "content-types-other",
      type: "text",
      label: "Other content type",
      conditions: [
        { questionId: "content-types", operator: "includes", value: "other" },
      ],
      validation: [
        { type: "required", message: "Please specify the other content type" },
      ],
      step: 2,
    },
    {
      id: "topic-areas",
      type: "textarea",
      label: "Core Topic Areas (3-5)",
      placeholder: "List 3-5 main topics you'll focus on",
      helpText: "These should align with your expertise and audience interests",
      validation: [{ type: "required", message: "Topic areas are required" }],
      step: 2,
    },

    // Step 3: Distribution
    {
      id: "content-creation",
      type: "radio",
      label: "Content Creation Resources",
      options: [
        { label: "I'll create everything myself", value: "self" },
        { label: "Mix of self-created and outsourced", value: "mix" },
        { label: "Primarily outsourced/delegated", value: "outsourced" },
        { label: "Collaborative (team/community)", value: "collaborative" },
      ],
      validation: [
        {
          type: "required",
          message: "Please select content creation approach",
        },
      ],
      step: 3,
    },
    {
      id: "publishing-frequency",
      type: "radio",
      label: "Realistic Publishing Frequency",
      helpText: "Be honest about what you can consistently maintain",
      options: [
        { label: "Weekly", value: "weekly" },
        { label: "Bi-weekly", value: "bi-weekly" },
        { label: "Monthly", value: "monthly" },
        { label: "Quarterly", value: "quarterly" },
        {
          label: "When I have something valuable to share",
          value: "irregular",
        },
      ],
      validation: [
        { type: "required", message: "Please select a publishing frequency" },
      ],
      step: 3,
    },
    {
      id: "distribution-channels",
      type: "multiselect",
      label: "Distribution Channels",
      helpText: "Where will you publish and promote your content?",
      options: [
        { label: "Your own website/blog", value: "own-site" },
        { label: "Medium/dev.to/Hashnode", value: "platforms" },
        { label: "Twitter/X", value: "twitter" },
        { label: "LinkedIn", value: "linkedin" },
        { label: "Email newsletter", value: "email" },
        { label: "YouTube", value: "youtube" },
        { label: "Reddit/HackerNews", value: "communities" },
        { label: "Other", value: "other" },
      ],
      validation: [
        {
          type: "required",
          message: "Please select at least one distribution channel",
        },
      ],
      step: 3,
    },
    {
      id: "distribution-channels-other",
      type: "text",
      label: "Other distribution channel",
      conditions: [
        {
          questionId: "distribution-channels",
          operator: "includes",
          value: "other",
        },
      ],
      validation: [
        {
          type: "required",
          message: "Please specify the other distribution channel",
        },
      ],
      step: 3,
    },
    {
      id: "community-engagement",
      type: "multiselect",
      label: "Community Engagement Strategy",
      helpText: "How will you interact with your audience and community?",
      options: [
        { label: "Responding to comments", value: "comments" },
        { label: "Participating in forums/discussions", value: "forums" },
        { label: "Social media conversations", value: "social" },
        { label: "Engaging with other creators' content", value: "creators" },
        { label: "Community events/webinars", value: "events" },
        { label: "Other", value: "other" },
      ],
      step: 3,
    },
    {
      id: "community-engagement-other",
      type: "text",
      label: "Other engagement strategy",
      conditions: [
        {
          questionId: "community-engagement",
          operator: "includes",
          value: "other",
        },
      ],
      validation: [
        {
          type: "required",
          message: "Please specify the other engagement strategy",
        },
      ],
      step: 3,
    },

    // Step 4: Measurement
    {
      id: "content-repurposing",
      type: "multiselect",
      label: "Content Repurposing Opportunities",
      helpText: "How can you maximize your content investment?",
      options: [
        { label: "Turn articles into videos/podcasts", value: "media" },
        { label: "Create social media snippets", value: "social" },
        { label: "Compile content into guides/ebooks", value: "guides" },
        { label: "Use content for email newsletters", value: "email" },
        { label: "Convert to presentations/talks", value: "presentations" },
        { label: "Other", value: "other" },
      ],
      step: 4,
    },
    {
      id: "content-repurposing-other",
      type: "text",
      label: "Other repurposing opportunity",
      conditions: [
        {
          questionId: "content-repurposing",
          operator: "includes",
          value: "other",
        },
      ],
      validation: [
        {
          type: "required",
          message: "Please specify the other repurposing opportunity",
        },
      ],
      step: 4,
    },
    {
      id: "success-metrics",
      type: "multiselect",
      label: "Success Metrics",
      helpText: "How will you measure your content's performance?",
      options: [
        { label: "Page views/traffic", value: "views" },
        { label: "Email subscribers", value: "subscribers" },
        { label: "Social sharing/engagement", value: "social" },
        { label: "Lead generation", value: "leads" },
        { label: "SEO rankings/backlinks", value: "seo" },
        { label: "Community growth", value: "community" },
        { label: "Direct revenue", value: "revenue" },
        { label: "Other", value: "other" },
      ],
      validation: [
        {
          type: "required",
          message: "Please select at least one success metric",
        },
      ],
      step: 4,
    },
    {
      id: "success-metrics-other",
      type: "text",
      label: "Other success metric",
      conditions: [
        { questionId: "success-metrics", operator: "includes", value: "other" },
      ],
      validation: [
        {
          type: "required",
          message: "Please specify the other success metric",
        },
      ],
      step: 4,
    },
    {
      id: "time-allocation",
      type: "radio",
      label: "Weekly Time Allocation",
      helpText:
        "How much time can you realistically dedicate to content creation?",
      options: [
        { label: "Less than 2 hours/week", value: "minimal" },
        { label: "2-5 hours/week", value: "low" },
        { label: "5-10 hours/week", value: "medium" },
        { label: "10+ hours/week", value: "high" },
      ],
      validation: [
        { type: "required", message: "Please select a time allocation" },
      ],
      step: 4,
    },
  ],
};

// Export all questionnaires
export const questionnaires: Questionnaire[] = [
  webDevelopmentQuestionnaire,
  techProductSaasQuestionnaire,
  personalTechBrandQuestionnaire,
  techSolopreneurWebsiteQuestionnaire,
  indieTechMarketingQuestionnaire,
  techContentStrategyQuestionnaire,
];

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
    const answerValue = answers[condition.questionId];

    if (answerValue === undefined || answerValue === null) {
      return false;
    }

    switch (condition.operator) {
      case "==":
        return answerValue === condition.value;
      case "!=":
        return answerValue !== condition.value;
      case "includes":
        return (
          Array.isArray(answerValue) && answerValue.includes(condition.value)
        );
      case ">":
        return (
          typeof answerValue === "number" &&
          typeof condition.value === "number" &&
          answerValue > condition.value
        );
      case "<":
        return (
          typeof answerValue === "number" &&
          typeof condition.value === "number" &&
          answerValue < condition.value
        );
      case ">=":
        return (
          typeof answerValue === "number" &&
          typeof condition.value === "number" &&
          answerValue >= condition.value
        );
      case "<=":
        return (
          typeof answerValue === "number" &&
          typeof condition.value === "number" &&
          answerValue <= condition.value
        );
      default:
        return false;
    }
  });
}
