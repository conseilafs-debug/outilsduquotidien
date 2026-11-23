import { FUNCTIONS as F, fmt } from '../utils/calc.mjs';
import { n, s, UNITS, POSE_OPTIONS } from './fields.mjs';

const CAT = 'maison';
const when = (...shapes) => ({ when: { shape: shapes } });

export const homeTools = [
  /* 20 */
  {
    slug: 'calculateur-surface', cat: CAT, sub: 'Surface',
    name: 'Calculateur de surface',
    short: 'Surface d’un rectangle, carré, triangle, cercle ou trapèze.',
    h1: 'Calculateur de surface : rectangle, carré, triangle, cercle et trapèze',
    metaTitle: 'Calculateur de surface en m² (formes usuelles)',
    metaDesc: 'Calculez la surface d’un rectangle, carré, triangle, cercle ou trapèze en m², cm², ares et hectares. Formules et exemples pour vos travaux.',
    keywords: ['surface', 'm2', 'mètre carré', 'aire', 'superficie', 'calcul surface', 'rectangle', 'cercle', 'triangle'],
    intro: [
      'Avant de peindre, carreler ou semer une pelouse, il faut connaître la surface à traiter. Choisissez la forme, saisissez ses dimensions : le calculateur donne la <strong>surface en m², cm², ares et hectares</strong>, ainsi que le périmètre pour les formes simples.',
    ],
    blocks: [{
      id: 'surface', fn: 'area',
      fields: [
        s('shape', 'Forme', [{ v: 'rect', label: 'Rectangle' }, { v: 'carre', label: 'Carré' }, { v: 'triangle', label: 'Triangle' }, { v: 'cercle', label: 'Cercle (disque)' }, { v: 'trapeze', label: 'Trapèze' }], 'rect'),
        s('unit', 'Unité des longueurs saisies', UNITS, 'm'),
        n('long', 'Longueur', '5', when('rect')), n('larg', 'Largeur', '4', when('rect')),
        n('cote', 'Côté', '4', when('carre')),
        n('base', 'Base', '6', when('triangle')), n('haut', 'Hauteur', '4', when('triangle')),
        n('rayon', 'Rayon', '2', when('cercle')),
        n('gb', 'Grande base', '10', when('trapeze')), n('pb', 'Petite base', '6', when('trapeze')), n('ht', 'Hauteur', '4', when('trapeze')),
      ],
    }],
    how: [
      'Chaque forme a sa formule : rectangle = longueur × largeur ; carré = côté × côté ; triangle = base × hauteur ÷ 2 ; cercle = π × rayon² ; trapèze = (grande base + petite base) × hauteur ÷ 2.',
      'Pour une pièce de forme irrégulière, décomposez-la en rectangles et triangles, calculez chaque surface puis additionnez-les.',
    ],
    example: () => {
      const a = F.area({ shape: 'rect', unit: 'm', long: 5, larg: 4 }).raw.a, b = F.area({ shape: 'cercle', unit: 'm', rayon: 2 }).raw.a;
      return `<p>Un salon de 5 m sur 4 m fait 5 × 4 = <strong>${fmt(a)} m²</strong>. Un bassin circulaire de 2 m de rayon couvre π × 2² = <strong>${fmt(b, 2)} m²</strong>.</p>`;
    },
    table: () => ({
      caption: 'Formules et équivalences de surface',
      head: ['Forme / unité', 'Formule ou équivalence'],
      rows: [['Rectangle', 'longueur × largeur'], ['Carré', 'côté²'], ['Triangle', 'base × hauteur ÷ 2'], ['Disque', 'π × rayon²'], ['Trapèze', '(B + b) × h ÷ 2'], ['1 m²', '10 000 cm²'], ['1 are', '100 m²'], ['1 hectare', '10 000 m² (100 ares)']],
    }),
    tips: [
      'Mesurez toujours en une seule unité : passez les centimètres en mètres (125 cm = 1,25 m) avant de saisir, ou choisissez l’unité adaptée.',
      'Pour un mur, la surface utile se calcule en retirant les ouvertures (portes, fenêtres) de la surface brute.',
      'Ajoutez 5 à 10 % de marge pour les découpes si vous commandez des matériaux de revêtement.',
    ],
    faq: [
      ['Comment calculer la surface d’une pièce en m² ?', 'Multipliez la longueur par la largeur, en mètres. Une pièce de 4,5 m sur 3 m fait 13,5 m². Pour une pièce en L, additionnez deux rectangles.'],
      ['Comment convertir des cm² en m² ?', 'Divisez par 10 000 : 25 000 cm² = 2,5 m². Dans l’autre sens, multipliez par 10 000.'],
      ['Quelle est la surface d’un cercle ?', 'π × rayon². Pour un diamètre de 3 m, le rayon est 1,5 m et la surface vaut π × 1,5² ≈ 7,07 m².'],
      ['Quelle est la différence entre m² et mètre linéaire ?', 'Le m² mesure une surface (longueur × largeur), le mètre linéaire mesure seulement une longueur, par exemple pour des plinthes ou une clôture.'],
    ],
    related: ['calculateur-volume', 'calculateur-peinture', 'calculateur-carrelage', 'calculateur-parquet'],
  },

  /* 21 */
  {
    slug: 'calculateur-volume', cat: CAT, sub: 'Volume',
    name: 'Calculateur de volume',
    short: 'Volume d’un pavé, cube, cylindre, sphère ou cône, en m³ et en litres.',
    h1: 'Calculateur de volume : pavé, cube, cylindre, sphère et cône',
    metaTitle: 'Calculateur de volume en m³ et en litres',
    metaDesc: 'Calculez le volume d’un pavé, cube, cylindre, sphère ou cône et obtenez le résultat en m³, litres et cm³. Idéal pour une cuve, un bassin ou un remblai.',
    keywords: ['volume', 'm3', 'mètre cube', 'litres', 'cylindre', 'cuve', 'bassin', 'capacité'],
    intro: [
      'Combien de litres dans un bassin, de terre pour un remblai, de béton pour des fondations ? Choisissez la forme et saisissez ses dimensions : le calculateur donne le <strong>volume en m³, en litres et en cm³</strong>.',
    ],
    blocks: [{
      id: 'volume', fn: 'volume',
      fields: [
        s('shape', 'Forme', [{ v: 'pave', label: 'Pavé (parallélépipède)' }, { v: 'cube', label: 'Cube' }, { v: 'cylindre', label: 'Cylindre' }, { v: 'sphere', label: 'Sphère' }, { v: 'cone', label: 'Cône' }], 'pave'),
        s('unit', 'Unité des longueurs saisies', UNITS, 'm'),
        n('long', 'Longueur', '2', when('pave')), n('larg', 'Largeur', '3', when('pave')), n('haut', 'Hauteur', '4', when('pave')),
        n('cote', 'Côté', '2', when('cube')),
        n('rayon', 'Rayon', '1', when('cylindre', 'sphere', 'cone')),
        n('haut', 'Hauteur', '2', when('cylindre', 'cone')),
      ],
    }],
    how: [
      'Pavé = longueur × largeur × hauteur ; cube = côté³ ; cylindre = π × rayon² × hauteur ; sphère = 4/3 × π × rayon³ ; cône = π × rayon² × hauteur ÷ 3.',
      'Équivalences : 1 m³ = 1 000 litres = 1 000 000 cm³. Un volume de 1 dm³ (un cube de 10 cm de côté) correspond exactement à 1 litre.',
    ],
    example: () => {
      const a = F.volume({ shape: 'pave', unit: 'm', long: 2, larg: 3, haut: 4 }).raw, b = F.volume({ shape: 'cylindre', unit: 'm', rayon: 1, haut: 2 }).raw;
      return `<p>Un bassin rectangulaire de 2 m × 3 m rempli sur 4 m contient ${fmt(a.m3)} m³, soit <strong>${fmt(a.litres, 0)} litres</strong>. Une cuve cylindrique de 1 m de rayon et 2 m de haut a un volume de π × 1² × 2 ≈ <strong>${fmt(b.m3, 2)} m³</strong> (${fmt(b.litres, 0)} litres).</p>`;
    },
    table: () => ({
      caption: 'Formules et équivalences de volume',
      head: ['Forme / unité', 'Formule ou équivalence'],
      rows: [['Pavé', 'longueur × largeur × hauteur'], ['Cube', 'côté³'], ['Cylindre', 'π × rayon² × hauteur'], ['Sphère', '4/3 × π × rayon³'], ['Cône', 'π × rayon² × hauteur ÷ 3'], ['1 m³', '1 000 litres'], ['1 litre', '1 000 cm³'], ['1 cm³', '1 millilitre']],
    }),
    tips: [
      'Pour une piscine ou un bassin dont la profondeur varie, calculez séparément la partie peu profonde et la partie profonde, ou utilisez une profondeur moyenne.',
      'Pour une terre ou un gravier, ajoutez une marge : le tassement diminue le volume réel de 10 à 20 %.',
      'Le rayon est la moitié du diamètre : un tuyau de 10 cm de diamètre a un rayon de 5 cm.',
    ],
    faq: [
      ['Comment calculer le volume en litres ?', 'Calculez le volume en m³ puis multipliez par 1 000. Un volume de 0,35 m³ équivaut à 350 litres.'],
      ['Comment calculer le volume d’un cylindre ?', 'Multipliez π par le carré du rayon puis par la hauteur. Pour un fût de 30 cm de rayon et 90 cm de haut : π × 0,3² × 0,9 ≈ 0,254 m³, soit 254 litres.'],
      ['Quelle est la différence entre volume et capacité ?', 'Le volume est l’espace occupé par un objet ; la capacité est le volume de liquide qu’un récipient peut contenir. Les deux s’expriment avec les mêmes unités.'],
      ['Comment convertir des cm³ en litres ?', 'Divisez par 1 000 : 2 500 cm³ = 2,5 litres.'],
    ],
    related: ['calculateur-surface', 'calculateur-beton', 'convertisseur-m3-litres', 'calculateur-gravier'],
  },

  /* 22 */
  {
    slug: 'calculateur-peinture', cat: CAT, sub: 'Peinture', popular: true,
    name: 'Calculateur de peinture',
    short: 'Litres de peinture nécessaires pour une pièce, avec marge.',
    h1: 'Calculateur de peinture : combien de litres faut-il ?',
    metaTitle: 'Calculateur de peinture : combien de litres pour une pièce',
    metaDesc: 'Calculez la quantité de peinture pour une pièce selon la surface des murs, les ouvertures, le nombre de couches et le rendement du pot. Marge incluse.',
    keywords: ['peinture', 'litres de peinture', 'quantité peinture', 'calcul peinture', 'combien de peinture', 'mur', 'plafond', 'rendement'],
    intro: [
      'Trop peu de peinture et la teinte du second pot peut différer ; trop et l’argent dort dans un placard. Indiquez les dimensions de votre pièce, les ouvertures à déduire, le nombre de couches et le rendement indiqué sur le pot : vous obtenez les <strong>litres nécessaires</strong> avec <strong>10 % de marge de sécurité</strong>.',
    ],
    blocks: [{
      id: 'peinture', fn: 'paint',
      fields: [
        n('long', 'Longueur de la pièce', '4', { unit: 'm' }), n('larg', 'Largeur de la pièce', '3', { unit: 'm' }), n('haut', 'Hauteur sous plafond', '2.5', { unit: 'm' }),
        n('ouv', 'Surface des portes et fenêtres', '4', { unit: 'm²', hint: 'Une porte standard fait environ 1,7 m², une fenêtre environ 1,5 m².' }),
        n('couches', 'Nombre de couches', '2', { inputmode: 'numeric' }),
        n('rend', 'Rendement de la peinture', '10', { unit: 'm²/L', hint: 'Indiqué sur le pot, par couche. Souvent entre 8 et 12 m²/L pour une peinture murale.' }),
        s('plafond', 'Peindre aussi le plafond ?', [{ v: 'non', label: 'Non, murs uniquement' }, { v: 'oui', label: 'Oui, murs et plafond' }], 'non'),
      ],
    }],
    how: [
      '<strong>1. Surface des murs :</strong> périmètre × hauteur = 2 × (longueur + largeur) × hauteur. <strong>2.</strong> On retire la surface des portes et fenêtres. <strong>3.</strong> On ajoute le plafond si besoin (longueur × largeur).',
      '<strong>4. Quantité :</strong> surface à peindre × nombre de couches ÷ rendement en m²/L. <strong>5.</strong> On ajoute 10 % de marge pour les retouches, la perte dans le bac et les surfaces irrégulières.',
    ],
    example: () => {
      const r = F.paint({ long: 4, larg: 3, haut: 2.5, ouv: 4, couches: 2, rend: 10, plafond: 'non' }).raw;
      return `<p>Pièce de 4 m × 3 m, hauteur 2,5 m : les murs font 2 × (4 + 3) × 2,5 = ${fmt(r.walls)} m². On retire 4 m² d’ouvertures, soit ${fmt(r.surf)} m². Pour 2 couches à 10 m²/L : ${fmt(r.surf)} × 2 ÷ 10 = ${fmt(r.net)} L, soit <strong>${fmt(r.safe)} L avec la marge</strong> : prévoyez ${r.pots} pots de 2,5 L.</p>`;
    },
    table: () => ({
      caption: 'Litres nécessaires selon la surface (2 couches, 10 m²/L, marge de 10 % incluse)',
      head: ['Surface à peindre', 'Sans marge', 'Avec marge de 10 %'],
      rows: [10, 20, 30, 40, 60, 80, 100].map((m2) => [`${m2} m²`, `${fmt(m2 * 2 / 10)} L`, `${fmt(m2 * 2 / 10 * 1.1)} L`]),
    }),
    tips: [
      'Le rendement varie selon le support : une peinture sur plâtre neuf ou sur mur très absorbant en consomme davantage, et une sous-couche est souvent recommandée.',
      'Passer d’un mur foncé à une teinte claire (ou l’inverse) demande généralement une couche supplémentaire.',
      'Achetez en une fois la quantité totale, et vérifiez que les pots portent le même numéro de lot pour éviter les différences de teinte.',
    ],
    faq: [
      ['Combien de peinture faut-il pour une pièce de 12 m² ?', 'Cela dépend surtout de la surface des murs, pas du sol. Une pièce de 12 m² (4 × 3 m) avec 2,5 m de hauteur représente 35 m² de murs, soit environ 7 litres pour deux couches.'],
      ['Quel est le rendement moyen d’un litre de peinture ?', 'Entre 8 et 12 m² par litre et par couche pour une peinture murale classique, mais lisez toujours l’étiquette : le fabricant indique le rendement de son produit sur un support standard.'],
      ['Faut-il compter les plinthes et les boiseries ?', 'Non, elles se peignent avec un produit spécifique. Les plinthes ne sont pas déduites des murs ; l’écart est négligeable face à la marge de sécurité.'],
      ['Combien de couches prévoir ?', 'Deux couches pour un résultat uniforme sur un mur déjà peint. Une couche peut suffire pour rafraîchir la même teinte ; trois si le support est très marqué ou très absorbant.'],
    ],
    related: ['calculateur-surface', 'calculateur-volume', 'calculateur-carrelage', 'calculateur-parquet'],
  },

  /* 23 */
  {
    slug: 'calculateur-carrelage', cat: CAT, sub: 'Carrelage', popular: true,
    name: 'Calculateur de carrelage',
    short: 'Nombre de carreaux à commander, joints et marge de chute compris.',
    h1: 'Calculateur de carrelage : combien de carreaux commander ?',
    metaTitle: 'Calculateur de carrelage : nombre de carreaux et boîtes',
    metaDesc: 'Calculez le nombre de carreaux à commander pour une pièce selon la taille du carreau, les joints et la marge de chute. Nombre de boîtes en option.',
    keywords: ['carrelage', 'carreaux', 'nombre de carreaux', 'calcul carrelage', 'faïence', 'sol', 'joint', 'm2 carrelage'],
    intro: [
      'Indiquez les dimensions de la surface à carreler et la taille d’un carreau : le calculateur donne le <strong>nombre de carreaux nets</strong> et le nombre à commander avec la <strong>marge de chute</strong> (découpes, casse, carreaux à conserver pour d’éventuelles réparations). Si vous connaissez la surface par boîte, il calcule aussi le nombre de boîtes.',
    ],
    blocks: [{
      id: 'carrelage', fn: 'tiles',
      fields: [
        n('long', 'Longueur à carreler', '5', { unit: 'm' }), n('larg', 'Largeur à carreler', '4', { unit: 'm' }),
        n('cl', 'Longueur d’un carreau', '60', { unit: 'cm' }), n('cw', 'Largeur d’un carreau', '60', { unit: 'cm' }),
        n('joint', 'Largeur des joints', '3', { unit: 'mm', hint: 'Entrez 0 pour ignorer les joints.' }),
        s('marge', 'Marge de chute', POSE_OPTIONS, '10'),
        n('boite', 'Surface par boîte (facultatif)', '1.44', { unit: 'm²', optional: true, hint: 'Indiquée sur l’emballage, par exemple 1,44 m² pour 4 carreaux de 60 × 60 cm.' }),
      ],
    }],
    how: [
      'La surface à carreler (longueur × largeur) est divisée par la surface d’un carreau <strong>joint compris</strong> : (longueur + joint) × (largeur + joint). Le résultat est arrondi à l’unité supérieure.',
      'On applique ensuite la marge de chute au nombre de carreaux. Avec la surface par boîte, le nombre de boîtes est la surface réellement achetée divisée par la surface d’une boîte, arrondie au-dessus.',
    ],
    example: () => {
      const r = F.tiles({ long: 5, larg: 4, cl: 60, cw: 60, joint: 3, marge: '10', boite: 1.44 }).raw;
      const z = F.tiles({ long: 5, larg: 4, cl: 60, cw: 60, joint: 0, marge: '10' }).raw;
      return `<p>Pour 5 m × 4 m (20 m²) avec des carreaux de 60 × 60 cm et des joints de 3 mm : ${fmt(r.netN, 0)} carreaux nets, soit <strong>${fmt(r.withN, 0)} carreaux</strong> avec 10 % de marge. Sans tenir compte des joints, on trouverait ${fmt(z.netN, 0)} carreaux nets : la différence est faible mais réelle sur de grandes surfaces.</p>`;
    },
    table: () => ({
      caption: 'Nombre de carreaux nets par m² selon le format (sans joint)',
      head: ['Format du carreau', 'Surface d’un carreau', 'Carreaux par m²'],
      rows: [[20, 20], [30, 30], [45, 45], [60, 60], [30, 60], [60, 120]].map(([a, b]) => [`${a} × ${b} cm`, `${fmt((a * b) / 10000, 3)} m²`, fmt(10000 / (a * b), 2)]),
    }),
    tips: [
      'Choisissez la marge selon la complexité : 5 % pour une pièce simple en pose droite, 10 % en général, 15 % pour une pose en diagonale ou beaucoup de découpes.',
      'Les grands formats génèrent proportionnellement plus de chutes dans les petites pièces.',
      'Conservez quelques carreaux du même lot : un modèle arrêté ou une teinte légèrement différente rend une réparation plus difficile.',
    ],
    faq: [
      ['Combien de carreaux faut-il pour 20 m² ?', 'Avec des carreaux de 60 × 60 cm (0,36 m²) posés sans joint, il en faut environ 56 sans marge et 62 avec 10 % de marge. Le nombre dépend du format et des joints : utilisez le calculateur.'],
      ['Quelle marge de chute prévoir ?', 'De 5 à 10 % pour une pose droite, 10 à 15 % pour une pose en diagonale, à chevrons ou dans une pièce avec de nombreux angles et découpes.'],
      ['Faut-il tenir compte des joints ?', 'Oui : le carreau et son joint occupent ensemble plus de place que le carreau seul. Sur de grandes surfaces ou des petits carreaux, cela peut changer le nombre de carreaux de plusieurs pourcents.'],
      ['Le calculateur donne-t-il la quantité de colle et de joint ?', 'Non, ces quantités dépendent du produit et de la méthode de pose. Reportez-vous à la fiche technique du fabricant, en général exprimée en kg par m².'],
    ],
    related: ['calculateur-surface', 'calculateur-parquet', 'calculateur-plinthes', 'calculateur-peinture'],
  },

  /* 24 */
  {
    slug: 'calculateur-parquet', cat: CAT, sub: 'Parquet',
    name: 'Calculateur de parquet',
    short: 'Surface et nombre de paquets de parquet ou stratifié à commander.',
    h1: 'Calculateur de parquet : combien de paquets commander ?',
    metaTitle: 'Calculateur de parquet : surface et nombre de paquets',
    metaDesc: 'Calculez la quantité de parquet ou de sol stratifié à acheter : surface de la pièce, marge de chute selon la pose et nombre de paquets à commander.',
    keywords: ['parquet', 'lames', 'stratifié', 'paquets de parquet', 'sol', 'calcul parquet', 'pose parquet', 'vinyle'],
    intro: [
      'Les lames de parquet, de stratifié ou de vinyle sont vendues par paquets couvrant une surface fixe. Saisissez les dimensions de la pièce, le mode de pose et la surface par paquet : le calculateur indique <strong>combien de paquets commander</strong> et le surplus qui restera après la pose.',
    ],
    blocks: [{
      id: 'parquet', fn: 'flooring',
      fields: [
        n('long', 'Longueur de la pièce', '5', { unit: 'm' }), n('larg', 'Largeur de la pièce', '4', { unit: 'm' }),
        s('marge', 'Marge de chute', POSE_OPTIONS, '10'),
        n('paquet', 'Surface couverte par un paquet', '2.2', { unit: 'm²', hint: 'Indiquée sur l’emballage. Les valeurs courantes se situent autour de 2 à 2,5 m².' }),
      ],
    }],
    how: [
      'Surface à commander = longueur × largeur × (1 + marge ÷ 100). Nombre de paquets = surface à commander ÷ surface d’un paquet, arrondi au chiffre supérieur.',
      'Le surplus est la différence entre la surface réellement achetée (nombre entier de paquets) et la surface de la pièce.',
    ],
    example: () => {
      const r = F.flooring({ long: 5, larg: 4, marge: '10', paquet: 2.2 }).raw;
      return `<p>Pièce de 5 m × 4 m = ${fmt(r.surf)} m². Avec 10 % de marge, il faut ${fmt(r.need)} m². À 2,2 m² par paquet, cela représente <strong>${r.packs} paquets</strong> (${fmt(r.packs * 2.2)} m² achetés).</p>`;
    },
    table: () => ({
      caption: 'Marge de chute conseillée selon le type de pose',
      head: ['Type de pose', 'Marge conseillée'],
      rows: [['Pose droite, pièce rectangulaire simple', '5 %'], ['Pose droite avec découpes (cheminée, poteaux, angles)', '10 %'], ['Pose en diagonale', '10 à 15 %'], ['Pose à bâtons rompus ou point de Hongrie', '15 %'], ['Pièce en L, escalier', '10 à 15 %']],
    }),
    tips: [
      'Laissez un jeu de dilatation d’environ 1 cm en périphérie : la surface à couvrir est celle de la pièce, mais ce jeu sera masqué par les plinthes.',
      'Laissez les paquets s’acclimater dans la pièce avant la pose, pendant la durée indiquée par le fabricant.',
      'Commandez toujours un paquet de plus que le strict nécessaire si le modèle risque d’être arrêté.',
    ],
    faq: [
      ['Combien de m² de parquet commander pour une pièce de 20 m² ?', 'Prévoyez 21 m² pour une pose droite simple (5 %), 22 m² dans le cas courant (10 %) et 23 m² pour une pose en diagonale ou à chevrons (15 %).'],
      ['Faut-il déduire les meubles ou placards ?', 'Les meubles posés ne se déduisent pas. Les placards ou cloisons fixes qui ne recevront pas de parquet peuvent être retirés de la surface si la pose ne passe pas dessous.'],
      ['Que faire des lames restantes ?', 'Conservez-les : elles servent à remplacer une lame abîmée. Vérifiez qu’elles sont stockées à plat, au sec.'],
      ['Le calcul convient-il au stratifié et au vinyle ?', 'Oui, la méthode est identique pour tout revêtement vendu par paquets ou par boîtes couvrant une surface donnée.'],
    ],
    related: ['calculateur-plinthes', 'calculateur-carrelage', 'calculateur-surface', 'calculateur-peinture'],
  },

  /* 25 */
  {
    slug: 'calculateur-beton', cat: CAT, sub: 'Béton',
    name: 'Calculateur de béton',
    short: 'Volume de béton, ciment, sable, gravillons et eau pour une dalle.',
    h1: 'Calculateur de béton : volume et quantités de ciment, sable et gravillons',
    metaTitle: 'Calculateur de béton : volume, ciment, sable, gravier',
    metaDesc: 'Calculez le volume de béton d’une dalle et les quantités de ciment, sable, gravillons et eau pour un béton dosé à 350 kg/m³. Marge incluse.',
    keywords: ['béton', 'dalle béton', 'ciment', 'sable', 'gravillons', 'm3 de béton', 'quantité béton', 'dosage béton', 'sac de ciment'],
    intro: [
      'Pour couler une dalle de terrasse, de garage ou d’abri de jardin, il faut commander le bon volume de béton ou préparer les bons ingrédients. Indiquez les dimensions et l’épaisseur de la dalle : le calculateur donne le <strong>volume avec marge</strong> et la composition d’un béton courant <strong>dosé à 350 kg de ciment par m³</strong>.',
    ],
    blocks: [{
      id: 'beton', fn: 'concrete',
      fields: [
        n('long', 'Longueur de la dalle', '4', { unit: 'm' }), n('larg', 'Largeur de la dalle', '3', { unit: 'm' }),
        n('ep', 'Épaisseur', '10', { unit: 'cm' }),
        n('marge', 'Marge de sécurité', '10', { unit: '%', hint: 'Prévoit les irrégularités du sol, les pertes et le coffrage.' }),
      ],
    }],
    how: [
      'Volume = longueur × largeur × épaisseur (en mètres). On ajoute la marge pour obtenir le volume à préparer ou à commander.',
      'Composition indicative d’1 m³ de béton dosé à 350 kg/m³ : 350 kg de ciment, environ 400 litres de sable, 800 litres de gravillons et 175 litres d’eau. Ces quantités sont des ordres de grandeur : l’humidité du sable et le type de granulats modifient légèrement le dosage d’eau.',
    ],
    example: () => {
      const r = F.concrete({ long: 4, larg: 3, ep: 10, marge: 10 }).raw;
      return `<p>Une dalle de 4 m × 3 m épaisse de 10 cm représente ${fmt(r.vol)} m³. Avec 10 % de marge : <strong>${fmt(r.volM)} m³</strong>, soit ${fmt(r.ciment, 0)} kg de ciment (${Math.ceil(r.ciment / 35)} sacs de 35 kg), ${fmt(r.volM * 400, 0)} L de sable et ${fmt(r.volM * 800, 0)} L de gravillons.</p>`;
    },
    table: () => ({
      caption: 'Épaisseurs de dalle couramment utilisées (à adapter selon le sol et la charge)',
      head: ['Usage', 'Épaisseur indicative'],
      rows: [['Béton de propreté (fond de fouille)', '5 cm'], ['Allée piétonne, chemin', '8 à 10 cm'], ['Terrasse, dalle d’abri de jardin', '10 à 12 cm'], ['Garage, passage de véhicule léger', '12 à 15 cm']],
    }),
    tips: [
      'Pour un ouvrage porteur, une dalle de garage ou une fondation, faites valider l’épaisseur, le ferraillage et le dosage par un professionnel.',
      'Pour un volume important, un béton prêt à l’emploi livré par camion-toupie est souvent plus régulier et plus rapide qu’une fabrication manuelle.',
      'Évitez de couler par forte chaleur ou par gel, et protégez la dalle du séchage trop rapide les premiers jours.',
    ],
    faq: [
      ['Combien de béton faut-il pour une dalle de 20 m² ?', 'Pour une épaisseur de 10 cm, le volume est 20 × 0,10 = 2 m³, soit environ 2,2 m³ avec 10 % de marge.'],
      ['Combien de sacs de ciment faut-il pour 1 m³ de béton ?', 'Pour un dosage de 350 kg/m³, comptez 10 sacs de 35 kg (ou 14 sacs de 25 kg).'],
      ['Quel dosage de béton choisir ?', 'Le dosage à 350 kg/m³ convient aux dalles et ouvrages courants. Les ouvrages soumis à de fortes contraintes demandent un dosage et une résistance définis par un professionnel.'],
      ['Combien pèse un mètre cube de béton ?', 'Environ 2,4 tonnes pour un béton ordinaire. C’est utile pour vérifier l’accès, la portance du sol ou la capacité d’une remorque.'],
    ],
    related: ['calculateur-volume', 'calculateur-gravier', 'calculateur-sable', 'calculateur-surface'],
  },

  /* 26 */
  {
    slug: 'calculateur-gravier', cat: CAT, sub: 'Gravier',
    name: 'Calculateur de gravier',
    short: 'Tonnes et volume de gravier pour une allée, un massif ou une cour.',
    h1: 'Calculateur de gravier : combien de tonnes pour votre allée ?',
    metaTitle: 'Calculateur de gravier : tonnes et m³ pour une allée',
    metaDesc: 'Calculez la quantité de gravier en m³ et en tonnes pour une allée, une cour ou un massif selon la surface, l’épaisseur et la densité du matériau.',
    keywords: ['gravier', 'tonnes de gravier', 'allée gravier', 'm3 gravier', 'calcul gravier', 'cailloux', 'gravillons', 'big bag'],
    intro: [
      'Le gravier se vend à la tonne ou en big-bag, alors que l’on mesure une surface et une épaisseur. Ce calculateur fait la conversion : il donne le <strong>volume en m³</strong>, le <strong>poids en tonnes</strong> et le nombre de big-bags à prévoir, avec une marge de compactage.',
    ],
    blocks: [{
      id: 'gravier', fn: 'aggregate', params: { material: 'gravier' },
      fields: [
        n('long', 'Longueur', '10', { unit: 'm' }), n('larg', 'Largeur', '2', { unit: 'm' }),
        n('ep', 'Épaisseur de la couche', '5', { unit: 'cm' }),
        n('dens', 'Densité du gravier', '1.5', { unit: 't/m³', hint: 'Environ 1,4 à 1,7 t/m³ selon la nature et la granulométrie. À confirmer auprès du fournisseur.' }),
        n('marge', 'Marge de tassement', '10', { unit: '%' }),
      ],
    }],
    how: [
      'Volume = longueur × largeur × épaisseur (en m). On ajoute la marge de tassement. Poids en tonnes = volume avec marge × densité.',
      'La densité varie selon le matériau : demandez-la à votre fournisseur si vous voulez un résultat précis. À défaut, 1,5 t/m³ est un bon ordre de grandeur pour un gravier de carrière courant.',
    ],
    example: () => {
      const r = F.aggregate({ material: 'gravier', long: 10, larg: 2, ep: 5, dens: 1.5, marge: 10 }).raw;
      return `<p>Une allée de 10 m sur 2 m avec 5 cm de gravier : ${fmt(r.vol)} m³ nets. Avec 10 % de marge : ${fmt(r.volM)} m³, soit <strong>${fmt(r.t)} tonnes</strong> à 1,5 t/m³ : prévoyez 2 big-bags d’une tonne.</p>`;
    },
    table: () => ({
      caption: 'Tonnes de gravier pour 10 m² selon l’épaisseur (densité de 1,5 t/m³, sans marge)',
      head: ['Épaisseur', 'Volume', 'Poids'],
      rows: [3, 4, 5, 6, 8, 10].map((e) => [`${e} cm`, `${fmt(10 * e / 100, 2)} m³`, `${fmt(10 * e / 100 * 1.5, 2)} t`]),
    }),
    tips: [
      'Posez un géotextile avant le gravier : il évite les mauvaises herbes et empêche le mélange avec la terre.',
      'Pour une allée carrossable, une sous-couche de matériau stabilisé est nécessaire sous la couche décorative ; le calculateur peut être utilisé une première fois pour chaque couche.',
      'Une épaisseur de 3 à 5 cm suffit généralement pour une couche décorative piétonne.',
    ],
    faq: [
      ['Combien de gravier faut-il pour 10 m² ?', 'Avec une épaisseur de 5 cm, il faut 0,5 m³, soit environ 0,75 tonne à 1,5 t/m³, un peu plus avec la marge de tassement.'],
      ['Combien pèse un m³ de gravier ?', 'En moyenne entre 1,4 et 1,7 tonne selon la nature de la roche, la taille des grains et l’humidité. Demandez la valeur exacte à votre fournisseur.'],
      ['Quelle épaisseur de gravier pour une allée ?', '3 à 5 cm pour la couche de finition d’une allée piétonne. Pour le passage de véhicules, une couche de fondation plus épaisse est nécessaire.'],
      ['Gravier ou gravillons : quelle différence ?', 'Les gravillons sont de petits granulats (en général de 2 à 20 mm). Le terme « gravier » est utilisé plus largement, notamment pour les allées décoratives.'],
    ],
    related: ['calculateur-sable', 'calculateur-beton', 'calculateur-volume', 'calculateur-surface'],
  },

  /* 27 */
  {
    slug: 'calculateur-sable', cat: CAT, sub: 'Sable',
    name: 'Calculateur de sable',
    short: 'Tonnes et volume de sable pour un bac à sable, une terrasse ou une dalle.',
    h1: 'Calculateur de sable : volume et poids nécessaires',
    metaTitle: 'Calculateur de sable : m³ et tonnes à commander',
    metaDesc: 'Calculez la quantité de sable en m³ et en tonnes pour un bac à sable, un lit de pose de pavés ou une terrasse, selon la surface, l’épaisseur et la densité.',
    keywords: ['sable', 'bac à sable', 'lit de pose', 'tonnes de sable', 'm3 de sable', 'calcul sable', 'sable pavés', 'densité sable'],
    intro: [
      'Bac à sable pour les enfants, lit de pose sous des pavés, remblai : le sable se commande en tonnes ou en big-bags, pas en litres. Indiquez la surface et l’épaisseur de la couche, le calculateur donne le <strong>volume en m³</strong> et le <strong>poids en tonnes</strong>, avec une marge.',
    ],
    blocks: [{
      id: 'sable', fn: 'aggregate', params: { material: 'sable' },
      fields: [
        n('long', 'Longueur', '2', { unit: 'm' }), n('larg', 'Largeur', '2', { unit: 'm' }),
        n('ep', 'Épaisseur de la couche', '25', { unit: 'cm' }),
        n('dens', 'Densité du sable', '1.5', { unit: 't/m³', hint: 'Environ 1,5 t/m³ pour un sable sec ; plus s’il est humide. À confirmer auprès du fournisseur.' }),
        n('marge', 'Marge de tassement', '10', { unit: '%' }),
      ],
    }],
    how: [
      'Volume = longueur × largeur × épaisseur. La marge couvre le tassement et les pertes. Poids = volume avec marge × densité.',
      'Un sable humide est plus lourd qu’un sable sec et occupe un peu plus de place : si le sable sera livré humide, utilisez la densité donnée par le fournisseur.',
    ],
    example: () => {
      const r = F.aggregate({ material: 'sable', long: 2, larg: 2, ep: 25, dens: 1.5, marge: 10 }).raw;
      return `<p>Un bac à sable de 2 m × 2 m rempli sur 25 cm : ${fmt(r.vol)} m³. Avec 10 % de marge, <strong>${fmt(r.volM)} m³</strong> soit environ <strong>${fmt(r.t)} tonnes</strong> de sable.</p>`;
    },
    table: () => ({
      caption: 'Épaisseurs de sable courantes selon l’usage',
      head: ['Usage', 'Épaisseur indicative'],
      rows: [['Lit de pose de pavés ou de dalles', '3 à 5 cm'], ['Sous-couche d’une piscine hors-sol', '5 à 10 cm'], ['Bac à sable pour enfants', '20 à 30 cm'], ['Remblai de tranchée', 'selon la profondeur']],
    }),
    tips: [
      'Pour un bac à sable destiné aux enfants, choisissez un sable lavé et adapté à cet usage, et couvrez-le pour le protéger des animaux.',
      'Pour un lit de pose, le sable doit être régulier et bien compacté avant la pose des pavés.',
      'Commandez en vrac si le volume dépasse 1 m³ et que la livraison est possible : c’est souvent plus économique que les sacs.',
    ],
    faq: [
      ['Combien pèse un m³ de sable ?', 'Environ 1,5 tonne pour un sable sec, un peu plus s’il est humide. La valeur exacte est donnée par votre fournisseur.'],
      ['Combien de sable pour 10 m² avec 5 cm d’épaisseur ?', 'Le volume est 0,5 m³ soit environ 0,75 tonne à 1,5 t/m³, plus la marge de tassement.'],
      ['Faut-il ajouter une marge ?', 'Oui, 5 à 10 % couvrent le tassement et les pertes à la mise en œuvre.'],
      ['Quelle différence entre sable et gravillons ?', 'Le sable est composé de grains fins (jusqu’à 4 mm environ), les gravillons de grains plus gros. Pour un béton, on utilise les deux en proportions définies.'],
    ],
    related: ['calculateur-gravier', 'calculateur-beton', 'calculateur-volume', 'calculateur-surface'],
  },

  /* 28 */
  {
    slug: 'calculateur-pente', cat: CAT, sub: 'Pente',
    name: 'Calculateur de pente',
    short: 'Pente en %, angle en degrés, rapport et dénivelé.',
    h1: 'Calculateur de pente : pourcentage, angle et dénivelé',
    metaTitle: 'Calculateur de pente : pourcentage et angle en degrés',
    metaDesc: 'Calculez une pente en pourcentage, en degrés et en rapport à partir du dénivelé et de la distance, ou le dénivelé correspondant à une pente donnée.',
    keywords: ['pente', 'pente en pourcentage', 'pente en degrés', 'rampe', 'dénivelé', 'inclinaison', 'évacuation', 'terrasse'],
    intro: [
      'Rampe d’accès, évacuation d’eau, terrasse, toit ou route : exprimer une pente en pourcentage, en degrés ou en « 1 pour X » demande un petit calcul. Saisissez le <strong>dénivelé</strong> et la <strong>longueur horizontale</strong> ; vous obtenez la pente dans toutes ses formes. Le second bloc fait l’inverse : de la pente au dénivelé.',
    ],
    blocks: [
      { id: 'pente', title: 'Calculer une pente', fn: 'slope', fields: [n('h', 'Dénivelé (différence de hauteur)', '0.5', { hint: 'Même unité que la longueur (par exemple en mètres).' }), n('l', 'Longueur horizontale', '10')] },
      { id: 'denivele', title: 'Calculer le dénivelé d’une pente donnée', fn: 'slopeHeight', fields: [n('pct', 'Pente', '2', { unit: '%' }), n('l', 'Longueur horizontale', '6')] },
    ],
    how: [
      'Pente en % = dénivelé ÷ longueur horizontale × 100. Elle correspond aussi au nombre de centimètres de dénivelé par mètre parcouru : 2 % = 2 cm par mètre.',
      'Angle en degrés = arctangente (dénivelé ÷ longueur horizontale). Une pente de 100 % correspond à un angle de 45°. La longueur suivant la pente (hypoténuse) est √(dénivelé² + longueur²).',
    ],
    example: () => {
      const a = F.slope({ h: 0.5, l: 10 }), b = F.slopeHeight({ pct: 2, l: 6 }).raw.h;
      return `<p>Une rampe qui monte de 0,5 m sur 10 m de longueur horizontale a une pente de <strong>${fmt(a.raw.pct)} %</strong>. Pour qu’une terrasse de 6 m évacue l’eau avec une pente de 2 %, le dénivelé doit être de 6 × 2 ÷ 100 = <strong>${fmt(b * 100, 0)} cm</strong> entre ses deux extrémités.</p>`;
    },
    table: () => ({
      caption: 'Correspondance pente, angle et rapport',
      head: ['Pente', 'Angle', 'Rapport'],
      rows: [1, 2, 5, 8, 10, 12, 15, 20, 30, 50, 100].map((p) => [`${p} %`, `${fmt(Math.atan(p / 100) * 180 / Math.PI, 2)} °`, `1 pour ${fmt(100 / p, 1)}`]),
    }),
    tips: [
      'Pour les accès destinés aux personnes à mobilité réduite, la réglementation française fixe une pente maximale de 5 %, avec quelques tolérances ponctuelles : vérifiez les textes applicables à votre projet.',
      'Une terrasse extérieure doit avoir une légère pente, de l’ordre de 1 à 2 %, pour évacuer l’eau de pluie, orientée à l’opposé de la façade.',
      'Pour une canalisation d’évacuation, la pente se compte en centimètres par mètre : référez-vous au DTU et aux prescriptions du fabricant.',
    ],
    faq: [
      ['Comment calculer une pente en pourcentage ?', 'Divisez le dénivelé par la longueur horizontale et multipliez par 100. Un dénivelé de 30 cm sur 6 m donne 0,3 ÷ 6 × 100 = 5 %.'],
      ['Comment convertir une pente en degrés ?', 'Calculez l’arctangente de (pente ÷ 100). Une pente de 10 % correspond à environ 5,71° ; une pente de 100 % à 45°.'],
      ['Quelle pente pour l’évacuation des eaux d’une terrasse ?', 'En général de 1 à 2 %, soit 1 à 2 cm par mètre. Une pente insuffisante laisse stagner l’eau, une pente excessive se remarque à l’œil et au niveau des meubles.'],
      ['La longueur à saisir est-elle celle de la pente ou la distance horizontale ?', 'C’est la distance horizontale, mesurée à plat. La longueur suivant la pente est donnée dans le résultat.'],
    ],
    related: ['calculateur-surface', 'calculateur-volume', 'calculateur-regle-de-trois', 'calculateur-beton'],
  },

  /* 29 */
  {
    slug: 'calculateur-plinthes', cat: CAT, sub: 'Parquet',
    name: 'Calculateur de plinthes',
    short: 'Nombre de plinthes à acheter pour une pièce, portes déduites.',
    h1: 'Calculateur de plinthes : combien en acheter pour une pièce ?',
    metaTitle: 'Calculateur de plinthes : nombre et mètres linéaires',
    metaDesc: 'Calculez le nombre de plinthes à acheter pour une pièce : périmètre, largeur des portes déduite, longueur d’une plinthe et marge de coupe.',
    keywords: ['plinthes', 'nombre de plinthes', 'mètres linéaires', 'périmètre pièce', 'plinthe parquet', 'calcul plinthes'],
    intro: [
      'Les plinthes se vendent par barres de 2,2 à 2,4 m environ. Entrez les dimensions de la pièce, la largeur cumulée des portes et la longueur d’une barre : le calculateur donne le <strong>nombre de plinthes</strong> à acheter, en tenant compte d’une marge pour les coupes d’angle.',
    ],
    blocks: [{
      id: 'plinthes', fn: 'skirting',
      fields: [
        n('long', 'Longueur de la pièce', '4', { unit: 'm' }), n('larg', 'Largeur de la pièce', '3', { unit: 'm' }),
        n('portes', 'Largeur cumulée des portes', '1.8', { unit: 'm', hint: 'Une porte standard mesure environ 0,9 m de large, sans plinthe sous son passage.' }),
        n('lg', 'Longueur d’une plinthe', '2.4', { unit: 'm' }),
        n('marge', 'Marge pour les coupes', '10', { unit: '%' }),
      ],
    }],
    how: [
      'Périmètre = 2 × (longueur + largeur). On retire la largeur des portes, puis on ajoute la marge pour les coupes à onglet et les chutes.',
      'Nombre de plinthes = longueur avec marge ÷ longueur d’une plinthe, arrondi au chiffre supérieur.',
    ],
    example: () => {
      const r = F.skirting({ long: 4, larg: 3, portes: 1.8, lg: 2.4, marge: 10 }).raw;
      return `<p>Pièce de 4 m × 3 m : périmètre de ${fmt(r.per)} m. Portes déduites (1,8 m) : ${fmt(r.net)} m. Avec 10 % de marge : ${fmt(r.net * 1.1, 2)} m, soit <strong>${r.n} plinthes</strong> de 2,4 m.</p>`;
    },
    table: () => ({
      caption: 'Périmètre approximatif selon la surface (pièce rectangulaire)',
      head: ['Pièce', 'Surface', 'Périmètre'],
      rows: [[3, 3], [4, 3], [4, 4], [5, 4], [6, 4], [6, 5]].map(([a, b]) => [`${a} × ${b} m`, `${a * b} m²`, `${2 * (a + b)} m`]),
    }),
    tips: [
      'Mesurez le périmètre réel de la pièce : les angles rentrants, placards ou cheminées modifient la longueur à couvrir.',
      'Pour un angle, la coupe à onglet consomme un peu de longueur : c’est le rôle de la marge.',
      'Choisissez des plinthes assorties au sol ou au mur, et achetez toutes les barres du même lot.',
    ],
    faq: [
      ['Comment calculer le nombre de plinthes ?', 'Calculez le périmètre de la pièce, retirez la largeur des portes, ajoutez environ 10 % de marge puis divisez par la longueur d’une plinthe.'],
      ['Faut-il déduire les portes ?', 'Oui, on ne pose pas de plinthe dans le passage d’une porte. Les portes-fenêtres ou baies vitrées sont également à déduire.'],
      ['Quelle longueur de plinthe choisir ?', 'Les plinthes sont couramment vendues en 2,2 m ou 2,4 m. Une longueur plus grande limite les raccords mais est plus encombrante à transporter.'],
      ['Comment compter les plinthes d’une pièce en L ?', 'Additionnez les longueurs de tous les murs : pour un L simple, le périmètre est celui du rectangle englobant.'],
    ],
    related: ['calculateur-parquet', 'calculateur-carrelage', 'calculateur-surface', 'calculateur-peinture'],
  },
];
