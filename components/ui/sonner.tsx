"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import type { ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group rounded-xl border border-yellow-400 bg-zinc-900 text-white [&>div>div>svg]:text-yellow-400 [&>div>div>svg]:stroke-yellow-400 [&>div>div>svg]:fill-none",
          title: "text-white font-medium",
          description: "text-zinc-400",
          actionButton: "bg-yellow-400 text-black",
          cancelButton: "bg-zinc-800 text-white",
          closeButton:
            "text-white [&>svg]:text-yellow-400 [&>svg]:stroke-yellow-400 [&>svg]:fill-none",
          success:
            "[&>div>div>svg]:text-yellow-400 [&>div>div>svg]:stroke-yellow-400 [&>div>div>svg]:fill-none",
          error:
            "[&>div>div>svg]:text-yellow-400 [&>div>div>svg]:stroke-yellow-400 [&>div>div>svg]:fill-none",
          warning:
            "[&>div>div>svg]:text-yellow-400 [&>div>div>svg]:stroke-yellow-400 [&>div>div>svg]:fill-none",
          info: "[&>div>div>svg]:text-yellow-400 [&>div>div>svg]:stroke-yellow-400 [&>div>div>svg]:fill-none",
        },
      }}
      style={
        {
          "--normal-bg": "#18181b", // zinc-900
          "--normal-text": "#ffffff", // white
          "--normal-border": "#facc15", // yellow-400
          "--toast-radius": "0.75rem", // rounded-xl
          "--success-color": "#facc15", // yellow-400 instead of green
          "--error-color": "#facc15", // yellow-400 instead of red
          "--info-color": "#facc15", // yellow-400 instead of blue
          "--warning-color": "#facc15", // yellow-400 instead of orange
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
