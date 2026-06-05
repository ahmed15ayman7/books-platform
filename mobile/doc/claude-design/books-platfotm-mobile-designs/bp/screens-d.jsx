/* ============================================================
   Books Platform — Screens D: About (من نحن) + Team (فريق العمل)
   Mobile info pages. Content adapted from booksplatform.net.
   Shared info-page helpers exported for screens-e (Services).
   ============================================================ */

/* ---------------- shared info-page primitives ---------------- */
function InfoH2({ th, children, style = {} }) {
  return <h2 style={{ margin: "0 0 12px", fontFamily: "Cairo, sans-serif", fontWeight: 800,
    fontSize: 19, color: th.text, ...style }}>{children}</h2>;
}
function InfoSection({ children, style = {} }) {
  return <div style={{ padding: "0 16px", marginTop: 26, ...style }}>{children}</div>;
}

// dark hero block (matches Contact's InfoHero register)
function PageHero({ th, icon, title, subtitle }) {
  return (
    <div style={{ background: th.chrome, color: "#fff", padding: "26px 18px 28px", position: "relative", overflow: "hidden" }}>
      <span style={{ position: "absolute", insetInlineEnd: -30, top: -30, width: 140, height: 140, borderRadius: 999,
        background: th.red, opacity: .16 }} />
      <span style={{ position: "absolute", insetInlineStart: -34, bottom: -40, width: 120, height: 120, borderRadius: 999,
        background: "#fff", opacity: .04 }} />
      <span style={{ width: 48, height: 48, borderRadius: 14, background: th.red, display: "flex",
        alignItems: "center", justifyContent: "center", color: "#fff", marginBottom: 16 }}>
        <Icon name={icon} size={25} sw={1.8} /></span>
      <h1 style={{ margin: "0 0 8px", fontFamily: "Cairo, sans-serif", fontWeight: 800, fontSize: 27, lineHeight: 1.2 }}>{title}</h1>
      <p style={{ margin: 0, fontFamily: "Tajawal, sans-serif", fontSize: 14.5, lineHeight: 1.7,
        color: "rgba(255,255,255,.74)", maxWidth: 330 }}>{subtitle}</p>
    </div>
  );
}

// centered section heading with bookmark ornament (mirrors the live site rhythm)
function SectionTitle({ th, children, align = "center" }) {
  return (
    <div style={{ textAlign: align, marginBottom: 16 }}>
      <h2 style={{ margin: 0, fontFamily: "Cairo, sans-serif", fontWeight: 800, fontSize: 21, color: th.text }}>{children}</h2>
      <span style={{ display: "inline-flex", marginTop: 9, color: th.red }}>
        <Icon name="bookMarked" size={20} color={th.red} sw={1.9} /></span>
    </div>
  );
}

// belief line on dark chrome (page footer band)
function BeliefBand({ th, text }) {
  return (
    <div style={{ background: th.chrome, marginTop: 30, padding: "26px 24px", textAlign: "center" }}>
      <span style={{ display: "inline-flex", marginBottom: 12, color: th.red }}>
        <Icon name="bookMarked" size={22} color={th.red} sw={1.9} /></span>
      <p style={{ margin: 0, fontFamily: "Cairo, sans-serif", fontWeight: 700, fontSize: 16, lineHeight: 1.7, color: "#fff" }}>{text}</p>
    </div>
  );
}

