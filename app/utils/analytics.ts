"use client";

type TrackProps = {
  description: string;
  [key: string]: string | number | boolean | null | undefined;
};

export function trackEvent(eventName: string, props: TrackProps): void {
  if (typeof window !== "undefined" && window.datafast) {
    window.datafast(eventName, props);
  }
}
