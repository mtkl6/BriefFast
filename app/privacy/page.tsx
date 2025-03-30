import * as React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Privacy Policy | Brieffast`,
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
            <span className="text-xl font-bold">BriefFa.st</span>
          </div>
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

      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 mb-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-8">
            Privacy Policy for Brieffast
          </h1>

          <div className="text-zinc-300 space-y-4 whitespace-pre-wrap">
            {`Last Updated: March 22, 2025

1. Introduction
Welcome to Brieffast (https://brieffa.st). We are committed to protecting your privacy and ensuring the security of your personal information.

2. Information We Collect
	•	Non-Personal Data: We use cookies and similar technologies to improve your experience and analyze website usage.

3. Use of Information
We use your information for the following purposes:
	•	Providing and facilitating our services, including creating brieffing documents.
	•	Improving our website and user experience.
	•	Ensuring the security of our services.
	•	Communicating with you about updates or changes to our services.

4. Data Security
We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.

5. Data Sharing
We do not share your personal information with third parties, except as necessary to provide our services or when required by law.

6. Children's Privacy
Our services are not intended for children, and we do not knowingly collect personal information from anyone under the age of 13.

7. Updates to This Policy
We may update this Privacy Policy from time to time. If we make significant changes, we will notify you via email, if requested.

8. Contact Us
If you have any questions or concerns about this Privacy Policy, please contact us at:
moritz@devmtkl.com

  Thank you for trusting Brieffast with your information.

This policy is effective as of March 22, 2025`}
          </div>
        </div>
      </main>

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
