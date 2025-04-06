/**
 * Section template system for generating consistent markdown sections
 */
import { AnswerData } from "../../types/answers";
import { getField } from "./fieldMapping";
import md from "./markdownUtils";

/**
 * Interface for a section template
 */
export interface SectionTemplate {
  /** Unique identifier for the section */
  id: string;
  /** The title of the section */
  title: string;
  /** Function to determine if section should be included */
  condition: (answers: AnswerData, templateId: string) => boolean;
  /** Function to generate markdown content for the section */
  content: (answers: AnswerData, templateId: string) => string;
}

/**
 * Project Overview Section Template
 */
export const projectOverviewSection: SectionTemplate = {
  id: "project-overview",
  title: "Project Overview",
  condition: () => true, // Always include this section
  content: (answers, templateId) => {
    // For indie-tech-marketing, directly check for expected field names first
    if (templateId === "indie-tech-marketing") {
      console.log("Processing indie-tech-marketing overview section");
      console.log("Raw answers:", JSON.stringify(answers));

      let content = "";

      // Use a proper name for the campaign, not campaign-specifics
      content += md.field("Project Name", "Marketing Campaign");

      // Use campaign-specifics as description
      if (
        answers["campaign-specifics"] &&
        answers["campaign-specifics"] !== "Campaign specifics"
      ) {
        content += md.field(
          "Description",
          answers["campaign-specifics"] as string
        );
      }

      // Campaign objective
      if (answers["campaign-objective"]) {
        const objectiveMap: Record<string, string> = {
          launch: "Product/feature launch",
          acquisition: "User/customer acquisition",
          awareness: "Brand awareness",
          leads: "Lead generation",
          retention: "Retention/engagement",
        };
        content += md.field(
          "Campaign Objective",
          objectiveMap[answers["campaign-objective"] as string] ||
            answers["campaign-objective"]
        );
      }

      // Campaign duration
      if (answers["campaign-duration"]) {
        const durationMap: Record<string, string> = {
          "one-time": "One-time event/announcement",
          short: "Short campaign (1-2 weeks)",
          medium: "Medium campaign (2-4 weeks)",
          extended: "Extended campaign (1-3 months)",
          ongoing: "Ongoing/evergreen",
        };
        content += md.field(
          "Campaign Duration",
          durationMap[answers["campaign-duration"] as string] ||
            answers["campaign-duration"]
        );
      }

      return content;
    }

    // For personal-tech-brand, directly check for expected field names
    if (templateId === "personal-tech-brand") {
      console.log("Processing personal-tech-brand overview section");

      let content = "";

      // Brand name
      const brandName = answers["brand-name"] || "Personal Brand";
      content += md.field("Project Name", brandName);

      // Tech niche/specialty
      if (answers["tech-niche"]) {
        content += md.field("Tech Niche/Specialty", answers["tech-niche"]);
      }

      // Primary expertise
      if (answers["primary-expertise"]) {
        const expertiseMap: Record<string, string> = {
          development: "Software Development",
          design: "Design/UX",
          devops: "DevOps/Infrastructure",
          "data-ai": "Data Science/AI",
          "tech-marketing": "Technical Marketing",
          product: "Product Management",
        };

        let expertise =
          expertiseMap[answers["primary-expertise"] as string] ||
          answers["primary-expertise"];

        // Check for "other" value
        if (
          answers["primary-expertise"] === "other" &&
          answers["primary-expertise-other"]
        ) {
          expertise = answers["primary-expertise-other"] as string;
        }

        content += md.field("Primary Expertise", expertise);
      }

      // Value proposition for personal brand
      if (answers["value-proposition"]) {
        content += md.field("Value Proposition", answers["value-proposition"]);
      }

      return content;
    }

    // Regular field mapping for other templates
    // Get standardized fields
    const projectName = getField("projectName", answers, templateId);
    const projectDescription = getField(
      "projectDescription",
      answers,
      templateId
    );

    let content = "";

    // Add project name if available
    if (projectName) {
      content += md.field("Project Name", projectName);
    }

    // Add project description if available
    if (projectDescription) {
      content += md.field("Description", projectDescription);
    }

    // Template-specific fields
    if (templateId === "product-marketing-launch") {
      const productType = getField("productType", answers, templateId);
      content += md.conditionalField("Product Type", productType);
    }

    if (templateId === "digital-marketing-campaign") {
      const campaignType = answers["campaignType"];
      content += md.conditionalField("Campaign Type", campaignType);
    }

    if (templateId === "web-development") {
      const projectType = getField("productType", answers, templateId);
      content += md.conditionalField("Project Type", projectType);
    }

    return content;
  },
};

