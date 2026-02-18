import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
    }
>(({ className, variant = "default", ...props }, ref) => {
    const variants = {
        default: "bg-neutral-900 text-white",
        secondary: "bg-neutral-100 text-neutral-900",
        destructive: "bg-red-100 text-red-700",
        outline: "border border-neutral-300 text-neutral-700",
        success: "bg-emerald-100 text-emerald-700",
        warning: "bg-amber-100 text-amber-700",
    };

    return (
        <div
            ref={ref}
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
                variants[variant],
                className
            )}
            {...props}
        />
    );
});
Badge.displayName = "Badge";

export { Badge };
