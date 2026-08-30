/* ============================================================
   Books Platform — data & tokens (plain JS, attaches window.BP)
   Tokens verbatim from web codebase. Content from codebase strings
   + real-world bibliographic data (no lorem ipsum).
   ============================================================ */
(function () {
  // ---- design tokens (light + dark) ----
  const tokens = {
    red: "#B11E2E", redHover: "#8B1623", redSoft: "#F8E5E8", black: "#0B0B0B", white: "#FFFFFF",
    g50:"#FAFAFA", g100:"#F5F5F5", g200:"#E5E5E5", g300:"#D4D4D4", g400:"#A3A3A3",
    g500:"#6B6B6B", g600:"#525252", g700:"#404040", g800:"#262626", g900:"#1A1A1A",
    success:"#15803D", warning:"#CA8A04", info:"#1D4ED8", error:"#DC2626",
    spring:"cubic-bezier(.34,1.45,.64,1)", smooth:"cubic-bezier(.25,.8,.25,1)",
  };

  function theme(dark) {
    return dark ? {
      bg:"#0B0B0B", surface:"#1A1A1A", surface2:"#262626", text:"#FFFFFF",
      muted:"#A3A3A3", faint:"#6B6B6B", border:"#262626", line:"#262626",
      red:tokens.red, redHover:tokens.redHover, redSoft:"#2a1518", chrome:"#000000",
    } : {
      bg:"#FAFAFA", surface:"#FFFFFF", surface2:"#F5F5F5", text:"#1A1A1A",
      muted:"#6B6B6B", faint:"#A3A3A3", border:"#E5E5E5", line:"#EDEDED",
      red:tokens.red, redHover:tokens.redHover, redSoft:tokens.redSoft, chrome:"#0B0B0B",
    };
  }

  // status -> {label ar/en, color}
  const status = {
    TRANSLATED:   { ar:"مترجم",        en:"Translated",     color:tokens.success },
    NOMINATED:    { ar:"مرشح للترجمة", en:"For Translation", color:tokens.warning },
    NOT_TRANSLATED:{ ar:"غير مترجم",   en:"Not translated",  color:tokens.g400 },
  };

  // 8 categories (ar/en/slug + icon key + count)
  const categories = [
    { slug:"ideas-and-policies",        ar:"أفكار وسياسات",   en:"Ideas & Policies",      icon:"ideas",    count:612 },
    { slug:"social-studies",            ar:"دراسات اجتماعية", en:"Social Studies",        icon:"social",   count:548 },
    { slug:"philosophies-and-cultures", ar:"فلسفات وثقافات",  en:"Philosophies & Cultures",icon:"philos",  count:734 },
    { slug:"economy-and-development",   ar:"اقتصاد وتنمية",   en:"Economy & Development", icon:"economy",  count:489 },
    { slug:"languages-and-literature",  ar:"لغات وآداب",      en:"Languages & Literature",icon:"lang",     count:803 },
    { slug:"technologies-and-sciences", ar:"تقنيات وعلوم",    en:"Technologies & Sciences",icon:"tech",     count:521 },
    { slug:"religions-and-beliefs",     ar:"أديان وعقائد",    en:"Religions & Beliefs",   icon:"religion", count:357 },
    { slug:"uncategorized",             ar:"أخرى",            en:"Other",                 icon:"other",    count:580 },
  ];
  const catBy = Object.fromEntries(categories.map(c => [c.slug, c]));

  // cover palettes — distinct, brand-adjacent, NOT gray
  const C = {
    plum:["#2b2540","#46467f"], crimson:["#8b1623","#b11e2e"], ink:["#0b0b0b","#2b2b3a"],
    teal:["#0f3d3e","#1f7a6d"], ochre:["#7a4a12","#c8902a"], slate:["#1f2937","#475569"],
    wine:["#3a0d18","#7a1f33"], forest:["#14331f","#2f7a45"], sand:["#5c4326","#a9824a"],
    indigo:["#1e1b4b","#4338ca"],
  };

  // ---- books (real-world bibliographic data) ----
  const books = [
    { id:"memory", titleAr:"كتاب الذاكرة", titleEn:"The Book of Memory", cat:"philosophies-and-cultures",
      publisher:"Allen & Unwin", country:{ar:"المملكة المتحدة",en:"United Kingdom",flag:"🇬🇧"}, langOrig:{ar:"الإنجليزية",en:"English"},
      pages:160, edition:{ar:"الطبعة الأولى",en:"First edition"}, isbn:"9781803512648", year:2023,
      status:"NOMINATED", price:24, cover:C.plum, isNew:true,
      descAr:"تأمل فلسفي في كيف تصنع الذاكرة هويتنا، وكيف يعيد العقل تشكيل الماضي في كل مرة نستعيده. عمل يجمع بين علم الأعصاب والفلسفة في لغة رشيقة." },
    { id:"steal", titleAr:"كيف يسرق النظام العالمي أموالك وأنت تبتسم؟", titleEn:"How the Global System Steals Your Money", cat:"economy-and-development",
      publisher:"Oneworld Publications", country:{ar:"المملكة المتحدة",en:"United Kingdom",flag:"🇬🇧"}, langOrig:{ar:"الإنجليزية",en:"English"},
      pages:288, edition:{ar:"الطبعة الأولى",en:"First edition"}, isbn:"9780861546329", year:2022,
      status:"NOMINATED", price:27, cover:C.crimson, isNew:true,
      descAr:"قراءة نقدية لاذعة في آليات الاقتصاد العالمي، وكيف تتسرّب الثروة من جيوب الكثيرين إلى أيدي القلّة عبر أدوات تبدو محايدة." },
    { id:"burnout", titleAr:"مجتمع التعب", titleEn:"The Burnout Society", cat:"social-studies",
      publisher:"Princeton University Press", country:{ar:"الولايات المتحدة",en:"United States",flag:"🇺🇸"}, langOrig:{ar:"الألمانية",en:"German"},
      pages:72, edition:{ar:"الطبعة الثانية",en:"Second edition"}, isbn:"9780804795098", year:2015,
      status:"TRANSLATED", price:19, cover:C.ink,
      descAr:"يحلّل بيونغ-تشول هان مجتمع الإنجاز المعاصر الذي حوّل الإكراه الخارجي إلى استنزاف ذاتي، فصار الفرد سيد نفسه وعبدها في آنٍ واحد." },
    { id:"justice", titleAr:"العدالة: ما العمل الصواب؟", titleEn:"Justice: What's the Right Thing to Do?", cat:"ideas-and-policies",
      publisher:"Knopf Doubleday", country:{ar:"الولايات المتحدة",en:"United States",flag:"🇺🇸"}, langOrig:{ar:"الإنجليزية",en:"English"},
      pages:320, edition:{ar:"الطبعة الأولى",en:"First edition"}, isbn:"9780374532505", year:2009,
      status:"TRANSLATED", price:22, cover:C.wine,
      descAr:"يأخذنا مايكل ساندل في رحلة عبر أسئلة العدالة الكبرى — من الحرية إلى المساواة — مستعيناً بمعضلات واقعية تجعل الفلسفة حاضرة في حياتنا." },
    { id:"common-good", titleAr:"اقتصاد الخير المشترك", titleEn:"Economics for the Common Good", cat:"economy-and-development",
      publisher:"Princeton University Press", country:{ar:"الولايات المتحدة",en:"United States",flag:"🇺🇸"}, langOrig:{ar:"الفرنسية",en:"French"},
      pages:576, edition:{ar:"الطبعة الأولى",en:"First edition"}, isbn:"9780691175164", year:2017,
      status:"TRANSLATED", price:29, cover:C.teal,
      descAr:"يقدّم جان تيرول، الحائز نوبل، رؤية في كيف يمكن للاقتصاد أن يخدم الصالح العام دون أن يفقد صرامته العلمية." },
    { id:"language-life", titleAr:"لغة الحياة", titleEn:"The Language of Life", cat:"languages-and-literature",
      publisher:"Columbia University Press", country:{ar:"الولايات المتحدة",en:"United States",flag:"🇺🇸"}, langOrig:{ar:"الإنجليزية",en:"English"},
      pages:240, edition:{ar:"الطبعة الأولى",en:"First edition"}, isbn:"9780231170949", year:2019,
      status:"NOMINATED", price:21, cover:C.ochre,
      descAr:"كيف تشكّل اللغات طريقة تفكيرنا ورؤيتنا للعالم؟ رحلة في علم اللغة المعاصر بين الأدب والإدراك." },
    { id:"beliefs", titleAr:"تاريخ موجز للعقائد", titleEn:"A Short History of Beliefs", cat:"religions-and-beliefs",
      publisher:"Harvard University Press", country:{ar:"الولايات المتحدة",en:"United States",flag:"🇺🇸"}, langOrig:{ar:"الإنجليزية",en:"English"},
      pages:198, edition:{ar:"الطبعة الأولى",en:"First edition"}, isbn:"9780674975910", year:2018,
      status:"NOT_TRANSLATED", price:23, cover:C.sand,
      descAr:"مدخل رصين إلى تطوّر العقائد الإنسانية عبر التاريخ، يقرأ التحوّلات الكبرى في الفكر الديني بعين المؤرّخ المنصف." },
    { id:"posthuman", titleAr:"ما بعد الإنسان", titleEn:"The Posthuman Condition", cat:"technologies-and-sciences",
      publisher:"Simon and Schuster", country:{ar:"الولايات المتحدة",en:"United States",flag:"🇺🇸"}, langOrig:{ar:"الإنجليزية",en:"English"},
      pages:336, edition:{ar:"الطبعة الأولى",en:"First edition"}, isbn:"9781982134129", year:2021,
      status:"NOT_TRANSLATED", price:26, cover:C.indigo,
      descAr:"ماذا يبقى من الإنسان حين تذوب الحدود بينه وبين الآلة؟ تأمل في مستقبل الوعي والتقنية والهوية." },
    { id:"liberty", titleAr:"تأملات في الحرية", titleEn:"On Liberty Reconsidered", cat:"ideas-and-policies",
      publisher:"Harvard University Press", country:{ar:"الولايات المتحدة",en:"United States",flag:"🇺🇸"}, langOrig:{ar:"الإنجليزية",en:"English"},
      pages:264, edition:{ar:"الطبعة الأولى",en:"First edition"}, isbn:"9780674241565", year:2020,
      status:"NOMINATED", price:25, cover:C.slate, isNew:true,
      descAr:"إعادة قراءة لمفهوم الحرية في زمن الخوارزميات، وكيف تتبدّل حدود الفرد والدولة في العصر الرقمي." },
    { id:"green", titleAr:"كوكب صالح للعيش", titleEn:"A Habitable Planet", cat:"technologies-and-sciences",
      publisher:"Oneworld Publications", country:{ar:"المملكة المتحدة",en:"United Kingdom",flag:"🇬🇧"}, langOrig:{ar:"الإنجليزية",en:"English"},
      pages:312, edition:{ar:"الطبعة الأولى",en:"First edition"}, isbn:"9780861548873", year:2023,
      status:"TRANSLATED", price:28, cover:C.forest,
      descAr:"خريطة طريق علمية نحو مستقبل مستدام، تجمع بين علم المناخ والاقتصاد والسياسة في سرد متماسك." },
  ];
  const bookBy = Object.fromEntries(books.map(b => [b.id, b]));

  // ---- publishers ----
  const publishers = [
    { id:"sands", name:"Simon and Schuster", country:{ar:"الولايات المتحدة",en:"United States",flag:"🇺🇸"}, books:142, sponsored:true },
    { id:"harvard", name:"Harvard University Press", country:{ar:"الولايات المتحدة",en:"United States",flag:"🇺🇸"}, books:98 },
    { id:"princeton", name:"Princeton University Press", country:{ar:"الولايات المتحدة",en:"United States",flag:"🇺🇸"}, books:87 },
    { id:"columbia", name:"Columbia University Press", country:{ar:"الولايات المتحدة",en:"United States",flag:"🇺🇸"}, books:64 },
    { id:"allen", name:"Allen & Unwin", country:{ar:"المملكة المتحدة",en:"United Kingdom",flag:"🇬🇧"}, books:53 },
    { id:"knopf", name:"Knopf Doubleday", country:{ar:"الولايات المتحدة",en:"United States",flag:"🇺🇸"}, books:71 },
  ];

  const countries = [
    { ar:"الكل", en:"All", flag:"" },
    { ar:"أمريكا", en:"USA", flag:"🇺🇸" },
    { ar:"المملكة المتحدة", en:"UK", flag:"🇬🇧" },
    { ar:"فرنسا", en:"France", flag:"🇫🇷" },
    { ar:"مصر", en:"Egypt", flag:"🇪🇬" },
    { ar:"ألمانيا", en:"Germany", flag:"🇩🇪" },
  ];

  // ---- article channels (some empty for empty-state) ----
  const channels = [
    { key:"harvest",    ar:"حصاد الكتب",  en:"Book Harvest", count:24 },
    { key:"ideas",      ar:"زبدة الأفكار", en:"Essence of Ideas", count:18 },
    { key:"world-reads",ar:"العالم يقرأ",  en:"The World Reads", count:0 },
    { key:"books-talk", ar:"حديث الكتب",  en:"Books Talk", count:7 },
  ];
  const articles = {
    harvest: [
      { id:"a1", title:"حصاد موسم الخريف: عشرة كتب لا تفوّتها", cat:"حصاد الكتب", date:"٢٢ مايو ٢٠٢٦", read:6, cover:C.ochre,
        excerpt:"جولة في أبرز ما صدر هذا الموسم من كتب الفكر والاقتصاد والأدب، مع قراءة موجزة في كل عنوان." },
      { id:"a2", title:"لماذا عاد القرّاء إلى الكتب الورقية؟", cat:"حصاد الكتب", date:"١٤ مايو ٢٠٢٦", read:4, cover:C.teal,
        excerpt:"إحصاءات جديدة تكشف تحوّلاً لافتاً في عادات القراءة حول العالم." },
      { id:"a3", title:"خمسة أعمال مترجمة غيّرت النقاش العربي", cat:"حصاد الكتب", date:"٣ مايو ٢٠٢٦", read:8, cover:C.wine,
        excerpt:"كيف تركت بعض الترجمات أثراً عميقاً في الكتابة والتفكير العربيين." },
    ],
    ideas: [
      { id:"b1", title:"زبدة كتاب: مجتمع التعب", cat:"زبدة الأفكار", date:"٢٠ مايو ٢٠٢٦", read:5, cover:C.ink,
        excerpt:"أهم أفكار بيونغ-تشول هان في عشر دقائق قراءة." },
      { id:"b2", title:"العدالة في صفحتين", cat:"زبدة الأفكار", date:"٩ مايو ٢٠٢٦", read:3, cover:C.plum,
        excerpt:"خلاصة أطروحة مايكل ساندل عن معنى أن نفعل الصواب." },
    ],
    "world-reads": [],
    "books-talk": [
      { id:"d1", title:"حوار: مستقبل النشر العربي", cat:"حديث الكتب", date:"١٨ مايو ٢٠٢٦", read:10, cover:C.slate,
        excerpt:"نقاش مفتوح مع ناشرين عرب حول تحديات الصناعة وفرصها." },
    ],
  };

  // ---- bilingual UI strings ----
  const strings = {
    brand:        { ar:"منصة الكتب العالمية", en:"Books Platform" },
    heroTitle:    { ar:"نافذة العالم على الكتب", en:"The World's Window on Books" },
    heroSub:      { ar:"اكتشف كتابك القادم من أي مكان في العالم", en:"Discover your next book from anywhere in the world" },
    readDetails:  { ar:"اقرأ التفاصيل", en:"Read details" },
    browseCat:    { ar:"تصفّح حسب التصنيف", en:"Browse by category" },
    all:          { ar:"الكل", en:"All" },
    seeAll:       { ar:"عرض الكل", en:"See all" },
    newlyReleased:{ ar:"صدر حديثاً", en:"Newly released" },
    translatedBooks:{ ar:"كتب مترجمة", en:"Translated books" },
    topPublishers:{ ar:"أبرز دور النشر", en:"Top publishers" },
    nav:          { home:{ar:"الرئيسية",en:"Home"}, books:{ar:"الكتب",en:"Books"},
                    articles:{ar:"المقالات",en:"Articles"}, publishers:{ar:"الناشرون",en:"Publishers"},
                    publish:{ar:"انشر",en:"Publish"} },
    catalogTitle: { ar:"كتالوج الكتب", en:"Books catalog" },
    bookCount:    { ar:"4,654+ كتاب", en:"4,654+ books" },
    filterStatus: { ar:"حالة الترجمة", en:"Translation status" },
    sortNewest:   { ar:"الأحدث", en:"Newest" },
    sortOldest:   { ar:"الأقدم", en:"Oldest" },
    addToCart:    { ar:"أضف إلى السلة", en:"Add to cart" },
    saveWishlist: { ar:"حفظ في المفضلة", en:"Save to wishlist" },
    saved:        { ar:"محفوظ في المفضلة", en:"Saved" },
    added:        { ar:"أُضيف إلى السلة", en:"Added to cart" },
    similar:      { ar:"كتب مشابهة", en:"Similar books" },
    bookDesc:     { ar:"وصف الكتاب", en:"Description" },
    readMore:     { ar:"اقرأ المزيد", en:"Read more" },
    readLess:     { ar:"عرض أقل", en:"Show less" },
    publisherL:   { ar:"دار النشر", en:"Publisher" },
    countryL:     { ar:"بلد النشر", en:"Country" },
    origLang:     { ar:"اللغة الأصلية", en:"Original language" },
    pagesL:       { ar:"عدد الصفحات", en:"Pages" },
    editionL:     { ar:"الطبعة", en:"Edition" },
    isbnL:        { ar:"ISBN", en:"ISBN" },
    pubDirTitle:  { ar:"دور النشر حول العالم", en:"Publishers worldwide" },
    pubDirSub:    { ar:"665 ناشر من 63 دولة", en:"665 publishers from 63 countries" },
    pubSearch:    { ar:"ابحث باسم الدار…", en:"Search by publisher name…" },
    booksUnit:    { ar:"كتاب", en:"books" },
    articlesTitle:{ ar:"قراءات وعروض", en:"Readings & Reviews" },
    noArticles:   { ar:"لا توجد مقالات حالياً", en:"No articles yet" },
    refresh:      { ar:"تحديث", en:"Refresh" },
    featured:     { ar:"مقال مميز", en:"Featured" },
    minRead:      { ar:"دقائق قراءة", en:"min read" },
    cartTitle:    { ar:"سلة المشتريات", en:"Cart" },
    subtotal:     { ar:"المجموع الفرعي", en:"Subtotal" },
    serviceFee:   { ar:"رسوم الخدمة", en:"Service fee" },
    total:        { ar:"الإجمالي", en:"Total" },
    checkout:     { ar:"متابعة الدفع", en:"Checkout" },
    emptyCart:    { ar:"سلتك فارغة", en:"Your cart is empty" },
    browseBooks:  { ar:"تصفّح الكتب", en:"Browse books" },
    publishTitle: { ar:"انشر كتابك معنا", en:"Publish your book" },
    stepAuthor:   { ar:"بيانات المؤلف", en:"Author info" },
    stepBook:     { ar:"بيانات الكتاب", en:"Book info" },
    stepSubmit:   { ar:"الإرسال", en:"Submit" },
    authorName:   { ar:"اسم المؤلف", en:"Author name" },
    email:        { ar:"البريد الإلكتروني", en:"Email" },
    phone:        { ar:"رقم الهاتف", en:"Phone" },
    authorBio:    { ar:"نبذة عن المؤلف", en:"Author bio" },
    next:         { ar:"التالي", en:"Next" },
    firstFree:    { ar:"الكتاب الأول مجاناً دائماً", en:"Your first book is always free" },
    searchPh:     { ar:"ابحث عن كتاب أو مؤلف أو دار نشر…", en:"Search books, authors, publishers…" },
    recent:       { ar:"عمليات بحث سابقة", en:"Recent searches" },
    resultsFor:   { ar:"نتائج البحث لـ", en:"Results for" },
    resultCount:  { ar:"نتيجة", en:"results" },
    typeBook:     { ar:"كتاب", en:"Book" },
    typePublisher:{ ar:"ناشر", en:"Publisher" },
    noResults:    { ar:"لا توجد نتائج لـ", en:"No results for" },
    trySuggest:   { ar:"جرّب البحث عن", en:"Try searching for" },
    newsletterT:  { ar:"اشترك في نشرتنا البريدية", en:"Subscribe to our newsletter" },
    newsletterS:  { ar:"احصل على آخر الإصدارات في بريدك", en:"Get the latest releases in your inbox" },
    emailPh:      { ar:"أدخل بريدك الإلكتروني", en:"Enter your email" },
    subscribe:    { ar:"اشتراك", en:"Subscribe" },
    qty:          { ar:"الكمية", en:"Qty" },
    watchVideo:   { ar:"شاهد الحلقة", en:"Watch episode" },
    comments:     { ar:"التعليقات", en:"Comments" },
    addComment:   { ar:"أضف تعليقاً", en:"Add a comment" },
    commentPh:    { ar:"شاركنا رأيك في المقال…", en:"Share your thoughts…" },
    post:         { ar:"نشر", en:"Post" },
    relatedArticles:{ ar:"مقالات ذات صلة", en:"Related articles" },
    moderated:    { ar:"تخضع التعليقات للمراجعة قبل نشرها", en:"Comments are reviewed before publishing" },
    shareArticle: { ar:"مشاركة", en:"Share" },
  };

  // flat article lookup + editorial bodies (real prose, no lorem)
  const articleBy = {};
  Object.values(articles).forEach(arr => arr.forEach(a => { articleBy[a.id] = a; }));

  const articleBodies = {
    a1: { hasVideo:false, body:[
      "مع نهاية كل موسم نطلّ على ما أنتجته دور النشر حول العالم من كتب الفكر والاقتصاد والأدب، لنختار للقارئ العربي ما يستحق أن يُقرأ ويُترجم. هذا الموسم كان غنياً بشكل لافت، خاصة في حقل الاقتصاد السياسي.",
      "نبدأ بعشرة عناوين تتقاطع فيها الجدّية المعرفية مع وضوح اللغة. بعضها صدر عن جامعات عريقة، وبعضها عن دور نشر مستقلة جريئة، لكنها جميعاً تشترك في طرح أسئلة كبرى عن العالم الذي نعيش فيه.",
      "في كل عنوان نقدّم قراءة موجزة في الأطروحة المركزية، ونشير إلى ما إذا كان الكتاب مرشحاً للترجمة إلى العربية ضمن مبادرتنا، حتى يكون القارئ على بيّنة من خريطة المعرفة الجديدة." ],
      pull:"نختار للقارئ العربي ما يستحق أن يُقرأ ويُترجم" },
    a2: { hasVideo:true, body:[
      "تكشف بيانات حديثة عن صناعة النشر تحوّلاً لافتاً: عودة ملموسة إلى الكتاب الورقي بعد سنوات من توقّع زواله أمام الشاشات. الأرقام تتحدّث عن نموٍّ مطّرد في مبيعات الورقي بين القرّاء الشباب تحديداً.",
      "يرى الباحثون أن السبب لا يكمن في الحنين وحده، بل في حاجة معرفية أعمق: القراءة المتأنّية التي يصعب أن توفّرها وسائط التمرير السريع. الكتاب الورقي يفرض إيقاعاً مختلفاً للتفكير.",
      "في هذا التقرير نستعرض الإحصاءات، ونحاور ناشرين عرباً حول ما إذا كانت هذه الموجة ستصل إلى السوق العربية." ],
      pull:"الكتاب الورقي يفرض إيقاعاً مختلفاً للتفكير" },
    a3: { hasVideo:false, body:[
      "لا تُقاس قيمة الترجمة بعدد الصفحات المنقولة، بل بأثرها في النقاش العام. هناك أعمال قليلة غيّرت طريقة تفكير جيل كامل من القرّاء العرب حين وصلت إليهم بلغتهم.",
      "نختار في هذا المقال خمسة أعمال مترجمة تركت بصمة عميقة في الكتابة والتفكير العربيين، من الفلسفة إلى علم الاجتماع، ونقرأ كيف أعادت تشكيل مفردات النقاش." ],
      pull:"تُقاس قيمة الترجمة بأثرها في النقاش العام" },
    b1: { hasVideo:false, body:[
      "في «مجتمع التعب» يقدّم الفيلسوف الكوري-الألماني بيونغ-تشول هان تشخيصاً حاداً للحظتنا المعاصرة: لم يعد القمع يأتي من الخارج، بل صار الفرد يستنزف نفسه طوعاً سعياً وراء الإنجاز.",
      "نلخّص هنا أبرز أفكار الكتاب في دقائق قراءة: من مفهوم «مجتمع الإنجاز» إلى نقد إيجابية الأداء المفرطة، مروراً بالعلاقة بين الحرية الظاهرة والإرهاق العميق." ],
      pull:"صار الفرد يستنزف نفسه طوعاً سعياً وراء الإنجاز" },
    b2: { hasVideo:false, body:[
      "ماذا يعني أن نفعل الصواب؟ سؤال يبدو بسيطاً لكنه يفتح باب الفلسفة الأخلاقية على مصراعيه. في خلاصته الشهيرة، يقودنا مايكل ساندل عبر معضلات واقعية تكشف هشاشة حدسنا الأخلاقي.",
      "نقدّم زبدة أطروحته في صفحتين: بين منفعة الأكثرية، وكرامة الفرد، والعدالة كإنصاف." ],
      pull:"العدالة ليست توزيعاً للأشياء بل تقديراً للفضائل" },
    d1: { hasVideo:true, body:[
      "في هذه الحلقة من «حديث الكتب» نجلس مع نخبة من الناشرين العرب لنطرح السؤال الأصعب: إلى أين يتّجه النشر العربي في زمن المنصّات الرقمية؟",
      "يتناول الحوار تحديات التوزيع، وحقوق الترجمة، والعلاقة المتوتّرة أحياناً بين الجودة الثقافية ومتطلّبات السوق، وصولاً إلى الفرص التي تتيحها المنصّات الجديدة." ],
      pull:"إلى أين يتّجه النشر العربي في زمن المنصّات؟" },
  };

  const sampleComments = [
    { name:"سارة الحمد", initials:"س ح", time:"قبل ٣ ساعات", text:"مقال رائع، شكراً على هذا الاختيار الدقيق. أتمنى ترجمة العنوان الثالث قريباً." },
    { name:"Omar Khalil", initials:"OK", time:"قبل يوم", text:"التحليل دقيق كالعادة. هل من قائمة كاملة بالعناوين المرشّحة للترجمة هذا الموسم؟" },
    { name:"نور إبراهيم", initials:"ن إ", time:"قبل يومين", text:"أضفت ثلاثة من هذه الكتب إلى قائمة قراءتي فوراً. متابعة دائمة للمنصّة." },
  ];

  window.BP = { tokens, theme, status, categories, catBy, books, bookBy,
    publishers, countries, channels, articles, articleBy, articleBodies, sampleComments, strings };
})();
