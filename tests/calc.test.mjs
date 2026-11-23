import test from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../src/utils/calc.mjs';

const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≉ ${b}`);

const F = C.FUNCTIONS;
const clean = (s) => String(s).replace(/[  ]/g, ' ');

test('num : saisie à la française', () => {
  assert.equal(C.num('12,5'), 12.5);
  assert.equal(C.num('1 200'), 1200);
  assert.equal(C.num('-3'), -3);
  assert.ok(Number.isNaN(C.num('')));
  assert.ok(Number.isNaN(C.num('12abc')));
  assert.ok(Number.isNaN(C.num('1e5')));
});

test('TVA : 20 € HT à 20 % = 24 € TTC', () => {
  const r = F.tva({ amount: '20', mode: 'ht', rate: '20' });
  assert.equal(r.raw.ht, 20);
  assert.equal(r.raw.tva, 4);
  assert.equal(r.raw.ttc, 24);
  assert.equal(clean(r.main.value), '24,00 €');
});
test('TVA : TTC vers HT', () => {
  const r = F.tva({ amount: '120', mode: 'ttc', rate: '20' });
  assert.equal(r.raw.ht, 100);
  assert.equal(r.raw.tva, 20);
  const r2 = F.tva({ amount: '105,50', mode: 'ttc', rate: '5.5' });
  assert.equal(r2.raw.ht, 100);
  assert.equal(r2.raw.tva, 5.5);
  const r3 = F.tva({ amount: '100', mode: 'ht', rate: 'custom', custom: '8,5' });
  assert.equal(r3.raw.ttc, 108.5);
});

test('Pourcentages', () => {
  assert.equal(F.pctPart({ p: '20', v: '100' }).raw.r, 20);
  assert.equal(F.pctPart({ p: '12,5', v: '80' }).raw.r, 10);
  assert.equal(F.pctRatio({ a: '25', b: '200' }).raw.r, 12.5);
  assert.equal(F.pctBase({ a: '30', p: '15' }).raw.r, 200);
  near(F.pctIncrease({ v: '200', p: '10' }).raw.fin, 220);
  near(F.pctDecrease({ v: '200', p: '25' }).raw.fin, 150);
  assert.equal(F.pctChange({ v0: '80', v1: '100' }).raw.r, 25);
  assert.equal(F.pctChange({ v0: '100', v1: '80' }).raw.r, -20);
  assert.ok(F.pctRatio({ a: '1', b: '0' }).error);
  assert.ok(F.pctDecrease({ v: '10', p: '120' }).error);
  assert.ok(F.pctPart({ p: '', v: '5' }).incomplete);
});

test('Règle de trois', () => {
  assert.equal(F.ruleOfThree({ a: '3', b: '12', c: '5' }).raw.x, 20);
  assert.equal(F.ruleOfThreeInv({ a: '4', b: '6', c: '8' }).raw.x, 3);
  assert.ok(F.ruleOfThree({ a: '0', b: '1', c: '1' }).error);
});

test('Moyennes', () => {
  assert.equal(F.mean({ list: '10 12 14' }).raw.avg, 12);
  assert.equal(F.mean({ list: '12,5; 13,5\n14' }).raw.avg, 13.333333333333334);
  assert.ok(F.mean({ list: '10 abc' }).error);
  assert.equal(F.weightedMean({ list: '12 2\n14 3\n9 1' }).raw.avg, (24 + 42 + 9) / 6);
  assert.ok(F.weightedMean({ list: '12' }).error);
});

test('Dates : fins de mois et années bissextiles', () => {
  assert.equal(C.toISO(C.addMonths(C.parseISO('2025-01-31'), 1)), '2025-02-28');
  assert.equal(C.toISO(C.addMonths(C.parseISO('2024-01-31'), 1)), '2024-02-29');
  assert.equal(C.toISO(C.addMonths(C.parseISO('2024-02-29'), 12)), '2025-02-28');
  assert.equal(C.toISO(C.addMonths(C.parseISO('2024-11-30'), 3)), '2025-02-28');
  assert.equal(C.toISO(C.addDays(C.parseISO('2024-02-28'), 1)), '2024-02-29');
  assert.equal(C.toISO(C.addDays(C.parseISO('2023-02-28'), 1)), '2023-03-01');
  assert.equal(C.toISO(C.addDays(C.parseISO('2024-12-31'), 1)), '2025-01-01');
  assert.equal(C.daysInMonth(2024, 1), 29);
  assert.equal(C.daysInMonth(2100, 1), 28);
  assert.equal(C.daysInMonth(2000, 1), 29);
  assert.equal(C.parseISO('2023-02-29'), null);
  assert.equal(C.parseISO('2024-13-01'), null);
});

test('Dates : jours entre deux dates', () => {
  assert.equal(F.daysBetween({ d1: '2024-01-01', d2: '2024-12-31' }).raw.days, 365);
  assert.equal(F.daysBetween({ d1: '2024-01-01', d2: '2025-01-01' }).raw.days, 366);
  assert.equal(F.daysBetween({ d1: '2023-01-01', d2: '2024-01-01' }).raw.days, 365);
  assert.equal(F.daysBetween({ d1: '2024-01-01', d2: '2024-01-10', incl: true }).raw.days, 10);
  // passage à l'heure d'été : toujours 7 jours
  assert.equal(F.daysBetween({ d1: '2025-03-25', d2: '2025-04-01' }).raw.days, 7);
  // dates inversées
  assert.equal(F.daysBetween({ d1: '2024-03-01', d2: '2024-01-01' }).raw.days, 60);
});

test('Dates : années, mois, jours', () => {
  const r = F.durationDates({ d1: '2020-02-29', d2: '2024-03-15' });
  assert.deepEqual([r.raw.years, r.raw.months, r.raw.days], [4, 0, 15]);
  const s = F.durationDates({ d1: '2025-01-31', d2: '2025-03-01' });
  assert.deepEqual([s.raw.years, s.raw.months, s.raw.days], [0, 1, 1]);
  const t = F.durationDates({ d1: '2024-01-15', d2: '2024-02-15' });
  assert.deepEqual([t.raw.months, t.raw.days], [1, 0]);
  const w = F.durationDates({ d1: '2023-12-25', d2: '2025-01-05' });
  assert.deepEqual([w.raw.years, w.raw.months, w.raw.days], [1, 0, 11]);
});

test('Âge', () => {
  const r = F.age({ birth: '1990-05-15', ref: '2025-05-14' });
  assert.deepEqual([r.raw.years, r.raw.months, r.raw.days], [34, 11, 29]);
  const r2 = F.age({ birth: '1990-05-15', ref: '2025-05-15' });
  assert.deepEqual([r2.raw.years, r2.raw.months, r2.raw.days], [35, 0, 0]);
  assert.equal(r2.raw.until, 0);
  const r3 = F.age({ birth: '2000-02-29', ref: '2025-02-28' });
  assert.equal(r3.raw.years, 25); // convention : anniversaire le 28 février les années non bissextiles
  const r4 = F.age({ birth: '2000-02-29', ref: '2024-02-29' });
  assert.equal(r4.raw.years, 24);
  assert.ok(F.age({ birth: '2030-01-01', ref: '2025-01-01' }).error);
});

test('Pâques et jours fériés', () => {
  assert.equal(C.toISO(C.easter(2024)), '2024-03-31');
  assert.equal(C.toISO(C.easter(2025)), '2025-04-20');
  assert.equal(C.toISO(C.easter(2026)), '2026-04-05');
  assert.equal(C.toISO(C.easter(2027)), '2027-03-28');
  assert.equal(C.toISO(C.easter(2000)), '2000-04-23');
  const h = C.holidaysFR(2025).list.map((x) => C.toISO(x.date));
  assert.equal(h.length, 11);
  assert.ok(h.includes('2025-04-21')); // lundi de Pâques
  assert.ok(h.includes('2025-05-29')); // Ascension
  assert.ok(h.includes('2025-06-09')); // lundi de Pentecôte
  const h26 = C.holidaysFR(2026).list.map((x) => C.toISO(x.date));
  assert.ok(h26.includes('2026-04-06') && h26.includes('2026-05-14') && h26.includes('2026-05-25'));
});

test('Jours ouvrés', () => {
  // janvier 2025 : 23 jours lun-ven, moins le 1er janvier férié = 22
  assert.equal(F.businessDays({ d1: '2025-01-01', d2: '2025-01-31', type: 'ouvres', feries: true, incl: true }).raw.counted, 22);
  assert.equal(F.businessDays({ d1: '2025-01-01', d2: '2025-01-31', type: 'ouvres', feries: false, incl: true }).raw.counted, 23);
  // une semaine lundi → dimanche
  assert.equal(F.businessDays({ d1: '2025-03-03', d2: '2025-03-09', type: 'ouvres', feries: true, incl: true }).raw.counted, 5);
  assert.equal(F.businessDays({ d1: '2025-03-03', d2: '2025-03-09', type: 'ouvrables', feries: true, incl: true }).raw.counted, 6);
  // mai 2025 : 1er (jeudi), 8 (jeudi), 29 (Ascension) fériés ; 22 jours lun-ven → 19
  assert.equal(F.businessDays({ d1: '2025-05-01', d2: '2025-05-31', type: 'ouvres', feries: true, incl: true }).raw.counted, 19);
  // exclusif : le jour de départ n'est pas compté
  assert.equal(F.businessDays({ d1: '2025-03-03', d2: '2025-03-07', type: 'ouvres', feries: true, incl: false }).raw.counted, 4);
});

test('Ajout de durées à une date', () => {
  assert.equal(F.dateShift({ start: '2025-01-15', n: 30, unit: 'jours', sign: 1 }).raw.iso, '2025-02-14');
  assert.equal(F.dateShift({ start: '2025-01-15', n: 2, unit: 'semaines', sign: 1 }).raw.iso, '2025-01-29');
  assert.equal(F.dateShift({ start: '2025-01-31', n: 1, unit: 'mois', sign: 1 }).raw.iso, '2025-02-28');
  assert.equal(F.dateShift({ start: '2024-02-29', n: 1, unit: 'annees', sign: 1 }).raw.iso, '2025-02-28');
  assert.equal(F.dateShift({ start: '2025-03-01', n: 1, unit: 'mois', sign: -1 }).raw.iso, '2025-02-01');
  assert.equal(F.dateShift({ start: '2025-03-01', n: 1, unit: 'jours', sign: -1 }).raw.iso, '2025-02-28');
  assert.equal(F.dateShift({ start: '2024-03-01', n: 1, unit: 'jours', sign: -1 }).raw.iso, '2024-02-29');
  // 5 jours ouvrés après le vendredi 2025-04-18 : lundi 21 (Pâques) férié → 22,23,24,25,28
  assert.equal(F.dateShift({ start: '2025-04-18', n: 5, unit: 'ouvres', sign: 1 }).raw.iso, '2025-04-28');
  assert.equal(F.dateShift({ start: '2025-03-07', n: 1, unit: 'ouvres', sign: 1 }).raw.iso, '2025-03-10');
  assert.ok(F.dateShift({ start: '2025-01-01', n: '1,5', unit: 'jours' }).error);
});

test('Compte à rebours', () => {
  assert.equal(F.daysToAnnual({ from: '2025-12-01', month: 12, day: 25, label: 'Noël' }).raw.days, 24);
  assert.equal(F.daysToAnnual({ from: '2025-12-25', month: 12, day: 25, label: 'Noël' }).raw.days, 0);
  assert.equal(F.daysToAnnual({ from: '2025-12-26', month: 12, day: 25, label: 'Noël' }).raw.days, 364);
  assert.equal(F.daysToAnnual({ from: '2027-12-26', month: 12, day: 25, label: 'Noël' }).raw.days, 365); // 2028 bissextile
  assert.equal(F.daysToAnnual({ from: '2024-02-01', month: 3, day: 1, label: 'x' }).raw.days, 29); // février 2024 : 29 jours
  assert.equal(F.daysToAnnual({ from: '2025-12-31', month: 1, day: 1, label: 'le Nouvel An' }).raw.days, 1);
  assert.equal(F.countdown({ from: '2025-01-01', target: '2025-03-01' }).raw.days, 59);
  assert.equal(F.countdown({ from: '2025-03-01', target: '2025-01-01' }).raw.days, -59);
});

test('Semaines ISO', () => {
  assert.equal(C.isoWeek(C.parseISO('2026-01-01')), 1);
  assert.equal(C.isoWeek(C.parseISO('2024-12-30')), 1);
  assert.equal(C.isoWeek(C.parseISO('2021-01-03')), 53);
  assert.equal(C.isoWeek(C.parseISO('2025-06-15')), 24);
  assert.equal(F.weeksBetween({ d1: '2025-01-01', d2: '2025-01-29' }).raw.weeks, 4);
});

test('Salaires', () => {
  const h = F.hourlyFromMonthly({ m: '1823', h: '35' });
  assert.ok(Math.abs(h.raw.hm - 151.6667) < 0.001);
  assert.ok(Math.abs(h.raw.hourly - 12.0198) < 0.001);
  const m = F.monthlyFromHourly({ r: '12', h: '35' });
  assert.ok(Math.abs(m.raw.monthly - 1820) < 0.001);
  const r = F.salaryRaise({ s: '2000', p: '3' });
  assert.equal(r.raw.nw, 2060);
  assert.equal(F.salaryRate({ old: '2000', nw: '2100' }).raw.p, 5);
});

test('Remises', () => {
  assert.equal(F.discount({ price: '80', pct: '25' }).raw.fin, 60);
  assert.equal(F.discount({ price: '80', pct: '25' }).raw.rem, 20);
  const p = F.priceAfter({ price: '100', p1: '20', p2: '10' });
  assert.equal(p.raw.fin, 72);
  near(p.raw.total, 28);
  assert.equal(F.priceAfter({ price: '100', p1: '20', p2: '' }).raw.fin, 80);
});

test('Surfaces et volumes', () => {
  assert.equal(F.area({ shape: 'rect', unit: 'm', long: '5', larg: '4' }).raw.m2, 20);
  assert.equal(F.area({ shape: 'rect', unit: 'cm', long: '200', larg: '100' }).raw.m2, 2);
  assert.equal(F.area({ shape: 'triangle', unit: 'm', base: '6', haut: '4' }).raw.a, 12);
  assert.equal(F.area({ shape: 'trapeze', unit: 'm', gb: '10', pb: '6', ht: '4' }).raw.a, 32);
  assert.ok(Math.abs(F.area({ shape: 'cercle', unit: 'm', rayon: '2' }).raw.a - 12.566370614) < 1e-8);
  assert.equal(F.volume({ shape: 'pave', unit: 'm', long: '2', larg: '3', haut: '4' }).raw.litres, 24000);
  near(F.volume({ shape: 'cube', unit: 'cm', cote: '10' }).raw.litres, 1);
  assert.ok(Math.abs(F.volume({ shape: 'sphere', unit: 'm', rayon: '1' }).raw.m3 - 4.18879) < 1e-5);
  assert.ok(Math.abs(F.volume({ shape: 'cylindre', unit: 'm', rayon: '1', haut: '2' }).raw.m3 - 6.283185) < 1e-5);
  assert.ok(Math.abs(F.volume({ shape: 'cone', unit: 'm', rayon: '3', haut: '4' }).raw.m3 - 37.699112) < 1e-5);
});

test('Pente', () => {
  assert.equal(F.slope({ h: '0,5', l: '10' }).raw.pct, 5);
  assert.equal(F.slope({ h: '1', l: '1' }).main.value.replace(/\s/g, ' '), '100 %');
  assert.equal(F.slopeHeight({ pct: '8', l: '5' }).raw.h, 0.4);
  assert.ok(F.slope({ h: '1', l: '0' }).error);
});

test('Peinture', () => {
  const r = F.paint({ long: '4', larg: '3', haut: '2,5', ouv: '4', couches: '2', rend: '10', plafond: 'non' });
  assert.equal(r.raw.walls, 35);
  assert.equal(r.raw.surf, 31);
  assert.ok(Math.abs(r.raw.net - 6.2) < 1e-9);
  assert.ok(Math.abs(r.raw.safe - 6.82) < 1e-9);
  assert.equal(r.raw.pots, 3);
  const p = F.paint({ long: '4', larg: '3', haut: '2,5', ouv: '4', couches: '2', rend: '10', plafond: 'oui' });
  assert.equal(p.raw.surf, 43);
  assert.ok(F.paint({ long: '1', larg: '1', haut: '1', ouv: '50', couches: '2', rend: '10' }).error);
});

test('Carrelage, parquet, plinthes', () => {
  // 20 m², carreaux 60×60 sans joint = 0,36 m² → 55,55 → 56 nets ; +10 % → 61,11 → 62
  const t = F.tiles({ long: '5', larg: '4', cl: '60', cw: '60', joint: '0', marge: '10', boite: '1,44' });
  assert.equal(t.raw.netN, 56);
  assert.equal(t.raw.withN, 62);
  // carreaux 30x30 + joint 3 mm
  const t2 = F.tiles({ long: '2', larg: '2', cl: '30', cw: '30', joint: '3', marge: '10' });
  assert.equal(t2.raw.netN, Math.ceil(4 / (0.303 * 0.303) - 1e-9));
  const f = F.flooring({ long: '5', larg: '4', marge: '10', paquet: '2,2' });
  assert.equal(f.raw.need, 22);
  assert.equal(f.raw.packs, 10);
  const s = F.skirting({ long: '4', larg: '3', portes: '1,8', lg: '2,4', marge: '10' });
  assert.equal(s.raw.per, 14);
  assert.equal(s.raw.net, 12.2);
  assert.equal(s.raw.n, 6); // 12,2 × 1,1 = 13,42 → 5,59 → 6
});

test('Béton, gravier, sable', () => {
  const b = F.concrete({ long: '4', larg: '3', ep: '10', marge: '10' });
  assert.ok(Math.abs(b.raw.vol - 1.2) < 1e-9);
  assert.ok(Math.abs(b.raw.volM - 1.32) < 1e-9);
  assert.ok(Math.abs(b.raw.ciment - 462) < 1e-9);
  const g = F.aggregate({ material: 'gravier', long: '10', larg: '2', ep: '5', dens: '1,5', marge: '10' });
  assert.ok(Math.abs(g.raw.vol - 1) < 1e-9);
  assert.ok(Math.abs(g.raw.t - 1.65) < 1e-9);
});

test('Conversions', () => {
  assert.equal(F.convert({ value: '1', factor: 2.54, from: 'pouce', to: 'cm' }).raw.r, 2.54);
  assert.ok(Math.abs(F.convert({ value: '10', factor: 0.45359237, from: 'lb', to: 'kg' }).raw.r - 4.5359237) < 1e-9);
  assert.ok(Math.abs(F.convert({ value: '100', factor: 1.609344, from: 'mph', to: 'km/h' }).raw.r - 160.9344) < 1e-9);
  assert.equal(F.convert({ value: '2', factor: 10000, from: 'm²', to: 'cm²' }).raw.r, 20000);
  assert.equal(F.convertTemp({ value: '100', kind: 'c2f' }).raw.r, 212);
  assert.equal(F.convertTemp({ value: '0', kind: 'c2f' }).raw.r, 32);
  assert.equal(F.convertTemp({ value: '-40', kind: 'c2f' }).raw.r, -40);
  assert.equal(F.convertTemp({ value: '212', kind: 'f2c' }).raw.r, 100);
  assert.ok(F.convertTemp({ value: '-300', kind: 'c2f' }).error);
  assert.ok(Math.abs(F.gallons({ value: '10', type: 'us', dir: 'l2g' }).raw.r - 2.641720524) < 1e-8);
  assert.ok(Math.abs(F.gallons({ value: '1', type: 'uk', dir: 'g2l' }).raw.r - 4.54609) < 1e-12);
});

test('Formats français', () => {
  assert.equal(clean(C.fmt(1234.5)), '1 234,5');
  assert.equal(clean(C.eur(1234.5)), '1 234,50 €');
  assert.equal(C.fmt(-0.001, 2), '0');
  assert.equal(C.round(1.005, 2), 1.01);
  assert.equal(C.round(2.675, 2), 2.68);
  assert.equal(C.dateLong(C.parseISO('2027-01-01')), 'vendredi 1er janvier 2027');
  assert.equal(C.dateLong(C.parseISO('2025-12-25')), 'jeudi 25 décembre 2025');
});
