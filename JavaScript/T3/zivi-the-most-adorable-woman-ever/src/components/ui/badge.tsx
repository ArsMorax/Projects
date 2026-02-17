"use client";

import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "~/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-neutral-900 text-white dark:bg-white dark:text-neutral-900",
				secondary:
					"border-transparent bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100",
				destructive:
					"border-transparent bg-red-600 text-white",
				outline: "text-neutral-700 dark:text-neutral-300",
				success:
					"border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge, badgeVariants };
