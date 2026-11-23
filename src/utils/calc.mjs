// Fonctions de calcul pures. Utilisées par le build (pré-rendu), les tests et le navigateur.
// Aucune dépendance. Toutes les dates sont manipulées en UTC pour éviter les décalages d'heure d'été.

const NBSP = ' ';
const MS = 86400000;

/* ───────────── Nombres et formats ───────────── */

export function round(n, d = 2) {
  if (!Number.isFinite(n)) return n;
  const s = String(Math.abs(n));
  if (s.includes('e')) return (Math.sign(n) * Math.round(Math.abs(n) * 10 ** d)) / 10 ** d;
  return Math.sign(n) * Number(Math.round(Number(s + 'e' + d)) + 'e-' + d);
}

const nfCache = new Map();
export function fmt(n, max = 2, min = 0) {
  if (!Number.isFinite(n)) return '—';
  const key = max + '/' + min;
  let f = nfCache.get(key);
  if (!f) {
    f = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: max, minimumFractionDigits: min });
    nfCache.set(key, f);
  }
  const r = round(n, max);
  return f.format(r === 0 ? 0 : r);
}
export const eur = (n) => fmt(n, 2, 2) + NBSP + '€';
export function fmtSmart(n) {
  const a = Math.abs(n);
  return fmt(n, a >= 1000 ? 4 : a >= 1 ? 6 : 8);
}
const plu = (n, s, p = s + 's') => `${fmt(n, 0)}${NBSP}${Math.abs(n) >= 2 ? p : s}`;
const u = (n, unit, max = 2) => `${fmt(n, max)}${NBSP}${unit}`;

/** Lit un nombre saisi à la française ("12,5", "1 200"). Retourne NaN si vide ou invalide. */
export function num(v) {
  if (typeof v === 'number') return v;
  if (v == null) return NaN;
  const s = String(v).trim().replace(/[\s  ]/g, '').replace(',', '.');
  if (s === '' || !/^[+-]?(\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
  return Number(s);
}
const N = (v, ...keys) => keys.map((k) => num(v[k]));
const bad = (arr) => arr.some((x) => Number.isNaN(x));
const INC = { incomplete: true };
const ERR = (m) => ({ error: m });
const NEG = 'Les valeurs doivent être positives ou nulles.';
const res = (label, value, rows = [], extra = {}) => ({ main: { label, value }, rows, ...extra });

/* ───────────── Dates (UTC) ───────────── */

export function utc(y, m, d) {
  const dt = new Date(0);
  dt.setUTCFullYear(y, m, d);
  dt.setUTCHours(0, 0, 0, 0);
  return dt;
}
export function parseISO(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '').trim());
  if (!m) return null;
  const y = +m[1], mo = +m[2] - 1, d = +m[3];
  if (y < 1000) return null;
  const dt = utc(y, mo, d);
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo && dt.getUTCDate() === d ? dt : null;
}
export const toISO = (dt) => dt.toISOString().slice(0, 10);
export function todayISO() {
  const d = new Date();
  const p = (x) => String(x).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export const daysInMonth = (y, m) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
export const addDays = (dt, n) => new Date(dt.getTime() + n * MS);
export function addMonths(dt, n) {
  const total = dt.getUTCFullYear() * 12 + dt.getUTCMonth() + n;
  const y = Math.floor(total / 12);
  const m = total - y * 12;
  return utc(y, m, Math.min(dt.getUTCDate(), daysInMonth(y, m)));
}
export const diffDays = (a, b) => Math.round((b.getTime() - a.getTime()) / MS);

/** Écart en années / mois / jours entre a et b (a <= b). Mois entiers d'abord, puis jours restants. */
export function diffYMD(a, b) {
  let months = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + b.getUTCMonth() - a.getUTCMonth();
  if (addMonths(a, months) > b) months--;
  const days = diffDays(addMonths(a, months), b);
  return { years: Math.floor(months / 12), months: months % 12, days, totalMonths: months };
}
export function isoWeek(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / MS + 1) / 7);
}
const dateFmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const dayName = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', timeZone: 'UTC' });
export const dateLong = (dt) => dateFmt.format(dt).replace(/(^|\s)1(?=\s\p{L})/u, (m, p) => p + '1er');
export const weekdayName = (dt) => dayName.format(dt);
const ymdText = ({ years, months, days }) => {
  const parts = [];
  if (years) parts.push(plu(years, 'an'));
  if (months) parts.push(`${fmt(months, 0)}${NBSP}mois`);
  if (days) parts.push(plu(days, 'jour'));
  if (!parts.length) return `0${NBSP}jour`;
  return parts.length === 1 ? parts[0] : parts.slice(0, -1).join(', ') + ' et ' + parts[parts.length - 1];
};
const checkYear = (dt) => dt.getUTCFullYear() >= 1000 && dt.getUTCFullYear() <= 9999;

/** Dimanche de Pâques (algorithme de Meeus/Jones/Butcher, calendrier grégorien). */
export function easter(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return utc(y, month - 1, day);
}
const holCache = new Map();
/** Les 11 jours fériés légaux en France métropolitaine (hors spécificités locales d'Alsace-Moselle). */
export function holidaysFR(y) {
  if (holCache.has(y)) return holCache.get(y);
  const e = easter(y);
  const list = [
    ['Jour de l’An', utc(y, 0, 1)],
    ['Lundi de Pâques', addDays(e, 1)],
    ['Fête du Travail', utc(y, 4, 1)],
    ['Victoire 1945', utc(y, 4, 8)],
    ['Ascension', addDays(e, 39)],
    ['Lundi de Pentecôte', addDays(e, 50)],
    ['Fête nationale', utc(y, 6, 14)],
    ['Assomption', utc(y, 7, 15)],
    ['Toussaint', utc(y, 10, 1)],
    ['Armistice 1918', utc(y, 10, 11)],
    ['Noël', utc(y, 11, 25)],
  ].map(([name, date]) => ({ name, date }));
  const out = { list, map: new Map(list.map((h) => [toISO(h.date), h.name])) };
  holCache.set(y, out);
  return out;
}
export const holidayName = (dt) => holidaysFR(dt.getUTCFullYear()).map.get(toISO(dt)) || null;

