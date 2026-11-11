import 'dart:typed_data';

sealed class ResolvedImageSource {
  const ResolvedImageSource();
}

final class NetworkImageSource extends ResolvedImageSource {
  const NetworkImageSource(this.url);
  final String url;
}

final class MemoryImageSource extends ResolvedImageSource {
  const MemoryImageSource(this.bytes);
  final Uint8List bytes;
}

/// Maps a backend `imageUrl` to something the app can actually render:
/// inline `data:image/...` URIs become bytes, and hotlinked Next.js optimizer
/// URLs are unwrapped to their origin file (the optimizer endpoints sit behind
/// bot protection that rejects non-browser clients).
ResolvedImageSource? resolveImageSource(String? raw) {
  final value = raw?.trim();
  if (value == null || value.isEmpty) return null;

  if (value.startsWith('data:image/')) {
    try {
      return MemoryImageSource(UriData.parse(value).contentAsBytes());
    } on FormatException {
      return null;
    }
  }

  return NetworkImageSource(unwrapNextImageUrl(value));
}

String unwrapNextImageUrl(String url) {
  final uri = Uri.tryParse(url);
  if (uri == null || uri.path != '/_next/image') return url;

  final inner = uri.queryParameters['url'];
  if (inner == null || inner.isEmpty) return url;

  final resolved = Uri.tryParse(inner);
  if (resolved == null) return url;

  final target = uri.resolveUri(resolved);
  return target.isScheme('http') || target.isScheme('https')
      ? target.toString()
      : url;
}
