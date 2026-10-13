const queued = new Set();

export function enableNavigationPrefetch(header) {
  const connection = navigator.connection;
  if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '')) return () => {};

  function prefetch(event) {
    const link = event.target.closest('a');
    if (!link || !header.contains(link) || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !url.pathname.endsWith('.html')) return;
    if (url.pathname === location.pathname || queued.has(url.href) || queued.size >= 6) return;
    url.hash = '';
    queued.add(url.href);
    const hint = document.createElement('link');
    hint.rel = 'prefetch';
    hint.as = 'document';
    hint.href = url.href;
    document.head.append(hint);
  }

  header.addEventListener('pointerover', prefetch);
  header.addEventListener('focusin', prefetch);
  return () => {
    header.removeEventListener('pointerover', prefetch);
    header.removeEventListener('focusin', prefetch);
  };
}
