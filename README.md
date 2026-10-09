# Payclock

A live hourly earnings tracker with pause/resume, currency selection, and device-local session persistence. Earnings are estimates before taxes, not proof of employer payment. A running session continues while the tab is closed; pause it when you stop working. Rate changes preserve earlier earnings. Changing currency resets the session rather than converting money.

Requires Node.js 24. No package installation or credentials are needed.

## GitHub Pages

The self-contained `index.html` can be served directly by GitHub Pages. In repository Settings → Pages, select **Deploy from a branch**, branch **gh-pages**, and folder **/ (root)**. After editing the app, run `npm run build` and publish the regenerated HTML with the source changes.

```sh
npm start
```

The server listens on port 3000 (override with `PORT`). Startup builds a self-contained `index.html`, so the tracker also works in HTML previews that cannot load JavaScript modules from the server root. After editing `app.js`, `earnings.js`, or `style.css`, run `npm run build` to refresh the HTML. Run `npm test` to validate time and earnings calculations. Browser data is stored in localStorage and is not synced across devices. Use one active tab per session. Optional Google Fonts fall back to system fonts when unavailable.
