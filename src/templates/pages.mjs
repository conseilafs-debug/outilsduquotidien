import { config } from '../../site.config.mjs';
import { esc, renderResult } from '../utils/render.mjs';
import { FUNCTIONS } from '../utils/calc.mjs';
import { CATEGORIES, CAT_BY_ID, BY_SLUG, TOOLS, popularTools, toolsOf } from '../data/index.mjs';
import { slugify } from '../data/categories.mjs';
import { layout, abs, adSlot, breadcrumb, breadcrumbLd, cardGrid, searchForm, catUrl } from './html.mjs';

/* ───────────── Formulaires de calcul (pré-rendus : le résultat par défaut est déjà dans le HTML) ───────────── */

const visibleAt = (f, values) => !f.when || Object.entries(f.when).every(([k, vals]) => vals.includes(String(values[k])));

function renderField(f, bid, i, values) {
  const id = `${bid}-${i}`;
  const hidden = visibleAt(f, values) ? '' : ' hidden';
  const when = f.when ? ` data-when="${esc(JSON.stringify(f.when))}"` : '';
  const hintId = f.hint ? ` aria-describedby="${id}-h"` : '';
  const hint = f.hint ? `<p class="hint" id="${id}-h">${esc(f.hint)}</p>` : '';
  const opt = f.optional ? ' <span class="opt">(facultatif)</span>' : '';
  let control;
  switch (f.type) {
    case 'select':
      control = `<select id="${id}" name="${f.id}"${hintId}>${f.options.map((o) => `<option value="${esc(o.v)}"${String(o.v) === String(f.default) ? ' selected' : ''}>${esc(o.label)}</option>`).join('')}</select>`;
      break;
    case 'date':
      control = `<input id="${id}" name="${f.id}" type="date" value="${f.default === 'today' ? '' : esc(f.default)}"${f.default === 'today' ? ' data-default="today"' : ''}${hintId}>`;
      break;
    case 'checkbox':
      return `<div class="field field-check"${when}${hidden}><label class="check" for="${id}"><input id="${id}" name="${f.id}" type="checkbox"${f.default ? ' checked' : ''}><span>${esc(f.label)}</span></label></div>`;
    case 'textarea':
      control = `<textarea id="${id}" name="${f.id}" rows="${f.rows}" spellcheck="false"${hintId}>${esc(f.default)}</textarea>`;
      break;
    default: {
      const unit = f.unit ? `<span class="unit" aria-hidden="true">${esc(f.unit)}</span>` : '';
      control = `<div class="input-wrap"><input id="${id}" name="${f.id}" type="text" inputmode="${f.inputmode || 'decimal'}" autocomplete="off" value="${esc(f.default ?? '')}"${hintId}>${unit}</div>`;
    }
  }
  const unitSr = f.type === 'number' && f.unit ? `<span class="sr-only"> (en ${esc(f.unit)})</span>` : '';
  return `<div class="field"${when}${hidden}><label for="${id}">${esc(f.label)}${unitSr}${opt}</label>${control}${hint}</div>`;
}

function renderBlock(tool, block) {
  const bid = `${tool.slug.slice(0, 6)}-${block.id}`.replace(/[^a-z0-9-]/g, '');
  const values = { ...(block.params || {}) };
  let dynamic = false;
  for (const f of block.fields) {
    if (f.default === 'today') { dynamic = true; values[f.id] = ''; } else values[f.id] = f.default;
  }
  const result = dynamic ? null : FUNCTIONS[block.fn](values);
  if (result && result.error) throw new Error(`Valeurs par défaut invalides pour ${tool.slug}/${block.id} : ${result.error}`);
  const placeholder = dynamic ? 'Le résultat s’affiche ici dès que les dates sont renseignées.' : undefined;
  const title = block.title ? `<h2 class="block-title" id="${bid}-t">${esc(block.title)}</h2>` : '';
  const label = block.title ? ` aria-labelledby="${bid}-t"` : ` aria-label="${esc(tool.name)}"`;
  return `<section class="calc-card">${title}
<form class="calc" data-fn="${block.fn}" data-params="${esc(JSON.stringify(block.params || {}))}"${label} novalidate>
<div class="fields">${block.fields.map((f, i) => renderField(f, bid, i, values)).join('')}</div>
<div class="actions"><button type="submit" class="btn">Calculer</button><button type="reset" class="btn btn-ghost">Réinitialiser</button></div>
<div class="result" role="status" aria-live="polite">${renderResult(result, placeholder)}</div>
</form></section>`;
}

