# BriefFast Analytics Implementation

This document outlines the analytics implementation for tracking user behavior in BriefFast.

## Tracked Events

The following events are tracked:

1. **brief_created** - When a user completes the questionnaire and generates a brief
2. **brief_exported** - When a user exports a brief as PDF
3. **brief_saved** - When a user saves a brief to the database (creates a shareable link)
4. **shared_brief_viewed** - When someone views a shared brief link
5. **creation_abandoned** - When a user exits during the brief creation process

## Implementation Details

- All tracking is implemented client-side using the `window.datafast` function
- The tracking utility is defined in `app/utils/analytics.ts`
- Type definitions are added in `types/index.d.ts`

## Components

- `app/components/tracking/BriefTracking.tsx` - Contains tracking hooks and components
- `app/components/tracking/CreationExitTracking.tsx` - Tracks when users abandon the creation process

## How to Use

To track a new event:

```typescript
import { trackEvent } from "@/utils/analytics";

trackEvent("event_name", {
  description: "Description of the event",
  // Additional properties
});
```

## Future Improvements

- Add more granular tracking for specific user actions
- Implement more robust abandonment tracking with session data
- Add conversion tracking for premium features
