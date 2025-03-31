import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-6">
      <div className="container mx-auto px-6 text-center">
        <div className="text-zinc-500 text-sm mb-2">
          © {new Date().getFullYear()} BriefFast
        </div>
        <div className="flex justify-center space-x-4 text-xs text-zinc-500 mb-3">
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
        <div className="flex justify-center space-x-4">
          <Link
            href="mailto:moritz@devmtkl.com"
            className="text-yellow-400 hover:text-yellow-500 text-xs transition-colors px-3 py-1 border border-yellow-400 hover:border-yellow-500 rounded-md"
          >
            Support
          </Link>
          <Link
            href="https://insigh.to/b/brieffast"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-400 hover:text-yellow-500 text-xs transition-colors px-3 py-1 border border-yellow-400 hover:border-yellow-500 rounded-md"
          >
            Feedback
          </Link>
        </div>
      </div>
    </footer>
  );
}
