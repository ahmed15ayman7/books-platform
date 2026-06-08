export type MarkdownEditorFeatures = {
  headings?: boolean;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  bulletList?: boolean;
  orderedList?: boolean;
  link?: boolean;
  image?: boolean;
};

export const DEFAULT_MARKDOWN_EDITOR_FEATURES: Required<MarkdownEditorFeatures> = {
  headings: true,
  bold: true,
  italic: true,
  underline: false,
  bulletList: true,
  orderedList: true,
  link: true,
  image: false,
};

export function resolveMarkdownEditorFeatures(
  features?: MarkdownEditorFeatures | boolean,
): Required<MarkdownEditorFeatures> {
  if (features === true) {
    return { ...DEFAULT_MARKDOWN_EDITOR_FEATURES };
  }
  if (!features) {
    return { ...DEFAULT_MARKDOWN_EDITOR_FEATURES };
  }
  return { ...DEFAULT_MARKDOWN_EDITOR_FEATURES, ...features };
}

export interface AdminMarkdownEditorProps {
  id?: string;
  value: string;
  onChange: (markdown: string) => void;
  dir: "rtl" | "ltr";
  placeholder?: string;
  minHeight?: number;
  disabled?: boolean;
  features?: MarkdownEditorFeatures | boolean;
  className?: string;
}
