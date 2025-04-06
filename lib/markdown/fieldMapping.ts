// Field normalization system for consistent brief generation across templates

/**
 * Field mapping utilities to standardize field access across templates
 */
import type { AnswerData } from "../../types/answers";

/**
 * Interface for mapping template-specific fields to standard keys
 */
export interface FieldMap {
  /** The standardized key for this field */
  key: string;
  /** The template-specific field ids that map to this standard key */
  fields: Record<string, string | string[]>;
  /** Optional formatter to transform the value */
  formatter?: (
    value: unknown,
    templateId: string,
    answers: AnswerData
  ) => string | undefined;
  /** Default value if field is not found */
  defaultValue?: string;
}

/**
 * Gets the value for a field based on answers and template
 */
export function getFieldValue(
  fieldMap: FieldMap,
  answers: AnswerData,
  templateId: string
): string | undefined {
  // Log for debugging
  console.log(
    `Getting field value for template: ${templateId}, key: ${fieldMap.key}`
  );
  console.log("Field IDs for this template:", fieldMap.fields[templateId]);

  // Get the field ID for this template
  const fieldId = fieldMap.fields[templateId];

  if (!fieldId) {
    console.log(
      `No field ID mapping found for ${fieldMap.key} in template ${templateId}`
    );
    return fieldMap.defaultValue;
  }

  // Handle array of field IDs
  if (Array.isArray(fieldId)) {
    // Try each field ID in order until we find one with a value
    for (const id of fieldId) {
      const value = answers[id];
      console.log(`Checking array field ID ${id}, value:`, value);
      if (value !== undefined && value !== null && value !== "") {
        // Apply formatter if provided
        if (fieldMap.formatter) {
          const formatted = fieldMap.formatter(value, templateId, answers);
          console.log("Formatted value:", formatted);
          return formatted;
        }
        return String(value);
      }
    }
    console.log(
      "No value found for any field ID, using default:",
      fieldMap.defaultValue
    );
    return fieldMap.defaultValue;
  }

  // Handle single field ID
  const value = answers[fieldId];
  console.log(`Checking single field ID ${fieldId}, value:`, value);

  // Apply formatter if provided
  if (
    value !== undefined &&
    value !== null &&
    value !== "" &&
    fieldMap.formatter
  ) {
    const formatted = fieldMap.formatter(value, templateId, answers);
    console.log("Formatted value:", formatted);
    return formatted;
  }

  return value !== undefined && value !== null && value !== ""
    ? String(value)
    : fieldMap.defaultValue;
}

/**
 * Collection of common field mappings
 */
