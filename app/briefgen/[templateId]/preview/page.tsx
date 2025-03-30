"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import { getTemplateById } from "@/lib/data/templates";
import { getQuestionnaireByTemplateId } from "@/lib/data/questionnaire";
import { Button } from "@/components/ui/button";
import EditablePreview from "@/components/briefing/EditablePreview";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PageProps = {
  params: Promise<{
    templateId: string;
  }>;
};

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

export default function PreviewPage({ params }: PageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [markdownContent, setMarkdownContent] = useState("");
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Unwrap params Promise with use()
  const unwrappedParams = use(params);
  const templateId = unwrappedParams.templateId;

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
      if (answers["primary-goals"] && Array.isArray(answers["primary-goals"])) {
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

  // Handle markdown content changes with auto-save to existing briefing
  const handleMarkdownChange = async (newMarkdown: string) => {
    setMarkdownContent(newMarkdown);

    // Always save to localStorage
    localStorage.setItem(`brief_${templateId}_markdown`, newMarkdown);

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

  // Handle PDF export
  const handleExport = () => {
    // In a real app, you would implement PDF export here
    toast.error("PDF export not available yet");
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

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="icon"
                    className="bg-yellow-400 text-black hover:bg-yellow-500 h-9 w-9"
                    onClick={handleExport}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <title>Export PDF icon</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export PDF</p>
                </TooltipContent>
              </Tooltip>
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
}
