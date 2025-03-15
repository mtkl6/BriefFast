import { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: "BriefFast - Create Your Brief",
  description: "Generate detailed project briefings quickly and easily",
};

export default function BriefGenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-900 text-white">
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-yellow-400 mr-2">⚡</span>
            <span className="text-xl font-bold">BriefFa.st</span>
          </Link>
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

      <main className="flex-grow">{children}</main>

      <footer className="border-t border-zinc-800 py-6">
        <div className="container mx-auto px-6 text-center text-zinc-500 text-sm">
          © {new Date().getFullYear()} BriefFa.st — Create detailed project
          briefings in minutes.
        </div>
      </footer>
    </div>
  );
}
