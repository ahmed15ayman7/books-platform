/*
 * support.js — hand-written mini runtime for books-platform-mobile.dc.html.
 *
 * NOT the Claude Design runtime. It only reproduces the small contract that the
 * capture-design-screens skill relies on:
 *   - a React class component (Host) whose instance owns `.logic`
 *   - logic.go(screen, extra) / host.__setLogicState(patch) to navigate
 *   - the authored logic class lives in <script type="text/x-dc" data-dc-script>
 *
 * Views are HTML strings returned by `logic.render()`; taps are wired through
 * data-go / data-extra / data-set / data-back attributes (see onClick).
 */
(function () {
  const React = window.React;
  const ReactDOM = window.ReactDOM;
  const h = React.createElement;

  class DCLogic {
    constructor(props) {
      this.props = props || {};
    }
    setState(patch) {
      const next = typeof patch === 'function' ? patch(this.state) : patch;
      this.state = Object.assign({}, this.state, next);
      if (this.__host) this.__host.forceUpdate();
    }
  }
  window.DCLogic = DCLogic;

  function parseSet(spec) {
    const patch = {};
    spec.split(';').forEach((pair) => {
      const i = pair.indexOf('=');
      if (i < 0) return;
      const raw = pair.slice(i + 1);
      patch[pair.slice(0, i)] = raw === 'true' ? true : raw === 'false' ? false : /^-?\d+$/.test(raw) ? Number(raw) : raw;
    });
    return patch;
  }

  class Host extends React.Component {
    constructor(props) {
      super(props);
      this.logic = new props.Logic(props);
      this.logic.__host = this;
      this.onClick = this.onClick.bind(this);
      this.screenRef = React.createRef();
    }

    __setLogicState(patch) {
      this.logic.state = Object.assign({}, this.logic.state, patch);
      this.forceUpdate();
    }

    onClick(e) {
      const el = e.target.closest && e.target.closest('[data-go],[data-set],[data-back]');
      if (!el) return;
      const logic = this.logic;
      if (el.dataset.set) logic.setState(parseSet(el.dataset.set));
      if (el.dataset.back !== undefined) logic.go(logic.state.prev || 'home');
      else if (el.dataset.go) logic.go(el.dataset.go, el.dataset.extra ? JSON.parse(el.dataset.extra) : {});
    }

    componentDidMount() {
      this.applyScroll();
    }
    componentDidUpdate() {
      this.applyScroll();
    }
    applyScroll() {
      const body = this.screenRef.current && this.screenRef.current.querySelector('[data-scroll]');
      if (body) body.scrollTop = this.logic.state.scroll || 0;
    }

    renderPanel(st) {
      const keys = this.logic.keys || [];
      return h(
        'aside',
        { className: 'panel' },
        h('div', { className: 'panel-title' }, 'Books Platform — mobile prototype'),
        h(
          'div',
          { className: 'panel-row' },
          ['ar', 'en'].map((l) =>
            h('button', { key: l, className: 'panel-btn' + (st.lang === l ? ' on' : ''), 'data-set': 'lang=' + l }, l.toUpperCase()),
          ),
        ),
        h(
          'div',
          { className: 'panel-list' },
          keys.map((k) => h('button', { key: k, className: 'panel-link' + (st.screen === k ? ' on' : ''), 'data-go': k }, k)),
        ),
      );
    }

    render() {
      const st = this.logic.state;
      const html = this.logic.render();
      return h(
        'div',
        { className: 'stage', onClick: this.onClick },
        h(
          'div',
          { className: 'bezel' },
          h('div', {
            ref: this.screenRef,
            className: 'screen',
            dir: st.lang === 'ar' ? 'rtl' : 'ltr',
            lang: st.lang,
            dangerouslySetInnerHTML: { __html: html },
          }),
        ),
        this.renderPanel(st),
      );
    }
  }

  function mount() {
    const scriptEl = document.querySelector('script[data-dc-script]');
    if (!scriptEl) throw new Error('support.js: <script data-dc-script> not found');
    const Logic = new Function('DCLogic', scriptEl.textContent + '\n;return Component;')(DCLogic);
    ReactDOM.createRoot(document.getElementById('root')).render(h(Host, { Logic }));
  }

  mount();
})();
