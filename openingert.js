// Open in gert: opens the change or diff shown in the Gerrit web UI in the
// gert desktop client (https://github.com/broeng/gert), from an "Open in gert"
// button in the change's action bar or the O key.
//
// gert registers the gert:// URL scheme. A gert:// link is the page's own
// URL with the scheme swapped, so gert sees the patch set, range and file
// exactly as the page shows them.

Gerrit.install(plugin => {
  const LABEL = 'Open in gert';
  const KEY = 'O';

  function gertLink() {
    if (!/\/c\//.test(location.pathname)) return null;
    return `gert://${location.host}${location.pathname}`;
  }

  function openInGert() {
    const link = gertLink();
    // Must run in the click or key handler itself: Chrome hands a link to
    // an external app only during a user gesture.
    if (link) location.href = link;
  }

  // The change view may create a new action bar, so add the button once
  // per action bar element rather than once per page load.
  const actionBars = new WeakSet();
  plugin.on('showchange', () => {
    const actions = plugin.changeActions();
    const bar = actions.ensureEl();
    if (!bar || actionBars.has(bar)) return;
    actionBars.add(bar);
    const key = actions.add('change', LABEL);
    actions.setTitle(key, `${LABEL} (${KEY})`);
    actions.setActionOverflow('change', key, false);
    actions.addTapListener(key, openInGert);
  });

  // Gerrit has no shortcut API for plugins, so listen like Gerrit's own
  // shortcut service does, and skip the same events it skips.
  let shortcutsDisabled = false;
  plugin
    .restApi()
    .getLoggedIn()
    .then(loggedIn =>
      loggedIn ? plugin.restApi().get('/accounts/self/preferences') : null
    )
    .then(prefs => {
      shortcutsDisabled = !!(prefs && prefs.disable_keyboard_shortcuts);
    })
    .catch(() => {});

  function typing(e) {
    const path = e.composedPath();
    if (path.some(el => el.tagName === 'DIALOG')) return true;
    const target = path[0];
    if (!target || !target.tagName) return false;
    if (target.isContentEditable) return true;
    if (target.tagName === 'INPUT') return target.type !== 'checkbox';
    return target.tagName === 'TEXTAREA' || target.tagName === 'GR-TEXTAREA';
  }

  document.addEventListener('keydown', e => {
    if (e.key !== KEY || e.repeat || e.ctrlKey || e.altKey || e.metaKey) return;
    if (shortcutsDisabled || typing(e) || !gertLink()) return;
    e.preventDefault();
    openInGert();
  });
});
