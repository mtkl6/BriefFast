"use client";

import { useEffect, useState } from "react";
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

  // Mark as saved when the user completes the form
  useEffect(() => {
    // Listen for storage events that indicate a successful save
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `brief_${templateId}_id`) {
        setHasSaved(true);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Check if already saved
    if (localStorage.getItem(`brief_${templateId}_id`)) {
      setHasSaved(true);
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);

      // Only track exit if they started creation but didn't save
      if (hasStartedCreation && !hasSaved) {
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
  }, [templateId, hasStartedCreation, hasSaved, startTime, formProgress]);

  return null;
}
