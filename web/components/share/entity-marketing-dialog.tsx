"use client";

import { Megaphone } from "lucide-react";
import { EntityShareDialog } from "@/components/share/entity-share-dialog";

interface EntityMarketingDialogProps {
  entityType: "book" | "article";
  title: string;
  publicUrl: string;
  imageUrl?: string | null;
}

const DIALOG_TITLES = {
  book: "تسويق الكتاب",
  article: "تسويق المقال",
} as const;

export function EntityMarketingDialog({
  entityType,
  title,
  publicUrl,
  imageUrl,
}: EntityMarketingDialogProps) {
  return (
    <EntityShareDialog
      title={title}
      publicUrl={publicUrl}
      imageUrl={imageUrl}
      dialogTitle={DIALOG_TITLES[entityType]}
      triggerLabel="تسويق"
      triggerIcon={Megaphone}
      variant="admin"
    />
  );
}
