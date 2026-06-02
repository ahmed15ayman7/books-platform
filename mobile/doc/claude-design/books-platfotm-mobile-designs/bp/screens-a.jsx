/* ============================================================
   Books Platform — Screens A: Home · Catalog · Detail · Publishers
   ============================================================ */
const { useState: useStateA } = React;

function PageCol({ children }) {
  return <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>{children}</div>;
}
function HScroll({ children, pad = 16, gap = 12 }) {
  return <div style={{ display: "flex", gap, overflowX: "auto", padding: `2px ${pad}px 4px`,
    scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>{children}</div>;
}

// ---------- SCREEN 1 · HOME ----------
function HomeScreen({ th, lang, setLang, go, openBook, openCart, cartCount }) {
  const BP = window.BP,S = BP.strings;
  const featured = BP.bookBy["liberty"];
  const fresh = BP.books.filter((b) => b.isNew || b.status === "NOMINATED").slice(0, 6);
  const translated = BP.books.filter((b) => b.status === "TRANSLATED");
  return (
    <PageCol>
      <AppBar th={th} lang={lang} setLang={setLang} variant="home"
      onSearch={() => go("search")} onCart={openCart} cartCount={cartCount} />
      <div style={{ flex: 1, paddingBottom: 18 }}>

        {/* hero featured banner */}
        <div style={{ padding: "16px 16px 8px" }}>
          <button onClick={() => openBook(featured.id)} style={{ width: "100%", textAlign: "start", border: "none",
            cursor: "pointer", borderRadius: 26, overflow: "hidden", padding: 0, font: "inherit", position: "relative",
            background: `linear-gradient(135deg, ${featured.cover[0]}, ${featured.cover[1]})`,
            boxShadow: "0 14px 40px rgba(0,0,0,.18)" }}>
            <div style={{ display: "flex", gap: 14, padding: 18, alignItems: "stretch" }}>
              <div style={{ width: 96, flexShrink: 0, borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 20px rgba(0,0,0,.35)" }}>
                <div style={{ aspectRatio: "3/4" }}><BookCover book={featured} lang={lang} /></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0, paddingBlock: 2 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.8)", letterSpacing: ".06em",
                    marginBottom: 7, fontFamily: "Cairo" }}>{lang === "ar" ? "كتاب الأسبوع" : "Book of the week"}</div>
                  <div style={{ fontFamily: "Cairo, sans-serif", fontWeight: 800, fontSize: 19, color: "#fff",
                    lineHeight: 1.4, marginBottom: 9, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
                    overflow: "hidden", textShadow: "0 1px 10px rgba(0,0,0,.3)" }}>
                    {L({ ar: featured.titleAr, en: featured.titleEn }, lang)}</div>
                  <StatusBadge status={featured.status} lang={lang} />
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, alignSelf: "flex-start",
                  background: "rgba(255,255,255,.16)", backdropFilter: "blur(6px)", color: "#fff", fontWeight: 700,
                  fontFamily: "Cairo", fontSize: 13.5, padding: "9px 16px", borderRadius: 999,
                  border: "1px solid rgba(255,255,255,.25)" }}>
                  {L(S.readDetails, lang)} <Icon name="back" size={15} flip={lang === "ar"} color="#fff" /></div>
              </div>
            </div>
          </button>
        </div>

        {/* categories */}
        <div style={{ marginTop: 14 }}>
          <SectionHeader title={L(S.browseCat, lang)} onAll={() => go("books")} lang={lang} th={th} allLabel={L(S.all, lang)} />
          <HScroll>{BP.categories.slice(0, 6).map((c) =>
            <CategoryChip key={c.slug} cat={c} lang={lang} th={th} onClick={() => go("books")} />)}</HScroll>
        </div>

        {/* newly released */}
        <div style={{ marginTop: 26 }}>
          <SectionHeader title={L(S.newlyReleased, lang)} onAll={() => go("books")} lang={lang} th={th} />
          <HScroll>{fresh.map((b) =>
            <div key={b.id} style={{ flexShrink: 0 }}><BookCard book={b} lang={lang} th={th} width={150} onClick={() => openBook(b.id)} /></div>)}</HScroll>
        </div>

        {/* translated */}
        <div style={{ marginTop: 26 }}>
          <SectionHeader title={L(S.translatedBooks, lang)} onAll={() => go("books")} lang={lang} th={th} />
          <HScroll>{translated.map((b) =>
            <div key={b.id} style={{ flexShrink: 0 }}><BookCard book={b} lang={lang} th={th} width={150} onClick={() => openBook(b.id)} /></div>)}</HScroll>
        </div>

        {/* top publishers */}
        <div style={{ marginTop: 26 }}>
          <SectionHeader title={L(S.topPublishers, lang)} onAll={() => go("publishers")} lang={lang} th={th} />
          <HScroll>{BP.publishers.slice(0, 5).map((p) =>
            <button key={p.id} onClick={() => go("publishers")} style={{ flexShrink: 0, display: "flex", alignItems: "center",
              gap: 10, background: th.surface, border: `1px solid ${th.border}`, borderRadius: 999, padding: "8px 16px 8px 10px",
              cursor: "pointer", font: "inherit", boxShadow: "0 4px 24px rgba(0,0,0,.05)" }}>
              <span style={{ width: 36, height: 36, borderRadius: 999, background: th.chrome, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontFamily: "Cairo", fontSize: 14 }}>
                {p.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
              <div style={{ textAlign: "start" }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: th.text, whiteSpace: "nowrap" }}>{p.name}</div>
                <div style={{ fontSize: 11, color: th.muted }}>{p.country.flag} {p.books} {L(S.booksUnit, lang)}</div>
              </div>
            </button>)}</HScroll>
        </div>

        {/* newsletter strip */}
        <div style={{ margin: "28px 16px 6px", background: th.chrome, borderRadius: 24, padding: "22px 20px", color: "#fff" }}>
          <div style={{ fontFamily: "Cairo", fontWeight: 800, fontSize: 17, marginBottom: 5 }}>{L(S.newsletterT, lang)}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.65)", marginBottom: 14 }}>{L(S.newsletterS, lang)}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.18)",
              borderRadius: 14, padding: "12px 14px", color: "rgba(255,255,255,.6)", fontSize: 13 }}>{L(S.emailPh, lang)}</div>
            <button style={{ background: th.red, color: "#fff", border: "none", borderRadius: 14, padding: "0 18px",
              fontFamily: "Cairo", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{L(S.subscribe, lang)}</button>
          </div>
        </div>

      </div>
      <BottomNav active="home" go={go} lang={lang} th={th} />
    </PageCol>);

}

