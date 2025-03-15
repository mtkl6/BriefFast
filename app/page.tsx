import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-900 text-white">
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-yellow-400 mr-2">⚡</span>
            <span className="text-xl font-bold">BriefFa.st</span>
          </div>
          <nav className="flex gap-6">
            <Link
              href="/briefgen"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Templates
            </Link>
            <Link
              href="#"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="bg-zinc-800 rounded-full px-3 py-1 text-sm text-zinc-400 flex items-center">
                <span className="mr-2">Product of the day</span>
                <span className="text-yellow-400 font-semibold">2nd</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Create your brief <br />
              in <span className="text-white">days</span>,{" "}
              <span className="bg-zinc-800 px-3 py-1">not weeks</span>
            </h1>

            <p className="text-lg text-zinc-400 mb-8 max-w-2xl">
              The BriefFa.st boilerplate with all you need to build your project
              brief. Generate structured, detailed project briefings in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/briefgen"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-8 rounded-lg transition-colors text-lg inline-flex items-center justify-center"
              >
                <span className="mr-2">⚡</span> Get BriefFa.st
              </Link>
              <div className="text-zinc-500 text-sm flex items-center sm:ml-4">
                Free for personal use
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center text-xs"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="ml-4 flex items-center">
                <span className="text-yellow-400">★★★★★</span>
                <span className="ml-2 text-zinc-400">
                  <span className="font-semibold">500+</span> users create
                  briefs faster
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800 py-6">
        <div className="container mx-auto px-6 text-center text-zinc-500 text-sm">
          © {new Date().getFullYear()} BriefFa.st
        </div>
      </footer>
    </div>
  );
}
