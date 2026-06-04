import Image from "next/image";
import { cn } from "@/lib/utils";

interface TeamAvatarProps {
  photoUrl: string | null;
  initials?: string;
  name: string;
  size?: "md" | "lg";
  className?: string;
}

export function TeamAvatar({
  photoUrl,
  initials,
  name,
  size = "lg",
  className,
}: TeamAvatarProps) {
  const dimension = size === "lg" ? 128 : 96;

  if (photoUrl) {
    return (
      <div
        className={cn(
          "relative mx-auto overflow-hidden rounded-full ring-2 ring-[var(--brand-red-soft)]",
          size === "lg" ? "h-32 w-32" : "h-24 w-24",
          className,
        )}
      >
        <Image
          src={photoUrl}
          alt={name}
          width={dimension}
          height={dimension}
          className="h-full w-full object-cover"
          sizes={`${dimension}px`}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand-red-soft)] to-[var(--brand-gray-100)] ring-2 ring-[var(--brand-red-soft)]",
        size === "lg" ? "h-32 w-32" : "h-24 w-24",
        className,
      )}
      aria-label={name}
    >
      <span className="text-xl font-bold text-[var(--brand-red)]">
        {initials ?? name.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}
