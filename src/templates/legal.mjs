import { config, adsEnabled } from '../../site.config.mjs';
import { esc } from '../utils/render.mjs';
import { layout, breadcrumb, breadcrumbLd } from './html.mjs';

const L = config.LEGAL;
const todo = (label) => `<mark class="todo">[À compléter : ${esc(label)}]</mark>`;
const val = (v, label) => (v ? esc(v) : todo(label));
const email = () => (L.email ? `<a href="mailto:${esc(L.email)}">${esc(L.email)}</a>` : todo('adresse e-mail de contact'));

function page({ slug, title, h1, desc, html }) {
  const path = `/${slug}/`;
  const crumbs = [{ name: 'Accueil', url: '/' }, { name: h1, url: path }];
  const body = `<div class="container narrow">${breadcrumb(crumbs)}<article class="prose legal"><h1>${esc(h1)}</h1>${html}</article></div>`;
  return { path, html: layout({ title, description: desc, path, body, ld: [breadcrumbLd(crumbs)] }) };
}

const adsParagraph = () => (adsEnabled()
  ? `<p>Ce site affiche de la publicité Google AdSense. Google et ses partenaires peuvent déposer ou lire des cookies et des identifiants sur votre appareil pour diffuser et mesurer des annonces, selon les choix que vous exprimez dans le bandeau de consentement affiché lors de votre première visite.</p>`
  : `<p>À la date de mise à jour de cette page, aucune publicité ni aucun outil de mesure d’audience n’est activé sur le site. Si de la publicité (notamment Google AdSense) ou de la mesure d’audience est activée ultérieurement, cette politique sera mise à jour et un mécanisme de recueil du consentement sera mis en place avant tout dépôt de cookie non essentiel.</p>`);

