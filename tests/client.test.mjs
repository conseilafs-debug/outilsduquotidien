// Test du code client sur le HTML généré (nécessite « npm run build » au préalable).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const asset = (re) => readdirSync(join(DIST, 'assets')).find((f) => re.test(f));

function open(path) {
  const html = readFileSync(join(DIST, path, 'index.html'), 'utf8').replace(/<script[^>]*src=[^>]*><\/script>/g, '');
  const dom = new JSDOM(html, { url: 'https://example.test' + path, runScripts: 'outside-only', pretendToBeVisual: true });
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  dom.window.fetch = async (u) => ({ ok: true, json: async () => JSON.parse(readFileSync(join(DIST, u), 'utf8')) });
  for (const re of [/^site-.*\.js$/, /^tool-.*\.js$/]) {
    const f = asset(re);
    if (f && (re.source.includes('site') || dom.window.document.querySelector('form.calc'))) dom.window.eval(readFileSync(join(DIST, 'assets', f), 'utf8'));
  }
  return dom.window;
}
const type = (w, el, value, ev = 'input') => { el.value = value; el.dispatchEvent(new w.Event(ev, { bubbles: true })); };
const wait = (ms = 200) => new Promise((r) => setTimeout(r, ms));
const val = (w) => w.document.querySelector('.result-value').textContent.replace(/\s/g, ' ').trim();

test('TVA : 20 € HT à 20 % = 24 € TTC, puis 120 € TTC = 100 € HT', async () => {
  const w = open('/calculateur-tva/');
  assert.match(val(w), /24,00/);
  const f = w.document.querySelector('form.calc');
  type(w, f.elements.amount, '120'); type(w, f.elements.mode, 'ttc', 'change');
  await wait();
  assert.match(w.document.querySelector('.result').textContent, /100,00/);
});

test('Taux personnalisé : champ masqué puis affiché', async () => {
  const w = open('/calculateur-tva/');
  const f = w.document.querySelector('form.calc');
  const field = f.elements.custom.closest('.field');
  assert.equal(field.hidden, true);
  type(w, f.elements.rate, 'custom', 'change');
  assert.equal(field.hidden, false);
});

test('Saisie à virgule française et saisie invalide', async () => {
  const w = open('/calculateur-tva/');
  const f = w.document.querySelector('form.calc');
  type(w, f.elements.amount, '19,99', 'change');
  assert.match(w.document.querySelector('.result').textContent, /23,99/);
  type(w, f.elements.amount, 'abc', 'change');
  assert.doesNotMatch(w.document.querySelector('.result').textContent, /NaN|undefined/);
});

test('Convertisseur : 1 pouce = 2,54 cm', async () => {
  const w = open('/convertisseur-pouces-cm/');
  const f = w.document.querySelector('form.calc');
  type(w, f.querySelector('input'), '1', 'change');
  assert.match(val(w), /2,54/);
});

test('Date du jour appliquée par défaut côté client', async () => {
  const w = open('/calculateur-age/');
  const today = w.document.querySelector('input[data-default="today"]');
  assert.ok(today, 'champ date par défaut = aujourd’hui');
  assert.match(today.value, /^\d{4}-\d{2}-\d{2}$/);
});

test('Réinitialiser restaure les valeurs par défaut', async () => {
  const w = open('/calculateur-tva/');
  const f = w.document.querySelector('form.calc');
  type(w, f.elements.amount, '500', 'change');
  f.reset();
  await wait(50);
  assert.match(val(w), /24,00/);
});

test('Recherche : « peinture » propose aussi surface, volume, carrelage', async () => {
  const w = open('/');
  const input = w.document.querySelector('#hero-search');
  type(w, input, 'peinture');
  await wait(400);
  const items = [...w.document.querySelectorAll('#hero-search-list li')].map((l) => l.textContent);
  assert.ok(items.length > 0, 'résultats affichés');
  assert.match(items[0], /peinture/i);
  const all = items.join(' ').toLowerCase();
  for (const k of ['surface', 'carrelage']) assert.ok(all.includes(k), `suggère ${k}`);
});

test('Recherche insensible aux accents', async () => {
  const w = open('/');
  type(w, w.document.querySelector('#hero-search'), 'beton');
  await wait(400);
  assert.match([...w.document.querySelectorAll('#hero-search-list li')].map((l) => l.textContent).join(' '), /béton/i);
});

test('Aucun code publicitaire sans identifiant AdSense', () => {
  const html = readFileSync(join(DIST, 'index.html'), 'utf8');
  assert.doesNotMatch(html, /adsbygoogle|pagead2|googletagmanager/);
});
