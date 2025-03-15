"use client";

import React from "react";
import { Button } from "./moving-border";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MovingBorderButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  borderRadius?: string;
  duration?: number;
  onClick?: () => void;
}

export function MovingBorderButton({
  children,
  href,
  className,
  containerClassName,
  borderClassName = "bg-[radial-gradient(#8b5cf6_40%,transparent_60%)]",
  borderRadius = "0.5rem",
  duration = 2000,
  onClick,
}: MovingBorderButtonProps) {
  const buttonProps = {
    className: cn(
      "h-auto w-auto py-3 px-8 text-base font-medium text-black",
      className
    ),
    containerClassName: cn("h-auto w-auto", containerClassName),
    borderClassName,
    borderRadius,
    duration,
    onClick,
  };

  if (href) {
    return (
      <Button as={Link} href={href} {...buttonProps}>
        {children}
      </Button>
    );
  }

  return <Button {...buttonProps}>{children}</Button>;
}
