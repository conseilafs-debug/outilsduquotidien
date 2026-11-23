// Recherche interne côté client (index JSON chargé à la première interaction) + bouton de paramétrage des cookies.
(() => {
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9% ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const stem = (t) => (t.length > 3 ? t.replace(/[sx]$/, '') : t);

  const cookieBtn = document.getElementById('cookie-settings');
  if (cookieBtn) cookieBtn.addEventListener('click', () => { try { window.googlefc && window.googlefc.showRevocationMessage && window.googlefc.showRevocationMessage(); } catch { /* ignoré */ } });

  const form = document.querySelector('[data-search]');
  if (!form) return;
  const input = form.querySelector('input[type="search"]');
  const list = form.querySelector('.search-results');
  const status = form.querySelector('[role="status"]');
  let index = null, loading = null, items = [], active = -1;

  const load = () => {
    if (!loading) loading = fetch(form.dataset.index).then((r) => r.json()).then((j) => { index = j.map((e) => ({ ...e, n: norm(e.t), kw: norm(e.k) })); return index; }).catch(() => { loading = null; return []; });
    return loading;
  };

  function search(q) {
    const terms = norm(q).split(' ').filter(Boolean).map(stem);
    if (!terms.length || !index) return [];
    const scored = [];
    for (const e of index) {
      let score = 0, ok = true;
      for (const t of terms) {
        if (e.n.split(' ').some((w) => w.startsWith(t))) score += 10;
        else if (e.n.includes(t)) score += 6;
        else if (e.kw.includes(t)) score += 3;
        else if (e.u.includes(t)) score += 2;
        else { ok = false; break; }
      }
      if (ok) scored.push({ e, score });
    }
    scored.sort((a, b) => b.score - a.score);
    const res = scored.slice(0, 6).map((x) => ({ ...x.e, rel: false }));
    if (res.length) {
      for (const u of res[0].r || []) {
        if (res.length >= 9) break;
        const o = index.find((x) => x.u === u);
        if (o && !res.some((x) => x.u === u)) res.push({ ...o, rel: true });
      }
    }
    return res;
  }

  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  function close() { list.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); active = -1; }
  function setActive(i) {
    const opts = list.querySelectorAll('[role="option"]');
    opts.forEach((o, k) => o.setAttribute('aria-selected', String(k === i)));
    active = i;
    if (i >= 0 && opts[i]) { input.setAttribute('aria-activedescendant', opts[i].id); opts[i].scrollIntoView({ block: 'nearest' }); } else input.removeAttribute('aria-activedescendant');
  }
  function render() {
    const q = input.value;
    if (!norm(q)) { close(); return; }
    items = search(q);
    if (!items.length) {
      list.innerHTML = `<li class="empty">Aucun outil trouvé pour « ${esc(q)} ».</li>`;
      status.textContent = 'Aucun résultat';
    } else {
      const firstRel = items.findIndex((x) => x.rel);
      list.innerHTML = items.map((x, i) => `${i === firstRel ? '<li class="sep" role="presentation">Outils liés</li>' : ''}<li role="option" id="${input.id}-o${i}" aria-selected="false"><a href="${x.u}"><span>${esc(x.t)}</span><small>${esc(x.c)}</small></a></li>`).join('');
      status.textContent = `${items.length} résultat${items.length > 1 ? 's' : ''}`;
    }
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    active = -1;
  }

  input.addEventListener('focus', load);
  input.addEventListener('input', () => { load().then(render); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { close(); return; }
    if (list.hidden) return;
    const n = list.querySelectorAll('[role="option"]').length;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1 >= n ? 0 : active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active <= 0 ? n - 1 : active - 1); }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const target = active >= 0 ? items[active] : items[0];
    if (target) location.href = target.u;
    else load().then(() => { items = search(input.value); if (items[0]) location.href = items[0].u; else render(); });
  });
  document.addEventListener('click', (e) => { if (!form.contains(e.target)) close(); });
  form.addEventListener('focusout', () => setTimeout(() => { if (!form.contains(document.activeElement)) close(); }, 120));
})();
