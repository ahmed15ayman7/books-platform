/* Home tab + the More bottom sheet (opened from the home app bar's menu button). */
(function () {
  const BP = window.BP;
  const V = BP.views;
  const ic = BP.icon;

  const hero = (ctx) => {
    const slides = BP.data.heroSlides;
    const s = slides[ctx.state.heroIndex || 0];
    const c = s.colors;
    const dots = slides.map((_, i) => `<i class="${i === (ctx.state.heroIndex || 0) ? 'on' : ''}"></i>`).join('');
    return `<div class="hero-wrap"><div class="hero" style="background:linear-gradient(135deg,${c[0]},${c[1]})"><div class="hero-ov"></div><div class="hero-tx"><h2>${BP.L(ctx, s.titleAr, s.titleEn)}</h2>${s.subtitleAr ? `<p>${BP.L(ctx, s.subtitleAr, s.subtitleEn)}</p>` : ''}</div><div class="hero-dots">${dots}</div></div></div>`;
  };

  const categoryChips = (ctx) =>
    `<div class="hs" style="padding-top:0">${BP.data.categories
      .map((c) => `<button class="catchip" data-go="categoryBooks" data-extra='{"catSlug":"${c.slug}"}'><span class="cico">${ic('menu_book_outlined', 17)}</span>${BP.L(ctx, c.nameAr, c.nameEn)}</button>`)
      .join('')}</div>`;

  const carousel = (ctx, title, books, go) =>
    `<div style="padding-top:26px;padding-bottom:12px">${BP.sectionHeader(ctx, title, go)}</div><div class="car">${books.map((b) => BP.bookCard(ctx, b)).join('')}</div>`;

  const newsletter = (ctx) =>
    `<div style="padding:28px 16px 6px"><div class="nl"><h4>${BP.t(ctx, 'newsletter_title')}</h4><p>${BP.t(ctx, 'newsletter_subtitle')}</p><div class="nl-act"><button class="nl-btn" data-go="home" data-extra='{"sheet":"newsletter"}'>${BP.t(ctx, 'newsletter_subscribe')}</button></div></div></div>`;

  const shimmer = () =>
    `<div style="padding:16px 16px 8px">${BP.sk('100%', 200, 26)}</div>${[0, 1]
      .map(() => `<div style="padding:26px 16px 12px">${BP.sk(140, 18, 4)}</div><div class="car">${[0, 1, 2].map(BP.bookCardSk).join('')}</div>`)
      .join('')}<div style="padding:28px 16px 6px">${BP.sk('100%', 120, 24)}</div>`;

  const moreSheet = (ctx) => {
    const row = (icon, key, go, extra) =>
      `<button class="mrow" data-go="${go}"${extra ? ` data-extra='${extra}'` : ''}>${ic(icon, 22, 'red')}<span>${BP.t(ctx, key)}</span>${ic('chevron_right_rounded', 20, 'sec')}</button>`;
    return BP.sheet(
      `${row('translate_rounded', 'recommended_for_translation_title', 'recommendedBooks')}${row('auto_stories_rounded', 'translated_books_title', 'translatedBooks')}${row('notifications_outlined', 'notifications_title', 'notifications')}<div class="hr"></div>${row('info_outline_rounded', 'about_us_title', 'about')}${row('work_outline_rounded', 'services_title', 'services')}${row('people_outline_rounded', 'team_title', 'team')}${row('mail_outline_rounded', 'contact_us_title', 'contact')}${row('privacy_tip_outlined', 'privacy_policy_title', 'privacy')}${row('gavel_rounded', 'terms_of_use_title', 'terms')}<div style="height:26px"></div>`,
      'home',
    );
  };

  const nlSheet = (ctx) =>
    BP.sheet(
      `<div class="nlsheet"><h4>${BP.t(ctx, 'newsletter_title')}</h4><p>${BP.t(ctx, 'newsletter_subtitle')}</p><div class="hs" style="padding:16px 0 0">${BP.chip(BP.t(ctx, 'arabic'), BP.isAr(ctx))}${BP.chip(BP.t(ctx, 'english'), !BP.isAr(ctx))}</div><div class="inp ph" style="margin-top:14px">${BP.t(ctx, 'newsletter_email_hint')}</div><button class="btn" style="margin-top:14px">${BP.t(ctx, 'newsletter_subscribe')}</button></div>`,
      'home',
    );

  V.home = (ctx, opts) => {
    const st = ctx.state;
    let body;
    if (st.variant === 'loading') body = shimmer();
    else if (st.variant === 'error') body = BP.errorState(ctx);
    else {
      const d = BP.data;
      body = `${hero(ctx)}<div style="padding:14px 0 12px">${BP.sectionHeader(ctx, BP.t(ctx, 'home.browse_by_category'), 'catalog')}</div>${categoryChips(ctx)}${carousel(ctx, BP.t(ctx, 'home.newly_released'), d.freshBooks, 'catalog')}${carousel(ctx, BP.t(ctx, 'home.translated_books'), d.translatedBooks, 'catalog')}${d.categorySections.map((s) => carousel(ctx, BP.L(ctx, s.category.nameAr, s.category.nameEn), s.books, 'catalog')).join('')}${newsletter(ctx)}<div style="height:16px"></div>`;
    }
    const sheet = (opts && opts.sheet) || st.sheet;
    return BP.page({
      bar: BP.appBar(ctx, { home: true, search: true, menu: true }),
      body,
      cls: st.variant === 'error' ? 'flexcol' : '',
      nav: BP.bottomNav(ctx, 'home'),
      overlay: sheet === 'more' ? moreSheet(ctx) : sheet === 'newsletter' ? nlSheet(ctx) : '',
    });
  };
  V.more = (ctx) => V.home(ctx, { sheet: 'more' });
})();
