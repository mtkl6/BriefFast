"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import ThemeSelector from "./ThemeSelector";
import { pdfThemes, hexToRgb } from "@/lib/pdf-themes";
import type { PdfTheme } from "@/lib/pdf-themes";

interface PdfExportWithTooltipProps {
  markdown: string;
  title: string;
}

export default function PdfExportWithTooltip({
  markdown,
  title,
}: PdfExportWithTooltipProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Detect system dark mode preference
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    setIsDarkMode(darkModeMediaQuery.matches);
    // Set default theme based on system preference
    setSelectedTheme(darkModeMediaQuery.matches ? "dark" : "light");

    const handler = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      setSelectedTheme(e.matches ? "dark" : "light");
    };

    darkModeMediaQuery.addEventListener("change", handler);
    return () => darkModeMediaQuery.removeEventListener("change", handler);
  }, []);

  const handleThemeChange = (themeName: string) => {
    setSelectedTheme(themeName);
  };

  const handleExport = () => {
    // Always show the theme selection dialog
    setIsDialogOpen(true);
  };

  // Find the selected theme object
  const getSelectedThemeObject = (): PdfTheme => {
    return (
      pdfThemes.find((theme) => theme.name === selectedTheme) || pdfThemes[0]
    );
  };

  const exportToPdf = async () => {
    if (isExporting) return;

    setIsExporting(true);
    setIsDialogOpen(false);
    toast.info("Preparing your PDF...");

    try {
      // Initialize PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Get the selected theme
      const theme = getSelectedThemeObject();

      // Helper function to apply theme to current page
      const applyThemeToPage = () => {
        // Set background color if it's not white
        if (theme.background !== "#ffffff") {
          const [bgR, bgG, bgB] = hexToRgb(theme.background);
          doc.setFillColor(bgR, bgG, bgB);
          doc.rect(
            0,
            0,
            doc.internal.pageSize.width,
            doc.internal.pageSize.height,
            "F"
          );
        }

        // Set text color based on theme
        const [textR, textG, textB] = hexToRgb(theme.text);
        doc.setTextColor(textR, textG, textB);
      };

      // Apply theme to first page
      applyThemeToPage();

      // Load the Brieffast icon
      const img = new Image();
      img.src = "/icon (1).png";

      // Wait for the image to load
      await new Promise((resolve) => {
        img.onload = resolve;
        // If image fails to load, don't block the rest of the PDF generation
        img.onerror = resolve;
      });

      // Document margins
      const leftMargin = 20;
      const rightMargin = 20;
      const bottomMargin = 35; // Increased to avoid text sticking to bottom
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const contentWidth = pageWidth - (leftMargin + rightMargin);

      // Start with page 1
      let currentPage = 1;

      // Function to add header with icon and page number
      const addHeaderAndFooter = (initialYPos = 20) => {
        let posY = initialYPos;
        // Try to add the icon if it loaded successfully
        try {
          if (img.complete && img.naturalHeight !== 0) {
            // Calculate appropriate size for the icon (10mm height)
            const iconHeight = 10;
            const aspectRatio = img.width / img.height;
            const iconWidth = iconHeight * aspectRatio;

            // Add the icon to the top left
            doc.addImage(
              img,
              "PNG",
              leftMargin,
              posY - 8,
              iconWidth,
              iconHeight
            );

            // Add "Created with Brieffast" text next to the icon
            doc.setFontSize(10);
            // Use accent color for header text
            const [accentR, accentG, accentB] = hexToRgb(theme.accent);
            doc.setTextColor(accentR, accentG, accentB);
            doc.text(
              "Created with Brieffast",
              leftMargin + iconWidth + 5,
              posY
            );
          } else {
            // Fallback if image didn't load
            doc.setFontSize(10);
            const [accentR, accentG, accentB] = hexToRgb(theme.accent);
            doc.setTextColor(accentR, accentG, accentB);
            doc.text("Created with Brieffast", leftMargin, posY);
          }
        } catch {
          // Fallback if there was an error adding the image
          doc.setFontSize(10);
          const [accentR, accentG, accentB] = hexToRgb(theme.accent);
          doc.setTextColor(accentR, accentG, accentB);
          doc.text("Created with Brieffast", leftMargin, posY);
        }

        // Add divider line
        doc.setLineWidth(0.5);
        const [borderR, borderG, borderB] = hexToRgb(theme.borders);
        doc.setDrawColor(borderR, borderG, borderB);

        posY += 5;
        doc.line(leftMargin, posY, pageWidth - rightMargin, posY);

        // Add page number at the bottom
        doc.setFontSize(9);
        const [accentR, accentG, accentB] = hexToRgb(theme.accent);
        doc.setTextColor(accentR, accentG, accentB);
        doc.text(`Page ${currentPage}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });

        // Reset text color for content
        const [textR, textG, textB] = hexToRgb(theme.text);
        doc.setTextColor(textR, textG, textB);

        return posY + 15; // Return position after header
      };

      // Function to add a new page with proper theming
      const addThemedPage = () => {
        doc.addPage();
        currentPage++; // Increment page counter

        // Apply theme to new page
        applyThemeToPage();

        return addHeaderAndFooter();
      };

      // Process markdown content
      // Start by cleaning the markdown to remove duplicate title if present
      const cleanedMarkdown = cleanMarkdownContent(markdown);
      const lines = cleanedMarkdown.split("\n");

      // Add header and get starting position
      let yPos = addHeaderAndFooter();

      // Use a more structured approach to render content
      let inHeading = false;
      let currentContent = "";
      let previousLineWasEmpty = false;

      for (const line of lines) {
        // Check if we need a new page - check with more margin to prevent text at very bottom
        if (yPos > pageHeight - bottomMargin - 10) {
          yPos = addThemedPage();
        }

        // Process line based on markdown format
        if (line.startsWith("# ")) {
          // Main title - larger font
          if (currentContent.trim()) {
            // Add accumulated content as a paragraph
            doc.setFontSize(11);
            const textLines = doc.splitTextToSize(
              currentContent.trim(),
              contentWidth
            );
            // Set text color from theme
            const [textR, textG, textB] = hexToRgb(theme.text);
            doc.setTextColor(textR, textG, textB);

            // Use consistent spacing with minimal gaps
            doc.text(textLines, leftMargin, yPos);
            yPos += 4 + textLines.length * 4.5; // Further reduced spacing
            currentContent = "";
          }

          // Set heading color from theme
          const [headingR, headingG, headingB] = hexToRgb(theme.headings);
          doc.setTextColor(headingR, headingG, headingB);

          doc.setFontSize(18);
          doc.setFont("helvetica", "bold");
          doc.text(line.substring(2).trim(), leftMargin, yPos);
          yPos += 12;
          doc.setFont("helvetica", "normal");
          inHeading = true;
        } else if (line.startsWith("## ")) {
          // Section heading
          if (currentContent.trim()) {
            doc.setFontSize(11);
            const [textR, textG, textB] = hexToRgb(theme.text);
            doc.setTextColor(textR, textG, textB);

            const textLines = doc.splitTextToSize(
              currentContent.trim(),
              contentWidth
            );
            doc.text(textLines, leftMargin, yPos);
            yPos += 4 + textLines.length * 4.5;
            currentContent = "";
          }

          // Set heading color from theme
          const [headingR, headingG, headingB] = hexToRgb(theme.headings);
          doc.setTextColor(headingR, headingG, headingB);

          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text(line.substring(3).trim(), leftMargin, yPos);
          yPos += 8;
          doc.setFont("helvetica", "normal");
          inHeading = true;
        } else if (line.startsWith("- ")) {
          // Bullet points
          if (currentContent.trim()) {
            doc.setFontSize(11);
            const textLines = doc.splitTextToSize(
              currentContent.trim(),
              contentWidth
            );
            doc.text(textLines, leftMargin, yPos);
            yPos += 4 + textLines.length * 4.5; // Further reduced spacing
            currentContent = "";
          }

          doc.setFontSize(11);
          const bulletText = `• ${line.substring(2).trim()}`;
          const bulletLines = doc.splitTextToSize(bulletText, contentWidth - 5);
          doc.text(bulletLines, leftMargin + 5, yPos);
          yPos += bulletLines.length * 4.5;
          inHeading = false;
        } else if (line.startsWith("**") && line.endsWith("**")) {
          // Bold text (like field names)
          if (currentContent.trim()) {
            doc.setFontSize(11);
            const textLines = doc.splitTextToSize(
              currentContent.trim(),
              contentWidth
            );
            doc.text(textLines, leftMargin, yPos);
            yPos += 4 + textLines.length * 4.5; // Further reduced spacing
            currentContent = "";
          }

          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          // Strip the ** markers properly
          const boldText = line.substring(2, line.length - 2).trim();
          doc.text(boldText, leftMargin, yPos);
          yPos += 6;
          doc.setFont("helvetica", "normal");
          inHeading = false;
        } else if (line.trim() === "") {
          // Empty line
          if (!previousLineWasEmpty && !inHeading) {
            yPos += 3;
          }

          if (currentContent.trim()) {
            doc.setFontSize(11);
            const textLines = doc.splitTextToSize(
              currentContent.trim(),
              contentWidth
            );
            doc.text(textLines, leftMargin, yPos);
            yPos += 4 + textLines.length * 4.5; // Further reduced spacing
            currentContent = "";
          }

          previousLineWasEmpty = true;
          inHeading = false;
        } else {
          // Regular paragraph text - Now handle inline bold text correctly
          let processedLine = line.trim();

          // Handle inline bold text (patterns like **bold text**)
          processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, "$1");

          // Check if this might cause a new page soon - if so, add a page break before paragraph
          const approximateLines = Math.ceil(processedLine.length / 80); // rough estimate
          if (yPos + approximateLines * 5 > pageHeight - bottomMargin - 10) {
            yPos = addThemedPage();
          }

          if (inHeading) {
            // If right after a heading, start a new paragraph
            currentContent = processedLine;
            inHeading = false;
          } else {
            // Otherwise, accumulate content, adding a space to join the text
            if (currentContent.length > 0) {
              currentContent += ` ${processedLine}`;
            } else {
              currentContent = processedLine;
            }
          }
          previousLineWasEmpty = false;
        }
      }

      // Add any remaining content in buffer
      if (currentContent.trim()) {
        doc.setFontSize(11);
        // Improve text wrapping to avoid gaps and ensure consistent rendering
        const textLines = doc.splitTextToSize(
          currentContent.trim(),
          contentWidth
        );

        // Final check if we need a new page for the last paragraph
        if (yPos + textLines.length * 4.5 > pageHeight - bottomMargin - 10) {
          yPos = addThemedPage();
        }

        const [textR, textG, textB] = hexToRgb(theme.text);
        doc.setTextColor(textR, textG, textB);
        doc.text(textLines, leftMargin, yPos);
        // Don't add footer on top of content
        yPos += textLines.length * 4.5 + 5;
      }

      // Add footer only if there's enough space, otherwise add a new page
      if (yPos > pageHeight - 20) {
        yPos = addThemedPage();
      }

      // Add footer
      const footerPosition = doc.internal.pageSize.height - 10;
      doc.setFontSize(10);
      const [accentR, accentG, accentB] = hexToRgb(theme.accent);
      doc.setTextColor(accentR, accentG, accentB);
      doc.text(
        `Generated on ${new Date().toLocaleDateString()}`,
        leftMargin,
        footerPosition
      );

      // Save the PDF
      const safeTitleForFilename = title
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase();
      doc.save(`${safeTitleForFilename}.pdf`);

      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Helper function to clean the markdown content and remove duplicate titles
  const cleanMarkdownContent = (content: string): string => {
    const lines = content.split("\n");
    const titleContent = lines[0];

    // Check for duplicate titles at the start of the content
    let startIndex = 0;
    let duplicateTitleFound = false;

    // Skip the first line (which is the title)
    for (let i = 1; i < Math.min(5, lines.length); i++) {
      // If we find a line that exactly matches the title after the first line
      if (
        lines[i].trim() === titleContent.trim() &&
        titleContent.startsWith("# ")
      ) {
        duplicateTitleFound = true;
        startIndex = i + 1;
        break;
      }
    }

    // If we found a duplicate title, start from the line after it
    if (duplicateTitleFound) {
      return lines.slice(0, 1).concat(lines.slice(startIndex)).join("\n");
    }

    return content;
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="icon"
              onClick={handleExport}
              disabled={isExporting}
              className="bg-yellow-400 text-black hover:bg-yellow-500 h-9 w-9"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <title>Export PDF icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export to PDF</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Theme Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              PDF Theme Options
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label className="text-white mb-2 block">Select a PDF theme</Label>
            <ThemeSelector
              themes={pdfThemes}
              selectedTheme={selectedTheme}
              onThemeChange={handleThemeChange}
            />

            <p className="text-sm text-zinc-400 mt-2">
              Choose a theme for your exported PDF document.
              {isDarkMode && " Your system is set to dark mode."}
            </p>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={exportToPdf}
              className="bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Export PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