const renderTable = (t) => `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(t.caption)}"><table><caption>${esc(t.caption)}</caption><thead><tr>${t.head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${esc(c)}</th>` : `<td>${esc(c)}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`;

/* ───────────── Page outil ───────────── */
export function toolPage(tool) {
  const cat = CAT_BY_ID.get(tool.cat);
  const crumbs = [{ name: 'Accueil', url: '/' }, { name: cat.name, url: catUrl(cat) }, { name: tool.name, url: tool.url }];
  const tables = [].concat(typeof tool.table === 'function' ? tool.table() : tool.table);
  const related = tool.related.map((s) => BY_SLUG.get(s));
  const blocks = tool.blocks.map((b) => renderBlock(tool, b)).join('\n');
  const side = adSlot('side');

  const body = `<div class="container page-grid${side ? ' has-side' : ''}">
<article class="tool">
${breadcrumb(crumbs)}
<h1>${esc(tool.h1)}</h1>
<div class="intro">${tool.intro.map((p) => `<p>${p}</p>`).join('')}</div>
${adSlot('top')}
${blocks}
${adSlot('result')}
<section class="prose"><h2>Comment fonctionne le calcul ?</h2>${tool.how.map((p) => `<p>${p}</p>`).join('')}</section>
<section class="prose"><h2>Exemple concret</h2>${tool.example()}</section>
<section class="prose"><h2>${tables.length > 1 ? 'Tableaux pratiques' : 'Tableau pratique'}</h2>${tables.map(renderTable).join('')}</section>
<section class="prose"><h2>Conseils utiles</h2><ul class="tips">${tool.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></section>
${adSlot('faq')}
<section class="prose faq"><h2>Questions fréquentes</h2>${tool.faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</section>
<section class="related"><h2>Outils associés</h2>${cardGrid(related)}</section>
</article>
${side ? `<div class="side">${side}</div>` : ''}
</div>`;

  const ld = [
    breadcrumbLd(crumbs),
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: tool.name, url: abs(tool.url), description: tool.metaDesc, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Tous (navigateur web)', inLanguage: 'fr', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: tool.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ];
  return layout({ title: tool.metaTitle, description: tool.metaDesc, path: tool.url, body, ld, tool: true });
}

/* ───────────── Catégories ───────────── */
export function categoryPage(cat) {
  const tools = toolsOf(cat.id);
  const crumbs = [{ name: 'Accueil', url: '/' }, { name: cat.name, url: catUrl(cat) }];
  const subs = cat.subs.map((sub) => ({ sub, tools: tools.filter((t) => t.sub === sub) })).filter((x) => x.tools.length);
  const others = CATEGORIES.filter((c) => c.id !== cat.id);
  const jump = subs.length > 1 ? `<nav class="jump" aria-label="Sous-catégories"><ul>${subs.map((x) => `<li><a href="#${slugify(x.sub)}">${esc(x.sub)}</a></li>`).join('')}</ul></nav>` : '';
  const body = `<div class="container">
${breadcrumb(crumbs)}
<h1>${esc(cat.h1)}</h1>
<p class="lead">${esc(cat.intro)}</p>
${jump}
${subs.map((x) => `<section class="sub" id="${slugify(x.sub)}"><h2>${esc(x.sub)}</h2>${cardGrid(x.tools)}</section>`).join('\n')}
<section class="sub"><h2>Autres catégories</h2><ul class="pills">${others.map((c) => `<li><a href="${catUrl(c)}">${esc(c.name)}</a></li>`).join('')}</ul></section>
</div>`;
  const ld = [breadcrumbLd(crumbs), { '@context': 'https://schema.org', '@type': 'CollectionPage', name: cat.name, url: abs(catUrl(cat)), description: cat.metaDesc, inLanguage: 'fr', mainEntity: { '@type': 'ItemList', itemListElement: tools.map((t, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(t.url), name: t.name })) } }];
  return layout({ title: cat.metaTitle, description: cat.metaDesc, path: catUrl(cat), body, ld });
}