/* ================= ABOUT (من نحن) ================= */
const ABOUT = {
  hero: { ar: "منصة الكتب العالمية | نافذة معرفية على ثقافات العالم",
          en: "Books Platform | A knowledge window onto the world's cultures" },
  intro: [
    { ar: "نشأت فكرة «منصة الكتب العالمية» لكي تكون مبادرة ثقافية عربية ومشروعًا رياديًا تنويريًا لمواكبة التقدّم العالمي في العلوم والمعارف، وتشجيع حركة الترجمة، وإعادة إحياء عادات القراءة ومفهوم الثقافة لدى المواطن العربي.",
      en: "Books Platform began as an Arab cultural initiative and a pioneering, enlightening project — keeping pace with global progress in science and knowledge, encouraging translation, and reviving reading habits and the idea of culture for the Arab reader." },
    { ar: "إن مبادرة «منصة الكتب العالمية» عملٌ طموح يحتاج إلى جهود كثيرة وشراكات متعدّدة، ومرشّح بقوة لأن يكون من أهم الكيانات الثقافية في العالم العربي. وهي مشروع مؤسسي يستوعب طاقات وكوادر مؤهّلة وخبرات فاعلة؛ لذا فهي منفتحة على كل أنواع الشراكة والدعم، ماديًا وتقنيًا وإعلاميًا وتسويقيًا.",
      en: "It is an ambitious effort that needs many hands and partnerships, and a strong candidate to become one of the Arab world's foremost cultural entities. As an institutional project welcoming capable talent and real expertise, it is open to every form of partnership and support — material, technical, media and marketing." },
  ],
  ideaTitle: { ar: "فكرة المنصة", en: "The platform idea" },
  idea: { ar: "تقوم فكرة «منصة الكتب العالمية» على إطلاق موقع إلكتروني وتطبيق على الهواتف الذكية، يقدّمان خدمة التعريف بالكتب الأجنبية الصادرة حديثًا والتي لم تُترجم بعد إلى العربية. وذلك من خلال رصد حركة النشر الأجنبي، ومواكبة ما تصدره دور النشر العالمية في تصنيفات العلوم والفنون والآداب والمعارف، وتوفير البيانات الببليوجرافية لكل كتاب، ونقل ذلك كله إلى القارئ العربي؛ لتشجيعه على القراءة وتعريفه بالإنتاج العلمي والثقافي العالمي.",
    en: "The idea rests on a website and a smartphone app that introduce newly released foreign books not yet translated into Arabic — by tracking foreign publishing, following what global publishers release across the sciences, arts, literature and knowledge, providing bibliographic data for every title, and bringing it all to the Arab reader to encourage reading and acquaint them with global scholarship and culture." },
  pillars: [
    { icon: "info", title: { ar: "الرؤية", en: "Vision" },
      text: { ar: "أن نشارك في ربط المجتمع العربي بمجتمعات العالم، وتعزيز التواصل والتفاهم بين الثقافات، وفتح مجالات الإبداع والتميّز عبر تنشيط حركة الترجمة من جهة، واستخدام وسائل منظّمة وموثّقة لتقديم خدمات الثقافة من جهة أخرى.",
        en: "To connect Arab society with the world's communities, strengthen cross-cultural understanding, and open avenues of creativity by energizing translation and offering culture through organized, documented means." } },
    { icon: "send", title: { ar: "الرسالة", en: "Mission" },
      text: { ar: "ندعم القارئ العربي بتقديم محتوى نافع يثري الوعي ويصقل الثقافة ويرفع درجة المعرفة، ونعيد المجتمعات العربية إلى عادات القراءة وساحات الثقافة، وننشئ بنية عربية متطوّرة معلوماتيًا وتكنولوجيًا.",
        en: "To support the Arab reader with content that enriches awareness and culture, return Arab societies to reading and cultural life, and build an Arab base advanced in information and technology." } },
    { icon: "target", title: { ar: "الأهداف", en: "Goals" },
      text: { ar: "أن تكون «منصة الكتب العالمية» منصّة الثقافة الأولى عربيًا، وواحدة من أهم المراكز العالمية البارزة لنشر المعرفة والثقافة وبثّ الوعي والفكر والتنوير.",
        en: "For Books Platform to be the Arab world's leading cultural platform and one of the foremost global hubs for spreading knowledge, culture and enlightenment." } },
    { icon: "shield", title: { ar: "السياسات", en: "Policies" },
      text: { ar: "أن ننفّذ كل أعمالنا وخدماتنا بشكل مهني واحترافي يراعي الضوابط والمعايير العلمية والقانونية والأخلاقية التي تحفظ حقوق الملكية الفكرية لكل الجهات.",
        en: "To deliver all our work professionally, observing the scholarly, legal and ethical standards that protect every party's intellectual-property rights." } },
  ],
  distinctTitle: { ar: "ما يميّز المنصة", en: "What sets us apart" },
  distinct: [
    { k: { ar: "أولًا", en: "First" }, ar: "نافذة إلكترونية تخاطب أكثر من 400 مليون عربي، وتتطلّع إلى خلق مناخ ثقافي منفتح على العالم، وتسعى إلى إتاحة فرص جديدة وواعدة لتنشيط حركة الترجمة وازدهار سوق الكتاب العربي.",
      en: "An online window addressing over 400 million Arabs, aiming to create an open cultural climate and new opportunities to energize translation and the Arab book market." },
    { k: { ar: "ثانيًا", en: "Second" }, ar: "منصة ثقافية وإعلامية جديدة هي الأولى من نوعها في العالم العربي، يستفيد منها قطاع واسع من القرّاء والمثقفين المهتمين بالاطّلاع الدائم على الكتب العالمية الحديثة، وللباحثين في مجالات تخصّصاتهم وبكل لغات العالم.",
      en: "A new cultural-media platform, the first of its kind in the Arab world, serving readers, intellectuals and researchers seeking the latest global books across every field and language." },
    { k: { ar: "ثالثًا", en: "Third" }, ar: "تقدّم خدمات ثقافية وإعلامية جديدة ومميّزة عبر إعداد نشرات إخبارية يومية عن الكتب الجديدة، وإنتاج فيديوهات وبودكاست عن أهمها، والتواصل مع الجمهور من خلال التطبيق وصفحات السوشيال ميديا.",
      en: "It offers distinctive cultural-media services: daily bulletins on new books, videos and podcasts on the most notable, and audience engagement through the app and social media." },
    { k: { ar: "رابعًا", en: "Fourth" }, ar: "وسيلة عملية لتسهيل التنسيق والتواصل المباشر مع الكتّاب والمؤلفين والباحثين ومؤسسات الفكر والإبداع، والناشرين العرب والأجانب.",
      en: "A practical channel for direct coordination with writers, authors, researchers, think-and-create institutions, and Arab and foreign publishers." },
  ],
  effortsTitle: { ar: "الجهود الحالية في نشر مبادرتنا", en: "Current efforts to spread our initiative" },
  efforts: [
    { k: { ar: "أولًا", en: "1" }, ar: "تعريف المؤسسات الدولية والعربية المعنية بالثقافة والنشر، والشخصيات العامة والفاعلة، بمشروع «منصة الكتب» وشرح أهدافه وأدواره ومراحله؛ بهدف عقد اتفاقيات شراكة ورعاية وتوفير تمويل مناسب لتطوير المشروع وتنفيذ مراحله.",
      en: "Introducing the project to international and Arab cultural and publishing institutions and public figures — to forge partnership and sponsorship agreements and secure suitable funding to develop it." },
    { k: { ar: "ثانيًا", en: "2" }, ar: "الاتجاه لإبرام اتفاقيات مع المكتبات الوطنية العربية لتوفير بيانات ببليوجرافية حديثة وكاملة ومتجدّدة يوميًا عن كل كتاب مهم يصدر في العالم وبكل اللغات، بما يفيد مراكز البحوث والدراسات ودور النشر الكبرى المعنية بالترجمة.",
      en: "Pursuing agreements with Arab national libraries to provide fresh, complete, daily-updated bibliographic data on every important book worldwide — benefiting research centers and major publishers." },
    { k: { ar: "ثالثًا", en: "3" }, ar: "التنسيق مع كبريات المؤسسات الصحفية لعرض خدماتنا الإعلامية الجديدة: أخبار يومية وتقارير خاصة نوعية ومجمّعة بعنوان «العالم العربي يقرأ» عن أهم الكتب الأجنبية والعربية الصادرة حديثًا، تصدر أسبوعيًا وشهريًا.",
      en: "Coordinating with leading press institutions for our new media services: daily news and special curated reports titled “The Arab World Reads”, issued weekly and monthly." },
    { k: { ar: "رابعًا", en: "4" }, ar: "التواصل مع قنوات تلفزيونية مهتمة بالمنتج الثقافي لعرض إنتاج فيديوهات قصيرة بعنوان «كلام الكتب»، يكون فيها الكتاب «متحدّثًا عن نفسه» باستخدام الجرافيك؛ بهدف جذب المشاهدين للقراءة عبر تبسيط المواد الثقافية.",
      en: "Engaging TV channels for short videos titled “Books Speak”, where a book “speaks for itself” through graphics — drawing viewers toward reading by simplifying cultural material." },
    { k: { ar: "خامسًا", en: "5" }, ar: "ترشيح المشروع لنيل الجوائز الثقافية المختصّة عربيًا ودوليًا، باعتباره مبادرة عربية رائدة تتيح للقارئ العربي متابعة كل كتاب مهم وآخر ما توصّلت إليه العقول الإنسانية، وتسعى لتنشيط الترجمة وازدهار سوق الكتاب العربي.",
      en: "Nominating the project for specialized Arab and international cultural awards as a pioneering initiative that lets the Arab reader follow every important book and the latest human thought." },
  ],
  belief: { ar: "غايتنا أن يعرف القارئ العربي بكل كتاب جديد يصدر في العالم", en: "Our aim: that the Arab reader knows every new book published in the world" },
};

