/* ============================================================
   Books Platform — Screens C: Contact + Menu sheet
   تواصل معنا — real details from booksplatform.net
   ============================================================ */
const { useState: useStateC } = React;

/* ---------- small shared helpers ---------- */
function H2({ th, children, style = {} }) {
  return <h2 style={{ margin: "0 0 13px", fontFamily: "Cairo, sans-serif", fontWeight: 800,
    fontSize: 19, color: th.text, ...style }}>{children}</h2>;
}
function Section({ children, style = {} }) {
  return <div style={{ padding: "0 16px", marginTop: 28, ...style }}>{children}</div>;
}
function InfoHero({ th, lang, icon, subtitle }) {
  return (
    <div style={{ background: th.chrome, color: "#fff", padding: "22px 18px 24px", position: "relative", overflow: "hidden" }}>
      <span style={{ position: "absolute", insetInlineEnd: -28, top: -28, width: 130, height: 130, borderRadius: 999,
        background: th.red, opacity: .14 }} />
      <span style={{ width: 46, height: 46, borderRadius: 14, background: th.red, display: "flex",
        alignItems: "center", justifyContent: "center", color: "#fff", marginBottom: 14 }}>
        <Icon name={icon} size={24} sw={1.8} /></span>
      <p style={{ margin: 0, fontFamily: "Tajawal, sans-serif", fontSize: 15.5, lineHeight: 1.7,
        color: "rgba(255,255,255,.82)", maxWidth: 320 }}>{subtitle}</p>
    </div>
  );
}

/* ================= MENU SHEET (bottom sheet) ================= */
function MenuSheet({ th, lang, onClose, go, toast }) {
  const S = window.BP.strings, M = S.menu;
  const top = [
    { key: "wishlist",   icon: "heart",     label: M.wishlist,   action: () => toast(L(S.soon, lang)) },
    { key: "nominated",  icon: "languages", label: M.nominated,  action: () => go("books") },
    { key: "translated", icon: "book",      label: M.translated, action: () => go("books") },
    { key: "notify",     icon: "bell",      label: M.notify,     action: () => toast(L(S.soon, lang)) },
  ];
  const info = [
    { key: "about",    icon: "bookMarked", label: M.about,    action: () => go("about") },
    { key: "services", icon: "briefcase",  label: M.services, action: () => go("services") },
    { key: "team",     icon: "users",      label: M.team,     action: () => go("team") },
    { key: "contact",  icon: "mail",       label: M.contact,  action: () => go("contact") },
  ];
  const Row = ({ it, last }) => (
    <button onClick={() => { it.action(); onClose(); }}
      style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, background: "none",
        border: "none", borderBottom: last ? "none" : `1px solid ${th.line}`, cursor: "pointer",
        font: "inherit", padding: "15px 4px", textAlign: "start" }}>
      <span style={{ width: 26, flexShrink: 0, color: th.red, display: "flex", justifyContent: "center" }}>
        <Icon name={it.icon} size={22} sw={1.8} /></span>
      <span style={{ flex: 1, fontFamily: "Cairo, sans-serif", fontWeight: 700, fontSize: 15.5, color: th.text }}>
        {L(it.label, lang)}</span>
      <Icon name="back" size={17} flip={lang !== "ar"} color={th.faint} />
    </button>
  );
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 90, background: "rgba(0,0,0,.42)",
      animation: "bpfade .2s ease-out", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: th.surface, borderTopLeftRadius: 26,
        borderTopRightRadius: 26, paddingBottom: 30, maxHeight: "82%", overflowY: "auto",
        boxShadow: "0 -14px 40px rgba(0,0,0,.3)", animation: "bpsheetup .32s " + window.BP.tokens.spring }}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 4 }}>
          <span style={{ width: 42, height: 5, borderRadius: 999, background: th.border }} /></div>
        <div style={{ padding: "6px 18px 0" }}>
          {top.map((it, i) => <Row key={it.key} it={it} last={i === top.length - 1} />)}
          <div style={{ height: 8 }} />
          <div style={{ height: 7, background: th.surface2, margin: "0 -18px" }} />
          <div style={{ height: 8 }} />
          {info.map((it, i) => <Row key={it.key} it={it} last={i === info.length - 1} />)}
        </div>
      </div>
    </div>
  );
}

