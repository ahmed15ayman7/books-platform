"use client";

import { AuthorFormDialog } from "@/components/admin/author-form-dialog";
import type { EntityOption } from "@/components/admin/admin-entity-combobox";

interface CreateAuthorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName?: string;
  onCreated: (author: EntityOption) => void;
}

/** إنشاء مؤلف سريع من نموذج الكتاب */
export function CreateAuthorDialog({
  open,
  onOpenChange,
  initialName = "",
  onCreated,
}: CreateAuthorDialogProps) {
  return (
    <AuthorFormDialog
      open={open}
      onOpenChange={onOpenChange}
      author={null}
      initialName={initialName}
      createSubmitLabel="إنشاء وتحديد"
      onSaved={(author) => {
        onCreated({
          id: author.id,
          name: author.name,
          nameAr: author.nameAr,
          slug: author.slug,
        });
      }}
    />
  );
}
