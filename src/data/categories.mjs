// Catégories principales. Les sous-catégories sans outil ne génèrent aucune section (pas de page vide / « thin content »).
export const CATEGORIES = [
  {
    id: 'calculateurs', slug: 'calculateurs', name: 'Calculateurs', h1: 'Calculateurs gratuits en ligne', verb: 'Calculer', icon: '%', color: 'blue',
    metaTitle: 'Calculateurs gratuits : pourcentage, TVA, salaire, âge',
    metaDesc: 'Calculateurs gratuits en ligne : pourcentages, TVA, salaire, moyenne, âge, remises. Des résultats clairs, avec formules, exemples et réponses aux questions courantes.',
    intro: 'Pourcentages, TVA, salaires, moyennes, âge : des calculateurs simples et fiables pour les calculs de tous les jours. Chaque outil affiche le résultat immédiatement et explique la formule utilisée.',
    subs: ['Pourcentages', 'Mathématiques', 'Argent', 'Dates et durées', 'Temps', 'Santé et bien-être', 'Vie quotidienne'],
  },
  {
    id: 'conversions', slug: 'conversions', name: 'Conversions', h1: 'Convertisseurs d’unités gratuits', verb: 'Convertir', icon: '⇄', color: 'teal',
    metaTitle: 'Convertisseurs d’unités gratuits : pouces, kg, °C, mph',
    metaDesc: 'Convertisseurs d’unités gratuits : pouces et cm, kg et livres, Celsius et Fahrenheit, km/h et mph, litres, gallons… Résultat immédiat et tableaux de conversion.',
    intro: 'Longueurs, poids, volumes, températures, vitesses : convertissez rapidement les unités du système métrique et anglo-saxon, avec des tableaux de valeurs courantes et les facteurs exacts de conversion.',
    subs: ['Longueur', 'Poids', 'Volume', 'Surface', 'Température', 'Temps', 'Cuisine', 'Vitesse'],
  },
  {
    id: 'maison', slug: 'maison-travaux', name: 'Maison & travaux', h1: 'Calculateurs pour la maison et les travaux', verb: 'Bricoler', icon: '⌂', color: 'amber',
    metaTitle: 'Calculateurs de travaux : peinture, carrelage, béton, sable',
    metaDesc: 'Calculez les quantités pour vos travaux : peinture, carrelage, parquet, béton, gravier, sable, plinthes. Surfaces, volumes et pentes avec marge de sécurité.',
    intro: 'Combien de litres de peinture, de carreaux, de paquets de parquet ou de tonnes de gravier ? Calculez les bonnes quantités avant d’acheter, avec une marge de sécurité adaptée à chaque chantier.',
    subs: ['Peinture', 'Carrelage', 'Parquet', 'Béton', 'Gravier', 'Sable', 'Surface', 'Volume', 'Pente', 'Chauffage', 'Électricité'],
  },
  {
    id: 'calendrier', slug: 'calendrier-planification', name: 'Calendrier & planification', h1: 'Calendrier et planification : calculateurs de dates', verb: 'Planifier', icon: '◷', color: 'violet',
    metaTitle: 'Calculateurs de dates : jours ouvrés, durée, échéances',
    metaDesc: 'Calculateurs de dates et de durées : jours ouvrés, jours entre deux dates, date future ou passée, compte à rebours, jours fériés. Pour planifier sans erreur.',
    intro: 'Durées entre deux dates, jours ouvrés, échéances, jours fériés et comptes à rebours : planifiez vos délais en tenant compte du vrai calendrier, des mois inégaux et des années bissextiles.',
    subs: ['Dates', 'Jours ouvrés', 'Jours fériés', 'Vacances scolaires', 'Compteurs', 'Durées', 'Échéances'],
  },
];

export const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
