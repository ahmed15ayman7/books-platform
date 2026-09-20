/* Publish flow (steps 1-3 + success) and Notification settings. */
(function () {
  const BP = window.BP;
  const V = BP.views;
  const ic = BP.icon;

  const field = (ctx, labelKey, opts) => {
    const o = opts || {};
    const val = o.value ? `<span class="v">${BP.esc(o.value)}</span>` : `<span class="ph">${o.hint || ''}</span>`;
    return `<div class="fld"><label class="lb">${BP.t(ctx, labelKey)}${o.req ? ' <i>*</i>' : ''}</label><div class="inp${o.multi ? ' multi' : ''}">${val}</div></div>`;
  };

  const stepper = (ctx, step) => {
    const labels = [BP.L(ctx, 'معلومات المؤلف', 'Author Info'), BP.L(ctx, 'معلومات الكتاب', 'Book Info'), BP.L(ctx, 'المراجعة', 'Review')];
    return `<div class="steps">${labels
      .map((l, i) => {
        const cls = i < step ? 'done' : i === step ? 'act' : '';
        const dot = i < step ? ic('check_rounded', 16) : i + 1;
        return `<div class="stp ${cls}"><span class="dot">${dot}</span><em>${l}</em></div>${i < 2 ? `<span class="ln${i < step ? ' on' : ''}"></span>` : ''}`;
      })
      .join('')}</div>`;
  };

  const upload = (ctx, icon, key, done) =>
    `<div class="upl${done ? ' ok' : ''}">${ic(done ? 'check_circle_outline' : icon, 26)}<span>${BP.t(ctx, key)}</span></div>`;

  const stepAuthor = (ctx) =>
    `${field(ctx, 'publish.author_name_label', { req: true, hint: BP.t(ctx, 'publish.author_name_hint') })}${field(ctx, 'publish.email_label', { req: true, hint: 'name@example.com' })}${field(ctx, 'publish.phone_label', { hint: '+20 1XX XXX XXXX' })}${field(ctx, 'publish.bio_label', { multi: true, hint: BP.t(ctx, 'publish.bio_hint') })}`;

  const stepBook = (ctx) =>
    `${field(ctx, 'publish.book_title_label', { req: true, hint: BP.t(ctx, 'publish.book_title_hint') })}${field(ctx, 'publish.summary_label', { req: true, multi: true, hint: BP.t(ctx, 'publish.summary_hint') })}${field(ctx, 'publish.category_label', { hint: BP.t(ctx, 'publish.category_hint') })}<div class="fld"><label class="lb">${BP.t(ctx, 'publish.language_label')} <i>*</i></label><div class="inp sel"><span class="ph">${BP.t(ctx, 'publish.language_ar')}</span>${ic('arrow_drop_down_rounded', 24)}</div></div>${upload(ctx, 'upload_file_outlined', 'publish.upload_label', false)}<div style="height:12px"></div>${upload(ctx, 'image_outlined', 'publish.cover_label', false)}`;

  const stepReview = (ctx) => {
    const rows = [
      [BP.t(ctx, 'publish.author_name_label'), BP.L(ctx, 'أحمد سالم', 'Ahmed Salem')],
      [BP.t(ctx, 'publish.email_label'), 'ahmed@example.com'],
      [BP.t(ctx, 'publish.book_title_label'), BP.L(ctx, 'رحلة في عالم الكتب', 'A Journey Through Books')],
    ];
    const checked = !!ctx.state.pubAgree;
    return `<h3 class="rv-t">${BP.t(ctx, 'publish.review_title')}</h3>${rows.map(([k, v]) => `<div class="rv-r"><span>${k}</span><b>${BP.esc(v)}</b></div>`).join('')}<div class="agree" data-set="pubAgree=${!checked}"><span class="cb${checked ? ' on' : ''}">${checked ? ic('check_rounded', 16) : ''}</span><p>${BP.t(ctx, 'publish.content_standards')}</p></div>`;
  };

  V.publish = (ctx) => {
    const st = ctx.state;
    if (st.variant === 'success') {
      return BP.page({
        bar: BP.appBar(ctx, { title: BP.t(ctx, 'publish.title'), back: true }),
        body: `<div class="okpage"><div class="okc big">${ic('check_rounded', 42)}</div><h3>${BP.t(ctx, 'publish.success_title')}</h3><p>${BP.t(ctx, 'publish.success_description')}</p><div style="height:32px"></div><button class="btn" data-go="publish">${BP.t(ctx, 'publish.submit_another')}</button><button class="btn out" style="margin-top:12px" data-go="home">${BP.t(ctx, 'publish.back_to_home')}</button></div>`,
        cls: 'flexcol',
      });
    }
    const step = Math.max(0, Math.min(2, st.pubStep || 0));
    const content = [stepAuthor, stepBook, stepReview][step](ctx);
    const disabled = step === 2 && !st.pubAgree;
    const nav = `<div class="pnav">${step > 0 ? `<button class="pback" data-set="pubStep=${step - 1}">${ic('arrow_back_rounded', 22)}</button>` : ''}<button class="btn${disabled ? ' dis' : ''}" ${step === 2 ? 'data-set="variant=success"' : `data-set="pubStep=${step + 1}"`}>${step === 2 ? BP.t(ctx, 'publish.submit') : `${BP.t(ctx, 'publish.next')} ${ic('chevron_right_rounded', 18)}`}</button></div>`;
    return BP.page({
      bar: BP.appBar(ctx, { title: BP.t(ctx, 'publish.title'), back: true }),
      body: `<div style="padding:18px 16px 24px">${stepper(ctx, step)}<div style="height:24px"></div>${content}<div style="height:16px"></div>${nav}</div>`,
      cls: 'bgw',
    });
  };

  V.notifications = (ctx) => {
    const st = ctx.state;
    if (st.variant === 'loading') return BP.page({ bar: BP.appBar(ctx, { title: BP.t(ctx, 'notifications_title'), back: true }), body: BP.spinner(), cls: 'flexcol' });
    const on = st.variant === 'on';
    const denied = st.variant === 'denied';
    const row = `<div class="swrow"><span>${BP.t(ctx, 'notifications_push_label')}</span><span class="sw${on ? ' on' : ''}"><i></i></span></div>`;
    const open = denied ? `<button class="opn">${BP.t(ctx, 'notifications_open_settings')}</button>` : '';
    return BP.page({ bar: BP.appBar(ctx, { title: BP.t(ctx, 'notifications_title'), back: true }), body: `<div style="padding:8px 0">${row}${open}</div>` });
  };
})();
