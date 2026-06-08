"use client";

import { EntityShareDialog } from "@/components/share/entity-share-dialog";
import type { EntitySharePayload } from "@/lib/share/entity-share";

interface EntityShareButtonProps extends EntitySharePayload {
  ariaLabel: string;
  className?: string;
}

export function EntityShareButton({
  title,
  publicUrl,
  imageUrl,
  ariaLabel,
  className,
}: EntityShareButtonProps) {
  return (
    <EntityShareDialog
      title={title}
      publicUrl={publicUrl}
      imageUrl={imageUrl}
      triggerLabel={ariaLabel}
      dialogTitle={ariaLabel}
      variant="public"
      size="icon"
      showLabel={false}
      className={className}
    />
  );
}
