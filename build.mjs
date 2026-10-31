// Builds the password-protected index.html that gets published.
// Usage (PowerShell):  $env:PLANNER_PASSWORD = '...'; & "C:\Program Files\nodejs\node.exe" build.mjs
// app.html is the readable source. Everything from its first <style> onward is encrypted with
// AES-256-GCM using a key derived from the password (PBKDF2-SHA256), so index.html never
// contains the readable app or the password. Never publish app.html itself.
import { readFileSync, writeFileSync } from 'node:fs';
import { webcrypto as crypto, randomBytes } from 'node:crypto';

const pw = process.env.PLANNER_PASSWORD;
if (!pw) { console.error('Set PLANNER_PASSWORD first.'); process.exit(1); }

const dir = new URL('.', import.meta.url);
const read = f => readFileSync(new URL(f, dir), 'utf8');
const dataUri = (f, type) => `data:${type};base64,` + readFileSync(new URL(f, dir)).toString('base64');
const propnex = dataUri('propnex-logo.png', 'image/png');
const trmc = dataUri('trmc-logo.jpg', 'image/jpeg');

const src = read('app.html');
const app = src.slice(src.indexOf('<style>'))
  .replace('src="propnex-logo.png"', `src="${propnex}"`)
  .replace('src="trmc-logo.jpg"', `src="${trmc}"`);

const iter = 600000;
const salt = randomBytes(16), iv = randomBytes(12);
const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits']);
const raw = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iter }, base, 256);
const key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt']);
const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(app));

const payload = JSON.stringify({
  iter, salt: salt.toString('base64'), iv: iv.toString('base64'),
  data: Buffer.from(data).toString('base64'),
});
const out = read('gate-template.html')
  .replace('__PROPNEX__', propnex).replace('__TRMC__', trmc)
  .replace('__PAYLOAD__', payload);
writeFileSync(new URL('index.html', dir), out);
console.log(`index.html written (${Math.round(out.length / 1024)} KB)`);