export const fieldMappings = {
  // Project basics
  projectName: {
    key: "projectName",
    fields: {
      "indie-tech-marketing": "project-name",
      "tech-product-saas": ["product-name", "project-name"],
      "web-development": "project-name",
      "brand-identity": ["brand-name", "project-name"],
      "digital-marketing-campaign": "campaign-name",
      "product-marketing-launch": "product-name",
      "personal-tech-brand": "brand-name",
      "tech-solopreneur-website": ["custom-project-name", "website-purpose"],
      "tech-content-strategy": ["content-purpose", "custom-project-name"],
    },
    defaultValue: "Untitled Project",
    formatter: (value, templateId) => {
      // For indie-tech-marketing, provide a better default
      if (templateId === "indie-tech-marketing" && (!value || value === "")) {
        return "Marketing Campaign";
      }
      return String(value);
    },
  } as FieldMap,

  projectDescription: {
    key: "projectDescription",
    fields: {
      "indie-tech-marketing": "campaign-specifics",
      "tech-product-saas": ["product-description", "project-description"],
      "web-development": "project-description",
      "brand-identity": ["company-description", "brand-description"],
      "digital-marketing-campaign": [
        "campaign-description",
        "campaign-specifics",
      ],
      "product-marketing-launch": "product-description",
      "personal-tech-brand": "brand-description",
      "tech-solopreneur-website": "primary-call-to-action",
      "tech-content-strategy": ["topic-areas", "current-status"],
    },
  } as FieldMap,

  targetAudience: {
    key: "targetAudience",
    fields: {
      "indie-tech-marketing": "target-audience",
      "tech-product-saas": ["target-users", "target-audience"],
      "web-development": "target-audience",
      "brand-identity": "target-audience",
      "digital-marketing-campaign": "target-audience",
      "product-marketing-launch": "target-audience",
      "personal-tech-brand": "target-audience",
      "tech-solopreneur-website": "target-audience",
      "tech-content-strategy": "target-audience",
    },
  } as FieldMap,

  successMetrics: {
    key: "successMetrics",
    fields: {
      "indie-tech-marketing": "success-metrics",
      "tech-product-saas": ["success-metrics", "success-indicators"],
      "web-development": "success-metrics",
      "brand-identity": "success-metrics",
      "digital-marketing-campaign": ["campaign-kpis", "success-metrics"],
      "product-marketing-launch": ["launch-kpis", "success-metrics"],
      "personal-tech-brand": "success-metrics",
      "tech-solopreneur-website": "success-metrics",
      "tech-content-strategy": "success-metrics",
    },
    formatter: (value, templateId, answers) => {
      // Handle array values for success metrics
      if (Array.isArray(value)) {
        const metricsMap: Record<string, string> = {
          // Indie tech marketing
          signups: "Signups/registrations",
          traffic: "Website traffic",
          engagement: "Social media engagement",
          "product-hunt": "Product Hunt upvotes/ranking",
          downloads: "Downloads/installations",
          mentions: "Media/blog mentions",
          revenue: "Direct revenue",

          // Content strategy
          views: "Page views/traffic",
          subscribers: "Email subscribers",
          social: "Social sharing/engagement",
          leads: "Lead generation",
          seo: "SEO rankings/backlinks",
          community: "Community growth",
        };

        let result = "";
        for (const metric of value) {
          if (metric === "other" && answers["success-metrics-other"]) {
            result += `- ${answers["success-metrics-other"]}\n`;
          } else {
            result += `- ${metricsMap[metric] || metric}\n`;
          }
        }
        return result;
      }

      return String(value);
    },
  } as FieldMap,

  budget: {
    key: "budget",
    fields: {
      "indie-tech-marketing": ["budget-allocation", "budget-range"],
      "tech-product-saas": "budget-range",
      "web-development": "budget-range",
      "brand-identity": "budget-range",
      "digital-marketing-campaign": ["campaign-budget", "budget-range"],
      "product-marketing-launch": ["marketing-budget", "budget-range"],
      "personal-tech-brand": "budget-allocation",
      "tech-solopreneur-website": "budget-range",
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formatter: (value, _templateId) => {
      if (!value) return undefined;

      // Handle budget range values
      if (typeof value === "string") {
        const budgetMap: Record<string, string> = {
          "less-than-5k": "Less than $5,000",
          "5k-10k": "$5,000 - $10,000",
          "10k-25k": "$10,000 - $25,000",
          "25k-50k": "$25,000 - $50,000",
          "more-than-50k": "More than $50,000",
          "not-sure": "Not sure / Need guidance",

          // Budget allocation values
          "time-only": "Time only - no monetary budget",
          minimal: "Minimal budget (<$500)",
          moderate: "Moderate budget ($500-$2000)",
          significant: "Significant budget (>$2000)",
        };

        return budgetMap[value as string] || value;
      }

      if (typeof value === "number") {
        return `$${value.toLocaleString()}`;
      }

      return String(value);
    },
  } as FieldMap,

  timeline: {
    key: "timeline",
    fields: {
      "indie-tech-marketing": ["campaign-duration", "development-timeline"],
      "tech-product-saas": ["development-timeline", "timeline"],
      "web-development": "timeline",
      "brand-identity": "timeline",
      "digital-marketing-campaign": ["campaign-duration", "timeline"],
      "product-marketing-launch": ["launch-date", "timeline"],
      "tech-solopreneur-website": "timeline",
    },
    formatter: (value) => {
      if (!value) return undefined;

      const timelineMap: Record<string, string> = {
        // Web dev timeline
        "less-than-1-month": "Less than 1 month",
        "1-3-months": "1-3 months",
        "3-6-months": "3-6 months",
        "more-than-6-months": "More than 6 months",
        "no-deadline": "No specific deadline",

        // Campaign duration
        "one-time": "One-time event/announcement",
        short: "Short campaign (1-2 weeks)",
        medium: "Medium campaign (2-4 weeks)",
        extended: "Extended campaign (1-3 months)",
        ongoing: "Ongoing/evergreen",

        // Tech product dev timeline
        "1-month": "1 month or less",
        "6-plus-months": "6+ months",
      };

      return timelineMap[value as string] || value;
    },
  } as FieldMap,

  // Technical specifications
  techStack: {
    key: "techStack",
    fields: {
      "indie-tech-marketing": "primary-channel",
      "tech-product-saas": ["technologies", "tech-requirements"],
      "web-development": "technologies",
    },
    formatter: (value, templateId, answers) => {
      if (Array.isArray(value)) {
        // For technologies multiselect
        const techMap: Record<string, string> = {
          react: "React",
          angular: "Angular",
          vue: "Vue.js",
          node: "Node.js",
          php: "PHP",
          wordpress: "WordPress",
          shopify: "Shopify",
          "no-preference": "No specific technology preference",
        };

        let result = "";
        for (const tech of value) {
          if (tech === "other" && answers["technologies-other"]) {
            result += `- ${answers["technologies-other"]}\n`;
          } else {
            result += `- ${techMap[tech] || tech}\n`;
          }
        }
        return result;
      }

      // For indie-tech-marketing primary channel
      if (templateId === "indie-tech-marketing" && typeof value === "string") {
        const channelMap: Record<string, string> = {
          "product-hunt": "Product Hunt",
          twitter: "Twitter/X",
          linkedin: "LinkedIn",
          reddit: "Reddit",
          "hacker-news": "Hacker News",
          "dev-communities": "Developer communities",
          email: "Email newsletter",
        };

        if (value === "other" && answers["primary-channel-other"]) {
          return answers["primary-channel-other"];
        }

        return channelMap[value] || value;
      }

      return String(value);
    },
  } as FieldMap,

  // Template-specific fields
  productType: {
    key: "productType",
    fields: {
      "tech-product-saas": "product-type",
      "product-marketing-launch": "product-type",
      "web-development": "project-type",
    },
    formatter: (value, templateId, answers) => {
      const typeMap: Record<string, string> = {
        // Tech product types
        saas: "Software as a Service (SaaS)",
        "mobile-app": "Mobile Application",
        "desktop-app": "Desktop Application",
        api: "API/Developer Tool",
        hardware: "Hardware/IoT Product",

        // Web dev project types
        "new-website": "New Website",
        "website-redesign": "Website Redesign",
        "web-application": "Web Application",
        ecommerce: "E-commerce Site",
        "landing-page": "Landing Page",
      };

      if (value === "other") {
        // Handle other fields
        if (
          templateId === "tech-product-saas" &&
          answers["product-type-other"]
        ) {
          return answers["product-type-other"];
        }

        if (templateId === "web-development" && answers["project-type-other"]) {
          return answers["project-type-other"];
        }

        if (
          templateId === "product-marketing-launch" &&
          answers["product-type-other"]
        ) {
          return answers["product-type-other"];
        }
      }

      return typeMap[value as string] || value;
    },
  } as FieldMap,

  campaignObjectives: {
    key: "campaignObjectives",
    fields: {
      "digital-marketing-campaign": "campaign-objectives",
      "product-marketing-launch": "launch-objectives",
      "indie-tech-marketing": "campaign-objective",
    },
    formatter: (value, templateId, answers) => {
      // Handle single value (radio) for indie-tech-marketing
      if (!Array.isArray(value) && templateId === "indie-tech-marketing") {
        const objectiveMap: Record<string, string> = {
          launch: "Product/feature launch",
          acquisition: "User/customer acquisition",
          awareness: "Brand awareness",
          leads: "Lead generation",
          retention: "Retention/engagement",
        };

        let result = objectiveMap[value as string] || value;

        // Add other specification if applicable
        if (value === "other" && answers["campaign-objective-other"]) {
          result = answers["campaign-objective-other"];
        }

        return result;
      }

      // Handle array of values for other templates
      if (Array.isArray(value)) {
        const objectiveMap: Record<string, string> = {
          "brand-awareness": "Brand Awareness",
          "lead-generation": "Lead Generation",
          "sales-conversion": "Sales Conversion",
          "customer-retention": "Customer Retention",
          "product-launch": "Product Launch",
        };

        let result = "";
        for (const obj of value) {
          // Find the appropriate "other" field based on template
          let otherField = "";
          if (templateId === "digital-marketing-campaign") {
            otherField = "campaign-objectives-other";
          } else if (templateId === "product-marketing-launch") {
            otherField = "launch-objectives-other";
          }

          if (obj === "other" && answers[otherField]) {
            result += `- ${answers[otherField]}\n`;
          } else {
            result += `- ${objectiveMap[obj] || obj}\n`;
          }
        }

        return result;
      }

      return String(value);
    },
  } as FieldMap,

  // Indie tech marketing specific fields
  sellingProposition: {
    key: "sellingProposition",
    fields: {
      "indie-tech-marketing": "selling-proposition",
    },
  } as FieldMap,

  callToAction: {
    key: "callToAction",
    fields: {
      "indie-tech-marketing": "call-to-action",
    },
  } as FieldMap,

  followUpStrategy: {
    key: "followUpStrategy",
    fields: {
      "indie-tech-marketing": "follow-up-strategy",
    },
  } as FieldMap,

  // Personal tech brand specific fields
  techNiche: {
    key: "techNiche",
    fields: {
      "personal-tech-brand": "tech-niche",
    },
    defaultValue: "",
  } as FieldMap,

  primaryExpertise: {
    key: "primaryExpertise",
    fields: {
      "personal-tech-brand": "primary-expertise",
    },
    formatter: (value, _templateId, answers) => {
      if (!value) return undefined;

      const expertiseMap: Record<string, string> = {
        development: "Software Development",
        design: "Design/UX",
        devops: "DevOps/Infrastructure",
        "data-ai": "Data Science/AI",
        "tech-marketing": "Technical Marketing",
        product: "Product Management",
      };

      if (value === "other" && answers["primary-expertise-other"]) {
        return answers["primary-expertise-other"];
      }

      return expertiseMap[value as string] || value;
    },
  } as FieldMap,

  valueProposition: {
    key: "valueProposition",
    fields: {
      "personal-tech-brand": "value-proposition",
    },
  } as FieldMap,

  brandPersonality: {
    key: "brandPersonality",
    fields: {
      "personal-tech-brand": "brand-personality",
    },
    formatter: (value, templateId, answers) => {
      if (!Array.isArray(value)) return value;

      const personalityMap: Record<string, string> = {
        technical: "Technical authority",
        approachable: "Approachable expert",
        innovative: "Innovative thinker",
        pragmatic: "Pragmatic problem-solver",
        educator: "Educator/mentor",
        bold: "Bold/challenging status quo",
      };

      let result = "";
      for (const trait of value) {
        if (trait === "other" && answers["brand-personality-other"]) {
          result += `- ${answers["brand-personality-other"]}\n`;
        } else {
          result += `- ${personalityMap[trait] || trait}\n`;
        }
      }
      return result;
    },
  } as FieldMap,

  visualIdentity: {
    key: "visualIdentity",
    fields: {
      "personal-tech-brand": "visual-identity",
    },
    formatter: (value, templateId, answers) => {
      if (!Array.isArray(value)) return value;

      const identityMap: Record<string, string> = {
        logo: "Logo",
        colors: "Color scheme",
        typography: "Typography system",
        photos: "Profile photos",
        "social-templates": "Social media templates",
        presentations: "Presentation templates",
      };

      let result = "";
      for (const item of value) {
        if (item === "other" && answers["visual-identity-other"]) {
          result += `- ${answers["visual-identity-other"]}\n`;
        } else {
          result += `- ${identityMap[item] || item}\n`;
        }
      }
      return result;
    },
  } as FieldMap,

  primaryPlatform: {
    key: "primaryPlatform",
    fields: {
      "personal-tech-brand": "primary-platform",
    },
    formatter: (value, _templateId, answers) => {
      if (!value) return undefined;

      const platformMap: Record<string, string> = {
        twitter: "Twitter/X",
        linkedin: "LinkedIn",
        github: "GitHub",
        blog: "Personal blog/website",
        youtube: "YouTube",
      };

      if (value === "other" && answers["primary-platform-other"]) {
        return answers["primary-platform-other"];
      }

      return platformMap[value as string] || value;
    },
  } as FieldMap,

  contentTypes: {
    key: "contentTypes",
    fields: {
      "personal-tech-brand": "content-types",
    },
    formatter: (value, templateId, answers) => {
      if (!Array.isArray(value)) return value;

      const contentMap: Record<string, string> = {
        blogs: "Blog posts/articles",
        videos: "Video tutorials/talks",
        newsletters: "Email newsletters",
        podcasts: "Podcasts/audio content",
        courses: "Courses/educational content",
        "open-source": "Open source contributions",
        "speaking-events": "Speaking at events/conferences",
      };

      let result = "";
      for (const type of value) {
        if (type === "other" && answers["content-types-other"]) {
          result += `- ${answers["content-types-other"]}\n`;
        } else {
          result += `- ${contentMap[type] || type}\n`;
        }
      }
      return result;
    },
  } as FieldMap,

  networkingStrategy: {
    key: "networkingStrategy",
    fields: {
      "personal-tech-brand": "networking-strategy",
    },
    formatter: (value, templateId, answers) => {
      if (!Array.isArray(value)) return value;

      const networkingMap: Record<string, string> = {
        conferences: "Industry conferences",
        communities: "Online tech communities",
        mentorship: "Mentorship programs",
        "co-creation": "Co-creation with peers",
        "industry-groups": "Industry groups/associations",
        meetups: "Local tech meetups",
      };

      let result = "";
      for (const strategy of value) {
        if (strategy === "other" && answers["networking-strategy-other"]) {
          result += `- ${answers["networking-strategy-other"]}\n`;
        } else {
          result += `- ${networkingMap[strategy] || strategy}\n`;
        }
      }
      return result;
    },
  } as FieldMap,
};

/**
 * Get a normalized field value from answers and template ID
 */
export function getField(
  key: keyof typeof fieldMappings,
  answers: AnswerData,
  templateId: string
): string | undefined {
  const mapping = fieldMappings[key];
  if (!mapping) return undefined;

  return getFieldValue(mapping, answers, templateId);
}

/**
 * This function will be implemented in the future when we add section-based generation
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
export function getSection(
  _sectionKey: string,
  _answers: AnswerData,
  _templateId: string
): string | undefined {
  return undefined;
}
/* eslint-enable @typescript-eslint/no-unused-vars */

// Create a default export of the field mappings
const fieldMappingsExport = fieldMappings;
export default fieldMappingsExport;