/**
 * Project Goals Section Template
 */
export const projectGoalsSection: SectionTemplate = {
  id: "project-goals",
  title: "Goals & Objectives",
  condition: (answers, templateId) => {
    // Special case for indie-tech-marketing
    if (templateId === "indie-tech-marketing") {
      return !!(
        answers["target-audience"] ||
        answers["selling-proposition"] ||
        answers["call-to-action"] ||
        answers["success-metrics"]
      );
    }

    // Special case for personal-tech-brand
    if (templateId === "personal-tech-brand") {
      return !!(
        answers["target-audience"] ||
        answers["brand-personality"] ||
        answers["success-metrics"]
      );
    }

    // Include this section if we have either target audience or success metrics
    const hasAudience = !!getField("targetAudience", answers, templateId);
    const hasSuccessMetrics = !!getField("successMetrics", answers, templateId);
    const hasCampaignObjectives = !!getField(
      "campaignObjectives",
      answers,
      templateId
    );

    return hasAudience || hasSuccessMetrics || hasCampaignObjectives;
  },
  content: (answers, templateId) => {
    // Special case for indie-tech-marketing
    if (templateId === "indie-tech-marketing") {
      console.log("Processing indie-tech-marketing goals section");

      let content = "";

      // Target audience
      if (answers["target-audience"]) {
        content += md.field("Target Audience", answers["target-audience"]);
      }

      // Unique selling proposition
      if (answers["selling-proposition"]) {
        content += md.field(
          "Unique Selling Proposition",
          answers["selling-proposition"]
        );
      }

      // Call to action
      if (answers["call-to-action"]) {
        content += md.field("Call to Action", answers["call-to-action"]);
      }

      // Success metrics
      if (answers["success-metrics"]) {
        const metrics = answers["success-metrics"];
        if (Array.isArray(metrics) && metrics.length > 0) {
          content += "**Success Metrics:**\n";

          const metricsMap: Record<string, string> = {
            signups: "Signups/registrations",
            traffic: "Website traffic",
            engagement: "Social media engagement",
            "product-hunt": "Product Hunt upvotes/ranking",
            downloads: "Downloads/installations",
            mentions: "Media/blog mentions",
            revenue: "Direct revenue",
          };

          for (const metric of metrics) {
            if (metric === "other" && answers["success-metrics-other"]) {
              content += `- ${answers["success-metrics-other"]}\n`;
            } else if (typeof metric === "string") {
              content += `- ${metricsMap[metric] || metric}\n`;
            }
          }
          content += "\n";
        } else if (typeof metrics === "string") {
          content += md.field("Success Metrics", metrics);
        }
      }

      return content;
    }

    // Special case for personal-tech-brand
    if (templateId === "personal-tech-brand") {
      console.log("Processing personal-tech-brand goals section");

      let content = "";

      // Target audience
      if (answers["target-audience"]) {
        content += md.field("Target Audience", answers["target-audience"]);
      }

      // Brand personality traits
      if (answers["brand-personality"]) {
        const traits = answers["brand-personality"];
        if (Array.isArray(traits) && traits.length > 0) {
          content += "**Brand Personality:**\n";

          const personalityMap: Record<string, string> = {
            technical: "Technical authority",
            approachable: "Approachable expert",
            innovative: "Innovative thinker",
            pragmatic: "Pragmatic problem-solver",
            educator: "Educator/mentor",
            bold: "Bold/challenging status quo",
          };

          for (const trait of traits) {
            if (trait === "other" && answers["brand-personality-other"]) {
              content += `- ${answers["brand-personality-other"]}\n`;
            } else if (typeof trait === "string") {
              content += `- ${personalityMap[trait] || trait}\n`;
            }
          }
          content += "\n";
        }
      }

      // Success metrics for personal brand
      if (answers["success-metrics"]) {
        const metrics = answers["success-metrics"];
        if (Array.isArray(metrics) && metrics.length > 0) {
          content += "**Success Metrics:**\n";

          const metricsMap: Record<string, string> = {
            portfolio: "Complete professional portfolio",
            network: "Expanded professional network",
            recognition: "Industry recognition",
            speaking: "Speaking opportunities",
            clients: "Client/job opportunities",
            followers: "Social media following",
          };

          for (const metric of metrics) {
            if (metric === "other" && answers["success-metrics-other"]) {
              content += `- ${answers["success-metrics-other"]}\n`;
            } else if (typeof metric === "string") {
              content += `- ${metricsMap[metric] || metric}\n`;
            }
          }
          content += "\n";
        }
      }

      return content;
    }

    // Regular processing for other templates
    // Get standardized fields
    const targetAudience = getField("targetAudience", answers, templateId);
    const successMetrics = getField("successMetrics", answers, templateId);
    const campaignObjectives = getField(
      "campaignObjectives",
      answers,
      templateId
    );

    let content = "";

    // Add target audience if available
    content += md.conditionalField("Target Audience", targetAudience);

    // Add campaign objectives for relevant templates
    if (
      templateId === "digital-marketing-campaign" ||
      templateId === "product-marketing-launch"
    ) {
      if (campaignObjectives) {
        content += `**Objectives:**\n${campaignObjectives}\n`;
      }
    }

    // Add success metrics if available
    content += md.conditionalField("Success Metrics", successMetrics);

    return content;
  },
};

