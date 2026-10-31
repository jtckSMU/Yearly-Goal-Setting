// Local preview server for testing index.html (crypto.subtle needs http://localhost, not file://).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const port = Number(process.env.PORT || 3006);
const types = { html: 'text/html; charset=utf-8', png: 'image/png', jpg: 'image/jpeg' };
createServer(async (req, res) => {
  const name = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
  if (name.includes('..')) { res.writeHead(400).end(); return; }
  try {
    const body = await readFile(new URL(name, import.meta.url));
    res.writeHead(200, { 'content-type': types[name.split('.').pop()] || 'application/octet-stream' }).end(body);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(port, () => console.log(`http://localhost:${port}`));
