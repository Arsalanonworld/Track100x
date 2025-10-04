"use client";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";

interface AnimatedButtonProps extends ButtonProps {
    shimmerClassName?: string;
    children: React.ReactNode;
}

export const AnimatedButton = ({ className, shimmerClassName, children, ...props }: AnimatedButtonProps) => {
    return (
        <Button
            className={cn(
                "group relative overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/40",
                className
            )}
            {...props}
        >
            <span className={cn(
                "absolute inset-[-1000%] animate-[shimmer_4s_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff15_0%,#ffffff30_50%,#ffffff15_100%)]",
                shimmerClassName
            )} />
            <span className="relative z-10 flex items-center">
                {children}
            </span>
        </Button>
    )
}