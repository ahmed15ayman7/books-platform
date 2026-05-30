import 'package:equatable/equatable.dart';

class ArticleChannel extends Equatable {
  const ArticleChannel({
    required this.key,
    required this.nameAr,
    required this.nameEn,
    required this.count,
  });

  final String key;
  final String nameAr;
  final String nameEn;
  final int count;

  @override
  List<Object?> get props => [key];
}