function AboutScreen({ th, lang, setLang, goBack, onMenu }) {
  const S = window.BP.strings;
  const card = { background: th.surface, border: `1px solid ${th.border}`, borderRadius: 22,
    boxShadow: "0 4px 24px rgba(0,0,0,.05)" };
  const para = { margin: 0, fontFamily: "Tajawal, sans-serif", fontSize: 15, lineHeight: 1.85, color: th.muted };

  return (
    <window.PageCol>
      <AppBar th={th} lang={lang} setLang={setLang} variant="title" title={L(S.menu.about, lang)}
        showBack onBack={goBack} onMenu={onMenu} />
      <div style={{ flex: 1, paddingBottom: 4 }}>
        <PageHero th={th} icon="bookMarked" title={L(S.menu.about, lang)} subtitle={L(ABOUT.hero, lang)} />

        {/* تقديم */}
        <InfoSection style={{ marginTop: 26 }}>
          <SectionTitle th={th}>{lang === "ar" ? "تقديم" : "Introduction"}</SectionTitle>
          <div style={{ ...card, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            {ABOUT.intro.map((p, i) => <p key={i} style={para}>{L(p, lang)}</p>)}
          </div>
        </InfoSection>

        {/* فكرة المنصة */}
        <InfoSection>
          <div style={{ background: th.chrome, borderRadius: 24, padding: "24px 20px", color: "#fff", position: "relative", overflow: "hidden" }}>
            <span style={{ position: "absolute", insetInlineStart: -26, top: -26, width: 110, height: 110, borderRadius: 999, background: th.red, opacity: .18 }} />
            <div style={{ position: "relative" }}>
              <h2 style={{ margin: "0 0 14px", fontFamily: "Cairo, sans-serif", fontWeight: 800, fontSize: 24 }}>{L(ABOUT.ideaTitle, lang)}</h2>
              <p style={{ margin: 0, fontFamily: "Tajawal, sans-serif", fontSize: 15, lineHeight: 1.85, color: "rgba(255,255,255,.8)" }}>{L(ABOUT.idea, lang)}</p>
            </div>
          </div>
        </InfoSection>

        {/* الرؤية / الرسالة / الأهداف / السياسات */}
        <InfoSection>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {ABOUT.pillars.map((p, i) => (
              <div key={i} style={{ ...card, padding: "18px 15px", display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ width: 42, height: 42, borderRadius: 12, background: th.redSoft, color: th.red,
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={p.icon} size={22} sw={1.8} /></span>
                <div style={{ fontFamily: "Cairo, sans-serif", fontWeight: 800, fontSize: 16.5, color: th.text }}>{L(p.title, lang)}</div>
                <p style={{ margin: 0, fontFamily: "Tajawal, sans-serif", fontSize: 13, lineHeight: 1.75, color: th.muted }}>{L(p.text, lang)}</p>
              </div>
            ))}
          </div>
        </InfoSection>

        {/* ما يميز المنصة */}
        <InfoSection>
          <SectionTitle th={th} align="start">{L(ABOUT.distinctTitle, lang)}</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {ABOUT.distinct.map((d, i) => (
              <div key={i} style={{ ...card, padding: "16px 16px", display: "flex", gap: 13, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, minWidth: 52, height: 30, borderRadius: 999, background: th.red, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Cairo, sans-serif", fontWeight: 800, fontSize: 13, padding: "0 10px" }}>
                  {L(d.k, lang)}</span>
                <p style={{ margin: 0, fontFamily: "Tajawal, sans-serif", fontSize: 14, lineHeight: 1.8, color: th.muted }}>{L(d, lang)}</p>
              </div>
            ))}
          </div>
        </InfoSection>

        {/* الجهود الحالية */}
        <InfoSection>
          <SectionTitle th={th} align="start">{L(ABOUT.effortsTitle, lang)}</SectionTitle>
          <div style={{ ...card, padding: "8px 18px" }}>
            {ABOUT.efforts.map((e, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "16px 0",
                borderBottom: i === ABOUT.efforts.length - 1 ? "none" : `1px solid ${th.line}` }}>
                <span style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 999, border: `1.5px solid ${th.red}`,
                  color: th.red, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Cairo, sans-serif", fontWeight: 800, fontSize: 13 }}>{i + 1}</span>
                <p style={{ margin: 0, fontFamily: "Tajawal, sans-serif", fontSize: 14, lineHeight: 1.8, color: th.muted }}>{L(e, lang)}</p>
              </div>
            ))}
          </div>
        </InfoSection>

        <BeliefBand th={th} text={L(ABOUT.belief, lang)} />
      </div>
    </window.PageCol>
  );
}

/* ================= TEAM (فريق العمل) ================= */
const TEAM = {
  hero: { ar: "نؤمن بأن العمل الجماعي هو أساس بناء محتوى معرفي مؤثّر ومستدام",
          en: "We believe teamwork is the foundation of meaningful, lasting knowledge" },
  introTitle: { ar: "فريق عمل منصة الكتب العالمية", en: "The Books Platform team" },
  intro: { ar: "يضمّ فريق عمل منصة الكتب العالمية نخبة من المتخصّصين في النشر والتقنية والإعلام والتسويق، يعملون معًا برؤية واحدة تهدف إلى دعم المعرفة، وتشجيع الإبداع، وتقديم محتوى ثقافي موثوق يخدم القارئ والكاتب والباحث.",
    en: "The Books Platform team brings together specialists in publishing, technology, media and marketing, working toward one vision: supporting knowledge, encouraging creativity, and offering trustworthy cultural content for readers, writers and researchers." },
  members: [
    { init: "ع م", g: ["#2b2540", "#46467f"], name: { ar: "عاطف مظهر", en: "Atef Mazhar" }, role: { ar: "المدير العام", en: "General Manager" },
      bio: { ar: "المؤسّس وصاحب الرؤية الاستراتيجية للمشروع، ويتولّى مهام الإدارة العليا والإشراف العام.",
        en: "Founder and strategic visionary of the project; leads executive management and general oversight." } },
    { init: "م م", g: ["#8b1623", "#b11e2e"], name: { ar: "مريم مظهر", en: "Mariam Mazhar" }, role: { ar: "المدير التنفيذي", en: "Executive Director" },
      bio: { ar: "تقود رؤية المنصة وتشرف على استراتيجيات التطوير والتوسّع، بما يضمن تحقيق رسالتها الثقافية والمعرفية.",
        en: "Leads the platform's vision and oversees growth strategy, ensuring its cultural and knowledge mission." } },
    { init: "س م", g: ["#0f3d3e", "#1f7a6d"], name: { ar: "سارة مظهر", en: "Sara Mazhar" }, role: { ar: "مديرة التقنيات", en: "Head of Technology" },
      bio: { ar: "تشرف على البنية التقنية للمنصة وتطوير الأنظمة الرقمية بما يضمن تجربة مستخدم سلسة وآمنة.",
        en: "Oversees the platform's technical infrastructure and digital systems for a smooth, secure experience." } },
    { init: "م و", g: ["#1e1b4b", "#4338ca"], name: { ar: "محمد أبو الوفا", en: "Mohamed Abu Al-Wafa" }, role: { ar: "مدير التحرير (الإنجليزية)", en: "Editor-in-Chief (English)" },
      bio: { ar: "يشرف على المحتوى التحريري ومراجعة الأعمال الأدبية والفكرية، وضمان جودتها واتساقها مع معايير المنصة.",
        en: "Oversees editorial content and review of literary and intellectual works to platform standards." } },
    { init: "ه م", g: ["#7a4a12", "#c8902a"], name: { ar: "هاني موافي", en: "Hany Mowafy" }, role: { ar: "مدير التحرير (العربية)", en: "Editor-in-Chief (Arabic)" },
      bio: { ar: "يتولّى إدارة المحتوى الثقافي والفكري، والتنسيق مع الكتّاب والمؤلفين والباحثين.",
        en: "Manages cultural and intellectual content and liaises with writers, authors and researchers." } },
    { init: "ز ش", g: ["#3a0d18", "#7a1f33"], name: { ar: "زكريا الشال", en: "Zakaria El-Shal" }, role: { ar: "مدير التسويق", en: "Marketing Director" },
      bio: { ar: "مسؤول عن بناء الهوية التسويقية للمنصة وتعزيز حضورها الرقمي والتواصل مع الجمهور والمهتمين بصناعة الكتاب.",
        en: "Builds the marketing identity, strengthens digital presence and engages the book-industry audience." } },
    { init: "ع س", g: ["#1f2937", "#475569"], name: { ar: "عبد الرحمن سعيد", en: "Abdelrahman Saeed" }, role: { ar: "مدير وحدة المونتاج و AI", en: "Head of Editing & AI" },
      bio: { ar: "يشرف على المحتوى المرئي والتقنيات المعتمدة على الذكاء الاصطناعي لدعم التجربة البصرية والمعرفية.",
        en: "Leads visual content and AI-based tooling supporting the platform's visual experience." } },
    { init: "ح ف", g: ["#14331f", "#2f7a45"], name: { ar: "د. حاتم فرج", en: "Dr. Hatem Farag" }, role: { ar: "المستشار العلمي", en: "Scientific Advisor" },
      bio: { ar: "يقدّم الإشراف العلمي والمنهجي على الأبحاث والأطروحات الأكاديمية المنشورة عبر المنصة.",
        en: "Provides scientific and methodological oversight of research and academic work on the platform." } },
    { init: "أ ش", g: ["#5c4326", "#a9824a"], name: { ar: "أحمد الشال", en: "Ahmed El-Shal" }, role: { ar: "مدير البرمجة و SEO", en: "Dev & SEO Lead" },
      bio: { ar: "مسؤول عن تطوير الموقع تقنيًا وتحسين ظهوره في محرّكات البحث لضمان وصول المحتوى لأكبر شريحة من القرّاء.",
        en: "Handles site development and SEO so content reaches the widest possible readership." } },
  ],
  belief: { ar: "العمل الجماعي هو أساس بناء محتوى معرفي مؤثّر ومستدام", en: "Teamwork is the foundation of meaningful, lasting knowledge" },
};

function TeamScreen({ th, lang, setLang, goBack, onMenu }) {
  const S = window.BP.strings;
  return (
    <window.PageCol>
      <AppBar th={th} lang={lang} setLang={setLang} variant="title" title={L(S.menu.team, lang)}
        showBack onBack={goBack} onMenu={onMenu} />
      <div style={{ flex: 1, paddingBottom: 4 }}>
        <PageHero th={th} icon="users" title={L(S.menu.team, lang)} subtitle={L(TEAM.hero, lang)} />

        {/* intro */}
        <InfoSection style={{ marginTop: 26 }}>
          <SectionTitle th={th}>{L(TEAM.introTitle, lang)}</SectionTitle>
          <p style={{ margin: 0, fontFamily: "Tajawal, sans-serif", fontSize: 15, lineHeight: 1.85, color: th.muted, textAlign: "center" }}>
            {L(TEAM.intro, lang)}</p>
        </InfoSection>

        {/* members */}
        <InfoSection>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {TEAM.members.map((m, i) => (
              <div key={i} style={{ background: th.surface, border: `1px solid ${th.border}`, borderRadius: 22,
                boxShadow: "0 4px 24px rgba(0,0,0,.05)", padding: "18px 16px", display: "flex", gap: 15, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, width: 64, height: 64, borderRadius: 999,
                  background: `linear-gradient(150deg, ${m.g[1]} 0%, ${m.g[0]} 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
                  fontFamily: "Cairo, sans-serif", fontWeight: 800, fontSize: 20,
                  boxShadow: "0 4px 14px rgba(0,0,0,.18)", border: `2px solid ${th.surface}` }}>{m.init}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Cairo, sans-serif", fontWeight: 800, fontSize: 17, color: th.text }}>{L(m.name, lang)}</div>
                  <div style={{ fontFamily: "Cairo, sans-serif", fontWeight: 700, fontSize: 12.5, color: th.red, marginTop: 2, marginBottom: 8 }}>{L(m.role, lang)}</div>
                  <p style={{ margin: 0, fontFamily: "Tajawal, sans-serif", fontSize: 13.5, lineHeight: 1.75, color: th.muted }}>{L(m.bio, lang)}</p>
                </div>
              </div>
            ))}
          </div>
        </InfoSection>

        <BeliefBand th={th} text={L(TEAM.belief, lang)} />
      </div>
    </window.PageCol>
  );
}

Object.assign(window, { InfoH2, InfoSection, PageHero, SectionTitle, BeliefBand, AboutScreen, TeamScreen });
