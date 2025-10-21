
"use client";

import { cn } from "@/lib/utils";
import React, {
  forwardRef,
  useRef,
  useEffect,
  FC,
  ReactNode,
  MutableRefObject,
} from "react";

interface AnimatedBeamProps {
  className?: string;
  containerRef: MutableRefObject<HTMLElement | null>;
  fromRef: MutableRefObject<HTMLElement | null>;
  toRef: MutableRefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
}

export const AnimatedBeam: FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
  delay = 0,
  duration = 1,
}) => {
  const id = Math.random().toString(36).substring(7);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current && pathRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const fromRect = fromRef.current.getBoundingClientRect();
        const toRect = toRef.current.getBoundingClientRect();

        const startX = fromRect.left - containerRect.left + fromRect.width / 2;
        const startY = fromRect.top - containerRect.top + fromRect.height / 2;
        const endX = toRect.left - containerRect.left + toRect.width / 2;
        const endY = toRect.top - containerRect.top + toRect.height / 2;

        const controlX = (startX + endX) / 2 - (endY - startY) * curvature;
        const controlY = (startY + endY) / 2 + (endX - startX) * curvature;

        pathRef.current.setAttribute(
          "d",
          `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`
        );
      }
    };

    updatePath();
    window.addEventListener("resize", updatePath);

    return () => {
      window.removeEventListener("resize", updatePath);
    };
  }, [containerRef, fromRef, toRef, curvature]);

  return (
    <svg
      fill="none"
      width="100%"
      height="100%"
      className={cn(
        "pointer-events-none absolute left-0 top-0 transform-gpu stroke-2",
        className
      )}
    >
      <path
        ref={pathRef}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      <path
        d="M0 0" // This will be updated by the useEffect
        stroke={`url(#${id})`}
        strokeWidth={pathWidth}
        strokeLinecap="round"
        style={{
          animation: `beam ${duration}s ease-in-out ${delay}s infinite ${
            reverse ? "reverse" : "normal"
          }`,
        }}
      >
        <style>
          {`
            @keyframes beam {
              from { stroke-dashoffset: 50; }
              to { stroke-dashoffset: 0; }
            }
          `}
        </style>
      </path>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse">
          <stop stopColor={gradientStartColor} />
          <stop offset="1" stopColor={gradientStopColor} />
        </linearGradient>
      </defs>
    </svg>
  );
};
