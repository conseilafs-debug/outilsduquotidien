import { FUNCTIONS as F, fmt, dateLong, utc, holidaysFR } from '../utils/calc.mjs';
import { n, s, d } from './fields.mjs';
import { refYear } from './tools-general.mjs';

const CAT = 'calendrier';
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const iso = (y, m, dd) => `${y}-${String(m).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;

const UNITS_SHIFT = [
  { v: 'jours', label: 'jours' }, { v: 'semaines', label: 'semaines' }, { v: 'mois', label: 'mois' },
  { v: 'annees', label: 'années' }, { v: 'ouvres', label: 'jours ouvrés (hors week-ends et fériés)' },
];
const DELAIS = {
  caption: 'Quelques délais courants exprimés en jours (à titre d’exemple)',
  head: ['Délai', 'Durée', 'Remarque'],
  rows: [
    ['Rétractation après un achat à distance', '14 jours', 'Délai légal de principe pour un consommateur, à compter de la réception du bien'],
    ['Paiement d’une facture à 30 jours', '30 jours', 'À compter de la date de la facture, sauf mention différente'],
    ['Délai maximal de paiement entre professionnels', '60 jours', 'À compter de la date d’émission de la facture, sauf cas particuliers'],
    ['Garantie légale de conformité (biens neufs)', '2 ans', 'Soit 24 mois à partir de la délivrance du bien'],
  ],
};

export const dateTools = [
  /* 46 */
  {
    slug: 'compteur-jusqu-a-une-date', cat: CAT, sub: 'Compteurs',
    name: 'Compteur de jours jusqu’à une date',
    short: 'Combien de jours avant (ou depuis) une date de votre choix.',
    h1: 'Compteur jusqu’à une date : combien de jours restent-ils ?',
    metaTitle: 'Compteur de jours jusqu’à une date (compte à rebours)',
    metaDesc: 'Calculez combien de jours, semaines, mois et heures restent avant une date : vacances, mariage, anniversaire, examen. Compte à rebours gratuit.',
    keywords: ['compteur', 'compte à rebours', 'jours restants', 'combien de jours avant', 'décompte', 'échéance', 'vacances'],
    intro: [
      'Vacances, mariage, naissance prévue, examen, fin de contrat : choisissez une date, le compteur indique <strong>le nombre de jours restants</strong>, avec le détail en semaines, en mois et en heures. Il fonctionne aussi pour une date passée : vous voyez alors depuis combien de temps elle est écoulée.',
    ],
    blocks: [{ id: 'compteur', fn: 'countdown', fields: [d('target', 'Date à atteindre', ''), d('from', 'Compter à partir du', 'today')] }],
    how: [
      'Le nombre de jours est la différence entre les deux dates dans le calendrier réel, sans heure ni fuseau horaire. La date de départ est par défaut celle d’aujourd’hui, mais vous pouvez la modifier.',
      'Le détail en mois et en jours ajoute d’abord des mois entiers à la date de départ, puis compte les jours restants.',
    ],
    example: () => {
      const r = F.countdown({ from: '2025-06-01', target: '2025-08-15' }).raw;
      return `<p>Du 1er juin au 15 août 2025, il reste <strong>${r.days} jours</strong>, soit ${Math.floor(r.days / 7)} semaines et ${r.days % 7} jours, ou encore 2 mois et 14 jours.</p>`;
    },
    table: () => DELAIS,
    tips: [
      'Enregistrez la page dans vos favoris : la date de départ est toujours celle du jour de votre visite.',
      'Pour un événement à l’heure près (départ d’un avion, début d’un examen), tenez compte de l’heure : le compteur raisonne en jours entiers.',
      'Pour ajouter un délai à une date plutôt que compter jusqu’à une date, utilisez le calculateur de date future.',
    ],
    faq: [
      ['Comment calculer le nombre de jours avant une date ?', 'Calculez la différence entre la date visée et la date du jour. Le compteur le fait en tenant compte de la longueur réelle des mois et des années bissextiles.'],
      ['Le compteur fonctionne-t-il pour une date passée ?', 'Oui. Il affiche alors depuis combien de jours la date est passée.'],
      ['Le jour même est-il compté ?', 'Le résultat est l’écart entre les deux dates : le jour d’aujourd’hui n’est pas compté, et le jour visé non plus.'],
      ['Puis-je compter à partir d’une autre date que celle d’aujourd’hui ?', 'Oui, modifiez le champ « Compter à partir du ».'],
    ],
    related: ['jours-avant-noel', 'jours-avant-nouvel-an', 'calculateur-jours-entre-deux-dates', 'calculateur-duree'],
  },

  /* 47 */
  {
    slug: 'jours-avant-noel', cat: CAT, sub: 'Compteurs', popular: true,
    name: 'Nombre de jours avant Noël',
    short: 'Combien de jours, de semaines et de jours ouvrés avant le 25 décembre.',
    h1: 'Combien de jours avant Noël ? Le compte à rebours jusqu’au 25 décembre',
    metaTitle: 'Combien de jours avant Noël ? Compte à rebours du 25 décembre',
    metaDesc: 'Découvrez combien de jours, semaines et jours ouvrés il reste avant Noël. Compte à rebours mis à jour chaque jour jusqu’au 25 décembre.',
    keywords: ['jours avant noël', 'combien de jours avant noël', 'compte à rebours noël', 'noël', '25 décembre', 'dodo avant noël'],
    intro: [
      'Combien de nuits avant le Père Noël ? Cette page calcule <strong>le nombre de jours restants avant le 25 décembre</strong>, à partir de la date du jour. Après le 25 décembre, le compteur bascule automatiquement sur Noël de l’année suivante.',
    ],
    blocks: [{ id: 'noel', fn: 'daysToAnnual', params: { month: 12, day: 25, label: 'Noël' }, fields: [d('from', 'Compter à partir du', 'today')] }],
    how: [
      'Le calculateur détermine la prochaine date du 25 décembre qui n’est pas passée, puis compte les jours qui nous en séparent. Il indique aussi le nombre de jours ouvrés restants (hors week-ends et jours fériés), pratique pour s’organiser avant les congés.',
      'Le 25 décembre est un jour férié légal en France, chaque année.',
    ],
    example: () => {
      const r = F.daysToAnnual({ from: '2025-12-01', month: 12, day: 25, label: 'Noël' }).raw;
      return `<p>Le 1er décembre, il reste <strong>${r.days} jours</strong> avant Noël, soit 3 semaines et 3 jours. La veille de Noël (24 décembre), le compteur affiche 1 jour.</p>`;
    },
    table: () => {
      const y = refYear();
      return {
        caption: `Jours restants avant Noël ${y}, au 1er de chaque mois`,
        head: ['Date de départ', 'Jours restants', 'Date de départ', 'Jours restants'],
        rows: [0, 1, 2, 3, 4, 5].map((i) => [`1er ${MONTHS[i]}`, String(F.daysToAnnual({ from: iso(y, i + 1, 1), month: 12, day: 25, label: 'Noël' }).raw.days), `1er ${MONTHS[i + 6]}`, String(F.daysToAnnual({ from: iso(y, i + 7, 1), month: 12, day: 25, label: 'Noël' }).raw.days)]),
      };
    },
    tips: [
      'Pour préparer les cadeaux et les trajets, comptez en semaines : à partir de début novembre, il reste moins de huit semaines.',
      'Pour savoir combien de jours de travail restent avant les congés de fin d’année, regardez le nombre de jours ouvrés restants.',
      'Pour compter jusqu’à une autre date, utilisez le compteur jusqu’à une date.',
    ],
    faq: [
      ['Combien de jours avant Noël ?', 'Cela dépend de la date du jour : le compteur ci-dessus le calcule automatiquement jusqu’au 25 décembre.'],
      ['Combien de semaines avant Noël ?', 'Le détail du résultat donne le nombre de semaines complètes et de jours restants.'],
      ['Que se passe-t-il le jour de Noël ?', 'Le compteur affiche « C’est aujourd’hui ! ». Dès le 26 décembre, il compte jusqu’à Noël de l’année suivante.'],
      ['Le 24 décembre est-il férié ?', 'Non, le 24 décembre n’est pas un jour férié légal en France, contrairement au 25 décembre.'],
    ],
    related: ['jours-avant-nouvel-an', 'compteur-jusqu-a-une-date', 'jours-feries', 'calculateur-jours-ouvres'],
  },

  /* 48 */
  {
    slug: 'jours-avant-nouvel-an', cat: CAT, sub: 'Compteurs',
    name: 'Nombre de jours avant le Nouvel An',
    short: 'Combien de jours avant le 1er janvier.',
    h1: 'Combien de jours avant le Nouvel An ? Compte à rebours jusqu’au 1er janvier',
    metaTitle: 'Combien de jours avant le Nouvel An ? Compte à rebours',
    metaDesc: 'Calculez combien de jours, semaines et jours ouvrés restent avant le Nouvel An (1er janvier). Compte à rebours automatique, mis à jour chaque jour.',
    keywords: ['jours avant nouvel an', 'compte à rebours nouvel an', '1er janvier', 'réveillon', 'saint-sylvestre', 'nouvelle année'],
    intro: [
      'Plus que quelques jours avant la nouvelle année ? Ce compteur calcule <strong>le nombre de jours restants avant le 1er janvier</strong>, avec le détail en semaines et en jours ouvrés. Le 1er janvier passé, il bascule sur l’année suivante.',
    ],
    blocks: [{ id: 'an', fn: 'daysToAnnual', params: { month: 1, day: 1, label: 'le Nouvel An' }, fields: [d('from', 'Compter à partir du', 'today')] }],
    how: [
      'Le 1er janvier de l’année qui suit la date de départ est la date cible. Le nombre de jours est la différence entre les deux dates, en tenant compte de la longueur de chaque mois.',
      'Le 1er janvier est un jour férié légal : le calcul des jours ouvrés restants ne le compte pas.',
    ],
    example: () => {
      const r = F.daysToAnnual({ from: '2025-12-15', month: 1, day: 1, label: 'le Nouvel An' }).raw;
      return `<p>Le 15 décembre, il reste <strong>${r.days} jours</strong> avant le Nouvel An. Le 31 décembre, il n’en reste qu’un.</p>`;
    },
    table: () => {
      const y = refYear();
      return {
        caption: `Jours restants avant le 1er janvier ${y + 1}, au 1er de chaque mois de ${y}`,
        head: ['Date de départ', 'Jours restants', 'Date de départ', 'Jours restants'],
        rows: [0, 1, 2, 3, 4, 5].map((i) => [`1er ${MONTHS[i]}`, String(F.daysToAnnual({ from: iso(y, i + 1, 1), month: 1, day: 1, label: 'x' }).raw.days), `1er ${MONTHS[i + 6]}`, String(F.daysToAnnual({ from: iso(y, i + 7, 1), month: 1, day: 1, label: 'x' }).raw.days)]),
      };
    },
    tips: [
      'En fin d’année, le nombre de jours ouvrés restants aide à planifier les échéances avant la clôture de l’exercice.',
      'La nuit du 31 décembre au 1er janvier s’appelle la Saint-Sylvestre en France.',
      'Pour compter jusqu’à une date particulière, utilisez le compteur jusqu’à une date.',
    ],
    faq: [
      ['Combien de jours avant le 1er janvier ?', 'Le compteur calcule le nombre exact de jours à partir de la date du jour.'],
      ['Que se passe-t-il le 1er janvier ?', 'Le compteur affiche « C’est aujourd’hui ! » ; dès le lendemain, il compte jusqu’au 1er janvier suivant.'],
      ['Combien de jours compte une année ?', '365 jours, ou 366 en année bissextile.'],
      ['Combien de jours ouvrés reste-t-il avant la fin de l’année ?', 'Le détail du résultat donne le nombre de jours ouvrés restants, hors week-ends et jours fériés.'],
    ],
    related: ['jours-avant-noel', 'compteur-jusqu-a-une-date', 'calculateur-jours-ouvres', 'jours-feries'],
  },

  /* 49 */
  {
    slug: 'calculateur-date-future', cat: CAT, sub: 'Échéances', popular: true,
    name: 'Calculateur de date future',
    short: 'Ajouter des jours, semaines, mois, années ou jours ouvrés à une date.',
    h1: 'Calculateur de date future : quelle date dans X jours, semaines ou mois ?',
    metaTitle: 'Calculateur de date future : ajouter jours, mois, années',
    metaDesc: 'Ajoutez des jours, des semaines, des mois, des années ou des jours ouvrés à une date pour trouver une échéance. Résultat avec jour de la semaine.',
    keywords: ['date future', 'ajouter des jours', 'dans 30 jours', 'échéance', 'ajouter mois à une date', 'jours ouvrés', 'date limite', 'délai'],
    intro: [
      'Fin de période d’essai, date limite de paiement, retour d’un colis, naissance prévue : <strong>quelle date obtient-on en ajoutant 30 jours, 6 mois ou 10 jours ouvrés</strong> à une date de départ ? Saisissez la date, la durée et l’unité : le résultat s’affiche avec le jour de la semaine.',
    ],
    blocks: [{ id: 'futur', fn: 'dateShift', params: { sign: 1 }, fields: [d('start', 'Date de départ', 'today'), n('n', 'Nombre à ajouter', '30', { inputmode: 'numeric' }), s('unit', 'Unité', UNITS_SHIFT, 'jours')] }],
    how: [
      'Jours et semaines s’ajoutent directement sur le calendrier. Pour les mois et les années, on conserve le jour du mois ; si ce jour n’existe pas dans le mois d’arrivée (31 janvier + 1 mois), on retient le dernier jour du mois (28 ou 29 février).',
      'Pour les jours ouvrés, on avance jour par jour en sautant les samedis, les dimanches et les jours fériés français : 5 jours ouvrés après un vendredi mènent généralement au vendredi suivant, ou plus tard en cas de férié.',
    ],
    example: () => {
      const a = F.dateShift({ start: '2025-01-15', n: 30, unit: 'jours', sign: 1 }).raw.iso, b = F.dateShift({ start: '2025-01-31', n: 1, unit: 'mois', sign: 1 }).raw.iso, c = F.dateShift({ start: '2025-04-18', n: 5, unit: 'ouvres', sign: 1 }).raw.iso;
      const D = (x) => { const [y, m, dd] = x.split('-').map(Number); return dateLong(utc(y, m - 1, dd)); };
      return `<p>30 jours après le 15 janvier 2025 : <strong>${D(a)}</strong>. Un mois après le 31 janvier 2025 : <strong>${D(b)}</strong>. 5 jours ouvrés après le vendredi 18 avril 2025, avec le lundi de Pâques férié : <strong>${D(c)}</strong>.</p>`;
    },
    table: () => DELAIS,
    tips: [
      'Pour un délai légal ou contractuel, vérifiez la règle de décompte applicable : le premier jour est le plus souvent exclu, et un délai qui expire un samedi, un dimanche ou un jour férié est parfois prolongé.',
      'En ajoutant 12 mois ou 1 an à une date, vous retombez sur la même date l’année suivante, sauf pour le 29 février.',
      'Pour connaître le nombre de jours entre deux dates connues, utilisez le calculateur de jours entre deux dates.',
    ],
    faq: [
      ['Comment calculer une date dans 30 jours ?', 'Choisissez « jours », saisissez 30 et la date de départ : le calculateur donne la date obtenue et son jour de la semaine.'],
      ['Que se passe-t-il quand j’ajoute un mois à une date comme le 31 ?', 'Si le mois suivant est plus court, on retient son dernier jour : le 31 janvier plus un mois donne le 28 (ou 29) février.'],
      ['Les jours fériés sont-ils pris en compte ?', 'Uniquement pour l’unité « jours ouvrés », avec les 11 jours fériés légaux de la France métropolitaine.'],
      ['Comment soustraire un nombre de jours ?', 'Utilisez le calculateur de date passée, qui fonctionne exactement de la même manière dans l’autre sens.'],
    ],
    related: ['calculateur-date-passee', 'calculateur-jours-ouvres', 'calculateur-jours-entre-deux-dates', 'compteur-jusqu-a-une-date'],
  },

  /* 50 */
  {
    slug: 'calculateur-date-passee', cat: CAT, sub: 'Dates',
    name: 'Calculateur de date passée',
    short: 'Retirer des jours, semaines, mois ou années à une date.',
    h1: 'Calculateur de date passée : quelle date il y a X jours, semaines ou mois ?',
    metaTitle: 'Calculateur de date passée : retirer jours, mois, années',
    metaDesc: 'Retirez des jours, des semaines, des mois, des années ou des jours ouvrés à une date pour trouver une date antérieure. Résultat avec jour de la semaine.',
    keywords: ['date passée', 'il y a 90 jours', 'retirer des jours', 'soustraire jours', 'date antérieure', 'jours ouvrés avant', 'remonter dans le temps'],
    intro: [
      'Quelle était la date il y a 90 jours ? À quelle date faut-il remonter pour couvrir les 6 derniers mois ? Saisissez une date de départ, une durée et une unité : le calculateur <strong>retire</strong> cette durée et affiche la date obtenue avec son jour de la semaine.',
    ],
    blocks: [{ id: 'passe', fn: 'dateShift', params: { sign: -1 }, fields: [d('start', 'Date de départ', 'today'), n('n', 'Nombre à retirer', '90', { inputmode: 'numeric' }), s('unit', 'Unité', UNITS_SHIFT, 'jours')] }],
    how: [
      'Jours et semaines se retirent directement sur le calendrier. Pour les mois et les années, on conserve le jour du mois ; s’il n’existe pas dans le mois d’arrivée, on retient le dernier jour de ce mois.',
      'Pour les jours ouvrés, on recule jour par jour en ignorant les samedis, les dimanches et les jours fériés français.',
    ],
    example: () => {
      const a = F.dateShift({ start: '2025-03-31', n: 1, unit: 'mois', sign: -1 }).raw.iso, b = F.dateShift({ start: '2025-03-01', n: 1, unit: 'jours', sign: -1 }).raw.iso, c = F.dateShift({ start: '2024-03-01', n: 1, unit: 'jours', sign: -1 }).raw.iso;
      const D = (x) => { const [y, m, dd] = x.split('-').map(Number); return dateLong(utc(y, m - 1, dd)); };
      return `<p>Un mois avant le 31 mars 2025 : <strong>${D(a)}</strong>. Un jour avant le 1er mars 2025 : ${D(b)}, mais en 2024 (année bissextile) : <strong>${D(c)}</strong>.</p>`;
    },
    table: () => ({
      caption: 'Repères : durées usuelles à retirer',
      head: ['Période', 'Équivalent en jours (approximatif)'],
      rows: [['2 semaines', '14 jours'], ['1 mois', '28 à 31 jours'], ['3 mois', '89 à 92 jours'], ['6 mois', '181 à 184 jours'], ['1 an', '365 ou 366 jours']],
    }),
    tips: [
      'Pour retrouver une date de début à partir d’une échéance connue, retirez la durée du contrat à la date de fin.',
      'Pour un historique de 12 mois glissants, retirez 12 mois à la date du jour.',
      'Pour calculer le nombre de jours entre deux dates connues, utilisez plutôt le calculateur de jours entre deux dates.',
    ],
    faq: [
      ['Comment calculer une date il y a 90 jours ?', 'Choisissez « jours », saisissez 90 et la date de départ : le calculateur retire 90 jours et donne la date obtenue.'],
      ['Que se passe-t-il quand je retire un mois à une date comme le 31 ?', 'Si le mois précédent est plus court, on retient son dernier jour : un mois avant le 31 mars donne le 28 (ou 29) février.'],
      ['Les années bissextiles sont-elles gérées ?', 'Oui : un jour avant le 1er mars donne le 29 février en année bissextile et le 28 février sinon.'],
      ['Comment ajouter plutôt que retirer ?', 'Utilisez le calculateur de date future.'],
    ],
    related: ['calculateur-date-future', 'calculateur-jours-entre-deux-dates', 'calculateur-duree', 'calculateur-age'],
  },

  /* 51 — bonus : jours fériés */
  {
    slug: 'jours-feries', cat: CAT, sub: 'Jours fériés',
    name: 'Jours fériés en France',
    short: 'Les 11 jours fériés légaux d’une année, avec leurs dates et jours de la semaine.',
    h1: 'Jours fériés en France : dates et calendrier par année',
    metaTitle: 'Jours fériés en France : calendrier par année',
    metaDesc: 'Consultez les 11 jours fériés légaux en France pour l’année de votre choix : dates de Pâques, Ascension et Pentecôte comprises, avec les jours de la semaine.',
    keywords: ['jours fériés', 'calendrier jours fériés', 'jour férié', 'pâques', 'ascension', 'pentecôte', 'ponts', 'férié 2027'],
    intro: [
      'Saisissez une année : la page liste les <strong>11 jours fériés légaux en France métropolitaine</strong> avec leur date exacte et leur jour de la semaine. Les dates mobiles (lundi de Pâques, Ascension, lundi de Pentecôte) sont calculées pour chaque année.',
    ],
    blocks: [{ id: 'feries', fn: 'holidays', fields: [n('year', 'Année', String(refYear()), { inputmode: 'numeric' })] }],
    how: [
      'Huit jours fériés ont une date fixe : 1er janvier, 1er mai, 8 mai, 14 juillet, 15 août, 1er novembre, 11 novembre et 25 décembre. Trois dépendent de la date de Pâques : le lundi de Pâques (lendemain), l’Ascension (39 jours après) et le lundi de Pentecôte (50 jours après).',
      'La date de Pâques est le premier dimanche suivant la première pleine lune de printemps ; elle est calculée avec un algorithme exact du calendrier grégorien.',
    ],
    example: () => {
      const l = holidaysFR(2026).list.filter((h) => ['Lundi de Pâques', 'Ascension', 'Lundi de Pentecôte'].includes(h.name));
      return `<p>En 2026, Pâques tombe le 5 avril. Les jours fériés mobiles sont donc le <strong>${dateLong(l[0].date)}</strong> (lundi de Pâques), le <strong>${dateLong(l[1].date)}</strong> (Ascension) et le <strong>${dateLong(l[2].date)}</strong> (lundi de Pentecôte).</p>`;
    },
    table: () => {
      const y = refYear() + 1;
      return {
        caption: `Jours fériés ${y}`,
        head: ['Jour férié', 'Date'],
        rows: holidaysFR(y).list.map((h) => [h.name, dateLong(h.date)]),
      };
    },
    tips: [
      'Le 1er mai est le seul jour férié que la loi rend obligatoirement chômé ; pour les autres, c’est la convention collective ou l’accord d’entreprise qui précise.',
      'Les départements d’Alsace-Moselle comptent deux jours fériés supplémentaires : le Vendredi saint et le 26 décembre.',
      'Pour compter les jours travaillés d’une période en excluant les fériés, utilisez le calculateur de jours ouvrés.',
    ],
    faq: [
      ['Combien y a-t-il de jours fériés en France ?', 'Onze jours fériés légaux en métropole : 1er janvier, lundi de Pâques, 1er mai, 8 mai, Ascension, lundi de Pentecôte, 14 juillet, 15 août, 1er novembre, 11 novembre et 25 décembre.'],
      ['Comment est calculée la date de Pâques ?', 'Pâques est le premier dimanche après la première pleine lune qui suit l’équinoxe de printemps. Sa date varie entre le 22 mars et le 25 avril.'],
      ['La journée de solidarité correspond-elle à un jour férié ?', 'Elle peut être fixée le lundi de Pentecôte, mais ce n’est pas obligatoire : l’entreprise ou l’accord collectif peut choisir une autre modalité.'],
      ['Les jours fériés qui tombent un week-end sont-ils récupérés ?', 'En France, il n’existe pas de jour de remplacement général pour un férié tombant un samedi ou un dimanche.'],
    ],
    related: ['calculateur-jours-ouvres', 'calculateur-date-future', 'jours-avant-noel', 'jours-avant-nouvel-an'],
  },
];
