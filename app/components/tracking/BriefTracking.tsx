"use client";

import { useEffect } from "react";
import { trackEvent } from "@/app/utils/analytics";

// Track when a shared brief is viewed
export function TrackSharedBriefView({ briefId }: { briefId: string }) {
  useEffect(() => {
    trackEvent("shared_brief_viewed", {
      description: `Viewed shared brief: ${briefId}`,
      briefId,
    });
  }, [briefId]);

  return null;
}

// Track when a PDF is exported
export function usePdfExportTracking() {
  return (title: string) => {
    trackEvent("brief_exported", {
      description: `Exported brief as PDF: ${title}`,
      format: "pdf",
      title,
    });
  };
}

// Track when a brief is saved
export function useSaveBriefTracking() {
  return (briefId: string, title: string) => {
    trackEvent("brief_saved", {
      description: `Saved brief to database: ${title}`,
      briefId,
      title,
    });
  };
}

// Track when a brief is created
export function useCreatedBriefTracking() {
  return (templateId: string, title: string) => {
    trackEvent("brief_created", {
      description: `Created new brief: ${title}`,
      templateId,
      title,
    });
  };
}
