/**
 * Custom type definitions for Next.js 15
 */

declare module "next" {
  export type PageProps = {
    params?: Promise<Record<string, string>>;
    searchParams?: Promise<Record<string, string | string[]>>;
  };
}

// Add compatibility with Next.js navigation types
/// <reference types="next/navigation-types/compat/navigation" />
