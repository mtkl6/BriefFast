import * as React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Terms and Conditions | Doslint`,
  alternates: {
    canonical: "/tos",
  },
};

export default function TOS(): React.ReactElement {
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
            Terms and Conditions for Brieffast
          </h1>

          <div className="text-zinc-300 space-y-4 whitespace-pre-wrap">
            {`Last Updated: March 22, 2025

1.	Acceptance of Terms
By accessing or using Brieffast (https://brieffa.st), you agree to be bound by these Terms & Services and our Privacy Policy.
	2.	Description of Service
Brieffast is a free platform that allows their users to create a brieffing document by answering a few questions in their templates.
	3.	Data Collection and Privacy
We collect non-personal information (cookies) as described in our Privacy Policy. By using Brieffast, you also agree to the practices described in our Privacy Policy.
	5.	User Conduct
	•	You agree not to use the service for any unlawful purpose or in any way that disrupts the service.
	•	You must respect the intellectual property rights of others.
	6.	Payments, Fees & Content Ownership
	•	Brieffast is free to use.
	7.	Intellectual Property
All content, logos, and trademarks on Brieffast are the property of their respective owners. You may not use, reproduce, or distribute any material from Brieffast without express written permission.
	8.	Disclaimer of Warranties
Brieffast is provided "as is" without warranties of any kind. We do not guarantee the accuracy, reliability, or availability of the service or any user-generated content.
	9.	Limitation of Liability
To the fullest extent permitted by law, Brieffast, its owners, and its affiliates shall not be liable for any damages arising from your use of the service or your interactions with experts.
	10.	Governing Law
These Terms & Services are governed by the laws of Germany without regard to its conflict of laws principles.
	11.	Changes to These Terms
We may update these Terms & Services from time to time. If we make significant changes, we will notify you by email, if requested.
	12.	Contact Us
If you have any questions or concerns about these Terms & Services, please contact us at:
moritz@devmtkl.com

Thank you for using Brieffast.

This agreement was last modified on March 22, 2025.`}
            <div className="pt-4">
              <Link
                href="/tos/impressum"
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
              >
                <strong>German Imprint</strong>
              </Link>
            </div>
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