export function countBusinessDays(a, b, { saturday = false, holidays = true, inclusive = true } = {}) {
  const start = inclusive ? a : addDays(a, 1);
  let counted = 0, weekends = 0, calendar = 0;
  const removed = [];
  for (let d = start; d <= b; d = addDays(d, 1)) {
    calendar++;
    const w = d.getUTCDay();
    if (w === 0 || (w === 6 && !saturday)) { weekends++; continue; }
    const h = holidays ? holidayName(d) : null;
    if (h) { removed.push({ name: h, date: d }); continue; }
    counted++;
  }
  return { counted, weekends, calendar, removed };
}
export function addBusinessDays(dt, n, sign = 1, { holidays = true } = {}) {
  let d = dt, left = n;
  while (left > 0) {
    d = addDays(d, sign);
    const w = d.getUTCDay();
    if (w === 0 || w === 6) continue;
    if (holidays && holidayName(d)) continue;
    left--;
  }
  return d;
}

/* ───────────── Pourcentages ───────────── */

function pctPart(v) {
  const [p, x] = N(v, 'p', 'v');
  if (bad([p, x])) return INC;
  const r = (x * p) / 100;
  return res(`${fmt(p, 4)} % de ${fmt(x, 4)}`, fmt(r, 4), [['Calcul', `${fmt(x, 4)} × ${fmt(p, 4)} ÷ 100`]], { raw: { r } });
}
function pctRatio(v) {
  const [a, b] = N(v, 'a', 'b');
  if (bad([a, b])) return INC;
  if (b === 0) return ERR('La valeur de référence ne peut pas être égale à zéro.');
  const r = (a / b) * 100;
  return res(`${fmt(a, 4)} sur ${fmt(b, 4)} représente`, `${fmt(r, 4)}${NBSP}%`, [['Calcul', `${fmt(a, 4)} ÷ ${fmt(b, 4)} × 100`]], { raw: { r } });
}
function pctBase(v) {
  const [a, p] = N(v, 'a', 'p');
  if (bad([a, p])) return INC;
  if (p === 0) return ERR('Le pourcentage ne peut pas être égal à zéro.');
  const r = (a * 100) / p;
  return res(`Si ${fmt(a, 4)} représente ${fmt(p, 4)} %, le total est de`, fmt(r, 4), [['Calcul', `${fmt(a, 4)} × 100 ÷ ${fmt(p, 4)}`]], { raw: { r } });
}
function pctIncrease(v) {
  const [x, p] = N(v, 'v', 'p');
  if (bad([x, p])) return INC;
  const fin = x * (1 + p / 100);
  return res('Valeur après augmentation', fmt(fin, 4), [
    ['Valeur de départ', fmt(x, 4)],
    ['Augmentation', `+${fmt(fin - x, 4)}`],
    ['Coefficient multiplicateur', fmt(1 + p / 100, 6)],
  ], { raw: { fin, gain: fin - x } });
}
function pctDecrease(v) {
  const [x, p] = N(v, 'v', 'p');
  if (bad([x, p])) return INC;
  if (p > 100) return ERR('Une réduction ne peut pas dépasser 100 %.');
  const fin = x * (1 - p / 100);
  return res('Valeur après réduction', fmt(fin, 4), [
    ['Valeur de départ', fmt(x, 4)],
    ['Réduction', `−${fmt(x - fin, 4)}`],
    ['Coefficient multiplicateur', fmt(1 - p / 100, 6)],
  ], { raw: { fin, saved: x - fin } });
}
function pctChange(v) {
  const [a, b] = N(v, 'v0', 'v1');
  if (bad([a, b])) return INC;
  if (a === 0) return ERR('La valeur de départ ne peut pas être égale à zéro.');
  const r = ((b - a) / Math.abs(a)) * 100;
  const label = r > 0 ? 'Augmentation de' : r < 0 ? 'Baisse de' : 'Variation de';
  return res(label, `${fmt(Math.abs(r), 4)}${NBSP}%`, [
    ['Écart', `${b - a >= 0 ? '+' : '−'}${fmt(Math.abs(b - a), 4)}`],
    ['Coefficient multiplicateur', fmt(b / a, 6)],
  ], { raw: { r } });
}
function ruleOfThree(v) {
  const [a, b, c] = N(v, 'a', 'b', 'c');
  if (bad([a, b, c])) return INC;
  if (a === 0) return ERR('La première valeur ne peut pas être égale à zéro.');
  const x = (b * c) / a;
  return res(`Si ${fmt(a, 4)} correspond à ${fmt(b, 4)}, alors ${fmt(c, 4)} correspond à`, fmt(x, 4), [['Calcul', `${fmt(b, 4)} × ${fmt(c, 4)} ÷ ${fmt(a, 4)}`]], { raw: { x } });
}
function ruleOfThreeInv(v) {
  const [a, b, c] = N(v, 'a', 'b', 'c');
  if (bad([a, b, c])) return INC;
  if (c === 0) return ERR('La troisième valeur ne peut pas être égale à zéro.');
  const x = (a * b) / c;
  return res(`Si ${fmt(a, 4)} correspond à ${fmt(b, 4)} (proportion inverse), alors ${fmt(c, 4)} correspond à`, fmt(x, 4), [['Calcul', `${fmt(a, 4)} × ${fmt(b, 4)} ÷ ${fmt(c, 4)}`]], { raw: { x } });
}

