// Configuration centrale du site. Tout ce qui est « à remplacer plus tard » est ici.
// Les valeurs peuvent aussi être fournies par variables d'environnement (Cloudflare Pages > Settings > Environment variables).

const env = (k, d = '') => (process.env[k] ?? d).trim();

export const config = {
  /** Nom provisoire du site : à modifier librement, il est repris partout. */
  SITE_NAME: env('SITE_NAME', 'Outils du Quotidien'),
  SITE_TAGLINE: 'Calculateurs, convertisseurs et outils de planification gratuits',

  /**
   * URL publique du site, sans slash final.
   * Provisoire : adresse *.pages.dev. À remplacer par le nom de domaine définitif (variable SITE_URL).
   */
  SITE_URL: env('SITE_URL', 'https://outils-du-quotidien.pages.dev').replace(/\/+$/, ''),

  /* ── Google AdSense ─────────────────────────────────────────────
   * Tant que ADSENSE_PUBLISHER_ID est vide, AUCUN code publicitaire n'est inséré,
   * aucun script tiers n'est chargé et aucun espace vide n'est réservé.
   * Format attendu : « pub-1234567890123456 » (à fournir par Google après validation du site). */
  ADSENSE_PUBLISHER_ID: env('ADSENSE_PUBLISHER_ID'),

  /**
   * Passer à « true » UNIQUEMENT quand un vrai bandeau de consentement compatible Google
   * (plateforme de gestion du consentement certifiée, par ex. « Confidentialité et messagerie » d'AdSense)
   * est actif sur le site. Tant que c'est « false », le script AdSense n'est pas chargé.
   */
  CONSENT_MECHANISM_READY: env('CONSENT_MECHANISM_READY') === 'true',

  /** Identifiants d'emplacements (blocs d'annonces) créés dans AdSense. Vide = emplacement non rendu. */
  ADSENSE_SLOTS: {
    top: env('ADSENSE_SLOT_TOP'),       // après l'introduction
    result: env('ADSENSE_SLOT_RESULT'), // après le résultat du calculateur
    faq: env('ADSENSE_SLOT_FAQ'),       // avant la FAQ
    side: env('ADSENSE_SLOT_SIDE'),     // colonne latérale (écrans larges uniquement)
  },

  /* ── Mesure d'audience et Search Console (aucun identifiant fictif) ── */
  GA_MEASUREMENT_ID: env('GA_MEASUREMENT_ID'),           // « G-XXXXXXXXXX » — chargé seulement si CONSENT_MECHANISM_READY
  GSC_VERIFICATION: env('GSC_VERIFICATION'),             // contenu de la balise meta google-site-verification

  /* ── Informations légales de l'éditeur (à compléter) ── */
  LEGAL: {
    publisher: env('LEGAL_PUBLISHER'),   // nom ou raison sociale
    status: env('LEGAL_STATUS'),         // ex. « micro-entreprise », « particulier »
    address: env('LEGAL_ADDRESS'),
    email: env('LEGAL_EMAIL'),
    director: env('LEGAL_DIRECTOR'),     // directeur de la publication
    siret: env('LEGAL_SIRET'),
  },
};

export const adsEnabled = () => Boolean(config.ADSENSE_PUBLISHER_ID) && config.CONSENT_MECHANISM_READY;
export const BUILD_YEAR = new Date().getFullYear();
