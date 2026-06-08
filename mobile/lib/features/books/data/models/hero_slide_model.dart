import '../../domain/entities/hero_slide.dart';

class HeroSlideModel {
  const HeroSlideModel({
    required this.id,
    required this.titleAr,
    this.titleEn,
    this.subtitleAr,
    this.subtitleEn,
    required this.imageUrl,
    this.foregroundImageUrl,
    this.linkUrl,
    required this.position,
  });

  final String id;
  final String titleAr;
  final String? titleEn;
  final String? subtitleAr;
  final String? subtitleEn;
  final String imageUrl;
  final String? foregroundImageUrl;
  final String? linkUrl;
  final int position;

  factory HeroSlideModel.fromJson(Map<String, dynamic> json) => HeroSlideModel(
        id: json['id'] as String? ?? '',
        titleAr: json['titleAr'] as String? ?? '',
        titleEn: json['titleEn'] as String?,
        subtitleAr: json['subtitleAr'] as String?,
        subtitleEn: json['subtitleEn'] as String?,
        imageUrl: json['imageUrl'] as String? ?? '',
        foregroundImageUrl: json['foregroundImageUrl'] as String?,
        linkUrl: json['linkUrl'] as String?,
        position: (json['position'] as num?)?.toInt() ?? 0,
      );

  HeroSlide toEntity() => HeroSlide(
        id: id,
        titleAr: titleAr,
        titleEn: titleEn,
        subtitleAr: subtitleAr,
        subtitleEn: subtitleEn,
        imageUrl: imageUrl,
        foregroundImageUrl: foregroundImageUrl,
        linkUrl: linkUrl,
        position: position,
      );
}