/* ───────────── Moyennes ───────────── */

function parseList(text) {
  const toks = String(text || '').split(/[\s;]+/).filter(Boolean);
  const out = [];
  for (const t of toks) {
    const n = num(t);
    if (Number.isNaN(n)) return { error: `« ${t} » n’est pas un nombre valide. Séparez les valeurs par un espace, un point-virgule ou un retour à la ligne.` };
    out.push(n);
  }
  return { values: out };
}
const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
function mean(v) {
  const p = parseList(v.list);
  if (p.error) return ERR(p.error);
  if (!p.values.length) return INC;
  const vals = p.values, sum = vals.reduce((a, b) => a + b, 0), avg = sum / vals.length;
  return res('Moyenne', fmt(avg, 4), [
    ['Nombre de valeurs', fmt(vals.length, 0)],
    ['Somme', fmt(sum, 4)],
    ['Minimum / maximum', `${fmt(Math.min(...vals), 4)} / ${fmt(Math.max(...vals), 4)}`],
    ['Médiane', fmt(median(vals), 4)],
  ], { raw: { avg, sum, n: vals.length } });
}
function weightedMean(v) {
  const lines = String(v.list || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return INC;
  let sw = 0, sv = 0;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].split(/[\s;]+/).filter(Boolean);
    const [x, w] = t.map(num);
    if (t.length !== 2 || Number.isNaN(x) || Number.isNaN(w)) return ERR(`Ligne ${i + 1} : saisissez la valeur puis son coefficient, par exemple « 14 2 ».`);
    if (w < 0) return ERR(`Ligne ${i + 1} : le coefficient ne peut pas être négatif.`);
    sw += w; sv += x * w;
  }
  if (sw === 0) return ERR('La somme des coefficients ne peut pas être égale à zéro.');
  const avg = sv / sw;
  return res('Moyenne pondérée', fmt(avg, 4), [
    ['Somme des valeurs × coefficients', fmt(sv, 4)],
    ['Somme des coefficients', fmt(sw, 4)],
    ['Calcul', `${fmt(sv, 4)} ÷ ${fmt(sw, 4)}`],
  ], { raw: { avg, sv, sw } });
}

/* ───────────── Dates et durées ───────────── */

