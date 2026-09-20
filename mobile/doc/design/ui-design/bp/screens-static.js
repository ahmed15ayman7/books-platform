/* About, Services, Team, Contact and the legal static pages. Copy comes from BP.COPY (generated from the Dart sources). */
(function () {
  const BP = window.BP;
  const V = BP.views;
  const ic = BP.icon;
  const C = BP.COPY;
  const tx = (ctx, o) => BP.esc(BP.isAr(ctx) ? o.ar : o.en);

  const hero = (ctx, icon, title, sub) =>
    `<div class="ihero"><i class="c1"></i>${title ? '<i class="c2"></i>' : ''}<div class="ico">${ic(icon, 25)}</div>${title ? `<h1>${title}</h1>` : ''}<p${title ? '' : ' style="margin-top:14px"'}>${sub}</p></div>`;
  const secTitle = (t, start) => `<div class="stitle${start ? ' start' : ''}">${ic('bookmark_rounded', 20)}<h2>${t}</h2></div>`;
  const belief = (t) => `<div class="belief">${ic('bookmark_rounded', 22)}<p>${t}</p></div>`;
  const wrap = (html) => `<div style="padding:26px 16px 0">${html}</div>`;
  const shell = (ctx, titleKey, back, body) =>
    BP.page({ bar: BP.appBar(ctx, { title: BP.t(ctx, titleKey), back }), body });

  V.about = (ctx) => {
    const a = C.about;
    const intro = wrap(`${secTitle(tx(ctx, a.introTitle))}<div class="icard" style="padding:20px">${a.intro.map((p) => `<p class="para">${tx(ctx, p)}</p>`).join('')}</div>`);
    const idea = `<div style="padding:26px 16px 0"><div class="idea"><i></i><h3>${tx(ctx, a.ideaTitle)}</h3><p>${tx(ctx, a.idea)}</p></div></div>`;
    const pillars = `<div style="padding:16px 16px 0"><div class="pillars">${a.pillars
      .map((p) => `<div class="pillar"><div class="pico">${ic(p.icon, 22)}</div><h4>${tx(ctx, p.title)}</h4><p>${tx(ctx, p.text)}</p></div>`)
      .join('')}</div></div>`;
    const distinct = wrap(`${secTitle(tx(ctx, a.distinctTitle), true)}${a.distinct
      .map((d) => `<div class="icard row"><span class="ord">${tx(ctx, d.label)}</span><p>${BP.esc(BP.isAr(ctx) ? d.ar : d.en)}</p></div>`)
      .join('')}`);
    const efforts = wrap(`${secTitle(tx(ctx, a.effortsTitle), true)}<div class="icard" style="padding:8px 18px">${a.efforts
      .map((e, i) => `<div class="eff"><span class="num">${i + 1}</span><p>${BP.esc(BP.isAr(ctx) ? e.ar : e.en)}</p></div>`)
      .join('')}</div>`);
    return shell(ctx, 'about_us_title', true,
      `${hero(ctx, 'bookmark_rounded', tx(ctx, a.pageTitle), tx(ctx, a.heroSubtitle))}${intro}${idea}${pillars}${distinct}${efforts}<div style="height:26px"></div>${belief(tx(ctx, a.belief))}`);
  };

  V.services = (ctx) => {
    const s = C.services;
    const list = wrap(`${secTitle(tx(ctx, s.listTitle))}<p class="para c">${tx(ctx, s.listIntro)}</p><div class="icard" style="padding:8px 18px">${s.servicesList
      .map((e, i) => `<div class="eff"><span class="num f">${i + 1}</span><p style="color:var(--color-text-primary)">${BP.esc(BP.isAr(ctx) ? e.ar : e.en)}</p></div>`)
      .join('')}</div>`);
    const comps = wrap(`${secTitle(tx(ctx, s.mapTitle))}${s.components
      .map((c) => `<div class="icard comp"><div class="pico big">${ic(c.icon, 22)}</div><div style="flex:1;min-width:0"><h4>${tx(ctx, c.title)}</h4><p>${tx(ctx, c.desc)}</p>${c.chips && c.chips.length ? `<div class="chips">${c.chips.map((x) => `<span>${BP.esc(x)}</span>`).join('')}</div>` : ''}</div></div>`)
      .join('')}`);
    const biblio = `<div style="padding:26px 16px 0"><div class="redpanel"><span class="bk">${ic('bookmark_rounded', 30)}</span><h3>${tx(ctx, s.biblioTitle)}</h3><p>${tx(ctx, s.biblio)}</p></div></div>`;
    const outs = wrap(`${secTitle(tx(ctx, s.outputsTitle))}${s.outputs
      .map((o) => `<div class="darkcard"><h4>${tx(ctx, o.title)}</h4><p>${tx(ctx, o.desc)}</p><div class="who"><b>${BP.t(ctx, 'services.target_audience')}</b><span>${tx(ctx, o.who)}</span></div></div>`)
      .join('')}`);
    return shell(ctx, 'services_title', true,
      `${hero(ctx, 'work_outline_rounded', tx(ctx, s.pageTitle), tx(ctx, s.heroSubtitle))}${list}${comps}${biblio}${outs}<div style="height:26px"></div>${belief(tx(ctx, s.closing))}`);
  };

  V.team = (ctx) => {
    const t = C.team;
    const members = t.members
      .map((m) => `<div class="icard mem"><span class="av">${BP.esc(m.initials)}</span><div style="flex:1;min-width:0"><h4>${tx(ctx, m.name)}</h4><b>${tx(ctx, m.role)}</b><p>${tx(ctx, m.bio)}</p></div></div>`)
      .join('');
    const intro = wrap(`${secTitle(tx(ctx, t.introTitle))}<p class="para c">${tx(ctx, t.intro)}</p>${members}`);
    return shell(ctx, 'team_title', true,
      `${hero(ctx, 'people_outline_rounded', tx(ctx, t.pageTitle), tx(ctx, t.heroSubtitle))}${intro}<div style="height:26px"></div>${belief(tx(ctx, t.belief))}`);
  };

  const SOCIAL = ['x', 'facebook', 'instagram', 'telegram', 'youtube', 'linkedin'];
  V.contact = (ctx) => {
    const L = (ar, en) => BP.L(ctx, ar, en);
    const st = ctx.state;
    const phoneCard = `<div style="padding:20px 16px 0"><div class="phonecard">${ic('phone_outlined', 34)}<div class="ph">01005772608 (2+)</div><div class="hrs">${L('متاح من الساعة 10:00 صباحًا حتى 19:00 مساءً', 'Available from 10:00 AM to 7:00 PM')}</div><div class="sep"></div>${['info@booksplatform.net', 'atefmazhar@yahoo.com'].map((e) => `<div class="em">${ic('mail_outline_rounded', 17)}<span>${e}</span></div>`).join('')}</div></div>`;
    const follow = `<div class="follow"><div>${L('تابعنا على', 'Follow us on')}</div><div class="soc">${SOCIAL.map((n) => `<span class="sc${n === 'linkedin' ? ' dim' : ''}"><img src="assets/social/${n}.svg" width="20" height="20" alt="${n}"></span>`).join('')}</div></div>`;
    const field = (lb, ph, err, multi) => `<div class="cf"><label>${lb}</label><div class="cin${multi ? ' m' : ''}${err ? ' bad' : ''}"></div>${err ? `<small>${err}</small>` : ''}</div>`;
    const errs = st.variant === 'errors';
    const form =
      st.variant === 'success'
        ? `<div class="okbox"><div class="okc">${ic('check_rounded', 28)}</div><p>${L('تم إرسال رسالتك بنجاح! سنرد عليك في غضون 2–3 أيام عمل.', "Your message was sent! We'll get back to you within 2–3 business days.")}</p><button class="btn out" style="width:auto;height:44px;padding:0 24px;border-radius:12px;font-size:14px" data-set="variant=default">${L('إرسال رسالة أخرى', 'Send another')}</button></div>`
        : `<h3 class="ftitle">${L('أرسل رسالة', 'Send a message')}</h3>${field(L('الاسم الكامل', 'Full name'), '', errs && BP.t(ctx, 'contact.name_required'))}${field(L('البريد الإلكتروني', 'Email address'), '', errs && BP.t(ctx, 'validation.email'))}${field(L('رقم الهاتف (اختياري)', 'Phone (optional)'), '')}${field(L('الرسالة', 'Message'), '', errs && BP.t(ctx, 'contact.message_required'), true)}<button class="btn" style="height:auto;padding:14px;border-radius:14px;font-size:15px;font-family:var(--font-display)" data-set="variant=success">${ic('send_rounded', 18)}${L('إرسال', 'Send')}</button>`;
    return shell(ctx, 'contact_us_title', true,
      `${hero(ctx, 'mail_outline_rounded', '', L('يسعدنا التواصل معك في أي وقت. راسلنا واستفسر عن أي شيء.', 'We are happy to hear from you at any time. Reach out with any question.'))}${phoneCard}${follow}<div style="padding:24px 16px 30px"><div class="formcard">${form}</div></div>`);
  };

  const legal = (kind) => (ctx) => {
    const l = C.legal;
    const isP = kind === 'privacy';
    const md = C.md[kind][ctx.state.lang].replace(/^#\s+[^\n]*\n+/, '');
    const title = tx(ctx, isP ? l.privacyTitle : l.termsTitle);
    return shell(ctx, isP ? 'privacy_policy_title' : 'terms_of_use_title', true,
      `${hero(ctx, isP ? 'privacy_tip_outlined' : 'description_outlined', title, tx(ctx, isP ? l.privacyHeroSubtitle : l.termsHeroSubtitle))}${wrap(`${secTitle(tx(ctx, isP ? l.privacySectionTitle : l.termsSectionTitle))}<div class="icard md" style="padding:8px 20px 22px">${BP.md(md)}</div>`)}<div style="height:26px"></div>${belief(tx(ctx, isP ? l.privacyBelief : l.termsBelief))}`);
  };
  V.privacy = legal('privacy');
  V.terms = legal('terms');
})();