/* ================= CONTACT ================= */
function ContactScreen({ th, lang, setLang, goBack, onMenu }) {
  const S = window.BP.strings, P = window.BP.pages.contact;
  const [v, setV] = useStateC({ name: "", email: "", phone: "", message: "" });
  const [err, setErr] = useStateC({});
  const [st, setSt] = useStateC("idle");
  const set = (k, val) => { setV(p => ({ ...p, [k]: val })); if (err[k]) setErr(e => ({ ...e, [k]: null })); };

  function submit() {
    const e = {};
    if (!v.name.trim()) e.name = L(P.errName, lang);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = L(P.errEmail, lang);
    if (!v.message.trim()) e.message = L(P.errMsg, lang);
    setErr(e);
    if (Object.keys(e).length) return;
    setSt("loading");
    setTimeout(() => setSt("success"), 750);
  }
  const reset = () => { setV({ name: "", email: "", phone: "", message: "" }); setErr({}); setSt("idle"); };

  const fieldWrap = { display: "flex", flexDirection: "column", gap: 6 };
  const labelSt = { fontSize: 13, fontWeight: 700, color: th.muted, fontFamily: "Cairo, sans-serif" };
  const inputSt = (bad) => ({ background: th.surface2, border: `1.5px solid ${bad ? th.red : th.border}`,
    borderRadius: 14, padding: "13px 15px", fontSize: 15, color: th.text, font: "inherit", outline: "none", width: "100%", boxSizing: "border-box" });

  return (
    <window.PageCol>
      <AppBar th={th} lang={lang} setLang={setLang} variant="title" title={L(S.menu.contact, lang)}
        showBack onBack={goBack} onMenu={onMenu} />
      <div style={{ flex: 1, paddingBottom: 30 }}>
        <InfoHero th={th} lang={lang} icon="mail" subtitle={L(P.hero.subtitle, lang)} />

        {/* contact details card (black, matches live site) */}
        <Section style={{ marginTop: 20 }}>
          <div style={{ background: th.chrome, borderRadius: 24, padding: "26px 22px", color: "#fff", textAlign: "center" }}>
            <span style={{ display: "inline-flex", color: "rgba(255,255,255,.85)", marginBottom: 10 }}>
              <Icon name="phone" size={34} sw={1.6} /></span>
            <div dir="ltr" style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: ".01em" }}>
              {P.phone}</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.6)", marginTop: 8 }}>{L(P.hours, lang)}</div>
            <div style={{ height: 1, background: "rgba(255,255,255,.12)", margin: "18px 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {P.emails.map((em, i) => (
                <a key={i} href={`mailto:${em}`} style={{ display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 9, color: "#fff", textDecoration: "none" }}>
                  <Icon name="mail" size={17} color={th.red} />
                  <span dir="ltr" style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "rgba(255,255,255,.9)" }}>{em}</span>
                </a>
              ))}
            </div>
          </div>
        </Section>

        {/* follow us */}
        <Section style={{ marginTop: 20 }}>
          <div style={{ ...labelSt, marginBottom: 11 }}>{L(P.followLabel, lang)}</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {window.BP.pages.social.map(s => (
              <a key={s.key} href="#" onClick={e => e.preventDefault()} aria-label={s.label}
                style={{ width: 44, height: 44, borderRadius: 999, border: `1px solid ${th.border}`, background: th.surface,
                  display: "flex", alignItems: "center", justifyContent: "center", color: th.text, textDecoration: "none" }}>
                <Icon name={s.key} size={20} sw={1.7} /></a>
            ))}
          </div>
        </Section>

        {/* form */}
        <Section style={{ marginTop: 24 }}>
          <div style={{ background: th.surface, border: `1px solid ${th.border}`, borderRadius: 24, padding: 20,
            boxShadow: "0 4px 24px rgba(0,0,0,.05)" }}>
            <H2 th={th} style={{ marginBottom: 18 }}>{L(P.formTitle, lang)}</H2>

            {st === "success" ? (
              <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
                <span style={{ width: 56, height: 56, borderRadius: 999, background: th.redSoft, color: th.red,
                  display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Icon name="check" size={28} sw={2.4} /></span>
                <div style={{ fontFamily: "Cairo, sans-serif", fontWeight: 700, fontSize: 16, color: th.text, marginBottom: 16 }}>
                  {L(P.success, lang)}</div>
                <Btn th={th} lang={lang} variant="ghost" onClick={reset}>
                  {lang === "ar" ? "إرسال رسالة أخرى" : "Send another"}</Btn>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                <div style={fieldWrap}>
                  <label style={labelSt}>{L(P.fields.name, lang)}</label>
                  <input value={v.name} onChange={e => set("name", e.target.value)} style={inputSt(err.name)} />
                  {err.name && <span style={{ fontSize: 12, color: th.red }}>{err.name}</span>}
                </div>
                <div style={fieldWrap}>
                  <label style={labelSt}>{L(P.fields.email, lang)}</label>
                  <input type="email" dir="ltr" value={v.email} onChange={e => set("email", e.target.value)}
                    style={{ ...inputSt(err.email), textAlign: lang === "ar" ? "right" : "left" }} />
                  {err.email && <span style={{ fontSize: 12, color: th.red }}>{err.email}</span>}
                </div>
                <div style={fieldWrap}>
                  <label style={labelSt}>{L(P.fields.phone, lang)}</label>
                  <input type="tel" dir="ltr" value={v.phone} onChange={e => set("phone", e.target.value)}
                    style={{ ...inputSt(false), textAlign: lang === "ar" ? "right" : "left" }} />
                </div>
                <div style={fieldWrap}>
                  <label style={labelSt}>{L(P.fields.message, lang)}</label>
                  <textarea rows={4} value={v.message} onChange={e => set("message", e.target.value)}
                    style={{ ...inputSt(err.message), resize: "none", lineHeight: 1.6 }} />
                  {err.message && <span style={{ fontSize: 12, color: th.red }}>{err.message}</span>}
                </div>
                <Btn th={th} full lang={lang} onClick={submit} style={{ marginTop: 4, opacity: st === "loading" ? .7 : 1 }}>
                  {st === "loading"
                    ? <><span style={{ width: 17, height: 17, border: "2.5px solid rgba(255,255,255,.4)", borderTopColor: "#fff",
                        borderRadius: 999, animation: "bpspin .7s linear infinite" }} /> {L(P.sending, lang)}</>
                    : <><Icon name="send" size={18} flip={lang === "ar"} /> {L(P.send, lang)}</>}
                </Btn>
              </div>
            )}
          </div>
        </Section>
      </div>
    </window.PageCol>
  );
}

Object.assign(window, { MenuSheet, ContactScreen });
