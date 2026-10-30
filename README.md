# gerrit-open-in-gert

A Gerrit web UI plugin that opens the change you are looking at in
[gert](https://github.com/broeng/gert), the desktop Gerrit client.

- **Open in gert** button in the change's action bar. It is left out on
  touch-only devices (phones, tablets), where there is no gert to open.
- **`O`** (Shift+o) on a change or diff page. It is ignored while you type in a
  text field or dialog, and when you turned off keyboard shortcuts in your
  Gerrit preferences.

The plugin sends the browser to the page's own URL with the scheme swapped to
`gert://`, so gert opens the same patch set, patch set range and file you
are looking at.

## Using it

1. Install a gert with `gert://` support. The Nix package installs a desktop
   entry that registers the scheme; from source, copy `dist/gert.desktop`
   from the gert repo to `~/.local/share/applications/`.
2. The first time, the browser asks whether to open the link with xdg-open
   (or gert). In Chrome, tick **Always allow <your Gerrit> to open links of
   this type** and click **Open link**.

If the browser says no apps are available for the link right after you
installed gert, the desktop portal (which the browser asks) still has the old
list of apps: log out and back in, or restart it with
`systemctl --user restart xdg-desktop-portal.service`.

Each link opens a new gert window; gert cannot yet hand links to a running
instance.

## Installing on a Gerrit server

`openingert.js` is the whole plugin: copy it into the site's `plugins/`
directory (the plugin name, `openingert`, comes from the file name). Gerrit
loads it without a restart. Written and tested against Gerrit 3.14.

## Developing

There is no build step. To try a change, copy `openingert.js` into the
`plugins/` directory of a local Gerrit, for example the dev Gerrit in the gert
repo (`nix run .#dev-gerrit -- --seed`), and reload the page once the plugin
scanner has picked it up (about a minute).

Releases are tags `vX.Y.Z`.

## License

MIT, see `LICENSE`.
