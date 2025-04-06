import Link from "next/link";
import Footer from "@/components/Footer";
import { ChangelogSection } from "@/components/changelog/ChangelogSection";

export default function Changelog() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-900 text-white">
      <header className="border-b border-zinc-800 fixed top-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2">
                <div className="w-full h-full bg-[#FFF95B] rounded-md flex items-center justify-center">
                  <div className="w-[85%] h-[85%] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-full h-full fill-[#E9E3E3] stroke-[#141414] stroke-[1px]"
                      aria-hidden="true"
                    >
                      <title>BriefFast logo</title>
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="m9 15 2 2 4-4" />
                    </svg>
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold">BriefFast</span>
            </div>
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/briefgen"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Templates
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <div className="container max-w-3xl mx-auto pt-32 pb-16 px-4">
          <div className="mb-12 text-balance text-center">
            <h1 className="mb-2 font-bold text-5xl">Changelog</h1>
            <p className="text-lg text-zinc-400">
              Keep track of what&apos;s new at BriefFast
            </p>
          </div>

          <div className="flex justify-center">
            <ChangelogSection
              items={[
                {
                  date: "2025-04-05",
                  changes: [
                    "🚀 Initial Release",
                    "📝 Six specialized brief templates for different project types",
                    "🎯 Step-by-step guided questionnaires",
                    "💾 Export to PDF, Markdown, or shareable link",
                    "✏️ Custom editing of generated briefs",
                    "📱 Mobile-responsive design",
                  ],
                },
                {
                  date: "2025-04-03",
                  changes: [
                    "🔧 Fixed template loading issues on mobile devices",
                    "📄 Resolved PDF export formatting problems",
                    "✅ Improved form validation for required fields",
                    "🌙 Fixed UI inconsistencies in dark mode",
                    "♿️ Enhanced accessibility for screen readers",
                  ],
                },
              ]}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