function age(v) {
  const b = parseISO(v.birth), r = parseISO(v.ref);
  if (!b || !r) return INC;
  if (b > r) return ERR('La date de naissance doit être antérieure à la date de référence.');
  const ymd = diffYMD(b, r);
  const total = diffDays(b, r);
  const by = b.getUTCFullYear(), bm = b.getUTCMonth(), bd = b.getUTCDate();
  const cand = (y) => utc(y, bm, Math.min(bd, daysInMonth(y, bm)));
  let next = cand(r.getUTCFullYear());
  if (next < r) next = cand(r.getUTCFullYear() + 1);
  const until = diffDays(r, next);
  return res('Âge', ymdText(ymd), [
    ['Âge en années révolues', plu(ymd.years, 'an')],
    ['Âge en mois', `${fmt(ymd.totalMonths, 0)}${NBSP}mois`],
    ['Âge en semaines', fmt(Math.floor(total / 7), 0)],
    ['Âge en jours', fmt(total, 0)],
    ['Jour de naissance', weekdayName(b)],
    ['Prochain anniversaire', until === 0 ? `aujourd’hui (${plu(next.getUTCFullYear() - by, 'an')})` : `${dateLong(next)}, dans ${plu(until, 'jour')} (${plu(next.getUTCFullYear() - by, 'an')})`],
  ], { raw: { ...ymd, total, until } });
}
function orderDates(v) {
  const a = parseISO(v.d1), b = parseISO(v.d2);
  if (!a || !b) return null;
  return a <= b ? { a, b, swapped: false } : { a: b, b: a, swapped: true };
}
function durationDates(v) {
  const o = orderDates(v);
  if (!o) return INC;
  const end = v.incl ? addDays(o.b, 1) : o.b;
  const ymd = diffYMD(o.a, end);
  const days = diffDays(o.a, end);
  return res('Durée', ymdText(ymd), [
    ['En mois', `${fmt(ymd.totalMonths, 0)}${NBSP}mois et ${plu(ymd.days, 'jour')}`],
    ['En semaines', `${fmt(Math.floor(days / 7), 0)}${NBSP}semaines et ${plu(days % 7, 'jour')}`],
    ['En jours', fmt(days, 0)],
    ['En heures', fmt(days * 24, 0)],
  ], { raw: { ...ymd, totalDays: days }, note: o.swapped ? 'Les deux dates ont été remises dans l’ordre chronologique.' : undefined });
}
function daysBetween(v) {
  const o = orderDates(v);
  if (!o) return INC;
  const days = diffDays(o.a, o.b) + (v.incl ? 1 : 0);
  return res('Nombre de jours', plu(days, 'jour'), [
    ['En semaines', `${fmt(Math.floor(days / 7), 0)}${NBSP}semaines et ${plu(days % 7, 'jour')}`],
    ['En heures', fmt(days * 24, 0)],
    ['En années, mois, jours', ymdText(diffYMD(o.a, v.incl ? addDays(o.b, 1) : o.b))],
    ['Première date', dateLong(o.a)],
    ['Seconde date', dateLong(o.b)],
  ], { raw: { days }, note: o.swapped ? 'Les deux dates ont été remises dans l’ordre chronologique.' : undefined });
}
function weeksBetween(v) {
  const o = orderDates(v);
  if (!o) return INC;
  const days = diffDays(o.a, o.b);
  return res('Nombre de semaines', `${fmt(days / 7, 2)}${NBSP}semaines`, [
    ['Semaines complètes', `${fmt(Math.floor(days / 7), 0)}${NBSP}semaines et ${plu(days % 7, 'jour')}`],
    ['Total en jours', fmt(days, 0)],
    ['Semaine ISO de la première date', `semaine ${isoWeek(o.a)} de ${o.a.getUTCFullYear()}`],
    ['Semaine ISO de la seconde date', `semaine ${isoWeek(o.b)} de ${o.b.getUTCFullYear()}`],
  ], { raw: { weeks: days / 7, days }, note: o.swapped ? 'Les deux dates ont été remises dans l’ordre chronologique.' : undefined });
}
function businessDays(v) {
  const o = orderDates(v);
  if (!o) return INC;
  if (diffDays(o.a, o.b) > 73000) return ERR('La période est trop longue (200 ans maximum).');
  const sat = v.type === 'ouvrables';
  const r = countBusinessDays(o.a, o.b, { saturday: sat, holidays: !!v.feries, inclusive: !!v.incl });
  const rows = [
    ['Jours calendaires comptés', fmt(r.calendar, 0)],
    [sat ? 'Dimanches retirés' : 'Week-ends retirés', fmt(r.weekends, 0)],
  ];
  if (v.feries) rows.push(['Jours fériés retirés', r.removed.length ? `${r.removed.length} (${r.removed.map((h) => `${h.name} ${toISO(h.date).split('-').reverse().slice(0, 2).join('/')}`).join(', ')})` : '0']);
  return res(sat ? 'Jours ouvrables' : 'Jours ouvrés', plu(r.counted, 'jour'), rows, { raw: { counted: r.counted }, note: o.swapped ? 'Les deux dates ont été remises dans l’ordre chronologique.' : undefined });
}
function countdown(v) {
  const t = parseISO(v.target), f = parseISO(v.from);
  if (!t || !f) return INC;
  const days = diffDays(f, t);
  if (days === 0) return res('Compte à rebours', 'C’est aujourd’hui !', [['Date', dateLong(t)]], { raw: { days } });
  const a = days > 0 ? f : t, b = days > 0 ? t : f;
  const d = Math.abs(days);
  return res(days > 0 ? 'Il reste' : 'Cette date est passée depuis', plu(d, 'jour'), [
    ['Date cible', dateLong(t)],
    ['En semaines', `${fmt(Math.floor(d / 7), 0)}${NBSP}semaines et ${plu(d % 7, 'jour')}`],
    ['En mois et jours', ymdText(diffYMD(a, b))],
    ['En heures', fmt(d * 24, 0)],
  ], { raw: { days } });
}
function daysToAnnual(v) {
  const f = parseISO(v.from);
  if (!f) return INC;
  const month = num(v.month) - 1, day = num(v.day);
  let y = f.getUTCFullYear();
  let target = utc(y, month, day);
  if (target < f) { y++; target = utc(y, month, day); }
  const days = diffDays(f, target);
  const label = v.label;
  if (days === 0) return res(`${label}`, 'C’est aujourd’hui !', [['Date', dateLong(target)]], { raw: { days } });
  const bd = countBusinessDays(addDays(f, 1), addDays(target, -1), { holidays: true });
  return res(`Il reste avant ${label}`, plu(days, 'jour'), [
    ['Date', dateLong(target)],
    ['En semaines', `${fmt(Math.floor(days / 7), 0)}${NBSP}semaines et ${plu(days % 7, 'jour')}`],
    ['En heures', fmt(days * 24, 0)],
    ['Jours ouvrés restants (hors fériés)', fmt(bd.counted, 0)],
  ], { raw: { days } });
}
function dateShift(v) {
  const s = parseISO(v.start);
  const n = num(v.n);
  if (!s || Number.isNaN(n)) return INC;
  if (n < 0 || !Number.isInteger(n)) return ERR('Saisissez un nombre entier positif ou nul.');
  const sign = Number(v.sign) < 0 ? -1 : 1;
  if (n > 100000) return ERR('Le nombre saisi est trop grand.');
  let out;
  switch (v.unit) {
    case 'semaines': out = addDays(s, sign * n * 7); break;
    case 'mois': out = addMonths(s, sign * n); break;
    case 'annees': out = addMonths(s, sign * n * 12); break;
    case 'ouvres': out = addBusinessDays(s, n, sign, { holidays: true }); break;
    default: out = addDays(s, sign * n);
  }
  if (!checkYear(out)) return ERR('La date obtenue est hors des limites du calculateur (années 1000 à 9999).');
  const days = Math.abs(diffDays(s, out));
  return res(sign > 0 ? 'Date obtenue (après)' : 'Date obtenue (avant)', dateLong(out), [
    ['Date de départ', dateLong(s)],
    ['Jours calendaires écoulés', fmt(days, 0)],
    ['Numéro de semaine (ISO)', `semaine ${isoWeek(out)}`],
    ['Au format numérique', toISO(out).split('-').reverse().join('/')],
  ], { raw: { iso: toISO(out) }, note: v.unit === 'mois' || v.unit === 'annees' ? 'Si le jour n’existe pas dans le mois obtenu (par exemple le 31), on retient le dernier jour de ce mois.' : v.unit === 'ouvres' ? 'Samedis, dimanches et jours fériés français ne sont pas comptés.' : undefined });
}
function holidays(v) {
  const y = num(v.year);
  if (Number.isNaN(y)) return INC;
  if (!Number.isInteger(y) || y < 1583 || y > 9999) return ERR('Saisissez une année entre 1583 et 9999.');
  const { list } = holidaysFR(y);
  const week = list.filter((h) => { const w = h.date.getUTCDay(); return w >= 1 && w <= 5; }).length;
  return res(`Jours fériés en France en ${y}`, `${list.length} jours`, [
    ...list.map((h) => [h.name, dateLong(h.date)]),
    ['Tombant un jour de semaine (lun.–ven.)', fmt(week, 0)],
  ], { raw: { count: list.length, week }, note: 'Jours fériés légaux en France métropolitaine. L’Alsace-Moselle et l’outre-mer comptent des jours supplémentaires.' });
}

