import 'package:flutter/material.dart';

import 'package:cached_network_image/cached_network_image.dart';

import '../helpers/image_url_helper.dart';

/// Drop-in replacement for [CachedNetworkImage] that also renders inline
/// `data:image/...` URIs and unwraps Next.js `/_next/image` optimizer URLs.
class AppNetworkImage extends StatefulWidget {
  const AppNetworkImage({
    super.key,
    required this.url,
    required this.placeholder,
    required this.error,
    this.fit = BoxFit.cover,
  });

  final String? url;
  final BoxFit fit;
  final WidgetBuilder placeholder;
  final WidgetBuilder error;

  @override
  State<AppNetworkImage> createState() => _AppNetworkImageState();
}

class _AppNetworkImageState extends State<AppNetworkImage> {
  ResolvedImageSource? _source;

  @override
  void initState() {
    super.initState();
    _source = resolveImageSource(widget.url);
  }

  @override
  void didUpdateWidget(AppNetworkImage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.url != widget.url) {
      _source = resolveImageSource(widget.url);
    }
  }

  @override
  Widget build(BuildContext context) {
    return switch (_source) {
      NetworkImageSource(:final url) => CachedNetworkImage(
        imageUrl: url,
        fit: widget.fit,
        placeholder: (context, _) => widget.placeholder(context),
        errorWidget: (context, _, _) => widget.error(context),
      ),
      MemoryImageSource(:final bytes) => Image.memory(
        bytes,
        fit: widget.fit,
        gaplessPlayback: true,
        errorBuilder: (context, _, _) => widget.error(context),
      ),
      null => widget.error(context),
    };
  }
}
