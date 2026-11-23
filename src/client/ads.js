// Chargement de Google AdSense. Ce fichier n'est inclus dans les pages que si ADSENSE_PUBLISHER_ID est défini
// ET si CONSENT_MECHANISM_READY est « true » (voir site.config.mjs). Le script est chargé en différé, au repos du navigateur.
(() => {
  const tag = document.querySelector('script[data-client]');
  const client = tag && tag.dataset.client;
  if (!client) return;
  const start = () => {
    const s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(client);
    s.onload = () => {
      document.querySelectorAll('ins.adsbygoogle').forEach((ins) => {
        // Pas d'annonce dans un conteneur masqué (ex. colonne latérale sur mobile) ni deux fois dans le même bloc.
        if (ins.offsetParent === null || ins.dataset.adsbygoogleStatus) return;
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { /* ignoré */ }
      });
    };
    document.head.appendChild(s);
  };
  if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 3000 });
  else setTimeout(start, 1500);
})();
