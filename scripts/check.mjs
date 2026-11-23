// Vérifications statiques de dist/ : « npm run check » (après « npm run build »).
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const errors = [];
const err = (m) => errors.push(m);

const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const pages = walk(DIST).filter((f) => f.endsWith('.html'));
const rel = (f) => '/' + f.slice(DIST.length + 1).replace(/index\.html$/, '');
const exists = (p) => {
  const clean = decodeURIComponent(p.split('#')[0].split('?')[0]);
  if (clean === '' ) return true;
  const f = join(DIST, clean);
  return existsSync(f) && (statSync(f).isFile() || existsSync(join(f, 'index.html')));
};
const grab = (html, re) => (html.match(re) || [])[1];

const titles = new Map(), descs = new Map(), h1s = new Map();
let siteOrigin = '';
for (const f of pages) {
  const html = readFileSync(f, 'utf8');
  const path = rel(f);
  const is404 = path === '/404.html';
  const title = grab(html, /<title>([^<]*)<\/title>/);
  const desc = grab(html, /<meta name="description" content="([^"]*)"/);
  const h1 = grab(html, /<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (!title) err(`${path}: <title> manquant`);
  else if (title.length > 75) err(`${path}: title trop long (${title.length})`);
  if (!desc) err(`${path}: meta description manquante`);
  else if (desc.length > 170) err(`${path}: description trop longue (${desc.length})`);
  if (!h1) err(`${path}: H1 manquant`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) err(`${path}: il doit y avoir exactement un H1`);
  if (!is404) {
    for (const [m, k] of [[titles, title], [descs, desc], [h1s, h1]]) {
      if (!k) continue;
      if (m.has(k)) err(`${path}: doublon avec ${m.get(k)} → « ${k.slice(0, 60)} »`);
      m.set(k, path);
    }
    const canon = grab(html, /<link rel="canonical" href="([^"]+)"/);
    if (!canon) err(`${path}: canonical manquant`);
    else {
      siteOrigin ||= new URL(canon).origin;
      if (new URL(canon).pathname !== path) err(`${path}: canonical incohérent (${canon})`);
    }
    for (const p of ['og:title', 'og:description', 'og:url', 'og:image']) if (!html.includes(`property="${p}"`)) err(`${path}: ${p} manquant`);
    if (!html.includes('name="twitter:card"')) err(`${path}: twitter:card manquant`);
  } else if (!/noindex/.test(html)) err('404: doit être noindex');

  // JSON-LD valide
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { err(`${path}: JSON-LD invalide (${e.message})`); }
  }
  // ids dupliqués
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) err(`${path}: ids dupliqués ${[...new Set(dup)].join(', ')}`);
  // liens et ressources internes
  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (m[1].startsWith('//')) continue;
    if (!exists(m[1])) err(`${path}: lien/ressource cassé ${m[1]}`);
  }
  // pas d'images sans alt, pas de résultat en erreur pré-rendu
  if (/<img(?![^>]*\balt=)/.test(html)) err(`${path}: <img> sans alt`);
  if (/NaN|undefined|Infinity|\[object /.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) err(`${path}: valeur invalide dans le HTML (NaN/undefined/…)`);
  if (/ADSENSE_PUBLISHER_ID|adsbygoogle|pagead2/.test(html) && !process.env.ADSENSE_PUBLISHER_ID) err(`${path}: code publicitaire présent sans identifiant AdSense`);

  // pages outils : structure imposée
  const isTool = html.includes('<article class="tool">') && html.includes('class="calc');
  if (isTool) {
    for (const need of ['class="result', 'Comment fonctionne le calcul', 'class="related"', 'FAQPage', 'WebApplication']) {
      if (!html.includes(need)) err(`${path}: section « ${need} » manquante`);
    }
    const faq = (html.match(/"@type":"Question"/g) || []).length;
    if (faq < 3 || faq > 6) err(`${path}: FAQ de ${faq} questions (attendu 3 à 6)`);
    const words = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    if (words < 450) err(`${path}: contenu léger (${words} mots)`);
  }
}

// sitemap
const sm = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const l of locs) {
  const p = new URL(l).pathname;
  if (!exists(p)) err(`sitemap: URL inexistante ${l}`);
  if (p === '/404.html') err('sitemap: contient la 404');
}
if (new Set(locs).size !== locs.length) err('sitemap: doublons');
if (locs.length !== pages.length - 1) err(`sitemap: ${locs.length} URLs pour ${pages.length - 1} pages indexables`);
const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
if (!robots.includes('Sitemap:')) err('robots.txt sans Sitemap');
for (const f of ['_headers', 'favicon.svg', 'og-image.png']) if (!existsSync(join(DIST, f))) err(`fichier manquant : ${f}`);

console.log(`${pages.length} pages HTML contrôlées, ${locs.length} URLs dans le sitemap.`);
if (errors.length) {
  console.error(`✘ ${errors.length} problème(s) :\n - ` + errors.slice(0, 80).join('\n - '));
  process.exit(1);
}
console.log('✔ Toutes les vérifications statiques sont passées.');
