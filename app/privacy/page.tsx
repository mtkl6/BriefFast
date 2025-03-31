import * as React from "react";
import Link from "next/link";
import type { Metadata } from "next/types";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Brieffast",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPolicy(): React.ReactElement {
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
                  >
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
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
            <div className="prose prose-invert prose-zinc">
              {/* Privacy policy content here */}
              <p>Last updated: November 15, 2023</p>

              <p>
                At BriefFast, we respect your privacy and are committed to
                protecting your personal data. This privacy policy will inform
                you about how we look after your personal data when you visit
                our website and tell you about your privacy rights and how the
                law protects you.
              </p>

              <h2>What data do we collect?</h2>
              <p>BriefFast collects the following data:</p>
              <ul>
                <li>Brief content you create</li>
                <li>Anonymous usage statistics</li>
              </ul>

              <h2>How do we collect your data?</h2>
              <p>
                You directly provide BriefFast with most of the data we collect.
                We collect data and process data when you:
              </p>
              <ul>
                <li>Create and save briefs on our platform</li>
                <li>Use or view our website via your browser&apos;s cookies</li>
              </ul>

              <h2>How will we use your data?</h2>
              <p>BriefFast collects your data so that we can:</p>
              <ul>
                <li>Store and retrieve your briefs</li>
                <li>Improve our service based on anonymous usage patterns</li>
              </ul>

              <h2>How do we store your data?</h2>
              <p>
                BriefFast securely stores your data using industry-standard
                encryption and security practices.
              </p>
              <p>
                BriefFast will keep your brief data until you choose to delete
                it. You can delete your data at any time.
              </p>

              <h2>Contact</h2>
              <p>
                If you have any questions about BriefFast&apos;s privacy policy,
                please contact us at support@brieffast.app.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
