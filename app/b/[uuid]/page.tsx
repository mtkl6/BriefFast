"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type PageProps = {
  params: Promise<{
    uuid: string;
  }>;
};

export default function SharedBriefPage({ params }: PageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [markdownContent, setMarkdownContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [briefTitle, setBriefTitle] = useState<string>("Shared Brief");

  // Unwrap params Promise with use()
  const unwrappedParams = use(params);
  const uuid = unwrappedParams.uuid;

  // Load brief from database
  useEffect(() => {
    const loadBrief = async () => {
      try {
        // For public URLs, the middleware automatically allows access
        // The referer header will show this is coming from /b/[uuid]
        const response = await fetch(`/api/briefings?uuid=${uuid}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError(
              "Brief not found. The link may be invalid or the brief has been deleted."
            );
          } else {
            setError("Failed to load brief. Please try again later.");
          }
          setIsLoading(false);
          return;
        }

        const data = await response.json();

        // Check if we have the markdown in the database
        if (data.data?.markdown) {
          setMarkdownContent(data.data.markdown);

          // Try to extract title from markdown
          const titleMatch = data.data.markdown.match(/^# (.*)/m);
          if (titleMatch?.length > 1) {
            setBriefTitle(titleMatch[1]);
          } else if (data.category) {
            setBriefTitle(`${data.category} Brief`);
          }
        } else {
          setError("Brief content not found.");
        }
      } catch (error) {
        console.error("Error loading brief:", error);
        setError("An error occurred while loading the brief.");
      }

      setIsLoading(false);
    };

    loadBrief();
  }, [uuid]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-8 mb-8">
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-black animate-pulse"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>Loading icon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-white">
                  Loading shared brief...
                </h2>
                <p className="text-zinc-400">
                  Please wait while we fetch the content
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-8">
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>Error icon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-white">Error</h2>
                <p className="text-zinc-400 mb-6">{error}</p>
                <Button
                  asChild
                  variant="default"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black"
                >
                  <Link href="/">Return to Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Function to generate a unique key for each line based on content and position
  const generateLineKey = (line: string, index: number) => {
    return `line-${index}-${line.substring(0, 10).replace(/\s+/g, "-")}`;
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              size="sm"
              className="text-yellow-400 hover:text-yellow-500 hover:bg-zinc-800"
              asChild
            >
              <Link href="/" className="inline-flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>Home icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Home
              </Link>
            </Button>

            <div className="px-4 py-1 bg-yellow-400 rounded-full text-xs font-semibold text-black">
              BriefFa.st
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl overflow-hidden mb-8">
            <div className="flex items-center px-6 py-5 bg-gradient-to-r from-zinc-800 to-zinc-900 border-b border-zinc-700">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-400 text-black mr-4">
                📄
              </div>
              <h1 className="text-2xl font-bold text-white flex-grow">
                {briefTitle}
              </h1>
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
                  <title>Copy icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </Button>
            </div>

            <div className="p-6 pt-4">
              <div className="markdown prose prose-invert max-w-none">
                {markdownContent.split("\n").map((line, index) => {
                  const key = generateLineKey(line, index);

                  if (line.startsWith("# ")) {
                    return (
                      <h1
                        key={key}
                        className="text-3xl font-bold mt-2 mb-6 text-white"
                      >
                        {line.substring(2)}
                      </h1>
                    );
                  }

                  if (line.startsWith("## ")) {
                    return (
                      <h2
                        key={key}
                        className="text-xl font-bold mt-8 mb-4 text-yellow-400 pb-2 border-b border-zinc-700"
                      >
                        {line.substring(3)}
                      </h2>
                    );
                  }

                  if (line.startsWith("### ")) {
                    return (
                      <h3
                        key={key}
                        className="text-lg font-bold mt-6 mb-3 text-yellow-200"
                      >
                        {line.substring(4)}
                      </h3>
                    );
                  }

                  if (line.startsWith("**") && line.endsWith("**")) {
                    return (
                      <p key={key} className="font-bold my-2 text-zinc-200">
                        {line.substring(2, line.length - 2)}
                      </p>
                    );
                  }

                  if (line.startsWith("- ")) {
                    return (
                      <div key={key} className="flex items-start my-1.5">
                        <span className="text-yellow-400 mr-2 mt-1">•</span>
                        <span className="text-zinc-300">
                          {line.substring(2)}
                        </span>
                      </div>
                    );
                  }

                  if (line.trim() === "") {
                    return <div key={key} className="h-2" />;
                  }

                  return (
                    <p key={key} className="my-2 text-zinc-300">
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="text-center py-4 text-zinc-500 text-sm flex items-center justify-center">
            Created with
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 mx-1 text-yellow-400"
              fill="currentColor"
            >
              <title>Heart icon</title>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <Link href="/" className="text-yellow-400 hover:underline ml-1">
              BriefFa.st
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
