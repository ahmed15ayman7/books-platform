/* Search, Wishlist and Cart. */
(function () {
  const BP = window.BP;
  const V = BP.views;
  const ic = BP.icon;

  /* ---------- Search ---------- */
  const initials = (name) => name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  const header = (ctx, q, focused) =>
    `<div class="sh-bar"><button class="cbtn" data-back>${ic('arrow_back_rounded', 20)}</button><div class="sfield${focused ? ' foc' : ''}">${ic('search_rounded', 18)}${q ? `<span class="q">${BP.esc(q)}</span>` : `<span class="ph">${BP.t(ctx, 'search.hint')}</span>`}${q ? ic('close_rounded', 17, 'x') : ''}</div></div>`;

  const history = (ctx) => {
    const h = BP.data.search.history;
    const shown = h.slice(0, 5);
    return `<div style="padding:16px 16px 4px"><div class="hrow"><b>${BP.t(ctx, 'search.recent_searches')}</b><button data-set="variant=historysheet">${BP.t(ctx, 'search.clear_all')}</button></div><div class="hchips">${shown
      .map((x) => `<span class="hchip">${ic('search_rounded', 13)}<i>${BP.esc(x)}</i>${ic('close_rounded', 12)}</span>`)
      .join('')}</div>${h.length > 5 ? `<button class="more" data-set="variant=historysheet">${BP.t(ctx, 'search.show_more', h.length - 5)}</button>` : ''}</div>`;
  };

  const historySheet = (ctx) =>
    BP.sheet(
      `<div class="hs-head"><b>${BP.t(ctx, 'search.recent_searches')}</b><button>${BP.t(ctx, 'search.clear_all')}</button></div><div class="hr" style="margin:0"></div>${BP.data.search.history
        .map((x) => `<div class="hs-row">${ic('search_rounded', 18)}<span>${BP.esc(x)}</span>${ic('close_rounded', 16)}</div>`)
        .join('')}<div style="height:24px"></div>`,
      'search',
    );

  const suggestions = (ctx) => {
    const T = { book: ['menu_book_rounded', 'search.book_label'], publisher: ['business_rounded', 'search.publisher_label'], article: ['article_outlined', 'search.article_label'] };
    return `<div style="padding:8px 16px 4px"><b class="sg-h">${BP.t(ctx, 'search.suggestions_header')}</b>${BP.data.search.suggestions
      .map((s) => `<div class="sg-row">${ic(T[s.type][0], 16)}<span>${BP.esc(BP.L(ctx, s.label, s.labelEn))}</span><em>${BP.t(ctx, T[s.type][1])}</em></div>`)
      .join('')}<div class="hr" style="margin:6px 0 0"></div></div>`;
  };

  const tabs = (ctx, active) => {
    const counts = { books: 24, articles: 8, publishers: 2 };
    const all = counts.books + counts.articles + counts.publishers;
    const tab = (k, key, n) =>
      `<button class="stab${active === k ? ' on' : ''}" data-set="searchTab=${k}">${BP.t(ctx, key)}${n > 0 ? `<i>${n}</i>` : ''}</button>`;
    return `<div class="hs" style="padding:8px 16px 4px">${tab('all', 'search.tab_all', all)}${tab('books', 'search.tab_books', counts.books)}${tab('articles', 'search.tab_articles', counts.articles)}${tab('publishers', 'search.tab_publishers', counts.publishers)}</div>`;
  };

  const rBook = (ctx, b) =>
    `<div class="rc" data-go="bookDetail" data-extra='{"slug":"${b.slug}"}'><div class="rcv">${BP.cover(b, { small: true, nospine: true, radius: 6 })}</div><div class="rt"><b>${BP.esc(BP.bookTitle(ctx, b))}</b><span class="lat">${BP.esc(b.publisher)}</span></div><em class="bg red">${BP.t(ctx, 'search.book_label')}</em></div>`;
  const rPub = (ctx, p) =>
    `<div class="rc" data-go="publisherDetail" data-extra='{"publisherId":"${p.id}"}'><span class="pav">${initials(p.name)}</span><div class="rt"><b>${BP.esc(BP.L(ctx, p.nameAr, p.name))}</b><span class="lat">${p.bookCount} ${BP.t(ctx, 'common.books')}</span></div><em class="bg blk">${BP.t(ctx, 'search.publisher_label')}</em></div>`;
  const rArt = (ctx, a) =>
    `<div class="rc" data-go="articleDetail" data-extra='{"articleSlug":"${a.slug}"}'><span class="aph">${ic('article_outlined', 22)}</span><div class="rt"><b>${BP.esc(a.title)}</b><span>${BP.esc(a.excerpt)}</span></div><em class="bg gry">${BP.t(ctx, 'search.article_label')}</em></div>`;

  const results = (ctx) => {
    const tab = ctx.state.searchTab || 'all';
    const d = BP.data;
    const books = d.books.slice(2, 5);
    const arts = d.articles.slice(0, 2);
    const pubs = d.publishers.slice(0, 2);
    let list = '';
    if (tab === 'all') list = pubs.map((p) => rPub(ctx, p)).join('') + books.map((b) => rBook(ctx, b)).join('') + arts.map((a) => rArt(ctx, a)).join('');
    else if (tab === 'books') list = books.map((b) => rBook(ctx, b)).join('');
    else if (tab === 'articles') list = arts.map((a) => rArt(ctx, a)).join('');
    else list = pubs.map((p) => rPub(ctx, p)).join('');
    return `${suggestions(ctx)}${tabs(ctx, tab)}<div class="rlist">${list}</div>`;
  };

  const noResults = (ctx, q) =>
    `<div class="state" style="padding-top:60px"><div class="nores">${ic('search_off_rounded', 38)}</div><h4 style="font:800 17px var(--font-display)">${BP.t(ctx, 'search.no_results_prefix')} «${BP.esc(q)}»</h4><p style="font-size:13px;margin-top:8px">${BP.t(ctx, 'search.suggestions_title')}</p><div class="fchips">${['search.fallback_suggestion_1', 'search.fallback_suggestion_2', 'search.fallback_suggestion_3'].map((k) => `<span>${BP.t(ctx, k)}</span>`).join('')}</div></div>`;

  V.search = (ctx) => {
    const v = ctx.state.variant;
    const q = BP.isAr(ctx) ? BP.data.search.query : BP.data.search.queryEn;
    let body;
    let text = '';
    let overlay = '';
    if (v === 'results') { body = results(ctx); text = q; }
    else if (v === 'noresults') { text = BP.isAr(ctx) ? 'زززز' : 'zzzz'; body = noResults(ctx, text); }
    else if (v === 'loading') { text = q; body = BP.spinner(); }
    else if (v === 'error') { text = q; body = BP.errorState(ctx); }
    else { body = history(ctx); if (v === 'historysheet') overlay = historySheet(ctx); }
    return BP.page({ sb: BP.statusBar(false), bar: `<div class="sbar-wrap">${header(ctx, text, v !== 'default' && v !== 'historysheet')}</div>`, body, cls: v === 'loading' || v === 'error' ? 'flexcol' : '', overlay });
  };

  /* ---------- Wishlist ---------- */
  V.wishlist = (ctx) => {
    const v = ctx.state.variant;
    const items = BP.data.wishlist;
    let body;
    if (v === 'loading') body = BP.spinner();
    else if (v === 'error') body = `<div class="center" style="color:var(--color-error);font:14px var(--font-display);text-align:center;padding:16px">${BP.t(ctx, 'errors.something_went_wrong')}</div>`;
    else if (v === 'empty') body = BP.empty('favorite_border_rounded', BP.t(ctx, 'wishlist_empty_title'), BP.t(ctx, 'wishlist_empty_subtitle'));
    else {
      const rows = items
        .map((it) => {
          const b = BP.bookBySlug(it.bookSlug);
          return `<div class="wrow" data-go="bookDetail" data-extra='{"slug":"${it.bookSlug}"}'><div class="wcv">${BP.cover(b, { small: true, nospine: true, radius: 6 })}</div><b>${BP.esc(it.titleAr)}</b>${ic('chevron_right_rounded', 20, 'sec')}</div>`;
        })
        .join('');
      body = `${rows}<p class="wdis">${BP.t(ctx, 'wishlist_disclosure')}</p>`;
    }
    return BP.page({
      bar: BP.appBar(ctx, { title: BP.t(ctx, 'wishlist_title') }),
      body,
      cls: v === 'default' || !v ? '' : 'flexcol',
      nav: BP.bottomNav(ctx, 'wishlist'),
    });
  };

  /* ---------- Cart (shipped app: nothing can add items, so the empty state is the default) ---------- */
  const money = (n) => `$${n.toFixed(2)}`;
  V.cart = (ctx) => {
    const st = ctx.state;
    const items = st.variant === 'populated' ? BP.data.cart : [];
    if (!items.length) {
      return BP.page({
        bar: BP.appBar(ctx, { title: BP.t(ctx, 'cart.title'), back: true }),
        body: BP.empty('shopping_bag_outlined', BP.t(ctx, 'cart.empty_title'), BP.t(ctx, 'cart.empty_subtitle'), `<button class="btn" style="width:auto;padding:0 28px" data-go="catalog">${BP.t(ctx, 'cart.browse_books')}</button>`),
        cls: 'flexcol',
      });
    }
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const sub = items.reduce((n, i) => n + i.price * i.quantity, 0);
    const fee = 2.5;
    const lines = items
      .map((it) => {
        const b = BP.bookBySlug(it.slug);
        return `<div class="cline"><div class="cl-cv">${BP.cover(b, { small: true, radius: 8 })}</div><div style="flex:1;min-width:0"><div class="cl-top"><b>${BP.esc(b.titleAr)}</b>${ic('delete_outline_rounded', 18, 'hint')}</div><div class="lat cl-pub">${BP.esc(b.publisher)}</div><div class="cl-bot"><span class="pr">${money(it.price * it.quantity)}</span><span class="step">${ic('remove_rounded', 15)}<i>${it.quantity}</i>${ic('add_rounded', 15)}</span></div></div></div>`;
      })
      .join('');
    const summary = `<div class="csum"><div class="sr"><span>${BP.t(ctx, 'cart.subtotal')}</span><b>${money(sub)}</b></div><div class="sr"><span>${BP.t(ctx, 'cart.service_fee')}</span><b>${money(fee)}</b></div><div class="hr" style="margin:10px 0"></div><div class="tot"><span>${BP.t(ctx, 'cart.total')}</span><b>${money(sub + fee)}</b></div><button class="btn" style="margin-top:16px">${BP.t(ctx, 'cart.checkout')}</button><p class="cnote">${BP.t(ctx, 'cart.checkout_note')}</p></div>`;
    return BP.page({
      bar: BP.appBar(ctx, { title: BP.t(ctx, 'cart.title'), subtitle: `${count} ${BP.t(ctx, 'cart.books_unit')}`, back: true }),
      body: `<div style="padding:16px">${lines}<div style="height:6px"></div>${summary}</div>`,
    });
  };
})();
