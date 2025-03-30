import { notFound } from "next/navigation";
import Link from "next/link";
import { getTemplateById } from "@/lib/data/templates";
import { getQuestionnaireByTemplateId } from "@/lib/data/questionnaire";
import { Button } from "@/components/ui/button";
import QuestionnaireForm from "@/components/questionnaire/QuestionnaireForm";

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
    title: `Create ${template.title} Brief - BriefFast`,
    description: `Fill out the questionnaire to create your ${template.title} brief`,
  };
}

export default async function CreateBriefPage({
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

  // Get the questionnaire for this template
  const questionnaire = getQuestionnaireByTemplateId(templateId);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          className="text-yellow-400 hover:text-yellow-500 hover:bg-zinc-800 mb-6"
          asChild
        >
          <Link
            href={`/briefgen/${template.id}`}
            className="inline-flex items-center"
          >
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
            Back to Template Details
          </Link>
        </Button>

        <div className="flex items-center mb-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-800 text-yellow-400 mr-4">
            {template.icon}
          </div>
          <h1 className="text-3xl font-bold text-white">
            Create {template.title} Brief
          </h1>
        </div>

        {questionnaire ? (
          <QuestionnaireForm
            questionnaire={questionnaire}
            templateId={templateId}
          />
        ) : (
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-8 mb-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Questionnaire Coming Soon
              </h2>
              <p className="text-zinc-400 max-w-md mx-auto mb-6">
                We&apos;re currently building the questionnaire for this
                template. Check back soon or try one of our other templates.
              </p>
              <Button
                variant="default"
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
                asChild
              >
                <Link href="/briefgen" className="inline-flex items-center">
                  <span className="mr-2">⚡</span> Browse Other Templates
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
