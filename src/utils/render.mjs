// Rendu HTML d'un résultat de calcul. Partagé entre le pré-rendu (build) et le navigateur.

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function renderResult(r, placeholder = 'Renseignez les valeurs ci-dessus pour afficher le résultat.') {
  if (!r || r.incomplete) return `<p class="result-empty">${esc(placeholder)}</p>`;
  if (r.error) return `<p class="result-error" role="alert">${esc(r.error)}</p>`;
  const rows = (r.rows || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
  return (
    `<p class="result-label">${esc(r.main.label)}</p>` +
    `<p class="result-value">${esc(r.main.value)}</p>` +
    (rows ? `<dl class="result-rows">${rows}</dl>` : '') +
    (r.note ? `<p class="result-note">${esc(r.note)}</p>` : '')
  );
}