/**
 * Technical Requirements Section Template
 */
export const technicalRequirementsSection: SectionTemplate = {
  id: "technical-requirements",
  title: "Technical Requirements",
  condition: (answers, templateId) => {
    // Only include for relevant templates
    return (
      ["web-development", "tech-product-saas", "indie-tech-marketing"].includes(
        templateId
      ) && !!getField("techStack", answers, templateId)
    );
  },
  content: (answers, templateId) => {
    // Get standardized fields
    const techStack = getField("techStack", answers, templateId);

    let content = "";

    // Different labels based on template
    if (templateId === "indie-tech-marketing") {
      content += md.conditionalField("Primary Marketing Channel", techStack);
    } else {
      // Add tech stack if available
      content += md.conditionalField("Technology Stack", techStack);
    }

    // Template-specific fields
    if (templateId === "web-development") {
      const hosting = answers["hosting"];
      const features = answers["features"];

      content += md.conditionalField("Hosting Requirements", hosting);

      if (features && Array.isArray(features) && features.length > 0) {
        content += "**Features Required:**\n";
        content += md.list(features);
      }
    }

    if (templateId === "tech-product-saas") {
      const integrations = answers["integrations"];

      if (
        integrations &&
        Array.isArray(integrations) &&
        integrations.length > 0
      ) {
        content += "**Required Integrations:**\n";
        content += md.list(integrations);
      }
    }

    if (templateId === "indie-tech-marketing") {
      // Additional marketing channels if any
      if (
        answers["marketing-channels"] &&
        Array.isArray(answers["marketing-channels"])
      ) {
        content += "**Additional Marketing Channels:**\n";

        const channelMap: Record<string, string> = {
          "product-hunt": "Product Hunt",
          twitter: "Twitter/X",
          linkedin: "LinkedIn",
          reddit: "Reddit",
          "hacker-news": "Hacker News",
          "dev-communities": "Developer communities",
          email: "Email newsletter",
          content: "Content marketing/blog",
        };

        content += md.mappedList(
          answers["marketing-channels"],
          channelMap,
          answers["marketing-channels-other"],
          "other"
        );
      }
    }

    return content;
  },
};

