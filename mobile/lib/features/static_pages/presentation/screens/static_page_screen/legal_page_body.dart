import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:booksplatform/core/theme/app_colors.dart';
import 'package:booksplatform/core/widgets/app_markdown_body.dart';
import 'package:booksplatform/features/static_pages/presentation/widgets/belief_band.dart';
import 'package:booksplatform/features/static_pages/presentation/widgets/info_page_hero.dart';
import 'package:booksplatform/features/static_pages/presentation/widgets/section_title.dart';

import '../../helpers/bilingual_helper.dart';

// ignore_for_file: lines_longer_than_80_chars

const _termsTitle = (ar: 'شروط الاستخدام', en: 'Terms of Use');
const _termsHeroSubtitle = (
  ar: 'الشروط والأحكام التي تحكم استخدامك لمنصة الكتب العالمية',
  en: 'The terms and conditions governing your use of Books Platform',
);
const _termsSectionTitle = (ar: 'نص الشروط', en: 'Terms document');
const _termsBelief = (
  ar: 'استخدامك للمنصة يعني موافقتك على هذه الشروط — نلتزم بخدمة مهنية تحفظ حقوق الجميع.',
  en: 'Using the platform means you agree to these terms — we are committed to professional service that respects everyone\'s rights.',
);

const _privacyTitle = (ar: 'سياسة الخصوصية', en: 'Privacy Policy');
const _privacyHeroSubtitle = (
  ar: 'كيف نجمع ونستخدم ونحمي معلوماتك الشخصية عند استخدام المنصة',
  en: 'How we collect, use, and protect your personal information on the platform',
);
const _privacySectionTitle = (ar: 'نص السياسة', en: 'Policy document');
const _privacyBelief = (
  ar: 'خصوصيتك مهمة لنا — نتعامل مع بياناتك بمسؤولية وشفافية.',
  en: 'Your privacy matters to us — we handle your data responsibly and transparently.',
);

class LegalPageBody extends StatelessWidget {
  const LegalPageBody({
    super.key,
    required this.slug,
    required this.lang,
    required this.markdown,
  });

  final String slug;
  final String lang;
  final String markdown;

  @override
  Widget build(BuildContext context) {
    final config = _configForSlug(slug);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        InfoPageHero(
          icon: config.icon,
          title: localizedText(config.title, lang),
          subtitle: localizedText(config.heroSubtitle, lang),
        ),
        Padding(
          padding: EdgeInsetsDirectional.fromSTEB(16.w, 26.h, 16.w, 0),
          child: Column(
            children: [
              SectionTitle(title: localizedText(config.sectionTitle, lang)),
              Container(
                width: double.infinity,
                padding: EdgeInsetsDirectional.fromSTEB(20.w, 20.h, 20.w, 22.h),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  border: Border.all(color: AppColors.divider),
                  borderRadius: BorderRadius.circular(22.r),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.secondary.withValues(alpha: 0.06),
                      blurRadius: 18.r,
                      offset: Offset(0, 6.h),
                    ),
                  ],
                ),
                child: AppMarkdownBody(data: _stripLeadingH1(markdown)),
              ),
            ],
          ),
        ),
        BeliefBand(text: localizedText(config.belief, lang)),
        SizedBox(height: 4.h),
      ],
    );
  }

  _LegalPageConfig _configForSlug(String slug) {
    return switch (slug) {
      'privacy' => _LegalPageConfig(
        icon: Icons.privacy_tip_outlined,
        title: _privacyTitle,
        heroSubtitle: _privacyHeroSubtitle,
        sectionTitle: _privacySectionTitle,
        belief: _privacyBelief,
      ),
      _ => _LegalPageConfig(
        icon: Icons.description_outlined,
        title: _termsTitle,
        heroSubtitle: _termsHeroSubtitle,
        sectionTitle: _termsSectionTitle,
        belief: _termsBelief,
      ),
    };
  }

  String _stripLeadingH1(String data) {
    final lines = data.split('\n');
    if (lines.isEmpty || !lines.first.trim().startsWith('# ')) {
      return data;
    }
    return lines.skip(1).join('\n').trimLeft();
  }
}

class _LegalPageConfig {
  const _LegalPageConfig({
    required this.icon,
    required this.title,
    required this.heroSubtitle,
    required this.sectionTitle,
    required this.belief,
  });

  final IconData icon;
  final BilingualText title;
  final BilingualText heroSubtitle;
  final BilingualText sectionTitle;
  final BilingualText belief;
}
