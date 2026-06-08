import '../../../../core/constants/app_constants.dart';
import 'hero_slide.dart';

const String kBrandingHeroSlideId = 'local-branding';

HeroSlide brandingHeroSlide() => const HeroSlide(
      id: kBrandingHeroSlideId,
      titleAr: '',
      titleEn: '',
      imageUrl: kBrandingLogoAsset,
      isLocalAsset: true,
      position: 999,
    );

List<HeroSlide> withBrandingHeroSlide(List<HeroSlide> apiSlides) {
  final sorted = [...apiSlides]..sort((a, b) => a.position.compareTo(b.position));
  return [...sorted, brandingHeroSlide()];
}
