/* ============================================================
   Books Platform — App shell: state, navigation, theme, tweaks
   ============================================================ */
const { useState: useS, useEffect: useE } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "lang": "ar",
  "primary": "#B11E2E",
  "cornerStyle": "soft"
}/*EDITMODE-END*/;

const SCREENS = [
  { key:"onboarding", ar:"الترحيب (3 شاشات)", en:"Onboarding (3)" },
  { key:"home",       ar:"الرئيسية",        en:"Home" },
  { key:"books",      ar:"كتالوج الكتب",     en:"Books Catalog" },
  { key:"detail",     ar:"تفاصيل الكتاب",    en:"Book Detail" },
  { key:"publishers", ar:"الناشرون",         en:"Publishers" },
  { key:"articles",   ar:"المقالات",         en:"Articles" },
  { key:"articleDetail", ar:"تفاصيل المقال",   en:"Article Detail" },
  { key:"cart",       ar:"السلة",            en:"Cart" },
  { key:"publish",    ar:"انشر كتابك",       en:"Publish" },
  { key:"search",     ar:"البحث",            en:"Search" },
  { key:"about",      ar:"من نحن",          en:"About Us" },
  { key:"services",   ar:"خدماتنا",         en:"Our Services" },
  { key:"team",       ar:"فريق العمل",      en:"Our Team" },
  { key:"contact",    ar:"تواصل معنا",       en:"Contact" },
];

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const dark = t.dark, lang = t.lang;
  const setLang = (l) => setTweak("lang", l);

  const [stack, setStack] = useS(["onboarding"]);
  const [bookId, setBookId] = useS("memory");
  const [articleId, setArticleId] = useS("a1");
  const [cart, setCart] = useS({ "justice":1, "burnout":2 });
  const [toastMsg, setToastMsg] = useS(null);
  const [menuOpen, setMenuOpen] = useS(false);

  const screen = stack[stack.length-1];
  const go = (key) => setStack(s => s[s.length-1]===key ? s : [...s, key]);
  const goBack = () => setStack(s => s.length>1 ? s.slice(0,-1) : s);
  const openBook = (id) => { setBookId(id); setStack(s => [...s, "detail"]); };
  const openArticle = (id) => { setArticleId(id); setStack(s => [...s, "articleDetail"]); };
  const openCart = () => go("cart");
  const jump = (key) => { setBookId(prev=>prev||"memory"); setStack([key]); };

  const addToCart = (id) => setCart(c => ({ ...c, [id]: (c[id]||0)+1 }));
  const updateQty = (id, d) => setCart(c => {
    const q = (c[id]||0)+d; const n = { ...c }; if (q<=0) delete n[id]; else n[id]=q; return n; });
  const removeItem = (id) => setCart(c => { const n={...c}; delete n[id]; return n; });
  const cartCount = Object.values(cart).reduce((a,b)=>a+b,0);

  const toast = (m) => { setToastMsg(m); };
  useE(() => { if (!toastMsg) return; const id = setTimeout(()=>setToastMsg(null), 1800); return ()=>clearTimeout(id); }, [toastMsg]);

  // theme with primary override + corner style
  const base = window.BP.theme(dark);
  const th = { ...base, red: t.primary, redHover: t.primary };
  const radius = t.cornerStyle==="sharp" ? 0.6 : 1;

  const common = { th, lang, setLang, go, goBack, openBook, openCart, cartCount, openArticle };
  const onMenu = () => setMenuOpen(true);
  const menuCommon = { ...common, onMenu };
  let content;
  switch (screen) {
    case "onboarding": content = <window.Onboarding th={th} lang={lang} setLang={setLang} dark={dark} finish={()=>setStack(["home"])} />; break;
    case "books":      content = <CatalogScreen {...common} />; break;
    case "detail":     content = <DetailScreen {...common} book={window.BP.bookBy[bookId]} addToCart={addToCart} toast={toast} />; break;
    case "publishers": content = <PublishersScreen {...common} />; break;
    case "articles":   content = <ArticlesScreen {...common} />; break;
    case "articleDetail": content = <ArticleDetailScreen {...common} article={window.BP.articleBy[articleId]} toast={toast} />; break;
    case "cart":       content = <CartScreen {...common} cart={cart} updateQty={updateQty} removeItem={removeItem} />; break;
    case "publish":    content = <PublishScreen {...common} />; break;
    case "search":     content = <SearchScreen {...common} dark={dark} />; break;
    case "about":      content = <window.AboutScreen {...menuCommon} />; break;
    case "services":   content = <window.ServicesScreen {...menuCommon} />; break;
    case "team":       content = <window.TeamScreen {...menuCommon} />; break;
    case "contact":    content = <window.ContactScreen {...menuCommon} />; break;
    default:           content = <HomeScreen {...menuCommon} />;
  }

  return (
    <div style={{ minHeight:"100vh", background: dark?"#161618":"#ECECEF",
      display:"flex", flexDirection:"column", alignItems:"center", padding:"28px 16px 64px",
      fontFamily:"Tajawal, system-ui, sans-serif" }}>

      {/* header */}
      <div style={{ textAlign:"center", marginBottom:22, maxWidth:560 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#0B0B0B", color:"#fff",
          padding:"6px 14px", borderRadius:999, fontSize:12, fontWeight:700, marginBottom:12, letterSpacing:".02em" }}>
          <span style={{ width:8, height:8, borderRadius:999, background:t.primary }} />
          Books Platform · Mobile · Onboarding + 12 screens
        </div>
        <div style={{ fontFamily:"Cairo", fontWeight:800, fontSize:24, color: dark?"#fff":"#0B0B0B" }}>
          منصة الكتب العالمية — تطبيق الجوال</div>
        <div style={{ fontSize:13.5, color: dark?"#A3A3A3":"#6B6B6B", marginTop:4 }}>
          Hi-fi interactive prototype · RTL-first · iPhone 15 Pro · tap to navigate</div>
      </div>

      <div style={{ display:"flex", gap:26, alignItems:"flex-start", flexWrap:"wrap", justifyContent:"center" }}>
        {/* screen jumper */}
        <div style={{ background: dark?"#1f1f22":"#fff", borderRadius:20, padding:14, width:212, flexShrink:0,
          boxShadow:"0 12px 40px rgba(0,0,0,.12)", border:`1px solid ${dark?"#2a2a2e":"#E5E5E5"}` }}>
          <div style={{ fontSize:10.5, letterSpacing:".12em", textTransform:"uppercase", fontWeight:700,
            color: dark?"#6B6B6B":"#A3A3A3", padding:"4px 8px 10px" }}>Screens</div>
          {SCREENS.map((s,i) => {
            const on = screen===s.key;
            return (
              <button key={s.key} onClick={()=> s.key==="detail" ? openBook(bookId||"memory") : s.key==="articleDetail" ? openArticle(articleId||"a1") : jump(s.key)}
                style={{ width:"100%", display:"flex", alignItems:"center", gap:10, textAlign:"start", border:"none",
                  background: on?t.primary:"transparent", color: on?"#fff":(dark?"#E5E5E5":"#1A1A1A"), cursor:"pointer",
                  borderRadius:11, padding:"9px 10px", font:"inherit", marginBottom:2 }}>
                <span style={{ width:22, height:22, borderRadius:7, flexShrink:0, display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:11, fontWeight:800, fontFamily:"Cairo",
                  background: on?"rgba(255,255,255,.22)":(dark?"#2a2a2e":"#F5F5F5"), color: on?"#fff":(dark?"#A3A3A3":"#6B6B6B") }}>{i+1}</span>
                <span style={{ fontFamily:"Cairo", fontWeight:700, fontSize:13 }}>{lang==="ar"?s.ar:s.en}</span>
              </button>
            );
          })}
        </div>

        {/* device */}
        <window.IOSDevice width={390} height={844} dark={dark}>
          <div style={{ height:"100%", direction: lang==="ar"?"rtl":"ltr", background:th.bg,
            display:"flex", flexDirection:"column", "--bp-radius": radius,
            fontFamily:"Tajawal, system-ui, sans-serif", position:"relative" }}>
            {content}
            {menuOpen && <window.MenuSheet th={th} lang={lang} go={go} toast={toast} onClose={()=>setMenuOpen(false)} />}
            {toastMsg && (
              <div style={{ position:"absolute", bottom:108, left:"50%", transform:"translateX(-50%)", zIndex:80,
                background:"#0B0B0B", color:"#fff", padding:"11px 20px", borderRadius:999, fontFamily:"Cairo",
                fontWeight:700, fontSize:13.5, boxShadow:"0 12px 30px rgba(0,0,0,.35)", display:"flex", alignItems:"center", gap:8,
                whiteSpace:"nowrap", animation:"bptoast .25s "+window.BP.tokens.spring }}>
                <window.Icon name="check" size={17} color={t.primary} sw={2.4} /> {toastMsg}</div>
            )}
          </div>
        </window.IOSDevice>
      </div>

      {/* Tweaks */}
      <window.TweaksPanel>
        <window.TweakSection label="Theme" />
        <window.TweakToggle label="Dark mode" value={t.dark} onChange={v=>setTweak("dark", v)} />
        <window.TweakRadio label="Language" value={t.lang} options={["ar","en"]} onChange={v=>setTweak("lang", v)} />
        <window.TweakColor label="Primary" value={t.primary}
          options={["#B11E2E","#0B0B0B","#1F7A6D","#46467F"]} onChange={v=>setTweak("primary", v)} />
        <window.TweakRadio label="Corners" value={t.cornerStyle} options={["soft","sharp"]} onChange={v=>setTweak("cornerStyle", v)} />
      </window.TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
