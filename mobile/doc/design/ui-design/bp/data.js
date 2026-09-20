/* Mock data. Field names mirror the Flutter entities (Book, Article, Publisher, MediaItem, ...) so the sync skill can diff them. */
(function () {
  const BP = (window.BP = window.BP || {});

  const C = {
    plum: ['#2b2540', '#46467f'], crimson: ['#8b1623', '#b11e2e'], ink: ['#0b0b0b', '#2b2b3a'], teal: ['#0f3d3e', '#1f7a6d'],
    ochre: ['#7a4a12', '#c8902a'], slate: ['#1f2937', '#475569'], wine: ['#3a0d18', '#7a1f33'], forest: ['#14331f', '#2f7a45'],
    sand: ['#5c4326', '#a9824a'], indigo: ['#1e1b4b', '#4338ca'], navy: ['#0d1b2a', '#1b4f72'],
  };

  const publishers = [
    { id: 'princeton', name: 'Princeton University Press', nameAr: 'مطبعة جامعة برينستون', countryEn: 'United States', countryAr: 'الولايات المتحدة', countrySlug: 'us', bookCount: 87, isSponsored: false, website: 'https://press.princeton.edu', aboutEn: 'Princeton University Press publishes scholarly and general-interest books in the humanities, social sciences and sciences. Founded in 1905, it is one of the leading university presses in the world, with a list that spans philosophy, economics, history, mathematics and public affairs. Its books are widely translated and used in classrooms across many countries.', aboutAr: 'تنشر مطبعة جامعة برينستون كتباً أكاديمية وعامة في العلوم الإنسانية والاجتماعية والطبيعية. تأسست عام 1905 وهي من أبرز المطابع الجامعية في العالم، وتشمل قائمتها الفلسفة والاقتصاد والتاريخ والرياضيات والشؤون العامة. تُترجم كتبها على نطاق واسع وتُدرَّس في جامعات كثيرة حول العالم.' },
    { id: 'simon-and-schuster', name: 'Simon and Schuster', nameAr: 'سايمون آند شوستر', countryEn: 'United States', countryAr: 'الولايات المتحدة', countrySlug: 'us', bookCount: 142, isSponsored: true },
    { id: 'harvard-university-press', name: 'Harvard University Press', nameAr: 'مطبعة جامعة هارفارد', countryEn: 'United States', countryAr: 'الولايات المتحدة', countrySlug: 'us', bookCount: 98, isSponsored: false },
    { id: 'columbia-university-press', name: 'Columbia University Press', nameAr: 'مطبعة جامعة كولومبيا', countryEn: 'United States', countryAr: 'الولايات المتحدة', countrySlug: 'us', bookCount: 64, isSponsored: false },
    { id: 'allen-and-unwin', name: 'Allen & Unwin', nameAr: 'ألين آند أنوين', countryEn: 'United Kingdom', countryAr: 'المملكة المتحدة', countrySlug: 'uk', bookCount: 53, isSponsored: false },
    { id: 'oneworld', name: 'Oneworld Publications', nameAr: 'دار وانوورلد', countryEn: 'United Kingdom', countryAr: 'المملكة المتحدة', countrySlug: 'uk', bookCount: 41, isSponsored: false },
  ];
  const countries = [
    { slug: 'us', nameEn: 'United States', nameAr: 'الولايات المتحدة' },
    { slug: 'uk', nameEn: 'United Kingdom', nameAr: 'المملكة المتحدة' },
    { slug: 'fr', nameEn: 'France', nameAr: 'فرنسا' },
    { slug: 'de', nameEn: 'Germany', nameAr: 'ألمانيا' },
    { slug: 'eg', nameEn: 'Egypt', nameAr: 'مصر' },
  ];
  const pubById = Object.fromEntries(publishers.map((p) => [p.id, p]));

  const CATS = {
    'ideas-and-policies': ['Ideas & Policies', 'أفكار وسياسات'],
    'social-studies': ['Social Studies', 'دراسات اجتماعية'],
    'philosophies-and-cultures': ['Philosophies & Cultures', 'فلسفات وثقافات'],
    'economy-and-development': ['Economy & Development', 'اقتصاد وتنمية'],
    'languages-and-literature': ['Languages & Literature', 'لغات وآداب'],
    'technologies-and-sciences': ['Technologies & Sciences', 'تقنيات وعلوم'],
    'religions-and-beliefs': ['Religions & Beliefs', 'أديان وعقائد'],
  };
  const categories = Object.keys(CATS).map((slug, i) => ({ slug, nameEn: CATS[slug][0], nameAr: CATS[slug][1], iconKey: 'book', bookCount: [612, 548, 734, 489, 803, 521, 357][i] }));

  const LANG = { en: 'English', fr: 'French', de: 'German' };
  const book = (slug, titleAr, titleEn, pubId, cat, status, year, pages, isbn, lang, colors, descAr, descEn, extra) => {
    const p = pubById[pubId];
    return Object.assign({
      id: slug, slug, titleAr, titleEn, publisher: p.name, publisherId: p.id, publisherNameEn: p.name, publisherNameAr: p.nameAr,
      publisherAddress: p.id === 'princeton' ? '41 William Street, Princeton, NJ 08540' : null,
      countryAr: p.countryAr, countryEn: p.countryEn, countryFlag: '', languageCode: lang, originalLanguage: LANG[lang],
      status, price: 24, categorySlug: cat, primaryCategory: { slug: cat, name: CATS[cat][0], nameAr: CATS[cat][1] },
      categories: [{ slug: cat, name: CATS[cat][0], nameAr: CATS[cat][1] }], coverColors: colors, isbn, pages, edition: 'First edition',
      editionAr: 'الطبعة الأولى', year, dimensions: '14 × 21 cm', descriptionAr: descAr, descriptionEn: descEn, imageUrl: null,
      downloadUrl: null, isNew: false,
    }, extra || {});
  };
  const books = [
    book('the-book-of-memory', 'كتاب الذاكرة', 'The Book of Memory', 'allen-and-unwin', 'philosophies-and-cultures', 'NOMINATED', 2023, 160, '9781803512648', 'en', C.plum,
      'تأمل فلسفي في كيف تصنع الذاكرة هويتنا، وكيف يعيد العقل تشكيل الماضي في كل مرة نستعيده. عمل يجمع بين علم الأعصاب والفلسفة في سرد آسر.',
      'A philosophical meditation on how memory shapes identity and how the mind reshapes the past every time we recall it.', { isNew: true }),
    book('how-the-global-system-steals-your-money', 'كيف يسرق النظام العالمي أموالك وأنت تبتسم؟', 'How the Global System Steals Your Money', 'oneworld', 'economy-and-development', 'NOMINATED', 2022, 288, '9780861546329', 'en', C.crimson,
      'قراءة نقدية لاذعة في آليات الاقتصاد العالمي، وكيف تتسرّب الثروة من جيوب الكثيرين إلى أيدي القلّة عبر أدوات تبدو محايدة.',
      'A sharp critique of how the global economy quietly moves wealth from the many to the few.', { isNew: true }),
    book('the-burnout-society', 'مجتمع التعب', 'The Burnout Society', 'princeton', 'social-studies', 'TRANSLATED', 2015, 72, '9780804795098', 'de', C.ink,
      'يحلّل بيونغ-تشول هان مجتمع الإنجاز المعاصر الذي حوّل الإكراه الخارجي إلى استنزاف ذاتي، فصار الفرد سيد نفسه وعبدها في آن واحد. ويرى أن العصر لم يعد عصر الانضباط بل عصر الأداء، حيث يستغل الإنسان نفسه طوعاً حتى الإنهاك. كتاب قصير في صفحاته عميق في أثره، يفتح باباً لفهم القلق والاكتئاب بوصفهما أعراضاً اجتماعية لا أمراضاً فردية فحسب.',
      'Byung-Chul Han diagnoses the achievement society, where external compulsion has become self-exploitation and the individual is both master and slave. A short book with a lasting impact.', { originalLanguage: 'German' }),
    book('justice-whats-the-right-thing-to-do', 'العدالة: ما العمل الصواب؟', "Justice: What's the Right Thing to Do?", 'simon-and-schuster', 'ideas-and-policies', 'TRANSLATED', 2009, 320, '9780374532505', 'en', C.wine,
      'يأخذنا مايكل ساندل في رحلة عبر أسئلة العدالة الكبرى — من الحرية إلى المساواة — مستعيناً بمعضلات واقعية تجعل الفلسفة حيّة.',
      "Michael Sandel takes us through the big questions of justice using real-life dilemmas.", { downloadUrl: 'https://booksplatform.net/download/justice', price: 0 }),
    book('economics-for-the-common-good', 'اقتصاد الخير المشترك', 'Economics for the Common Good', 'princeton', 'economy-and-development', 'TRANSLATED', 2017, 576, '9780691175164', 'fr', C.teal,
      'يقدّم جان تيرول، الحائز نوبل، رؤية في كيف يمكن للاقتصاد أن يخدم الصالح العام دون أن يفقد صرامته العلمية.',
      'Nobel laureate Jean Tirole shows how economics can serve the common good.'),
    book('the-language-of-life', 'لغة الحياة', 'The Language of Life', 'columbia-university-press', 'languages-and-literature', 'NOMINATED', 2019, 240, '9780231170949', 'en', C.ochre,
      'كيف تشكّل اللغات طريقة تفكيرنا ورؤيتنا للعالم؟ رحلة في علم اللغة المعاصر بين الأدب والإدراك.',
      'How do languages shape the way we think? A tour of contemporary linguistics.'),
    book('a-short-history-of-beliefs', 'تاريخ موجز للعقائد', 'A Short History of Beliefs', 'harvard-university-press', 'religions-and-beliefs', 'NOT_TRANSLATED', 2018, 198, '9780674975910', 'en', C.sand,
      'مدخل رصين إلى تطوّر العقائد الإنسانية عبر التاريخ، يقرأ التحوّلات الكبرى في الفكر الديني بعين المؤرّخ المنصف.',
      'A sober introduction to how human beliefs developed through history.'),
    book('the-posthuman-condition', 'ما بعد الإنسان', 'The Posthuman Condition', 'simon-and-schuster', 'technologies-and-sciences', 'NOT_TRANSLATED', 2021, 336, '9781982134129', 'en', C.indigo,
      'ماذا يبقى من الإنسان حين تذوب الحدود بينه وبين الآلة؟ تأمل في مستقبل الوعي والتقنية والهوية.',
      'What remains of the human when the boundary with the machine dissolves?'),
    book('on-liberty-reconsidered', 'تأملات في الحرية', 'On Liberty Reconsidered', 'harvard-university-press', 'ideas-and-policies', 'NOMINATED', 2020, 264, '9780674241565', 'en', C.slate,
      'إعادة قراءة لمفهوم الحرية في زمن الخوارزميات، وكيف تتبدّل حدود الفرد والدولة في العصر الرقمي.',
      'A rereading of liberty in the age of algorithms.', { isNew: true }),
    book('a-habitable-planet', 'كوكب صالح للعيش', 'A Habitable Planet', 'oneworld', 'technologies-and-sciences', 'TRANSLATED', 2023, 312, '9780861548873', 'en', C.forest,
      'خريطة طريق علمية نحو مستقبل مستدام، تجمع بين علم المناخ والاقتصاد والسياسة في سرد متماسك.',
      'A scientific roadmap to a sustainable future.'),
  ];
  const withStatus = (s) => books.filter((b) => b.status === s);

  const heroSlides = [
    { id: 'h1', titleAr: 'نافذة عربية على كتب العالم', titleEn: "An Arabic window onto the world's books", subtitleAr: 'اكتشف كل كتاب مهم يصدر حول العالم', subtitleEn: 'Discover every significant book published worldwide', imageUrl: null, colors: C.navy, position: 1 },
    { id: 'h2', titleAr: 'تابِع رحلة الترجمة', titleEn: 'Follow the Translation Journey', subtitleAr: 'ما تُرجم وما هو مرشّح للترجمة', subtitleEn: "See what's translated and what's nominated", imageUrl: null, colors: C.wine, position: 2 },
    { id: 'h3', titleAr: 'انشر كتابك الأول مجاناً', titleEn: 'Publish your first book for free', subtitleAr: '', subtitleEn: '', imageUrl: null, colors: C.forest, position: 3 },
  ];

  const articles = [
    { id: 'a1', slug: 'reading-season-picks', title: 'حصاد موسم الخريف: عشرة كتب لا تفوّتها', titleEn: 'Autumn harvest: ten books you should not miss', excerpt: 'جولة في أبرز ما صدر هذا الموسم من كتب الفكر والاقتصاد والأدب، مع قراءة موجزة في كل عنوان.', channel: 'harvest', categoryLabel: 'Book Harvest', categoryLabelAr: 'حصاد الكتب', date: '18 May 2026', readMinutes: 6, hasVideo: false, imageUrl: null, coverColors: C.ochre },
    { id: 'a2', slug: 'ideas-in-five-minutes', title: 'فلسفة التعب: لماذا نرهق أنفسنا طوعاً؟', titleEn: 'The philosophy of exhaustion', excerpt: 'زبدة كتاب «مجتمع التعب» في خمس دقائق، وأهم الأفكار التي يمكن أن تغيّر نظرتك للعمل.', channel: 'ideas', categoryLabel: 'Essence of Ideas', categoryLabelAr: 'زبدة الأفكار', date: '12 May 2026', readMinutes: 5, hasVideo: false, imageUrl: null, coverColors: C.plum },
    { id: 'a3', slug: 'world-reads-cairo', title: 'العالم يقرأ: ماذا تصدّر قوائم المبيعات هذا الشهر؟', titleEn: 'The world reads: this month’s bestsellers', excerpt: 'نظرة على القوائم الأكثر مبيعاً في لندن ونيويورك وباريس، وما تكشفه عن اهتمامات القرّاء.', channel: 'world-reads', categoryLabel: 'The World Reads', categoryLabelAr: 'العالم يقرأ', date: '04 May 2026', readMinutes: 7, hasVideo: false, imageUrl: null, coverColors: C.navy },
    { id: 'a4', slug: 'novel-in-a-story', title: 'رواية في حكاية: مدينة بلا ذاكرة', titleEn: 'A novel in a story: the city without memory', excerpt: 'حكاية مصوّرة تلخّص رواية معاصرة في دقائق.', channel: 'novel-story', categoryLabel: 'Novel & Story', categoryLabelAr: 'رواية وقصة', date: '28 Apr 2026', readMinutes: 4, hasVideo: true, imageUrl: null, coverColors: C.wine },
    { id: 'a5', slug: 'harvest-economics', title: 'أفضل كتب الاقتصاد لعام 2026', titleEn: 'Best economics books of 2026', excerpt: 'اختيارات المحرّرين من كتب الاقتصاد والتنمية التي تستحق القراءة.', channel: 'harvest', categoryLabel: 'Book Harvest', categoryLabelAr: 'حصاد الكتب', date: '21 Apr 2026', readMinutes: 8, hasVideo: false, imageUrl: null, coverColors: C.teal },
    { id: 'a6', slug: 'ideas-liberty', title: 'الحرية في زمن الخوارزميات', titleEn: 'Liberty in the age of algorithms', excerpt: 'ما الذي يتبقى من حرية الفرد حين تتنبأ الآلة بسلوكه؟', channel: 'ideas', categoryLabel: 'Essence of Ideas', categoryLabelAr: 'زبدة الأفكار', date: '15 Apr 2026', readMinutes: 6, hasVideo: false, imageUrl: null, coverColors: C.slate },
  ];
  const articleDetail = {
    authorName: 'مريم مظهر', date: '18 May 2026', readMinutes: 6, channel: 'harvest', categoryLabel: 'Book Harvest', hasVideo: false,
    coverColors: C.ochre, videoUrl: null, imageUrl: null,
    pullQuote: 'الكتاب الجيد لا يمنحك إجابات جاهزة، بل يعلّمك كيف تطرح أسئلة أفضل.',
    bodyParagraphs: [
      '## جولة في موسم الكتب\nيشهد الخريف كل عام موجة من الإصدارات الجديدة التي تجمع بين **الفكر والاقتصاد والأدب**، وفي هذا المقال نختار لك عشرة عناوين تستحق الوقت.',
      'بدأنا بالكتب التي تناقش أسئلة العدالة والحرية، ثم انتقلنا إلى الأعمال التي تعيد قراءة الاقتصاد العالمي من زاوية مختلفة. كل عنوان مرفق بملخص موجز وسبب اختيارنا له.',
      '> يجمع الموسم بين أعمال مترجمة وأخرى مرشحة للترجمة، وهذا ما يجعله فرصة للقارئ العربي.',
      'يمكنك تصفح جميع العناوين من قسم [الكتب](https://booksplatform.net) والاطلاع على حالة الترجمة لكل كتاب.',
    ],
    relatedArticles: articles.slice(1, 4),
  };
  const comments = [
    { id: 'c1', authorName: 'سارة أحمد', content: 'مقال رائع، أضفت ثلاثة كتب إلى قائمتي.', date: '19 May 2026' },
    { id: 'c2', authorName: 'Omar K.', content: 'Thanks for the recommendations, the economics picks are excellent.', date: '19 May 2026' },
  ];
  const mediaItems = [
    { id: 'm1', slug: 'book-talk-burnout', title: 'حديث الكتب: مجتمع التعب مع د. حاتم فرج', imageUrl: null, channel: 'books-talk', date: '20 May 2026', videoId: 'x1', youtubeUrl: '', channelLabel: 'Book Talk', channelLabelAr: 'حديث الكتب', hasVideo: true, colors: C.navy },
    { id: 'm2', slug: 'novel-city', title: 'رواية وقصة: مدينة بلا ذاكرة', imageUrl: null, channel: 'novel-story', date: '14 May 2026', videoId: 'x2', youtubeUrl: '', channelLabel: 'Novel & Story', channelLabelAr: 'رواية وقصة', hasVideo: true, colors: C.wine },
    { id: 'm3', slug: 'book-talk-justice', title: 'حديث الكتب: العدالة وأسئلتها الكبرى', imageUrl: null, channel: 'books-talk', date: '07 May 2026', videoId: 'x3', youtubeUrl: '', channelLabel: 'Book Talk', channelLabelAr: 'حديث الكتب', hasVideo: true, colors: C.teal },
    { id: 'm4', slug: 'novel-window', title: 'رواية وقصة: نافذة على العالم', imageUrl: null, channel: 'novel-story', date: '01 May 2026', videoId: 'x4', youtubeUrl: '', channelLabel: 'Novel & Story', channelLabelAr: 'رواية وقصة', hasVideo: true, colors: C.indigo },
  ];

  BP.data = {
    C, books, publishers, countries, categories, heroSlides, articles, articleDetail, comments, mediaItems,
    freshBooks: books.filter((b) => b.isNew), translatedBooks: withStatus('TRANSLATED'), nominatedBooks: withStatus('NOMINATED'),
    categorySections: [
      { category: categories[4], books: books.filter((b) => b.categorySlug === 'economy-and-development' || b.categorySlug === 'languages-and-literature') },
      { category: categories[5], books: books.filter((b) => b.categorySlug === 'technologies-and-sciences' || b.categorySlug === 'ideas-and-policies') },
    ],
    wishlist: [
      { bookSlug: 'the-burnout-society', titleAr: 'مجتمع التعب', titleEn: 'The Burnout Society', imageUrl: null },
      { bookSlug: 'the-book-of-memory', titleAr: 'كتاب الذاكرة', titleEn: 'The Book of Memory', imageUrl: null },
      { bookSlug: 'a-habitable-planet', titleAr: 'كوكب صالح للعيش', titleEn: 'A Habitable Planet', imageUrl: null },
    ],
    cart: [
      { slug: 'the-burnout-society', quantity: 1, price: 19 },
      { slug: 'economics-for-the-common-good', quantity: 2, price: 29 },
    ],
    search: {
      history: ['فلسفة', 'اقتصاد', 'العدالة', 'هارفارد', 'ذاكرة', 'ترجمة', 'سياسة'],
      suggestions: [
        { type: 'book', label: 'مجتمع التعب', labelEn: 'The Burnout Society', slug: 'the-burnout-society' },
        { type: 'publisher', label: 'مطبعة جامعة برينستون', labelEn: 'Princeton University Press', slug: 'princeton' },
        { type: 'article', label: 'فلسفة التعب: لماذا نرهق أنفسنا طوعاً؟', labelEn: 'The philosophy of exhaustion', slug: 'ideas-in-five-minutes' },
      ],
      query: 'فلسفة', queryEn: 'philosophy',
    },
  };
  BP.pubById = pubById;
})();