/**
 * Timeline & Budget Section Template
 */
export const timelineBudgetSection: SectionTemplate = {
  id: "timeline-budget",
  title: "Timeline & Budget",
  condition: (answers, templateId) => {
    // Include if we have either timeline or budget
    const hasTimeline = !!getField("timeline", answers, templateId);
    const hasBudget = !!getField("budget", answers, templateId);

    // Handle indie tech marketing specific fields
    const hasTargetNumbers =
      templateId === "indie-tech-marketing" && !!answers["target-numbers"];
    const hasFollowUpStrategy =
      templateId === "indie-tech-marketing" &&
      !!getField("followUpStrategy", answers, templateId);

    // For personal-tech-brand
    if (templateId === "personal-tech-brand") {
      return !!(answers["budget-allocation"] || answers["networking-strategy"]);
    }

    return hasTimeline || hasBudget || hasTargetNumbers || hasFollowUpStrategy;
  },
  content: (answers, templateId) => {
    // Get standardized fields
    const timeline = getField("timeline", answers, templateId);
    const budget = getField("budget", answers, templateId);

    let content = "";

    // Timeline section has template-specific handling
    if (templateId === "indie-tech-marketing") {
      // We already show campaign duration in the overview
    } else {
      // Add timeline if available
      content += md.conditionalField("Timeline", timeline);
    }

    // Add budget if available
    content += md.conditionalField("Budget", budget);

    // Template-specific fields
    if (templateId === "digital-marketing-campaign") {
      const channels = answers["marketingChannels"];

      if (channels && Array.isArray(channels) && channels.length > 0) {
        const channelMap: Record<string, string> = {
          "social-media": "Social Media",
          email: "Email Marketing",
          content: "Content Marketing",
          seo: "Search Engine Optimization",
          ppc: "Pay-Per-Click Advertising",
          influencer: "Influencer Marketing",
        };

        content += "**Marketing Channels:**\n";
        content += md.mappedList(
          channels,
          channelMap,
          answers["otherChannel"],
          "other"
        );
      }
    }

    // Indie tech marketing specific fields
    if (templateId === "indie-tech-marketing") {
      // Add target numbers if available
      if (answers["target-numbers"]) {
        content += md.field("Target Numbers", answers["target-numbers"]);
      }

      // Add follow-up strategy if available
      const followUpStrategy = getField(
        "followUpStrategy",
        answers,
        templateId
      );
      content += md.conditionalField("Follow-up Strategy", followUpStrategy);
    }

    // Special case for personal-tech-brand
    if (templateId === "personal-tech-brand") {
      console.log("Processing personal-tech-brand timeline & budget section");

      let content = "";

      // Budget allocation
      if (answers["budget-allocation"]) {
        const budgetMap: Record<string, string> = {
          "no-budget": "No budget - using free resources only",
          minimal: "Minimal budget (<$500)",
          moderate: "Moderate budget ($500-$2000)",
          significant: "Significant budget (>$2000)",
        };

        const budget =
          budgetMap[answers["budget-allocation"] as string] ||
          answers["budget-allocation"];
        content += md.field("Budget", budget);
      }

      // Networking strategy
      if (answers["networking-strategy"]) {
        const strategies = answers["networking-strategy"];
        if (Array.isArray(strategies) && strategies.length > 0) {
          content += "**Networking Strategy:**\n";

          const networkingMap: Record<string, string> = {
            conferences: "Industry conferences",
            communities: "Online tech communities",
            mentorship: "Mentorship programs",
            "co-creation": "Co-creation with peers",
            "industry-groups": "Industry groups/associations",
            meetups: "Local tech meetups",
          };

          for (const strategy of strategies) {
            if (strategy === "other" && answers["networking-strategy-other"]) {
              content += `- ${answers["networking-strategy-other"]}\n`;
            } else if (typeof strategy === "string") {
              content += `- ${networkingMap[strategy] || strategy}\n`;
            }
          }
          content += "\n";
        }
      }

      return content;
    }

    return content;
  },
};

