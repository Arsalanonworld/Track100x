
"use client";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";
import React from "react";

interface AnimatedButtonProps extends ButtonProps {
    shimmerClassName?: string;
    children: React.ReactNode;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
    ({ className, shimmerClassName, children, ...props }, ref) => {
    return (
        <Button
            {...props}
            className={cn(
                "group relative overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-lg hover:shadow-primary/40",
                className
            )}
            ref={ref}
        >
            <span className={cn(
                "absolute inset-0 [--shimmer-width:100px] [background-image:linear-gradient(100deg,transparent_20%,theme(colors.white/0.1),transparent_80%)] [background-size:1000px_100%] animate-shimmer bg-no-repeat opacity-50 transition-opacity duration-500 group-hover:opacity-100",
                shimmerClassName
            )} />
            <span className="relative z-10 flex items-center">
                {children}
            </span>
        </Button>
    )
});

AnimatedButton.displayName = "AnimatedButton";
