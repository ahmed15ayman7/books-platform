/// Splits long text into chunks that fit Android's per-request TTS limit
/// (`TextToSpeech.getMaxSpeechInputLength()`), cutting at sentence
/// boundaries so playback seams fall between sentences, not mid-word.
class TtsTextChunker {
  TtsTextChunker._();

  static final RegExp _sentenceBoundary = RegExp(r'(?<=[.!?؟؛:])\s+');

  static List<String> split(String text, int maxLength) {
    final trimmed = text.trim();
    if (trimmed.isEmpty) return const [];
    if (trimmed.length <= maxLength) return [trimmed];

    final chunks = <String>[];
    final buffer = StringBuffer();

    for (final sentence in _sentences(trimmed)) {
      if (sentence.length > maxLength) {
        _flush(buffer, chunks);
        chunks.addAll(_splitByWords(sentence, maxLength));
        continue;
      }
      if (buffer.length + sentence.length + 1 > maxLength) {
        _flush(buffer, chunks);
      }
      if (buffer.isNotEmpty) buffer.write(' ');
      buffer.write(sentence);
    }
    _flush(buffer, chunks);
    return chunks;
  }

  static Iterable<String> _sentences(String text) sync* {
    for (final paragraph in text.split('\n')) {
      for (final sentence in paragraph.split(_sentenceBoundary)) {
        final trimmed = sentence.trim();
        if (trimmed.isNotEmpty) yield trimmed;
      }
    }
  }

  static List<String> _splitByWords(String sentence, int maxLength) {
    final parts = <String>[];
    final buffer = StringBuffer();

    for (final word in sentence.split(' ')) {
      if (word.length > maxLength) {
        _flush(buffer, parts);
        for (var i = 0; i < word.length; i += maxLength) {
          final end =
              i + maxLength > word.length ? word.length : i + maxLength;
          parts.add(word.substring(i, end));
        }
        continue;
      }
      if (buffer.length + word.length + 1 > maxLength) {
        _flush(buffer, parts);
      }
      if (buffer.isNotEmpty) buffer.write(' ');
      buffer.write(word);
    }
    _flush(buffer, parts);
    return parts;
  }

  static void _flush(StringBuffer buffer, List<String> chunks) {
    if (buffer.isEmpty) return;
    chunks.add(buffer.toString());
    buffer.clear();
  }
}
