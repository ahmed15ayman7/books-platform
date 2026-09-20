/* Articles (list + detail), Media, Publishers (list + detail). */
(function () {
  const BP = window.BP;
  const V = BP.views;
  const ic = BP.icon;
  const esc = BP.esc;

  const grad = (c) => `--c0:${c[0]};--c1:${c[1]}`;
  const initials = (name) => name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  /* ---------- Articles list ---------- */
  const CHANNELS = [
    ['', 'الكل', 'All'],
    ['world-reads', 'العالم يقرأ', 'World Reads'],
    ['harvest', 'حصاد الكتب', 'Book Harvest'],
    ['ideas', 'زبدة الأفكار', 'Essence of Ideas'],
  ];
  const chips = (ctx, list, active, key) =>
    `<div class="hs">${list.map((c) => BP.chip(BP.L(ctx, c[1], c[2]), active === c[0], `data-set="${key}=${c[0]}"`)).join('')}</div>`;

  const meta = (ctx, a, long) =>
    `<div class="meta lat">${a.date}${a.hasVideo ? '' : ` · ${a.readMinutes} ${BP.t(ctx, long ? 'articles.min_read' : 'articles.min')}`}</div>`;
  const artCat = (ctx, a) => esc(BP.L(ctx, a.categoryLabelAr, a.categoryLabel));

  const featured = (ctx, a) =>
    `<div style="padding:18px 16px 0"><div class="fcard" data-go="articleDetail" data-extra='{"articleSlug":"${a.slug}"}'><div class="fimg cover nospine" style="${grad(a.coverColors)}"><span class="fpill">${BP.t(ctx, 'articles.featured')}</span></div><div class="fbody"><div class="cat">${artCat(ctx, a)}</div><h3>${esc(a.title)}</h3><p>${esc(a.excerpt)}</p>${meta(ctx, a, true)}</div></div></div>`;
  const artRow = (ctx, a) =>
    `<div class="arow" data-go="articleDetail" data-extra='{"articleSlug":"${a.slug}"}'><div class="athumb cover nospine" style="${grad(a.coverColors)}"></div><div style="flex:1;min-width:0"><div class="cat">${artCat(ctx, a)}</div><b>${esc(a.title)}</b>${meta(ctx, a, false)}</div></div>`;
  const artSk = () =>
    `<div style="padding:18px 16px 24px"><div class="fcard"><div style="height:150px" class="sk"></div><div class="fbody" style="display:grid;gap:8px">${BP.sk(80, 10)}${BP.sk('100%', 16)}${BP.sk(200, 16)}${BP.sk('100%', 12)}${BP.sk(150, 12)}${BP.sk(100, 10)}</div></div>${[0, 1, 2, 3].map(() => `<div class="arow" style="margin-top:12px"><div class="athumb sk"></div><div style="flex:1;display:grid;gap:6px">${BP.sk(60, 10)}${BP.sk('100%', 13)}${BP.sk(140, 13)}${BP.sk(80, 10)}</div></div>`).join('')}</div>`;

  V.articles = (ctx) => {
    const st = ctx.state;
    const ch = st.artChannel || '';
    const list = BP.data.articles.filter((a) => a.channel !== 'novel-story' && (!ch || a.channel === ch));
    let body;
    let cls = '';
    if (st.variant === 'loading') body = artSk();
    else if (st.variant === 'error') { body = BP.errorState(ctx); cls = 'flexcol'; }
    else if (!list.length || st.variant === 'empty') {
      body = `${chips(ctx, CHANNELS, ch, 'artChannel')}${BP.empty('article_outlined', BP.t(ctx, 'articles.empty'), BP.t(ctx, 'articles.section_empty_subtitle'))}`;
      cls = 'flexcol';
    } else body = `${chips(ctx, CHANNELS, ch, 'artChannel')}${featured(ctx, list[0])}<div class="arows">${list.slice(1).map((a) => artRow(ctx, a)).join('')}</div>`;
    return BP.page({ bar: BP.appBar(ctx, { title: BP.t(ctx, 'articles.title') }), body, cls, nav: BP.bottomNav(ctx, 'articles') });
  };

  /* ---------- Article detail ---------- */
  const comment = (c) => `<div class="ccard"><div class="chd"><b>${esc(c.authorName)}</b><span class="lat">${c.date}</span></div><p>${esc(c.content)}</p></div>`;

  const commentSheet = (ctx) =>
    BP.sheet(
      `<div class="csheet"><h4>${BP.t(ctx, 'comments_leave_comment')}</h4>${[['comments_author_name', 46], ['comments_email_optional', 46], ['comments_content', 100]]
        .map(([k, h]) => `<div class="cf"><label>${BP.t(ctx, k)}</label><div class="cin" style="height:${h}px"></div></div>`)
        .join('')}<button class="btn" style="height:44px;border-radius:10px;font-size:15px">${BP.t(ctx, 'comments_submit')}</button></div>`,
      'articleDetail',
    );

  V.articleDetail = (ctx) => {
    const st = ctx.state;
    const base = BP.data.articleDetail;
    const sel = BP.data.articles.find((a) => a.slug === st.articleSlug) || BP.data.articles[0];
    const a = Object.assign({}, base, { title: sel.title, categoryLabel: sel.categoryLabel, hasVideo: sel.hasVideo, channel: sel.channel, coverColors: sel.coverColors, date: sel.date, readMinutes: sel.readMinutes });
    if (st.variant === 'loading') return BP.page({ sb: BP.statusBar(false), body: BP.spinner(), cls: 'flexcol' });
    if (st.variant === 'error') return BP.page({ bar: BP.appBar(ctx, { title: '', back: true }), body: BP.errorState(ctx), cls: 'flexcol' });

    const heroEl = `<div class="ahero cover nospine" style="${grad(a.coverColors)}"><button class="abk" data-back>${ic('arrow_back_rounded', 18)}</button><i class="fade"></i><span class="acat">${esc(a.categoryLabel)}</span>${a.hasVideo ? `<span class="aplay">${ic('play_circle_outline_rounded', 22)}</span>` : ''}</div>`;
    const byline = `<div style="padding:20px 16px 0"><h1 class="atitle">${esc(a.title)}</h1><div class="byl"><span class="bav">${esc(a.authorName[0] || '?')}</span><div><b>${esc(a.authorName)}</b><div class="lat bm">${a.date}<i></i>${a.readMinutes} ${BP.t(ctx, 'articles.min')}</div></div></div></div>`;
    const video = a.hasVideo
      ? `<div style="padding:14px 16px 0"><div class="vbadge">${ic('play_circle_outline_rounded', 20)}<span>${BP.t(ctx, 'article_detail.video_badge')}</span></div></div><div style="padding-top:14px"><div class="vbox">${ic('play_circle_outline', 48)}<span>${BP.t(ctx, 'watch_on_youtube')}</span></div></div>${a.channel === 'novel-story' ? `<div style="padding:8px 16px 0"><div class="aiban">${ic('auto_awesome_rounded', 16)}<span>${BP.t(ctx, 'ai_disclosure')}</span></div></div>` : ''}`
      : '';
    const tts = `<div style="padding:14px 16px 0"><div class="tts"><div class="tts-lb">${BP.t(ctx, 'tts.listen')}</div><div class="tts-row">${ic('play_circle_filled_rounded', 44, 'red')}<span style="flex:1"></span><span class="speed">1.0x ${ic('arrow_drop_down_rounded', 18)}</span></div></div></div>`;
    const paras = a.bodyParagraphs.slice();
    const md = paras.map((p, i) => BP.md(p) + (i === 1 ? `<div class="pq">${esc(a.pullQuote)}</div>` : '')).join('');
    const open = !!st.artExpanded;
    const bodyEl = `<div style="padding:18px 16px 0"><div class="md abody${open ? ' open' : ''}">${md}</div><button class="rm" data-set="artExpanded=${!open}">${BP.t(ctx, open ? 'articles.see_less' : 'articles.see_more')} ${ic(open ? 'keyboard_arrow_up_rounded' : 'keyboard_arrow_down_rounded', 18)}</button></div>`;
    const list = st.variant === 'nocomments' ? [] : BP.data.comments;
    const comments = `<div style="padding:28px 16px 0"><div class="chead"><h3>${BP.t(ctx, 'article_detail.comments')}</h3><button data-set="variant=commentsheet">${ic('add_comment_rounded', 16)}${BP.t(ctx, 'comments_leave_comment')}</button></div>${list.length ? list.map(comment).join('') : `<div style="text-align:center;padding:16px 0;color:var(--color-text-hint)">${ic('chat_bubble_outline_rounded', 64)}<p style="font:14px var(--font-body);color:var(--color-text-secondary);margin-top:8px">${BP.t(ctx, 'article_detail.no_comments')}</p></div>`}</div>`;
    const related = `<div style="padding:28px 0 0">${BP.sectionHeader(ctx, BP.t(ctx, 'articles.related'))}<div class="car" style="padding-top:12px;padding-bottom:24px">${a.relatedArticles
      .map((r) => `<div class="rel" data-go="articleDetail" data-extra='{"articleSlug":"${r.slug}"}'><div class="rimg cover nospine" style="${grad(r.coverColors)}"></div><div class="rb"><b>${esc(r.title)}</b><span class="lat">${r.readMinutes} ${BP.t(ctx, 'articles.min')}</span></div></div>`)
      .join('')}</div></div>`;
    return BP.page({
      sb: BP.statusBar(true),
      body: `${heroEl}${byline}${video}${tts}${bodyEl}${comments}${related}`,
      overlay: st.variant === 'commentsheet' ? commentSheet(ctx) : '',
    });
  };

  /* ---------- Media ---------- */
  const MEDIA_CH = [['', 'الكل', 'All'], ['books-talk', 'حديث الكتب', 'Book Talk'], ['novel-story', 'رواية وقصة', 'Novel & Story']];
  const mCard = (ctx, m) =>
    `<div class="mcard" data-go="articleDetail" data-extra='{"articleSlug":"book-talk"}'><div class="mimg cover nospine" style="${grad(m.colors)}"><span class="mplay">${ic('play_arrow_rounded', 28)}</span></div><div class="mbody"><b>${esc(m.title)}</b><div class="meta lat">${esc(BP.L(ctx, m.channelLabelAr, m.channelLabel))} · ${m.date}</div></div></div>`;
  V.media = (ctx) => {
    const st = ctx.state;
    const ch = st.mediaChannel || '';
    const list = BP.data.mediaItems.filter((m) => !ch || m.channel === ch);
    let body;
    let cls = '';
    if (st.variant === 'loading') body = `<div style="padding:16px 16px 24px;display:grid;gap:16px">${[0, 1, 2, 3].map(() => `<div class="mcard"><div class="sk" style="aspect-ratio:16/9;border-radius:0"></div><div class="mbody" style="display:grid;gap:6px">${BP.sk('100%', 14)}${BP.sk(200, 14)}${BP.sk(100, 10)}</div></div>`).join('')}</div>`;
    else if (st.variant === 'error') { body = BP.errorState(ctx); cls = 'flexcol'; }
    else if (st.variant === 'empty' || !list.length) { body = `${chips(ctx, MEDIA_CH, ch, 'mediaChannel')}${BP.empty('play_circle_outline_rounded', BP.t(ctx, 'media.empty'))}`; cls = 'flexcol'; }
    else body = `${chips(ctx, MEDIA_CH, ch, 'mediaChannel')}<div style="padding:12px 16px 24px;display:grid;gap:16px">${list.map((m) => mCard(ctx, m)).join('')}</div>`;
    return BP.page({ bar: BP.appBar(ctx, { title: BP.t(ctx, 'media.title') }), body, cls, nav: BP.bottomNav(ctx, 'media') });
  };

  /* ---------- Publishers list ---------- */
  const pCard = (ctx, p) =>
    `<div class="pcard" data-go="publisherDetail" data-extra='{"publisherId":"${p.id}"}'><span class="pav big">${initials(p.name)}</span><div style="flex:1;min-width:0"><div class="pn"><b>${esc(BP.L(ctx, p.nameAr, p.name))}</b>${p.isSponsored ? `<em>${BP.t(ctx, 'common.featured')}</em>` : ''}</div><div class="lat pc">${esc(BP.L(ctx, p.countryAr, p.countryEn))}</div></div><span class="bpill">${p.bookCount} ${BP.t(ctx, 'common.books')}</span></div>`;
  V.publishers = (ctx) => {
    const st = ctx.state;
    const country = st.pubCountry || '';
    const list = BP.data.publishers.filter((p) => !country || p.countrySlug === country);
    let body;
    let cls = '';
    if (st.variant === 'loading') body = `<div style="padding:16px 16px 24px;display:grid;gap:12px">${[0, 1, 2, 3, 4, 5].map(() => `<div class="pcard">${BP.sk(54, 54, 16)}<div style="flex:1;display:grid;gap:6px">${BP.sk('100%', 14)}${BP.sk(120, 11)}</div>${BP.sk(70, 28, 999)}</div>`).join('')}</div>`;
    else if (st.variant === 'error') { body = BP.errorState(ctx); cls = 'flexcol'; }
    else {
      const search = `<div style="padding:14px 16px 4px"><div class="psearch">${ic('search_rounded', 18)}<span>${BP.t(ctx, 'publishers.search_hint')}</span></div></div>`;
      const cchips = `<div class="hs" style="padding-top:8px">${BP.chip(BP.t(ctx, 'publishers.all_countries'), !country, 'data-set="pubCountry="')}${BP.data.countries.map((c) => BP.chip(BP.L(ctx, c.nameAr, c.nameEn), country === c.slug, `data-set="pubCountry=${country === c.slug ? '' : c.slug}"`)).join('')}</div>`;
      body = `${search}${cchips}<div style="padding:12px 16px 24px;display:grid;gap:12px">${list.map((p) => pCard(ctx, p)).join('')}</div>`;
    }
    return BP.page({
      bar: BP.appBar(ctx, { title: BP.t(ctx, 'publishers.title'), subtitle: `665 ${BP.t(ctx, 'publishers.publishers_unit')}` }),
      body, cls, nav: BP.bottomNav(ctx, 'publishers'),
    });
  };

  /* ---------- Publisher detail ---------- */
  V.publisherDetail = (ctx) => {
    const st = ctx.state;
    const p = BP.pubById[st.publisherId] || BP.data.publishers[0];
    if (st.variant === 'loading') return BP.page({ sb: BP.statusBar(false), body: BP.spinner(), cls: 'flexcol' });
    if (st.variant === 'error') return BP.page({ bar: BP.appBar(ctx, { title: '', back: true }), body: BP.errorState(ctx), cls: 'flexcol' });
    const name = BP.L(ctx, p.nameAr, p.name);
    const head = `<div class="phead"><span class="pav xl">${initials(p.name)}</span><h2>${esc(name)}</h2><div class="pmeta">${esc(BP.L(ctx, p.countryAr, p.countryEn))}<em class="lat">${p.bookCount} ${BP.t(ctx, 'common.books')}</em></div></div>`;
    const about = BP.L(ctx, p.aboutAr, p.aboutEn);
    const open = !!st.pubExpanded;
    const aboutEl = about
      ? `<div style="padding:20px 0 0">${BP.sectionHeader(ctx, BP.t(ctx, 'publishers.about'))}<div style="padding:10px 16px 0"><p class="pabout${open ? ' open' : ''}">${esc(about)}</p><button class="rm" data-set="pubExpanded=${!open}">${BP.t(ctx, open ? 'articles.see_less' : 'articles.see_more')} ${ic(open ? 'keyboard_arrow_up_rounded' : 'keyboard_arrow_down_rounded', 18)}</button></div></div>`
      : '';
    const books = BP.data.books.filter((b) => b.publisherId === p.id);
    const grid = books.length
      ? `<div class="grid2 r46" style="padding:12px 16px 24px">${books.map((b) => BP.bookCard(ctx, b)).join('')}</div>`
      : BP.empty('menu_book_outlined', BP.t(ctx, 'publishers.no_books'));
    return BP.page({
      bar: BP.appBar(ctx, { title: esc(name), back: true }),
      body: `${head}${aboutEl}<div style="padding:24px 0 0">${BP.sectionHeader(ctx, BP.t(ctx, 'publishers.their_books'))}</div>${grid}`,
    });
  };
})();
