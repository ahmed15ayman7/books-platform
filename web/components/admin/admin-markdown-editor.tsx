"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import type { AdminMarkdownEditorProps } from "@/components/admin/admin-markdown-editor-types";

function EditorSkeleton({ minHeight = 280 }: { minHeight?: number }) {
  return (
    <div
      className={cn(
        "animate-pulse overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]",
      )}
      style={{ minHeight: minHeight + 44 }}
      aria-hidden="true"
    >
      <div className="h-10 border-b border-[var(--admin-border)] bg-[var(--admin-surface-muted)]" />
      <div className="p-4">
        <div className="mb-2 h-3 w-3/4 rounded bg-[var(--admin-border)]" />
        <div className="mb-2 h-3 w-full rounded bg-[var(--admin-border)]" />
        <div className="h-3 w-5/6 rounded bg-[var(--admin-border)]" />
      </div>
    </div>
  );
}

const AdminMarkdownEditorInner = dynamic(
  () =>
    import("@/components/admin/admin-markdown-editor-inner").then(
      (m) => m.AdminMarkdownEditorInner,
    ),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  },
);

export function AdminMarkdownEditor(props: AdminMarkdownEditorProps) {
  return <AdminMarkdownEditorInner {...props} />;
}

export type { AdminMarkdownEditorProps, MarkdownEditorFeatures } from "@/components/admin/admin-markdown-editor-types";
