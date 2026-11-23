// Interactivité des calculateurs : lecture du formulaire, calcul, affichage du résultat.
import { FUNCTIONS, todayISO } from '../utils/calc.mjs';
import { renderResult } from '../utils/render.mjs';

function init(form) {
  const fn = FUNCTIONS[form.dataset.fn];
  if (!fn) return;
  let params = {};
  try { params = JSON.parse(form.dataset.params || '{}'); } catch { /* ignoré */ }
  const out = form.querySelector('.result');
  const fields = [...form.querySelectorAll('.field')];
  const hasToday = !!form.querySelector('[data-default="today"]');
  const placeholder = hasToday ? 'Le résultat s’affiche ici dès que les dates sont renseignées.' : undefined;

  const control = (name) => form.elements[name];
  const valueOf = (el) => (el.type === 'checkbox' ? el.checked : el.value);

  function applyVisibility() {
    for (const f of fields) {
      if (!f.dataset.when) continue;
      let cond = {};
      try { cond = JSON.parse(f.dataset.when); } catch { continue; }
      const ok = Object.entries(cond).every(([k, vals]) => { const c = control(k); return c && vals.includes(String(valueOf(c.tagName ? c : c[0]))); });
      f.hidden = !ok;
    }
  }
  function read() {
    const v = { ...params };
    for (const f of fields) {
      if (f.hidden) continue;
      const el = f.querySelector('input,select,textarea');
      if (el) v[el.name] = valueOf(el);
    }
    return v;
  }
  function update() {
    applyVisibility();
    let r;
    try { r = fn(read()); } catch (e) { r = { error: 'Un calcul n’a pas pu être effectué avec ces valeurs.' }; }
    out.innerHTML = renderResult(r, placeholder);
  }
  function fillToday() {
    form.querySelectorAll('input[data-default="today"]').forEach((i) => { if (!i.value) i.value = todayISO(); });
  }

  let timer;
  const later = () => { clearTimeout(timer); timer = setTimeout(update, 120); };
  form.addEventListener('input', later);
  form.addEventListener('change', update);
  form.addEventListener('submit', (e) => { e.preventDefault(); update(); out.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); });
  form.addEventListener('reset', () => setTimeout(() => { fillToday(); update(); }, 0));

  fillToday();
  update();
}

document.querySelectorAll('form.calc').forEach(init);
