/* Book detail: hero, description + TTS, bibliographic table, wishlist/download actions, similar books. */
(function () {
  const BP = window.BP;
  const V = BP.views;
  const ic = BP.icon;

  const LANG_NAMES = { en: ['الإنجليزية', 'English'], fr: ['الفرنسية', 'French'], de: ['الألمانية', 'German'] };

  const hero = (ctx, b) =>
    `<div class="bd-hero" style="--c0:${b.coverColors[0]};--c1:${b.coverColors[1]}"><div class="bd-ov"></div><div class="bd-btns"><button class="glass" data-back>${ic('arrow_back_rounded', 20)}</button><button class="glass">${ic('share_outlined', 18)}</button></div><div class="bd-title"><h1>${BP.esc(b.titleAr)}</h1><div class="lat">${BP.esc(b.titleEn)}</div></div></div>`;

  const tts = (ctx) => {
    const mode = ctx.state.variant;
    const inner =
      mode === 'voice'
        ? `<div class="tts-err">${ic('info_outline_rounded', 18)}<span>${BP.t(ctx, 'tts.voice_not_available')}</span></div>`
        : `<div class="tts-row">${ic(mode === 'playing' ? 'pause_circle_filled_rounded' : 'play_circle_filled_rounded', 44, 'red')}${mode === 'playing' ? ic('stop_circle_rounded', 44, 'sec') : ''}<span style="flex:1"></span><span class="speed">1.0x ${ic('arrow_drop_down_rounded', 18)}</span></div>`;
    return `<div class="tts"><div class="tts-lb">${BP.t(ctx, 'tts.listen')}</div>${inner}</div>`;
  };

  const biblio = (ctx, b) => {
    const rows = [];
    const row = (k, v, cls, attrs) => rows.push(`<div class="bib-row"><span class="bl">${BP.t(ctx, k)}</span><span class="bv ${cls || ''}" ${attrs || ''}>${v}</span></div>`);
    const ar = BP.isAr(ctx);
    row('book_detail.publisher', BP.esc(ar ? b.publisherNameAr : b.publisherNameEn), 'link', `data-go="publisherDetail" data-extra='{"publisherId":"${b.publisherId}"}'`);
    if (b.publisherAddress) row('book_detail.publisher_address', BP.esc(b.publisherAddress), 'addr');
    row('book_detail.country', BP.esc(`${b.countryFlag} ${ar ? b.countryAr : b.countryEn}`.trim()));
    row('book_detail.publication_year', b.year);
    row('book_detail.edition', BP.esc(ar ? b.editionAr : b.edition));
    row('book_detail.pages', `${b.pages} ${BP.t(ctx, 'book_detail.pages_suffix')}`);
    row('book_detail.isbn', b.isbn);
    row('book_detail.dimensions', BP.esc(b.dimensions));
    row('book_detail.primary_category', BP.esc(ar ? b.primaryCategory.nameAr : b.primaryCategory.name), 'link', `data-go="categoryBooks" data-extra='{"catSlug":"${b.categorySlug}"}'`);
    const ln = LANG_NAMES[b.languageCode] || [b.languageCode.toUpperCase(), b.languageCode.toUpperCase()];
    row('book_detail.original_language', `${ar ? ln[0] : ln[1]} (${b.languageCode.toUpperCase()})`);
    row('book_detail.translation_status', BP.sbadge(ctx, b.status, false));
    return `<div class="bib"><div class="bib-h">${BP.t(ctx, 'book_detail.biblio_section')}</div>${rows.join('')}</div>`;
  };

  const desc = (ctx, b) => {
    const text = BP.isAr(ctx) ? b.descriptionAr : b.descriptionEn || b.descriptionAr;
    const open = !!ctx.state.descExpanded;
    const body = open ? `<div class="md" style="margin-top:-12px">${BP.md(text)}</div>` : `<p class="desc3">${BP.esc(text)}</p>`;
    return `<h3 class="dh">${BP.t(ctx, 'book_detail.description')}</h3>${body}<button class="rm" data-set="descExpanded=${!open}">${BP.t(ctx, open ? 'book_detail.show_less' : 'book_detail.read_more')}</button>`;
  };

  const similar = (ctx, b) => {
    const list = BP.data.books.filter((x) => x.slug !== b.slug).slice(0, 6);
    return `<h3 class="dh" style="padding:26px 16px 12px">${BP.t(ctx, 'book_detail.similar_books')}</h3><div class="car sim">${list.map((x) => BP.bookCard(ctx, x)).join('')}</div>`;
  };

  V.bookDetail = (ctx) => {
    const st = ctx.state;
    const b = BP.bookBySlug(st.slug);
    const saved = !!st.saved;
    if (st.variant === 'loading') return BP.page({ bar: '', sb: BP.statusBar(false), body: BP.spinner(), cls: 'flexcol' });
    if (st.variant === 'error') return BP.page({ bar: BP.appBar(ctx, { title: '', back: true }), body: BP.errorState(ctx), cls: 'flexcol' });
    const hasDl = !!b.downloadUrl;
    const saveBtn = hasDl
      ? ''
      : `<button class="btn out" style="margin-top:18px" data-set="saved=${!saved}">${ic(saved ? 'favorite_rounded' : 'favorite_border_rounded', 20)}${BP.t(ctx, saved ? 'book_detail.saved' : 'book_detail.save_to_wishlist')}</button>`;
    const info = `<div class="bd-info"><div class="bd-tags">${BP.sbadge(ctx, b.status, false)}<span class="catpill">${BP.esc(BP.isAr(ctx) ? b.primaryCategory.nameAr : b.primaryCategory.name)}</span></div>${desc(ctx, b)}${tts(ctx)}<div style="height:20px"></div>${biblio(ctx, b)}${saveBtn}</div>`;
    const bar = hasDl
      ? `<div class="dlbar"><button class="sq" data-set="saved=${!saved}">${ic(saved ? 'favorite_rounded' : 'favorite_border_rounded', 24, 'red')}</button><button class="dl">${ic('download_rounded', 22)}${BP.t(ctx, 'book_detail.free_download')}</button></div>`
      : '';
    return BP.page({ sb: BP.statusBar(true), body: `${hero(ctx, b)}${info}${similar(ctx, b)}<div style="height:24px"></div>`, nav: bar });
  };
})();
