import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import 'static_page_state.dart';

@injectable
class StaticPageCubit extends Cubit<StaticPageState> {
  StaticPageCubit() : super(const StaticPageInitial());

  Future<void> load(String slug, String title, String locale) async {
    emit(const StaticPageLoading());
    final paths = [
      'assets/static/${slug}_$locale.md',
      'assets/static/$slug.md',
    ];
    for (final path in paths) {
      try {
        final content = await rootBundle.loadString(path);
        emit(StaticPageLoaded(slug: slug, title: title, content: content));
        return;
      } catch (_) {
        continue;
      }
    }
    emit(const StaticPageError('static_page_unavailable'));
  }
}
