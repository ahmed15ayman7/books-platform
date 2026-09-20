/* Shared view helpers. Every helper returns an HTML string; `ctx` is the mounted logic object (ctx.state.lang etc.). */
(function () {
  const BP = (window.BP = window.BP || {});
  BP.views = {};
  BP.initialState = {
    lang: 'ar',
    variant: 'default',
    scroll: 0,
    prev: 'home',
    slug: 'the-burnout-society',
    articleSlug: 'reading-season-picks',
    publisherId: 'princeton',
  };

  BP.resetState = {
    slug: 'the-burnout-society', articleSlug: 'reading-season-picks', publisherId: 'princeton', catSlug: 'economy-and-development',
    descExpanded: false, artExpanded: false, pubExpanded: false, saved: false, catStatus: '', catSort: 'newest', catCategory: '',
    artChannel: '', mediaChannel: '', pubCountry: '', searchTab: 'all', pubStep: 0, pubAgree: false, slide: 0, heroIndex: 0,
  };

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  BP.esc = esc;
  BP.isAr = (ctx) => ctx.state.lang === 'ar';
  BP.L = (ctx, ar, en) => (BP.isAr(ctx) ? ar : en == null ? ar : en);
  BP.t = (ctx, key, arg) => {
    const raw = BP.STR[ctx.state.lang][key];
    const s = raw == null ? key : raw;
    return esc(arg === undefined ? s : s.replace('{}', arg));
  };
  BP.tRaw = (ctx, key) => BP.STR[ctx.state.lang][key] || key;

  // Directional icons that Flutter mirrors automatically under RTL (IconData.matchTextDirection).
  const MIRROR = new Set(['arrow_back', 'arrow_forward', 'chevron_right', 'chevron_left', 'keyboard_arrow_right', 'keyboard_arrow_left', 'send']);
  BP.icon = (name, size, extra) => {
    let fam = 'mi';
    let n = name;
    if (n.endsWith('_outlined')) {
      fam = 'mio';
      n = n.slice(0, -9);
    } else if (n.endsWith('_rounded')) {
      n = n.slice(0, -8);
    }
    const mir = MIRROR.has(n) ? ' mirror' : '';
    return `<span class="${fam}${mir}${extra ? ' ' + extra : ''}" style="font-size:${size || 22}px">${n}</span>`;
  };
  const ic = BP.icon;

  BP.statusBar = (light) =>
    `<div class="sb${light ? ' light' : ''}"><span>9:41</span><span class="r">${ic('signal_cellular_alt', 16)}${ic('wifi', 16)}${ic('battery_full', 18)}</span></div>`;

  BP.page = (p) =>
    `${p.sb == null ? BP.statusBar(false) : p.sb}${p.bar || ''}<div class="body${p.cls ? ' ' + p.cls : ''}" data-scroll>${p.body || ''}</div>${p.nav || ''}${p.overlay || ''}<div class="hi${p.hiLight ? ' light' : ''}"></div>`;

  BP.langToggle = (ctx) =>
    `<div class="lang"><button data-set="lang=ar" class="${ctx.state.lang === 'ar' ? 'on' : ''}">ع</button><button data-set="lang=en" class="${ctx.state.lang === 'en' ? 'on' : ''}">EN</button></div>`;

  /* AppBarWidget: opts { home, title, subtitle, back, search, menu, lang=true } */
  BP.appBar = (ctx, o) => {
    const back = o.back ? `<button class="cbtn" data-back>${ic('arrow_back_rounded', 20)}</button>` : '';
    const lead = o.home
      ? `<div class="brand"><img src="assets/app_icon_removed_bg_1024.png" alt=""><div><div class="nm">${BP.t(ctx, 'brand.name')}</div><div class="tg">${BP.t(ctx, 'brand.tagline')}</div></div></div>`
      : `<div style="min-width:0"><div class="abt">${o.title}</div>${o.subtitle ? `<div class="abs">${o.subtitle}</div>` : ''}</div>`;
    const search = o.search ? `<button class="cbtn" data-go="search">${ic('search_rounded', 20)}</button>` : '';
    const menu = o.menu ? `<button data-go="more" style="display:grid;place-items:center;width:40px;height:40px">${ic('menu_rounded', 24)}</button>` : '';
    return `<div class="appbar"><div class="lead">${back}${lead}</div><div class="acts">${o.lang === false ? '' : BP.langToggle(ctx)}${search}${o.actsExtra || ''}${menu}</div></div>`;
  };

  /* BottomNavWidget: active in home|catalog|articles|wishlist|media|publishers */
  const TABS = {
    home: ['home_outlined', 'home_rounded', 'nav.home'],
    catalog: ['menu_book_outlined', 'menu_book_rounded', 'nav.books'],
    articles: ['article_outlined', 'article_rounded', 'nav.articles'],
    wishlist: ['favorite_border_rounded', 'favorite_rounded', 'nav.wishlist'],
    media: ['play_circle_outline_rounded', 'play_circle_rounded', 'nav.media'],
    publishers: ['business_outlined', 'business_rounded', 'nav.publishers'],
  };
  BP.bottomNav = (ctx, active) => {
    const tab = (k) => {
      const [off, on, label] = TABS[k];
      const isOn = k === active;
      return `<button class="tab${isOn ? ' on' : ''}" data-go="${k}">${ic(isOn ? on : off, 23)}<span>${BP.t(ctx, label)}</span></button>`;
    };
    return `<nav class="nav">${['home', 'catalog', 'articles'].map(tab).join('')}<div class="slot"></div>${['wishlist', 'media', 'publishers'].map(tab).join('')}<button class="fab" data-go="publish">${ic('add_rounded', 26)}</button></nav>`;
  };

  /* Book helpers */
  BP.bookBySlug = (slug) => BP.data.books.find((b) => b.slug === slug) || BP.data.books[0];
  BP.bookTitle = (ctx, b) => (BP.isAr(ctx) ? b.titleAr : b.titleEn || b.titleAr);
  BP.catName = (ctx, slug) => {
    const key = 'categories.' + String(slug || '').replace(/-/g, '_');
    return BP.STR[ctx.state.lang][key] ? BP.t(ctx, key) : BP.t(ctx, 'categories.other');
  };
  BP.STATUS = {
    TRANSLATED: ['books.status.translated', 'var(--color-success)'],
    NOMINATED: ['books.status.nominated', 'var(--color-warning)'],
    NEW: ['common.new_badge', 'var(--color-primary)'],
  };
  BP.sbadge = (ctx, status, small) => {
    const s = BP.STATUS[status] || ['books.status.not_translated', 'var(--color-text-hint)'];
    return `<span class="sbadge${small ? ' sm' : ''}" style="background:${s[1]}">${BP.t(ctx, s[0])}</span>`;
  };
  BP.cover = (b, opts) => {
    const o = opts || {};
    const c = b.coverColors || ['#2B2540', '#46467F'];
    const cls = 'cover' + (o.nospine ? ' nospine' : '') + (o.small ? ' cv-small' : '');
    return `<div class="${cls}" style="--c0:${c[0]};--c1:${c[1]};${o.radius ? `border-radius:${o.radius}px` : ''}"><div class="cv-text"><div class="cv-pub">${esc(b.publisher)}</div><div><div class="cv-ar">${esc(b.titleAr)}</div><div class="cv-en">${esc(b.titleEn)}</div></div></div></div>`;
  };
  BP.bookCard = (ctx, b) =>
    `<div class="bcard" role="button" data-go="bookDetail" data-extra='{"slug":"${b.slug}"}'><div class="cvw">${BP.cover(b)}${b.isNew ? `<span class="newpill">${BP.t(ctx, 'common.new_badge')}</span>` : ''}</div><div class="bi"><div class="bcat">${BP.catName(ctx, b.categorySlug)}</div><div class="btitle">${esc(BP.bookTitle(ctx, b))}</div><div class="bpub">${esc(b.publisher)}</div>${BP.sbadge(ctx, b.status, true)}</div></div>`;

  BP.sectionHeader = (ctx, title, go) =>
    `<div class="sh"><h3>${title}</h3>${go ? `<button class="all" data-go="${go}">${BP.t(ctx, 'common.see_all')}${ic('chevron_right', 15)}</button>` : ''}</div>`;

  BP.chip = (label, on, attrs) => `<button class="chip${on ? ' on' : ''}" ${attrs || ''}>${label}</button>`;

  /* States */
  BP.empty = (icon, title, sub, action) =>
    `<div class="state">${ic(icon, 64)}<h4>${title}</h4>${sub ? `<p>${sub}</p>` : ''}${action || ''}</div>`;
  BP.errorState = (ctx, msg) =>
    `<div class="state err">${ic('error_outline', 64)}<p style="margin-top:16px">${msg || BP.t(ctx, 'errors.something_went_wrong')}</p><button class="btn out" style="width:auto;padding:0 24px;height:44px;font-size:15px" data-set="variant=default">${ic('refresh', 18)} ${BP.t(ctx, 'try_again')}</button></div>`;
  BP.spinner = () => `<div class="center"><div class="spin"></div></div>`;
  BP.sk = (w, h, r) => `<div class="sk" style="width:${typeof w === 'number' ? w + 'px' : w};height:${h}px;${r != null ? `border-radius:${r}px` : ''}"></div>`;
  BP.bookCardSk = () =>
    `<div class="bcard"><div class="cvw" style="background:#fff"></div><div class="bi" style="display:grid;gap:6px">${BP.sk(70, 10)}${BP.sk('100%', 13)}${BP.sk(110, 13)}${BP.sk(90, 22, 999)}</div></div>`;

  /* Bottom sheet overlay (BottomSheetHelper: top radius 16, 40x4 grabber) */
  BP.sheet = (content, closeGo) =>
    `<div class="scrim" data-go="${closeGo}"></div><div class="sheet"><div class="grab"></div>${content}</div>`;

  BP.notFound = (ctx) => BP.page({ bar: BP.appBar(ctx, { title: 'Unknown', back: true }), body: BP.empty('error_outline', 'Route not found.') });
})();

/* Tiny markdown renderer: headings, bold, links, blockquotes, lists, hr, paragraphs (enough for article/policy bodies). */
window.BP.md = (src) => {
  const inline = (s) =>
    window.BP.esc(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="mdlink">$1</a>');
  return String(src)
    .split(/\n{2,}|\n(?=#)/)
    .map((blk) => {
      const t = blk.trim();
      if (!t) return '';
      if (/^-{3,}$/.test(t)) return '<hr class="mdhr">';
      const h = t.match(/^(#{1,3})\s+([^\n]*)\n?([\s\S]*)$/);
      if (h) {
        const rest = h[3].trim();
        return `<h${h[1].length} class="mdh">${inline(h[2])}</h${h[1].length}>${rest ? `<p>${inline(rest.replace(/\n/g, ' '))}</p>` : ''}`;
      }
      if (t.startsWith('>')) return `<blockquote>${inline(t.replace(/^>\s?/gm, ''))}</blockquote>`;
      if (/^[-*]\s/.test(t)) return `<ul>${t.split('\n').map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ''))}</li>`).join('')}</ul>`;
      return `<p>${inline(t.replace(/\n/g, ' '))}</p>`;
    })
    .join('');
};