/* ───────────── Argent ───────────── */

function rateOf(v) {
  return v.rate === 'custom' ? num(v.custom) : num(v.rate);
}
function tva(v) {
  const amount = num(v.amount), r = rateOf(v);
  if (bad([amount, r])) return INC;
  if (amount < 0 || r < 0) return ERR(NEG);
  let ht, ttc, t;
  if (v.mode === 'ttc') {
    ttc = round(amount, 2);
    ht = round(ttc / (1 + r / 100), 2);
    t = round(ttc - ht, 2);
  } else {
    ht = round(amount, 2);
    t = round((ht * r) / 100, 2);
    ttc = round(ht + t, 2);
  }
  const main = v.mode === 'ttc' ? ['Prix hors taxes (HT)', eur(ht)] : ['Prix toutes taxes comprises (TTC)', eur(ttc)];
  return res(main[0], main[1], [
    ['Montant HT', eur(ht)],
    [`TVA à ${fmt(r, 2)} %`, eur(t)],
    ['Montant TTC', eur(ttc)],
    ['Coefficient', v.mode === 'ttc' ? `÷ ${fmt(1 + r / 100, 4)}` : `× ${fmt(1 + r / 100, 4)}`],
  ], { raw: { ht, tva: t, ttc } });
}
const WEEKS_PER_MONTH = 52 / 12;
function hourlyFromMonthly(v) {
  const [m, h] = N(v, 'm', 'h');
  if (bad([m, h])) return INC;
  if (m < 0 || h <= 0 || h > 80) return ERR('Saisissez un salaire positif et une durée hebdomadaire entre 1 et 80 heures.');
  const hm = h * WEEKS_PER_MONTH;
  const hourly = m / hm;
  return res('Salaire horaire', eur(hourly), [
    ['Heures par mois', `${fmt(hm, 2)}${NBSP}h`],
    ['Salaire hebdomadaire', eur((hourly * h))],
    ['Salaire annuel', eur(m * 12)],
  ], { raw: { hourly, hm } });
}
function monthlyFromHourly(v) {
  const [r, h] = N(v, 'r', 'h');
  if (bad([r, h])) return INC;
  if (r < 0 || h <= 0 || h > 80) return ERR('Saisissez un taux horaire positif et une durée hebdomadaire entre 1 et 80 heures.');
  const hm = h * WEEKS_PER_MONTH;
  const monthly = r * hm;
  return res('Salaire mensuel', eur(monthly), [
    ['Heures par mois', `${fmt(hm, 2)}${NBSP}h`],
    ['Salaire hebdomadaire', eur(r * h)],
    ['Salaire annuel', eur(r * h * 52)],
  ], { raw: { monthly, hm } });
}
function salaryRaise(v) {
  const [s, p] = N(v, 's', 'p');
  if (bad([s, p])) return INC;
  if (s < 0) return ERR(NEG);
  const nw = s * (1 + p / 100);
  return res('Nouveau salaire mensuel', eur(nw), [
    ['Salaire actuel', eur(s)],
    ['Gain mensuel', eur(nw - s)],
    ['Gain annuel (12 mois)', eur((nw - s) * 12)],
    ['Nouveau salaire annuel (12 mois)', eur(nw * 12)],
  ], { raw: { nw, gain: nw - s } });
}
function salaryRate(v) {
  const [a, b] = N(v, 'old', 'nw');
  if (bad([a, b])) return INC;
  if (a <= 0) return ERR('Le salaire actuel doit être supérieur à zéro.');
  const p = ((b - a) / a) * 100;
  return res(p >= 0 ? 'Augmentation de' : 'Baisse de', `${fmt(Math.abs(p), 2)}${NBSP}%`, [
    ['Écart mensuel', `${b - a >= 0 ? '+' : '−'}${eur(Math.abs(b - a))}`],
    ['Écart annuel (12 mois)', `${b - a >= 0 ? '+' : '−'}${eur(Math.abs((b - a) * 12))}`],
  ], { raw: { p } });
}
function discount(v) {
  const [price, pct] = N(v, 'price', 'pct');
  if (bad([price, pct])) return INC;
  if (price < 0 || pct < 0 || pct > 100) return ERR('Saisissez un prix positif et une remise comprise entre 0 et 100 %.');
  const rem = round((price * pct) / 100, 2);
  const fin = round(price - rem, 2);
  return res('Montant de la remise', eur(rem), [['Prix initial', eur(price)], ['Prix après remise', eur(fin)]], { raw: { rem, fin } });
}
function priceAfter(v) {
  const price = num(v.price), p1 = num(v.p1);
  let p2 = num(v.p2);
  if (bad([price, p1])) return INC;
  if (Number.isNaN(p2)) p2 = 0;
  if (price < 0 || p1 < 0 || p1 > 100 || p2 < 0 || p2 > 100) return ERR('Saisissez un prix positif et des réductions comprises entre 0 et 100 %.');
  const fin = round(price * (1 - p1 / 100) * (1 - p2 / 100), 2);
  const total = price === 0 ? 0 : (1 - fin / price) * 100;
  return res('Prix après réduction', eur(fin), [
    ['Prix initial', eur(price)],
    ['Économie réalisée', eur(price - fin)],
    ['Réduction totale équivalente', `${fmt(total, 2)}${NBSP}%`],
  ], { raw: { fin, total } });
}

