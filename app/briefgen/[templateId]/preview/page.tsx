"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getTemplateById } from "@/lib/data/templates";
import { getQuestionnaireByTemplateId } from "@/lib/data/questionnaire";
import { Button } from "@/components/ui/button";
import EditablePreview from "@/components/briefing/EditablePreview";
import PdfExportWithTooltip from "@/components/briefing/PdfExportWithTooltip";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Use a client component that gets params from useParams hook
const PreviewPage = () => {
  const router = useRouter();
  const params = useParams();
  const templateId = params.templateId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [markdownContent, setMarkdownContent] = useState("");
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const template = getTemplateById(templateId);
  const questionnaire = getQuestionnaireByTemplateId(templateId);

  // Redirect if template doesn't exist
  useEffect(() => {
    if (!template || !questionnaire) {
      router.push("/briefgen");
    }
  }, [template, questionnaire, router]);

  // Load existing link on component mount if briefingId exists
  useEffect(() => {
    const briefingId = localStorage.getItem(`brief_${templateId}_id`);
    if (briefingId) {
      setShareableLink(`${window.location.origin}/b/${briefingId}`);
    }
  }, [templateId]);

  // Generate markdown content from answers (defined with useCallback to avoid dependency issues)
  const generateMarkdown = useCallback(
    (answers: Record<string, unknown>) => {
      if (!template || !questionnaire) return;

      let markdown = `# ${template.title} Brief\n\n`;

      // Project Basics
      markdown += "## Project Overview\n\n";

      // Handle different templates with specific fields
      if (templateId === "indie-tech-marketing") {
        // Indie Tech Marketing fields - use campaign-specifics for both name and description
        // Split the campaign specifics content into name (first line) and description (rest)
        const campaignSpecifics =
          (answers["campaign-specifics"] as string) || "";
        const lines = campaignSpecifics
          .split("\n")
          .filter((line) => line.trim().length > 0);

        // Use first line as project name, or the whole text if it's just one line
        const projectName = lines.length > 0 ? lines[0] : "N/A";

        // Use remaining lines as description, or the whole text if it's substantial
        const projectDescription =
          lines.length > 1
            ? lines.slice(1).join("\n")
            : campaignSpecifics.length > 30
            ? campaignSpecifics
            : "N/A";

        markdown += `**Project Name:** ${projectName}\n\n`;
        markdown += `**Project Description:** ${projectDescription}\n\n`;

        // Add campaign objective if available
        if (answers["campaign-objective"]) {
          const objectiveMap: Record<string, string> = {
            launch: "Product/feature launch",
            acquisition: "User/customer acquisition",
            awareness: "Brand awareness",
            leads: "Lead generation",
            retention: "Retention/engagement",
          };

          markdown += `**Campaign Objective:** ${
            objectiveMap[answers["campaign-objective"] as string] ||
            answers["campaign-objective"]
          }`;

          // Add "other" specification if applicable
          if (
            answers["campaign-objective"] === "other" &&
            answers["campaign-objective-other"]
          ) {
            markdown += ` - ${answers["campaign-objective-other"]}`;
          }

          markdown += "\n\n";
        }

        // Add campaign duration if available
        if (answers["campaign-duration"]) {
          const durationMap: Record<string, string> = {
            "one-time": "One-time event/announcement",
            short: "Short campaign (1-2 weeks)",
            medium: "Medium campaign (2-4 weeks)",
            extended: "Extended campaign (1-3 months)",
            ongoing: "Ongoing/evergreen",
          };

          markdown += `**Campaign Duration:** ${
            durationMap[answers["campaign-duration"] as string] ||
            answers["campaign-duration"]
          }\n\n`;
        }

        // Project Goals section for marketing
        markdown += "## Project Goals\n\n";

        // Add target audience if available
        if (answers["target-audience"]) {
          markdown += `**Target Audience:**\n\n${answers["target-audience"]}\n\n`;
        }

        // Add selling proposition if available
        if (answers["selling-proposition"]) {
          markdown += `**Unique Selling Proposition:**\n\n${answers["selling-proposition"]}\n\n`;
        }

        // Add call to action if available
        if (answers["call-to-action"]) {
          markdown += `**Call to Action:** ${answers["call-to-action"]}\n\n`;
        }

        // Add marketing strategy
        markdown += "## Marketing Strategy\n\n";

        // Add primary channel if available
        if (answers["primary-channel"]) {
          const channelMap: Record<string, string> = {
            "product-hunt": "Product Hunt",
            twitter: "Twitter/X",
            linkedin: "LinkedIn",
            reddit: "Reddit",
            "hacker-news": "Hacker News",
            "dev-communities": "Developer communities",
            email: "Email newsletter",
          };

          markdown += `**Primary Channel:** ${
            channelMap[answers["primary-channel"] as string] ||
            answers["primary-channel"]
          }`;

          // Add "other" specification if applicable
          if (
            answers["primary-channel"] === "other" &&
            answers["primary-channel-other"]
          ) {
            markdown += ` - ${answers["primary-channel-other"]}`;
          }

          markdown += "\n\n";
        }

        // Add secondary channels if available
        if (
          answers["secondary-channels"] &&
          Array.isArray(answers["secondary-channels"])
        ) {
          markdown += "**Secondary Channels:**\n\n";

          const channelMap: Record<string, string> = {
            "product-hunt": "Product Hunt",
            twitter: "Twitter/X",
            linkedin: "LinkedIn",
            reddit: "Reddit",
            "hacker-news": "Hacker News",
            "dev-communities": "Developer communities",
            email: "Email newsletter",
            network: "Personal network",
            content: "Content marketing/blog",
          };

          const channels = answers["secondary-channels"] as string[];
          for (const channel of channels) {
            if (channel === "other") {
              if (answers["secondary-channels-other"]) {
                markdown += `- ${answers["secondary-channels-other"]}\n`;
              }
            } else {
              markdown += `- ${channelMap[channel] || channel}\n`;
            }
          }

          markdown += "\n";
        }

        // Add content assets if available
        if (
          answers["content-assets"] &&
          Array.isArray(answers["content-assets"])
        ) {
          markdown += "**Content Assets Needed:**\n\n";

          const assetMap: Record<string, string> = {
            screenshots: "Product screenshots/demos",
            video: "Explainer video",
            testimonials: "Case studies/testimonials",
            blog: "Blog post/announcement",
            social: "Social media graphics",
            "landing-page": "Landing page",
            email: "Email templates",
          };

          const assets = answers["content-assets"] as string[];
          for (const asset of assets) {
            if (asset === "other") {
              if (answers["content-assets-other"]) {
                markdown += `- ${answers["content-assets-other"]}\n`;
              }
            } else {
              markdown += `- ${assetMap[asset] || asset}\n`;
            }
          }

          markdown += "\n";
        }

        // Add budget allocation if available
        if (answers["budget-allocation"]) {
          const budgetMap: Record<string, string> = {
            "time-only": "Time only - no monetary budget",
            minimal: "Minimal budget (<$500)",
            moderate: "Moderate budget ($500-$2000)",
            significant: "Significant budget (>$2000)",
          };

          markdown += `**Budget Allocation:** ${
            budgetMap[answers["budget-allocation"] as string] ||
            answers["budget-allocation"]
          }\n\n`;
        }

        // Success metrics
        markdown += "## Timeline & Budget\n\n";

        // Add success metrics if available
        if (
          answers["success-metrics"] &&
          Array.isArray(answers["success-metrics"])
        ) {
          markdown += "**Success Metrics:**\n\n";

          const metricsMap: Record<string, string> = {
            signups: "Signups/registrations",
            traffic: "Website traffic",
            engagement: "Social media engagement",
            "product-hunt": "Product Hunt upvotes/ranking",
            downloads: "Downloads/installations",
            mentions: "Media/blog mentions",
            revenue: "Direct revenue",
          };

          const metrics = answers["success-metrics"] as string[];
          for (const metric of metrics) {
            if (metric === "other") {
              if (answers["success-metrics-other"]) {
                markdown += `- ${answers["success-metrics-other"]}\n`;
              }
            } else {
              markdown += `- ${metricsMap[metric] || metric}\n`;
            }
          }

          markdown += "\n";
        }

        // Add target numbers if available
        if (answers["target-numbers"]) {
          markdown += `**Target Numbers:**\n\n${answers["target-numbers"]}\n\n`;
        }

        // Add follow up strategy if available
        if (answers["follow-up-strategy"]) {
          markdown += `**Follow-up Strategy:**\n\n${answers["follow-up-strategy"]}\n\n`;
        }
      } else if (templateId === "tech-content-strategy") {
        // Tech Content Strategy fields

        // Add an editable project name field with a default from content purpose
        let projectName = (answers["custom-project-name"] as string) || "N/A";
        if (!projectName || projectName === "N/A") {
          const contentPurpose = answers["content-purpose"] as string;
          if (contentPurpose) {
            const purposeMap: Record<string, string> = {
              leads: "Lead Generation Content Strategy",
              authority: "Authority Building/Thought Leadership Strategy",
              seo: "SEO/Organic Traffic Content Strategy",
              education: "Customer Education Content Strategy",
              community: "Community Building Content Strategy",
            };

            projectName = purposeMap[contentPurpose] || contentPurpose;

            // Add "other" specification if applicable
            if (
              contentPurpose === "other" &&
              answers["content-purpose-other"]
            ) {
              projectName = answers["content-purpose-other"] as string;
            }
          }
        }

        // Use current status and topic areas for description
        let projectDescription = "";

        if (answers["current-status"]) {
          const statusMap: Record<string, string> = {
            none: "Starting from scratch (no content yet)",
            limited: "Building on limited existing content",
            moderate: "Improving moderate but inconsistent content",
            extensive: "Enhancing extensive existing content",
          };

          projectDescription += `Current Content Status: ${
            statusMap[answers["current-status"] as string] ||
            answers["current-status"]
          }\n\n`;
        }

        // Use topic-areas for content topics since content-topics doesn't exist
        if (answers["topic-areas"]) {
          projectDescription += `Primary Content Topics:\n${answers["topic-areas"]}\n`;
        }

        markdown += `**Project Name:** ${projectName}\n\n`;
        markdown += `**Project Description:** ${
          projectDescription || "N/A"
        }\n\n`;

        // Project Goals section
        markdown += "## Project Goals\n\n";

        // Add content purpose if available
        if (answers["content-purpose"]) {
          const purposeMap: Record<string, string> = {
            leads: "Lead Generation",
            authority: "Authority Building/Thought Leadership",
            seo: "SEO/Organic Traffic",
            education: "Customer Education/Support",
            community: "Community Building",
          };

          markdown += `**Content Purpose:** ${
            purposeMap[answers["content-purpose"] as string] ||
            answers["content-purpose"]
          }`;

          // Add "other" specification if applicable
          if (
            answers["content-purpose"] === "other" &&
            answers["content-purpose-other"]
          ) {
            markdown += ` - ${answers["content-purpose-other"]}`;
          }

          markdown += "\n\n";
        }

        // Add target audience if available
        if (answers["target-audience"]) {
          markdown += `**Target Audience:**\n\n${answers["target-audience"]}\n\n`;
        }

        // Use topic-areas instead of non-existent content-pillars
        if (answers["topic-areas"]) {
          markdown += `**Content Pillars/Themes:**\n\n${answers["topic-areas"]}\n\n`;
        }

        // Add content tone if available
        if (answers["content-tone"]) {
          const toneMap: Record<string, string> = {
            technical: "Technical/Detailed",
            educational: "Educational/Instructional",
            conversational: "Conversational/Approachable",
            professional: "Professional/Formal",
            opinionated: "Opinionated/Thought-provoking",
          };

          markdown += `**Content Tone:** ${
            toneMap[answers["content-tone"] as string] ||
            answers["content-tone"]
          }`;

          // Add "other" specification if applicable
          if (
            answers["content-tone"] === "other" &&
            answers["content-tone-other"]
          ) {
            markdown += ` - ${answers["content-tone-other"]}`;
          }

          markdown += "\n\n";
        }

        // Add content types if available
        if (
          answers["content-types"] &&
          Array.isArray(answers["content-types"])
        ) {
          markdown += "**Content Types:**\n\n";

          const typesMap: Record<string, string> = {
            blog: "Technical blog posts/articles",
            tutorials: "Tutorials/how-to guides",
            video: "Video content",
            code: "Code snippets/examples",
            visual: "Infographics/visual content",
            "case-studies": "Case studies",
            podcast: "Podcasts/audio",
            newsletter: "Newsletter",
          };

          const types = answers["content-types"] as string[];
          for (const type of types) {
            if (type === "other") {
              if (answers["content-types-other"]) {
                markdown += `- ${answers["content-types-other"]}\n`;
              }
            } else {
              markdown += `- ${typesMap[type] || type}\n`;
            }
          }

          markdown += "\n";
        }

        // Distribution section
        markdown += "## Distribution Strategy\n\n";

        // Content creation
        if (answers["content-creation"]) {
          const creationMap: Record<string, string> = {
            self: "Self-created content",
            mix: "Mix of self-created and outsourced content",
            outsourced: "Primarily outsourced/delegated content",
            collaborative: "Collaborative team/community content",
          };

          markdown += `**Content Creation Approach:** ${
            creationMap[answers["content-creation"] as string] ||
            answers["content-creation"]
          }\n\n`;
        }

        // Add publishing frequency if available
        if (answers["publishing-frequency"]) {
          const frequencyMap: Record<string, string> = {
            weekly: "Weekly",
            "bi-weekly": "Bi-weekly",
            monthly: "Monthly",
            quarterly: "Quarterly",
            irregular: "When valuable content is ready",
          };

          markdown += `**Publishing Frequency:** ${
            frequencyMap[answers["publishing-frequency"] as string] ||
            answers["publishing-frequency"]
          }\n\n`;
        }

        // Add distribution channels instead of primary-platforms which doesn't exist
        if (
          answers["distribution-channels"] &&
          Array.isArray(answers["distribution-channels"])
        ) {
          markdown += "**Distribution Channels:**\n\n";

          const channelMap: Record<string, string> = {
            "own-site": "Your own website/blog",
            platforms: "Medium/dev.to/Hashnode",
            twitter: "Twitter/X",
            linkedin: "LinkedIn",
            email: "Email newsletter",
            youtube: "YouTube",
            communities: "Reddit/HackerNews",
          };

          const channels = answers["distribution-channels"] as string[];
          for (const channel of channels) {
            if (channel === "other") {
              if (answers["distribution-channels-other"]) {
                markdown += `- ${answers["distribution-channels-other"]}\n`;
              }
            } else {
              markdown += `- ${channelMap[channel] || channel}\n`;
            }
          }

          markdown += "\n";
        }

        // Add community engagement strategy if available
        if (
          answers["community-engagement"] &&
          Array.isArray(answers["community-engagement"])
        ) {
          markdown += "**Community Engagement Strategy:**\n\n";

          const engagementMap: Record<string, string> = {
            comments: "Responding to comments",
            forums: "Participating in forums/discussions",
            social: "Social media conversations",
            creators: "Engaging with other creators' content",
            events: "Community events/webinars",
          };

          const strategies = answers["community-engagement"] as string[];
          for (const strategy of strategies) {
            if (strategy === "other") {
              if (answers["community-engagement-other"]) {
                markdown += `- ${answers["community-engagement-other"]}\n`;
              }
            } else {
              markdown += `- ${engagementMap[strategy] || strategy}\n`;
            }
          }

          markdown += "\n";
        }

        // Success Measurement section
        markdown += "## Success Measurement\n\n";

        // Add success metrics if available
        if (
          answers["success-metrics"] &&
          Array.isArray(answers["success-metrics"])
        ) {
          markdown += "**Success Metrics:**\n\n";

          const metricsMap: Record<string, string> = {
            views: "Page views/traffic",
            subscribers: "Email subscribers",
            social: "Social sharing/engagement",
            leads: "Lead generation",
            seo: "SEO rankings/backlinks",
            community: "Community growth",
            revenue: "Direct revenue",
          };

          const metrics = answers["success-metrics"] as string[];
          for (const metric of metrics) {
            if (metric === "other") {
              if (answers["success-metrics-other"]) {
                markdown += `- ${answers["success-metrics-other"]}\n`;
              }
            } else {
              markdown += `- ${metricsMap[metric] || metric}\n`;
            }
          }

          markdown += "\n";
        }

        // Add time allocation if available
        if (answers["time-allocation"]) {
          const timeMap: Record<string, string> = {
            minimal: "Less than 2 hours/week",
            low: "2-5 hours/week",
            medium: "5-10 hours/week",
            high: "10+ hours/week",
          };

          markdown += `**Weekly Time Allocation:** ${
            timeMap[answers["time-allocation"] as string] ||
            answers["time-allocation"]
          }\n\n`;
        }

        // Add content repurposing if available
        if (
          answers["content-repurposing"] &&
          Array.isArray(answers["content-repurposing"])
        ) {
          markdown += "**Content Repurposing Opportunities:**\n\n";

          const repurposingMap: Record<string, string> = {
            media: "Turn articles into videos/podcasts",
            social: "Create social media snippets",
            guides: "Compile content into guides/ebooks",
            email: "Use content for email newsletters",
            presentations: "Convert to presentations/talks",
          };

          const opportunities = answers["content-repurposing"] as string[];
          for (const opportunity of opportunities) {
            if (opportunity === "other") {
              if (answers["content-repurposing-other"]) {
                markdown += `- ${answers["content-repurposing-other"]}\n`;
              }
            } else {
              markdown += `- ${repurposingMap[opportunity] || opportunity}\n`;
            }
          }

          markdown += "\n";
        }
      } else {
        // Default fields for other templates
        markdown += `**Project Name:** ${answers["project-name"] || "N/A"}\n\n`;
        markdown += `**Project Description:**\n${
          answers["project-description"] || "N/A"
        }\n\n`;

        // Add project type if available
        if (answers["project-type"]) {
          const projectType = answers["project-type"] as string;
          markdown += `**Project Type:** ${projectType}`;

          // Add "other" specification if applicable
          if (projectType === "other" && answers["project-type-other"]) {
            markdown += ` - ${answers["project-type-other"]}`;
          }

          markdown += "\n\n";
        }

        // Project Goals
        markdown += "## Project Goals\n\n";

        // Add primary goals if available
        if (
          answers["primary-goals"] &&
          Array.isArray(answers["primary-goals"])
        ) {
          markdown += "**Primary Goals:**\n\n";

          const goals = answers["primary-goals"] as string[];
          for (const goal of goals) {
            if (goal === "other") {
              if (answers["primary-goals-other"]) {
                markdown += `- ${answers["primary-goals-other"]}\n`;
              }
            } else {
              const goalMap: Record<string, string> = {
                "brand-awareness": "Increase brand awareness",
                "lead-generation": "Generate leads",
                sales: "Sell products/services",
                information: "Provide information",
                ux: "Improve user experience",
              };

              markdown += `- ${goalMap[goal] || goal}\n`;
            }
          }

          markdown += "\n";
        }

        // Add target audience if available
        if (answers["target-audience"]) {
          markdown += `**Target Audience:**\n\n${answers["target-audience"]}\n\n`;
        }

        // Add success metrics if available
        if (answers["success-metrics"]) {
          markdown += `**Success Metrics:**\n\n${answers["success-metrics"]}\n\n`;
        }
      }

      // Technical Requirements (for web development)
      if (templateId === "web-development") {
        markdown += "## Technical Requirements\n\n";

        // Add technologies if available
        if (answers.technologies && Array.isArray(answers.technologies)) {
          markdown += "**Preferred Technologies:**\n\n";

          const technologies = answers.technologies as string[];
          for (const tech of technologies) {
            if (tech === "other") {
              if (answers["technologies-other"]) {
                markdown += `- ${answers["technologies-other"]}\n`;
              }
            } else if (tech === "no-preference") {
              markdown += "- No specific technology preference\n";
            } else {
              markdown += `- ${tech}\n`;
            }
          }

          markdown += "\n";
        }

        // Add features if available
        if (answers.features && Array.isArray(answers.features)) {
          markdown += "**Required Features:**\n\n";

          const features = answers.features as string[];
          for (const feature of features) {
            if (feature === "other") {
              if (answers["features-other"]) {
                markdown += `- ${answers["features-other"]}\n`;
              }
            } else {
              const featureMap: Record<string, string> = {
                auth: "User authentication",
                cms: "Content management system",
                ecommerce: "E-commerce functionality",
                blog: "Blog",
                search: "Search functionality",
                "contact-form": "Contact form",
                "social-media": "Social media integration",
                analytics: "Analytics",
              };

              markdown += `- ${featureMap[feature] || feature}\n`;
            }
          }

          markdown += "\n";
        }

        // Add hosting preferences if available
        if (answers.hosting) {
          const hostingMap: Record<string, string> = {
            "need-recommendations": "Client needs hosting recommendations",
            "own-hosting": "Client has their own hosting",
            "not-sure": "Client is not sure about hosting yet",
          };

          markdown += `**Hosting Preferences:** ${
            hostingMap[answers.hosting as string] || answers.hosting
          }\n\n`;
        }
      }

      // Design & UX (for web development)
      if (templateId === "web-development") {
        markdown += "## Design & User Experience\n\n";

        // Add design preferences if available
        if (answers["design-preferences"]) {
          const designMap: Record<string, string> = {
            "brand-guidelines": "Client has brand guidelines to follow",
            "new-design": "Client needs a completely new design",
            "mockups-ready": "Client has design mockups ready",
            "need-inspiration": "Client needs inspiration from existing sites",
          };

          markdown += `**Design Preferences:** ${
            designMap[answers["design-preferences"] as string] ||
            answers["design-preferences"]
          }\n\n`;

          // Add inspiration sites if applicable
          if (
            answers["design-preferences"] === "need-inspiration" &&
            answers["inspiration-sites"]
          ) {
            markdown += `**Inspiration Websites:**\n\n${answers["inspiration-sites"]}\n\n`;
          }
        }

        // Add responsive design requirements if available
        if (
          answers["responsive-design"] &&
          Array.isArray(answers["responsive-design"])
        ) {
          markdown += "**Responsive Design Requirements:**\n\n";

          const responsive = answers["responsive-design"] as string[];
          for (const device of responsive) {
            markdown += `- ${device}-friendly\n`;
          }

          markdown += "\n";
        }

        // Add accessibility requirements if available
        if (answers.accessibility) {
          const accessibilityMap: Record<string, string> = {
            "wcag-aa": "WCAG 2.1 AA compliance required",
            "wcag-aaa": "WCAG 2.1 AAA compliance required",
            basic: "Basic accessibility is fine",
            "not-priority": "Accessibility is not a priority",
          };

          markdown += `**Accessibility Requirements:** ${
            accessibilityMap[answers.accessibility as string] ||
            answers.accessibility
          }\n\n`;
        }
      }

      // Timeline & Budget
      markdown += "## Timeline & Budget\n\n";

      // Add timeline if available
      if (answers.timeline) {
        const timelineMap: Record<string, string> = {
          "less-than-1-month": "Less than 1 month",
          "1-3-months": "1-3 months",
          "3-6-months": "3-6 months",
          "more-than-6-months": "More than 6 months",
          "no-deadline": "No specific deadline",
        };

        markdown += `**Project Timeline:** ${
          timelineMap[answers.timeline as string] || answers.timeline
        }\n\n`;
      }

      // Add start date if available
      if (answers["start-date"]) {
        markdown += `**Desired Start Date:** ${answers["start-date"]}\n\n`;
      }

      // Add budget range if available
      if (answers["budget-range"]) {
        const budgetMap: Record<string, string> = {
          "less-than-5k": "Less than $5,000",
          "5k-10k": "$5,000 - $10,000",
          "10k-25k": "$10,000 - $25,000",
          "25k-50k": "$25,000 - $50,000",
          "more-than-50k": "More than $50,000",
          "not-sure": "Not sure / Need guidance",
        };

        markdown += `**Budget Range:** ${
          budgetMap[answers["budget-range"] as string] ||
          answers["budget-range"]
        }\n\n`;
      }

      // Additional Information
      if (answers["additional-info"]) {
        markdown += `## Additional Information\n\n${answers["additional-info"]}\n\n`;
      }

      // Set the generated markdown
      setMarkdownContent(markdown);
    },
    [template, questionnaire, templateId]
  );

  // Load answers from localStorage or database
  useEffect(() => {
    const loadBrief = async () => {
      // First check if we have a briefing ID in localStorage
      const briefingId = localStorage.getItem(`brief_${templateId}_id`);

      if (briefingId) {
        // Always set the shareable link if we have a briefingId
        setShareableLink(`${window.location.origin}/b/${briefingId}`);

        try {
          // Try to load from the database
          const response = await fetch(`/api/briefings?uuid=${briefingId}`);

          if (response.ok) {
            const data = await response.json();

            // Check if we have the markdown and answers in the database - use optional chaining
            if (data.data?.markdown) {
              setMarkdownContent(data.data.markdown);
              setIsLoading(false);
              return;
            }
          } else if (response.status === 404) {
            // If the brief no longer exists in the database, remove the ID but don't
            // remove the link as it could be a transient error
            console.warn(
              `Briefing with ID ${briefingId} not found in database`
            );
          }
        } catch (error) {
          console.error("Error loading brief from database:", error);
          // Fall back to localStorage if database fetch fails
        }
      }

      // Fall back to localStorage
      const savedAnswers = localStorage.getItem(`brief_${templateId}_final`);
      if (savedAnswers) {
        try {
          const parsedAnswers = JSON.parse(savedAnswers);
          generateMarkdown(parsedAnswers);
        } catch (error) {
          console.error("Failed to parse saved answers:", error);
        }
      } else {
        // If no answers found, redirect back to the form
        router.push(`/briefgen/${templateId}/create`);
      }
      setIsLoading(false);
    };

    loadBrief();
  }, [templateId, router, generateMarkdown]);

  // Create a custom project name extractor for all templates
  const extractCustomProjectName = (markdown: string): string | null => {
    const projectNameMatch = markdown.match(
      /\*\*Project Name:\*\* (.*?)(?:\n\n|\n$)/
    );
    if (projectNameMatch && projectNameMatch[1]) {
      return projectNameMatch[1].trim();
    }
    return null;
  };

  // Handle markdown content changes with auto-save to existing briefing
  const handleMarkdownChange = async (newMarkdown: string) => {
    setMarkdownContent(newMarkdown);

    // Always save to localStorage
    localStorage.setItem(`brief_${templateId}_markdown`, newMarkdown);

    // Extract project name from markdown if user changes it
    // This allows the project name to persist even if the preview is regenerated
    const customProjectName = extractCustomProjectName(newMarkdown);

    if (customProjectName) {
      // Get the stored answers
      const savedAnswers = localStorage.getItem(`brief_${templateId}_final`);
      if (savedAnswers) {
        try {
          const parsedAnswers = JSON.parse(savedAnswers);

          // Save the custom project name for all templates
          parsedAnswers["custom-project-name"] = customProjectName;
          localStorage.setItem(
            `brief_${templateId}_final`,
            JSON.stringify(parsedAnswers)
          );
        } catch (error) {
          console.error("Failed to update project name:", error);
        }
      }
    }

    // Get the stored answers
    const savedAnswers = localStorage.getItem(`brief_${templateId}_final`);
    if (!savedAnswers) return;

    // Get existing briefing ID
    const briefingId = localStorage.getItem(`brief_${templateId}_id`);

    // If there's an existing briefing ID, silently try to update it (auto-save)
    if (briefingId && !isSaving) {
      try {
        setIsSaving(true);
        const parsedAnswers = JSON.parse(savedAnswers);

        const response = await fetch(
          `/api/briefings?uuid=${briefingId}`,
          apiOptions("PUT", {
            data: {
              answers: parsedAnswers,
              markdown: newMarkdown,
            },
          })
        );

        // Only remove the link if we get a 404 AND the current shareableLink matches this briefingId
        // This prevents the link from disappearing if we're just editing
        if (response.status === 404) {
          const currentLink = `${window.location.origin}/b/${briefingId}`;
          if (shareableLink === currentLink) {
            localStorage.removeItem(`brief_${templateId}_id`);
            setShareableLink(null);
          }
        } else if (response.ok) {
          // Make sure the link is set/maintained after update
          const currentLink = `${window.location.origin}/b/${briefingId}`;
          if (!shareableLink) {
            setShareableLink(currentLink);
          }
        }

        setIsSaving(false);
      } catch (error) {
        console.error("Auto-save error:", error);
        setIsSaving(false);
      }
    }
  };

  // Handle saving and updating the existing link
  const handleSaveLink = async () => {
    try {
      setIsSaving(true);
      // Get the stored answers
      const savedAnswers = localStorage.getItem(`brief_${templateId}_final`);

      if (!savedAnswers) {
        toast.error("No brief data found");
        setIsSaving(false);
        return;
      }

      const parsedAnswers = JSON.parse(savedAnswers);
      const briefingId = localStorage.getItem(`brief_${templateId}_id`);

      if (briefingId) {
        // Try to update existing briefing
        const response = await fetch(
          `/api/briefings?uuid=${briefingId}`,
          apiOptions("PUT", {
            data: {
              answers: parsedAnswers,
              markdown: markdownContent,
            },
          })
        );

        if (response.ok) {
          // Ensure the shareableLink is set/maintained after a successful update
          setShareableLink(`${window.location.origin}/b/${briefingId}`);
          toast.success("Brief updated successfully!");
        } else if (response.status === 404) {
          // If not found, create a new one
          await createNewBriefing(parsedAnswers);
        } else {
          toast.error("Failed to update brief");
        }
      } else {
        // No existing briefing, create a new one
        await createNewBriefing(parsedAnswers);
      }

      setIsSaving(false);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error saving brief");
      setIsSaving(false);
    }
  };

  // Helper function to create a new briefing
  const createNewBriefing = async (parsedAnswers: Record<string, unknown>) => {
    const response = await fetch(
      "/api/briefings",
      apiOptions("POST", {
        category: templateId,
        data: {
          answers: parsedAnswers,
          markdown: markdownContent,
        },
      })
    );

    if (response.ok) {
      const data = await response.json();
      // Store the briefing ID in localStorage
      localStorage.setItem(`brief_${templateId}_id`, data.id);

      // Create and set shareable link
      const newLink = `${window.location.origin}/b/${data.id}`;
      setShareableLink(newLink);

      // Copy link to clipboard
      await navigator.clipboard.writeText(newLink);
      toast.success("New link created and copied to clipboard!");
    } else {
      const errorText = await response.text();
      console.error(`Failed to create briefing: ${errorText}`);
      toast.error("Failed to create shareable link");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-8 mb-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Loading your brief...
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!template || !questionnaire) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          className="text-yellow-400 hover:text-yellow-500 hover:bg-zinc-800 mb-6"
          asChild
        >
          <Link
            href={`/briefgen/${templateId}/create`}
            className="inline-flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>Back arrow</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Questionnaire
          </Link>
        </Button>

        <div className="flex items-center mb-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-800 text-yellow-400 mr-4">
            {template.icon}
          </div>
          <h1 className="text-3xl font-bold text-white">
            {template.title} Brief Preview
          </h1>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Generated Brief
            </h2>

            {shareableLink && (
              <div className="bg-zinc-700 border-l-4 border-yellow-400 pl-3 pr-3 py-2 rounded-md text-sm text-zinc-300 w-full mb-3">
                {shareableLink}
              </div>
            )}

            <div className="flex gap-1">
              {shareableLink ? (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        size="icon"
                        className="bg-yellow-400 text-black hover:bg-yellow-500 h-9 w-9"
                        onClick={handleSaveLink}
                        disabled={isSaving}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <title>Save icon</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                          />
                        </svg>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save Brief</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        size="icon"
                        className="bg-yellow-400 text-black hover:bg-yellow-500 h-9 w-9"
                        onClick={() => {
                          navigator.clipboard.writeText(shareableLink);
                          toast.success("Link copied to clipboard!");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <title>Copy link icon</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy Link</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      size="icon"
                      className="bg-yellow-400 text-black hover:bg-yellow-500 h-9 w-9"
                      onClick={handleSaveLink}
                      disabled={isSaving}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <title>Create link icon</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V8.5M13.5 3L19 8.5M13.5 3V7.5C13.5 8.05228 13.9477 8.5 14.5 8.5H19"
                        />
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create Shareable Link</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="icon"
                    className="bg-yellow-400 text-black hover:bg-yellow-500 h-9 w-9"
                    onClick={() => {
                      navigator.clipboard.writeText(markdownContent);
                      toast.success("Markdown copied to clipboard!");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <title>Copy markdown icon</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy Markdown</p>
                </TooltipContent>
              </Tooltip>

              <PdfExportWithTooltip
                markdown={markdownContent}
                title={template ? `${template.title} Brief` : "Brief"}
              />
            </div>
          </div>

          <div className="mb-8">
            <EditablePreview
              markdown={markdownContent}
              onChange={handleMarkdownChange}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            href="/briefgen"
            onClick={() => {
              // Clear only the current template data from localStorage
              for (const key of Object.keys(localStorage)) {
                if (key.startsWith(`brief_${templateId}`)) {
                  localStorage.removeItem(key);
                }
              }
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center justify-center"
          >
            <span className="mr-2">⚡</span> Create Another Brief
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;

// Helper function to create fetch options with API key
const apiOptions = (method: string, body?: Record<string, unknown>) => {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};
