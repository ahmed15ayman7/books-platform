/* ============================================================
   Books Platform — shared UI primitives (exports to window)
   ============================================================ */
const { useState } = React;

// pick localized value
function L(obj, lang) { return obj ? (obj[lang] ?? obj.ar) : ""; }

// ---- icon set (Lucide-style, stroke inherits color) ----
function Icon({ name, size = 22, sw = 1.8, color = "currentColor", flip = false, style = {} }) {
  const P = {
    search:'<circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.3-4.3"/>',
    cart:'<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h2.2l2.3 12a1.6 1.6 0 0 0 1.6 1.3h8.9a1.6 1.6 0 0 0 1.6-1.3L21 7H5.2"/>',
    bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    back:'<path d="m9 18 6-6-6-6"/>',
    share:'<circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="m8.5 13.3 6.8 4M15.3 6.6 8.5 10.7"/>',
    heart:'<path d="M19 14c1.5-1.46 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.04 3 5.5l7 7z"/>',
    filter:'<path d="M3 5h18M6 12h12M10 19h4"/>',
    sliders:'<path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h8M16 18h4"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="14" cy="18" r="2"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    minus:'<path d="M5 12h14"/>',
    trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
    check:'<path d="M20 6 9 17l-5-5"/>',
    refresh:'<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    chevronDown:'<path d="m6 9 6 6 6-6"/>',
    x:'<path d="M18 6 6 18M6 6l12 12"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18"/>',
    star:'<path d="m12 2.5 2.9 6 6.6.6-5 4.4 1.5 6.4L12 17.8 6 19.9l1.5-6.4-5-4.4 6.6-.6z"/>',
    home:'<path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    article:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    building:'<path d="M3 21h18M5 21V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v16M14 21V9h4a1 1 0 0 1 1 1v11"/><path d="M8 8h2M8 12h2M8 16h2"/>',
    // category icons
    ideas:'<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 0-2.5-2.5H3v-13a1 1 0 0 1 1-1z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 1 2.5-2.5H21v-13a1 1 0 0 0-1-1z"/>',
    social:'<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 2.5 9 2.5 12 0v-5"/>',
    philos:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    economy:'<path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 5-6"/>',
    lang:'<path d="M4 5h10M9 3v2M11 5c0 4-3 7-7 8M7 8c1 2 3 3.5 6 4"/><path d="m13 21 4-9 4 9M14.5 17h5"/>',
    tech:'<path d="M10 2v7.5L4.5 18A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3.1L14 9.5V2"/><path d="M8.5 2h7M9 14h6"/>',
    religion:'<path d="M3 7h18M3 7l9-4 9 4M5 7v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7"/><path d="M9 21V12h6v9"/>',
    other:'<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>',
    pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="2.6"/>',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={name==='star'||name==='heart-fill'?color:'none'}
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: flip ? "scaleX(-1)" : "none", display:"block", ...style }}
      dangerouslySetInnerHTML={{ __html: P[name] || "" }} />
  );
}

// ---- translation status badge ----
function StatusBadge({ status, lang, small = false }) {
  const s = window.BP.status[status]; if (!s) return null;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", background:s.color, color:"#fff",
      fontWeight:700, fontSize: small?10:11.5, padding: small?"2px 7px":"3px 10px", borderRadius:999,
      lineHeight:1.3, whiteSpace:"nowrap" }}>{L(s, lang)}</span>
  );
}

// ---- book cover placeholder (colored, not gray) ----
function BookCover({ book, lang, radius = 0, style = {} }) {
  const [a, b] = book.cover;
  return (
    <div style={{ position:"relative", width:"100%", height:"100%", borderRadius:radius, overflow:"hidden",
      background:`linear-gradient(150deg, ${b} 0%, ${a} 100%)`, display:"flex", flexDirection:"column",
      justifyContent:"space-between", padding:"14px 14px 14px 18px", boxSizing:"border-box", ...style }}>
      {/* spine */}
      <div style={{ position:"absolute", insetInlineEnd:0, top:0, bottom:0, width:6,
        background:"rgba(0,0,0,.22)", boxShadow:"inset -1px 0 2px rgba(255,255,255,.15)" }} />
      <div style={{ fontSize:9, letterSpacing:".12em", color:"rgba(255,255,255,.62)", fontWeight:700,
        fontFamily:"Inter, sans-serif", textTransform:"uppercase" }}>{book.publisher}</div>
      <div style={{ fontFamily:"Cairo, sans-serif", fontWeight:700, color:"#fff",
        fontSize:"clamp(13px,4.4vw,17px)", lineHeight:1.35, textShadow:"0 1px 8px rgba(0,0,0,.3)" }}>
        {L({ar:book.titleAr,en:book.titleEn}, lang)}
      </div>
      <div style={{ fontSize:10.5, color:"rgba(255,255,255,.7)", fontFamily:"Inter, sans-serif", fontStyle:"italic" }}>
        {lang==="ar" ? book.titleEn : book.titleAr}
      </div>
    </div>
  );
}

