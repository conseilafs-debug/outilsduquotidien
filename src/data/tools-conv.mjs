import { FUNCTIONS as F, fmt, fmtSmart } from '../utils/calc.mjs';
import { n, s } from './fields.mjs';

const CAT = 'conversions';

/** Fabrique d'un convertisseur simple (facteur multiplicatif exact). Le contenu éditorial reste propre à chaque page. */
function conv(o) {
  const { from, to, fromSym = from, toSym = to, factor, def, vals, exV, exText, how, ctx, tips, faq, related, ...rest } = o;
  return {
    cat: CAT,
    blocks: [{ id: 'conv', fn: 'convert', params: { factor, from, to }, fields: [n('value', `Valeur en ${from}`, def, { unit: fromSym, hint: 'Saisissez un nombre entier ou décimal (virgule acceptée).' })] }],
    intro: ctx,
    how,
    example: () => {
      const y = fmtSmart(exV * factor);
      return `<p>${exText(fmtSmart(exV), y)}</p>`;
    },
    table: () => ({
      caption: `Conversion rapide : ${from} en ${to}`,
      head: [`${from[0].toUpperCase() + from.slice(1)} (${fromSym})`, `${to[0].toUpperCase() + to.slice(1)} (${toSym})`],
      rows: vals.map((v) => [`${fmtSmart(v)} ${fromSym}`, `${fmtSmart(v * factor)} ${toSym}`]),
    }),
    tips, faq, related,
    ...rest,
  };
}

