/* Catalog (Books tab), category, translated, recommended lists. Book detail lives in screens-book-detail.js. */
(function () {
  const BP = window.BP;
  const V = BP.views;
  const ic = BP.icon;

  const grid = (ctx, books, cls) => `<div class="grid2 ${cls || ''}">${books.map((b) => BP.bookCard(ctx, b)).join('')}</div>`;
  const gridSk = (n) => `<div class="grid2 r46">${Array.from({ length: n }, BP.bookCardSk).join('')}</div>`;

  /* Renders loading / error / empty / list for the plain grid screens. */
  const listBody = (ctx, books, cls, emptyOpts) => {
    const v = ctx.state.variant;
    if (v === 'loading') return { body: gridSk(6) };
    if (v === 'error') return { body: BP.errorState(ctx), cls: 'flexcol' };
    if (!books.length && emptyOpts) return { body: BP.empty(emptyOpts[0], emptyOpts[1], emptyOpts[2]), cls: 'flexcol' };
    return { body: grid(ctx, books, cls) };
  };

  const toggleAttr = (key, value, on) => `data-set="${key}=${on ? '' : value}"`;

  V.catalog = (ctx) => {
    const st = ctx.state;
    const status = st.catStatus || '';
    const sort = st.catSort || 'newest';
    const cat = st.catCategory || '';
    const label = (k) => BP.t(ctx, k);
    let list = BP.data.books.filter((b) => (!status || b.status === status) && (!cat || b.categorySlug === cat));
    list = [...list].sort((a, b) => (sort === 'oldest' ? a.year - b.year : b.year - a.year));

    const filters = `<div class="hs">${BP.chip(label('books.status.all'), !status, 'data-set="catStatus="')}${BP.chip(label('books.status.nominated'), status === 'NOMINATED', toggleAttr('catStatus', 'NOMINATED', status === 'NOMINATED'))}${BP.chip(label('books.status.translated'), status === 'TRANSLATED', toggleAttr('catStatus', 'TRANSLATED', status === 'TRANSLATED'))}<span class="vdiv"></span>${BP.chip(label('books.sort.newest'), sort === 'newest', 'data-set="catSort=newest"')}${BP.chip(label('books.sort.oldest'), sort === 'oldest', 'data-set="catSort=oldest"')}<span class="vdiv"></span>${BP.data.categories.map((c) => BP.chip(BP.L(ctx, c.nameAr, c.nameEn), cat === c.slug, toggleAttr('catCategory', c.slug, cat === c.slug))).join('')}</div>`;

    const translatedEmpty = status === 'TRANSLATED';
    const lb = listBody(ctx, list, 'r47', [
      'menu_book_outlined',
      BP.t(ctx, translatedEmpty ? 'home.no_translated_books' : 'books.empty'),
      translatedEmpty ? BP.t(ctx, 'home.no_translated_books_subtitle') : '',
    ]);
    const tune = `<button class="cbtn">${ic('tune_rounded', 20)}</button>`;
    const sub = `${BP.L(ctx, '4,654', '4,654')} ${BP.t(ctx, 'books.books_unit')}`;
    return BP.page({
      bar: BP.appBar(ctx, { title: BP.t(ctx, 'books.title'), subtitle: sub, search: true, actsExtra: tune }),
      body: `${st.variant === 'loading' ? '' : filters}${lb.body}`,
      cls: lb.cls,
      nav: BP.bottomNav(ctx, 'catalog'),
    });
  };

  V.categoryBooks = (ctx) => {
    const slug = ctx.state.catSlug || 'economy-and-development';
    const cat = BP.data.categories.find((c) => c.slug === slug) || BP.data.categories[0];
    let list = BP.data.books.filter((b) => b.categorySlug === cat.slug);
    if (ctx.state.variant === 'empty') list = [];
    const lb = listBody(ctx, list, 'r46', ['menu_book_outlined', BP.t(ctx, 'books.empty')]);
    return BP.page({ bar: BP.appBar(ctx, { title: BP.L(ctx, cat.nameAr, cat.nameEn), back: true }), body: lb.body, cls: lb.cls });
  };

  V.translatedBooks = (ctx) => {
    const lb = listBody(ctx, BP.data.translatedBooks, 'r46');
    return BP.page({ bar: BP.appBar(ctx, { title: BP.t(ctx, 'translated_books_title'), back: true }), body: lb.body, cls: lb.cls });
  };

  V.recommendedBooks = (ctx) => {
    const lb = listBody(ctx, BP.data.nominatedBooks, 'r46');
    const notice = `<div class="notice">${BP.t(ctx, 'translation_rights_notice')}</div>`;
    return BP.page({
      bar: BP.appBar(ctx, { title: BP.t(ctx, 'recommended_for_translation_title'), back: true }),
      body: `${notice}${lb.body}`,
      cls: lb.cls,
    });
  };
})();
