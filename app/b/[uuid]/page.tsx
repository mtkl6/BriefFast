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
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-8 mb-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Loading shared brief...
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-8 mb-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4 text-white">Error</h2>
              <p className="text-zinc-400 mb-6">{error}</p>
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
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
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          className="text-yellow-400 hover:text-yellow-500 hover:bg-zinc-800 mb-6"
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

        <div className="flex items-center mb-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-800 text-yellow-400 mr-4">
            📄
          </div>
          <h1 className="text-3xl font-bold text-white">{briefTitle}</h1>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6 gap-2">
            <h2 className="text-2xl font-bold text-white">Brief Content</h2>
            <Button
              variant="default"
              className="bg-yellow-400 text-black hover:bg-yellow-500 inline-flex items-center"
              onClick={() => {
                navigator.clipboard.writeText(markdownContent);
                toast.success("Markdown copied to clipboard!");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Copy icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              Copy Markdown
            </Button>
          </div>

          <div className="markdown prose prose-invert max-w-none">
            {markdownContent.split("\n").map((line, index) => {
              const key = generateLineKey(line, index);

              if (line.startsWith("# ")) {
                return (
                  <h1 key={key} className="text-3xl font-bold my-6">
                    {line.substring(2)}
                  </h1>
                );
              }

              if (line.startsWith("## ")) {
                return (
                  <h2
                    key={key}
                    className="text-2xl font-bold my-5 text-yellow-400"
                  >
                    {line.substring(3)}
                  </h2>
                );
              }

              if (line.startsWith("### ")) {
                return (
                  <h3 key={key} className="text-xl font-bold my-4">
                    {line.substring(4)}
                  </h3>
                );
              }

              if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <p key={key} className="font-bold my-3">
                    {line.substring(2, line.length - 2)}
                  </p>
                );
              }

              if (line.startsWith("- ")) {
                return (
                  <li key={key} className="ml-4 my-1">
                    {line.substring(2)}
                  </li>
                );
              }

              if (line.trim() === "") {
                return <br key={key} />;
              }

              return (
                <p key={key} className="my-2">
                  {line}
                </p>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-8 text-zinc-500 text-sm">
          Generated with{" "}
          <Link href="/" className="text-yellow-400 hover:underline">
            BriefFa.st
          </Link>
        </div>
      </div>
    </div>
  );
}
