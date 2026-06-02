/* ============================================================
   Books Platform — Screens B: Articles · Cart · Publish · Search
   ============================================================ */
const { useState: useStateB } = React;
const glassBtnB = { width:40, height:40, borderRadius:999, border:"1px solid rgba(255,255,255,.3)",
  background:"rgba(255,255,255,.16)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center",
  justifyContent:"center", cursor:"pointer" };

// ---------- SCREEN 5 · ARTICLES ----------
function ArticlesScreen({ th, lang, setLang, go, openCart, cartCount, openArticle }) {
  const BP = window.BP, S = BP.strings;
  const [ch, setCh] = useStateB("harvest");
  const list = BP.articles[ch] || [];
  const featured = list[0];
  const rest = list.slice(1);
  return (
    <window.PageCol>
      <AppBar th={th} lang={lang} setLang={setLang} variant="title" title={L(S.articlesTitle, lang)}
        onCart={openCart} cartCount={cartCount} />
      <div style={{ flex:1, paddingBottom:18 }}>
        {/* channel tabs */}
        <div style={{ marginTop:12 }}>
          <window.HScroll gap={8}>{BP.channels.map(c => {
            const on = ch===c.key;
            return (
              <button key={c.key} onClick={()=>setCh(c.key)} style={{ flexShrink:0, display:"flex", alignItems:"center", gap:7,
                border:`1px solid ${on?th.red:th.border}`, background: on?th.red:th.surface, color: on?"#fff":th.text,
                borderRadius:999, padding:"8px 14px", fontFamily:"Cairo", fontWeight:700, fontSize:13, cursor:"pointer", whiteSpace:"nowrap" }}>
                {L(c, lang)}
                <span style={{ background: on?"rgba(255,255,255,.25)":th.surface2, color: on?"#fff":th.muted,
                  fontSize:11, fontWeight:700, minWidth:18, height:18, borderRadius:999, display:"flex",
                  alignItems:"center", justifyContent:"center", padding:"0 4px" }}>{c.count}</span>
              </button>
            );
          })}</window.HScroll>
        </div>

        {list.length === 0 ? (
          /* empty state */
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            textAlign:"center", padding:"64px 32px" }}>
            <div style={{ width:96, height:96, borderRadius:999, background:th.surface2, display:"flex",
              alignItems:"center", justifyContent:"center", marginBottom:18 }}>
              <Icon name="article" size={42} color={th.faint} sw={1.4} /></div>
            <div style={{ fontFamily:"Cairo", fontWeight:800, fontSize:18, color:th.text, marginBottom:6 }}>{L(S.noArticles, lang)}</div>
            <div style={{ fontSize:13.5, color:th.muted, marginBottom:20, maxWidth:240, lineHeight:1.7 }}>
              {lang==="ar"?"لم تُنشر مقالات في هذا القسم بعد. عُد قريباً.":"No articles in this section yet. Check back soon."}</div>
            <button style={{ display:"flex", alignItems:"center", gap:8, border:`1.5px solid ${th.red}`, background:"transparent",
              color:th.red, borderRadius:999, padding:"10px 20px", fontFamily:"Cairo", fontWeight:700, fontSize:14, cursor:"pointer" }}>
              <Icon name="refresh" size={17} color={th.red} /> {L(S.refresh, lang)}</button>
          </div>
        ) : (
          <div style={{ padding:"18px 16px 0" }}>
            {/* featured */}
            <button onClick={()=>openArticle(featured.id)} style={{ width:"100%", textAlign:"start", border:`1px solid ${th.border}`, background:th.surface,
              borderRadius:24, overflow:"hidden", padding:0, cursor:"pointer", font:"inherit", marginBottom:18,
              boxShadow:"0 4px 24px rgba(0,0,0,.06)" }}>
              <div style={{ height:150, background:`linear-gradient(135deg, ${featured.cover[1]}, ${featured.cover[0]})`,
                position:"relative" }}>
                <span style={{ position:"absolute", top:12, insetInlineStart:12, background:"rgba(0,0,0,.4)",
                  backdropFilter:"blur(4px)", color:"#fff", fontSize:11, fontWeight:700, padding:"4px 10px",
                  borderRadius:999, fontFamily:"Cairo" }}>{L(S.featured, lang)}</span>
              </div>
              <div style={{ padding:16 }}>
                <span style={{ fontSize:11.5, fontWeight:700, color:th.red, fontFamily:"Cairo" }}>{featured.cat}</span>
                <div style={{ fontFamily:"Cairo", fontWeight:800, fontSize:17, color:th.text, lineHeight:1.45, margin:"5px 0 7px" }}>{featured.title}</div>
                <p style={{ margin:0, fontSize:13.5, color:th.muted, lineHeight:1.7 }}>{featured.excerpt}</p>
                <div style={{ fontSize:11.5, color:th.faint, marginTop:9 }}>{featured.date} · {featured.read} {L(S.minRead, lang)}</div>
              </div>
            </button>
            {/* list */}
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {rest.map(a => (
                <button key={a.id} onClick={()=>openArticle(a.id)} style={{ display:"flex", gap:13, alignItems:"center", background:th.surface,
                  border:`1px solid ${th.border}`, borderRadius:18, padding:11, cursor:"pointer", font:"inherit",
                  textAlign:"start", boxShadow:"0 4px 24px rgba(0,0,0,.04)" }}>
                  <div style={{ width:78, height:78, borderRadius:12, flexShrink:0,
                    background:`linear-gradient(135deg, ${a.cover[1]}, ${a.cover[0]})` }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:th.red, fontFamily:"Cairo" }}>{a.cat}</span>
                    <div style={{ fontFamily:"Cairo", fontWeight:700, fontSize:14.5, color:th.text, lineHeight:1.45, margin:"3px 0 5px",
                      display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{a.title}</div>
                    <div style={{ fontSize:11, color:th.faint }}>{a.date} · {a.read} {L(S.minRead, lang)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomNav active="articles" go={go} lang={lang} th={th} />
    </window.PageCol>
  );
}

// ---------- SCREEN 6 · CART ----------
function CartScreen({ th, lang, setLang, go, goBack, cart, updateQty, removeItem, openBook }) {
  const BP = window.BP, S = BP.strings;
  const items = Object.keys(cart).map(id => ({ book: BP.bookBy[id], qty: cart[id] })).filter(x=>x.book);
  const count = items.reduce((s,x)=>s+x.qty,0);
  const subtotal = items.reduce((s,x)=>s+x.book.price*x.qty,0);
  const fee = items.length ? 2.5 : 0;
  const total = subtotal + fee;
  const money = v => "$"+v.toFixed(2);
  return (
    <window.PageCol>
      <AppBar th={th} lang={lang} setLang={setLang} variant="title" title={L(S.cartTitle, lang)}
        subtitle={count>0 ? `${count} ${L(S.booksUnit, lang)}` : null} showBack onBack={goBack} />
      <div style={{ flex:1, paddingBottom:18 }}>
        {items.length === 0 ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            textAlign:"center", padding:"72px 32px" }}>
            <div style={{ width:104, height:104, borderRadius:999, background:th.surface2, display:"flex",
              alignItems:"center", justifyContent:"center", marginBottom:20 }}>
              <Icon name="cart" size={46} color={th.faint} sw={1.4} /></div>
            <div style={{ fontFamily:"Cairo", fontWeight:800, fontSize:19, color:th.text, marginBottom:8 }}>{L(S.emptyCart, lang)}</div>
            <div style={{ fontSize:13.5, color:th.muted, marginBottom:22, maxWidth:240, lineHeight:1.7 }}>
              {lang==="ar"?"أضِف كتباً من الكتالوج لتبدأ الطلب.":"Add books from the catalog to start an order."}</div>
            <Btn th={th} variant="primary" lang={lang} onClick={()=>go("books")}>
              <Icon name="book" size={18} color="#fff" /> {L(S.browseBooks, lang)}</Btn>
          </div>
        ) : (<>
          <div style={{ display:"flex", flexDirection:"column", gap:12, padding:"16px" }}>
            {items.map(({book,qty}) => (
              <div key={book.id} style={{ display:"flex", gap:13, background:th.surface, border:`1px solid ${th.border}`,
                borderRadius:18, padding:12, boxShadow:"0 4px 24px rgba(0,0,0,.04)" }}>
                <button onClick={()=>openBook(book.id)} style={{ width:60, flexShrink:0, borderRadius:8, overflow:"hidden",
                  border:"none", padding:0, cursor:"pointer", background:"none" }}>
                  <div style={{ aspectRatio:"3/4" }}><BookCover book={book} lang={lang} /></div></button>
                <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
                    <div style={{ fontFamily:"Cairo", fontWeight:700, fontSize:14, color:th.text, lineHeight:1.4,
                      display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{book.titleAr}</div>
                    <button onClick={()=>removeItem(book.id)} style={{ background:"none", border:"none", cursor:"pointer",
                      color:th.faint, flexShrink:0, padding:0 }}><Icon name="trash" size={18} /></button>
                  </div>
                  <div style={{ fontSize:11.5, color:th.muted, marginTop:2 }}>{book.publisher}</div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:"auto", paddingTop:8 }}>
                    <span style={{ fontFamily:"Cairo", fontWeight:800, fontSize:15, color:th.red }}>{money(book.price*qty)}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:0, border:`1px solid ${th.border}`, borderRadius:999, overflow:"hidden" }}>
                      <button onClick={()=>updateQty(book.id,-1)} style={stepBtn(th)}><Icon name="minus" size={15} /></button>
                      <span style={{ minWidth:30, textAlign:"center", fontWeight:700, fontSize:14, color:th.text }}>{qty}</span>
                      <button onClick={()=>updateQty(book.id,1)} style={stepBtn(th)}><Icon name="plus" size={15} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* summary */}
          <div style={{ margin:"6px 16px 0", background:th.surface, border:`1px solid ${th.border}`, borderRadius:20,
            padding:18, boxShadow:"0 4px 24px rgba(0,0,0,.05)" }}>
            <Srow label={L(S.subtotal, lang)} val={money(subtotal)} th={th} />
            <Srow label={L(S.serviceFee, lang)} val={money(fee)} th={th} />
            <div style={{ height:1, background:th.line, margin:"10px 0" }} />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
              <span style={{ fontFamily:"Cairo", fontWeight:800, fontSize:16, color:th.text }}>{L(S.total, lang)}</span>
              <span style={{ fontFamily:"Cairo", fontWeight:800, fontSize:22, color:th.red }}>{money(total)}</span>
            </div>
            <div style={{ marginTop:16 }}>
              <Btn th={th} variant="primary" full lang={lang}>{L(S.checkout, lang)} <Icon name="back" size={17} color="#fff" flip={lang==="ar"} /></Btn>
            </div>
            <div style={{ fontSize:11, color:th.faint, textAlign:"center", marginTop:10, lineHeight:1.6 }}>
              {lang==="ar"?"الدفع يتم دون حساب · بوابة الدفع تُحدَّد لاحقاً":"Guest checkout · payment gateway TBD"}</div>
          </div>
        </>)}
      </div>
      <BottomNav active={null} go={go} lang={lang} th={th} />
    </window.PageCol>
  );
}
function Srow({label,val,th}){ return (
  <div style={{ display:"flex", justifyContent:"space-between", padding:"5px 0" }}>
    <span style={{ color:th.muted, fontSize:13.5 }}>{label}</span>
    <span style={{ color:th.text, fontSize:13.5, fontWeight:600 }}>{val}</span></div>); }
function stepBtn(th){ return { width:32, height:32, border:"none", background:"none", cursor:"pointer",
  color:th.text, display:"flex", alignItems:"center", justifyContent:"center" }; }

// ---------- SCREEN 7 · PUBLISH ----------
function PublishScreen({ th, lang, setLang, go, goBack }) {
  const BP = window.BP, S = BP.strings;
  const [step, setStep] = useStateB(0);
  const steps = [L(S.stepAuthor, lang), L(S.stepBook, lang), L(S.stepSubmit, lang)];
  const field = (label, ph, req, multiline) => (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:"block", fontFamily:"Cairo", fontWeight:700, fontSize:13.5, color:th.text, marginBottom:7 }}>
        {label}{req && <span style={{ color:th.red }}> *</span>}</label>
      <div style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:14,
        padding: multiline?"13px 15px":"0 15px", height: multiline?"auto":50, minHeight: multiline?92:50,
        display:"flex", alignItems: multiline?"flex-start":"center", color:th.faint, fontSize:14 }}>{ph}</div>
    </div>
  );
  return (
    <window.PageCol>
      <AppBar th={th} lang={lang} setLang={setLang} variant="title" title={L(S.publishTitle, lang)}
        showBack onBack={goBack} />
      <div style={{ flex:1, padding:"18px 16px 8px" }}>
        {/* step indicator */}
        <div style={{ display:"flex", alignItems:"center", marginBottom:24 }}>
          {steps.map((s,i) => (
            <React.Fragment key={i}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, flexShrink:0 }}>
                <div style={{ width:32, height:32, borderRadius:999, display:"flex", alignItems:"center", justifyContent:"center",
                  background: i<=step?th.red:th.surface2, color: i<=step?"#fff":th.faint, fontWeight:800, fontFamily:"Cairo",
                  fontSize:14, border: i<=step?"none":`1px solid ${th.border}` }}>
                  {i<step ? <Icon name="check" size={16} color="#fff" sw={2.5} /> : i+1}</div>
                <span style={{ fontSize:10.5, fontWeight:700, fontFamily:"Cairo", color: i<=step?th.text:th.faint,
                  whiteSpace:"nowrap" }}>{s}</span>
              </div>
              {i<steps.length-1 && <div style={{ flex:1, height:2, background: i<step?th.red:th.border, margin:"0 6px", marginBottom:20 }} />}
            </React.Fragment>
          ))}
        </div>

        {step===0 && <>
          {field(L(S.authorName, lang), lang==="ar"?"اكتب اسمك الكامل":"Your full name", true)}
          {field(L(S.email, lang), "name@example.com", true)}
          {field(L(S.phone, lang), "+20 1XX XXX XXXX", false)}
          {field(L(S.authorBio, lang), lang==="ar"?"نبذة مختصرة عنك وعن أعمالك…":"A short bio…", false, true)}
        </>}
        {step===1 && <>
          {field(lang==="ar"?"عنوان الكتاب":"Book title", lang==="ar"?"عنوان كتابك":"Your book title", true)}
          {field(lang==="ar"?"ملخص الكتاب":"Book summary", lang==="ar"?"نبذة عن محتوى الكتاب…":"Summary…", true, true)}
          {field(lang==="ar"?"تصنيف الكتاب":"Category", lang==="ar"?"اختر التصنيف":"Choose category", true)}
          {/* upload */}
          <div style={{ border:`1.5px dashed ${th.border}`, borderRadius:16, padding:"22px", textAlign:"center", color:th.muted }}>
            <Icon name="plus" size={26} color={th.red} style={{ margin:"0 auto 8px" }} />
            <div style={{ fontFamily:"Cairo", fontWeight:700, fontSize:13.5, color:th.text }}>
              {lang==="ar"?"رفع ملف الكتاب (PDF)":"Upload book file (PDF)"}</div>
          </div>
        </>}
        {step===2 && <div style={{ textAlign:"center", padding:"16px 0 8px" }}>
          <div style={{ width:88, height:88, borderRadius:999, background:th.redSoft, display:"flex", alignItems:"center",
            justifyContent:"center", margin:"0 auto 18px" }}><Icon name="check" size={42} color={th.red} sw={2.2} /></div>
          <div style={{ fontFamily:"Cairo", fontWeight:800, fontSize:18, color:th.text, marginBottom:8 }}>
            {lang==="ar"?"جاهز للإرسال":"Ready to submit"}</div>
          <p style={{ fontSize:14, color:th.muted, lineHeight:1.8, maxWidth:270, margin:"0 auto" }}>
            {lang==="ar"?"سنراجع كتابك ونتواصل معك خلال 5 أيام عمل. يخضع النشر لموافقة فريق التحرير.":"We'll review your book and contact you within 5 business days. Subject to editorial approval."}</p>
        </div>}

        {/* promo */}
        <div style={{ display:"flex", alignItems:"center", gap:11, background:th.redSoft, border:`1px solid ${th.red}33`,
          borderRadius:16, padding:"14px 16px", marginTop:6 }}>
          <span style={{ fontSize:22 }}>🎉</span>
          <div>
            <div style={{ fontFamily:"Cairo", fontWeight:800, fontSize:14, color:th.red }}>{L(S.firstFree, lang)}</div>
            <div style={{ fontSize:11.5, color:th.muted, marginTop:1 }}>
              {lang==="ar"?"الكتب التالية برسوم نشر رمزية":"Subsequent books carry a small publishing fee"}</div>
          </div>
        </div>

        <div style={{ marginTop:18, display:"flex", gap:10 }}>
          {step>0 && <Btn th={th} variant="ghost" lang={lang} onClick={()=>setStep(step-1)} style={{ flex:"0 0 auto" }}>
            <Icon name="back" size={17} color={th.text} flip={lang!=="ar"} /></Btn>}
          <Btn th={th} variant="primary" lang={lang} style={{ flex:1 }}
            onClick={()=>setStep(Math.min(2, step+1))}>
            {step===2 ? (lang==="ar"?"إرسال الكتاب":"Submit book") : L(S.next, lang)}
            {step<2 && <Icon name="back" size={17} color="#fff" flip={lang==="ar"} />}</Btn>
        </div>
      </div>
      <BottomNav active="publish" go={go} lang={lang} th={th} />
    </window.PageCol>
  );
}

