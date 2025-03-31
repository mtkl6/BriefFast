"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/app/utils/analytics";

interface CreationExitTrackingProps {
  templateId: string;
  hasStartedCreation: boolean;
  formProgress?: number;
}

export default function CreationExitTracking({
  templateId,
  hasStartedCreation,
  formProgress = 0,
}: CreationExitTrackingProps) {
  const [startTime] = useState(new Date());
  const [hasSaved, setHasSaved] = useState(false);
  const [isNavigatingToPreview, setIsNavigatingToPreview] = useState(false);
  const pathname = usePathname();

  // Track successful completion via route change
  useEffect(() => {
    // Only run this once when component mounts
    const handleBeforeUnload = () => {
      // Only if the user is navigating to the preview page, mark as completed
      const currentPath = window.location.pathname;
      const previewPath = `/briefgen/${templateId}/preview`;

      if (currentPath.includes(previewPath)) {
        setIsNavigatingToPreview(true);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [templateId]);

  // Check if "Generate Brief" was clicked by watching for localStorage changes
  useEffect(() => {
    // Listen for storage events that indicate a successful save
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === `brief_${templateId}_id` ||
        e.key === `brief_${templateId}_final`
      ) {
        setHasSaved(true);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Check if already saved
    if (
      localStorage.getItem(`brief_${templateId}_id`) ||
      localStorage.getItem(`brief_${templateId}_final`)
    ) {
      setHasSaved(true);
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);

      // Only track exit if they started creation but didn't save
      // AND they're not navigating to the preview page
      const isPreviewPath = pathname.includes(
        `/briefgen/${templateId}/preview`
      );

      if (
        hasStartedCreation &&
        !hasSaved &&
        !isNavigatingToPreview &&
        !isPreviewPath
      ) {
        const timeSpentSeconds = Math.floor(
          (new Date().getTime() - startTime.getTime()) / 1000
        );

        trackEvent("creation_abandoned", {
          description: "User exited during brief creation",
          templateId,
          timeSpentSeconds,
          formProgress,
        });
      }
    };
  }, [
    templateId,
    hasStartedCreation,
    hasSaved,
    startTime,
    formProgress,
    pathname,
    isNavigatingToPreview,
  ]);

  return null;
}