/* ───────────── Accueil ───────────── */
export function homePage() {
  const sections = [
    ['Calculateurs populaires', popularTools()],
    ['Conversions', toolsOf('conversions').slice(0, 8), CAT_BY_ID.get('conversions')],
    ['Maison & travaux', toolsOf('maison').slice(0, 8), CAT_BY_ID.get('maison')],
    ['Dates et calendrier', toolsOf('calendrier').slice(0, 8), CAT_BY_ID.get('calendrier')],
  ];
  const promises = CATEGORIES.map((c) => `<li><a class="promise promise-${c.color}" href="${catUrl(c)}"><span class="badge badge-${c.color}" aria-hidden="true">${esc(c.icon)}</span><span><strong>${esc(c.verb.toUpperCase())}</strong><span class="promise-text">${esc(c.name)} · ${toolsOf(c.id).length} outils</span></span></a></li>`).join('');
  const body = `<section class="hero"><div class="container">
<h1>Outils gratuits pour calculer, convertir et planifier</h1>
<p class="hero-sub">Des calculateurs simples et rapides pour vos besoins du quotidien.</p>
${searchForm('hero-search', true)}
</div></section>
<div class="container">
<ul class="promises">${promises}</ul>
${sections.map(([title, tools, cat], i) => `<section class="sub"><div class="sub-head"><h2>${esc(title)}</h2>${cat ? `<a class="more" href="${catUrl(cat)}">Voir tout<span class="sr-only"> : ${esc(cat.name)}</span></a>` : ''}</div>${cardGrid(tools)}</section>`).join('\n')}
<section class="sub" id="tous-les-outils"><h2>Tous nos outils</h2>
${CATEGORIES.map((c) => `<h3><a href="${catUrl(c)}">${esc(c.name)}</a></h3><ul class="all-list">${toolsOf(c.id).map((t) => `<li><a href="${t.url}">${esc(t.name)}</a></li>`).join('')}</ul>`).join('\n')}
</section>
<section class="prose why"><h2>Des outils utiles, avec des explications</h2>
<p>Chaque outil affiche son résultat immédiatement, détaille la formule utilisée et propose un exemple, un tableau de valeurs courantes et les réponses aux questions que l’on se pose le plus souvent. Les calculs sont réalisés directement dans votre navigateur : les valeurs que vous saisissez ne sont pas envoyées à un serveur.</p>
</section>
</div>`;
  const ld = [{ '@context': 'https://schema.org', '@type': 'WebSite', name: config.SITE_NAME, url: abs('/'), inLanguage: 'fr', description: config.SITE_TAGLINE }];
  return layout({ title: `${config.SITE_NAME} : outils gratuits pour calculer, convertir et planifier`, rawTitle: true, description: 'Calculateurs, convertisseurs et outils de planification gratuits : pourcentages, TVA, travaux, conversions, jours ouvrés. Résultats immédiats.', path: '/', body, ld, home: true });
}

/* ───────────── 404 ───────────── */
export function notFoundPage() {
  const body = `<div class="container narrow">
<h1>Cette page n’existe pas.</h1>
<p class="lead">L’adresse est peut-être incorrecte ou la page a été déplacée. Voici de quoi retrouver votre chemin.</p>
<p><a class="btn btn-inline" href="/">Retour à l’accueil</a></p>
<h2>Rechercher un outil</h2>
${searchForm('nf-search', true)}
<h2>Calculateurs populaires</h2>
${cardGrid(popularTools().slice(0, 6))}
<h2>Catégories</h2>
<ul class="pills">${CATEGORIES.map((c) => `<li><a href="${catUrl(c)}">${esc(c.name)}</a></li>`).join('')}</ul>
</div>`;
  return layout({ title: 'Page introuvable', description: 'Cette page n’existe pas. Retrouvez nos calculateurs, convertisseurs et outils de planification gratuits.', path: '/404.html', body, noindex: true });
}

export const ALL_TOOLS = TOOLS;
