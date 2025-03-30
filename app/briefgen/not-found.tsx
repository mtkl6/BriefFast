import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">Coming Soon!</h1>
        <p className="text-zinc-400 mb-8">
          This template will be available in future versions. Currently, this is
          a demo version focusing on web development projects. Check out our web
          development template to see BriefFast in action!
        </p>
        <Button
          variant="default"
          className="bg-yellow-400 hover:bg-yellow-500 text-black"
          asChild
        >
          <Link href="/briefgen" className="inline-flex items-center">
            <span className="mr-2">⚡</span> Try Web Development Template
          </Link>
        </Button>
      </div>
    </div>
  );
}
