import { FUNCTIONS as F, fmt, countBusinessDays, utc, addDays, daysInMonth } from '../utils/calc.mjs';
import { n, d, c, s, t } from './fields.mjs';

const CAT = 'calculateurs';

/** Année de référence pour les tableaux dépendant du calendrier (rebuild annuel conseillé). */
export const refYear = () => { const now = new Date(); return now.getMonth() >= 8 ? now.getFullYear() + 1 : now.getFullYear(); };
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

export const generalTools = [
  /* 1 ─────────────────────────────────────────────── */
  {
    slug: 'calculateur-pourcentage', cat: CAT, sub: 'Pourcentages', popular: true,
    name: 'Calculateur de pourcentage',
    short: 'Calculer un pourcentage, une proportion ou un total.',
    h1: 'Calculateur de pourcentage : calculez facilement un pourcentage',
    metaTitle: 'Calculateur de pourcentage en ligne, gratuit et rapide',
    metaDesc: 'Calculez le pourcentage d’un nombre, trouvez quel pourcentage représente une valeur ou retrouvez un total. Résultat immédiat avec formules et exemples.',
    keywords: ['pourcentage', 'pourcent', '%', 'proportion', 'part', 'calcul pourcentage', 'taux'],
    intro: [
      'Ce calculateur répond aux trois questions que l’on se pose le plus souvent avec les pourcentages : <strong>combien font 20 % de 150 ?</strong>, <strong>quelle part représente 35 sur 140 ?</strong> et <strong>de quel total 30 représente-t-il 15 % ?</strong>',
      'Remplissez simplement les champs du bloc qui vous intéresse : le résultat s’affiche au fur et à mesure de la saisie, avec le détail du calcul.',
    ],
    blocks: [
      { id: 'part', title: 'Calculer le pourcentage d’un nombre', fn: 'pctPart', fields: [n('p', 'Pourcentage', '20', { unit: '%' }), n('v', 'Nombre de départ', '150')] },
      { id: 'ratio', title: 'Quel pourcentage représente une valeur ?', fn: 'pctRatio', fields: [n('a', 'Valeur (la partie)', '35'), n('b', 'Valeur de référence (le tout)', '140')] },
      { id: 'base', title: 'Retrouver le total à partir d’une part', fn: 'pctBase', fields: [n('a', 'Valeur connue', '30'), n('p', 'Cette valeur représente', '15', { unit: '%' })] },
    ],
    how: [
      'Un pourcentage est une fraction exprimée sur 100 : 20 % signifie « 20 pour 100 », c’est-à-dire 20/100 ou 0,20.',
      '<strong>Pourcentage d’un nombre :</strong> nombre × pourcentage ÷ 100. Par exemple 20 % de 150 = 150 × 20 ÷ 100 = 30.',
      '<strong>Part en pourcentage :</strong> partie ÷ total × 100. Par exemple 35 sur 140 = 35 ÷ 140 × 100 = 25 %.',
      '<strong>Retrouver le total :</strong> valeur connue × 100 ÷ pourcentage. Par exemple si 30 représente 15 %, le total est 30 × 100 ÷ 15 = 200.',
    ],
    example: () => {
      const a = F.pctPart({ p: 15, v: 80 }).raw.r, b = F.pctRatio({ a: 18, b: 24 }).raw.r;
      return `<p>Un manteau est affiché 80 €. Une taxe de 15 % s’y applique : 80 × 15 ÷ 100 = <strong>${fmt(a)} €</strong>. Dans une classe de 24 élèves, 18 ont obtenu la moyenne : 18 ÷ 24 × 100 = <strong>${fmt(b)} %</strong> de réussite.</p>`;
    },
    table: () => ({
      caption: 'Pourcentages courants de quelques valeurs',
      head: ['Pourcentage', 'de 50', 'de 100', 'de 250', 'de 1 000'],
      rows: [5, 10, 15, 20, 25, 33.33, 50, 75].map((p) => [`${fmt(p)} %`, ...[50, 100, 250, 1000].map((v) => fmt(v * p / 100, 2))]),
    }),
    tips: [
      'Pour calculer 10 % de tête, décalez simplement la virgule d’un rang : 10 % de 85 = 8,5. Pour 5 %, prenez la moitié de ce résultat.',
      'Ne confondez pas « points de pourcentage » et « pourcentage » : passer de 10 % à 12 % est une hausse de 2 points, mais de 20 % en valeur relative.',
      'Deux pourcentages successifs ne s’additionnent pas : +10 % puis −10 % ne ramène pas à la valeur de départ (voir le calculateur d’augmentation).',
    ],
    faq: [
      ['Comment calculer 20 % d’un nombre ?', 'Multipliez le nombre par 20 puis divisez par 100, ou plus simplement multipliez par 0,2. Pour 20 % de 150 : 150 × 0,2 = 30.'],
      ['Comment savoir quel pourcentage représente un nombre par rapport à un autre ?', 'Divisez la partie par le total puis multipliez par 100. Si vous avez 35 réponses correctes sur 140, la part est 35 ÷ 140 × 100 = 25 %.'],
      ['Un pourcentage peut-il dépasser 100 % ?', 'Oui. 150 % d’une valeur correspond à une fois et demie cette valeur. C’est courant pour exprimer une croissance, par exemple un chiffre d’affaires qui a plus que doublé.'],
      ['Comment retrouver le prix de départ connaissant un pourcentage ?', 'Utilisez le troisième bloc : valeur connue × 100 ÷ pourcentage. Si la TVA de 4 € correspond à 20 % du prix hors taxes, le prix HT est 4 × 100 ÷ 20 = 20 €.'],
    ],
    related: ['calculateur-pourcentage-augmentation', 'calculateur-pourcentage-reduction', 'calculateur-tva', 'calculateur-regle-de-trois'],
  },

  /* 2 ─────────────────────────────────────────────── */
  {
    slug: 'calculateur-pourcentage-augmentation', cat: CAT, sub: 'Pourcentages',
    name: 'Calculateur de pourcentage d’augmentation',
    short: 'Appliquer une hausse en % ou calculer un taux d’évolution.',
    h1: 'Calculateur de pourcentage d’augmentation : appliquer ou calculer une hausse',
    metaTitle: 'Calculateur de pourcentage d’augmentation (hausse en %)',
    metaDesc: 'Calculez une valeur après une augmentation en pourcentage, ou retrouvez le taux de hausse entre deux valeurs. Résultat immédiat, formule et exemples.',
    keywords: ['augmentation', 'hausse', 'pourcentage augmentation', 'évolution', 'taux de variation', 'majoration'],
    intro: [
      'Un loyer qui passe de 750 € à 780 €, un abonnement qui augmente de 4 %, un chiffre d’affaires en progression : ce calculateur vous donne soit <strong>la valeur après une augmentation connue</strong>, soit <strong>le pourcentage de hausse</strong> entre deux valeurs.',
    ],
    blocks: [
      { id: 'appliquer', title: 'Appliquer une augmentation', fn: 'pctIncrease', fields: [n('v', 'Valeur de départ', '80'), n('p', 'Augmentation', '15', { unit: '%' })] },
      { id: 'taux', title: 'Calculer le pourcentage d’augmentation entre deux valeurs', fn: 'pctChange', fields: [n('v0', 'Ancienne valeur', '80'), n('v1', 'Nouvelle valeur', '92')] },
    ],
    how: [
      '<strong>Valeur après augmentation :</strong> valeur de départ × (1 + pourcentage ÷ 100). Le terme (1 + p/100) s’appelle le coefficient multiplicateur : une hausse de 15 % revient à multiplier par 1,15.',
      '<strong>Taux d’augmentation :</strong> (nouvelle valeur − ancienne valeur) ÷ ancienne valeur × 100. Le résultat est négatif en cas de baisse : le calculateur l’indique alors comme une baisse.',
    ],
    example: () => {
      const a = F.pctIncrease({ v: 750, p: 4 }).raw, b = F.pctChange({ v0: 750, v1: 780 }).raw.r;
      return `<p>Un loyer de 750 € augmenté de 4 % passe à 750 × 1,04 = <strong>${fmt(a.fin)} €</strong>, soit ${fmt(a.gain)} € de plus par mois. Dans l’autre sens, un loyer qui passe de 750 € à 780 € progresse de (780 − 750) ÷ 750 × 100 = <strong>${fmt(b)} %</strong>.</p>`;
    },
    table: () => ({
      caption: 'Coefficients multiplicateurs pour une augmentation',
      head: ['Hausse', 'Coefficient', '100 € deviennent', '1 000 € deviennent'],
      rows: [1, 2, 3, 5, 10, 20, 50, 100].map((p) => [`+ ${p} %`, fmt(1 + p / 100, 2), `${fmt(100 * (1 + p / 100))} €`, `${fmt(1000 * (1 + p / 100))} €`]),
    }),
    tips: [
      'Une hausse de 100 % double la valeur ; une hausse de 200 % la triple.',
      'Pour revenir à la valeur de départ après une hausse de 25 %, il faut une baisse de 20 % (et non de 25 %), car la base de calcul a changé.',
      'Pour plusieurs hausses successives, multipliez les coefficients : +10 % puis +5 % donne 1,10 × 1,05 = 1,155, soit +15,5 % au total.',
    ],
    faq: [
      ['Comment calculer une augmentation de 5 % ?', 'Multipliez la valeur par 1,05. Pour 200 € : 200 × 1,05 = 210 €. Le gain est de 10 €, soit 5 % de 200.'],
      ['Comment calculer le pourcentage d’augmentation entre deux prix ?', 'Soustrayez l’ancien prix du nouveau, divisez par l’ancien prix puis multipliez par 100. De 40 € à 46 € : (46 − 40) ÷ 40 × 100 = 15 %.'],
      ['Pourquoi +10 % puis −10 % ne revient-il pas au point de départ ?', 'Parce que la baisse s’applique à la nouvelle valeur, plus grande. 100 € + 10 % = 110 €, puis 110 € − 10 % = 99 €. On perd 1 %.'],
      ['Que faire si la valeur de départ est zéro ?', 'Le pourcentage d’augmentation n’est alors pas défini, car on ne peut pas diviser par zéro. Le calculateur affiche un message plutôt qu’un résultat erroné.'],
    ],
    related: ['calculateur-pourcentage-reduction', 'calculateur-pourcentage', 'calculateur-augmentation-salaire', 'calculateur-tva'],
  },

  /* 3 ─────────────────────────────────────────────── */
  {
    slug: 'calculateur-pourcentage-reduction', cat: CAT, sub: 'Pourcentages',
    name: 'Calculateur de pourcentage de réduction',
    short: 'Calculer une valeur après réduction ou le taux de baisse.',
    h1: 'Calculateur de pourcentage de réduction : combien avez-vous économisé ?',
    metaTitle: 'Calculateur de pourcentage de réduction (baisse en %)',
    metaDesc: 'Appliquez un pourcentage de réduction à un prix ou calculez le taux de baisse entre deux valeurs. Résultat instantané, formule et exemples concrets.',
    keywords: ['réduction', 'baisse', 'pourcentage réduction', 'solde', 'diminution', 'rabais'],
    intro: [
      'Pendant les soldes ou pour une négociation, on veut savoir <strong>quel est le nouveau prix après une réduction de 30 %</strong>, ou <strong>quel pourcentage de réduction</strong> représente un prix barré. Les deux calculs sont réunis ici.',
    ],
    blocks: [
      { id: 'appliquer', title: 'Appliquer une réduction', fn: 'pctDecrease', fields: [n('v', 'Valeur de départ', '120'), n('p', 'Réduction', '25', { unit: '%' })] },
      { id: 'taux', title: 'Calculer le pourcentage de réduction entre deux valeurs', fn: 'pctChange', fields: [n('v0', 'Ancienne valeur', '120'), n('v1', 'Nouvelle valeur', '90')] },
    ],
    how: [
      '<strong>Valeur après réduction :</strong> valeur de départ × (1 − pourcentage ÷ 100). Une réduction de 25 % revient à multiplier par 0,75.',
      '<strong>Taux de réduction :</strong> (ancienne valeur − nouvelle valeur) ÷ ancienne valeur × 100. Le second bloc affiche une « baisse de X % » lorsque la nouvelle valeur est inférieure à l’ancienne.',
    ],
    example: () => {
      const a = F.pctDecrease({ v: 120, p: 25 }).raw, b = F.pctChange({ v0: 120, v1: 90 }).raw.r;
      return `<p>Une veste à 120 € avec 25 % de réduction coûte 120 × 0,75 = <strong>${fmt(a.fin)} €</strong> : l’économie est de ${fmt(a.saved)} €. Si le prix barré est 120 € et le prix affiché 90 €, la baisse est de (120 − 90) ÷ 120 × 100 = <strong>${fmt(Math.abs(b))} %</strong>.</p>`;
    },
    table: () => ({
      caption: 'Prix final selon le taux de réduction',
      head: ['Réduction', 'Coefficient', '50 € deviennent', '100 € deviennent', '200 € deviennent'],
      rows: [10, 15, 20, 25, 30, 40, 50, 70].map((p) => [`− ${p} %`, fmt(1 - p / 100, 2), `${fmt(50 * (1 - p / 100))} €`, `${fmt(100 * (1 - p / 100))} €`, `${fmt(200 * (1 - p / 100))} €`]),
    }),
    tips: [
      'Comparez toujours le prix final et non le pourcentage : −30 % sur un article cher peut rester plus coûteux que −10 % sur un article équivalent moins cher.',
      'Avec deux réductions successives (−20 % puis −10 %), la réduction totale n’est pas de 30 % mais de 28 %. Le calculateur « prix après réduction » gère ce cas.',
      'Une réduction de 50 % divise le prix par deux ; une réduction de 100 % rend l’article gratuit. Au-delà, le calcul n’a pas de sens.',
    ],
    faq: [
      ['Comment calculer −30 % sur un prix ?', 'Multipliez le prix par 0,70. Pour 80 € : 80 × 0,70 = 56 €. Vous économisez 24 €, soit 30 % de 80.'],
      ['Comment retrouver le prix avant réduction ?', 'Divisez le prix final par le coefficient. Un article soldé à 63 € après −30 % valait 63 ÷ 0,70 = 90 €.'],
      ['Comment calculer le pourcentage de réduction entre deux prix ?', 'Soustrayez le prix final du prix initial, divisez par le prix initial et multipliez par 100. De 90 € à 72 € : (90 − 72) ÷ 90 × 100 = 20 %.'],
      ['La TVA est-elle comprise dans la réduction ?', 'Les prix affichés aux particuliers sont en général TTC, et la réduction s’applique à ce prix TTC. Pour isoler la TVA, utilisez le calculateur TTC vers HT.'],
    ],
    related: ['calculateur-prix-apres-reduction', 'calculateur-remise', 'calculateur-pourcentage-augmentation', 'calculateur-pourcentage'],
  },

  /* 4 ─────────────────────────────────────────────── */
  {
    slug: 'calculateur-regle-de-trois', cat: CAT, sub: 'Mathématiques',
    name: 'Calculateur de règle de trois',
    short: 'Trouver la quatrième valeur d’une proportion (directe ou inverse).',
    h1: 'Calculateur de règle de trois : trouvez la valeur manquante',
    metaTitle: 'Calculateur de règle de trois (proportionnalité)',
    metaDesc: 'Résolvez une règle de trois en ligne : proportionnalité directe ou inverse, avec le détail du calcul. Idéal pour les recettes, les doses et les prix.',
    keywords: ['règle de trois', 'proportionnalité', 'produit en croix', 'proportion', 'quatrième proportionnelle'],
    intro: [
      'La règle de trois permet de trouver une quatrième valeur quand trois valeurs sont connues et liées par une proportion : adapter une recette pour 7 personnes, convertir une quantité, calculer un prix au poids.',
      'Choisissez le bloc « proportionnalité directe » (si l’une augmente, l’autre augmente aussi) ou « proportionnalité inverse » (si l’une augmente, l’autre diminue).',
    ],
    blocks: [
      { id: 'directe', title: 'Proportionnalité directe', fn: 'ruleOfThree', fields: [n('a', 'Si A…', '4'), n('b', '…correspond à B', '300'), n('c', 'Alors C…', '7')] },
      { id: 'inverse', title: 'Proportionnalité inverse', fn: 'ruleOfThreeInv', fields: [n('a', 'Si A…', '4'), n('b', '…correspond à B', '6'), n('c', 'Alors C…', '8')] },
    ],
    how: [
      '<strong>Directe (produit en croix) :</strong> si A correspond à B, alors C correspond à B × C ÷ A. Ce calcul revient à utiliser le coefficient B ÷ A, qui reste constant.',
      '<strong>Inverse :</strong> si A correspond à B et que C est plus grand, la valeur cherchée est plus petite : A × B ÷ C. C’est le cas du temps de trajet selon la vitesse ou du nombre d’ouvriers selon la durée d’un chantier.',
    ],
    example: () => {
      const a = F.ruleOfThree({ a: 4, b: 300, c: 7 }).raw.x, b = F.ruleOfThreeInv({ a: 4, b: 6, c: 8 }).raw.x;
      return `<p><strong>Directe :</strong> une recette utilise 300 g de farine pour 4 personnes. Pour 7 personnes il faut 300 × 7 ÷ 4 = <strong>${fmt(a)} g</strong>. <strong>Inverse :</strong> 4 ouvriers terminent un chantier en 6 jours ; avec 8 ouvriers, la durée est 4 × 6 ÷ 8 = <strong>${fmt(b)} jours</strong>.</p>`;
    },
    table: () => ({
      caption: 'Directe ou inverse ? Quelques situations typiques',
      head: ['Situation', 'Type de proportion', 'Pourquoi'],
      rows: [
        ['Prix selon la quantité achetée', 'Directe', 'Deux fois plus de produit coûte deux fois plus cher'],
        ['Ingrédients selon le nombre de convives', 'Directe', 'Les quantités évoluent dans le même sens'],
        ['Durée du trajet selon la vitesse', 'Inverse', 'Rouler deux fois plus vite divise la durée par deux'],
        ['Durée d’un chantier selon le nombre d’ouvriers', 'Inverse', 'Plus d’ouvriers, moins de jours (à rendement constant)'],
        ['Consommation de carburant selon la distance', 'Directe', 'Plus on roule, plus on consomme'],
      ],
    }),
    tips: [
      'Vérifiez le sens avant de calculer : demandez-vous si, en augmentant la 3e valeur, le résultat doit augmenter ou diminuer.',
      'Utilisez les mêmes unités pour A et C (par exemple des personnes avec des personnes), sinon le résultat n’a pas de sens.',
      'Certaines situations ne sont pas proportionnelles : le prix d’un abonnement avec frais fixes, la cuisson, ou un tarif dégressif.',
    ],
    faq: [
      ['Qu’est-ce que le produit en croix ?', 'C’est la méthode qui permet de résoudre une égalité de deux fractions : si A/B = C/X, alors X = B × C ÷ A. C’est exactement le calcul de la règle de trois directe.'],
      ['Comment savoir si la proportionnalité est directe ou inverse ?', 'Si les deux grandeurs évoluent dans le même sens (doubler l’une double l’autre), elle est directe. Si doubler l’une divise l’autre par deux, elle est inverse.'],
      ['Peut-on utiliser des nombres décimaux ?', 'Oui, saisissez-les avec une virgule (12,5). Seule la première valeur (directe) ou la troisième (inverse) ne doit pas être égale à zéro.'],
      ['La règle de trois fonctionne-t-elle avec les pourcentages ?', 'Oui : si 200 correspond à 100 %, alors 50 correspond à 100 × 50 ÷ 200 = 25 %. Pour les pourcentages, le calculateur dédié est toutefois plus direct.'],
    ],
    related: ['calculateur-pourcentage', 'calculateur-moyenne', 'calculateur-moyenne-ponderee', 'calculateur-volume'],
  },

  /* 5 ─────────────────────────────────────────────── */
  {
    slug: 'calculateur-moyenne', cat: CAT, sub: 'Mathématiques', popular: true,
    name: 'Calculateur de moyenne',
    short: 'Moyenne, somme, minimum, maximum et médiane d’une série.',
    h1: 'Calculateur de moyenne : calculez la moyenne d’une série de valeurs',
    metaTitle: 'Calculateur de moyenne arithmétique en ligne',
    metaDesc: 'Calculez la moyenne d’une série de notes ou de nombres, avec la somme, le minimum, le maximum et la médiane. Outil gratuit, simple et immédiat.',
    keywords: ['moyenne', 'moyenne arithmétique', 'notes', 'médiane', 'moyenne de notes', 'série'],
    intro: [
      'Collez ou saisissez vos valeurs : notes, relevés de consommation, températures, dépenses mensuelles… Le calculateur donne la <strong>moyenne arithmétique</strong>, la somme, les valeurs extrêmes et la médiane.',
    ],
    blocks: [
      { id: 'serie', title: 'Votre série de valeurs', fn: 'mean', fields: [t('list', 'Valeurs (séparées par un espace, un point-virgule ou un retour à la ligne)', '12 15,5 9 14 11', { hint: 'Utilisez la virgule pour les décimales : 12,5.' })] },
    ],
    how: [
      'La moyenne arithmétique est la somme des valeurs divisée par leur nombre : (v₁ + v₂ + … + vₙ) ÷ n.',
      'La <strong>médiane</strong> est la valeur qui partage la série en deux moitiés égales une fois les valeurs triées. Elle est moins sensible aux valeurs extrêmes que la moyenne.',
    ],
    example: () => {
      const r = F.mean({ list: '12 15,5 9 14 11' }).raw;
      return `<p>Cinq notes : 12, 15,5, 9, 14 et 11. La somme est ${fmt(r.sum)} et il y a ${r.n} valeurs : ${fmt(r.sum)} ÷ ${r.n} = <strong>${fmt(r.avg)}</strong>. La médiane (valeur centrale une fois triées : 9, 11, 12, 14, 15,5) est 12.</p>`;
    },
    table: () => ({
      caption: 'Moyenne ou médiane : laquelle choisir ?',
      head: ['Situation', 'Indicateur conseillé'],
      rows: [
        ['Notes d’un élève', 'Moyenne (éventuellement pondérée)'],
        ['Salaires dans une entreprise', 'Médiane : quelques très hauts salaires faussent la moyenne'],
        ['Prix de l’immobilier dans une ville', 'Médiane'],
        ['Températures relevées chaque jour', 'Moyenne'],
        ['Consommation mensuelle d’énergie', 'Moyenne sur 12 mois pour lisser les saisons'],
      ],
    }),
    tips: [
      'Si certaines valeurs comptent plus que d’autres (coefficients), utilisez plutôt le calculateur de moyenne pondérée.',
      'Vous pouvez copier une colonne d’un tableur et la coller telle quelle : les retours à la ligne servent de séparateurs.',
      'Une valeur aberrante peut fausser la moyenne : comparez-la à la médiane pour le repérer.',
    ],
    faq: [
      ['Comment calculer une moyenne ?', 'Additionnez toutes les valeurs puis divisez par leur nombre. La moyenne de 10, 12 et 14 est (10 + 12 + 14) ÷ 3 = 12.'],
      ['Quelle différence entre moyenne et médiane ?', 'La moyenne tient compte de la valeur de chaque élément ; la médiane est simplement la valeur du milieu. Sur 1, 2, 3, 4 et 100, la moyenne est 22 mais la médiane est 3.'],
      ['Comment saisir des nombres décimaux ?', 'Avec une virgule ou un point : 12,5 ou 12.5. Les valeurs sont séparées par un espace, un point-virgule ou un retour à la ligne, jamais par une virgule.'],
      ['Y a-t-il une limite au nombre de valeurs ?', 'Aucune limite pratique pour un usage courant : le calcul est effectué directement dans votre navigateur.'],
    ],
    related: ['calculateur-moyenne-ponderee', 'calculateur-pourcentage', 'calculateur-regle-de-trois', 'calculateur-salaire-mensuel'],
  },

  /* 6 ─────────────────────────────────────────────── */
  {
    slug: 'calculateur-moyenne-ponderee', cat: CAT, sub: 'Mathématiques',
    name: 'Calculateur de moyenne pondérée',
    short: 'Moyenne avec coefficients : notes, notes de contrôle continu…',
    h1: 'Calculateur de moyenne pondérée : calculez avec des coefficients',
    metaTitle: 'Calculateur de moyenne pondérée avec coefficients',
    metaDesc: 'Calculez une moyenne pondérée à partir de valeurs et de coefficients : notes de cours, de contrôle ou de projet. Résultat immédiat et détail du calcul.',
    keywords: ['moyenne pondérée', 'coefficient', 'moyenne avec coefficients', 'notes coefficients', 'pondération'],
    intro: [
      'Dans une moyenne pondérée, chaque valeur a un poids différent : un examen coefficient 3 compte trois fois plus qu’un devoir coefficient 1. Saisissez une ligne par valeur, <strong>la note puis son coefficient</strong>.',
    ],
    blocks: [
      { id: 'serie', title: 'Vos valeurs et leurs coefficients', fn: 'weightedMean', fields: [t('list', 'Une ligne par valeur : la valeur, un espace, le coefficient', '14 3\n11 2\n16 1', { hint: 'Exemple : « 14 3 » pour une note de 14 avec un coefficient 3.' })] },
    ],
    how: [
      'Moyenne pondérée = (v₁ × c₁ + v₂ × c₂ + … ) ÷ (c₁ + c₂ + …). On additionne les valeurs multipliées par leur coefficient, puis on divise par la somme des coefficients.',
      'Si tous les coefficients sont identiques, on retrouve la moyenne arithmétique classique.',
    ],
    example: () => {
      const r = F.weightedMean({ list: '14 3\n11 2\n16 1' }).raw;
      return `<p>Trois notes : 14 (coefficient 3), 11 (coefficient 2) et 16 (coefficient 1). Somme pondérée : 14 × 3 + 11 × 2 + 16 × 1 = ${fmt(r.sv)}. Somme des coefficients : ${fmt(r.sw)}. Moyenne : ${fmt(r.sv)} ÷ ${fmt(r.sw)} = <strong>${fmt(r.avg)}</strong>, alors que la moyenne simple serait ${fmt((14 + 11 + 16) / 3)}.</p>`;
    },
    table: () => ({
      caption: 'Exemple de pondération d’une évaluation',
      head: ['Épreuve', 'Note', 'Coefficient', 'Note × coefficient'],
      rows: [['Examen final', '14', '3', '42'], ['Contrôle continu', '11', '2', '22'], ['Projet', '16', '1', '16'], ['Total', '', '6', '80']],
    }),
    tips: [
      'Les coefficients peuvent être décimaux (0,5 ; 1,5) : saisissez-les avec une virgule.',
      'Pour viser une moyenne cible, testez différentes notes sur la dernière ligne et observez l’effet sur le résultat.',
      'Les coefficients n’ont pas besoin de totaliser 100 : seul leur poids relatif compte.',
    ],
    faq: [
      ['Comment calculer une moyenne pondérée ?', 'Multipliez chaque valeur par son coefficient, additionnez ces produits, puis divisez par la somme des coefficients.'],
      ['Que se passe-t-il si un coefficient est égal à zéro ?', 'La valeur correspondante n’influence pas la moyenne. Si tous les coefficients valent zéro, le calcul est impossible.'],
      ['Peut-on utiliser des pourcentages comme coefficients ?', 'Oui : 40 pour un examen et 60 pour un projet donnent la même moyenne que 2 et 3 en proportion. Seul le rapport entre les coefficients compte.'],
      ['Pourquoi ma moyenne pondérée diffère-t-elle de la moyenne simple ?', 'Parce que les valeurs à fort coefficient tirent le résultat vers elles. C’est précisément l’intérêt de la pondération.'],
    ],
    related: ['calculateur-moyenne', 'calculateur-pourcentage', 'calculateur-regle-de-trois', 'calculateur-age'],
  },

  /* 7 ─────────────────────────────────────────────── */
  {
    slug: 'calculateur-age', cat: CAT, sub: 'Dates et durées', popular: true,
    name: 'Calculateur d’âge',
    short: 'Âge exact en années, mois et jours à partir d’une date de naissance.',
    h1: 'Calculateur d’âge : quel est votre âge exact ?',
    metaTitle: 'Calculateur d’âge exact : années, mois et jours',
    metaDesc: 'Calculez un âge exact en années, mois et jours à partir d’une date de naissance, avec le prochain anniversaire et le nombre de jours vécus.',
    keywords: ['âge', 'age', 'date de naissance', 'anniversaire', 'calcul âge', 'jours vécus'],
    intro: [
      'Entrez une date de naissance : le calculateur donne l’âge <strong>exact en années, mois et jours</strong>, le nombre total de jours vécus et la date du prochain anniversaire. Par défaut, l’âge est calculé à la date d’aujourd’hui, mais vous pouvez choisir n’importe quelle autre date de référence.',
    ],
    blocks: [
      { id: 'age', fn: 'age', fields: [d('birth', 'Date de naissance', ''), d('ref', 'Calculer l’âge au', 'today')] },
    ],
    how: [
      'On compte d’abord les mois entiers écoulés entre la date de naissance et la date de référence, puis les jours restants. Les années sont les mois divisés par 12.',
      'Le total de jours vécus tient compte des années bissextiles, car il est obtenu par différence entre deux dates réelles du calendrier.',
      'Pour une naissance un 29 février, l’anniversaire est placé au 28 février durant les années non bissextiles.',
    ],
    example: () => {
      const r = F.age({ birth: '1990-05-15', ref: '2025-05-14' }).raw;
      return `<p>Une personne née le 15 mai 1990 a, le 14 mai 2025, <strong>${r.years} ans, ${r.months} mois et ${r.days} jours</strong> : il lui manque un jour pour fêter ses 35 ans. Elle a vécu ${fmt(r.total, 0)} jours.</p>`;
    },
    table: () => ({
      caption: 'Repères : nombre de jours selon l’âge (hors années bissextiles)',
      head: ['Âge', 'Jours (approximatifs)', 'Semaines (approximatives)'],
      rows: [1, 5, 10, 18, 30, 50, 65, 80].map((a) => [`${a} an${a > 1 ? 's' : ''}`, fmt(Math.round(a * 365.2425), 0), fmt(Math.round((a * 365.2425) / 7), 0)]),
    }),
    tips: [
      'Pour connaître l’âge à une date précise (dépôt de dossier, inscription, limite d’âge d’un concours), modifiez la date de référence.',
      'Le jour de la semaine de naissance est indiqué dans le détail du résultat : pratique pour une anecdote ou un faire-part.',
      'Pour calculer l’écart entre deux dates quelconques, utilisez plutôt le calculateur de durée.',
    ],
    faq: [
      ['Comment calculer son âge exact ?', 'Comptez les années complètes entre la date de naissance et aujourd’hui, puis les mois complets restants, puis les jours. Le calculateur le fait automatiquement en respectant la longueur réelle de chaque mois.'],
      ['Comment calculer l’âge à une date précise ?', 'Renseignez la date voulue dans le champ « Calculer l’âge au ». C’est utile pour une condition d’âge à une date donnée.'],
      ['Combien de jours ai-je vécu ?', 'Le détail du résultat indique le nombre total de jours entre votre naissance et la date de référence, années bissextiles incluses.'],
      ['Que se passe-t-il pour une naissance un 29 février ?', 'Les années non bissextiles, ce calculateur considère que l’anniversaire tombe le 28 février. Pour une démarche officielle, référez-vous à la règle de l’organisme concerné.'],
    ],
    related: ['calculateur-duree', 'calculateur-jours-entre-deux-dates', 'compteur-jusqu-a-une-date', 'calculateur-date-future'],
  },

  /* 8 ─────────────────────────────────────────────── */
  {
    slug: 'calculateur-duree', cat: 'calendrier', sub: 'Durées',
    name: 'Calculateur de durée entre deux dates',
    short: 'Durée exacte entre deux dates en années, mois, semaines et jours.',
    h1: 'Calculateur de durée entre deux dates : années, mois et jours',
    metaTitle: 'Calculateur de durée entre deux dates (années, mois, jours)',
    metaDesc: 'Calculez la durée exacte entre deux dates en années, mois, semaines, jours et heures. Option pour inclure le dernier jour. Gratuit et immédiat.',
    keywords: ['durée entre deux dates', 'écart dates', 'combien de temps', 'années mois jours', 'ancienneté', 'durée'],
    intro: [
      'Combien de temps s’est écoulé entre deux dates ? Ce calculateur exprime la durée <strong>en années, mois et jours</strong>, mais aussi en semaines, jours et heures. Il convient pour une ancienneté, une période de location, la durée d’un contrat ou d’un projet.',
    ],
    blocks: [
      { id: 'duree', fn: 'durationDates', fields: [d('d1', 'Date de début', '2022-03-15'), d('d2', 'Date de fin', '2025-06-20'), c('incl', 'Inclure le dernier jour dans la durée', false)] },
    ],
    how: [
      'On ajoute à la date de début autant de mois entiers que possible sans dépasser la date de fin, puis on compte les jours restants. Si le jour du mois n’existe pas (par exemple le 31 dans un mois de 30 jours), on retient le dernier jour du mois.',
      'Avec l’option « inclure le dernier jour », la date de fin est comptée comme un jour complet : du 1er au 10 du mois, on obtient alors 10 jours au lieu de 9.',
    ],
    example: () => {
      const r = F.durationDates({ d1: '2022-03-15', d2: '2025-06-20' }).raw;
      return `<p>Du 15 mars 2022 au 20 juin 2025, il s’est écoulé <strong>${r.years} ans, ${r.months} mois et ${r.days} jours</strong>, soit ${fmt(r.totalDays, 0)} jours au total (années bissextiles incluses).</p>`;
    },
    table: () => ({
      caption: 'Durées de référence du calendrier',
      head: ['Période', 'Nombre de jours'],
      rows: [['Une semaine', '7'], ['Un mois', '28, 29, 30 ou 31'], ['Un trimestre', '90 à 92'], ['Un semestre', '181 à 184'], ['Une année', '365 (366 si bissextile)']],
    }),
    tips: [
      'Pour un contrat ou un préavis, vérifiez si le premier et le dernier jour sont comptés : c’est l’option « inclure le dernier jour ».',
      'Si vous inversez les deux dates, le calculateur les remet dans l’ordre chronologique et vous le signale.',
      'Pour ne compter que les jours travaillés, utilisez le calculateur de jours ouvrés.',
    ],
    faq: [
      ['Comment calculer la durée entre deux dates ?', 'Comptez les mois complets entre les deux dates puis les jours restants. Le calculateur le fait pour vous et affiche aussi le total en jours, semaines et heures.'],
      ['Faut-il compter le dernier jour ?', 'Cela dépend de l’usage. Pour une durée de location « du 1er au 7 inclus », on compte 7 jours ; pour un simple écart, 6. Cochez la case selon votre besoin.'],
      ['Les années bissextiles sont-elles prises en compte ?', 'Oui. Le calcul utilise les vraies dates du calendrier : le 29 février existe dans les années bissextiles et le total de jours est exact.'],
      ['Pourquoi un mois peut-il avoir 28, 29, 30 ou 31 jours ?', 'Les mois du calendrier grégorien n’ont pas tous la même longueur. C’est pourquoi une durée en « mois » n’équivaut pas à un nombre fixe de jours.'],
    ],
    related: ['calculateur-jours-entre-deux-dates', 'calculateur-semaines-entre-deux-dates', 'calculateur-jours-ouvres', 'calculateur-age'],
  },

  /* 9 ─────────────────────────────────────────────── */
  {
    slug: 'calculateur-jours-entre-deux-dates', cat: 'calendrier', sub: 'Durées',
    name: 'Calculateur de jours entre deux dates',
    short: 'Nombre exact de jours calendaires entre deux dates.',
    h1: 'Calculateur de jours entre deux dates : combien de jours ?',
    metaTitle: 'Nombre de jours entre deux dates : calculateur gratuit',
    metaDesc: 'Calculez le nombre exact de jours entre deux dates, avec les semaines, heures et la durée en années-mois-jours. Option inclure la date de fin.',
    keywords: ['nombre de jours entre deux dates', 'jours entre dates', 'combien de jours', 'calcul jours', 'écart en jours'],
    intro: [
      'Besoin de savoir <strong>combien de jours séparent deux dates</strong> ? Saisissez-les : le résultat est immédiat, avec la conversion en semaines et en heures. Les années bissextiles sont gérées automatiquement.',
    ],
    blocks: [
      { id: 'jours', fn: 'daysBetween', fields: [d('d1', 'Première date', '2025-01-01'), d('d2', 'Seconde date', '2025-12-31'), c('incl', 'Compter aussi la date de fin', false)] },
    ],
    how: [
      'Le nombre de jours est la différence entre les deux dates, calculée sur le calendrier réel. Du 1er janvier au 31 décembre d’une année ordinaire, on obtient 364 jours ; avec la date de fin comptée, 365.',
      'Les dates sont traitées sans heure et sans fuseau horaire : le passage à l’heure d’été ou d’hiver n’a donc aucun effet sur le résultat.',
    ],
    example: () => {
      const a = F.daysBetween({ d1: '2024-02-01', d2: '2024-03-01' }).raw.days, b = F.daysBetween({ d1: '2025-02-01', d2: '2025-03-01' }).raw.days;
      return `<p>Du 1er février au 1er mars : <strong>${a} jours</strong> en 2024 (année bissextile), mais <strong>${b} jours</strong> en 2025. Cette différence d’un jour illustre l’importance de travailler avec de vraies dates plutôt que d’approximer un mois à 30 jours.</p>`;
    },
    table: () => ({
      caption: 'Nombre de jours par mois',
      head: ['Mois', 'Jours', 'Mois', 'Jours'],
      rows: [0, 1, 2, 3, 4, 5].map((i) => [MONTHS[i], i === 1 ? '28 (29 si bissextile)' : String(daysInMonth(2025, i)), MONTHS[i + 6], String(daysInMonth(2025, i + 6))]),
    }),
    tips: [
      'Pour un délai légal ou contractuel, vérifiez toujours la règle de comptage prévue par le texte (premier jour exclu, dernier jour inclus, etc.).',
      'Pour un nombre de jours travaillés, passez par le calculateur de jours ouvrés, qui exclut week-ends et jours fériés.',
      'Pour ajouter un nombre de jours à une date (échéance, fin de période d’essai), utilisez le calculateur de date future.',
    ],
    faq: [
      ['Comment calculer le nombre de jours entre deux dates ?', 'Soustrayez la plus ancienne à la plus récente. Faire ce calcul à la main est piégeux à cause des mois de longueurs différentes ; l’outil s’appuie sur le calendrier réel.'],
      ['Faut-il compter le jour de départ et le jour d’arrivée ?', 'Par défaut, le résultat est l’écart entre les deux dates. Cochez « Compter aussi la date de fin » pour obtenir une période incluant les deux extrémités.'],
      ['Combien de jours y a-t-il dans une année ?', '365 jours, ou 366 les années bissextiles (divisibles par 4, sauf les années séculaires non divisibles par 400 : 2100 ne sera pas bissextile, 2000 l’était).'],
      ['L’outil fonctionne-t-il avec des dates passées et futures ?', 'Oui, dans les deux cas, entre les années 1000 et 9999.'],
    ],
    related: ['calculateur-duree', 'calculateur-semaines-entre-deux-dates', 'calculateur-jours-ouvres', 'calculateur-date-future'],
  },

  /* 10 ─────────────────────────────────────────────── */
  {
    slug: 'calculateur-jours-ouvres', cat: 'calendrier', sub: 'Jours ouvrés', popular: true,
    name: 'Calculateur de jours ouvrés',
    short: 'Jours travaillés entre deux dates, jours fériés français exclus.',
    h1: 'Calculateur de jours ouvrés : combien de jours travaillés ?',
    metaTitle: 'Calculateur de jours ouvrés et ouvrables (jours fériés)',
    metaDesc: 'Calculez le nombre de jours ouvrés ou ouvrables entre deux dates en France, en retirant week-ends et jours fériés. Détail des jours retirés.',
    keywords: ['jours ouvrés', 'jours ouvrables', 'jours travaillés', 'jours fériés', 'délai', 'préavis', 'calcul jours ouvrés'],
    intro: [
      'Délai de livraison, préavis, instruction d’un dossier : on raisonne souvent en jours ouvrés. Ce calculateur compte les <strong>jours ouvrés (du lundi au vendredi)</strong> ou les <strong>jours ouvrables (du lundi au samedi)</strong> entre deux dates, en retirant si vous le souhaitez les <strong>jours fériés français</strong>.',
    ],
    blocks: [
      {
        id: 'ouvres', fn: 'businessDays',
        fields: [
          d('d1', 'Date de début', '2025-05-01'), d('d2', 'Date de fin', '2025-05-31'),
          s('type', 'Type de jours', [{ v: 'ouvres', label: 'Jours ouvrés (lundi au vendredi)' }, { v: 'ouvrables', label: 'Jours ouvrables (lundi au samedi)' }], 'ouvres'),
          c('feries', 'Retirer les jours fériés français', true),
          c('incl', 'Compter la date de début', true),
        ],
      },
    ],
    how: [
      'Le calculateur parcourt chaque jour de la période. Il écarte les dimanches (et les samedis pour les jours ouvrés), puis, si l’option est cochée, les 11 jours fériés légaux : 1er janvier, lundi de Pâques, 1er mai, 8 mai, Ascension, lundi de Pentecôte, 14 juillet, 15 août, 1er novembre, 11 novembre et 25 décembre.',
      'Les dates mobiles (Pâques, Ascension, Pentecôte) sont calculées pour chaque année. Les jours fériés propres à l’Alsace-Moselle ou à l’outre-mer ne sont pas inclus.',
    ],
    example: () => {
      const r = F.businessDays({ d1: '2025-05-01', d2: '2025-05-31', type: 'ouvres', feries: true, incl: true });
      return `<p>En mai 2025, on compte 22 jours du lundi au vendredi. Trois d’entre eux sont fériés (jeudi 1er mai, jeudi 8 mai et jeudi 29 mai, Ascension) : il reste <strong>${r.raw.counted} jours ouvrés</strong>.</p>`;
    },
    table: () => {
      const y = refYear();
      return {
        caption: `Jours ouvrés par mois en ${y} (lundi au vendredi, jours fériés retirés)`,
        head: ['Mois', 'Jours ouvrés', 'Mois', 'Jours ouvrés'],
        rows: [0, 1, 2, 3, 4, 5].map((i) => {
          const cnt = (m) => countBusinessDays(utc(y, m, 1), utc(y, m, daysInMonth(y, m)), { holidays: true }).counted;
          return [MONTHS[i], String(cnt(i)), MONTHS[i + 6], String(cnt(i + 6))];
        }),
      };
    },
    tips: [
      'Jours ouvrés et jours ouvrables sont deux notions différentes : en droit du travail, les congés payés se comptent notamment en jours ouvrables.',
      'Les délais de livraison annoncés en « jours ouvrés » commencent généralement le lendemain de la commande : décochez « Compter la date de début » pour reproduire ce cas.',
      'Pour obtenir la date d’arrivée d’un délai exprimé en jours ouvrés, utilisez le calculateur de date future avec l’unité « jours ouvrés ».',
    ],
    faq: [
      ['Quelle est la différence entre jours ouvrés et jours ouvrables ?', 'Les jours ouvrés sont les jours normalement travaillés dans l’entreprise, en général du lundi au vendredi. Les jours ouvrables comprennent tous les jours sauf le dimanche et les jours fériés chômés, donc le samedi inclus.'],
      ['Les jours fériés sont-ils retirés automatiquement ?', 'Oui, par défaut, pour la France métropolitaine. Décochez l’option pour ne retirer que les week-ends.'],
      ['Combien y a-t-il de jours ouvrés dans une année ?', 'Environ 250 à 253 selon l’année, une fois les week-ends et les jours fériés tombant en semaine retirés. Le nombre exact dépend de l’année.'],
      ['Le calculateur gère-t-il les ponts et les congés de l’entreprise ?', 'Non, il ne connaît que le calendrier légal. Les ponts, RTT et fermetures propres à votre organisation ne sont pas pris en compte.'],
    ],
    related: ['calculateur-date-future', 'jours-feries', 'calculateur-jours-entre-deux-dates', 'calculateur-duree'],
  },

  /* 11 ─────────────────────────────────────────────── */
  {
    slug: 'calculateur-semaines-entre-deux-dates', cat: 'calendrier', sub: 'Durées',
    name: 'Calculateur de semaines entre deux dates',
    short: 'Nombre de semaines complètes et numéros de semaine ISO.',
    h1: 'Calculateur de semaines entre deux dates',
    metaTitle: 'Nombre de semaines entre deux dates : calculateur',
    metaDesc: 'Calculez le nombre de semaines entre deux dates, avec les semaines complètes, les jours restants et les numéros de semaine ISO de chaque date.',
    keywords: ['semaines entre deux dates', 'nombre de semaines', 'numéro de semaine', 'semaine ISO', 'grossesse semaines'],
    intro: [
      'Suivre un projet en semaines, une période de formation, un préavis ou une progression : ce calculateur donne le <strong>nombre de semaines entre deux dates</strong>, en semaines complètes plus jours restants, avec le numéro de semaine ISO de chacune des dates.',
    ],
    blocks: [
      { id: 'semaines', fn: 'weeksBetween', fields: [d('d1', 'Première date', '2025-01-06'), d('d2', 'Seconde date', '2025-06-30')] },
    ],
    how: [
      'Le nombre de jours entre les deux dates est divisé par 7. Le résultat est donné en semaines décimales, puis en semaines complètes et jours restants.',
      'Le numéro de semaine ISO suit la norme ISO 8601 : les semaines commencent le lundi et la semaine 1 est celle qui contient le premier jeudi de l’année.',
    ],
    example: () => {
      const r = F.weeksBetween({ d1: '2025-01-06', d2: '2025-06-30' }).raw;
      return `<p>Du 6 janvier au 30 juin 2025, ${fmt(r.days, 0)} jours s’écoulent : ${fmt(r.days, 0)} ÷ 7 = <strong>${fmt(r.weeks, 0)} semaines</strong> exactement. La seconde date appartient à la semaine ISO 27.</p>`;
    },
    table: () => ({
      caption: 'Repères : semaines et jours',
      head: ['Période', 'Semaines', 'Jours'],
      rows: [['1 mois (en moyenne)', '4,35', '30,4'], ['1 trimestre', '13', '91'], ['6 mois', '26', '182'], ['1 an', '52,14', '365'], ['1 an (bissextile)', '52,29', '366']],
    }),
    tips: [
      'Une année compte 52 semaines et 1 jour (2 jours en année bissextile) : c’est pourquoi le calendrier ISO compte parfois 53 semaines.',
      'Pour un suivi de grossesse ou de chantier, indiquez la date de début comme première date et la date du jour comme seconde.',
      'En France, les semaines sont numérotées selon la norme ISO dans la plupart des plannings professionnels.',
    ],
    faq: [
      ['Comment calculer le nombre de semaines entre deux dates ?', 'Calculez le nombre de jours entre les deux dates puis divisez par 7. Le quotient entier donne les semaines complètes et le reste les jours supplémentaires.'],
      ['Combien y a-t-il de semaines dans une année ?', 'Une année civile compte 52 semaines et 1 jour (2 jours si elle est bissextile). L’année ISO compte 52 ou 53 semaines, 2026 en comptant 53.'],
      ['Qu’est-ce que la semaine ISO ?', 'C’est le système de numérotation défini par la norme ISO 8601 : la semaine commence le lundi et la première semaine de l’année contient le premier jeudi de janvier.'],
      ['Pourquoi le 1er janvier peut-il être en semaine 52 ou 53 ?', 'Parce que la semaine ISO appartient à l’année qui contient la majorité de ses jours. Début janvier, les premiers jours peuvent donc appartenir à la dernière semaine de l’année précédente.'],
    ],
    related: ['calculateur-duree', 'calculateur-jours-entre-deux-dates', 'calculateur-date-future', 'compteur-jusqu-a-une-date'],
  },
];
