import Link from "next/link";
import { TemplateGrid } from "@/components/TemplateGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-900 text-white">
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-6 h-6 mr-2">
              <div className="w-full h-full bg-[#FFF95B] rounded-md flex items-center justify-center">
                <div className="w-[85%] h-[85%] flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-full h-full fill-[#E9E3E3] stroke-[#141414] stroke-[1px]"
                    role="img"
                  >
                    <title>Document icon</title>
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="m9 15 2 2 4-4" />
                  </svg>
                </div>
              </div>
            </div>
            <span className="text-xl font-bold">BriefFast</span>
          </div>
          <nav className="flex gap-6">
            <Link
              href="/briefgen"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Templates
            </Link>
            <Link
              href="/changelog"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Changelog
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Create project briefs in minutes, not hours
            </h1>
            <p className="text-xl text-zinc-400 mb-8">
              BriefFast helps tech professionals and creative teams create
              detailed project briefs with guided templates.
            </p>
            <Link
              href="/briefgen"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-6 rounded-lg transition-colors inline-flex items-center"
            >
              <span className="mr-2">⚡</span> Get Started
            </Link>
          </div>

          <TemplateGrid />
        </div>
      </main>

      <Footer />
    </div>
  );
}
