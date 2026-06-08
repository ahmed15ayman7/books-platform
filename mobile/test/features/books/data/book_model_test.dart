import 'package:flutter_test/flutter_test.dart';

import 'package:booksplatform/features/books/data/models/book_model.dart';

void main() {
  group('BookModel.fromJson', () {
    group('pages field', () {
      test('maps pageCount to pages', () {
        final json = _baseJson({'pageCount': 320});
        expect(BookModel.fromJson(json).pages, 320);
      });

      test('falls back to pages when pageCount is absent', () {
        final json = _baseJson({'pages': 180});
        expect(BookModel.fromJson(json).pages, 180);
      });

      test('returns 0 when neither pageCount nor pages is present', () {
        expect(BookModel.fromJson(_baseJson({})).pages, 0);
      });
    });

    group('country fields', () {
      test('maps publisher.countries to countryAr and countryEn', () {
        final json = _baseJson({
          'publisher': {
            'title': 'Portfolio',
            'slug': 'portfolio-2',
            'countries': [
              {'name': 'USA', 'nameAr': 'أمريكا'},
            ],
          },
        });
        final model = BookModel.fromJson(json);
        expect(model.countryAr, 'أمريكا');
        expect(model.countryEn, 'USA');
      });

      test('prefers publisher countries over numeric top-level country', () {
        final json = _baseJson({
          'country': '18047',
          'publisher': {
            'title': 'Portfolio',
            'slug': 'portfolio-2',
            'countries': [
              {'name': 'USA', 'nameAr': 'أمريكا'},
            ],
          },
        });
        final model = BookModel.fromJson(json);
        expect(model.countryAr, 'أمريكا');
        expect(model.countryEn, 'USA');
      });

      test('falls back to human-readable top-level country when publisher countries absent', () {
        final json = _baseJson({'country': 'France'});
        final model = BookModel.fromJson(json);
        expect(model.countryAr, 'France');
        expect(model.countryEn, 'France');
      });

      test('falls back to publishingCountry for legacy payloads', () {
        final json = _baseJson({'publishingCountry': 'المملكة المتحدة'});
        final model = BookModel.fromJson(json);
        expect(model.countryAr, 'المملكة المتحدة');
        expect(model.countryEn, 'المملكة المتحدة');
      });

      test('falls back to countryAr / countryEn when nothing else present', () {
        final json = _baseJson({'countryAr': 'مصر', 'countryEn': 'Egypt'});
        final model = BookModel.fromJson(json);
        expect(model.countryAr, 'مصر');
        expect(model.countryEn, 'Egypt');
      });

      test('returns empty strings when no country data present', () {
        final model = BookModel.fromJson(_baseJson({}));
        expect(model.countryAr, '');
        expect(model.countryEn, '');
      });
    });

    group('language field', () {
      test('maps language to languageCode', () {
        final json = _baseJson({'language': 'en'});
        expect(BookModel.fromJson(json).languageCode, 'en');
      });

      test('does not read originalLanguage as languageCode', () {
        final json = _baseJson({'originalLanguage': 'English'});
        expect(BookModel.fromJson(json).languageCode, isNull);
      });
    });

    group('publisher field', () {
      test('extracts publisher title, names, address and slug from nested object', () {
        final json = _baseJson({
          'publisher': {
            'id': 'pub-1',
            'title': 'Portfolio',
            'name': 'Portfolio',
            'nameAr': 'مَلَفّ',
            'slug': 'portfolio-2',
            'address': 'info@penguin.com',
            'websiteUrl': 'https://penguin.com',
          },
        });
        final model = BookModel.fromJson(json);
        expect(model.publisher, 'Portfolio');
        expect(model.publisherNameEn, 'Portfolio');
        expect(model.publisherNameAr, 'مَلَفّ');
        expect(model.publisherId, 'portfolio-2');
        expect(model.publisherAddress, 'info@penguin.com');
        expect(model.publisherWebsiteUrl, 'https://penguin.com');
      });
    });

    group('publicationYear and edition', () {
      test('maps publicationYear and editionAr', () {
        final json = _baseJson({
          'publicationYear': 2020,
          'edition': 'First edition',
          'editionAr': 'الطبعة الأولى',
        });
        final model = BookModel.fromJson(json);
        expect(model.publicationYear, 2020);
        expect(model.year, 2020);
        expect(model.edition, 'First edition');
        expect(model.editionAr, 'الطبعة الأولى');
      });
    });

    group('nested biblio collections', () {
      test('parses primaryCategory, categories, authors and tags', () {
        final json = _baseJson({
          'primaryCategory': {
            'id': 'cat-1',
            'slug': 'ideas-and-policies',
            'name': 'Ideas and Policies',
            'nameAr': 'أفكار وسياسات',
          },
          'categories': [
            {
              'id': 'cat-1',
              'slug': 'ideas-and-policies',
              'name': 'Ideas and Policies',
              'nameAr': 'أفكار وسياسات',
            },
            {
              'id': 'cat-2',
              'slug': 'social-studies',
              'name': 'Social Studies',
              'nameAr': 'دراسات اجتماعية',
            },
          ],
          'authors': [
            {
              'id': 'author-1',
              'slug': 'john-doe',
              'name': 'John Doe',
              'nameAr': 'جون دو',
            },
          ],
          'tags': [
            {'id': 'tag-1', 'slug': 'politics', 'name': 'Politics'},
          ],
          'dimensions': '14 x 21 cm',
          'notes': 'Sample note',
        });

        final model = BookModel.fromJson(json);
        expect(model.primaryCategory?.nameAr, 'أفكار وسياسات');
        expect(model.categories, hasLength(2));
        expect(model.authors.single.nameAr, 'جون دو');
        expect(model.tags.single.name, 'Politics');
        expect(model.dimensions, '14 x 21 cm');
        expect(model.notes, 'Sample note');
      });
    });

    group('toEntity()', () {
      test('maps biblio fields correctly to Book entity', () {
        final json = _baseJson({
          'pageCount': 256,
          'language': 'en',
          'publisher': {
            'title': 'Portfolio',
            'nameAr': 'مَلَفّ',
            'slug': 'portfolio-2',
            'countries': [
              {'name': 'USA', 'nameAr': 'أمريكا'},
            ],
          },
        });
        final entity = BookModel.fromJson(json).toEntity();
        expect(entity.pages, 256);
        expect(entity.countryAr, 'أمريكا');
        expect(entity.countryEn, 'USA');
        expect(entity.languageCode, 'en');
        expect(entity.publisherNameAr, 'مَلَفّ');
      });
    });
  });
}

Map<String, dynamic> _baseJson(Map<String, dynamic> overrides) => {
      'id': 'book-1',
      'slug': 'test-book',
      'nameAr': 'كتاب تجريبي',
      'nameEn': 'Test Book',
      'translationStatus': 'TRANSLATED',
      'categories': [],
      ...overrides,
    };
