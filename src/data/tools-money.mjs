import { FUNCTIONS as F, fmt, eur } from '../utils/calc.mjs';
import { n, s, rateFields } from './fields.mjs';

const CAT = 'calculateurs';
const SUB = 'Argent';
const RATES_TABLE = {
  caption: 'Les taux de TVA en France métropolitaine',
  head: ['Taux', 'Principaux exemples'],
  rows: [
    ['20 %', 'Taux normal : la plupart des biens et services (électronique, vêtements, meubles, coiffeur…)'],
    ['10 %', 'Taux intermédiaire : restauration sur place, transports de voyageurs, travaux de rénovation dans un logement ancien, hébergement'],
    ['5,5 %', 'Taux réduit : produits alimentaires, livres, certains travaux d’amélioration énergétique, équipements pour personnes handicapées'],
    ['2,1 %', 'Taux super-réduit : médicaments remboursables par la Sécurité sociale, presse'],
  ],
};
const RATE_NOTE = 'Les taux indiqués sont ceux en vigueur en France métropolitaine à la date de rédaction. Vérifiez-les sur impots.gouv.fr avant toute facturation.';

export const moneyTools = [
  /* 12 */
  {
    slug: 'calculateur-tva', cat: CAT, sub: SUB, popular: true,
    name: 'Calculateur de TVA',
    short: 'Calculer la TVA, le prix HT ou TTC à partir d’un montant.',
    h1: 'Calculateur de TVA : montant HT, TVA et TTC en un clic',
    metaTitle: 'Calculateur de TVA : HT, TTC et montant de TVA',
    metaDesc: 'Calculez la TVA, le prix HT ou TTC avec les taux français (20 %, 10 %, 5,5 %, 2,1 %) ou un taux personnalisé. Résultat détaillé et formules.',
    keywords: ['tva', 'taxe', 'ht', 'ttc', 'hors taxes', 'montant tva', 'taux tva', 'prix ttc'],
    intro: [
      'Facture, devis, prix de vente : le calculateur de TVA vous donne en une seule opération le <strong>montant hors taxes (HT)</strong>, le <strong>montant de la TVA</strong> et le <strong>prix toutes taxes comprises (TTC)</strong>.',
      'Choisissez si vous partez d’un montant HT ou d’un montant TTC, sélectionnez le taux (20 %, 10 %, 5,5 %, 2,1 % ou un taux personnalisé) et lisez le résultat.',
    ],
    blocks: [{ id: 'tva', fn: 'tva', fields: [n('amount', 'Montant', '20', { unit: '€' }), s('mode', 'Le montant saisi est', [{ v: 'ht', label: 'Hors taxes (HT)' }, { v: 'ttc', label: 'Toutes taxes comprises (TTC)' }], 'ht'), ...rateFields()] }],
    how: [
      '<strong>Du HT au TTC :</strong> TVA = HT × taux ÷ 100, puis TTC = HT + TVA. Cela revient à multiplier le HT par (1 + taux ÷ 100), soit 1,20 au taux de 20 %.',
      '<strong>Du TTC au HT :</strong> HT = TTC ÷ (1 + taux ÷ 100), puis TVA = TTC − HT. Attention : on divise par 1,20 et non l’on retire 20 % du TTC, car la TVA est calculée sur le prix HT.',
      'Les montants sont arrondis au centime, comme sur une facture.',
    ],
    example: () => {
      const a = F.tva({ amount: 20, mode: 'ht', rate: '20' }).raw, b = F.tva({ amount: 120, mode: 'ttc', rate: '20' }).raw, c = F.tva({ amount: 59, mode: 'ttc', rate: '5.5' }).raw;
      return `<p>Un article à 20 € HT avec une TVA de 20 % : TVA = ${eur(a.tva)}, prix TTC = <strong>${eur(a.ttc)}</strong>. Dans l’autre sens, 120 € TTC correspondent à 120 ÷ 1,20 = <strong>${eur(b.ht)} HT</strong> (TVA de ${eur(b.tva)}). Pour un prix TTC de 59 € à 5,5 %, le prix HT est ${eur(c.ht)}.</p>`;
    },
    table: () => [RATES_TABLE, {
      caption: 'Conversion rapide au taux de 20 %',
      head: ['Prix HT', 'TVA (20 %)', 'Prix TTC'],
      rows: [10, 50, 100, 250, 500, 1000].map((ht) => { const r = F.tva({ amount: ht, mode: 'ht', rate: '20' }).raw; return [eur(r.ht), eur(r.tva), eur(r.ttc)]; }),
    }],
    tips: [
      'Pour passer rapidement de HT à TTC à 20 %, multipliez par 1,2. Pour l’inverse, divisez par 1,2.',
      'Les micro-entrepreneurs bénéficiant de la franchise en base de TVA ne facturent pas la TVA et doivent le mentionner sur leurs factures.',
      RATE_NOTE,
    ],
    faq: [
      ['Comment calculer la TVA à 20 % ?', 'Multipliez le prix HT par 0,20 pour obtenir le montant de TVA, puis ajoutez-le au HT. Pour 50 € HT : TVA 10 €, TTC 60 €.'],
      ['Comment retrouver le prix HT à partir du TTC ?', 'Divisez le prix TTC par 1,20 (taux de 20 %), par 1,10 (10 %), par 1,055 (5,5 %) ou par 1,021 (2,1 %).'],
      ['Quelle est la différence entre HT et TTC ?', 'HT signifie hors taxes : le prix avant TVA. TTC signifie toutes taxes comprises : le prix payé par le consommateur final, TVA incluse.'],
      ['Quels taux de TVA existent en France ?', 'Quatre taux en métropole : 20 %, 10 %, 5,5 % et 2,1 %. Des taux spécifiques existent en Corse et dans les départements d’outre-mer : utilisez alors « Autre taux ».'],
    ],
    related: ['calculateur-ht-vers-ttc', 'calculateur-ttc-vers-ht', 'calculateur-remise', 'calculateur-pourcentage'],
  },

  /* 13 */
  {
    slug: 'calculateur-ht-vers-ttc', cat: CAT, sub: SUB,
    name: 'Calculateur HT vers TTC',
    short: 'Convertir un prix hors taxes en prix TTC.',
    h1: 'Calculateur HT vers TTC : convertissez un prix hors taxes en TTC',
    metaTitle: 'Calculateur HT vers TTC : passer du hors taxes au TTC',
    metaDesc: 'Convertissez un prix HT en TTC en appliquant la TVA (20 %, 10 %, 5,5 %, 2,1 % ou taux libre). Montant de TVA et formule affichés.',
    keywords: ['ht vers ttc', 'hors taxes', 'convertir ht en ttc', 'prix ttc', 'ajouter tva', 'ht ttc'],
    intro: [
      'Vous avez un prix hors taxes (devis, tarif fournisseur, facture) et vous voulez connaître le prix que paiera le client ? Saisissez le montant HT et le taux de TVA : le calculateur ajoute la taxe et affiche le <strong>prix TTC</strong>.',
    ],
    blocks: [{ id: 'httc', fn: 'tva', params: { mode: 'ht' }, fields: [n('amount', 'Montant hors taxes (HT)', '250', { unit: '€' }), ...rateFields()] }],
    how: [
      'Prix TTC = prix HT × (1 + taux de TVA ÷ 100). Au taux de 20 %, on multiplie par 1,20 ; à 10 %, par 1,10 ; à 5,5 %, par 1,055 ; à 2,1 %, par 1,021.',
      'Le montant de TVA est arrondi au centime, puis ajouté au prix HT.',
    ],
    example: () => {
      const a = F.tva({ amount: 250, mode: 'ht', rate: '20' }).raw, b = F.tva({ amount: 250, mode: 'ht', rate: '10' }).raw;
      return `<p>Un devis de 250 € HT en travaux de rénovation soumis à 10 % de TVA donne ${eur(b.ttc)} TTC. Le même montant à 20 % donne <strong>${eur(a.ttc)} TTC</strong>, dont ${eur(a.tva)} de TVA.</p>`;
    },
    table: () => ({
      caption: 'Un même prix HT selon le taux de TVA',
      head: ['Prix HT', 'TTC à 20 %', 'TTC à 10 %', 'TTC à 5,5 %'],
      rows: [50, 100, 250, 500, 1000, 2500].map((ht) => [eur(ht), ...['20', '10', '5.5'].map((r) => eur(F.tva({ amount: ht, mode: 'ht', rate: r }).raw.ttc))]),
    }),
    tips: [
      'Sur une facture, affichez toujours le montant HT, le taux et le montant de TVA, puis le total TTC.',
      'Quand plusieurs lignes ont des taux différents, calculez la TVA par taux avant d’additionner les totaux.',
      'Pour vérifier un prix TTC affiché en magasin, utilisez le calculateur TTC vers HT.',
    ],
    faq: [
      ['Comment passer du HT au TTC ?', 'Multipliez le prix HT par 1 plus le taux de TVA. À 20 %, 100 € HT donnent 100 × 1,20 = 120 € TTC.'],
      ['Comment calculer uniquement le montant de la TVA ?', 'Multipliez le prix HT par le taux : 100 € HT à 20 % donnent 20 € de TVA. Le détail du résultat l’affiche directement.'],
      ['Quel taux de TVA appliquer ?', 'Le taux dépend de la nature du bien ou du service. Le taux normal est 20 % ; les autres taux sont réservés à des catégories précises (alimentation, restauration, rénovation, etc.).'],
      ['Le résultat est-il arrondi ?', 'Oui, au centime d’euro, comme dans la comptabilité courante.'],
    ],
    related: ['calculateur-ttc-vers-ht', 'calculateur-tva', 'calculateur-remise', 'calculateur-prix-apres-reduction'],
  },

  /* 14 */
  {
    slug: 'calculateur-ttc-vers-ht', cat: CAT, sub: SUB,
    name: 'Calculateur TTC vers HT',
    short: 'Retrouver le prix hors taxes à partir d’un prix TTC.',
    h1: 'Calculateur TTC vers HT : retrouvez le prix hors taxes',
    metaTitle: 'Calculateur TTC vers HT : retrouver le prix hors taxes',
    metaDesc: 'Retrouvez le prix HT et le montant de TVA à partir d’un prix TTC, avec les taux français ou un taux personnalisé. Formule et exemples inclus.',
    keywords: ['ttc vers ht', 'enlever tva', 'retirer tva', 'prix hors taxes', 'calcul ht', 'ttc ht'],
    intro: [
      'À partir d’un prix affiché TTC (ticket de caisse, étiquette, facture), ce calculateur retrouve le <strong>prix hors taxes</strong> et le <strong>montant de TVA</strong> inclus. Pratique pour une note de frais, une déclaration ou une comparaison entre professionnels.',
    ],
    blocks: [{ id: 'ttcht', fn: 'tva', params: { mode: 'ttc' }, fields: [n('amount', 'Montant toutes taxes comprises (TTC)', '120', { unit: '€' }), ...rateFields()] }],
    how: [
      'Prix HT = prix TTC ÷ (1 + taux de TVA ÷ 100). Au taux de 20 %, on divise par 1,20. Le montant de TVA est ensuite TTC − HT.',
      'Erreur fréquente : retirer 20 % du prix TTC. Sur 120 €, cela donnerait 96 €, alors que le vrai prix HT est 100 € : la TVA de 20 € représente 16,67 % du TTC.',
    ],
    example: () => {
      const a = F.tva({ amount: 120, mode: 'ttc', rate: '20' }).raw, b = F.tva({ amount: 21.1, mode: 'ttc', rate: '5.5' }).raw;
      return `<p>Un repas au restaurant à 55 € TTC (TVA de 10 %) vaut ${eur(F.tva({ amount: 55, mode: 'ttc', rate: '10' }).raw.ht)} HT. Pour 120 € TTC à 20 %, le prix HT est <strong>${eur(a.ht)}</strong> et la TVA <strong>${eur(a.tva)}</strong>. Un livre à 21,10 € TTC (5,5 %) coûte ${eur(b.ht)} HT.</p>`;
    },
    table: () => ({
      caption: 'Un même prix TTC selon le taux de TVA (prix HT correspondant)',
      head: ['Prix TTC', 'HT à 20 %', 'HT à 10 %', 'HT à 5,5 %'],
      rows: [50, 100, 250, 500, 1000, 2500].map((ttc) => [eur(ttc), ...['20', '10', '5.5'].map((r) => eur(F.tva({ amount: ttc, mode: 'ttc', rate: r }).raw.ht))]),
    }),
    tips: [
      'Pour une note de frais, conservez le justificatif et notez séparément le HT et la TVA récupérable le cas échéant.',
      'Arrondi : si plusieurs articles ont le même taux, calculez la TVA sur le total plutôt que ligne par ligne, pour limiter les écarts de centimes.',
      'Pour ajouter la TVA à un prix HT, utilisez le calculateur HT vers TTC.',
    ],
    faq: [
      ['Comment enlever la TVA d’un prix TTC ?', 'Divisez le prix TTC par 1,20 pour un taux de 20 %. 240 € TTC donnent 200 € HT et 40 € de TVA.'],
      ['Pourquoi ne suffit-il pas de retirer 20 % ?', 'Parce que la TVA se calcule sur le prix HT, pas sur le TTC. 20 % du TTC est supérieur au vrai montant de TVA.'],
      ['Comment connaître le taux de TVA d’un produit ?', 'Il est parfois indiqué sur la facture ou le ticket. À défaut, vérifiez la catégorie du produit sur le site de l’administration fiscale (impots.gouv.fr).'],
      ['Puis-je utiliser le calculateur pour une TVA étrangère ?', 'Oui, avec l’option « Autre taux », saisissez le taux du pays concerné.'],
    ],
    related: ['calculateur-ht-vers-ttc', 'calculateur-tva', 'calculateur-pourcentage', 'calculateur-remise'],
  },

  /* 15 */
  {
    slug: 'calculateur-salaire-horaire', cat: CAT, sub: SUB,
    name: 'Calculateur de salaire horaire',
    short: 'Convertir un salaire mensuel en taux horaire.',
    h1: 'Calculateur de salaire horaire : quel taux horaire pour votre salaire ?',
    metaTitle: 'Calculateur de salaire horaire à partir du mensuel',
    metaDesc: 'Convertissez un salaire mensuel en salaire horaire selon votre durée hebdomadaire (35 h, 39 h…). Heures par mois, salaire hebdomadaire et annuel inclus.',
    keywords: ['salaire horaire', 'taux horaire', 'salaire mensuel en horaire', 'salaire par heure', '35 heures', 'heures par mois'],
    intro: [
      'Pour comparer deux offres, chiffrer un devis ou vérifier un bulletin de paie, il est utile de connaître son <strong>taux horaire</strong>. Saisissez votre salaire mensuel et votre durée hebdomadaire de travail : le calculateur en déduit le salaire par heure.',
    ],
    blocks: [{ id: 'horaire', fn: 'hourlyFromMonthly', fields: [n('m', 'Salaire mensuel', '1800', { unit: '€' }), n('h', 'Durée de travail par semaine', '35', { unit: 'h' })] }],
    how: [
      'Le nombre moyen d’heures par mois est égal à la durée hebdomadaire × 52 ÷ 12. Pour 35 heures par semaine : 35 × 52 ÷ 12 = 151,67 heures, valeur retenue sur les bulletins de paie.',
      'Salaire horaire = salaire mensuel ÷ heures mensuelles. Le résultat est un montant brut ou net, selon la nature du salaire saisi : le calculateur ne fait aucune conversion entre les deux.',
    ],
    example: () => {
      const r = F.hourlyFromMonthly({ m: 1800, h: 35 }).raw;
      return `<p>Pour 1 800 € par mois sur une base de 35 heures hebdomadaires : 151,67 heures par mois, soit 1 800 ÷ 151,67 = <strong>${eur(r.hourly)} de l’heure</strong>.</p>`;
    },
    table: () => ({
      caption: 'Salaire horaire pour 35 heures par semaine (151,67 h par mois)',
      head: ['Salaire mensuel', 'Salaire horaire', 'Salaire annuel (12 mois)'],
      rows: [1500, 1800, 2000, 2500, 3000, 4000].map((m) => [eur(m), eur(F.hourlyFromMonthly({ m, h: 35 }).raw.hourly), eur(m * 12)]),
    }),
    tips: [
      'Brut ou net : saisissez un salaire brut pour obtenir un taux horaire brut, un net pour un taux horaire net.',
      'Pour un temps partiel, indiquez les heures réellement travaillées par semaine (par exemple 28 h).',
      'Pour le calcul inverse, utilisez le calculateur de salaire mensuel.',
    ],
    faq: [
      ['Comment calculer un salaire horaire à partir du mensuel ?', 'Divisez le salaire mensuel par le nombre d’heures mensuelles. À 35 h par semaine, on retient 151,67 heures par mois.'],
      ['D’où vient le chiffre de 151,67 heures ?', 'Il correspond à 35 h × 52 semaines ÷ 12 mois, la durée légale hebdomadaire lissée sur l’année.'],
      ['Que mettre pour 39 heures par semaine ?', 'Saisissez 39 dans la durée hebdomadaire : le mensuel correspond alors à 169 heures environ. Les heures supplémentaires peuvent obéir à des règles de majoration propres à votre contrat.'],
      ['Le résultat est-il brut ou net ?', 'Du même type que le montant saisi. Le calculateur n’applique aucune cotisation sociale ni aucun impôt.'],
    ],
    related: ['calculateur-salaire-mensuel', 'calculateur-augmentation-salaire', 'calculateur-pourcentage', 'calculateur-regle-de-trois'],
  },

  /* 16 */
  {
    slug: 'calculateur-salaire-mensuel', cat: CAT, sub: SUB,
    name: 'Calculateur de salaire mensuel',
    short: 'Convertir un taux horaire en salaire mensuel et annuel.',
    h1: 'Calculateur de salaire mensuel : du taux horaire au salaire par mois',
    metaTitle: 'Calculateur de salaire mensuel à partir du taux horaire',
    metaDesc: 'Convertissez un taux horaire en salaire mensuel, hebdomadaire et annuel selon vos heures par semaine. Un calcul clair pour comparer des offres.',
    keywords: ['salaire mensuel', 'salaire par mois', 'taux horaire en mensuel', 'horaire vers mensuel', 'salaire annuel'],
    intro: [
      'Un employeur annonce 13 € de l’heure : combien cela fait-il à la fin du mois ? Saisissez votre <strong>taux horaire</strong> et votre durée hebdomadaire, le calculateur affiche le <strong>salaire mensuel</strong> lissé, le salaire hebdomadaire et le salaire annuel.',
    ],
    blocks: [{ id: 'mensuel', fn: 'monthlyFromHourly', fields: [n('r', 'Salaire horaire', '13', { unit: '€' }), n('h', 'Durée de travail par semaine', '35', { unit: 'h' })] }],
    how: [
      'Salaire mensuel = taux horaire × durée hebdomadaire × 52 ÷ 12. Ce lissage donne 151,67 heures par mois pour 35 h par semaine.',
      'Salaire annuel = taux horaire × durée hebdomadaire × 52. Il correspond à 12 mensualités lissées, sans primes ni heures supplémentaires.',
    ],
    example: () => {
      const r = F.monthlyFromHourly({ r: 13, h: 35 }).raw;
      return `<p>À 13 € de l’heure pour 35 heures par semaine : 13 × 151,67 = <strong>${eur(r.monthly)} par mois</strong>, soit ${eur(13 * 35 * 52)} par an.</p>`;
    },
    table: () => ({
      caption: 'Salaire mensuel selon le taux horaire (35 heures par semaine)',
      head: ['Taux horaire', 'Mensuel', 'Annuel'],
      rows: [11, 12, 13, 15, 18, 20, 25, 30].map((r) => [eur(r), eur(F.monthlyFromHourly({ r, h: 35 }).raw.monthly), eur(r * 35 * 52)]),
    }),
    tips: [
      'Vérifiez si le taux annoncé est brut ou net : la conversion de l’un à l’autre dépend de la situation du salarié.',
      'En freelance, un taux horaire équivalent à un salaire doit être majoré pour couvrir charges, congés et périodes sans mission.',
      'Pour le calcul inverse, utilisez le calculateur de salaire horaire.',
    ],
    faq: [
      ['Comment convertir un taux horaire en salaire mensuel ?', 'Multipliez le taux horaire par le nombre d’heures mensuelles, soit 151,67 à 35 h par semaine.'],
      ['Pourquoi ne pas multiplier simplement par 4 semaines ?', 'Parce qu’un mois compte en moyenne 4,33 semaines (52 ÷ 12). Multiplier par 4 sous-estimerait le salaire d’environ 8 %.'],
      ['Les heures supplémentaires sont-elles incluses ?', 'Non. Le calcul repose sur la durée hebdomadaire saisie, sans majoration.'],
      ['Le montant est-il brut ou net ?', 'Il est de même nature que le taux horaire saisi.'],
    ],
    related: ['calculateur-salaire-horaire', 'calculateur-augmentation-salaire', 'calculateur-pourcentage-augmentation', 'calculateur-moyenne'],
  },

  /* 17 */
  {
    slug: 'calculateur-augmentation-salaire', cat: CAT, sub: SUB,
    name: 'Calculateur d’augmentation de salaire',
    short: 'Nouveau salaire après augmentation, ou taux d’augmentation obtenu.',
    h1: 'Calculateur d’augmentation de salaire : nouveau salaire et gain',
    metaTitle: 'Calculateur d’augmentation de salaire en pourcentage',
    metaDesc: 'Calculez votre nouveau salaire après une augmentation en %, le gain mensuel et annuel, ou le pourcentage d’augmentation obtenu entre deux salaires.',
    keywords: ['augmentation de salaire', 'augmentation salaire pourcentage', 'nouveau salaire', 'gain annuel', 'revalorisation'],
    intro: [
      'Négociation, revalorisation annuelle ou changement de poste : combien allez-vous réellement gagner en plus ? Ce calculateur affiche le <strong>nouveau salaire</strong>, le <strong>gain mensuel et annuel</strong>, ou le <strong>pourcentage d’augmentation</strong> si vous connaissez déjà le nouveau montant.',
    ],
    blocks: [
      { id: 'taux', title: 'Appliquer un pourcentage d’augmentation', fn: 'salaryRaise', fields: [n('s', 'Salaire mensuel actuel', '2000', { unit: '€' }), n('p', 'Augmentation', '3', { unit: '%' })] },
      { id: 'montant', title: 'Quel pourcentage d’augmentation ai-je obtenu ?', fn: 'salaryRate', fields: [n('old', 'Ancien salaire mensuel', '2000', { unit: '€' }), n('nw', 'Nouveau salaire mensuel', '2100', { unit: '€' })] },
    ],
    how: [
      'Nouveau salaire = salaire actuel × (1 + pourcentage ÷ 100). Le gain est la différence entre les deux, multipliée par 12 pour obtenir l’effet sur une année.',
      'Pourcentage obtenu = (nouveau salaire − ancien salaire) ÷ ancien salaire × 100. Ce taux est calculé sur le même type de montant (brut ou net) pour l’ancien et le nouveau salaire.',
    ],
    example: () => {
      const a = F.salaryRaise({ s: 2000, p: 3 }).raw, b = F.salaryRate({ old: 2000, nw: 2100 }).raw.p;
      return `<p>Un salaire de 2 000 € augmenté de 3 % passe à <strong>${eur(a.nw)}</strong> : +${eur(a.gain)} par mois, soit +${eur(a.gain * 12)} sur l’année. Obtenir 2 100 € au lieu de 2 000 € correspond à une augmentation de <strong>${fmt(b)} %</strong>.</p>`;
    },
    table: () => ({
      caption: 'Gain mensuel selon le salaire et le pourcentage d’augmentation',
      head: ['Salaire actuel', '+ 1 %', '+ 2 %', '+ 3 %', '+ 5 %', '+ 10 %'],
      rows: [1500, 2000, 2500, 3000, 4000].map((s) => [eur(s), ...[1, 2, 3, 5, 10].map((p) => eur(s * p / 100))]),
    }),
    tips: [
      'Comparez des montants de même nature : brut avec brut, net avec net. Une augmentation brute ne se traduit pas toujours par le même pourcentage en net.',
      'Pensez à l’effet cumulé : trois augmentations de 2 % successives représentent 6,12 %, pas 6 %.',
      'Pour un salaire exprimé en heure, utilisez d’abord le calculateur de salaire mensuel.',
    ],
    faq: [
      ['Comment calculer une augmentation de salaire de 3 % ?', 'Multipliez le salaire par 1,03. Pour 2 000 € : 2 000 × 1,03 = 2 060 €.'],
      ['Comment calculer le pourcentage d’augmentation entre deux salaires ?', 'Soustrayez l’ancien du nouveau, divisez par l’ancien et multipliez par 100.'],
      ['Le calcul tient-il compte des impôts et cotisations ?', 'Non. Il s’agit d’un calcul de pourcentage sur les montants saisis. Votre revenu disponible dépend notamment de votre situation fiscale.'],
      ['Que représente le gain annuel affiché ?', 'La différence mensuelle multipliée par 12. Si vous percevez 13 mois ou des primes, l’effet réel peut être plus important.'],
    ],
    related: ['calculateur-pourcentage-augmentation', 'calculateur-salaire-mensuel', 'calculateur-salaire-horaire', 'calculateur-pourcentage'],
  },

  /* 18 */
  {
    slug: 'calculateur-remise', cat: CAT, sub: SUB,
    name: 'Calculateur de remise',
    short: 'Montant de la remise et prix final à partir d’un pourcentage.',
    h1: 'Calculateur de remise : montant économisé et prix final',
    metaTitle: 'Calculateur de remise : montant et prix après remise',
    metaDesc: 'Calculez le montant d’une remise et le prix final à partir d’un prix initial et d’un pourcentage. Idéal pour soldes, devis et négociations.',
    keywords: ['remise', 'calcul remise', 'rabais', 'montant remise', 'prix remisé', 'ristourne'],
    intro: [
      'Une remise de 15 % sur un devis, un rabais de fidélité, un code promo : saisissez le prix initial et le pourcentage pour obtenir immédiatement <strong>le montant de la remise</strong> et <strong>le prix à payer</strong>.',
    ],
    blocks: [{ id: 'remise', fn: 'discount', fields: [n('price', 'Prix initial', '80', { unit: '€' }), n('pct', 'Remise', '25', { unit: '%' })] }],
    how: [
      'Montant de la remise = prix initial × pourcentage ÷ 100. Prix final = prix initial − montant de la remise, arrondis au centime.',
      'La remise s’applique au montant que vous saisissez : hors taxes si vous saisissez un HT, TTC si vous saisissez un TTC.',
    ],
    example: () => {
      const r = F.discount({ price: 80, pct: 25 }).raw;
      return `<p>Sur un article à 80 €, une remise de 25 % représente 80 × 0,25 = <strong>${eur(r.rem)}</strong>. Le prix final est donc <strong>${eur(r.fin)}</strong>.</p>`;
    },
    table: () => ({
      caption: 'Montant de la remise selon le prix et le pourcentage',
      head: ['Prix initial', '− 5 %', '− 10 %', '− 20 %', '− 30 %', '− 50 %'],
      rows: [20, 50, 100, 250, 500, 1000].map((p) => [eur(p), ...[5, 10, 20, 30, 50].map((x) => eur(p * x / 100))]),
    }),
    tips: [
      'Sur un devis professionnel, précisez si la remise s’applique avant ou après la TVA.',
      'Pour comparer deux offres, regardez le prix final, jamais le seul pourcentage affiché.',
      'Pour cumuler deux remises, utilisez le calculateur de prix après réduction.',
    ],
    faq: [
      ['Comment calculer une remise de 10 % ?', 'Multipliez le prix par 0,10 pour obtenir le montant de la remise, puis retirez-le du prix. Sur 60 € : remise 6 €, prix final 54 €.'],
      ['Quelle est la différence entre une remise et une réduction ?', 'Dans l’usage courant, les deux termes désignent une baisse de prix. Le terme « remise » est plutôt employé entre professionnels ou sur facture.'],
      ['Comment retrouver le pourcentage de remise à partir de deux prix ?', 'Utilisez le calculateur de pourcentage de réduction, qui calcule le taux de baisse entre un prix initial et un prix final.'],
      ['La remise peut-elle dépasser 100 % ?', 'Non : à 100 %, le prix est nul. Le calculateur refuse les valeurs supérieures.'],
    ],
    related: ['calculateur-prix-apres-reduction', 'calculateur-pourcentage-reduction', 'calculateur-tva', 'calculateur-pourcentage'],
  },

  /* 19 */
  {
    slug: 'calculateur-prix-apres-reduction', cat: CAT, sub: SUB,
    name: 'Calculateur de prix après réduction',
    short: 'Prix final après une ou deux réductions successives.',
    h1: 'Calculateur de prix après réduction : une ou deux remises successives',
    metaTitle: 'Calculateur de prix après réduction (remises cumulées)',
    metaDesc: 'Calculez le prix final après une ou deux réductions successives (soldes puis code promo), avec l’économie réelle et la réduction totale équivalente.',
    keywords: ['prix après réduction', 'soldes', 'réductions cumulées', 'remise cumulée', 'démarque', 'code promo', 'deuxième démarque'],
    intro: [
      'Soldes avec seconde démarque, puis code promo : deux réductions successives ne s’additionnent pas. Ce calculateur applique <strong>chaque réduction au prix déjà réduit</strong> et donne le prix final, l’économie réelle et le pourcentage de réduction total équivalent.',
    ],
    blocks: [{ id: 'prix', fn: 'priceAfter', fields: [n('price', 'Prix initial', '100', { unit: '€' }), n('p1', 'Première réduction', '20', { unit: '%' }), n('p2', 'Seconde réduction (facultative)', '10', { unit: '%', optional: true })] }],
    how: [
      'Prix final = prix initial × (1 − r₁ ÷ 100) × (1 − r₂ ÷ 100). Chaque réduction s’applique sur le prix déjà diminué par la précédente.',
      'La réduction totale équivalente est 1 − (1 − r₁/100) × (1 − r₂/100), toujours inférieure à la somme des deux pourcentages.',
    ],
    example: () => {
      const r = F.priceAfter({ price: 100, p1: 20, p2: 10 }).raw;
      return `<p>Un article à 100 €, soldé à −20 % puis −10 % supplémentaires : 100 × 0,80 × 0,90 = <strong>${eur(r.fin)}</strong>. La réduction totale est de <strong>${fmt(r.total)} %</strong> et non 30 %.</p>`;
    },
    table: () => ({
      caption: 'Réduction totale selon deux réductions successives',
      head: ['Première', 'Seconde', 'Réduction totale', 'Somme simple'],
      rows: [[10, 10], [20, 10], [20, 20], [30, 20], [40, 20], [50, 20], [50, 30], [50, 50]].map(([a, b]) => [`${a} %`, `${b} %`, `${fmt((1 - (1 - a / 100) * (1 - b / 100)) * 100, 1)} %`, `${a + b} %`]),
    }),
    tips: [
      'L’ordre des réductions n’a pas d’importance pour le prix final : −20 % puis −10 % équivaut à −10 % puis −20 %.',
      'Certains codes promo ne se cumulent pas avec les soldes : vérifiez les conditions avant de compter dessus.',
      'Quand la seconde réduction est un montant fixe en euros, retirez-le directement après avoir appliqué la première réduction.',
    ],
    faq: [
      ['Comment calculer deux réductions successives ?', 'Multipliez le prix par (1 − première réduction) puis par (1 − seconde réduction). Pour −20 % puis −10 % : prix × 0,80 × 0,90 = prix × 0,72.'],
      ['−20 % et −10 % font-ils −30 % ?', 'Non, ils font −28 %. La seconde réduction s’applique sur un prix déjà diminué, donc sur un montant plus faible.'],
      ['Que faire s’il n’y a qu’une seule réduction ?', 'Laissez le champ « seconde réduction » vide : le calculateur applique alors seulement la première.'],
      ['Comment retrouver le prix initial ?', 'Divisez le prix final par le produit des coefficients : prix final ÷ (0,80 × 0,90) pour −20 % puis −10 %.'],
    ],
    related: ['calculateur-remise', 'calculateur-pourcentage-reduction', 'calculateur-pourcentage', 'calculateur-tva'],
  },
];
