import 'package:flutter_test/flutter_test.dart';

import 'package:booksplatform/features/publishers/data/models/publisher_model.dart';

void main() {
  group('PublisherModel.fromJson', () {
    group('description field — Bug 7', () {
      test('maps description to excerpt', () {
        final json = _baseJson({'description': 'دار نشر عالمية رائدة'});
        expect(PublisherModel.fromJson(json).excerpt, 'دار نشر عالمية رائدة');
      });

      test('falls back to excerpt when description is absent', () {
        final json = _baseJson({'excerpt': 'ملخص قصير'});
        expect(PublisherModel.fromJson(json).excerpt, 'ملخص قصير');
      });

      test('returns null when neither description nor excerpt is present', () {
        expect(PublisherModel.fromJson(_baseJson({})).excerpt, isNull);
      });

      test('description takes priority over excerpt when both present', () {
        final json = _baseJson({'description': 'الوصف الكامل', 'excerpt': 'ملخص'});
        expect(PublisherModel.fromJson(json).excerpt, 'الوصف الكامل');
      });
    });

    group('contactEmail field — Bug 7', () {
      test('maps contactEmail to email', () {
        const address = 'press@publisher.com';
        final json = _baseJson({'contactEmail': address});
        expect(PublisherModel.fromJson(json).email, address);
      });

      test('falls back to email when contactEmail is absent', () {
        final json = _baseJson({'email': 'info@publisher.com'});
        expect(PublisherModel.fromJson(json).email, 'info@publisher.com');
      });

      test('returns null when neither contactEmail nor email is present', () {
        expect(PublisherModel.fromJson(_baseJson({})).email, isNull);
      });

      test('contactEmail takes priority over email when both present', () {
        final json = _baseJson({
          'contactEmail': 'press@publisher.com',
          'email': 'old@publisher.com',
        });
        expect(PublisherModel.fromJson(json).email, 'press@publisher.com');
      });
    });

    group('toEntity()', () {
      test('aboutEn reflects description from API', () {
        final json = _baseJson({'description': 'وصف الناشر'});
        expect(PublisherModel.fromJson(json).toEntity().aboutEn, 'وصف الناشر');
      });

      group('countries object-array shape', () {
        Map<String, dynamic> countryJson() => _baseJson({
              'countries': [
                {'id': 'c1', 'name': 'Egypt', 'nameAr': 'مصر', 'slug': 'egypt'}
              ],
            });

        test('countryEn maps from country name', () {
          expect(
            PublisherModel.fromJson(countryJson()).toEntity().countryEn,
            'Egypt',
          );
        });

        test('countryAr maps from country nameAr', () {
          expect(
            PublisherModel.fromJson(countryJson()).toEntity().countryAr,
            'مصر',
          );
        });

        test('countrySlug maps from country slug', () {
          expect(
            PublisherModel.fromJson(countryJson()).toEntity().countrySlug,
            'egypt',
          );
        });
      });

      test('aboutAr reflects contentAr from API', () {
        final json = _baseJson({'contentAr': 'وصف عربي'});
        expect(PublisherModel.fromJson(json).toEntity().aboutAr, 'وصف عربي');
      });

      test('aboutEn reflects content from API', () {
        final json = _baseJson({'content': 'English about'});
        expect(PublisherModel.fromJson(json).toEntity().aboutEn, 'English about');
      });

      test('imageUrl maps to entity', () {
        final json = _baseJson({
          'imageUrl': 'https://example.com/logo.png',
        });
        expect(
          PublisherModel.fromJson(json).toEntity().imageUrl,
          'https://example.com/logo.png',
        );
      });

      test('imageFeatured falls back when imageUrl is absent', () {
        final json = _baseJson({
          'imageFeatured': 'https://example.com/featured.png',
        });
        expect(
          PublisherModel.fromJson(json).toEntity().imageUrl,
          'https://example.com/featured.png',
        );
      });
    });
  });
}

Map<String, dynamic> _baseJson(Map<String, dynamic> overrides) => {
      'id': 'pub-1',
      'slug': 'bloomsbury',
      'name': 'Bloomsbury',
      'countries': ['UK', 'USA'],
      ...overrides,
    };