// ---- book card (grid/list) ----
function BookCard({ book, lang, th, onClick, width, showDesc = true }) {
  const cat = window.BP.catBy[book.cat];
  return (
    <button onClick={onClick} style={{ width, textAlign:"start", border:`1px solid ${th.border}`,
      background:th.surface, borderRadius:24, overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,.06)",
      cursor:"pointer", padding:0, display:"flex", flexDirection:"column", font:"inherit",
      transition:"transform .3s "+window.BP.tokens.spring }}
      onMouseDown={e=>e.currentTarget.style.transform="scale(.98)"}
      onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
      onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
      <div style={{ position:"relative", aspectRatio:"3/4", borderTopLeftRadius:24, borderTopRightRadius:24, overflow:"hidden" }}>
        <BookCover book={book} lang={lang} />
        {book.isNew && <span style={{ position:"absolute", top:8, insetInlineStart:8, background:th.red,
          color:"#fff", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:999 }}>{lang==="ar"?"جديد":"New"}</span>}
      </div>
      <div style={{ padding:11, display:"flex", flexDirection:"column", gap:5 }}>
        <span style={{ fontSize:11, fontWeight:700, color:th.red }}>{L(cat, lang)}</span>
        <div style={{ fontFamily:"Cairo, sans-serif", fontWeight:700, fontSize:14.5, color:th.text, lineHeight:1.45,
          display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", minHeight:"2.9em" }}>
          {L({ar:book.titleAr,en:book.titleEn}, lang)}</div>
        <span style={{ fontSize:11.5, color:th.muted }}>{book.publisher}</span>
        <div><StatusBadge status={book.status} lang={lang} small /></div>
      </div>
    </button>
  );
}

// ---- category chip (pill, icon + label) ----
function CategoryChip({ cat, lang, th, onClick, active }) {
  return (
    <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0,
      background: active?th.red:th.surface, color: active?"#fff":th.text, border:`1px solid ${active?th.red:th.border}`,
      borderRadius:999, padding:"9px 15px 9px 12px", cursor:"pointer", font:"inherit",
      boxShadow:"0 4px 24px rgba(0,0,0,.05)", whiteSpace:"nowrap" }}>
      <span style={{ width:30, height:30, borderRadius:999, display:"flex", alignItems:"center", justifyContent:"center",
        background: active?"rgba(255,255,255,.2)":th.redSoft, color: active?"#fff":th.red }}>
        <Icon name={cat.icon} size={17} sw={1.6} /></span>
      <span style={{ fontFamily:"Cairo, sans-serif", fontWeight:700, fontSize:13.5 }}>{L(cat, lang)}</span>
    </button>
  );
}

// ---- section header (title + see-all) ----
function SectionHeader({ title, onAll, lang, th, allLabel }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px", marginBottom:12 }}>
      <h2 style={{ margin:0, fontFamily:"Cairo, sans-serif", fontWeight:800, fontSize:19, color:th.text }}>{title}</h2>
      {onAll && <button onClick={onAll} style={{ display:"flex", alignItems:"center", gap:4, background:"none",
        border:"none", color:th.red, fontWeight:700, fontSize:13, cursor:"pointer", font:"inherit" }}>
        {allLabel || L(window.BP.strings.seeAll, lang)} <Icon name="back" size={15} flip={lang==="ar"} /></button>}
    </div>
  );
}

// ---- language toggle pill ----
function LangToggle({ lang, setLang, th }) {
  return (
    <div style={{ display:"flex", alignItems:"center", background:th.surface2, borderRadius:999, padding:3,
      border:`1px solid ${th.border}` }}>
      {["ar","en"].map(l => (
        <button key={l} onClick={()=>setLang(l)} style={{ border:"none", cursor:"pointer", font:"inherit",
          borderRadius:999, padding:"4px 11px", fontSize:12, fontWeight:700,
          background: lang===l?th.red:"transparent", color: lang===l?"#fff":th.muted }}>
          {l==="ar"?"ع":"EN"}</button>
      ))}
    </div>
  );
}

