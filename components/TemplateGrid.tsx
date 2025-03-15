"use client";

import { useState } from "react";
import Link from "next/link";
import { templates, Template } from "@/lib/data/templates";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TemplateGrid() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template: Template) => (
        <Link
          key={template.id}
          href={`/briefgen/${template.id}`}
          className="block"
          onMouseEnter={() => setHoveredId(template.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <Card
            className={`h-full transition-all duration-300 ease-in-out bg-zinc-800 border-zinc-700 ${
              hoveredId === template.id
                ? "border-yellow-400 shadow-lg shadow-yellow-400/10 transform translate-y-[-4px]"
                : "hover:border-zinc-600 shadow-sm"
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-700 text-yellow-400 mr-3 transition-colors duration-300">
                  {template.icon}
                </div>
                <CardTitle className="text-xl text-white">
                  {template.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400">
                <span className="font-medium text-zinc-300">Best if you: </span>
                {template.bestFor}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-2">
              <span className="text-sm text-zinc-500">
                {template.questionCount} questions
              </span>
              <span
                className={`text-yellow-400 font-medium transition-transform duration-300 ${
                  hoveredId === template.id ? "transform translate-x-1" : ""
                }`}
              >
                Select →
              </span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
