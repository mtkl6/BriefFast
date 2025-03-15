import { TemplateGrid } from "@/components/TemplateGrid";

export const metadata = {
  title: "BriefFast - Select a Template",
  description: "Choose a template to create your project brief",
};

export default function BriefGenPage() {
  return (
    <main className="container mx-auto px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Select a Template
        </h1>
        <p className="text-zinc-400 mb-8">
          Choose the template that best fits your project needs. Each template
          is designed to help you create a comprehensive brief for your specific
          project type.
        </p>

        <TemplateGrid />
      </div>
    </main>
  );
}
