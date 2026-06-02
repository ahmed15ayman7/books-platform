import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import 'static_page_state.dart';

@injectable
class StaticPageCubit extends Cubit<StaticPageState> {
  StaticPageCubit() : super(const StaticPageInitial());

  Future<void> load(String slug, String title) async {
    emit(const StaticPageLoading());
    try {
      final content = await rootBundle.loadString('assets/static/$slug.md');
      emit(StaticPageLoaded(slug: slug, title: title, content: content));
    } catch (_) {
      emit(StaticPageError('Page not available'));
    }
  }
}
