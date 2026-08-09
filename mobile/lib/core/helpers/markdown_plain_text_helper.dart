/// Strips common markdown syntax down to plain, readable text.
///
/// Used anywhere markdown-authored content (book/article descriptions) needs
/// to be shown or spoken without the raw `[text](url)` / `**bold**` syntax
/// leaking through — e.g. truncated previews and TTS.
class MarkdownPlainTextHelper {
  const MarkdownPlainTextHelper._();

  static String strip(String markdown) {
    return markdown
        // Images must be removed entirely — keeping alt text reads "صورة" aloud
        .replaceAll(RegExp(r'!\[[^\]]*\]\([^)]*\)'), '')
        // Keep display text of links, discard URL
        .replaceAllMapped(
            RegExp(r'\[([^\]]*)\]\([^)]*\)'), (m) => m.group(1) ?? '')
        // Bold and italic — unwrap inner text
        .replaceAllMapped(
            RegExp(r'\*\*(.+?)\*\*', dotAll: true), (m) => m.group(1) ?? '')
        .replaceAllMapped(
            RegExp(r'\*(.+?)\*', dotAll: true), (m) => m.group(1) ?? '')
        // Headings, code spans, blockquotes
        .replaceAll(RegExp(r'#{1,6}\s*'), '')
        .replaceAll(RegExp(r'`+'), '')
        .replaceAll(RegExp(r'^>\s*', multiLine: true), '')
        // Trailing whitespace on lines and collapsed blank lines
        .replaceAll(RegExp(r'[ \t]+\n'), '\n')
        .replaceAll(RegExp(r'\n{3,}'), '\n\n')
        .trim();
  }
}
