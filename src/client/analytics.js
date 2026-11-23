// Google Analytics (GA4). Inclus uniquement si GA_MEASUREMENT_ID est défini ET CONSENT_MECHANISM_READY est « true ».
(() => {
  const tag = document.querySelector('script[data-id]');
  const id = tag && tag.dataset.id;
  if (!id) return;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', id);
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);
})();
