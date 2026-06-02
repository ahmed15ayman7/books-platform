import '../../domain/entities/rating.dart';

class RatingModel {
  const RatingModel({
    required this.id,
    required this.productId,
    required this.stars,
    required this.average,
    required this.count,
    required this.distribution,
  });

  final String id;
  final String productId;
  final int stars;
  final double average;
  final int count;
  final Map<int, int> distribution;

  factory RatingModel.fromJson(Map<String, dynamic> json) {
    final distList = json['distribution'] as List<dynamic>? ?? [];
    final distribution = <int, int>{};
    for (final item in distList) {
      final m = item as Map<String, dynamic>;
      distribution[(m['stars'] as num).toInt()] = (m['count'] as num).toInt();
    }
    return RatingModel(
      id: json['_id'] as String? ?? json['id'] as String? ?? '',
      productId: json['productId'] as String? ?? '',
      stars: (json['stars'] as num?)?.toInt() ?? 0,
      average: (json['average'] as num?)?.toDouble() ?? 0.0,
      count: (json['count'] as num?)?.toInt() ?? 0,
      distribution: distribution,
    );
  }

  Rating toEntity() => Rating(
        id: id,
        productId: productId,
        stars: stars,
        average: average,
        count: count,
        distribution: distribution,
      );
}
