/* ============================================================
   Books Platform — Screens E: Services (خدماتنا)
   Mobile info page. Content adapted from booksplatform.net.
   Reuses PageHero / InfoSection / SectionTitle / BeliefBand from screens-d.
   ============================================================ */

const SERVICES = {
  hero: { ar: "خدمات جديدة ومميّزة وغير مسبوقة تقدّمها منصة الكتب العالمية للقارئ والمؤلّف والناشر والمترجم",
          en: "New, distinctive and unprecedented services from Books Platform for readers, authors, publishers and translators" },
  listTitle: { ar: "خدمات المنصة", en: "Platform services" },
  listIntro: { ar: "نوفّر خدمات جديدة ومميّزة وحصرية للقارئ والمؤلّف والناشر والمترجم، وفق ما يلي:",
               en: "We offer new, distinctive and exclusive services for readers, authors, publishers and translators, as follows:" },
  list: [
    { ar: "رصد والتقاء أحدث الكتب الصادرة في العالم بكل اللغات وفي كافة التصنيفات.", en: "Tracking the newest books worldwide, in every language and category." },
    { ar: "تقديم بيانات كاملة ووافية عن جديد الكتب في القسمين العربي والأجنبي.", en: "Providing complete data on new books in both the Arabic and foreign sections." },
    { ar: "نشر بيانات الكتب في القسم المخصّص لها على المنصة بحسب تصنيفها.", en: "Publishing book data in its dedicated section by classification." },
    { ar: "إعداد نشرات إخبارية يومية وفيديوهات وبودكاست عن أهمّ الكتب.", en: "Producing daily bulletins, videos and podcasts on the most notable books." },
    { ar: "إعداد تقارير تحليلية مجمّعة لحصاد الكتب العربية والأجنبية تصدر أسبوعيًا.", en: "Compiling weekly analytical round-ups of Arab and foreign books." },
    { ar: "تقديم خدمات تفاعلية وأدوات للتشبيك بين كافة عناصر العملية الثقافية.", en: "Offering interactive tools that link every part of the cultural process." },
    { ar: "تعريف الناشرين العرب بالكتب الأجنبية الجديدة وترشيحها للترجمة.", en: "Introducing Arab publishers to new foreign books and nominating them for translation." },
    { ar: "التنسيق مع المترجمين الراغبين في نيل حقوق ترجمة الكتب الأجنبية.", en: "Coordinating with translators seeking foreign-book translation rights." },
    { ar: "التعريف بالأبحاث والمؤلّفات العربية الجديدة التي لم تُنشر بعد.", en: "Showcasing new Arab research and works not yet published." },
    { ar: "التسويق الشبكي عبر منصّات التواصل الاجتماعي وقوائم بريدية خاصة بالقرّاء والباحثين.", en: "Network marketing across social media and dedicated reader and researcher mailing lists." },
    { ar: "تسهيل شراء الكتب الجديدة بالإحالة إلى مصدر البيع وموقع الناشر، أو عبر الدفع الإلكتروني وشرائها مباشرة من المنصة.", en: "Easing new-book purchases via the seller and publisher, or buying directly through the platform's e-payment." },
  ],
  mapTitle: { ar: "خريطة مكوّنات المنصة", en: "Map of platform components" },
  components: [
    { icon: "book", title: { ar: "أقسام الكتب", en: "Book sections" },
      desc: { ar: "سبعة أقسام رئيسية تغطّي تصنيفات الكتب في جميع المجالات العلمية والمعرفية، وتُنشر بيانات وعروض الكتب مع الأغلفة في القسم المخصّص لها.",
        en: "Seven main sections covering all scholarly classifications; book data, previews and covers appear in their dedicated section." },
      chips: ["تقنيات وعلوم", "دراسات اجتماعية", "لغات وآداب", "فلسفات وثقافات", "أديان وعقائد", "اقتصاد وتنمية", "أفكار وسياسات"] },
    { icon: "languages", title: { ar: "كتب مرشّحة للترجمة", en: "Nominated for translation" },
      desc: { ar: "قسم لعرض أحدث وأهمّ الكتب المنشورة على المنصة من كل الأقسام والتصنيفات ومن جميع اللغات.",
        en: "A section featuring the newest and most important books across all sections, categories and languages." } },
    { icon: "bookMarked", title: { ar: "كتب مترجمة", en: "Translated books" },
      desc: { ar: "قسم خاص يقدّم أحدث الكتب الأجنبية المترجمة إلى العربية.",
        en: "A dedicated section presenting the latest foreign books translated into Arabic." } },
    { icon: "building", title: { ar: "ناشرون", en: "Publishers" },
      desc: { ar: "صفحة تعريفية لدور النشر العربية والأجنبية، مصنّفة بحسب البلد، ومربوطة بكتبها المنشورة وموقعها وبريدها الإلكتروني.",
        en: "Profile pages for Arab and foreign publishers, sorted by country and linked to their published books, site and email." } },
    { icon: "plus", title: { ar: "انشر كتابك", en: "Publish your book" },
      desc: { ar: "يعرض نبذات عن أعمال المؤلّفين والأدباء التي لم تُطبع بعد، والأطروحات الأكاديمية للباحثين، بهدف ترويجها وتعريف الناشرين بها.",
        en: "Showcases unpublished works by authors and writers and academic theses, to promote them to publishers." } },
    { icon: "newspaper", title: { ar: "حصاد الكتب", en: "Book Harvest" },
      desc: { ar: "تقارير دورية متخصّصة لأهمّ الكتب الصادرة في الأدب والفكر والثقافة والعلوم والفنون — لكل تصنيف تقرير منفصل.",
        en: "Periodic specialized reports on top books in literature, thought, culture, sciences and arts — one per category." } },
    { icon: "article", title: { ar: "العالم يقرأ", en: "The World Reads" },
      desc: { ar: "أخبار ونشرات صحفية يومية عن أهمّ الكتب الصادرة حديثًا.",
        en: "Daily news and press bulletins on the most important newly released books." } },
    { icon: "mic", title: { ar: "شاهد كتابك", en: "Watch Your Book" },
      desc: { ar: "فيديوهات قصيرة عن أهمّ الكتب الأجنبية والعربية الصادرة حديثًا، مرتبطة بقناة اليوتيوب ومنصّات السوشيال ميديا.",
        en: "Short videos on the latest foreign and Arab books, linked to YouTube and social platforms." } },
    { icon: "ideas", title: { ar: "زبدة الأفكار", en: "Essence of Ideas" },
      desc: { ar: "قسم خاص يقدّم قراءات تحليلية ومعمّقة للكتب المهمّة الصادرة حديثًا.",
        en: "A section offering deep, analytical readings of important new books." } },
    { icon: "bookMarked", title: { ar: "رواية في حكاية", en: "A Novel in a Story" },
      desc: { ar: "فيديوهات مختصرة للروايات الشهيرة لكبار الأدباء العرب والعالميين، في قالب سينمائي مبتكر.",
        en: "Short videos on famous novels by leading Arab and world authors, in an innovative cinematic style." } },
    { icon: "mic", title: { ar: "حديث الكتب", en: "Books Talk" },
      desc: { ar: "مقاطع صوتية عن الكتب الجديدة في عرض سريع وموجز (3–5 دقائق).",
        en: "Audio clips on new books in a quick, concise format (3–5 minutes)." } },
  ],
  biblioTitle: { ar: "ببليوجرافيا المنصة", en: "Platform bibliography" },
  biblio: { ar: "من أهمّ مخرجات المنصة توفير بيانات ببليوجرافية حديثة وكاملة عن الكتب الجديدة الصادرة في العالم. يقدّم المشروع خدمة توفير هذه البيانات المتجدّدة «يوميًا» إلى المكتبات الوطنية ومراكز البحوث ودور النشر العربية الكبرى المعنية بالترجمة، ويُنتقى نوع الكتب من بين أحدث الإصدارات في جميع أنحاء العالم وبكل اللغات؛ طبقًا لمعايير محدّدة تراعي مجالات الجهة المستفيدة.",
    en: "A core output is fresh, complete bibliographic data on new books worldwide. The project delivers this data — updated daily — to national libraries, research centers and major Arab publishers, with titles selected from the latest global releases by defined criteria." },
  outputsTitle: { ar: "مخرجات ومنتجات المنصة", en: "Platform outputs & products" },
  outputs: [
    { title: { ar: "مخرجات ببليوغرافية", en: "Bibliographic outputs" },
      desc: { ar: "بيانات حديثة ومتجدّدة عن الكتب الجديدة الصادرة في العالم مترجمة إلى العربية.", en: "Fresh, recurring data on new books worldwide translated into Arabic." },
      who: { ar: "المكتبات الوطنية · الجامعات ومراكز البحوث · دور النشر · الباحثون والمترجمون", en: "National libraries · Universities & research centers · Publishers · Researchers & translators" } },
    { title: { ar: "مخرجات صحفية", en: "Press outputs" },
      desc: { ar: "خدمة خبرية يومية عن أخبار الكتب.", en: "A daily news service on books." },
      who: { ar: "الصحف والمجلات · المواقع الإلكترونية · القنوات التلفزيونية", en: "Newspapers & magazines · Websites · TV channels" } },
    { title: { ar: "مخرجات بحثية", en: "Research outputs" },
      desc: { ar: "تقارير خاصة ونوعية مجمّعة وتحليلية عن الكتب الجديدة، تصدر أسبوعيًا وشهريًا.", en: "Curated, analytical reports on new books, issued weekly and monthly." },
      who: { ar: "مراكز البحوث والدراسات · المجلات العلمية المتخصّصة", en: "Research centers · Specialized scholarly journals" } },
    { title: { ar: "مخرجات صوتية ومرئية", en: "Audio & video outputs" },
      desc: { ar: "إنتاج بودكاست وفيديوهات عن أهمّ الكتب.", en: "Podcasts and videos on the most notable books." },
      who: { ar: "القنوات التلفزيونية والإذاعية · قنوات اليوتيوب والإنستغرام والتيك توك", en: "TV & radio channels · YouTube, Instagram & TikTok" } },
    { title: { ar: "مخرجات السوشيال ميديا", en: "Social media outputs" },
      desc: { ar: "صفحات متخصّصة بأخبار وعروض الكتب الأجنبية الجديدة.", en: "Dedicated pages for news and previews of new foreign books." },
      who: { ar: "الجمهور العربي على منصّات السوشيال ميديا", en: "Arab audiences across social platforms" } },
  ],
  closing: { ar: "ليست القصة هي عرض الكتب والتعريف بها وحدها، بل نهدف إلى جمع كل عناصر العملية الثقافية — من كُتّاب وناشرين ومترجمين وقرّاء — لتصبح المنصة منشّطًا لحركة الترجمة ومحرّكًا لصناعة النشر.",
    en: "Beyond presenting books, we aim to unite every part of the cultural process — writers, publishers, translators and readers — so the platform becomes an engine for translation and publishing." },
};

