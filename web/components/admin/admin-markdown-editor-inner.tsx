"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils";
import {
  normalizeInboundMarkdown,
  normalizeOutboundMarkdown,
} from "@/lib/markdown/normalize-inbound-markdown";
import { AdminMarkdownEditorToolbar } from "@/components/admin/admin-markdown-editor-toolbar";
import {
  resolveMarkdownEditorFeatures,
  type AdminMarkdownEditorProps,
} from "@/components/admin/admin-markdown-editor-types";

function getEditorMarkdown(editor: ReturnType<typeof useEditor>): string {
  if (!editor) return "";
  const storage = editor.storage as { markdown?: { getMarkdown: () => string } };
  return storage.markdown?.getMarkdown() ?? "";
}

export function AdminMarkdownEditorInner({
  id,
  value,
  onChange,
  dir,
  placeholder = "اكتب المحتوى هنا…",
  minHeight = 280,
  disabled = false,
  features: featuresProp,
  className,
}: AdminMarkdownEditorProps) {
  const features = useMemo(() => resolveMarkdownEditorFeatures(featuresProp), [featuresProp]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lastEmitted = useRef(value);
  const lastExternal = useRef(value);
  const initialContent = useMemo(() => normalizeInboundMarkdown(value), []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const debouncedOnChange = useDebouncedCallback((md: string) => {
    const normalized = normalizeOutboundMarkdown(md);
    lastEmitted.current = normalized;
    onChange(normalized);
  }, 150);

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      ...(features.image
        ? [
            Image.configure({
              HTMLAttributes: { class: "admin-markdown-editor__image" },
            }),
          ]
        : []),
      Placeholder.configure({ placeholder }),
      Markdown.configure({
        html: false,
        tightLists: true,
        bulletListMarker: "-",
        linkify: false,
        breaks: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    [features.image, placeholder],
  );

  const editor = useEditor({
    extensions,
    content: initialContent,
    editable: !disabled,
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        dir,
        class: cn(
          "admin-markdown-editor__content prose-admin min-h-full px-4 py-3 text-sm leading-relaxed text-[var(--admin-text)] outline-none",
          dir === "rtl" ? "text-right" : "text-left",
        ),
        style: `min-height: ${minHeight}px`,
      },
    },
    onUpdate: ({ editor: ed }) => {
      debouncedOnChange(getEditorMarkdown(ed));
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor) return;
    if (value === lastExternal.current) return;
    lastExternal.current = value;

    if (value === lastEmitted.current) return;

    const normalized = normalizeInboundMarkdown(value);
    const current = normalizeOutboundMarkdown(getEditorMarkdown(editor));
    if (current !== normalizeOutboundMarkdown(normalized)) {
      editor.commands.setContent(normalized, false);
    }
  }, [value, editor]);

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  useEffect(() => {
    if (!isFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  return (
    <div
      className={cn(
        "admin-markdown-editor flex flex-col overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]",
        "focus-within:border-[var(--brand-red)] focus-within:ring-1 focus-within:ring-[var(--brand-red)]",
        isFullscreen && "fixed inset-0 z-[100] m-0 rounded-none border-0",
        disabled && "opacity-60",
        className,
      )}
    >
      <AdminMarkdownEditorToolbar
        editor={editor}
        features={features}
        disabled={disabled}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />
      <div
        className={cn(
          "min-h-0 overflow-y-auto",
          isFullscreen ? "flex-1" : "max-h-[min(70vh,720px)]",
        )}
      >
        <EditorContent editor={editor} />
      </div>
      <style jsx global>{`
        .admin-markdown-editor .ProseMirror p.is-editor-empty:first-child::before {
          color: var(--admin-text-subtle);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .admin-markdown-editor .ProseMirror h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0.75rem 0 0.5rem;
        }
        .admin-markdown-editor .ProseMirror h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--brand-red);
          margin: 0.75rem 0 0.5rem;
        }
        .admin-markdown-editor .ProseMirror h3 {
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0.5rem 0 0.35rem;
        }
        .admin-markdown-editor .ProseMirror ul,
        .admin-markdown-editor .ProseMirror ol {
          margin: 0.5rem 0;
          padding-inline-start: 1.5rem;
        }
        .admin-markdown-editor .ProseMirror li {
          margin: 0.2rem 0;
        }
        .admin-markdown-editor .ProseMirror a {
          color: var(--brand-red);
          text-decoration: underline;
        }
        .admin-markdown-editor .ProseMirror img.admin-markdown-editor__image {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 0.5rem 0;
        }
        .admin-markdown-editor .ProseMirror p {
          margin: 0.35rem 0;
        }
      `}</style>
    </div>
  );
}