// ---------- SCREEN 2 · CATALOG ----------
function CatalogScreen({ th, lang, setLang, go, openBook, openCart, cartCount }) {
  const BP = window.BP,S = BP.strings;
  const [status, setStatus] = useStateA("ALL");
  const [cat, setCat] = useStateA("ALL");
  const [sort, setSort] = useStateA("new");
  let list = BP.books.filter((b) => (status === "ALL" || b.status === status) && (cat === "ALL" || b.cat === cat));
  list = [...list].sort((a, b) => sort === "new" ? b.year - a.year : a.year - b.year);

  const chip = (lbl, on, sel) =>
  <button onClick={on} style={{ flexShrink: 0, border: `1px solid ${sel ? th.red : th.border}`,
    background: sel ? th.red : th.surface, color: sel ? "#fff" : th.text, borderRadius: 999, padding: "7px 14px",
    fontFamily: "Cairo", fontWeight: 700, fontSize: 12.5, cursor: "pointer", whiteSpace: "nowrap" }}>{lbl}</button>;

  return (
    <PageCol>
      <AppBar th={th} lang={lang} setLang={setLang} variant="title" title={L(S.catalogTitle, lang)}
      subtitle={L(S.bookCount, lang)} onSearch={() => go("search")} onCart={openCart} cartCount={cartCount}
      trailing={<button style={iconBtn(th)}><Icon name="sliders" size={20} /></button>} />
      <div style={{ flex: 1 }}>
        {/* status + sort filter row */}
        <div style={{ paddingTop: 12 }}>
          <HScroll gap={8}>
            {chip(L(S.all, lang), () => setStatus("ALL"), status === "ALL")}
            {chip(BP.status.NOMINATED[lang], () => setStatus("NOMINATED"), status === "NOMINATED")}
            {chip(BP.status.TRANSLATED[lang], () => setStatus("TRANSLATED"), status === "TRANSLATED")}
            <div style={{ width: 1, background: th.border, margin: "2px 2px" }} />
            {chip(L(S.sortNewest, lang), () => setSort("new"), sort === "new")}
            {chip(L(S.sortOldest, lang), () => setSort("old"), sort === "old")}
          </HScroll>
        </div>
        {/* category scroll */}
        <div style={{ marginTop: 8 }}>
          <HScroll gap={8}>
            {chip(L(S.all, lang), () => setCat("ALL"), cat === "ALL")}
            {BP.categories.map((c) => chip(L(c, lang), () => setCat(c.slug), cat === c.slug))}
          </HScroll>
        </div>
        {/* grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, padding: "16px" }}>
          {list.map((b) => <BookCard key={b.id} book={b} lang={lang} th={th} width="100%" onClick={() => openBook(b.id)} />)}
        </div>
        {/* infinite-scroll loader */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, padding: "6px 0 20px", color: th.muted }}>
          <span style={{ width: 18, height: 18, borderRadius: 999, border: `2.5px solid ${th.border}`,
            borderTopColor: th.red, display: "inline-block", animation: "bpspin 0.8s linear infinite" }} />
          <span style={{ fontSize: 12.5, fontFamily: "Cairo" }}>{lang === "ar" ? "جاري تحميل المزيد…" : "Loading more…"}</span>
        </div>
      </div>
      <BottomNav active="books" go={go} lang={lang} th={th} />
    </PageCol>);

}

