// Génère le site statique dans dist/ (compatible Cloudflare Pages : commande « npm run build », dossier « dist »).
import { build as esbuild } from 'esbuild';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { config, adsEnabled } from '../site.config.mjs';
import { CATEGORIES, TOOLS } from '../src/data/index.mjs';
import { assets, abs, catUrl } from '../src/templates/html.mjs';
import { homePage, categoryPage, toolPage, notFoundPage } from '../src/templates/pages.mjs';
import { LEGAL_PAGES } from '../src/templates/legal.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const t0 = Date.now();

rmSync(DIST, { recursive: true, force: true });
mkdirSync(join(DIST, 'assets'), { recursive: true });

const write = (rel, content) => {
  const file = join(DIST, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
};
const pageFile = (path) => (path === '/' ? 'index.html' : join(path.replace(/^\/|\/$/g, ''), 'index.html'));

/* 1. Ressources front (JS/CSS minifiés, noms hachés pour un cache immuable) */
const entries = { site: 'src/client/site.js', tool: 'src/client/tool.js' };
if (adsEnabled()) entries.ads = 'src/client/ads.js';
if (config.CONSENT_MECHANISM_READY && config.GA_MEASUREMENT_ID) entries.analytics = 'src/client/analytics.js';
const js = await esbuild({
  entryPoints: Object.fromEntries(Object.entries(entries).map(([k, v]) => [k, join(ROOT, v)])),
  bundle: true, minify: true, format: 'iife', target: ['es2019'], outdir: join(DIST, 'assets'),
  entryNames: '[name]-[hash]', metafile: true, legalComments: 'none', logLevel: 'warning',
});
const css = await esbuild({
  entryPoints: { style: join(ROOT, 'src/client/style.css') }, bundle: true, minify: true, outdir: join(DIST, 'assets'),
  entryNames: '[name]-[hash]', metafile: true, logLevel: 'warning',
});
const outputOf = (meta, name) => {
  const k = Object.keys(meta.outputs).find((o) => new RegExp(`/${name}-[A-Z0-9]+\\.(js|css)$`).test(o));
  return k ? '/assets/' + k.split('/').pop() : undefined;
};
assets.siteJs = outputOf(js.metafile, 'site');
assets.toolJs = outputOf(js.metafile, 'tool');
assets.adsJs = outputOf(js.metafile, 'ads');
assets.analyticsJs = outputOf(js.metafile, 'analytics');
assets.css = outputOf(css.metafile, 'style');

/* 2. Index de recherche (côté client) */
const searchIndex = TOOLS.map((t) => ({
  u: t.url, t: t.name, c: CATEGORIES.find((c) => c.id === t.cat).name,
  k: [t.sub, ...(t.keywords || []), t.short].join(' '),
  r: t.related.map((s) => `/${s}/`),
}));
const indexJson = JSON.stringify(searchIndex);
const indexName = `search-index-${createHash('sha1').update(indexJson).digest('hex').slice(0, 8)}.json`;
write(`assets/${indexName}`, indexJson);
assets.searchIndex = `/assets/${indexName}`;

/* 3. Pages */
const urls = [];
const emit = (path, html, indexable = true) => {
  write(pageFile(path), html);
  if (indexable) urls.push(path);
};
emit('/', homePage());
for (const c of CATEGORIES) emit(catUrl(c), categoryPage(c));
for (const t of TOOLS) emit(t.url, toolPage(t));
for (const p of LEGAL_PAGES()) emit(p.path, p.html);
write('404.html', notFoundPage());

/* 4. Fichiers statiques, sitemap, robots, ads.txt */
cpSync(join(ROOT, 'public'), DIST, { recursive: true });
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${esc(abs(u))}</loc></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`);
if (adsEnabled()) {
  const pub = config.ADSENSE_PUBLISHER_ID.replace(/^ca-/, '');
  write('ads.txt', `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`);
}

/* 5. Rapport */
const warn = [];
if (!process.env.SITE_URL) warn.push(`SITE_URL non défini : URL canonique provisoire ${config.SITE_URL} (à définir dans Cloudflare Pages).`);
const missing = Object.entries(config.LEGAL).filter(([, v]) => !v).map(([k]) => k).filter((k) => k !== 'siret');
if (missing.length) warn.push(`Mentions légales incomplètes (variables LEGAL_* manquantes : ${missing.join(', ')}).`);
if (!adsEnabled()) warn.push('AdSense inactif (aucun ADSENSE_PUBLISHER_ID ou CONSENT_MECHANISM_READY ≠ true) : aucun code publicitaire généré.');
console.log(`✔ ${urls.length} pages indexables + 404 générées dans dist/ en ${Date.now() - t0} ms`);
console.log(`  JS : ${[assets.siteJs, assets.toolJs].join(', ')} · CSS : ${assets.css}`);
for (const w of warn) console.log(`  ⚠ ${w}`);
if (!existsSync(join(DIST, 'index.html'))) throw new Error('index.html manquant');