// ---------- SCREEN 8 · SEARCH ----------
function SearchScreen({ th, lang, setLang, go, goBack, openBook, dark }) {
  const BP = window.BP, S = BP.strings;
  const [q, setQ] = useStateB("هارفارد");
  const recent = ["هارفارد","فلسفة","ماركيز"];
  const norm = s => (s||"").toLowerCase();
  const pubAlias = { "Harvard University Press":"هارفارد", "Princeton University Press":"برينستون",
    "Columbia University Press":"كولومبيا", "Allen & Unwin":"ألين أنوين آلن",
    "Simon and Schuster":"سايمون آند شوستر", "Knopf Doubleday":"كنوبف دابلداي",
    "Oneworld Publications":"ون وورلد العالم الواحد" };
  const catKw = { "philosophies-and-cultures":"فلسفة فلسفات ثقافة ثقافات",
    "economy-and-development":"اقتصاد اقتصادي تنمية", "ideas-and-policies":"أفكار فكر سياسة سياسات",
    "social-studies":"دراسات اجتماع مجتمع اجتماعية", "languages-and-literature":"لغة لغات أدب آداب",
    "technologies-and-sciences":"تقنية تقنيات علم علوم", "religions-and-beliefs":"دين أديان عقيدة عقائد" };
  const bookText = b => [b.titleAr, b.titleEn, b.publisher, pubAlias[b.publisher]||"",
    BP.catBy[b.cat].ar, BP.catBy[b.cat].en, catKw[b.cat]||""].join(" ");
  const pubText = p => [p.name, pubAlias[p.name]||"", p.country.ar, p.country.en].join(" ");
  const matchBooks = q.trim() ? BP.books.filter(b => norm(bookText(b)).includes(norm(q))) : [];
  const matchPubs = q.trim() ? BP.publishers.filter(p => norm(pubText(p)).includes(norm(q))) : [];
  const results = [...matchPubs.map(p=>({type:"pub",p})), ...matchBooks.map(b=>({type:"book",b}))];
  const hasQ = q.trim().length>0;
  return (
    <window.PageCol>
      {/* search header */}
      <div style={{ position:"sticky", top:0, zIndex:30, background:th.surface, borderBottom:`1px solid ${th.line}`,
        paddingTop:52, paddingBottom:12, paddingInline:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={goBack} style={{ background:"none", border:"none", cursor:"pointer", color:th.text, padding:0, flexShrink:0 }}>
            <Icon name="back" size={22} flip={lang!=="ar"} /></button>
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:9, background:th.surface2,
            border:`1.5px solid ${th.red}`, borderRadius:999, padding:"10px 16px" }}>
            <Icon name="search" size={18} color={th.muted} />
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder={L(S.searchPh, lang)}
              style={{ flex:1, border:"none", background:"none", outline:"none", font:"inherit", fontSize:14,
                color:th.text, fontFamily:"Cairo" }} />
            {q && <button onClick={()=>setQ("")} style={{ background:"none", border:"none", cursor:"pointer", color:th.faint, padding:0 }}>
              <Icon name="x" size={17} /></button>}
          </div>
        </div>
      </div>

      <div style={{ flex:1, overflow:"auto" }}>
        {/* recent */}
        <div style={{ padding:"16px 16px 4px" }}>
          <div style={{ fontFamily:"Cairo", fontWeight:700, fontSize:13, color:th.muted, marginBottom:10 }}>{L(S.recent, lang)}</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {recent.map(r => (
              <button key={r} onClick={()=>setQ(r)} style={{ display:"flex", alignItems:"center", gap:6, border:`1px solid ${th.border}`,
                background:th.surface, color:th.text, borderRadius:999, padding:"7px 14px", fontFamily:"Cairo",
                fontWeight:600, fontSize:13, cursor:"pointer" }}>
                <Icon name="search" size={13} color={th.faint} /> {r}</button>
            ))}
          </div>
        </div>

        {hasQ && (results.length>0 ? (
          <div style={{ padding:"14px 16px 0" }}>
            <div style={{ fontFamily:"Cairo", fontWeight:800, fontSize:15, color:th.text, marginBottom:4 }}>
              {L(S.resultsFor, lang)} «{q}»</div>
            <div style={{ fontSize:12.5, color:th.muted, marginBottom:14 }}>{results.length} {L(S.resultCount, lang)}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {results.map((r,i) => r.type==="book" ? (
                <button key={"b"+i} onClick={()=>openBook(r.b.id)} style={resRow(th)}>
                  <div style={{ width:46, height:60, borderRadius:6, overflow:"hidden", flexShrink:0 }}><BookCover book={r.b} lang={lang} /></div>
                  <div style={{ flex:1, minWidth:0, textAlign:"start" }}>
                    <div style={{ fontFamily:"Cairo", fontWeight:700, fontSize:14, color:th.text, lineHeight:1.4,
                      display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{r.b.titleAr}</div>
                    <div style={{ fontSize:11.5, color:th.muted, marginTop:3 }}>{r.b.publisher}</div>
                  </div>
                  <span style={typeChip(th,"book")}>{L(S.typeBook, lang)}</span>
                </button>
              ) : (
                <button key={"p"+i} style={resRow(th)}>
                  <span style={{ width:46, height:46, borderRadius:12, flexShrink:0, background:th.chrome, color:"#fff",
                    display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Cairo", fontWeight:800, fontSize:15 }}>
                    {r.p.name.split(" ").map(w=>w[0]).slice(0,2).join("")}</span>
                  <div style={{ flex:1, minWidth:0, textAlign:"start" }}>
                    <div style={{ fontFamily:"Cairo", fontWeight:700, fontSize:14, color:th.text }}>{r.p.name}</div>
                    <div style={{ fontSize:11.5, color:th.muted, marginTop:3 }}>{r.p.country.flag} {r.p.books} {L(S.booksUnit, lang)}</div>
                  </div>
                  <span style={typeChip(th,"pub")}>{L(S.typePublisher, lang)}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* no results */
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"48px 32px" }}>
            <div style={{ width:88, height:88, borderRadius:999, background:th.surface2, display:"flex",
              alignItems:"center", justifyContent:"center", marginBottom:18 }}>
              <Icon name="search" size={38} color={th.faint} sw={1.4} /></div>
            <div style={{ fontFamily:"Cairo", fontWeight:800, fontSize:17, color:th.text, marginBottom:8 }}>
              {L(S.noResults, lang)} «{q}»</div>
            <div style={{ fontSize:13, color:th.muted, marginBottom:18 }}>{L(BP.strings.trySuggest, lang)}:</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
              {["فلسفة","اقتصاد","Harvard"].map(s => (
                <button key={s} onClick={()=>setQ(s)} style={{ border:`1px solid ${th.red}`, background:"transparent",
                  color:th.red, borderRadius:999, padding:"7px 15px", fontFamily:"Cairo", fontWeight:700, fontSize:13, cursor:"pointer" }}>{s}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* keyboard */}
      <div style={{ flexShrink:0 }}>{window.IOSKeyboard ? React.createElement(window.IOSKeyboard,{dark}) : null}</div>
    </window.PageCol>
  );
}
function resRow(th){ return { display:"flex", alignItems:"center", gap:12, background:th.surface, border:`1px solid ${th.border}`,
  borderRadius:16, padding:11, cursor:"pointer", font:"inherit", boxShadow:"0 4px 24px rgba(0,0,0,.04)" }; }
function typeChip(th,kind){ return { flexShrink:0, fontSize:10.5, fontWeight:700, fontFamily:"Cairo", padding:"3px 9px",
  borderRadius:999, color: kind==="book"?th.red:"#fff", background: kind==="book"?th.redSoft:th.chrome }; }

// ---------- SCREEN 9 · ARTICLE DETAIL ----------
function ArticleDetailScreen({ th, lang, setLang, go, goBack, article, openArticle, toast }) {
  const BP = window.BP, S = BP.strings;
  const meta = BP.articleBodies[article.id] || { body:[article.excerpt], hasVideo:false };
  const [draft, setDraft] = useStateB("");
  const [posted, setPosted] = useStateB([]);
  const comments = [...posted, ...BP.sampleComments];
  // related: same channel-ish, exclude self
  const related = Object.values(BP.articleBy).filter(a => a.id!==article.id && a.cat===article.cat)
    .concat(Object.values(BP.articleBy).filter(a => a.id!==article.id && a.cat!==article.cat)).slice(0,4);
  const submit = () => { if(!draft.trim()) return;
    setPosted(p => [{ name: lang==="ar"?"أنت":"You", initials: lang==="ar"?"أ":"You", time: lang==="ar"?"الآن":"now", text:draft.trim(), mine:true }, ...p]);
    setDraft(""); toast && toast(lang==="ar"?"تم إرسال تعليقك للمراجعة":"Comment sent for review"); };

  return (
    <window.PageCol>
      <div style={{ flex:1 }}>
        {/* hero */}
        <div style={{ position:"relative", height:230,
          background:`linear-gradient(160deg, ${article.cover[1]}, ${article.cover[0]})` }}>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,.55), transparent 60%)" }} />
          <div style={{ position:"absolute", top:52, left:0, right:0, padding:"0 16px", display:"flex",
            justifyContent:"space-between", zIndex:5 }}>
            <button onClick={goBack} style={glassBtnB}><Icon name="back" size={20} color="#fff" flip={lang!=="ar"} /></button>
            <div style={{ display:"flex", gap:8 }}>
              <LangToggle lang={lang} setLang={setLang} th={{ surface2:"rgba(255,255,255,.18)", border:"rgba(255,255,255,.3)", muted:"rgba(255,255,255,.7)", red:th.red }} />
              <button style={glassBtnB}><Icon name="share" size={18} color="#fff" /></button>
            </div>
          </div>
          <div style={{ position:"absolute", bottom:16, insetInlineStart:18, insetInlineEnd:18, zIndex:5 }}>
            <span style={{ display:"inline-block", background:th.red, color:"#fff", fontSize:11, fontWeight:700,
              padding:"4px 11px", borderRadius:999, fontFamily:"Cairo", marginBottom:9 }}>{article.cat}</span>
            <div style={{ fontFamily:"Cairo", fontWeight:800, fontSize:21, color:"#fff", lineHeight:1.4,
              textShadow:"0 2px 12px rgba(0,0,0,.4)" }}>{article.title}</div>
          </div>
        </div>

        <div style={{ padding:"16px" }}>
          {/* byline */}
          <div style={{ display:"flex", alignItems:"center", gap:10, paddingBottom:14, borderBottom:`1px solid ${th.line}`, marginBottom:16 }}>
            <span style={{ width:38, height:38, borderRadius:999, background:th.chrome, color:"#fff", display:"flex",
              alignItems:"center", justifyContent:"center", fontFamily:"Cairo", fontWeight:800, fontSize:13 }}>م ك</span>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"Cairo", fontWeight:700, fontSize:13.5, color:th.text }}>{lang==="ar"?"هيئة التحرير":"Editorial Team"}</div>
              <div style={{ fontSize:11.5, color:th.muted }}>{article.date} · {article.read} {L(S.minRead, lang)}</div>
            </div>
            <button style={{ ...iconBtn(th), width:36, height:36 }}><Icon name="share" size={17} /></button>
          </div>

          {/* video embed */}
          {meta.hasVideo && (
            <button style={{ width:"100%", border:"none", padding:0, cursor:"pointer", borderRadius:18, overflow:"hidden",
              marginBottom:18, position:"relative", aspectRatio:"16/9", font:"inherit",
              background:`linear-gradient(135deg, ${article.cover[0]}, ${article.cover[1]})` }}>
              <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.28)" }} />
              <span style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:60, height:60,
                borderRadius:999, background:"rgba(255,255,255,.92)", display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 8px 24px rgba(0,0,0,.3)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill={th.red}><path d="M8 5v14l11-7z"/></svg></span>
              <span style={{ position:"absolute", bottom:12, insetInlineStart:12, background:"rgba(0,0,0,.55)", color:"#fff",
                fontSize:11.5, fontWeight:700, fontFamily:"Cairo", padding:"5px 11px", borderRadius:999, display:"flex",
                alignItems:"center", gap:6 }}><Icon name="play" size={14} color="#fff" /> {L(S.watchVideo, lang)} · YouTube</span>
            </button>
          )}

          {/* body */}
          <article style={{ direction:"rtl" }}>
            {meta.body.map((p,i) => (
              <React.Fragment key={i}>
                <p style={{ margin:"0 0 16px", fontSize:15.5, lineHeight:2, color:th.text,
                  fontWeight: i===0?500:400, textAlign:"justify" }}>{p}</p>
                {meta.pull && i===0 && (
                  <blockquote style={{ margin:"18px 0", padding:"4px 16px", borderInlineStart:`3px solid ${th.red}`,
                    fontFamily:"Cairo", fontWeight:700, fontSize:17, color:th.red, lineHeight:1.6 }}>{meta.pull}</blockquote>
                )}
              </React.Fragment>
            ))}
          </article>

          {/* comments */}
          <div style={{ marginTop:26, paddingTop:20, borderTop:`1px solid ${th.line}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <h3 style={{ margin:0, fontFamily:"Cairo", fontWeight:800, fontSize:16, color:th.text }}>{L(S.comments, lang)}</h3>
              <span style={{ background:th.surface2, color:th.muted, fontSize:12, fontWeight:700, padding:"2px 9px",
                borderRadius:999 }}>{comments.length}</span>
            </div>

            {/* composer */}
            <div style={{ display:"flex", gap:10, marginBottom:18 }}>
              <span style={{ width:36, height:36, borderRadius:999, flexShrink:0, background:th.red, color:"#fff", display:"flex",
                alignItems:"center", justifyContent:"center", fontFamily:"Cairo", fontWeight:800, fontSize:13 }}>{lang==="ar"?"أ":"Y"}</span>
              <div style={{ flex:1, background:th.surface, border:`1px solid ${th.border}`, borderRadius:16, padding:"10px 12px" }}>
                <textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder={L(S.commentPh, lang)} rows={2}
                  style={{ width:"100%", border:"none", outline:"none", background:"none", resize:"none", font:"inherit",
                    fontSize:14, color:th.text, fontFamily:"Tajawal", lineHeight:1.6 }} />
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:6 }}>
                  <span style={{ fontSize:10.5, color:th.faint }}>{L(S.moderated, lang)}</span>
                  <button onClick={submit} disabled={!draft.trim()} style={{ border:"none", cursor: draft.trim()?"pointer":"default",
                    background: draft.trim()?th.red:th.surface2, color: draft.trim()?"#fff":th.faint, borderRadius:999,
                    padding:"7px 18px", fontFamily:"Cairo", fontWeight:700, fontSize:13 }}>{L(S.post, lang)}</button>
                </div>
              </div>
            </div>

            {/* thread */}
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {comments.map((c,i) => (
                <div key={i} style={{ display:"flex", gap:10 }}>
                  <span style={{ width:36, height:36, borderRadius:999, flexShrink:0, background: c.mine?th.red:th.chrome, color:"#fff",
                    display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Cairo", fontWeight:800, fontSize:12.5,
                    direction:"ltr" }}>{c.initials}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontFamily:"Cairo", fontWeight:700, fontSize:13.5, color:th.text }}>{c.name}</span>
                      <span style={{ fontSize:11, color:th.faint }}>{c.time}</span>
                      {c.mine && <span style={{ background:th.warning, color:"#fff", fontSize:9.5, fontWeight:700,
                        padding:"1px 7px", borderRadius:999, fontFamily:"Cairo" }}>{lang==="ar"?"قيد المراجعة":"Pending"}</span>}
                    </div>
                    <p style={{ margin:"4px 0 0", fontSize:14, lineHeight:1.7, color: c.mine?th.muted:th.text }}>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* related */}
          <div style={{ margin:"26px -16px 0" }}>
            <SectionHeader title={L(S.relatedArticles, lang)} lang={lang} th={th} />
            <window.HScroll>{related.map(a => (
              <button key={a.id} onClick={()=>openArticle(a.id)} style={{ flexShrink:0, width:190, textAlign:"start",
                border:`1px solid ${th.border}`, background:th.surface, borderRadius:18, overflow:"hidden", padding:0,
                cursor:"pointer", font:"inherit", boxShadow:"0 4px 24px rgba(0,0,0,.05)" }}>
                <div style={{ height:90, background:`linear-gradient(135deg, ${a.cover[1]}, ${a.cover[0]})` }} />
                <div style={{ padding:12 }}>
                  <span style={{ fontSize:10.5, fontWeight:700, color:th.red, fontFamily:"Cairo" }}>{a.cat}</span>
                  <div style={{ fontFamily:"Cairo", fontWeight:700, fontSize:13.5, color:th.text, lineHeight:1.45, marginTop:4,
                    display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{a.title}</div>
                </div>
              </button>
            ))}</window.HScroll>
          </div>
        </div>
      </div>
      <BottomNav active="articles" go={go} lang={lang} th={th} />
    </window.PageCol>
  );
}

Object.assign(window, { ArticlesScreen, ArticleDetailScreen, CartScreen, PublishScreen, SearchScreen, Srow, stepBtn });
