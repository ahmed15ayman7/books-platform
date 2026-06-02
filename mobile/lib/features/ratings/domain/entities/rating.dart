import 'package:equatable/equatable.dart';

class Rating extends Equatable {
  const Rating({
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

  @override
  List<Object?> get props => [id, productId, stars, average, count];
}
