import { templates, type Template } from "@/lib/data/templates";

// Define the sitemap entry type since MetadataRoute isn't available from next
type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
};

// Base URL of the website
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://brieffast.com";

// Static pages in the app
const staticPages = [
  "", // home
  "/briefgen", // templates listing
  "/changelog",
  "/privacy",
  "/tos",
];

export default function sitemap(): Array<SitemapEntry> {
  // Get all template IDs for dynamic routes
  const templateIds = templates.map((template: Template) => template.id);

  return [
    // Static pages
    ...staticPages.map((page: string) => ({
      url: new URL(page, baseUrl).href,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: page === "" ? 1.0 : 0.8,
    })),

    // Template detail pages
    ...templateIds.map((templateId: string) => ({
      url: new URL(`/briefgen/${templateId}`, baseUrl).href,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    // Template creation pages
    ...templateIds.map((templateId: string) => ({
      url: new URL(`/briefgen/${templateId}/create`, baseUrl).href,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
