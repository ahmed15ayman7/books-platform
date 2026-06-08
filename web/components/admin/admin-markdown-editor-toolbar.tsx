"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Maximize2,
  Minimize2,
  Redo2,
  Undo2,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MarkdownEditorFeatures } from "@/components/admin/admin-markdown-editor-types";

interface AdminMarkdownEditorToolbarProps {
  editor: Editor | null;
  features: Required<MarkdownEditorFeatures>;
  disabled?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md border text-[var(--admin-text-muted)] transition-colors",
        "border-transparent hover:border-[var(--admin-border)] hover:bg-[var(--admin-surface)] hover:text-[var(--admin-text)]",
        "disabled:cursor-not-allowed disabled:opacity-40",
        active && "border-[var(--brand-red)] bg-[var(--admin-accent-soft)] text-[var(--brand-red)]",
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-0.5 h-6 w-px bg-[var(--admin-border)]" aria-hidden="true" />;
}

export function AdminMarkdownEditorToolbar({
  editor,
  features,
  disabled,
  isFullscreen = false,
  onToggleFullscreen,
}: AdminMarkdownEditorToolbarProps) {
  if (!editor) return null;

  const isDisabled = disabled || !editor.isEditable;

  function setHeading(level: 0 | 1 | 2 | 3) {
    if (level === 0) {
      editor?.chain().focus().setParagraph().run();
      return;
    }
    editor?.chain().focus().toggleHeading({ level }).run();
  }

  function insertLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("أدخل الرابط:", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function insertImage() {
    if (!editor) return;
    const url = window.prompt("أدخل رابط الصورة:", "https://");
    if (!url?.trim()) return;
    editor.chain().focus().setImage({ src: url.trim(), alt: "صورة" }).run();
  }

  const headingValue = (() => {
    for (const level of [1, 2, 3] as const) {
      if (editor.isActive("heading", { level })) return String(level);
    }
    return "0";
  })();

  return (
    <div
      className="sticky top-0 z-10 flex shrink-0 flex-wrap items-center gap-1 border-b border-[var(--admin-border)] bg-[var(--admin-surface-muted)] px-2 py-1.5"
      role="toolbar"
      aria-label="أدوات التنسيق"
    >
      <ToolbarButton
        label="تراجع"
        disabled={isDisabled || !editor.can().chain().focus().undo().run()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="إعادة"
        disabled={isDisabled || !editor.can().chain().focus().redo().run()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>

      {features.headings && (
        <>
          <ToolbarDivider />
          <select
            value={headingValue}
            disabled={isDisabled}
            onChange={(e) => setHeading(Number(e.target.value) as 0 | 1 | 2 | 3)}
            className="h-8 rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface)] px-2 text-xs text-[var(--admin-text-muted)] outline-none focus:border-[var(--brand-red)]"
            aria-label="نوع العنوان"
          >
            <option value="0">فقرة</option>
            <option value="1">عنوان 1</option>
            <option value="2">عنوان 2</option>
            <option value="3">عنوان 3</option>
          </select>
        </>
      )}

      {(features.bold || features.italic) && <ToolbarDivider />}

      {features.bold && (
        <ToolbarButton
          label="عريض"
          active={editor.isActive("bold")}
          disabled={isDisabled || !editor.can().chain().focus().toggleBold().run()}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
      )}

      {features.italic && (
        <ToolbarButton
          label="مائل"
          active={editor.isActive("italic")}
          disabled={isDisabled || !editor.can().chain().focus().toggleItalic().run()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
      )}

      {(features.bulletList || features.orderedList) && <ToolbarDivider />}

      {features.bulletList && (
        <ToolbarButton
          label="قائمة نقطية"
          active={editor.isActive("bulletList")}
          disabled={isDisabled || !editor.can().chain().focus().toggleBulletList().run()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
      )}

      {features.orderedList && (
        <ToolbarButton
          label="قائمة مرقمة"
          active={editor.isActive("orderedList")}
          disabled={isDisabled || !editor.can().chain().focus().toggleOrderedList().run()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
      )}

      {(features.link || features.image) && <ToolbarDivider />}

      {features.link && (
        <ToolbarButton
          label="رابط"
          active={editor.isActive("link")}
          disabled={isDisabled}
          onClick={insertLink}
        >
          <Link2 className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
      )}

      {features.image && (
        <ToolbarButton label="صورة" disabled={isDisabled} onClick={insertImage}>
          <ImageIcon className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
      )}

      {onToggleFullscreen && (
        <>
          <div className="ms-auto" aria-hidden="true" />
          <ToolbarDivider />
          <ToolbarButton
            label={isFullscreen ? "الخروج من ملء الشاشة" : "ملء الشاشة"}
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
            )}
          </ToolbarButton>
        </>
      )}
    </div>
  );
}
