import { config, adsEnabled, BUILD_YEAR } from '../../site.config.mjs';
import { esc } from '../utils/render.mjs';
import { CATEGORIES } from '../data/index.mjs';

/** Chemins des fichiers générés (hachés) : renseigné par le build avant le rendu des pages. */
export const assets = {};

export const abs = (path) => config.SITE_URL + path;
export const pubId = () => (config.ADSENSE_PUBLISHER_ID.startsWith('ca-') ? config.ADSENSE_PUBLISHER_ID : `ca-${config.ADSENSE_PUBLISHER_ID}`);
export const catUrl = (c) => `/${c.slug}/`;

const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

export function fullTitle(title) {
  const t = `${title} | ${config.SITE_NAME}`;
  return t.length <= 68 ? t : title;
}

/* ───────────── Emplacements publicitaires (rien n'est rendu tant qu'AdSense n'est pas configuré) ───────────── */
export function adSlot(name) {
  if (!adsEnabled()) return '';
  const slot = config.ADSENSE_SLOTS[name];
  if (!slot) return '';
  return `<aside class="ad ad-${name}" aria-label="Publicité"><p class="ad-label">Publicité</p><ins class="adsbygoogle" style="display:block" data-ad-client="${esc(pubId())}" data-ad-slot="${esc(slot)}" data-ad-format="auto" data-full-width-responsive="true"></ins></aside>`;
}

/* ───────────── Composants ───────────── */
export function searchForm(id, large = false) {
  return `<form class="search${large ? ' search-lg' : ''}" role="search" data-search data-index="${esc(assets.searchIndex || '')}" action="/" method="get">
<label class="sr-only" for="${id}">Rechercher un outil</label>
<input id="${id}" type="search" name="q" placeholder="Rechercher : peinture, TVA…" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${id}-list" enterkeyhint="search">
<ul id="${id}-list" class="search-results" role="listbox" aria-label="Résultats de recherche" hidden></ul>
<p class="sr-only" id="${id}-status" role="status" aria-live="polite"></p>
</form>`;
}

export function toolCard(t) {
  const c = CATEGORIES.find((x) => x.id === t.cat);
  return `<li><a class="card" href="${t.url}"><span class="badge badge-${c.color}" aria-hidden="true">${esc(c.icon)}</span><span class="card-body"><span class="card-title">${esc(t.name)}</span><span class="card-desc">${esc(t.short)}</span></span></a></li>`;
}
export const cardGrid = (tools) => `<ul class="grid">${tools.map(toolCard).join('')}</ul>`;

function header(isHome) {
  const nav = CATEGORIES.map((c) => `<li><a href="${catUrl(c)}">${esc(c.name)}</a></li>`).join('');
  return `<a class="skip" href="#contenu">Aller au contenu</a>
<header class="site-header">
<div class="container header-row">
<a class="brand" href="/" aria-label="${esc(config.SITE_NAME)} — accueil"><span class="brand-mark" aria-hidden="true">=</span><span class="brand-name">${esc(config.SITE_NAME)}</span></a>
${isHome ? '' : searchForm('site-search')}
</div>
<nav class="main-nav" aria-label="Navigation principale"><div class="container"><ul>${nav}<li><a href="/#tous-les-outils">Tous les outils</a></li></ul></div></nav>
</header>`;
}

function footer() {
  const cats = CATEGORIES.map((c) => `<li><a href="${catUrl(c)}">${esc(c.name)}</a></li>`).join('');
  const cookieBtn = config.CONSENT_MECHANISM_READY ? '<li><button type="button" class="linklike" id="cookie-settings">Paramétrer les cookies</button></li>' : '';
  return `<footer class="site-footer"><div class="container footer-grid">
<div><p class="footer-brand">${esc(config.SITE_NAME)}</p><p class="footer-text">${esc(config.SITE_TAGLINE)}. Les résultats sont fournis à titre indicatif : vérifiez les valeurs importantes avant toute décision.</p></div>
<nav aria-label="Catégories"><p class="footer-title">Catégories</p><ul>${cats}</ul></nav>
<nav aria-label="Informations"><p class="footer-title">Informations</p><ul>
<li><a href="/a-propos/">À propos</a></li><li><a href="/contact/">Contact</a></li><li><a href="/mentions-legales/">Mentions légales</a></li>
<li><a href="/politique-confidentialite/">Politique de confidentialité</a></li><li><a href="/politique-cookies/">Politique de cookies</a></li><li><a href="/conditions-utilisation/">Conditions d’utilisation</a></li>${cookieBtn}
</ul></nav>
</div><div class="container footer-bottom"><p>© ${BUILD_YEAR} ${esc(config.SITE_NAME)}</p></div></footer>`;
}

export function breadcrumb(items) {
  return `<nav class="breadcrumb" aria-label="Fil d’Ariane"><ol>${items.map((it, i) => (i === items.length - 1 ? `<li aria-current="page">${esc(it.name)}</li>` : `<li><a href="${it.url}">${esc(it.name)}</a></li>`)).join('')}</ol></nav>`;
}
export const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.url) })),
});

/** Gabarit commun à toutes les pages. */
export function layout({ title, description, path, body, ld = [], noindex = false, tool = false, home = false, rawTitle = false }) {
  const t = rawTitle ? title : fullTitle(title);
  const url = abs(path);
  const img = abs('/og-image.png');
  const adsOn = adsEnabled();
  const scripts = [];
  scripts.push(`<script defer src="${assets.siteJs}"></script>`);
  if (tool) scripts.push(`<script defer src="${assets.toolJs}"></script>`);
  if (adsOn) scripts.push(`<script defer src="${assets.adsJs}" data-client="${esc(pubId())}"></script>`);
  if (config.CONSENT_MECHANISM_READY && config.GA_MEASUREMENT_ID) scripts.push(`<script defer src="${assets.analyticsJs}" data-id="${esc(config.GA_MEASUREMENT_ID)}"></script>`);
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex, follow">' : `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">\n<link rel="canonical" href="${esc(url)}">`}
<meta name="theme-color" content="#1d4ed8">
${config.GSC_VERIFICATION ? `<meta name="google-site-verification" content="${esc(config.GSC_VERIFICATION)}">\n` : ''}<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:site_name" content="${esc(config.SITE_NAME)}">
<meta property="og:locale" content="fr_FR">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(t)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(img)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(t)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(img)}">
<link rel="stylesheet" href="${assets.css}">
${ld.map(jsonLd).join('\n')}
</head>
<body${home ? ' class="home"' : ''}>
${header(home)}
<main id="contenu">
${body}
</main>
${footer()}
${scripts.join('\n')}
</body>
</html>
`;
}