/* ───────────── Surfaces, volumes, pente ───────────── */

const K = { m: 1, cm: 0.01, mm: 0.001 };
function area(v) {
  const unit = v.unit || 'm', k = K[unit];
  if (!k) return ERR('Unité inconnue.');
  let a, per = null, formula;
  switch (v.shape || 'rect') {
    case 'carre': { const [c] = N(v, 'cote'); if (bad([c])) return INC; if (c < 0) return ERR(NEG); a = c * c; per = 4 * c; formula = 'côté × côté'; break; }
    case 'triangle': { const [b, h] = N(v, 'base', 'haut'); if (bad([b, h])) return INC; if (b < 0 || h < 0) return ERR(NEG); a = (b * h) / 2; formula = 'base × hauteur ÷ 2'; break; }
    case 'cercle': { const [r] = N(v, 'rayon'); if (bad([r])) return INC; if (r < 0) return ERR(NEG); a = Math.PI * r * r; per = 2 * Math.PI * r; formula = 'π × rayon²'; break; }
    case 'trapeze': { const [B, b, h] = N(v, 'gb', 'pb', 'ht'); if (bad([B, b, h])) return INC; if (B < 0 || b < 0 || h < 0) return ERR(NEG); a = ((B + b) * h) / 2; formula = '(grande base + petite base) × hauteur ÷ 2'; break; }
    default: { const [L, l] = N(v, 'long', 'larg'); if (bad([L, l])) return INC; if (L < 0 || l < 0) return ERR(NEG); a = L * l; per = 2 * (L + l); formula = 'longueur × largeur'; }
  }
  const m2 = a * k * k;
  const rows = [['Formule', formula], ['Surface en m²', u(m2, 'm²', 4)], ['Surface en cm²', u(m2 * 1e4, 'cm²', 2)], ['Surface en ares', u(m2 / 100, 'a', 4)], ['Surface en hectares', u(m2 / 1e4, 'ha', 6)]];
  if (per !== null) rows.push(['Périmètre', u(per, unit, 4)]);
  return res('Surface', u(a, `${unit}²`, 4), rows, { raw: { a, m2 } });
}
function volume(v) {
  const unit = v.unit || 'm', k = K[unit];
  if (!k) return ERR('Unité inconnue.');
  let vol, formula;
  switch (v.shape || 'pave') {
    case 'cube': { const [c] = N(v, 'cote'); if (bad([c])) return INC; if (c < 0) return ERR(NEG); vol = c ** 3; formula = 'côté³'; break; }
    case 'cylindre': { const [r, h] = N(v, 'rayon', 'haut'); if (bad([r, h])) return INC; if (r < 0 || h < 0) return ERR(NEG); vol = Math.PI * r * r * h; formula = 'π × rayon² × hauteur'; break; }
    case 'sphere': { const [r] = N(v, 'rayon'); if (bad([r])) return INC; if (r < 0) return ERR(NEG); vol = (4 / 3) * Math.PI * r ** 3; formula = '4/3 × π × rayon³'; break; }
    case 'cone': { const [r, h] = N(v, 'rayon', 'haut'); if (bad([r, h])) return INC; if (r < 0 || h < 0) return ERR(NEG); vol = (Math.PI * r * r * h) / 3; formula = 'π × rayon² × hauteur ÷ 3'; break; }
    default: { const [L, l, h] = N(v, 'long', 'larg', 'haut'); if (bad([L, l, h])) return INC; if (L < 0 || l < 0 || h < 0) return ERR(NEG); vol = L * l * h; formula = 'longueur × largeur × hauteur'; }
  }
  const m3 = vol * k ** 3;
  return res('Volume', u(vol, `${unit}³`, 4), [
    ['Formule', formula],
    ['Volume en m³', u(m3, 'm³', 6)],
    ['Volume en litres', u(m3 * 1000, 'L', 3)],
    ['Volume en cm³', u(m3 * 1e6, 'cm³', 2)],
  ], { raw: { vol, m3, litres: m3 * 1000 } });
}
function slope(v) {
  const [h, l] = N(v, 'h', 'l');
  if (bad([h, l])) return INC;
  if (l <= 0) return ERR('La longueur horizontale doit être supérieure à zéro.');
  if (h < 0) return ERR(NEG);
  const pct = (h / l) * 100;
  const rows = [
    ['Angle', `${fmt((Math.atan(h / l) * 180) / Math.PI, 2)}${NBSP}°`],
    ['Équivalent', `${fmt(pct, 2)}${NBSP}cm par mètre`],
    ['Longueur suivant la pente', fmt(Math.hypot(h, l), 3)],
  ];
  if (h > 0) rows.splice(1, 0, ['Rapport', `1 pour ${fmt(l / h, 2)}`]);
  return res('Pente', `${fmt(pct, 2)}${NBSP}%`, rows, { raw: { pct } });
}
function slopeHeight(v) {
  const [pct, l] = N(v, 'pct', 'l');
  if (bad([pct, l])) return INC;
  if (pct < 0 || l < 0) return ERR(NEG);
  return res('Dénivelé', fmt((l * pct) / 100, 3), [['Calcul', `${fmt(l, 3)} × ${fmt(pct, 3)} ÷ 100`]], { raw: { h: (l * pct) / 100 } });
}