// ---- app bar ----
function AppBar({ th, lang, setLang, variant="home", title, subtitle, showBack, onBack,
                 onSearch, onCart, cartCount = 0, trailing }) {
  return (
    <div style={{ position:"sticky", top:0, zIndex:30, background:th.surface,
      borderBottom:`1px solid ${th.line}`, paddingTop:52, paddingBottom:12, paddingInline:16,
      boxShadow:"0 4px 24px rgba(0,0,0,.04)" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
        {/* leading (right in RTL): logo or back+title */}
        <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
          {showBack && <button onClick={onBack} style={{ width:38, height:38, borderRadius:999, flexShrink:0,
            border:`1px solid ${th.border}`, background:th.surface, display:"flex", alignItems:"center",
            justifyContent:"center", cursor:"pointer", color:th.text }}>
            <Icon name="back" size={20} flip={lang!=="ar"} /></button>}
          {variant==="home" ? (
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:34, height:34, borderRadius:9, background:th.red, display:"flex",
                alignItems:"center", justifyContent:"center", color:"#fff" }}><Icon name="ideas" size={20} sw={1.7} /></span>
              <div style={{ lineHeight:1.1 }}>
                <div style={{ fontFamily:"Cairo, sans-serif", fontWeight:800, fontSize:15, color:th.text }}>
                  {lang==="ar"?"منصة الكتب":"Books"}</div>
                <div style={{ fontSize:8.5, letterSpacing:".14em", color:th.red, fontWeight:700, fontFamily:"Inter" }}>
                  {lang==="ar"?"العالمية":"PLATFORM"}</div>
              </div>
            </div>
          ) : (
            <div style={{ minWidth:0 }}>
              <div style={{ fontFamily:"Cairo, sans-serif", fontWeight:800, fontSize:18, color:th.text,
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{title}</div>
              {subtitle && <div style={{ fontSize:12, color:th.muted, marginTop:1 }}>{subtitle}</div>}
            </div>
          )}
        </div>
        {/* trailing (left in RTL): lang + icons */}
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <LangToggle lang={lang} setLang={setLang} th={th} />
          {trailing}
          {onSearch && <button onClick={onSearch} style={iconBtn(th)}><Icon name="search" size={20} /></button>}
          {onCart && <button onClick={onCart} style={{ ...iconBtn(th), position:"relative" }}>
            <Icon name="cart" size={20} />
            {cartCount>0 && <span style={{ position:"absolute", top:-3, insetInlineEnd:-3, background:th.red, color:"#fff",
              fontSize:10, fontWeight:700, minWidth:17, height:17, borderRadius:999, display:"flex",
              alignItems:"center", justifyContent:"center", padding:"0 3px" }}>{cartCount}</span>}
          </button>}
        </div>
      </div>
    </div>
  );
}
function iconBtn(th){ return { width:38, height:38, borderRadius:999, border:`1px solid ${th.border}`,
  background:th.surface, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:th.text }; }

// ---- bottom navigation with center FAB ----
function BottomNav({ active, go, lang, th }) {
  const S = window.BP.strings.nav;
  const tabs = [
    { key:"home", icon:"home", label:S.home },
    { key:"books", icon:"book", label:S.books },
    null, // FAB slot
    { key:"articles", icon:"article", label:S.articles },
    { key:"publishers", icon:"building", label:S.publishers },
  ];
  return (
    <div style={{ position:"sticky", bottom:0, left:0, right:0, zIndex:40, marginTop:"auto" }}>
      <div style={{ position:"relative", background:th.surface, borderTop:`1px solid ${th.line}`,
        boxShadow:"0 -8px 30px rgba(0,0,0,.06)", paddingBottom:26, paddingTop:8 }}>
        <div style={{ display:"flex", justifyContent:"space-around", alignItems:"center" }}>
          {tabs.map((t,i) => t ? (
            <button key={t.key} onClick={()=>go(t.key)} style={{ flex:1, background:"none", border:"none", cursor:"pointer",
              font:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:3,
              color: active===t.key?th.red:th.faint }}>
              <Icon name={t.icon} size={23} sw={active===t.key?2:1.7} />
              <span style={{ fontFamily:"Cairo, sans-serif", fontSize:10.5, fontWeight: active===t.key?700:600 }}>{L(t.label, lang)}</span>
            </button>
          ) : <div key="fab" style={{ flex:1 }} />)}
        </div>
        {/* elevated FAB */}
        <button onClick={()=>go("publish")} style={{ position:"absolute", top:-22, left:"50%", transform:"translateX(-50%)",
          width:58, height:58, borderRadius:999, background:th.red, border:`4px solid ${th.surface}`, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", color:"#fff",
          boxShadow:"0 8px 28px rgba(177,30,46,.5)" }}>
          <Icon name="plus" size={26} sw={2.4} />
        </button>
      </div>
    </div>
  );
}

// ---- primary / secondary buttons ----
function Btn({ children, onClick, th, variant="primary", full, lang, style={} }) {
  const base = { height:52, borderRadius:24, fontFamily:"Cairo, sans-serif", fontWeight:700, fontSize:16,
    cursor:"pointer", border:"none", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
    width: full?"100%":"auto", padding:"0 22px", transition:"transform .2s", font:"inherit", ...style };
  const variants = {
    primary:{ background:th.red, color:"#fff", boxShadow:"0 8px 28px rgba(177,30,46,.28)" },
    secondary:{ background:"transparent", color:th.red, border:`1.5px solid ${th.red}` },
    dark:{ background:th.chrome, color:"#fff" },
    ghost:{ background:th.surface2, color:th.text },
  };
  return <button onClick={onClick} style={{ ...base, ...variants[variant] }}
    onMouseDown={e=>e.currentTarget.style.transform="scale(.98)"}
    onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>{children}</button>;
}

Object.assign(window, { L, Icon, StatusBadge, BookCover, BookCard, CategoryChip,
  SectionHeader, LangToggle, AppBar, BottomNav, Btn, iconBtn });