export const conversionTools = [
  /* 30 */
  conv({
    slug: 'convertisseur-pouces-cm', sub: 'Longueur', popular: true,
    name: 'Pouces en centimètres', short: 'Convertir des pouces (inches) en centimètres.',
    h1: 'Convertisseur pouces en cm : convertissez des pouces en centimètres',
    metaTitle: 'Convertisseur pouces en cm (inches vers centimètres)',
    metaDesc: 'Convertissez des pouces en centimètres instantanément : 1 pouce = 2,54 cm exactement. Tableau de conversion pour les écrans, tuyaux et pneus.',
    keywords: ['pouces', 'cm', 'inch', 'inches', 'pouce en cm', 'taille écran', 'convertir pouces'],
    from: 'pouces', to: 'cm', toSym: 'cm', fromSym: 'in', factor: 2.54, def: '27',
    vals: [1, 2, 5, 10, 12, 15, 24, 27, 32, 43, 55, 65],
    ctx: [
      'Écrans de télévision et d’ordinateur, diamètres de tuyauterie, jantes, outils : beaucoup de dimensions sont encore annoncées en pouces (symbole ″ ou « in »). Saisissez une valeur en pouces pour obtenir sa longueur en centimètres.',
    ],
    how: ['Le pouce international est défini depuis 1959 comme valant exactement <strong>2,54 centimètres</strong>. La formule est donc : centimètres = pouces × 2,54.', 'Pour obtenir des millimètres, multipliez par 25,4 : un pouce fait 25,4 mm.'],
    exV: 27, exText: (x, y) => `Un moniteur de ${x} pouces mesure ${x} × 2,54 = <strong>${y} cm</strong> en diagonale, pas en largeur. Un téléviseur de 55 pouces a donc une diagonale de 139,7 cm.`,
    tips: ['Pour un écran, la taille en pouces désigne la diagonale de la dalle : la largeur est inférieure, d’environ 87 % de la diagonale pour un format 16/9.', 'Pour un tuyau, un pouce désigne souvent une dénomination commerciale (par exemple « 1 pouce » ou 1″) et non la mesure exacte du diamètre.', 'Pour des fractions de pouce (1/2, 3/4), convertissez-les d’abord en décimal : 0,5 ou 0,75.'],
    faq: [
      ['Combien font 1 pouce en cm ?', '1 pouce fait exactement 2,54 cm, soit 25,4 mm.'],
      ['Comment convertir des pouces en centimètres ?', 'Multipliez la valeur en pouces par 2,54. Par exemple 10 pouces = 25,4 cm.'],
      ['Pourquoi la taille d’un écran se donne-t-elle en pouces ?', 'C’est une convention héritée de l’industrie des tubes cathodiques, restée en vigueur dans le monde entier pour les téléviseurs et les moniteurs.'],
      ['Que représente le symbole ″ ?', 'Le double prime (″) est le symbole du pouce, comme dans 32″. Le simple prime (′) désigne le pied.'],
    ],
    related: ['convertisseur-cm-pouces', 'convertisseur-metres-pieds', 'convertisseur-pieds-metres', 'calculateur-surface'],
  }),

  /* 31 */
  conv({
    slug: 'convertisseur-cm-pouces', sub: 'Longueur',
    name: 'Centimètres en pouces', short: 'Convertir des centimètres en pouces (inches).',
    h1: 'Convertisseur cm en pouces : convertissez des centimètres en pouces',
    metaTitle: 'Convertisseur cm en pouces (centimètres vers inches)',
    metaDesc: 'Convertissez des centimètres en pouces (inches) en un clic. 1 cm = 0,3937 pouce. Pratique pour acheter des produits aux dimensions anglo-saxonnes.',
    keywords: ['cm en pouces', 'centimètres en pouces', 'inch', 'convertir cm', 'taille bagage', 'cadre photo'],
    from: 'cm', to: 'pouces', toSym: 'in', fromSym: 'cm', factor: 1 / 2.54, def: '55',
    vals: [1, 5, 10, 20, 30, 40, 50, 55, 80, 100, 150, 200],
    ctx: [
      'Vous achetez un produit sur un site étranger, un cadre, un bagage ou un meuble dont les dimensions sont en pouces ? À l’inverse, vous voulez comparer vos centimètres aux tailles anglo-saxonnes. Saisissez des centimètres pour obtenir les pouces correspondants.',
    ],
    how: ['Un pouce vaut exactement 2,54 cm, donc : pouces = centimètres ÷ 2,54, ou centimètres × 0,3937.', 'Le résultat est donné en pouces décimaux. Pour connaître la fraction, multipliez la partie décimale par 16 pour obtenir des seizièmes de pouce.'],
    exV: 55, exText: (x, y) => `La taille maximale d’un bagage cabine de ${x} cm correspond à ${x} ÷ 2,54 = <strong>${y} pouces</strong>. Un cadre photo de 30 × 40 cm fait environ 11,8 × 15,7 pouces, proche du format américain 12 × 16.`,
    tips: ['Pour comparer des tailles de vêtements ou de chaussures, les pouces ne suffisent pas : chaque pays a sa propre grille de tailles.', 'Arrondissez au quart de pouce le plus proche pour une mesure pratique (0,25, 0,5, 0,75).', 'Pour des dimensions de bagage, vérifiez les règles de la compagnie aérienne : elles incluent souvent roues et poignées.'],
    faq: [
      ['Combien de pouces font 100 cm ?', '100 cm font 39,37 pouces, soit 3 pieds et 3,37 pouces.'],
      ['Comment convertir des cm en pouces ?', 'Divisez le nombre de centimètres par 2,54. Pour 50 cm : 50 ÷ 2,54 ≈ 19,69 pouces.'],
      ['Comment passer d’un nombre décimal de pouces à une fraction ?', 'Multipliez la partie décimale par 16 : 0,69 × 16 ≈ 11, donc 19 11/16 pouces.'],
      ['Combien de pouces dans un mètre ?', 'Un mètre équivaut à 39,3701 pouces.'],
    ],
    related: ['convertisseur-pouces-cm', 'convertisseur-metres-pieds', 'convertisseur-pieds-metres', 'calculateur-surface'],
  }),

  /* 32 */
  conv({
    slug: 'convertisseur-metres-pieds', sub: 'Longueur',
    name: 'Mètres en pieds', short: 'Convertir des mètres en pieds (feet).',
    h1: 'Convertisseur mètres en pieds : convertissez des mètres en feet',
    metaTitle: 'Convertisseur mètres en pieds (m vers feet)',
    metaDesc: 'Convertissez des mètres en pieds (feet) : 1 m = 3,2808 pieds. Idéal pour une taille, une altitude, une hauteur de plafond ou un niveau de vol.',
    keywords: ['mètres en pieds', 'm en feet', 'pieds', 'feet', 'altitude', 'taille en pieds', 'convertir mètres'],
    from: 'mètres', to: 'pieds', toSym: 'ft', fromSym: 'm', factor: 1 / 0.3048, def: '1.8',
    vals: [0.5, 1, 1.5, 1.7, 1.8, 2, 2.5, 10, 50, 100, 1000],
    ctx: [
      'Les pieds (feet, symbole ft) restent utilisés dans les pays anglo-saxons pour les tailles, les hauteurs de plafond et surtout l’aviation, où les altitudes se comptent en pieds. Saisissez des mètres pour obtenir leur équivalent.',
    ],
    how: ['Un pied vaut exactement 0,3048 mètre. La conversion est donc : pieds = mètres ÷ 0,3048, soit mètres × 3,28084.', 'Pour une taille exprimée en « pieds et pouces », multipliez la partie décimale du résultat par 12 pour obtenir les pouces.'],
    exV: 1.8, exText: (x, y) => `Une personne de ${x} m mesure ${y} pieds, c’est-à-dire environ <strong>5 pieds et 11 pouces</strong> (5′11″). Une altitude de 1 000 m équivaut à 3 280,84 pieds.`,
    tips: ['Pour une taille, ne confondez pas 5,9 pieds (décimal) et 5 pieds 9 pouces (5′9″) : ce ne sont pas les mêmes valeurs.', 'En aviation, les altitudes de vol sont données en pieds ; 1 000 pieds représentent environ 305 m.', 'Pour une surface, les pieds carrés (square feet) ne se convertissent pas comme les pieds : 1 m² vaut environ 10,76 pieds carrés.'],
    faq: [
      ['Combien de pieds font 1 mètre ?', '1 mètre fait 3,28084 pieds, soit 39,37 pouces.'],
      ['Comment convertir des mètres en pieds ?', 'Multipliez les mètres par 3,28084. Pour 10 m : 32,81 pieds.'],
      ['Comment exprimer une taille en pieds et pouces ?', 'Prenez la partie entière du résultat pour les pieds, puis multipliez la partie décimale par 12. 1,75 m = 5,74 pieds = 5 pieds et 8,9 pouces.'],
      ['Pourquoi l’aviation utilise-t-elle des pieds ?', 'Pour des raisons historiques et de normalisation internationale : les altitudes et niveaux de vol sont exprimés en pieds dans la plupart des pays.'],
    ],
    related: ['convertisseur-pieds-metres', 'convertisseur-pouces-cm', 'convertisseur-cm-pouces', 'calculateur-pente'],
  }),

  /* 33 */
  conv({
    slug: 'convertisseur-pieds-metres', sub: 'Longueur',
    name: 'Pieds en mètres', short: 'Convertir des pieds (feet) en mètres.',
    h1: 'Convertisseur pieds en mètres : convertissez des feet en mètres',
    metaTitle: 'Convertisseur pieds en mètres (feet vers m)',
    metaDesc: 'Convertissez des pieds (feet) en mètres : 1 pied = 0,3048 m exactement. Pratique pour une taille, une altitude ou une dimension de pièce américaine.',
    keywords: ['pieds en mètres', 'feet en mètres', 'ft en m', 'taille', 'altitude', 'convertir pieds'],
    from: 'pieds', to: 'mètres', toSym: 'm', fromSym: 'ft', factor: 0.3048, def: '6',
    vals: [1, 2, 3, 5, 6, 7, 10, 20, 50, 100, 1000],
    ctx: [
      'Annonce immobilière américaine, fiche d’un sportif, altitude d’un sommet ou profondeur d’un plan d’eau : les pieds sont partout dans les sources anglo-saxonnes. Saisissez une valeur en pieds pour obtenir des mètres.',
    ],
    how: ['Un pied est égal à exactement 0,3048 m (12 pouces × 2,54 cm = 30,48 cm). La formule est : mètres = pieds × 0,3048.', 'Pour une taille donnée en pieds et pouces, convertissez d’abord les pouces en fraction de pied : 5′9″ = 5 + 9/12 = 5,75 pieds.'],
    exV: 6, exText: (x, y) => `Un joueur de basket de ${x} pieds mesure ${x} × 0,3048 = <strong>${y} m</strong>. Une taille de 5′9″ (5,75 pieds) correspond à 1,75 m.`,
    tips: ['Pour une taille donnée en pieds et pouces, convertissez d’abord en pieds décimaux avant d’utiliser le calculateur.', 'Pour une pièce américaine en square feet (pieds carrés), il faut multiplier par 0,0929 pour obtenir des m².', 'Vérifiez le contexte : un « foot » est parfois précisé en « survey foot » dans les relevés topographiques américains, très proche du pied international.'],
    faq: [
      ['Combien de mètres font 1 pied ?', '1 pied fait exactement 0,3048 m, soit 30,48 cm.'],
      ['Comment convertir des pieds en mètres ?', 'Multipliez le nombre de pieds par 0,3048. Pour 10 pieds : 3,048 m.'],
      ['Combien de pouces dans un pied ?', '12 pouces, soit 12 × 2,54 = 30,48 cm.'],
      ['Combien de pieds dans un mille ?', 'Un mille terrestre (mile) vaut 5 280 pieds, soit 1 609,344 m.'],
    ],
    related: ['convertisseur-metres-pieds', 'convertisseur-pouces-cm', 'convertisseur-cm-pouces', 'calculateur-surface'],
  }),

  /* 34 */
  conv({
    slug: 'convertisseur-kg-livres', sub: 'Poids', popular: true,
    name: 'Kilogrammes en livres', short: 'Convertir des kilogrammes en livres (pounds).',
    h1: 'Convertisseur kg en livres : convertissez des kilogrammes en pounds',
    metaTitle: 'Convertisseur kg en livres (kilogrammes vers pounds)',
    metaDesc: 'Convertissez des kilogrammes en livres (pounds, lb) : 1 kg = 2,2046 lb. Pour un poids corporel, une haltère, un bagage ou une recette américaine.',
    keywords: ['kg en livres', 'kilos en pounds', 'lbs', 'pounds', 'poids', 'convertir kg', 'haltères'],
    from: 'kg', to: 'livres', toSym: 'lb', fromSym: 'kg', factor: 1 / 0.45359237, def: '70',
    vals: [1, 5, 10, 20, 23, 50, 60, 70, 80, 90, 100],
    ctx: [
      'Poids corporel dans une application américaine, disques de musculation, franchise de bagage ou colis : les livres (pounds, symbole lb) sont l’unité de masse courante aux États-Unis et au Royaume-Uni. Saisissez des kilogrammes pour obtenir les livres.',
    ],
    how: ['La livre avoirdupois vaut exactement 0,45359237 kg. La formule est donc : livres = kilogrammes ÷ 0,45359237, soit kg × 2,20462.', 'Pour obtenir des onces, multipliez les livres par 16 : une livre contient 16 onces.'],
    exV: 70, exText: (x, y) => `Une personne de ${x} kg pèse environ <strong>${y} livres</strong>. Une barre olympique de 20 kg fait 44,09 lb, et un bagage de 23 kg environ 50,7 lb : proche de la limite de 50 lb de nombreuses compagnies américaines.`,
    tips: ['Au Royaume-Uni, le poids corporel se donne souvent en « stones » : 1 stone vaut 14 livres, soit 6,35 kg.', 'Pour retrouver le poids d’une pièce en grammes, passez d’abord les kilogrammes en grammes.', 'Pour une recette américaine, le beurre se vend en « sticks » de 1/4 de livre, soit environ 113 g.'],
    faq: [
      ['Combien de livres font 1 kg ?', '1 kg fait 2,20462 livres (lb).'],
      ['Comment convertir des kg en livres ?', 'Multipliez par 2,20462. Pour 80 kg : 80 × 2,20462 = 176,37 lb.'],
      ['Quelle différence entre « lb » et « lbs » ?', 'lb est le symbole de la livre (du latin libra). « lbs » est son pluriel usuel en anglais ; les deux désignent la même unité.'],
      ['Une livre française est-elle la même chose ?', 'Non : dans le langage courant français, une « livre » désigne souvent 500 g. La livre anglo-saxonne vaut 453,59 g.'],
    ],
    related: ['convertisseur-livres-kg', 'convertisseur-grammes-kg', 'calculateur-pourcentage', 'calculateur-regle-de-trois'],
  }),

  /* 35 */
  conv({
    slug: 'convertisseur-livres-kg', sub: 'Poids',
    name: 'Livres en kilogrammes', short: 'Convertir des livres (pounds) en kilogrammes.',
    h1: 'Convertisseur livres en kg : convertissez des pounds en kilogrammes',
    metaTitle: 'Convertisseur livres en kg (pounds vers kilogrammes)',
    metaDesc: 'Convertissez des livres (pounds, lb) en kilogrammes : 1 lb = 0,4536 kg. Pratique pour un poids américain, un colis ou une recette de cuisine.',
    keywords: ['livres en kg', 'pounds en kilos', 'lb en kg', 'lbs', 'poids américain', 'convertir pounds'],
    from: 'livres', to: 'kg', toSym: 'kg', fromSym: 'lb', factor: 0.45359237, def: '150',
    vals: [1, 2, 5, 10, 25, 50, 100, 150, 180, 200, 250],
    ctx: [
      'Poids annoncé sur un site américain, étiquette de colis, programme de musculation ou recette : les livres (pounds) doivent souvent être converties en kilogrammes. Saisissez la valeur en livres pour obtenir le résultat en kg.',
    ],
    how: ['Une livre (lb) vaut exactement 0,45359237 kg. La formule est : kilogrammes = livres × 0,45359237.', 'Pour obtenir des grammes, multipliez les livres par 453,59 : 1 lb = 453,59 g, et 1 once (oz) = 28,35 g.'],
    exV: 150, exText: (x, y) => `Un poids de ${x} lb correspond à ${x} × 0,45359 = <strong>${y} kg</strong>. Une livre de beurre dans une recette américaine représente 453,59 g.`,
    tips: ['Pour estimer rapidement, divisez les livres par 2,2 : 100 lb ≈ 45,5 kg.', 'Pour une recette, retenez que 1 lb = 16 oz et que 1 oz ≈ 28 g.', 'Pour des poids en « stones » (Royaume-Uni), multipliez d’abord par 14 pour obtenir des livres.'],
    faq: [
      ['Combien de kg font 1 livre ?', '1 livre (lb) fait 0,45359237 kg, soit environ 454 g.'],
      ['Comment convertir des livres en kilogrammes ?', 'Multipliez le nombre de livres par 0,45359. 200 lb = 90,72 kg.'],
      ['Combien de livres pour 1 kg ?', 'Environ 2,2 livres (2,20462 lb exactement).'],
      ['Combien d’onces dans une livre ?', '16 onces. Une once fait 28,35 g.'],
    ],
    related: ['convertisseur-kg-livres', 'convertisseur-grammes-kg', 'calculateur-regle-de-trois', 'calculateur-pourcentage'],
  }),

  /* 36 */
  conv({
    slug: 'convertisseur-grammes-kg', sub: 'Poids',
    name: 'Grammes en kilogrammes', short: 'Convertir des grammes en kilogrammes.',
    h1: 'Convertisseur grammes en kg : convertissez des g en kilogrammes',
    metaTitle: 'Convertisseur grammes en kg (g vers kilogrammes)',
    metaDesc: 'Convertissez des grammes en kilogrammes : 1 000 g = 1 kg. Idéal pour la cuisine, l’affranchissement d’un colis ou la lecture d’une balance.',
    keywords: ['grammes en kg', 'g en kg', 'convertir grammes', 'poids colis', 'balance cuisine', 'kilos'],
    from: 'grammes', to: 'kg', toSym: 'kg', fromSym: 'g', factor: 0.001, def: '2750',
    vals: [1, 10, 100, 250, 500, 750, 1000, 1500, 2500, 5000, 10000],
    ctx: [
      'Colis à affranchir, recette, poids d’un bébé ou d’un fruit : on passe sans cesse des grammes aux kilogrammes. Saisissez un poids en grammes pour obtenir sa valeur en kilogrammes, en décimal.',
    ],
    how: ['Le kilogramme vaut 1 000 grammes. La formule est : kilogrammes = grammes ÷ 1 000. Il suffit de décaler la virgule de trois rangs vers la gauche.', 'Dans l’autre sens, pour passer des kilogrammes aux grammes, multipliez par 1 000.'],
    exV: 2750, exText: (x, y) => `Un colis de ${x} g pèse <strong>${y} kg</strong>. Un paquet de farine de 500 g correspond à 0,5 kg, et un sac de 25 kg équivaut à 25 000 g.`,
    tips: ['Pour les tarifs postaux, les tranches de poids sont définies : arrondissez toujours au gramme supérieur avant de comparer.', 'Un millilitre d’eau pèse environ 1 g : 1 litre d’eau pèse donc environ 1 kg.', 'Pour de très petites masses, 1 gramme = 1 000 milligrammes.'],
    faq: [
      ['Combien de grammes dans un kilo ?', '1 kilogramme = 1 000 grammes.'],
      ['Comment convertir des grammes en kilos ?', 'Divisez par 1 000. 3 500 g = 3,5 kg.'],
      ['Combien de kg font 500 g ?', '0,5 kg, soit un demi-kilo (ce que l’on appelle familièrement une livre).'],
      ['Combien de kilos dans une tonne ?', 'Une tonne équivaut à 1 000 kg, soit 1 000 000 g.'],
    ],
    related: ['convertisseur-kg-livres', 'convertisseur-livres-kg', 'convertisseur-litres-cl', 'calculateur-regle-de-trois'],
  }),

  /* 37 */
  conv({
    slug: 'convertisseur-litres-cl', sub: 'Volume',
    name: 'Litres en centilitres', short: 'Convertir des litres en centilitres.',
    h1: 'Convertisseur litres en cl : convertissez des litres en centilitres',
    metaTitle: 'Convertisseur litres en cl (litres vers centilitres)',
    metaDesc: 'Convertissez des litres en centilitres : 1 L = 100 cl. Pratique pour les recettes de cuisine, les boissons et les contenances de bouteilles.',
    keywords: ['litres en cl', 'l en cl', 'centilitres', 'convertir litres', 'contenance bouteille', 'recette'],
    from: 'litres', to: 'cl', toSym: 'cl', fromSym: 'L', factor: 100, def: '0.75',
    vals: [0.1, 0.25, 0.33, 0.5, 0.75, 1, 1.5, 2, 5, 10],
    ctx: [
      'Les recettes parlent en centilitres, les bouteilles en litres, et il faut parfois passer de l’un à l’autre. Saisissez des litres pour obtenir les centilitres correspondants, ou utilisez le tableau pour les contenances courantes.',
    ],
    how: ['Le centilitre est le centième du litre : 1 L = 100 cl. La formule est : centilitres = litres × 100, ce qui revient à décaler la virgule de deux rangs vers la droite.', 'Un décilitre (dl) vaut 10 cl : 1 L = 10 dl.'],
    exV: 0.75, exText: (x, y) => `Une bouteille de vin de ${x} L contient <strong>${y} cl</strong>. Une bouteille d’eau de 1,5 L fait 150 cl, et une canette de 33 cl correspond à 0,33 L.`,
    tips: ['Pour une recette, 1 litre de lait se mesure aussi en dl : 10 dl.', 'Les contenances courantes : 25 cl (petit verre), 33 cl (canette), 50 cl (bouteille individuelle), 75 cl (bouteille de vin), 1 L (brique).', 'Pour un volume en millilitres, passez des cl aux ml en multipliant encore par 10.'],
    faq: [
      ['Combien de cl dans un litre ?', '1 litre = 100 centilitres.'],
      ['Comment convertir des litres en centilitres ?', 'Multipliez par 100. 0,25 L = 25 cl.'],
      ['Combien de litres font 75 cl ?', '0,75 litre, la contenance standard d’une bouteille de vin.'],
      ['Combien de cl dans un verre ?', 'Un verre d’eau fait en général 20 à 25 cl. La quantité exacte dépend du verre.'],
    ],
    related: ['convertisseur-cl-ml', 'convertisseur-m3-litres', 'convertisseur-litres-gallons', 'calculateur-volume'],
  }),

  /* 38 */
  conv({
    slug: 'convertisseur-cl-ml', sub: 'Volume',
    name: 'Centilitres en millilitres', short: 'Convertir des centilitres en millilitres.',
    h1: 'Convertisseur cl en ml : convertissez des centilitres en millilitres',
    metaTitle: 'Convertisseur cl en ml (centilitres vers millilitres)',
    metaDesc: 'Convertissez des centilitres en millilitres : 1 cl = 10 ml. Utile pour les recettes, les doses de boissons et les contenances de petits flacons.',
    keywords: ['cl en ml', 'centilitres en millilitres', 'convertir cl', 'cuillère à soupe', 'dose', 'recette'],
    from: 'cl', to: 'ml', toSym: 'ml', fromSym: 'cl', factor: 10, def: '33',
    vals: [1, 2, 4, 5, 10, 20, 25, 33, 50, 75, 100],
    ctx: [
      'Doses de sirop, dosettes, canettes ou recettes précises : on passe des centilitres aux millilitres pour gagner en précision. Saisissez une valeur en cl pour obtenir son équivalent en ml.',
    ],
    how: ['1 centilitre vaut 10 millilitres. La formule est : millilitres = centilitres × 10 : on décale la virgule d’un rang vers la droite.', 'Un millilitre équivaut à 1 cm³, ce qui permet de passer facilement à des volumes en centimètres cubes.'],
    exV: 33, exText: (x, y) => `Une canette de ${x} cl contient <strong>${y} ml</strong>. Un verre de 25 cl correspond à 250 ml, et une cuillère à soupe, d’environ 1,5 cl, représente à peu près 15 ml.`,
    tips: ['Pour des médicaments liquides, utilisez le doseur fourni plutôt qu’une cuillère de cuisine : les volumes varient d’une cuillère à l’autre.', 'Une cuillère à café fait environ 5 ml, une cuillère à soupe environ 15 ml (valeurs indicatives).', 'Pour passer à des litres, divisez les millilitres par 1 000.'],
    faq: [
      ['Combien de ml dans un cl ?', '1 cl = 10 ml.'],
      ['Comment convertir des cl en ml ?', 'Multipliez par 10. 25 cl = 250 ml.'],
      ['Combien de ml font 1 litre ?', '1 000 ml, soit 100 cl.'],
      ['Un ml est-il égal à 1 cm³ ?', 'Oui : 1 millilitre = 1 centimètre cube.'],
    ],
    related: ['convertisseur-litres-cl', 'convertisseur-m3-litres', 'convertisseur-litres-gallons', 'calculateur-volume'],
  }),

  /* 39 */
  {
    cat: CAT, sub: 'Volume', slug: 'convertisseur-litres-gallons',
    name: 'Litres en gallons', short: 'Convertir des litres en gallons US ou impériaux.',
    h1: 'Convertisseur litres en gallons : gallons US et gallons impériaux',
    metaTitle: 'Convertisseur litres en gallons (US et impérial)',
    metaDesc: 'Convertissez des litres en gallons US ou impériaux (UK) et inversement. 1 gallon US = 3,785 L ; 1 gallon impérial = 4,546 L. Formules et consommation en mpg.',
    keywords: ['litres en gallons', 'gallons', 'gallon US', 'gallon impérial', 'carburant', 'mpg', 'convertir litres'],
    blocks: [
      { id: 'lg', title: 'Litres vers gallons', fn: 'gallons', params: { dir: 'l2g' }, fields: [n('value', 'Volume en litres', '50', { unit: 'L' }), s('type', 'Type de gallon', [{ v: 'us', label: 'Gallon américain (US)' }, { v: 'uk', label: 'Gallon impérial (UK)' }], 'us')] },
      { id: 'gl', title: 'Gallons vers litres', fn: 'gallons', params: { dir: 'g2l' }, fields: [n('value', 'Volume en gallons', '10', { unit: 'gal' }), s('type', 'Type de gallon', [{ v: 'us', label: 'Gallon américain (US)' }, { v: 'uk', label: 'Gallon impérial (UK)' }], 'us')] },
    ],
    intro: [
      'Prix de l’essence aux États-Unis, capacité d’un réservoir, consommation d’un véhicule : le gallon n’est pas le même partout. Le <strong>gallon américain</strong> vaut environ 3,785 litres, le <strong>gallon impérial</strong> (Royaume-Uni) environ 4,546 litres. Choisissez le bon type avant de convertir.',
    ],
    how: [
      'Gallon US = 3,785411784 L ; gallon impérial = 4,54609 L. Gallons = litres ÷ ces valeurs ; litres = gallons × ces valeurs.',
      'Pour une consommation, L/100 km = 235,215 ÷ mpg (miles par gallon US) ou 282,481 ÷ mpg (miles par gallon impérial).',
    ],
    example: () => {
      const us = F.gallons({ value: 50, type: 'us', dir: 'l2g' }).raw.r, uk = F.gallons({ value: 50, type: 'uk', dir: 'l2g' }).raw.r;
      return `<p>Un réservoir de 50 L contient ${fmt(us, 2)} gallons américains ou ${fmt(uk, 2)} gallons impériaux. Une voiture annoncée à 30 mpg (US) consomme 235,215 ÷ 30 = 7,84 L/100 km.</p>`;
    },
    table: () => ({
      caption: 'Litres en gallons',
      head: ['Litres', 'Gallons US', 'Gallons impériaux'],
      rows: [1, 5, 10, 20, 40, 50, 60, 100].map((l) => [`${l} L`, fmt(F.gallons({ value: l, type: 'us', dir: 'l2g' }).raw.r, 3), fmt(F.gallons({ value: l, type: 'uk', dir: 'l2g' }).raw.r, 3)]),
    }),
    tips: [
      'Avant de comparer une consommation « mpg », vérifiez si elle est donnée en gallons américains ou impériaux : l’écart atteint environ 20 %.',
      'Aux États-Unis, l’essence se vend au gallon ; au Royaume-Uni, au litre depuis longtemps, mais les consommations restent exprimées en mpg impériaux.',
      'Le gallon américain contient 4 quarts de 0,946 L ; le gallon impérial 4 quarts de 1,137 L.',
    ],
    faq: [
      ['Combien de litres dans un gallon ?', 'Un gallon américain équivaut à 3,785 L ; un gallon impérial à 4,546 L.'],
      ['Comment convertir des litres en gallons ?', 'Divisez les litres par 3,785 pour des gallons US, ou par 4,546 pour des gallons impériaux.'],
      ['Quelle est la différence entre gallon US et gallon impérial ?', 'Ils n’ont pas la même taille : le gallon impérial est environ 20 % plus grand que le gallon américain.'],
      ['Comment convertir des mpg en L/100 km ?', 'Divisez 235,215 par la valeur en mpg américains (ou 282,481 pour des mpg impériaux). Par exemple, 25 mpg US = 9,41 L/100 km.'],
    ],
    related: ['convertisseur-litres-cl', 'convertisseur-m3-litres', 'convertisseur-mph-kmh', 'calculateur-volume'],
  },

  /* 40 */
  {
    cat: CAT, sub: 'Température', slug: 'convertisseur-celsius-fahrenheit', popular: true,
    name: 'Celsius en Fahrenheit', short: 'Convertir des degrés Celsius en degrés Fahrenheit.',
    h1: 'Convertisseur Celsius en Fahrenheit : °C vers °F',
    metaTitle: 'Convertisseur Celsius en Fahrenheit (°C vers °F)',
    metaDesc: 'Convertissez des degrés Celsius en degrés Fahrenheit avec la formule °F = °C × 9/5 + 32. Table de conversion pour la météo, la cuisine et la santé.',
    keywords: ['celsius en fahrenheit', 'c en f', 'degrés', 'température', 'four', 'météo', 'convertir température'],
    blocks: [{ id: 'cf', fn: 'convertTemp', params: { kind: 'c2f' }, fields: [n('value', 'Température en degrés Celsius', '20', { unit: '°C', hint: 'Les valeurs négatives sont acceptées (par exemple -5).' })] }],
    intro: ['La température se mesure en degrés Celsius en France, mais en degrés Fahrenheit aux États-Unis. Saisissez une température en °C pour obtenir son équivalent en °F, ainsi que sa valeur en kelvins.'],
    how: [
      'La formule est : <strong>°F = °C × 9 ÷ 5 + 32</strong>. On multiplie par 1,8 puis on ajoute 32.',
      'Repères : l’eau gèle à 0 °C = 32 °F et bout à 100 °C = 212 °F (à pression atmosphérique normale). Les deux échelles se rejoignent à −40 °.',
    ],
    example: () => {
      const a = F.convertTemp({ value: 20, kind: 'c2f' }).raw.r, b = F.convertTemp({ value: 180, kind: 'c2f' }).raw.r;
      return `<p>Une température ambiante de 20 °C vaut 20 × 1,8 + 32 = <strong>${fmt(a)} °F</strong>. Un four à 180 °C (thermostat 6) correspond à <strong>${fmt(b)} °F</strong>, et la température du corps humain de 37 °C à 98,6 °F.</p>`;
    },
    table: () => ({
      caption: 'Table de conversion Celsius → Fahrenheit',
      head: ['Degrés Celsius', 'Degrés Fahrenheit', 'Repère'],
      rows: [[-40, 'point commun des deux échelles'], [-18, 'température d’un congélateur'], [0, 'gel de l’eau'], [4, 'réfrigérateur'], [20, 'température ambiante'], [37, 'corps humain'], [100, 'ébullition de l’eau'], [150, 'four doux'], [180, 'four (thermostat 6)'], [200, 'four chaud'], [220, 'four très chaud']].map(([c, r]) => [`${c} °C`, `${fmt(c * 9 / 5 + 32, 1)} °F`, r]),
    }),
    tips: [
      'Pour une estimation mentale, doublez les degrés Celsius et ajoutez 30 : 20 °C ≈ 70 °F (le calcul exact donne 68 °F).',
      'Pour un four américain, convertissez la température de la recette en °C, puis arrondissez au thermostat le plus proche.',
      'Les températures négatives en Celsius deviennent négatives en Fahrenheit en dessous de −17,8 °C environ.',
    ],
    faq: [
      ['Quelle est la formule pour convertir des °C en °F ?', '°F = °C × 9 ÷ 5 + 32. Pour 25 °C : 25 × 1,8 + 32 = 77 °F.'],
      ['Combien font 0 °C en Fahrenheit ?', '32 °F, le point de congélation de l’eau.'],
      ['Combien font 37 °C en Fahrenheit ?', '98,6 °F, la température corporelle de référence.'],
      ['Pourquoi les États-Unis utilisent-ils le Fahrenheit ?', 'C’est un héritage historique : les États-Unis n’ont jamais adopté officiellement le système métrique pour la vie courante, dont la température.'],
    ],
    related: ['convertisseur-fahrenheit-celsius', 'convertisseur-kmh-mph', 'convertisseur-litres-gallons', 'calculateur-pente'],
  },

  /* 41 */
  {
    cat: CAT, sub: 'Température', slug: 'convertisseur-fahrenheit-celsius',
    name: 'Fahrenheit en Celsius', short: 'Convertir des degrés Fahrenheit en degrés Celsius.',
    h1: 'Convertisseur Fahrenheit en Celsius : °F vers °C',
    metaTitle: 'Convertisseur Fahrenheit en Celsius (°F vers °C)',
    metaDesc: 'Convertissez des degrés Fahrenheit en degrés Celsius avec la formule °C = (°F − 32) × 5/9. Idéal pour les recettes américaines et la météo.',
    keywords: ['fahrenheit en celsius', 'f en c', 'degrés fahrenheit', 'four américain', 'recette américaine', 'météo américaine'],
    blocks: [{ id: 'fc', fn: 'convertTemp', params: { kind: 'f2c' }, fields: [n('value', 'Température en degrés Fahrenheit', '350', { unit: '°F', hint: 'Les valeurs négatives sont acceptées.' })] }],
    intro: ['Recette américaine qui demande un four à 350 °F, bulletin météo de New York ou thermomètre importé : saisissez une température en degrés Fahrenheit pour la convertir en degrés Celsius.'],
    how: [
      'La formule est : <strong>°C = (°F − 32) × 5 ÷ 9</strong>. On retire 32, puis on multiplie par 5 et on divise par 9.',
      'Repères : 32 °F = 0 °C, 212 °F = 100 °C, et −40 °F = −40 °C.',
    ],
    example: () => {
      const a = F.convertTemp({ value: 350, kind: 'f2c' }).raw.r, b = F.convertTemp({ value: 77, kind: 'f2c' }).raw.r;
      return `<p>Un four à 350 °F correspond à (350 − 32) × 5 ÷ 9 = <strong>${fmt(a, 1)} °C</strong>, que l’on règle sur 175 à 180 °C. Une journée à 77 °F fait <strong>${fmt(b)} °C</strong>.</p>`;
    },
    table: () => ({
      caption: 'Table de conversion Fahrenheit → Celsius',
      head: ['Degrés Fahrenheit', 'Degrés Celsius', 'Repère'],
      rows: [[0, 'très froid'], [32, 'gel de l’eau'], [50, 'frais'], [68, 'température ambiante'], [77, 'chaud'], [98.6, 'corps humain'], [212, 'ébullition de l’eau'], [325, 'four doux'], [350, 'four moyen (recettes US)'], [375, 'four moyen-chaud'], [400, 'four chaud'], [450, 'four très chaud']].map(([f, r]) => [`${f} °F`, `${fmt((f - 32) * 5 / 9, 1)} °C`, r]),
    }),
    tips: [
      'Pour une estimation mentale, soustrayez 30 puis divisez par 2 : 80 °F ≈ 25 °C (le calcul exact donne 26,7 °C).',
      'Pour un four, arrondissez au palier le plus proche proposé par votre appareil (par exemple 175 ou 180 °C pour 350 °F).',
      'Vérifiez qu’une température de four n’est pas déjà exprimée en « gas mark » (échelle britannique), qui est une autre graduation.',
    ],
    faq: [
      ['Quelle est la formule pour convertir des °F en °C ?', '°C = (°F − 32) × 5 ÷ 9. Pour 100 °F : 68 × 5 ÷ 9 = 37,8 °C.'],
      ['Combien font 350 °F en Celsius ?', 'Environ 176,7 °C, que l’on arrondit à 175 ou 180 °C pour un four.'],
      ['Combien font 98,6 °F en Celsius ?', '37 °C, la température corporelle moyenne de référence.'],
      ['Pourquoi −40 est-il identique dans les deux échelles ?', 'C’est la seule température où le calcul donne le même résultat : (−40 − 32) × 5 ÷ 9 = −40.'],
    ],
    related: ['convertisseur-celsius-fahrenheit', 'convertisseur-mph-kmh', 'convertisseur-kg-livres', 'convertisseur-litres-gallons'],
  },

  /* 42 */
  conv({
    slug: 'convertisseur-kmh-mph', sub: 'Vitesse',
    name: 'Km/h en mph', short: 'Convertir des km/h en miles par heure.',
    h1: 'Convertisseur km/h en mph : convertissez des kilomètres par heure en miles par heure',
    metaTitle: 'Convertisseur km/h en mph (kilomètres par heure vers miles)',
    metaDesc: 'Convertissez des km/h en mph (miles par heure) : 1 km/h = 0,6214 mph. Pour conduire à l’étranger, comparer des vitesses ou lire un compteur.',
    keywords: ['km/h en mph', 'kmh en mph', 'vitesse', 'miles par heure', 'conduite royaume-uni', 'limitation vitesse'],
    from: 'km/h', to: 'mph', toSym: 'mph', fromSym: 'km/h', factor: 1 / 1.609344, def: '130',
    vals: [10, 30, 50, 70, 80, 90, 110, 130, 150, 200],
    ctx: [
      'Au Royaume-Uni et aux États-Unis, les vitesses sont exprimées en miles par heure (mph). Avant de prendre la route à l’étranger ou de comparer une vitesse, saisissez des km/h pour obtenir leur équivalent en mph.',
    ],
    how: ['Un mile vaut exactement 1,609344 km. La formule est : mph = km/h ÷ 1,609344, soit km/h × 0,621371.', 'Pour une estimation mentale, multipliez par 0,6 : 100 km/h ≈ 60 mph (le calcul exact donne 62,1 mph).'],
    exV: 130, exText: (x, y) => `La vitesse maximale de ${x} km/h autorisée sur les autoroutes françaises correspond à <strong>${y} mph</strong>. Une limitation de 50 km/h en ville équivaut à 31,07 mph, soit un peu plus que les 30 mph britanniques.`,
    tips: ['Au Royaume-Uni, les limitations sont toujours en mph : 30 en agglomération, 60 sur route et 70 sur autoroute en général.', 'Sur un compteur de véhicule importé, vérifiez l’unité affichée avant de la comparer aux limitations locales.', 'Pour convertir en mètres par seconde, divisez les km/h par 3,6.'],
    faq: [
      ['Combien de mph font 100 km/h ?', '100 km/h font environ 62,14 mph.'],
      ['Comment convertir des km/h en mph ?', 'Multipliez par 0,621371 (ou divisez par 1,609344). Pour 90 km/h : 55,92 mph.'],
      ['Combien font 130 km/h en mph ?', 'Environ 80,78 mph.'],
      ['Quelle est la différence entre mph et mi/h ?', 'Il n’y en a pas : ce sont deux abréviations du même « miles per hour ».'],
    ],
    related: ['convertisseur-mph-kmh', 'convertisseur-celsius-fahrenheit', 'convertisseur-litres-gallons', 'calculateur-regle-de-trois'],
  }),

  /* 43 */
  conv({
    slug: 'convertisseur-mph-kmh', sub: 'Vitesse',
    name: 'Mph en km/h', short: 'Convertir des miles par heure en km/h.',
    h1: 'Convertisseur mph en km/h : convertissez des miles par heure en kilomètres par heure',
    metaTitle: 'Convertisseur mph en km/h (miles par heure vers km/h)',
    metaDesc: 'Convertissez des mph (miles par heure) en km/h : 1 mph = 1,609 km/h. Utile pour les limitations de vitesse au Royaume-Uni et aux États-Unis.',
    keywords: ['mph en km/h', 'miles par heure en kmh', 'vitesse américaine', 'limitation vitesse usa', 'conversion vitesse'],
    from: 'mph', to: 'km/h', toSym: 'km/h', fromSym: 'mph', factor: 1.609344, def: '70',
    vals: [5, 10, 20, 30, 40, 55, 60, 65, 70, 75, 85],
    ctx: [
      'Limitations de vitesse britanniques ou américaines, données d’un compteur, vitesse d’une balle de baseball : les mph s’affichent partout outre-Atlantique. Saisissez une vitesse en miles par heure pour l’obtenir en km/h.',
      'Le mile par heure est aussi utilisé pour les vitesses de vent dans les bulletins météo américains, pour les performances des voitures de sport ou pour les relevés de radar. Le convertisseur affiche le résultat avec deux décimales, ainsi que le détail du coefficient employé.',
    ],
    how: ['Un mile vaut exactement 1,609344 kilomètre. La formule est : km/h = mph × 1,609344.', 'Pour estimer rapidement, multipliez par 1,6 : 50 mph ≈ 80 km/h (le calcul exact donne 80,47 km/h).'],
    exV: 70, exText: (x, y) => `Une limitation de ${x} mph, courante sur les autoroutes britanniques, correspond à <strong>${y} km/h</strong>. Une limite de 30 mph en agglomération fait 48,28 km/h.`,
    tips: ['Aux États-Unis, la limitation varie d’un État à l’autre ; sur certaines autoroutes elle dépasse 70 mph.', 'Pour convertir une distance en miles en kilomètres, appliquez le même coefficient : 1 mile = 1,609 km.', 'Au Royaume-Uni, les panneaux de distance sont aussi en miles, ce qui facilite le calcul de temps de trajet.'],
    faq: [
      ['Combien de km/h font 60 mph ?', '60 mph font environ 96,56 km/h.'],
      ['Comment convertir des mph en km/h ?', 'Multipliez par 1,609344. 55 mph = 88,5 km/h.'],
      ['Combien font 30 mph en km/h ?', 'Environ 48,28 km/h.'],
      ['Combien de kilomètres dans un mile ?', '1,609344 km, soit environ 1,6 km.'],
    ],
    related: ['convertisseur-kmh-mph', 'convertisseur-fahrenheit-celsius', 'convertisseur-pieds-metres', 'calculateur-regle-de-trois'],
  }),

  /* 44 */
  conv({
    slug: 'convertisseur-m2-cm2', sub: 'Surface',
    name: 'Mètres carrés en centimètres carrés', short: 'Convertir des m² en cm².',
    h1: 'Convertisseur m² en cm² : convertissez des mètres carrés en centimètres carrés',
    metaTitle: 'Convertisseur m² en cm² (mètres carrés en centimètres carrés)',
    metaDesc: 'Convertissez des m² en cm² : 1 m² = 10 000 cm². Évitez l’erreur classique du facteur 100 grâce au tableau de conversion et aux exemples.',
    keywords: ['m2 en cm2', 'mètres carrés', 'centimètres carrés', 'convertir surface', 'unités de surface'],
    from: 'm²', to: 'cm²', toSym: 'cm²', fromSym: 'm²', factor: 10000, def: '0.35',
    vals: [0.0001, 0.01, 0.1, 0.35, 0.5, 1, 2, 2.5, 10, 25],
    ctx: [
      'Les unités de surface ne se convertissent pas comme les unités de longueur : 1 m = 100 cm, mais <strong>1 m² = 10 000 cm²</strong>. Saisissez une surface en m² pour obtenir la valeur exacte en cm².',
    ],
    how: ['Un mètre carré est un carré d’1 m de côté, c’est-à-dire de 100 cm × 100 cm = 10 000 cm². La formule est donc : cm² = m² × 10 000.', 'Pour passer des cm² aux m², divisez par 10 000.'],
    exV: 0.35, exText: (x, y) => `Une plaque de ${x} m² mesure <strong>${y} cm²</strong>. Une feuille A4 (21 × 29,7 cm) fait 623,7 cm², soit environ 0,0624 m².`,
    tips: ['Pour un carrelage ou une plaque, comparez des surfaces dans la même unité avant de commander.', 'La confusion entre « m linéaire » et « m² » est fréquente : un mètre linéaire ne mesure qu’une longueur.', 'Un décimètre carré (dm²) vaut 100 cm² et 0,01 m².'],
    faq: [
      ['Combien de cm² dans un m² ?', '10 000 cm² : 100 cm × 100 cm.'],
      ['Comment convertir des m² en cm² ?', 'Multipliez par 10 000. 2,5 m² = 25 000 cm².'],
      ['Pourquoi le facteur n’est-il pas 100 ?', 'Parce qu’une surface a deux dimensions : on applique le facteur 100 à la longueur et à la largeur, donc 100 × 100 = 10 000.'],
      ['Comment convertir des cm² en m² ?', 'Divisez par 10 000. 500 cm² = 0,05 m².'],
    ],
    related: ['convertisseur-m3-litres', 'calculateur-surface', 'calculateur-carrelage', 'calculateur-peinture'],
  }),

  /* 45 */
  conv({
    slug: 'convertisseur-m3-litres', sub: 'Volume',
    name: 'Mètres cubes en litres', short: 'Convertir des m³ en litres.',
    h1: 'Convertisseur m³ en litres : convertissez des mètres cubes en litres',
    metaTitle: 'Convertisseur m³ en litres (mètres cubes vers litres)',
    metaDesc: 'Convertissez des m³ en litres : 1 m³ = 1 000 litres. Pratique pour la consommation d’eau, une piscine, une cuve ou un volume de béton.',
    keywords: ['m3 en litres', 'mètres cubes en litres', 'convertir m3', 'consommation eau', 'piscine', 'cuve'],
    from: 'm³', to: 'litres', toSym: 'L', fromSym: 'm³', factor: 1000, def: '1.2',
    vals: [0.001, 0.1, 0.25, 0.5, 1, 1.2, 2, 5, 10, 30, 100],
    ctx: [
      'Facture d’eau, volume d’une piscine, capacité d’une cuve ou quantité de terre à commander : les volumes passent constamment du mètre cube au litre. Saisissez des m³ pour obtenir les litres.',
    ],
    how: ['Un mètre cube est un cube d’1 m de côté, soit 10 dm × 10 dm × 10 dm = 1 000 dm³, et 1 dm³ vaut 1 litre. La formule est donc : litres = m³ × 1 000.', 'Pour passer des litres aux m³, divisez par 1 000.'],
    exV: 1.2, exText: (x, y) => `Un volume de ${x} m³ représente <strong>${y} litres</strong>. Une piscine de 30 m³ contient 30 000 litres d’eau, et un compteur d’eau qui indique 120 m³ sur l’année correspond à 120 000 litres.`,
    tips: ['Sur une facture d’eau, la consommation est exprimée en m³ : 1 m³ vaut 1 000 litres.', 'Pour une piscine, utilisez le calculateur de volume pour obtenir d’abord le volume en m³.', 'Un mètre cube d’eau pèse environ une tonne.'],
    faq: [
      ['Combien de litres dans un m³ ?', '1 000 litres.'],
      ['Comment convertir des m³ en litres ?', 'Multipliez par 1 000. 0,35 m³ = 350 L.'],
      ['Combien de m³ font 500 litres ?', '0,5 m³.'],
      ['Combien pèse un m³ d’eau ?', 'Environ 1 000 kg, soit une tonne, à température ambiante.'],
    ],
    related: ['calculateur-volume', 'convertisseur-litres-cl', 'convertisseur-m2-cm2', 'calculateur-beton'],
  }),
];
