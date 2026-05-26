import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--brand-gray-200)] dark:bg-[var(--brand-gray-800)]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
