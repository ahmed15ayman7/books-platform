/* Splash, language picker and the 3-slide onboarding. Slide copy comes from BP.COPY.onboardingSlides. */
(function () {
  const BP = window.BP;
  const V = BP.views;
  const ic = BP.icon;

  V.splash = () =>
    BP.page({
      sb: BP.statusBar(true),
      body: `<div class="splash"><img src="assets/logo.webp" alt="Books Platform" style="width:300px"></div>`,
      cls: 'dark',
      hiLight: true,
    });

  const langCard = (ctx, code, selected, suggested) => {
    const ar = code === 'ar';
    const cls = `lcard${selected ? ' sel' : suggested ? ' sug' : ''}`;
    const label = ar ? 'العربية' : 'English';
    const sub = BP.t(ctx, ar ? 'language_choose.arabic_subtitle' : 'language_choose.english_subtitle');
    return `<div class="${cls}" dir="${ar ? 'rtl' : 'ltr'}" data-go="onboarding" data-extra='{"lang":"${code}","slide":0}'><div style="flex:1"><b>${label}</b><span class="${ar ? 'lat' : ''}">${BP.esc(sub)}</span></div>${selected ? ic('check_circle_rounded', 24) : ic('chevron_right_rounded', 24)}</div>`;
  };

  V.language = (ctx) => {
    const sel = ctx.state.variant === 'selected';
    const body = `<div class="lhead"><img src="assets/logo.webp" alt="" style="width:260px"></div><div class="lbody"><h2>${BP.t(ctx, 'language_choose.title')}</h2><p>${BP.t(ctx, 'language_choose.subtitle')}</p>${langCard(ctx, 'ar', sel, !sel)}<div style="height:16px"></div>${langCard(ctx, 'en', false, false)}</div>`;
    return BP.page({ sb: BP.statusBar(true), body, cls: 'noscroll' });
  };

  V.onboarding = (ctx) => {
    const slides = BP.data ? BP.COPY.onboardingSlides : [];
    const i = Math.max(0, Math.min(2, ctx.state.slide || 0));
    const s = slides[i];
    const img = ['onboard-discover.png', 'onboard-translate.png', 'onboard-publish.png'][i];
    const last = i === 2;
    const top = `<div class="ob-top"><div class="ob-logo"><span class="sq30">${ic('menu_book_rounded', 17)}</span><b>${BP.t(ctx, 'brand.name')}</b></div>${last ? '' : `<button class="skip" data-go="home">${BP.t(ctx, 'onboarding.skip')}</button>`}</div>`;
    const slide = `<div class="ob-slide"><div class="ob-img"><img src="assets/${img}" alt=""></div><div class="ob-tx"><h2>${BP.esc(BP.L(ctx, s.titleAr, s.titleEn))}</h2><p>${BP.esc(BP.L(ctx, s.subAr, s.subEn))}</p></div></div>`;
    const dots = [0, 1, 2].map((d) => `<i class="${d === i ? 'on' : ''}"></i>`).join('');
    const btn = last
      ? `<button class="btn" data-go="home">${BP.t(ctx, 'onboarding.get_started')} ${ic('check_rounded', 18)}</button>`
      : `<button class="btn" data-set="slide=${i + 1}">${BP.t(ctx, 'common.next')} ${ic('chevron_right_rounded', 18)}</button>`;
    return BP.page({ sb: BP.statusBar(false), body: `${top}${slide}<div class="ob-bot"><div class="dots">${dots}</div>${btn}</div>`, cls: 'noscroll ob' });
  };
})();