function ServicesScreen({ th, lang, setLang, goBack, onMenu }) {
  const S = window.BP.strings;
  const card = { background: th.surface, border: `1px solid ${th.border}`, borderRadius: 22,
    boxShadow: "0 4px 24px rgba(0,0,0,.05)" };

  return (
    <window.PageCol>
      <AppBar th={th} lang={lang} setLang={setLang} variant="title" title={L(S.menu.services, lang)}
        showBack onBack={goBack} onMenu={onMenu} />
      <div style={{ flex: 1, paddingBottom: 4 }}>
        <window.PageHero th={th} icon="briefcase" title={L(S.menu.services, lang)} subtitle={L(SERVICES.hero, lang)} />

        {/* خدمات المنصة — numbered list */}
        <window.InfoSection style={{ marginTop: 26 }}>
          <window.SectionTitle th={th}>{L(SERVICES.listTitle, lang)}</window.SectionTitle>
          <p style={{ margin: "0 0 16px", fontFamily: "Tajawal, sans-serif", fontSize: 15, lineHeight: 1.8, color: th.muted, textAlign: "center" }}>
            {L(SERVICES.listIntro, lang)}</p>
          <div style={{ ...card, padding: "8px 18px" }}>
            {SERVICES.list.map((it, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "15px 0",
                borderBottom: i === SERVICES.list.length - 1 ? "none" : `1px solid ${th.line}` }}>
                <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 999, background: th.red, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Cairo, sans-serif", fontWeight: 800, fontSize: 12.5 }}>{i + 1}</span>
                <p style={{ margin: 0, fontFamily: "Tajawal, sans-serif", fontSize: 14, lineHeight: 1.75, color: th.text }}>{L(it, lang)}</p>
              </div>
            ))}
          </div>
        </window.InfoSection>

        {/* خريطة مكونات المنصة */}
        <window.InfoSection>
          <window.SectionTitle th={th}>{L(SERVICES.mapTitle, lang)}</window.SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SERVICES.components.map((c, i) => (
              <div key={i} style={{ ...card, padding: "18px 16px" }}>
                <div style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
                  <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 12, background: th.redSoft, color: th.red,
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={c.icon} size={22} sw={1.8} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "Cairo, sans-serif", fontWeight: 800, fontSize: 16.5, color: th.text, marginBottom: 6 }}>{L(c.title, lang)}</div>
                    <p style={{ margin: 0, fontFamily: "Tajawal, sans-serif", fontSize: 13.5, lineHeight: 1.75, color: th.muted }}>{L(c.desc, lang)}</p>
                  </div>
                </div>
                {c.chips && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 13 }}>
                    {c.chips.map((ch, j) => (
                      <span key={j} style={{ fontFamily: "Cairo, sans-serif", fontWeight: 700, fontSize: 12, color: th.text,
                        background: th.surface2, border: `1px solid ${th.border}`, borderRadius: 999, padding: "5px 11px" }}>{ch}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </window.InfoSection>

        {/* ببليوجرافيا المنصة — red feature panel */}
        <window.InfoSection>
          <div style={{ background: `linear-gradient(150deg, ${th.red} 0%, ${th.redHover} 100%)`, borderRadius: 24,
            padding: "26px 22px", color: "#fff", position: "relative", overflow: "hidden" }}>
            <span style={{ position: "absolute", insetInlineEnd: 18, top: 18, color: "rgba(255,255,255,.9)" }}>
              <Icon name="bookMarked" size={30} color="#fff" sw={1.7} /></span>
            <span style={{ position: "absolute", insetInlineStart: -30, bottom: -34, width: 130, height: 130, borderRadius: 999, background: "#fff", opacity: .08 }} />
            <h2 style={{ margin: "0 0 14px", fontFamily: "Cairo, sans-serif", fontWeight: 800, fontSize: 24, maxWidth: 220, lineHeight: 1.25 }}>{L(SERVICES.biblioTitle, lang)}</h2>
            <p style={{ margin: 0, fontFamily: "Tajawal, sans-serif", fontSize: 14.5, lineHeight: 1.85, color: "rgba(255,255,255,.92)" }}>{L(SERVICES.biblio, lang)}</p>
          </div>
        </window.InfoSection>

        {/* مخرجات ومنتجات المنصة */}
        <window.InfoSection>
          <window.SectionTitle th={th}>{L(SERVICES.outputsTitle, lang)}</window.SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SERVICES.outputs.map((o, i) => (
              <div key={i} style={{ background: th.chrome, borderRadius: 20, padding: "20px 18px", color: "#fff", position: "relative", overflow: "hidden" }}>
                <span style={{ position: "absolute", insetInlineStart: 0, top: 0, bottom: 0, width: 4, background: th.red }} />
                <div style={{ fontFamily: "Cairo, sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 7 }}>{L(o.title, lang)}</div>
                <p style={{ margin: "0 0 14px", fontFamily: "Tajawal, sans-serif", fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,.78)" }}>{L(o.desc, lang)}</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 12 }}>
                  <div style={{ fontFamily: "Cairo, sans-serif", fontWeight: 700, fontSize: 11.5, letterSpacing: ".04em", color: th.red, marginBottom: 5 }}>
                    {lang === "ar" ? "الجهات المستهدفة" : "Target audience"}</div>
                  <div style={{ fontFamily: "Tajawal, sans-serif", fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,.7)" }}>{L(o.who, lang)}</div>
                </div>
              </div>
            ))}
          </div>
        </window.InfoSection>

        <window.BeliefBand th={th} text={L(SERVICES.closing, lang)} />
      </div>
    </window.PageCol>
  );
}

Object.assign(window, { ServicesScreen });