export const LEGAL_PAGES = () => [
  page({
    slug: 'a-propos', title: 'À propos', h1: 'À propos', desc: `Découvrez ${config.SITE_NAME} : des outils gratuits pour calculer, convertir et planifier, et la façon dont nous concevons nos calculateurs.`,
    html: `<p><strong>${esc(config.SITE_NAME)}</strong> réunit des calculateurs, des convertisseurs et des outils de planification gratuits, pensés pour les besoins de tous les jours : pourcentages, TVA, salaires, conversions d’unités, quantités pour les travaux, durées et dates.</p>
<h2>Notre approche</h2>
<ul>
<li><strong>Des outils utiles d’abord.</strong> Chaque outil fonctionne sans inscription, avec un résultat immédiat, et reste utilisable sur un téléphone.</li>
<li><strong>Des calculs vérifiés.</strong> Les formules sont expliquées sur chaque page et les fonctions de calcul sont testées automatiquement, notamment sur les cas délicats : années bissextiles, fins de mois, jours fériés mobiles.</li>
<li><strong>Des explications claires.</strong> Exemples chiffrés, tableaux de valeurs courantes et réponses aux questions fréquentes accompagnent chaque outil.</li>
<li><strong>Le respect de votre confidentialité.</strong> Les calculs sont effectués dans votre navigateur : les valeurs que vous saisissez ne sont pas transmises à nos serveurs.</li>
</ul>
<h2>Financement du site</h2>
<p>Le site est gratuit. Il pourra être financé par de la publicité, sans jamais en dépendre pour rester utile : les annonces sont clairement identifiées et ne doivent pas gêner l’utilisation des outils. Le site ne contient aucune affiliation commerciale.</p>
<h2>Un doute, une erreur ?</h2>
<p>Si vous constatez une erreur de calcul, une information périmée ou si vous souhaitez proposer un nouvel outil, écrivez-nous depuis la page <a href="/contact/">Contact</a>. Les résultats sont fournis à titre indicatif et ne remplacent pas l’avis d’un professionnel (expert-comptable, notaire, artisan, médecin…).</p>
<p>Informations sur l’éditeur : <a href="/mentions-legales/">mentions légales</a>.</p>`,
  }),

  page({
    slug: 'contact', title: 'Contact', h1: 'Contact', desc: `Contactez l’équipe de ${config.SITE_NAME} pour signaler une erreur, poser une question ou proposer un nouvel outil.`,
    html: `<p>Une question, une erreur à signaler ou une idée d’outil ? Écrivez-nous par e-mail :</p>
<p class="contact-mail">${email()}</p>
<h2>Pour nous aider à vous répondre</h2>
<ul>
<li>Indiquez l’adresse de la page concernée et les valeurs saisies si vous signalez une erreur de calcul.</li>
<li>Précisez l’appareil et le navigateur utilisés si un outil ne s’affiche pas correctement.</li>
</ul>
<h2>Ce que nous ne pouvons pas faire</h2>
<p>Nous ne pouvons pas fournir de conseil personnalisé juridique, fiscal, médical ou technique. Les outils donnent des résultats indicatifs : pour une décision importante, rapprochez-vous d’un professionnel.</p>
<p>Les e-mails reçus sont utilisés uniquement pour traiter votre demande, conformément à la <a href="/politique-confidentialite/">politique de confidentialité</a>.</p>`,
  }),

  page({
    slug: 'mentions-legales', title: 'Mentions légales', h1: 'Mentions légales', desc: `Mentions légales de ${config.SITE_NAME} : éditeur, directeur de la publication, hébergeur et propriété intellectuelle.`,
    html: `<h2>Éditeur du site</h2>
<ul>
<li><strong>Nom ou raison sociale :</strong> ${val(L.publisher, 'nom ou raison sociale de l’éditeur')}</li>
<li><strong>Statut :</strong> ${val(L.status, 'statut (particulier, micro-entreprise, société…)')}</li>
<li><strong>Adresse :</strong> ${val(L.address, 'adresse postale')}</li>
<li><strong>E-mail :</strong> ${email()}</li>
<li><strong>Directeur de la publication :</strong> ${val(L.director, 'directeur de la publication')}</li>
${L.siret ? `<li><strong>SIRET :</strong> ${esc(L.siret)}</li>` : ''}
</ul>
<h2>Hébergement</h2>
<p>Le site est hébergé par Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis — <a href="https://www.cloudflare.com/" rel="noopener">www.cloudflare.com</a>.</p>
<h2>Propriété intellectuelle</h2>
<p>Les textes, la structure et la conception du site sont protégés par le droit d’auteur. Toute reproduction ou réutilisation substantielle sans autorisation écrite préalable est interdite, à l’exception des courtes citations accompagnées d’un lien vers la page d’origine.</p>
<h2>Responsabilité</h2>
<p>Les outils sont fournis gratuitement et à titre indicatif. L’éditeur s’efforce de garantir l’exactitude des calculs et des informations, sans pouvoir l’assurer en toutes circonstances. Voir les <a href="/conditions-utilisation/">conditions d’utilisation</a>.</p>
<h2>Données personnelles</h2>
<p>Le traitement des données personnelles est décrit dans la <a href="/politique-confidentialite/">politique de confidentialité</a>.</p>
<h2>Droit applicable</h2>
<p>Le site est soumis au droit français.</p>`,
  }),

  page({
    slug: 'politique-confidentialite', title: 'Politique de confidentialité', h1: 'Politique de confidentialité', desc: `Politique de confidentialité de ${config.SITE_NAME} : données traitées, cookies, publicité et exercice de vos droits (RGPD).`,
    html: `<p>Cette politique explique quelles informations sont traitées lorsque vous utilisez ${esc(config.SITE_NAME)} et quels sont vos droits, conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.</p>
<h2>Responsable du traitement</h2>
<p>${val(L.publisher, 'nom de l’éditeur')} — contact : ${email()}. Voir aussi les <a href="/mentions-legales/">mentions légales</a>.</p>
<h2>Les valeurs que vous saisissez dans les outils</h2>
<p>Les calculs sont effectués dans votre navigateur. Les nombres, dates et textes saisis dans les calculateurs ne sont pas envoyés à nos serveurs et ne sont pas conservés.</p>
<h2>Données techniques</h2>
<p>Comme tout site web, ${esc(config.SITE_NAME)} est servi par un hébergeur qui peut enregistrer des données techniques de connexion (adresse IP, date et heure, pages demandées, type de navigateur) dans des journaux, pour assurer la sécurité et le bon fonctionnement du service. Base légale : intérêt légitime de sécurité et de fonctionnement du site.</p>
<h2>Cookies et traceurs</h2>
<p>Le site n’utilise pas de cookie nécessitant votre consentement pour fonctionner. Le détail figure dans la <a href="/politique-cookies/">politique de cookies</a>.</p>
<h2>Publicité et mesure d’audience</h2>
${adsParagraph()}
<h2>Messages que vous nous envoyez</h2>
<p>Si vous nous écrivez, nous utilisons votre adresse e-mail et le contenu de votre message uniquement pour vous répondre. Ils sont conservés le temps nécessaire au traitement de votre demande, puis supprimés ou archivés pour une durée limitée.</p>
<h2>Vos droits</h2>
<p>Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition, de limitation et de portabilité des données vous concernant. Pour les exercer, écrivez à ${email()}. Vous pouvez aussi introduire une réclamation auprès de la CNIL : <a href="https://www.cnil.fr/" rel="noopener">www.cnil.fr</a>.</p>
<h2>Transferts hors de l’Union européenne</h2>
<p>L’hébergeur du site est une société américaine. Les transferts éventuels de données techniques sont encadrés par les mécanismes prévus par le RGPD (par exemple les clauses contractuelles types ou le cadre de protection des données UE–États-Unis).</p>`,
  }),

  page({
    slug: 'politique-cookies', title: 'Politique de cookies', h1: 'Politique de cookies', desc: `Politique de cookies de ${config.SITE_NAME} : cookies utilisés, finalités, consentement et moyens de les gérer.`,
    html: `<p>Un cookie est un petit fichier enregistré sur votre appareil lors de la visite d’un site. Certains sont indispensables au fonctionnement, d’autres servent à la publicité ou à la mesure d’audience et nécessitent votre accord préalable.</p>
<h2>Cookies utilisés par ${esc(config.SITE_NAME)}</h2>
<p>Le site n’enregistre actuellement aucun cookie propre : il n’a pas de compte utilisateur, pas de panier et ne mémorise pas vos saisies.</p>
<h2>Cookies de tiers (publicité et mesure d’audience)</h2>
${adsEnabled()
  ? `<p>Le site diffuse des annonces Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour afficher des annonces, limiter leur répétition, lutter contre la fraude et mesurer leur performance. Ces cookies ne sont déposés qu’après votre accord dans le bandeau de consentement ; vous pouvez modifier votre choix à tout moment via le lien « Paramétrer les cookies » en bas de page. Pour en savoir plus sur l’usage des données par Google : <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">policies.google.com/technologies/partner-sites</a>.</p>`
  : `<p>À ce jour, aucun cookie de publicité ou de mesure d’audience n’est utilisé. Avant d’activer de tels services, un bandeau de consentement conforme sera mis en place afin que vous puissiez accepter ou refuser ces cookies aussi simplement que vous pouvez les accepter. Cette page sera alors mise à jour avec la liste précise des cookies concernés.</p>`}
<h2>Gérer les cookies depuis votre navigateur</h2>
<p>Vous pouvez à tout moment supprimer ou bloquer les cookies depuis les réglages de votre navigateur (Chrome, Firefox, Safari, Edge…). Le blocage des cookies n’empêche pas d’utiliser les outils du site.</p>
<p>Pour plus d’informations sur vos droits : <a href="/politique-confidentialite/">politique de confidentialité</a>.</p>`,
  }),

  page({
    slug: 'conditions-utilisation', title: 'Conditions d’utilisation', h1: 'Conditions d’utilisation', desc: `Conditions d’utilisation de ${config.SITE_NAME} : usage des outils, limites de responsabilité et propriété intellectuelle.`,
    html: `<h2>Objet</h2>
<p>Les présentes conditions encadrent l’utilisation du site ${esc(config.SITE_NAME)}, qui propose gratuitement des calculateurs, convertisseurs et outils de planification. En utilisant le site, vous acceptez ces conditions.</p>
<h2>Nature des résultats</h2>
<p>Les résultats sont fournis à titre indicatif. Ils reposent sur les valeurs que vous saisissez et sur des formules ou hypothèses expliquées sur chaque page (par exemple une marge de chute, une densité moyenne ou un taux de TVA). Ils ne constituent ni un conseil juridique, fiscal, comptable, médical ou technique, ni un devis.</p>
<p>Avant toute décision importante (achat de matériaux, facture, contrat, délai légal), vérifiez les valeurs auprès d’un professionnel ou de la source officielle applicable.</p>
<h2>Responsabilité</h2>
<p>L’éditeur s’efforce d’assurer l’exactitude et la mise à jour des outils, sans garantie d’absence d’erreur ni de disponibilité continue. Dans les limites permises par la loi, l’éditeur ne peut être tenu responsable des conséquences d’une décision prise sur la base des résultats affichés. Le site peut contenir des liens vers des sites tiers dont l’éditeur n’est pas responsable du contenu.</p>
<h2>Utilisation acceptable</h2>
<p>Vous vous engagez à ne pas perturber le fonctionnement du site, à ne pas tenter d’y accéder de manière frauduleuse et à ne pas collecter son contenu de manière automatisée excessive.</p>
<h2>Propriété intellectuelle</h2>
<p>Le contenu du site est protégé. Voir les <a href="/mentions-legales/">mentions légales</a>.</p>
<h2>Modification des conditions</h2>
<p>Ces conditions peuvent être modifiées à tout moment ; la version en ligne fait foi.</p>
<h2>Droit applicable</h2>
<p>Les présentes conditions sont soumises au droit français.</p>`,
  }),
];
