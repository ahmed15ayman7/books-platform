import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/network/failure.dart';
import '../../domain/entities/publisher.dart';
import '../models/publisher_response.dart';

@lazySingleton
class PublishersRemoteDataSourceImpl {
  static final _mockPublishers = [
    const PublisherResponse(
      id: 'harvard',
      name: 'Harvard University Press',
      countryAr: 'الولايات المتحدة',
      countryEn: 'United States',
      countryFlag: '🇺🇸',
      bookCount: 287,
      isSponsored: true,
      aboutAr: 'مطبعة جامعة هارفارد هي دار نشر أكاديمية تأسست عام 1913، وتُعدّ من أبرز دور النشر الأكاديمية في العالم.',
    ),
    const PublisherResponse(
      id: 'princeton',
      name: 'Princeton University Press',
      countryAr: 'الولايات المتحدة',
      countryEn: 'United States',
      countryFlag: '🇺🇸',
      bookCount: 215,
      isSponsored: false,
      aboutAr: 'تأسست عام 1905، وتنشر أعمالاً أكاديمية رائدة في العلوم الإنسانية والاجتماعية والعلوم البحتة.',
    ),
    const PublisherResponse(
      id: 'columbia',
      name: 'Columbia University Press',
      countryAr: 'الولايات المتحدة',
      countryEn: 'United States',
      countryFlag: '🇺🇸',
      bookCount: 198,
      isSponsored: false,
    ),
    const PublisherResponse(
      id: 'allen-unwin',
      name: 'Allen & Unwin',
      countryAr: 'أستراليا',
      countryEn: 'Australia',
      countryFlag: '🇦🇺',
      bookCount: 156,
      isSponsored: false,
    ),
    const PublisherResponse(
      id: 'oneworld',
      name: 'Oneworld Publications',
      countryAr: 'المملكة المتحدة',
      countryEn: 'United Kingdom',
      countryFlag: '🇬🇧',
      bookCount: 134,
      isSponsored: true,
    ),
    const PublisherResponse(
      id: 'simon-schuster',
      name: 'Simon and Schuster',
      countryAr: 'الولايات المتحدة',
      countryEn: 'United States',
      countryFlag: '🇺🇸',
      bookCount: 312,
      isSponsored: false,
    ),
    const PublisherResponse(
      id: 'knopf',
      name: 'Knopf Doubleday',
      countryAr: 'الولايات المتحدة',
      countryEn: 'United States',
      countryFlag: '🇺🇸',
      bookCount: 278,
      isSponsored: false,
    ),
  ];

  Future<Either<Failure, List<String>>> getCountries() async {
    final countries = _mockPublishers
        .map((p) => p.countryAr)
        .toSet()
        .toList();
    return right(countries);
  }

  Future<Either<Failure, List<Publisher>>> getPublishers({
    String? countryName,
  }) async {
    var list = _mockPublishers.map((r) => r.toEntity()).toList();
    if (countryName != null) {
      list = list.where((p) => p.countryAr == countryName).toList();
    }
    // Sponsored first
    list.sort((a, b) {
      if (a.isSponsored && !b.isSponsored) return -1;
      if (!a.isSponsored && b.isSponsored) return 1;
      return b.bookCount - a.bookCount;
    });
    return right(list);
  }

  Future<Either<Failure, Publisher>> getPublisherBySlug(String slug) async {
    try {
      return right(
        _mockPublishers.firstWhere((p) => p.id == slug).toEntity(),
      );
    } catch (_) {
      return left(const ServerFailure(404, 'Publisher not found'));
    }
  }
}
