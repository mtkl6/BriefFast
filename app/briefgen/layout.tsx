import type { ReactNode } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "BriefFast - Create Your Brief",
  description: "Generate detailed project briefings quickly and easily",
};

export default function BriefGenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-900 text-white">
      <header className="bg-zinc-800 border-b border-zinc-700 py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-yellow-400">
            BriefFast
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/briefgen"
              className="text-zinc-300 hover:text-yellow-400 transition-colors"
            >
              Templates
            </Link>
            <Link
              href="/changelog"
              className="text-zinc-300 hover:text-yellow-400 transition-colors"
            >
              Changelog
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <Footer />
    </div>
  );
}
