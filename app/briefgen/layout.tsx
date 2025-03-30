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
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2">
                <div className="w-full h-full bg-[#FFF95B] rounded-md flex items-center justify-center">
                  <div className="w-[85%] h-[85%] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-full h-full fill-[#E9E3E3] stroke-[#141414] stroke-[1px]"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="m9 15 2 2 4-4" />
                    </svg>
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold">BriefFa.st</span>
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

      <main className="flex-grow">{children}</main>

      <footer className="border-t border-zinc-800 py-6">
        <div className="container mx-auto px-6 text-center">
          <div className="text-zinc-500 text-sm mb-2">
            © {new Date().getFullYear()} BriefFa.st
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
