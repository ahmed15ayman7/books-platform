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
      test('aboutAr reflects description from API', () {
        final json = _baseJson({'description': 'وصف الناشر'});
        expect(PublisherModel.fromJson(json).toEntity().aboutAr, 'وصف الناشر');
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