// ---------- SCREEN 3 · BOOK DETAIL ----------
function DetailScreen({ th, lang, setLang, go, goBack, book, openBook, addToCart, openCart, cartCount, toast }) {
  const BP = window.BP,S = BP.strings;
  const cat = BP.catBy[book.cat];
  const [exp, setExp] = useStateA(false);
  const [saved, setSaved] = useStateA(false);
  const similar = BP.books.filter((b) => b.id !== book.id && (b.cat === book.cat || b.status === book.status)).slice(0, 4);
  const row = (label, val) =>
  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "11px 0",
    borderBottom: `1px solid ${th.line}` }}>
      <span style={{ color: th.muted, fontSize: 13.5 }}>{label}</span>
      <span style={{ color: th.text, fontSize: 13.5, fontWeight: 600, textAlign: "end" }}>{val}</span>
    </div>;

  return (
    <PageCol>
      <div style={{ flex: 1 }}>
        {/* hero cover */}
        <div style={{ position: "relative", height: 300, background: `linear-gradient(160deg, ${book.cover[1]}, ${book.cover[0]})` }}>
          <div style={{ position: "absolute", inset: 0, opacity: .5 }}><BookCover book={book} lang={lang} /></div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.62), transparent 55%)" }} />
          {/* floating controls */}
          <div style={{ position: "absolute", top: 52, left: 0, right: 0, padding: "0 16px", display: "flex",
            justifyContent: "space-between", zIndex: 5 }}>
            <button onClick={goBack} style={glassBtn}><Icon name="back" size={20} color="#fff" flip={lang !== "ar"} /></button>
            <div style={{ display: "flex", gap: 8 }}>
              <LangToggle lang={lang} setLang={setLang} th={{ surface2: "rgba(255,255,255,.18)", border: "rgba(255,255,255,.3)", muted: "rgba(255,255,255,.7)", red: th.red }} />
              <button style={glassBtn}><Icon name="share" size={18} color="#fff" /></button>
            </div>
          </div>
          {/* title overlay */}
          <div style={{ position: "absolute", bottom: 18, insetInlineStart: 18, insetInlineEnd: 18, zIndex: 5 }}>
            <div style={{ fontFamily: "Cairo", fontWeight: 800, fontSize: 24, color: "#fff", lineHeight: 1.35,
              textShadow: "0 2px 12px rgba(0,0,0,.4)" }}>{book.titleAr}</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,.8)", fontStyle: "italic", marginTop: 3 }}>{book.titleEn}</div>
          </div>
        </div>

        <div style={{ padding: "16px" }}>
          {/* badges */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
            <StatusBadge status={book.status} lang={lang} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${th.border}`,
              borderRadius: 999, padding: "3px 11px", fontSize: 12, fontWeight: 700, color: th.text, background: th.surface }}>
              <Icon name={cat.icon} size={14} color={th.red} /> {L(cat, lang)}</span>
            <span style={{ marginInlineStart: "auto", fontFamily: "Cairo", fontWeight: 800, fontSize: 20, color: th.red }}>
              ${book.price.toFixed(2)}</span>
          </div>

          {/* biblio table */}
          <div style={{ background: th.surface, border: `1px solid ${th.border}`, borderRadius: 18, padding: "4px 16px",
            boxShadow: "0 4px 24px rgba(0,0,0,.05)" }}>
            {row(L(S.publisherL, lang), book.publisher)}
            {row(L(S.countryL, lang), `${book.country.flag} ${L(book.country, lang)}`)}
            {row(L(S.origLang, lang), L(book.langOrig, lang))}
            {row(L(S.pagesL, lang), book.pages)}
            {row(L(S.editionL, lang), L(book.edition, lang))}
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "11px 0" }}>
              <span style={{ color: th.muted, fontSize: 13.5 }}>{L(S.isbnL, lang)}</span>
              <span style={{ color: th.text, fontSize: 13, fontWeight: 600, fontFamily: "Inter", direction: "ltr" }}>{book.isbn}</span>
            </div>
          </div>

          {/* description (placeholder + expand) */}
          <div style={{ marginTop: 20 }}>
            <h3 style={{ margin: "0 0 8px", fontFamily: "Cairo", fontWeight: 800, fontSize: 16, color: th.text }}>{L(S.bookDesc, lang)}</h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.8, color: th.muted,
              display: "-webkit-box", WebkitLineClamp: exp ? "unset" : 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {book.descAr}</p>
            <button onClick={() => setExp(!exp)} style={{ background: "none", border: "none", color: th.red, fontWeight: 700,
              fontFamily: "Cairo", fontSize: 13.5, cursor: "pointer", padding: "6px 0 0" }}>
              {exp ? L(S.readLess, lang) : L(S.readMore, lang)}</button>
          </div>

          {/* actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            <Btn th={th} variant="primary" full lang={lang} onClick={() => {addToCart(book.id);toast(L(S.added, lang));}}>
              <Icon name="cart" size={19} color="#fff" /> {L(S.addToCart, lang)} · ${book.price.toFixed(2)}</Btn>
            <Btn th={th} variant="secondary" full lang={lang} onClick={() => setSaved(!saved)}>
              <Icon name="heart" size={18} color={th.red} /> {saved ? L(S.saved, lang) : L(S.saveWishlist, lang)}</Btn>
          </div>

          {/* similar */}
          <div style={{ margin: "26px -16px 0" }}>
            <SectionHeader title={L(S.similar, lang)} lang={lang} th={th} />
            <HScroll>{similar.map((b) =>
              <div key={b.id} style={{ flexShrink: 0 }}><BookCard book={b} lang={lang} th={th} width={140} onClick={() => openBook(b.id)} /></div>)}</HScroll>
          </div>
        </div>
      </div>
      <BottomNav active={null} go={go} lang={lang} th={th} />
    </PageCol>);

}
const glassBtn = { width: 40, height: 40, borderRadius: 999, border: "1px solid rgba(255,255,255,.3)",
  background: "rgba(255,255,255,.16)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center",
  justifyContent: "center", cursor: "pointer" };

// ---------- SCREEN 4 · PUBLISHERS ----------
function PublishersScreen({ th, lang, setLang, go, openCart, cartCount }) {
  const BP = window.BP,S = BP.strings;
  const [country, setCountry] = useStateA(0);
  return (
    <PageCol>
      <AppBar th={th} lang={lang} setLang={setLang} variant="title" title={L(S.pubDirTitle, lang)}
      subtitle={L(S.pubDirSub, lang)} onCart={openCart} cartCount={cartCount} />
      <div style={{ flex: 1, paddingBottom: 18 }}>
        {/* search */}
        <div style={{ padding: "14px 16px 4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: th.surface, border: `1px solid ${th.border}`,
            borderRadius: 999, padding: "12px 18px", color: th.faint, boxShadow: "0 4px 24px rgba(0,0,0,.05)" }}>
            <Icon name="search" size={18} color={th.faint} />
            <span style={{ fontSize: 14, fontFamily: "Cairo" }}>{L(S.pubSearch, lang)}</span>
          </div>
        </div>
        {/* country filter */}
        <div style={{ marginTop: 8 }}>
          <HScroll gap={8}>{BP.countries.map((c, i) =>
            <button key={i} onClick={() => setCountry(i)} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6,
              border: `1px solid ${country === i ? th.red : th.border}`, background: country === i ? th.red : th.surface,
              color: country === i ? "#fff" : th.text, borderRadius: 999, padding: "8px 14px", fontFamily: "Cairo",
              fontWeight: 700, fontSize: 12.5, cursor: "pointer", whiteSpace: "nowrap" }}>
              {c.flag && <span style={{ fontSize: 14 }}>{c.flag}</span>} {L(c, lang)}</button>)}</HScroll>
        </div>
        {/* list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px" }}>
          {BP.publishers.map((p) =>
          <button key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, background: th.surface,
            border: `1px solid ${th.border}`, borderRadius: 20, padding: 14, cursor: "pointer", font: "inherit",
            textAlign: "start", boxShadow: "0 4px 24px rgba(0,0,0,.05)" }}>
              <span style={{ width: 54, height: 54, borderRadius: 16, flexShrink: 0, background: th.chrome, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Cairo", fontWeight: 800, fontSize: 18 }}>
                {p.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontFamily: "Cairo", fontWeight: 700, fontSize: 15, color: th.text }}>{p.name}</span>
                  {p.sponsored && <span style={{ background: th.red, color: "#fff", fontSize: 10, fontWeight: 700,
                  padding: "2px 8px", borderRadius: 999 }}>{L(S.featured, lang)}</span>}
                </div>
                <div style={{ fontSize: 12.5, color: th.muted, marginTop: 3 }}>{p.country.flag} {L(p.country, lang)}</div>
              </div>
              <span style={{ background: th.redSoft, color: th.red, fontWeight: 700, fontSize: 12, padding: "6px 11px",
              borderRadius: 999, whiteSpace: "nowrap", fontFamily: "Cairo" }}>{p.books} {L(S.booksUnit, lang)}</span>
            </button>
          )}
        </div>
      </div>
      <BottomNav active="publishers" go={go} lang={lang} th={th} />
    </PageCol>);

}

Object.assign(window, { PageCol, HScroll, HomeScreen, CatalogScreen, DetailScreen, PublishersScreen });