import Link from "next/link";
import Footer from "@/components/Footer";

export default function Changelog() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-900 text-white">
      <header className="border-b border-zinc-800">
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

      <main className="flex-grow py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Changelog</h1>

            <div className="space-y-12">
              <div className="border-l-2 border-yellow-400 pl-6 space-y-6">
                <div className="relative" id="changelog-2025-04-05">
                  <div className="absolute -left-[49px] bg-zinc-900 p-2 rounded-full border-4 border-zinc-900">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400 text-black font-bold">
                      1.0
                    </div>
                  </div>

                  <div className="mb-2">
                    <h2 className="text-xl font-bold mb-1">Initial Release</h2>
                    <p className="text-zinc-400 text-sm">April 5, 2025</p>
                  </div>

                  <div className="text-zinc-300 space-y-3">
                    <p>
                      We&apos;re excited to launch BriefFast, a tool designed to
                      simplify the creation of project briefs for tech
                      professionals.
                    </p>

                    <h3 className="text-lg font-semibold mt-4">Features:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        Six specialized brief templates for different project
                        types
                      </li>
                      <li>Step-by-step guided questionnaires</li>
                      <li>Export to PDF, Markdown, or shareable link</li>
                      <li>Custom editing of generated briefs</li>
                      <li>Mobile-responsive design</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-l-2 border-zinc-700 pl-6 space-y-6">
                <div className="relative" id="changelog-roadmap">
                  <div className="absolute -left-[49px] bg-zinc-900 p-2 rounded-full border-4 border-zinc-900">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-700 text-zinc-300 font-bold">
                      →
                    </div>
                  </div>

                  <div className="mb-2">
                    <h2 className="text-xl font-bold mb-1">Roadmap</h2>
                    <p className="text-zinc-400 text-sm">Coming soon</p>
                  </div>

                  <div className="text-zinc-300 space-y-3">
                    <p>Features we&apos;re working on for future releases:</p>

                    <ul className="list-disc pl-6 space-y-1">
                      <li>User accounts and brief management</li>
                      <li>Collaboration features for team feedback</li>
                      <li>More specialized templates</li>
                      <li>AI-assisted brief generation</li>
                      <li>Integration with project management tools</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