/**
 * Additional Information Section Template
 */
export const additionalInfoSection: SectionTemplate = {
  id: "additional-info",
  title: "Additional Information",
  condition: (answers, templateId) => {
    // Template-specific conditions
    if (templateId === "brand-identity") {
      return !!answers["brandValues"] || !!answers["competitorAnalysis"];
    }

    if (templateId === "product-marketing-launch") {
      return !!answers["marketingAssets"] || !!answers["competitors"];
    }

    // For all other templates, include if there are additional notes
    return !!answers["additionalNotes"] || !!answers["additional-info"];
  },
  content: (answers, templateId) => {
    let content = "";

    // Template-specific fields
    if (templateId === "brand-identity") {
      const brandValues = answers["brandValues"];
      const competitors = answers["competitorAnalysis"];

      content += md.conditionalField("Brand Values", brandValues);
      content += md.conditionalField("Competitor Analysis", competitors);
    }

    if (templateId === "product-marketing-launch") {
      const marketingAssets = answers["marketingAssets"];
      const competitors = answers["competitors"];

      if (
        marketingAssets &&
        Array.isArray(marketingAssets) &&
        marketingAssets.length > 0
      ) {
        const assetMap: Record<string, string> = {
          "landing-page": "Landing Page",
          "social-media": "Social Media Assets",
          "email-templates": "Email Templates",
          "press-release": "Press Release",
          "product-videos": "Product Videos",
          "case-studies": "Case Studies",
        };

        content += "**Required Marketing Assets:**\n";
        content += md.mappedList(
          marketingAssets,
          assetMap,
          answers["otherAsset"],
          "other"
        );
      }

      content += md.conditionalField("Competitors", competitors);
    }

    // Add additional notes for all templates
    content += md.conditionalField(
      "Additional Notes",
      answers["additionalNotes"] || answers["additional-info"]
    );

    return content;
  },
};

// Collection of all section templates
export const sectionTemplates: SectionTemplate[] = [
  projectOverviewSection,
  projectGoalsSection,
  technicalRequirementsSection,
  timelineBudgetSection,
  additionalInfoSection,
];

/**
 * Generate complete markdown for a template using section templates
 */
export function generateMarkdown(
  answers: AnswerData,
  templateId: string
): string {
  console.log(`Generating markdown for template: ${templateId}`);
  console.log(`Section templates count: ${sectionTemplates.length}`);

  let markdown = "";

  // Add each applicable section
  for (const section of sectionTemplates) {
    console.log(`Checking section: ${section.id}`);
    const shouldInclude = section.condition(answers, templateId);
    console.log(`  Include section? ${shouldInclude}`);

    if (shouldInclude) {
      markdown += md.section(section.title);
      const sectionContent = section.content(answers, templateId);
      console.log(`  Generated content length: ${sectionContent.length}`);
      markdown += sectionContent;
    }
  }

  // Special handling for indie-tech-marketing if no content was generated
  if (markdown.trim() === "" && templateId === "indie-tech-marketing") {
    console.log("Applying fallback for empty indie-tech-marketing template");

    // Add project overview section with basic info as fallback
    markdown += md.section("Project Overview");
    markdown += md.field(
      "Project Name",
      answers["campaign-specifics"] || "Untitled Project"
    );

    // Add other basic fields if available
    if (answers["campaign-objective"]) {
      markdown += md.field("Campaign Objective", answers["campaign-objective"]);
    }

    if (answers["target-audience"]) {
      markdown += md.section("Goals & Objectives");
      markdown += md.field("Target Audience", answers["target-audience"]);
    }

    if (answers["primary-channel"]) {
      markdown += md.section("Technical Requirements");
      markdown += md.field(
        "Primary Marketing Channel",
        answers["primary-channel"]
      );
    }
  }

  return markdown;
}

// Export the module
const sectionTemplatesExport = {
  generateMarkdown,
  sectionTemplates,
};

export default sectionTemplatesExport;
