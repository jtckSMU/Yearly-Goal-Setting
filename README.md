# Yearly Goal Setting

Password-protected goal planner for T.R.M.C (PropNex) agents: Goal planner, Conversion calculator and daily Tracker.

The app is encrypted with AES-256-GCM (key derived from the access password with PBKDF2-SHA256), so this repository contains no readable copy of the app and no password.

- `public/index.html` is the site Vercel serves (`vercel.json`: no install or build step, output directory `public`).
- `index.html` is the same page for the Claude artifact.

## Rebuilding

The readable source `app.html` is kept locally and is gitignored. After editing it:

```powershell
$env:PLANNER_PASSWORD = '...'; & "C:\Program Files\nodejs\node.exe" build.mjs
```

Then commit `index.html` and `public/index.html`. `serve.mjs` serves the folder on http://localhost:3006 for testing (the browser's crypto API needs http://localhost, not file://).
