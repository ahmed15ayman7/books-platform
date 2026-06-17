import { ArticleContent } from "@/lib/markdown/article-content";
import { cn } from "@/lib/utils";

interface BookSummaryMarkdownProps {
  content: string;
  className?: string;
}

/** Renders book descriptions saved from the admin markdown editor. */
export function BookSummaryMarkdown({ content, className }: BookSummaryMarkdownProps) {
  return (
    <ArticleContent
      content={content}
      variant="compact"
      className={cn("book-summary-prose", className)}
    />
  );
}
