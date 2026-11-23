# Outils du Quotidien

Site français statique d'outils gratuits (51 calculateurs, convertisseurs, outils maison & travaux et dates), prêt pour Cloudflare Pages et, plus tard, Google AdSense.

- Générateur Node maison, sans framework : pages HTML pré-rendues, JS/CSS minifiés et hachés (esbuild).
- Les calculs sont des fonctions pures partagées entre le build (exemples, tableaux, résultats pré-rendus), les tests et le navigateur.
- Aucune publicité, aucun traceur, aucun cookie par défaut.

## Commandes

```bash
npm install
npm run build     # génère dist/
npm test          # tests des calculs + tests du code client (jsdom)
npm run check     # contrôles SEO/liens/sitemap sur dist/
npm run verify    # build + test + check
npm run preview   # sert dist/ sur http://localhost:8788
```

Node 20 ou plus récent.

## Déploiement Cloudflare Pages

1. Pousser le dépôt sur GitHub.
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → choisir le dépôt.
3. Réglages de build :
   - Framework preset : None
   - Build command : `npm run build`
   - Build output directory : `dist`
   - Variable d'environnement `NODE_VERSION` = `20`
4. Variables d'environnement recommandées (Production) :
   - `SITE_URL` : l'URL publique exacte, sans slash final (ex. `https://xxx.pages.dev`). Elle alimente canonicals, sitemap, robots.txt et Open Graph.
   - `SITE_NAME` (optionnel) : nom affiché.
   - `LEGAL_PUBLISHER`, `LEGAL_STATUS`, `LEGAL_ADDRESS`, `LEGAL_EMAIL`, `LEGAL_DIRECTOR`, `LEGAL_SIREN` : identité de l'éditeur des mentions légales. Valeurs par défaut déjà renseignées (Athéna Office) dans `site.config.mjs` ; ces variables permettent de les surcharger.
5. Déployer, puis tester la home, une page outil, `/sitemap.xml`, `/robots.txt` et une URL inexistante (404 personnalisée).

## Ajouter un nom de domaine plus tard

1. Cloudflare Pages → projet → Custom domains → Set up a custom domain.
2. Suivre l'assistant (CNAME vers le `*.pages.dev`, ou zone gérée par Cloudflare).
3. Mettre `SITE_URL=https://votre-domaine.fr` dans les variables, puis relancer un déploiement (les canonicals et le sitemap changent).
4. Ajouter la propriété dans Google Search Console et soumettre `https://votre-domaine.fr/sitemap.xml`.
5. Optionnel : rediriger l'ancien `*.pages.dev` vers le domaine (règle de redirection Cloudflare).

## Activer Google AdSense (plus tard)

Rien n'est chargé tant que les deux conditions ne sont pas réunies.

1. Compléter les mentions légales et attendre que le site ait du contenu indexé et un domaine à vous.
2. Créer le compte AdSense, ajouter le site, laisser Google valider.
3. Mettre en place une **vraie** gestion du consentement (le message Google « Privacy & messaging » dans AdSense, ou une CMP certifiée TCF) et la tester.
4. Définir les variables : `ADSENSE_PUBLISHER_ID` (format `ca-pub-XXXXXXXXXXXXXXXX`), `CONSENT_MECHANISM_READY=true`, et les identifiants de blocs `ADSENSE_SLOT_TOP`, `ADSENSE_SLOT_RESULT`, `ADSENSE_SLOT_FAQ`, `ADSENSE_SLOT_SIDE`.
5. Redéployer : le script AdSense, `ads.txt` et les emplacements (en haut, après le résultat, après la FAQ, colonne latérale sur grand écran) sont alors générés. Le bouton « Paramétrer les cookies » du pied de page rouvre le message de consentement.
6. Vérifier dans AdSense l'état de `ads.txt` et du site.

`GA_MEASUREMENT_ID` active Google Analytics, uniquement avec le consentement.

## Structure

```
site.config.mjs        configuration via variables d'environnement
scripts/               build.mjs, check.mjs, preview.mjs
src/data/              définition des 51 outils (données), catégories, index
src/utils/calc.mjs     fonctions de calcul (pures, testées)
src/templates/         gabarits HTML : pages outil, catégories, accueil, légales, 404
src/client/            JS (calculateurs, recherche, consentement/pubs) et CSS
public/                favicon, image Open Graph, _headers
tests/                 tests des calculs et du code client
dist/                  sortie générée (ignorée par git)
```

## Ajouter un outil

Ajouter un objet dans le fichier `src/data/tools-*.mjs` adapté (champs, fonction de calcul, texte, FAQ, outils liés), éventuellement une fonction dans `FUNCTIONS` de `calc.mjs` avec son test, puis `npm run verify`.
