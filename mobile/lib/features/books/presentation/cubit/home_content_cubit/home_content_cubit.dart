// Cache implementation — uncomment + restore SharedPreferences constructor param + run build_runner to re-enable.
// import 'dart:convert';
// import 'package:shared_preferences/shared_preferences.dart';
// import '../../../data/models/hero_slide_model.dart';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../../../core/network/failure_messages.dart' as core;
import '../../../domain/entities/book.dart';
import '../../../domain/entities/hero_slide.dart';
import '../../../domain/repositories/base_books_repository.dart';
import 'home_content_state.dart';

// Cache implementation — uncomment + restore SharedPreferences constructor param + run build_runner to re-enable.
// const _kHeroSlidesCacheKey = 'hero_slides_cache';
// const _kHeroSlidesCachedAtKey = 'hero_slides_cached_at';
// const _kHeroCacheTtl = Duration(minutes: 30);

const _kHeroImageBase =
    'https://pub-d0728a00ea42472886be7b96f430ae95.r2.dev/hero';

const List<HeroSlide> _kHeroSlides = [
  HeroSlide(
    id: 'cmpttq67j000m07modrb52jwj',
    titleAr:
        'ندعم كافة العناصر الثقافية من كُتَّاب وقُراء وباحثين وناشرين ومُترجمين',
    titleEn:
        'We support all cultural channels, including writers, readers, researchers, publishers and translators.',
    subtitleAr:
        'ندعم كافة العناصر الثقافية من كُتَّاب وقُراء وباحثين وناشرين ومُترجمين',
    subtitleEn:
        'We support all cultural channels, including writers, readers, researchers, publishers and translators.',
    imageUrl:
        '$_kHeroImageBase/cmpttq67j000m07modrb52jwj__image_url.jpg',
    position: 0,
  ),
  HeroSlide(
    id: 'cmpttrw5y000p07mo78c3af8g',
    titleAr:
        'هدفنا أن يعرف القارئ العربي بكل كتاب جديد يصدر في العالم ',
    titleEn:
        'Our goal is to make the Arab reader aware of every new book published in the world.',
    imageUrl:
        '$_kHeroImageBase/cmpttrw5y000p07mo78c3af8g__image_url.jpeg',
    position: 0,
  ),
  HeroSlide(
    id: 'cmq11cav6000407mvl9p105ez',
    titleAr:
        'نعمل من أجل تسهيل الوصول إلى  مصادر  العلوم وتعزيز التفاهم بين الثقافات ',
    titleEn:
        'We work to facilitate access to science resources and promote intercultural understanding',
    imageUrl:
        '$_kHeroImageBase/cmq11cav6000407mvl9p105ez__image_url.jpeg',
    position: 0,
  ),
  HeroSlide(
    id: 'cmq11ollh000007qpf5iqokht',
    titleAr: 'نسعى لنكون منارة عربية من منارات الثقافة والأداب والفنون',
    titleEn: 'We seek to be an Arab beacon of culture, literature and arts',
    imageUrl:
        '$_kHeroImageBase/cmq11ollh000007qpf5iqokht__image_url.jpg',
    position: 0,
  ),
  HeroSlide(
    id: 'cmq11qoov000207qpyfen1fij',
    titleAr: 'نفتح نافذة معرفية عربية على  أفكار  وعلوم وثقافات العالم',
    titleEn:
        'We open an Arab knowledge window on the  ideas, sciences and cultures of the world',
    imageUrl:
        '$_kHeroImageBase/cmq11qoov000207qpyfen1fij__image_url.jpeg',
    position: 0,
  ),
];

@injectable
class HomeContentCubit extends Cubit<HomeContentState> {
  HomeContentCubit(this._repo) : super(const HomeContentInitial());

  final BooksRepository _repo;

  Future<void> refresh() => load();

  Future<void> load() async {
    emit(const HomeContentLoading());

    final newlyReleasedFuture = _repo.getNewlyReleasedBooks();
    final translatedFuture = _repo.getTranslatedBooks();
    final categorySectionsFuture = _repo.getCategorySections();
    final publishersFuture = _repo.getTopPublishers();

    final newlyReleasedResult = await newlyReleasedFuture;
    final translatedResult = await translatedFuture;
    final categorySectionsResult = await categorySectionsFuture;
    final publishersResult = await publishersFuture;

    for (final r in [
      newlyReleasedResult,
      translatedResult,
      categorySectionsResult,
      publishersResult,
    ]) {
      if (r.isLeft()) {
        emit(HomeContentError(
            core.failureToMessage(r.fold((f) => f, (_) => throw StateError('')))));
        return;
      }
    }

    final categorySections = categorySectionsResult.getOrElse(() => []);
    final categories = categorySections.map((s) => s.category).toList();
    final freshBooks = newlyReleasedResult.getOrElse(() => []);
    final translatedBooks = translatedResult.fold((_) => <Book>[], (p) => p.data);
    final topPublishers = publishersResult.getOrElse(() => []).take(5).toList();

    emit(HomeContentSuccess(
      heroSlides: _kHeroSlides,
      categories: categories,
      freshBooks: freshBooks,
      translatedBooks: translatedBooks,
      categorySections: categorySections,
      topPublishers: topPublishers,
    ));
  }

  // Cache implementation — uncomment + restore SharedPreferences constructor param + run build_runner to re-enable.
  /*
  List<HeroSlide> _loadCachedSlides() {
    final cachedAt = _prefs.getInt(_kHeroSlidesCachedAtKey);
    if (cachedAt == null) return [];
    final age = DateTime.now().millisecondsSinceEpoch - cachedAt;
    if (age > _kHeroCacheTtl.inMilliseconds) return [];
    final raw = _prefs.getString(_kHeroSlidesCacheKey);
    if (raw == null) return [];
    try {
      final list = jsonDecode(raw) as List<dynamic>;
      return list
          .map((e) => HeroSlideModel.fromJson(e as Map<String, dynamic>).toEntity())
          .toList();
    } catch (_) {
      return [];
    }
  }

  void _cacheSlides(List<HeroSlide> slides) {
    if (slides.isEmpty) return;
    final json = jsonEncode(
      slides.map((s) => HeroSlideModel.fromEntity(s).toJson()).toList(),
    );
    _prefs.setString(_kHeroSlidesCacheKey, json);
    _prefs.setInt(_kHeroSlidesCachedAtKey, DateTime.now().millisecondsSinceEpoch);
  }
  */
}
