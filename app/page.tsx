import Link from "next/link";

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

      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Create your brief <br />
              in <span className="text-white">days</span>,{" "}
              <span className="bg-zinc-800 px-3 py-1">not weeks</span>
            </h1>

            <p className="text-lg text-zinc-400 mb-8 max-w-2xl">
              The BriefFast boilerplate with all you need to build your project
              brief. Generate structured, detailed project briefings in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/briefgen"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-8 rounded-lg transition-colors text-lg inline-flex items-center justify-center"
              >
                <span className="mr-2">⚡</span> Get Brieffast
              </Link>
              <div className="text-yellow-500 text-sm flex items-center sm:ml-4">
                Brieffast is still a demo
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800 py-6">
        <div className="container mx-auto px-6 text-center">
          <div className="text-zinc-500 text-sm mb-2">
            © {new Date().getFullYear()} Brieffast
          </div>
          <div className="flex justify-center space-x-4 text-xs text-zinc-500">
            <Link href="/tos" className="hover:text-zinc-300 transition-colors">
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="hover:text-zinc-300 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
