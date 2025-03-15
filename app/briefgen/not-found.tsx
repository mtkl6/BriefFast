import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Template Not Found
        </h1>
        <p className="text-zinc-400 mb-8">
          Sorry, we couldn&apos;t find the template you were looking for. It may
          have been removed or you might have followed a broken link.
        </p>
        <Button
          variant="default"
          className="bg-yellow-400 hover:bg-yellow-500 text-black"
          asChild
        >
          <Link href="/briefgen" className="inline-flex items-center">
            <span className="mr-2">⚡</span> Browse Available Templates
          </Link>
        </Button>
      </div>
    </div>
  );
}
