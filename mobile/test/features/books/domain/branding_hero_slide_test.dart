import 'package:booksplatform/core/constants/app_constants.dart';
import 'package:booksplatform/features/books/domain/entities/branding_hero_slide.dart';
import 'package:booksplatform/features/books/domain/entities/hero_slide.dart';
import 'package:flutter_test/flutter_test.dart';

HeroSlide _apiSlide({required String id, required int position}) => HeroSlide(
      id: id,
      titleAr: 'عنوان',
      titleEn: 'Title',
      imageUrl: 'https://example.com/$id.jpg',
      position: position,
    );

void main() {
  group('brandingHeroSlide', () {
    test('has local asset properties', () {
      final slide = brandingHeroSlide();

      expect(slide.id, kBrandingHeroSlideId);
      expect(slide.isLocalAsset, isTrue);
      expect(slide.imageUrl, kBrandingLogoAsset);
      expect(slide.titleAr, isEmpty);
      expect(slide.titleEn, isEmpty);
    });
  });

  group('withBrandingHeroSlide', () {
    test('returns only branding slide when api list is empty', () {
      final result = withBrandingHeroSlide([]);

      expect(result, hasLength(1));
      expect(result.last.isLocalAsset, isTrue);
      expect(result.last.id, kBrandingHeroSlideId);
    });

    test('appends branding slide as last item', () {
      final result = withBrandingHeroSlide([
        _apiSlide(id: 'a', position: 1),
        _apiSlide(id: 'b', position: 2),
      ]);

      expect(result, hasLength(3));
      expect(result[0].id, 'a');
      expect(result[1].id, 'b');
      expect(result[2].isLocalAsset, isTrue);
      expect(result[2].id, kBrandingHeroSlideId);
    });

    test('sorts api slides by position before appending branding', () {
      final result = withBrandingHeroSlide([
        _apiSlide(id: 'c', position: 3),
        _apiSlide(id: 'a', position: 1),
        _apiSlide(id: 'b', position: 2),
      ]);

      expect(result.map((s) => s.id).toList(), ['a', 'b', 'c', kBrandingHeroSlideId]);
    });
  });
}
