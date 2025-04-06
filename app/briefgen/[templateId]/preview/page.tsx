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
import { useSaveBriefTracking } from "@/app/components/tracking/BriefTracking";

// Use a client component that gets params from useParams hook
const PreviewPage = () => {
  const router = useRouter();
  const params = useParams();
  const templateId = params.templateId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [markdownContent, setMarkdownContent] = useState("");
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const trackSaveBrief = useSaveBriefTracking();

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
    (answers: Record<string, unknown>, templateIdParam: string) => {
      if (!template || !questionnaire) return "";

      let markdown = `# ${template.title} Brief\n\n`;

      // Project Basics
      markdown += "## Project Overview\n\n";

      // Handle different templates with specific fields
      if (templateIdParam === "indie-tech-marketing") {
        // Indie Tech Marketing fields implementation...
      } else if (templateIdParam === "tech-content-strategy") {
        // Tech Content Strategy fields implementation...
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
      if (templateIdParam === "web-development") {
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
      if (templateIdParam === "web-development") {
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

      return markdown;
    },
    [template, questionnaire]
  );

  // Load answers and generate markdown on mount
  useEffect(() => {
    const generateInitialMarkdown = async () => {
      try {
        // Create a common variable to hold answers from any template source
        let answersDataString = null;

        // Special handling for personal-tech-brand template
        if (templateId === "personal-tech-brand") {
          console.log("Special handling for personal-tech-brand template");

          // Try to find answers in localStorage - try all possible keys and log them for debugging
          const storedAnswersKey = `brief_${templateId}_answers`;
          const finalAnswersKey = `brief_${templateId}_final`;
          const answersDraftKey = `answers-${templateId}`;
          const simpleKey = `brief_${templateId}`;

          // Log all keys being checked
          console.log("Checking personal-tech-brand keys:");
          console.log(
            `- ${finalAnswersKey}:`,
            localStorage.getItem(finalAnswersKey)
          );
          console.log(
            `- ${storedAnswersKey}:`,
            localStorage.getItem(storedAnswersKey)
          );
          console.log(
            `- ${answersDraftKey}:`,
            localStorage.getItem(answersDraftKey)
          );
          console.log(`- ${simpleKey}:`, localStorage.getItem(simpleKey));

          // Try all possible keys where answers might be stored
          answersDataString =
            localStorage.getItem(finalAnswersKey) ||
            localStorage.getItem(storedAnswersKey) ||
            localStorage.getItem(answersDraftKey) ||
            localStorage.getItem(simpleKey);

          if (!answersDataString) {
            console.error("No answers found for personal-tech-brand template");
            // Instead of returning early, let's create a minimal markdown so the UI isn't empty
            const placeholderMarkdown =
              "\n## Personal Tech Brand\n\nNo data found for this brief. Please return to the questionnaire to fill in your answers.\n\n";
            setMarkdownContent(placeholderMarkdown);
            setIsLoading(false);
            return;
          }

          const answers = JSON.parse(answersDataString);
          console.log("Answers found:", answers);

          // Personal tech brand template-specific markdown generation
          let markdown = "\n## Project Overview\n\n";
          markdown += `**Project Name:** ${
            answers["brand-name"] || "Personal Brand"
          }\n\n`;

          if (answers["tech-niche"]) {
            markdown += `**Tech Niche/Specialty:** ${answers["tech-niche"]}\n\n`;
          }

          if (answers["primary-expertise"]) {
            const expertiseMap: Record<string, string> = {
              development: "Software Development",
              design: "Design/UX",
              devops: "DevOps/Infrastructure",
              "data-ai": "Data Science/AI",
              "tech-marketing": "Technical Marketing",
              product: "Product Management",
            };

            const primaryExpertise = answers["primary-expertise"] as string;
            let expertise = expertiseMap[primaryExpertise] || primaryExpertise;
            if (
              primaryExpertise === "other" &&
              answers["primary-expertise-other"]
            ) {
              expertise = answers["primary-expertise-other"] as string;
            }

            markdown += `**Primary Expertise:** ${expertise}\n\n`;
          }

          if (answers["value-proposition"]) {
            markdown += `**Value Proposition:** ${answers["value-proposition"]}\n\n`;
          }

          // Goals & Objectives section
          if (answers["target-audience"]) {
            markdown += "\n## Goals & Objectives\n\n";
            markdown += `**Target Audience:** ${answers["target-audience"]}\n\n`;

            // Brand personality
            if (
              answers["brand-personality"] &&
              Array.isArray(answers["brand-personality"])
            ) {
              markdown += "**Brand Personality:**\n";

              const personalityMap: Record<string, string> = {
                technical: "Technical authority",
                approachable: "Approachable expert",
                innovative: "Innovative thinker",
                pragmatic: "Pragmatic problem-solver",
                educator: "Educator/mentor",
                bold: "Bold/challenging status quo",
              };

              const brandPersonality = answers["brand-personality"] as string[];
              for (const trait of brandPersonality) {
                if (trait === "other" && answers["brand-personality-other"]) {
                  markdown += `- ${answers["brand-personality-other"]}\n`;
                } else {
                  markdown += `- ${personalityMap[trait] || trait}\n`;
                }
              }
              markdown += "\n";
            }
          }

          // Technical Requirements section
          let hasTechReqs = false;

          // Visual identity
          if (
            answers["visual-identity"] &&
            Array.isArray(answers["visual-identity"])
          ) {
            markdown += "\n## Technical Requirements\n\n";
            hasTechReqs = true;

            markdown += "**Visual Identity Needs:**\n";
            const identityMap: Record<string, string> = {
              logo: "Logo",
              colors: "Color scheme",
              typography: "Typography system",
              photos: "Profile photos",
              "social-templates": "Social media templates",
              presentations: "Presentation templates",
            };

            const visualIdentity = answers["visual-identity"] as string[];
            for (const item of visualIdentity) {
              if (item === "other" && answers["visual-identity-other"]) {
                markdown += `- ${answers["visual-identity-other"]}\n`;
              } else {
                markdown += `- ${identityMap[item] || item}\n`;
              }
            }
            markdown += "\n";
          }

          // Primary platform
          if (answers["primary-platform"]) {
            if (!hasTechReqs) {
              markdown += "\n## Technical Requirements\n\n";
              hasTechReqs = true;
            }

            const platformMap: Record<string, string> = {
              twitter: "Twitter/X",
              linkedin: "LinkedIn",
              github: "GitHub",
              blog: "Personal blog/website",
              youtube: "YouTube",
            };

            const primaryPlatform = answers["primary-platform"] as string;
            let platform = platformMap[primaryPlatform] || primaryPlatform;
            if (
              primaryPlatform === "other" &&
              answers["primary-platform-other"]
            ) {
              platform = answers["primary-platform-other"] as string;
            }

            markdown += `**Primary Platform:** ${platform}\n\n`;
          }

          console.log("Generated markdown:", markdown);
          setMarkdownContent(markdown);
          setIsLoading(false);
          return;
        }

        // Special handling for tech-product-saas template
        if (templateId === "tech-product-saas") {
          console.log("Special handling for tech-product-saas template");

          // Try ALL possible keys for templates
          const possibleKeys = [
            `brief_${templateId}_final`,
            `brief_${templateId}_answers`,
            `answers-${templateId}`,
            `brief_${templateId}`,
            `${templateId}_answers`,
          ];

          // Log all keys for debugging
          console.log("Checking ALL possible keys for tech-product-saas:");
          for (const key of possibleKeys) {
            const value = localStorage.getItem(key);
            console.log(`- ${key}: ${value ? "Found data" : "No data"}`);
            if (value && !answersDataString) {
              answersDataString = value;
              console.log(
                `Found answers in key: ${key}`,
                `${value.slice(0, 100)}...`
              );
            }
          }

          if (!answersDataString) {
            console.error("No answers found for tech-product-saas template");
            // Show a helpful placeholder instead of empty content
            const placeholderMarkdown =
              "\n## Tech Product/SaaS Brief\n\nNo data found for this brief. Please return to the questionnaire to fill in your answers.\n\n";
            setMarkdownContent(placeholderMarkdown);
            setIsLoading(false);
            return;
          }

          const answers = JSON.parse(answersDataString);
          console.log("Found answers for tech-product-saas:", answers);

          // Log all answer keys for debugging
          const answerKeys = Object.keys(answers);
          console.log("Answer keys found:", answerKeys);
          console.log("Total answers:", answerKeys.length);

          // Generate basic markdown that includes EVERY field
          const markdown = `# Tech Product/SaaS Brief

## Project Overview

**Project Name:** ${
            answers["product-name"] ||
            answers["project-name"] ||
            "Untitled Product"
          }

**Product Type:** ${
            answers["product-type"] === "saas"
              ? "Software as a Service (SaaS)"
              : answers["product-type"] === "mobile-app"
              ? "Mobile Application"
              : answers["product-type"] === "desktop-app"
              ? "Desktop Application"
              : answers["product-type"] === "api"
              ? "API/Developer Tool"
              : answers["product-type"] === "hardware"
              ? "Hardware/IoT Product"
              : answers["product-type"] || "Not specified"
          }

**Problem Solved:** ${
            answers["problem-solved"] ||
            answers["problem-your-product-solves"] ||
            "Not specified"
          }

**Key Features:** ${
            answers.features
              ? answers.features
              : answers["key-features"]
              ? answers["key-features"]
              : answers["core-features"]
              ? answers["core-features"]
              : "Not specified"
          }

## Goals & Objectives

**Target Users:** ${
            answers["target-users"] ||
            answers["target-user-profile"] ||
            "Not specified"
          }

**User Needs:** ${
            answers["user-needs"] ||
            answers["primary-user-pain-point"] ||
            "Not specified"
          }

**Unique Value Proposition:** ${
            answers["unique-value"] ||
            answers["key-differentiator"] ||
            "Not specified"
          }

**Competitors:** ${
            answers.competitors
              ? answers.competitors
              : answers["competitive-analysis"]
              ? answers["competitive-analysis"]
              : "Not specified"
          }

**Success Metrics:** ${
            Array.isArray(answers["success-metrics"])
              ? answers["success-metrics"]
                  .map((m: string) =>
                    m === "signups"
                      ? "User signups/registrations"
                      : m === "active-users"
                      ? "Active users"
                      : m === "retention"
                      ? "User retention"
                      : m === "revenue"
                      ? "Revenue/monetization"
                      : m === "conversion"
                      ? "Conversion rate"
                      : m === "feature-adoption"
                      ? "Feature adoption"
                      : m === "performance"
                      ? "System performance metrics"
                      : m
                  )
                  .join(", ")
              : answers["success-metrics"] || "Not specified"
          }

## Technical Requirements

**Technology Stack:** ${
            Array.isArray(answers.technologies)
              ? (answers.technologies as string[])
                  .map((t: string) =>
                    t === "react"
                      ? "React/Next.js"
                      : t === "angular"
                      ? "Angular"
                      : t === "vue"
                      ? "Vue.js/Nuxt.js"
                      : t === "node"
                      ? "Node.js"
                      : t === "python"
                      ? "Python/Django/Flask"
                      : t === "java"
                      ? "Java"
                      : t === "aws"
                      ? "AWS"
                      : t === "azure"
                      ? "Microsoft Azure"
                      : t === "gcp"
                      ? "Google Cloud Platform"
                      : t
                  )
                  .join(", ")
              : answers.technologies
              ? answers.technologies
              : answers["preferred-tech-stack"]
              ? answers["preferred-tech-stack"]
              : "Not specified"
          }

**Monetization Model:** ${
            answers["monetization-model"] === "subscription"
              ? "Subscription"
              : answers["monetization-model"] === "freemium"
              ? "Freemium (free + paid features)"
              : answers["monetization-model"] === "free"
              ? "Free (no monetization yet)"
              : answers["monetization-model"] === "one-time"
              ? "One-time purchase"
              : answers["monetization-model"] === "usage-based"
              ? "Usage-based pricing"
              : answers["monetization-model"] || "Not specified"
          }

**Minimum Viable Product:** ${
            answers["minimum-viable-product"]
              ? answers["minimum-viable-product"]
              : answers.viable
              ? answers.viable
              : answers["mvp-scope"]
              ? answers["mvp-scope"]
              : "Not specified"
          }

## Launch Strategy

**Initial Marketing Channels:** ${
            Array.isArray(answers["initial-marketing-channels"])
              ? answers["initial-marketing-channels"].join(", ")
              : answers["initial-marketing-channels"] ||
                answers["marketing-channels"] ||
                "Product Hunt"
          }

## Timeline & Budget

**Timeline:** ${
            answers["development-timeline"] === "1-month"
              ? "1 month or less"
              : answers["development-timeline"] === "1-3-months"
              ? "1-3 months"
              : answers["development-timeline"] === "3-6-months"
              ? "3-6 months"
              : answers["development-timeline"] === "6-plus-months"
              ? "6+ months"
              : answers["development-timeline"] === "no-deadline"
              ? "No specific deadline"
              : answers["development-timeline"] || "1 month or less"
          }

**Budget:** ${
            answers["budget-range"] === "less-than-5k"
              ? "Less than $5,000"
              : answers["budget-range"] === "5k-10k"
              ? "$5,000 - $10,000"
              : answers["budget-range"] === "10k-25k"
              ? "$10,000 - $25,000"
              : answers["budget-range"] === "25k-50k"
              ? "$25,000 - $50,000"
              : answers["budget-range"] === "more-than-50k"
              ? "More than $50,000"
              : answers["budget-range"] === "not-sure"
              ? "Not sure / Need guidance"
              : answers["budget-range"] || "Not specified"
          }

## Additional Information

${
  answers["additional-info"] ||
  answers["additional-notes"] ||
  "No additional information provided."
}
`;

          console.log("Generated markdown:", `${markdown.slice(0, 200)}...`);
          setMarkdownContent(markdown);
          setIsLoading(false);
          return;
        }

        // For all other templates
        // Try all possible key formats for any template
        const possibleKeys = [
          `brief_${templateId}_final`,
          `brief_${templateId}_answers`,
          `answers-${templateId}`,
          `brief_${templateId}`,
        ];

        // Log keys for debugging
        console.log(`Checking keys for ${templateId}:`);
        for (const key of possibleKeys) {
          const value = localStorage.getItem(key);
          console.log(`- ${key}: ${value ? "Found data" : "No data"}`);
          if (value && !answersDataString) {
            answersDataString = value;
            console.log(`Found answers in key: ${key}`);
          }
        }

        // Special case for indie-tech-marketing
        if (templateId === "indie-tech-marketing" && !answersDataString) {
          const rawData = localStorage.getItem(
            "brief_indie-tech-marketing_answers"
          );
          if (rawData) {
            answersDataString = rawData;
            console.log("Found indie-tech-marketing data in custom key");
          }
        }

        const answers = answersDataString ? JSON.parse(answersDataString) : {};

        // Debug logging
        console.log("Template ID:", templateId);
        console.log("Answers:", answers);

        // Generate markdown using our template system
        const markdown = generateMarkdown(answers, templateId);
        console.log(
          "Generated Markdown:",
          markdown ? `${markdown.slice(0, 200)}...` : "No markdown generated"
        );

        if (markdown) {
          setMarkdownContent(markdown);
        } else {
          setMarkdownContent(
            `# ${
              template?.title || "Brief"
            }\n\nNo data found for this brief. Please return to the questionnaire to fill in your answers.`
          );
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error generating markdown:", error);
        toast.error("Failed to generate brief");
        setIsLoading(false);
      }
    };

    if (template && questionnaire) {
      generateInitialMarkdown();
    }
  }, [template, questionnaire, templateId, generateMarkdown]);

  // Create a custom project name extractor for all templates
  const extractCustomProjectName = (markdown: string): string | null => {
    const projectNameMatch = markdown.match(
      /\*\*Project Name:\*\* (.*?)(?:\n\n|\n$)/
    );
    if (projectNameMatch?.[1]) {
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

      // Track save event using the hook
      trackSaveBrief(data.id, templateId);

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
