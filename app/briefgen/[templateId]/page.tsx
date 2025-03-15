import { notFound } from "next/navigation";
import Link from "next/link";
import { getTemplateById } from "@/lib/data/templates";
import { MovingBorderButton } from "@/components/ui/moving-border-button";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: { templateId: string };
}) {
  // In a real app, you might fetch this data from an API or database
  const params_awaited = await params;
  const templateId = params_awaited.templateId;
  const template = getTemplateById(templateId);

  if (!template) {
    return {
      title: "Template Not Found - BriefFast",
    };
  }

  return {
    title: `${template.title} Brief - BriefFast`,
    description:
      template.description ||
      `Create a detailed ${template.title} brief quickly and easily`,
  };
}

export default async function TemplatePage({
  params,
}: {
  params: { templateId: string };
}) {
  // In a real app, you might fetch this data from an API or database
  const params_awaited = await params;
  const templateId = params_awaited.templateId;
  const template = getTemplateById(templateId);

  if (!template) {
    notFound();
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
          <Link href="/briefgen" className="inline-flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Templates
          </Link>
        </Button>

        <div className="flex items-center mb-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-800 text-yellow-400 mr-4">
            {template.icon}
          </div>
          <h1 className="text-3xl font-bold text-white">
            {template.title} Brief
          </h1>
        </div>

        <div className="bg-zinc-800 p-6 rounded-lg mb-8 border border-zinc-700">
          <h2 className="text-xl font-semibold mb-2 text-white">
            About this template
          </h2>
          <p className="text-zinc-300 mb-4">{template.description}</p>
          <p className="font-medium">
            <span className="text-yellow-400">Best if you: </span>
            <span className="text-zinc-300">{template.bestFor}</span>
          </p>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">
            What you&apos;ll need to prepare
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-400 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-zinc-300">
                Basic project information (name, timeline, budget)
              </span>
            </li>
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-400 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-zinc-300">
                Clear understanding of your project goals and objectives
              </span>
            </li>
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-400 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-zinc-300">
                Any specific requirements or constraints for your project
              </span>
            </li>
          </ul>
        </div>

        <div className="flex justify-center">
          <MovingBorderButton
            href={`/briefgen/${template.id}/create`}
            borderRadius="0.5rem"
            className="text-black font-medium"
            containerClassName="w-auto"
          >
            <span className="mr-2">⚡</span> Start Creating Your Brief
          </MovingBorderButton>
        </div>
      </div>
    </div>
  );
}
