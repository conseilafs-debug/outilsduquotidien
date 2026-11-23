// Fabriques de champs de formulaire. Un « bloc » = un petit formulaire avec sa fonction de calcul.

/** Champ numérique (saisie texte, clavier décimal sur mobile). */
export const n = (id, label, def, o = {}) => ({ id, label, type: 'number', default: def, ...o });
/** Liste déroulante. options : ['a','b'] ou [{v,label}] */
export const s = (id, label, options, def, o = {}) => ({
  id, label, type: 'select', default: def,
  options: options.map((x) => (typeof x === 'string' ? { v: x, label: x } : x)), ...o,
});
/** Date. def : 'today' ou 'AAAA-MM-JJ'. */
export const d = (id, label, def, o = {}) => ({ id, label, type: 'date', default: def, ...o });
export const c = (id, label, def, o = {}) => ({ id, label, type: 'checkbox', default: !!def, ...o });
export const t = (id, label, def, o = {}) => ({ id, label, type: 'textarea', default: def, rows: 5, ...o });

export const RATES = [
  { v: '20', label: '20 % (taux normal)' },
  { v: '10', label: '10 % (taux intermédiaire)' },
  { v: '5.5', label: '5,5 % (taux réduit)' },
  { v: '2.1', label: '2,1 % (taux super-réduit)' },
  { v: 'custom', label: 'Autre taux…' },
];
export const rateFields = () => [
  s('rate', 'Taux de TVA', RATES, '20'),
  n('custom', 'Taux personnalisé', '8.5', { unit: '%', when: { rate: ['custom'] } }),
];
export const UNITS = [{ v: 'm', label: 'mètres (m)' }, { v: 'cm', label: 'centimètres (cm)' }, { v: 'mm', label: 'millimètres (mm)' }];
export const POSE_OPTIONS = [
  { v: '5', label: '5 % — pose droite, pièce simple' },
  { v: '10', label: '10 % — cas courant, quelques découpes' },
  { v: '15', label: '15 % — pose en diagonale ou pièce complexe' },
];
