# Yearly Goal Setting

Password-protected goal planner for T.R.M.C (PropNex) agents: Goal planner, Conversion calculator and daily Tracker.

`index.html` holds the app encrypted with AES-256-GCM (key derived from the access password with PBKDF2-SHA256), so this repository contains no readable copy of the app and no password.

## Rebuilding

The readable source `app.html` is kept locally and is gitignored. After editing it:

```powershell
$env:PLANNER_PASSWORD = '...'; & "C:\Program Files\nodejs\node.exe" build.mjs
```

`serve.mjs` serves the folder on http://localhost:3006 for testing (the browser's crypto API needs http://localhost, not file://).