/* ───────────── Travaux ───────────── */

function paint(v) {
  const [L, l, h, ouv, coats, rend] = N(v, 'long', 'larg', 'haut', 'ouv', 'couches', 'rend');
  if (bad([L, l, h, coats, rend]) ) return INC;
  const op = Number.isNaN(ouv) ? 0 : ouv;
  if (L <= 0 || l <= 0 || h <= 0 || rend <= 0) return ERR('Les dimensions et le rendement doivent être supérieurs à zéro.');
  if (!Number.isInteger(coats) || coats < 1 || coats > 6) return ERR('Le nombre de couches doit être un entier entre 1 et 6.');
  const walls = 2 * (L + l) * h;
  if (op < 0 || op >= walls) return ERR('La surface des ouvertures doit être positive et inférieure à celle des murs.');
  const ceil = v.plafond === 'oui' ? L * l : 0;
  const surf = walls - op + ceil;
  const net = (surf * coats) / rend;
  const safe = net * 1.1;
  const pots = Math.ceil(safe / 2.5 - 1e-9);
  return res('Peinture à prévoir (marge de 10 % incluse)', u(safe, 'L', 1), [
    ['Surface des murs', u(walls, 'm²')],
    ['Surface des ouvertures retirée', u(op, 'm²')],
    ...(ceil ? [['Surface du plafond', u(ceil, 'm²')]] : []),
    ['Surface totale à peindre', u(surf, 'm²')],
    ['Quantité nécessaire sans marge', u(net, 'L', 2)],
    ['En pots de 2,5 L', plu(pots, 'pot')],
  ], { raw: { walls, surf, net, safe, pots } });
}
const POSE = { 5: 5, 10: 10, 15: 15 };
function tiles(v) {
  const [L, l, cl, cw, j, box] = N(v, 'long', 'larg', 'cl', 'cw', 'joint', 'boite');
  if (bad([L, l, cl, cw])) return INC;
  const joint = Number.isNaN(j) ? 0 : j;
  if (L <= 0 || l <= 0 || cl <= 0 || cw <= 0 || joint < 0) return ERR('Les dimensions doivent être supérieures à zéro.');
  const marge = POSE[v.marge] ?? 10;
  const surf = L * l;
  const pitch = ((cl + joint / 10) * (cw + joint / 10)) / 10000;
  const tileArea = (cl * cw) / 10000;
  const netN = Math.ceil(surf / pitch - 1e-9);
  const withN = Math.ceil((surf * (1 + marge / 100)) / pitch - 1e-9);
  const rows = [
    ['Surface à carreler', u(surf, 'm²')],
    ['Surface d’un carreau avec joint', u(pitch * 10000, 'cm²')],
    ['Carreaux nécessaires (sans marge)', fmt(netN, 0)],
    [`Marge de chute (${marge} %)`, `+${fmt(withN - netN, 0)}`],
    ['Surface de carrelage achetée', u(withN * tileArea, 'm²')],
  ];
  if (!Number.isNaN(box) && box > 0) rows.push(['Boîtes à commander', plu(Math.ceil((withN * tileArea) / box - 1e-9), 'boîte')]);
  return res('Carreaux à commander', plu(withN, 'carreau', 'carreaux'), rows, { raw: { surf, netN, withN } });
}
function flooring(v) {
  const [L, l, pack] = N(v, 'long', 'larg', 'paquet');
  if (bad([L, l, pack])) return INC;
  if (L <= 0 || l <= 0 || pack <= 0) return ERR('Les dimensions et la surface par paquet doivent être supérieures à zéro.');
  const marge = POSE[v.marge] ?? 10;
  const surf = L * l, need = surf * (1 + marge / 100);
  const packs = Math.ceil(need / pack - 1e-9);
  return res('Paquets à commander', plu(packs, 'paquet'), [
    ['Surface de la pièce', u(surf, 'm²')],
    [`Surface avec ${marge} % de chute`, u(need, 'm²')],
    ['Surface réellement achetée', u(packs * pack, 'm²')],
    ['Surplus après pose', u(packs * pack - surf, 'm²')],
  ], { raw: { surf, need, packs } });
}
function concrete(v) {
  const [L, l, ep, marge] = N(v, 'long', 'larg', 'ep', 'marge');
  if (bad([L, l, ep])) return INC;
  const mg = Number.isNaN(marge) ? 0 : marge;
  if (L <= 0 || l <= 0 || ep <= 0 || mg < 0) return ERR('Les dimensions doivent être supérieures à zéro.');
  const vol = (L * l * ep) / 100, volM = vol * (1 + mg / 100);
  const ciment = volM * 350;
  return res('Volume de béton à prévoir', u(volM, 'm³', 3), [
    ['Volume net de la dalle', u(vol, 'm³', 3)],
    [`Volume avec ${fmt(mg, 1)} % de marge`, u(volM, 'm³', 3)],
    ['Ciment (350 kg/m³)', `${fmt(ciment, 0)}${NBSP}kg, soit ${plu(Math.ceil(ciment / 35 - 1e-9), 'sac')} de 35 kg`],
    ['Sable (0,4 m³ par m³)', `${fmt(volM * 400, 0)}${NBSP}L`],
    ['Gravillons (0,8 m³ par m³)', `${fmt(volM * 800, 0)}${NBSP}L`],
    ['Eau (environ 175 L par m³)', `${fmt(volM * 175, 0)}${NBSP}L`],
    ['Poids approximatif du béton', `${fmt(volM * 2.4, 2)}${NBSP}t`],
  ], { raw: { vol, volM, ciment } });
}
function aggregate(v) {
  const [L, l, ep, dens, marge] = N(v, 'long', 'larg', 'ep', 'dens', 'marge');
  if (bad([L, l, ep, dens])) return INC;
  const mg = Number.isNaN(marge) ? 0 : marge;
  if (L <= 0 || l <= 0 || ep <= 0 || dens <= 0 || mg < 0) return ERR('Les dimensions et la densité doivent être supérieures à zéro.');
  const vol = (L * l * ep) / 100, volM = vol * (1 + mg / 100), t = volM * dens;
  const name = v.material === 'sable' ? 'sable' : 'gravier';
  return res(`Poids de ${name} à commander`, u(t, 't', 2), [
    ['Surface', u(L * l, 'm²')],
    ['Volume net', u(vol, 'm³', 3)],
    [`Volume avec ${fmt(mg, 1)} % de marge`, u(volM, 'm³', 3)],
    ['Poids en kilogrammes', u(t * 1000, 'kg', 0)],
    ['Big-bags d’une tonne', plu(Math.ceil(t - 1e-9), 'big-bag')],
  ], { raw: { vol, volM, t } });
}
function skirting(v) {
  const [L, l, doors, len, marge] = N(v, 'long', 'larg', 'portes', 'lg', 'marge');
  if (bad([L, l, len])) return INC;
  const dr = Number.isNaN(doors) ? 0 : doors, mg = Number.isNaN(marge) ? 0 : marge;
  if (L <= 0 || l <= 0 || len <= 0 || dr < 0 || mg < 0) return ERR('Les dimensions doivent être supérieures à zéro.');
  const per = 2 * (L + l);
  if (dr >= per) return ERR('La largeur des portes ne peut pas dépasser le périmètre de la pièce.');
  const net = per - dr, withM = net * (1 + mg / 100);
  const n = Math.ceil(withM / len - 1e-9);
  return res('Plinthes à commander', plu(n, 'plinthe'), [
    ['Périmètre de la pièce', u(per, 'm')],
    ['Longueur à recouvrir (portes déduites)', u(net, 'm')],
    [`Longueur avec ${fmt(mg, 1)} % de marge`, u(withM, 'm')],
    ['Longueur totale achetée', u(n * len, 'm')],
  ], { raw: { per, net, n } });
}

