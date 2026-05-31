import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../domain/entities/article.dart';
import '../../../domain/entities/article_channel.dart';
import 'articles_list_state.dart';

@injectable
class ArticlesListCubit extends Cubit<ArticlesListState> {
  ArticlesListCubit() : super(const ArticlesListInitial());

  static final _channels = [
    const ArticleChannel(key: 'harvest', nameAr: 'حصاد', nameEn: 'Harvest', count: 24),
    const ArticleChannel(key: 'analysis', nameAr: 'تحليل', nameEn: 'Analysis', count: 18),
    const ArticleChannel(key: 'translation', nameAr: 'ترجمة', nameEn: 'Translation', count: 31),
    const ArticleChannel(key: 'opinion', nameAr: 'رأي', nameEn: 'Opinion', count: 15),
    const ArticleChannel(key: 'interview', nameAr: 'حوار', nameEn: 'Interview', count: 9),
    const ArticleChannel(key: 'culture', nameAr: 'ثقافة', nameEn: 'Culture', count: 22),
  ];

  static final _articles = {
    'harvest': [
      Article(
        id: 'h1',
        title: 'حصاد الكتب العالمية لشهر مايو',
        excerpt: 'أبرز ما صدر من كتب حول العالم في شهر مايو، مع تحليل لأهم الاتجاهات الفكرية والأدبية.',
        categoryLabel: 'حصاد',
        channel: 'harvest',
        date: '2026-05-28',
        readMinutes: 7,
        coverColors: [const Color(0xFF0D1B2A), const Color(0xFF1B4F72)],
        hasVideo: false,
      ),
      Article(
        id: 'h2',
        title: 'الاقتصاد العالمي في مرآة الكتب',
        excerpt: 'كيف يرصد الباحثون والمؤلفون تحولات الاقتصاد العالمي في إصداراتهم الأخيرة؟',
        categoryLabel: 'حصاد',
        channel: 'harvest',
        date: '2026-05-21',
        readMinutes: 5,
        coverColors: [const Color(0xFF1A1A2E), const Color(0xFF16213E)],
      ),
      Article(
        id: 'h3',
        title: 'الفلسفة في عصر الذكاء الاصطناعي',
        excerpt: 'مقاربات فلسفية جديدة لأسئلة الهوية والوعي في ظل الثورة التقنية الراهنة.',
        categoryLabel: 'حصاد',
        channel: 'harvest',
        date: '2026-05-14',
        readMinutes: 6,
        coverColors: [const Color(0xFF2C003E), const Color(0xFF6A0572)],
      ),
    ],
    'translation': [
      Article(
        id: 't1',
        title: 'رحلة الكتاب من الإنجليزية إلى العربية',
        excerpt: 'كيف تنتقل المفاهيم عبر اللغات وما التحديات التي تواجه المترجمين في عصرنا.',
        categoryLabel: 'ترجمة',
        channel: 'translation',
        date: '2026-05-25',
        readMinutes: 8,
        coverColors: [const Color(0xFF1B4332), const Color(0xFF2D6A4F)],
        hasVideo: true,
      ),
      Article(
        id: 't2',
        title: 'أكثر 10 كتب مرشحة للترجمة في 2026',
        excerpt: 'قائمة بأبرز الكتب التي تستحق أن تُترجم إلى العربية هذا العام.',
        categoryLabel: 'ترجمة',
        channel: 'translation',
        date: '2026-05-18',
        readMinutes: 4,
        coverColors: [const Color(0xFF7B2D00), const Color(0xFFBF4500)],
      ),
    ],
    'analysis': [
      Article(
        id: 'a1',
        title: 'تحليل: لماذا تنتشر الروايات الديستوبية؟',
        excerpt: 'قراءة في ظاهرة انتشار الأدب الديستوبي وعلاقتها بالمناخ السياسي العالمي.',
        categoryLabel: 'تحليل',
        channel: 'analysis',
        date: '2026-05-20',
        readMinutes: 10,
        coverColors: [const Color(0xFF3D0000), const Color(0xFF8B0000)],
      ),
    ],
  };

  Future<void> refresh() => switch (state) {
        ArticlesListSuccess(:final activeChannel) => load(channel: activeChannel),
        _ => load(),
      };

  Future<void> load({String channel = 'harvest'}) async {
    emit(const ArticlesListLoading());
    await Future.delayed(const Duration(milliseconds: 300));
    final articles = _articles[channel] ?? [];
    emit(ArticlesListSuccess(
      channels: _channels,
      articles: articles,
      activeChannel: channel,
    ));
  }

  Future<void> switchChannel(String channel) => load(channel: channel);
}
