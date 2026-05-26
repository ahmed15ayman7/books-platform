import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-[var(--motion-base)] hover:scale-105",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--brand-red)] text-white",
        new: "border-transparent bg-[var(--brand-red)] text-white",
        translated: "border-transparent bg-[var(--success)] text-white",
        nominated: "border-transparent bg-[var(--warning)] text-white",
        "not-translated": "border-transparent bg-[var(--brand-gray-400)] text-white",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-[var(--brand-red)] text-[var(--brand-red)] bg-transparent",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        sponsored: "border-transparent bg-[var(--brand-black)] text-[var(--brand-red)]",
        category: "border border-[var(--brand-gray-200)] bg-white text-[var(--brand-gray-700)] hover:border-[var(--brand-red)] hover:text-[var(--brand-red)] cursor-pointer",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
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