/* ───────────── Conversions ───────────── */

function convert(v) {
  const x = num(v.value), f = num(v.factor);
  if (Number.isNaN(x)) return INC;
  const r = x * f;
  return res(`${fmt(x, 6)} ${v.from} =`, `${fmtSmart(r)} ${v.to}`, [
    ['Formule', `${v.to} = ${v.from} × ${fmtSmart(f)}`],
    ['Dans l’autre sens', `1 ${v.to} = ${fmtSmart(1 / f)} ${v.from}`],
  ], { raw: { r } });
}
function convertTemp(v) {
  const x = num(v.value);
  if (Number.isNaN(x)) return INC;
  const c2f = v.kind === 'c2f';
  const celsius = c2f ? x : ((x - 32) * 5) / 9;
  if (celsius < -273.15) return ERR('Cette température est inférieure au zéro absolu.');
  const r = c2f ? (x * 9) / 5 + 32 : celsius;
  return res(c2f ? `${fmt(x, 4)} °C =` : `${fmt(x, 4)} °F =`, `${fmt(r, 4)}${NBSP}${c2f ? '°F' : '°C'}`, [
    ['Formule', c2f ? '°F = °C × 9 ÷ 5 + 32' : '°C = (°F − 32) × 5 ÷ 9'],
    ['En kelvins', `${fmt(celsius + 273.15, 2)}${NBSP}K`],
  ], { raw: { r } });
}
const GAL = { us: 3.785411784, uk: 4.54609 };
function gallons(v) {
  const x = num(v.value);
  if (Number.isNaN(x)) return INC;
  const g = GAL[v.type] ?? GAL.us;
  const name = v.type === 'uk' ? 'gallons impériaux' : 'gallons US';
  if (v.dir === 'g2l') return res(`${fmt(x, 6)} ${name} =`, `${fmtSmart(x * g)} litres`, [['Formule', `litres = gallons × ${fmtSmart(g)}`]], { raw: { r: x * g } });
  return res(`${fmt(x, 6)} litres =`, `${fmtSmart(x / g)} ${name}`, [['Formule', `gallons = litres ÷ ${fmtSmart(g)}`]], { raw: { r: x / g } });
}

export const FUNCTIONS = {
  pctPart, pctRatio, pctBase, pctIncrease, pctDecrease, pctChange, ruleOfThree, ruleOfThreeInv,
  mean, weightedMean, age, durationDates, daysBetween, weeksBetween, businessDays, countdown, daysToAnnual, dateShift, holidays,
  tva, hourlyFromMonthly, monthlyFromHourly, salaryRaise, salaryRate, discount, priceAfter,
  area, volume, slope, slopeHeight, paint, tiles, flooring, concrete, aggregate, skirting,
  convert, convertTemp, gallons,
};
