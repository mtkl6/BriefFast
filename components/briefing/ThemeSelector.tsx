"use client";

import type { PdfTheme } from "@/lib/pdf-themes";
import { Check } from "lucide-react";
import { useState } from "react";

interface ThemeSelectorProps {
  themes: PdfTheme[];
  selectedTheme: string;
  onThemeChange: (themeName: string) => void;
}

export default function ThemeSelector({
  themes,
  selectedTheme,
  onThemeChange,
}: ThemeSelectorProps) {
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 mb-4">
      {themes.map((theme) => (
        <div
          key={theme.name}
          className={`relative border rounded-lg p-2 cursor-pointer transition-all hover:scale-105 ${
            selectedTheme === theme.name
              ? "border-yellow-400 ring-2 ring-yellow-400"
              : "border-zinc-700"
          }`}
          onClick={() => onThemeChange(theme.name)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onThemeChange(theme.name);
            }
          }}
          role="button"
          tabIndex={0}
          onMouseEnter={() => setHoveredTheme(theme.name)}
          onMouseLeave={() => setHoveredTheme(null)}
        >
          {/* Theme preview/swatch */}
          <div
            className="w-full h-14 rounded mb-2"
            style={{ backgroundColor: theme.background }}
          >
            <div className="flex flex-col h-full p-1">
              <div
                className="h-4 w-1/2 rounded mb-1"
                style={{ backgroundColor: theme.headings }}
              />
              <div
                className="h-2 w-full rounded-sm mb-1"
                style={{ backgroundColor: `${theme.text}66` }} // Adding opacity
              />
              <div
                className="h-2 w-3/4 rounded-sm"
                style={{ backgroundColor: `${theme.text}66` }} // Adding opacity
              />
            </div>
          </div>

          {/* Theme name */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white capitalize">
              {theme.name}
            </span>
            {selectedTheme === theme.name && (
              <Check size={16} className="text-yellow-400" />
            )}
          </div>

          {/* Hover tooltip */}
          {hoveredTheme === theme.name && (
            <div className="absolute -top-10 left-0 right-0 mx-auto bg-zinc-800 text-zinc-200 text-xs p-1 rounded z-10 text-center shadow-md">
              {theme.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
