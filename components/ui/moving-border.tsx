"use client";
import React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

// SVGRectElement doesn't have getTotalLength and getPointAtLength by default
// Adding a simple implementation for these methods
const getPathLength = (element: SVGRectElement | null): number => {
  if (!element) return 0;
  const { width, height } = element.getBBox();
  return 2 * (width + height);
};

const getPointAtLength = (
  element: SVGRectElement | null,
  length: number
): { x: number; y: number } => {
  if (!element) return { x: 0, y: 0 };

  const { x, y, width, height } = element.getBBox();
  const perimeter = 2 * (width + height);
  const normalizedLength = length % perimeter;

  // Calculate position along the perimeter
  if (normalizedLength < width) {
    // Top edge: left to right
    return { x: x + normalizedLength, y };
  } else if (normalizedLength < width + height) {
    // Right edge: top to bottom
    return { x: x + width, y: y + (normalizedLength - width) };
  } else if (normalizedLength < 2 * width + height) {
    // Bottom edge: right to left
    return {
      x: x + width - (normalizedLength - width - height),
      y: y + height,
    };
  } else {
    // Left edge: bottom to top
    return { x, y: y + height - (normalizedLength - 2 * width - height) };
  }
};

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <Component
      className={cn(
        "bg-transparent relative text-xl h-16 w-40 p-[1px] overflow-hidden",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 opacity-[0.8] bg-[radial-gradient(#8b5cf6_40%,transparent_60%)]",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative bg-yellow-400 border border-yellow-500 backdrop-blur-xl text-black flex items-center justify-center w-full h-full text-sm antialiased",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 2000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: unknown;
}) => {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = getPathLength(pathRef.current);
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => getPointAtLength(pathRef.current, val).x
  );
  const y = useTransform(
    progress,
    (val) => getPointAtLength(pathRef.current, val).y
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
