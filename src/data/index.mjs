import { CATEGORIES } from './categories.mjs';
import { generalTools } from './tools-general.mjs';
import { moneyTools } from './tools-money.mjs';
import { homeTools } from './tools-home.mjs';
import { conversionTools } from './tools-conv.mjs';
import { dateTools } from './tools-dates.mjs';
import { FUNCTIONS } from '../utils/calc.mjs';

export { CATEGORIES };

/** Ordre éditorial = ordre de la liste de la V1 (calculs, argent, maison, conversions, dates). */
export const TOOLS = [...generalTools, ...moneyTools, ...homeTools, ...conversionTools, ...dateTools];
export const BY_SLUG = new Map(TOOLS.map((t) => [t.slug, t]));
export const CAT_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

/** Complète le maillage : au moins 4 outils liés (mêmes sous-catégorie puis catégorie) et valide les données. */
for (const t of TOOLS) {
  const errors = [];
  if (!CAT_BY_ID.has(t.cat)) errors.push(`catégorie inconnue « ${t.cat} »`);
  const cat = CAT_BY_ID.get(t.cat);
  if (cat && !cat.subs.includes(t.sub)) errors.push(`sous-catégorie inconnue « ${t.sub} »`);
  for (const k of ['name', 'short', 'h1', 'metaTitle', 'metaDesc', 'intro', 'blocks', 'how', 'example', 'table', 'tips', 'faq']) if (!t[k]) errors.push(`champ manquant « ${k} »`);
  if (t.faq && (t.faq.length < 3 || t.faq.length > 6)) errors.push('la FAQ doit contenir 3 à 6 questions');
  for (const b of t.blocks || []) if (!FUNCTIONS[b.fn]) errors.push(`fonction inconnue « ${b.fn} »`);
  const rel = [];
  for (const r of t.related || []) {
    if (!BY_SLUG.has(r)) errors.push(`outil lié inexistant « ${r} »`);
    else if (r !== t.slug && !rel.includes(r)) rel.push(r);
  }
  const fill = (list) => { for (const o of list) { if (rel.length >= 4) break; if (o.slug !== t.slug && !rel.includes(o.slug)) rel.push(o.slug); } };
  fill(TOOLS.filter((o) => o.cat === t.cat && o.sub === t.sub));
  fill(TOOLS.filter((o) => o.cat === t.cat));
  t.related = rel.slice(0, 5);
  t.url = `/${t.slug}/`;
  if (errors.length) throw new Error(`Outil « ${t.slug} » invalide : ${errors.join(' ; ')}`);
}
const dup = TOOLS.map((t) => t.slug).filter((s, i, a) => a.indexOf(s) !== i);
if (dup.length) throw new Error(`Slugs en double : ${dup.join(', ')}`);

export const toolsOf = (catId) => TOOLS.filter((t) => t.cat === catId);
export const popularTools = () => TOOLS.filter((t) => t.popular);
