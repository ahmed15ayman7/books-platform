/* ============================================================
   Books Platform — Onboarding (3 screens, swipeable, bilingual)
   ============================================================ */
const { useState: useStateOB, useRef: useRefOB } = React;

const OB_SLIDES = [
  { img:"assets/onboard-discover.png", accent:"#b11e2e",
    titleAr:"نافذة العالم على الكتب", titleEn:"The World's Window on Books",
    subAr:"اكتشف كل كتاب مهم يصدر حول العالم، مصنّفاً في ثمانية حقول معرفية ومقدَّماً للقارئ العربي.",
    subEn:"Discover every significant book published worldwide — sorted into eight fields of knowledge and introduced for the Arab reader." },
  { img:"assets/onboard-translate.png", accent:"#46467f",
    titleAr:"تابِع رحلة الترجمة", titleEn:"Follow the Translation Journey",
    subAr:"اعرف ما تُرجم وما هو مرشّح للترجمة، وافتح نافذة معرفية على أفكار وعلوم العالم بلغتك.",
    subEn:"See what's translated and what's nominated for translation — a window onto the world's ideas and sciences, in your language." },
  { img:"assets/onboard-publish.png", accent:"#b11e2e",
    titleAr:"اقرأ، اقتنِ، وانشر", titleEn:"Read, Collect & Publish",
    subAr:"اقتنِ الكتب التي تحب، وامنح كتابك فرصته الأولى للانتشار — كتابك الأول يُنشر مجاناً.",
    subEn:"Collect the books you love, and give your own book its first chance to reach readers — your first book is published free." },
];

function Onboarding({ th, lang, setLang, finish, dark }) {
  const [i, setI] = useStateOB(0);
  const [dir, setDir] = useStateOB(1);
  const startX = useRefOB(null);
  const last = i === OB_SLIDES.length - 1;
  const s = OB_SLIDES[i];

  const goto = (n) => { if (n < 0 || n >= OB_SLIDES.length) return; setDir(n > i ? 1 : -1); setI(n); };
  const next = () => last ? finish() : goto(i + 1);
  // RTL: swipe right-to-left advances
  const onDown = (e) => { startX.current = (e.touches ? e.touches[0].clientX : e.clientX); };
  const onUp = (e) => { if (startX.current == null) return;
    const x = (e.changedTouches ? e.changedTouches[0].clientX : e.clientX);
    const dx = x - startX.current; startX.current = null;
    if (Math.abs(dx) < 45) return;
    const fwd = lang === "ar" ? dx > 0 : dx < 0;   // RTL: drag toward start (right) = next
    goto(fwd ? i + 1 : i - 1);
  };

  return (
    <div onPointerDown={onDown} onPointerUp={onUp} onTouchStart={onDown} onTouchEnd={onUp}
      style={{ height:"100%", display:"flex", flexDirection:"column", background:th.bg, position:"relative",
        overflow:"hidden", paddingTop:52 }}>

      {/* ambient brand wash top */}
      <div style={{ position:"absolute", top:-120, left:"50%", transform:"translateX(-50%)", width:520, height:360,
        background:`radial-gradient(ellipse at center, ${s.accent}22, transparent 70%)`, pointerEvents:"none",
        transition:"background .4s" }} />

      {/* top bar: brand + lang + skip */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"4px 18px 0", zIndex:2 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ width:30, height:30, borderRadius:8, background:th.red, display:"flex",
            alignItems:"center", justifyContent:"center", color:"#fff" }}><Icon name="ideas" size={17} sw={1.7} /></span>
          <span style={{ fontFamily:"Cairo", fontWeight:800, fontSize:14, color:th.text }}>
            {lang==="ar"?"منصة الكتب":"Books"}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <LangToggle lang={lang} setLang={setLang} th={th} />
          {!last && <button onClick={finish} style={{ background:"none", border:"none", cursor:"pointer",
            color:th.muted, fontFamily:"Cairo", fontWeight:700, fontSize:13.5, font:"inherit" }}>
            {lang==="ar"?"تخطّي":"Skip"}</button>}
        </div>
      </div>

      {/* illustration */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"8px 20px 0", zIndex:1, minHeight:0 }}>
        <img key={"img"+i} src={s.img} alt="" draggable="false"
          style={{ width:"100%", maxWidth:330, height:"auto", objectFit:"contain", userSelect:"none",
            animation:`obIn .5s ${window.BP.tokens.spring} both` }} />
      </div>

      {/* text */}
      <div key={"txt"+i} style={{ padding:"0 28px", textAlign:"center", zIndex:2,
        animation:`obUp .5s ${window.BP.tokens.smooth} both` }}>
        <h2 style={{ margin:"0 0 12px", fontFamily:"Cairo", fontWeight:800, fontSize:25, lineHeight:1.4, color:th.text }}>
          {lang==="ar"?s.titleAr:s.titleEn}</h2>
        <p style={{ margin:"0 auto", maxWidth:320, fontSize:15, lineHeight:1.85, color:th.muted }}>
          {lang==="ar"?s.subAr:s.subEn}</p>
      </div>

      {/* controls */}
      <div style={{ padding:"26px 28px 40px", zIndex:2 }}>
        {/* dots */}
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:22 }}>
          {OB_SLIDES.map((_, n) => (
            <button key={n} onClick={()=>goto(n)} aria-label={"slide "+(n+1)} style={{ border:"none", cursor:"pointer",
              padding:0, height:8, width: n===i?26:8, borderRadius:999, background: n===i?th.red:th.border,
              transition:"all .35s "+window.BP.tokens.spring }} />
          ))}
        </div>
        <Btn th={th} variant="primary" full lang={lang} onClick={next}>
          {last ? (lang==="ar"?"ابدأ الآن":"Get started") : (lang==="ar"?"التالي":"Next")}
          <Icon name={last?"check":"back"} size={18} color="#fff" flip={!last && lang==="ar"} sw={last?2.4:1.8} />
        </Btn>
      </div>
    </div>
  );
}

window.Onboarding = Onboarding;
