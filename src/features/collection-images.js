import { siteUrl } from '../data/navigation.js';

export function collectionImageUrl(item) {
  return siteUrl(item.image.includes('/') ? item.image : `assets/images/home/${item.image}`);
}

export async function hydrateCollectionImages() {
  try {
    const response = await fetch(siteUrl('assets/data/collections.json'));
    if (!response.ok) return;
    const data = await response.json();
    const items = data[document.body.dataset.page]?.items || [];
    document.querySelectorAll('img[data-content-id]').forEach(image => {
      const item = items.find(entry => entry.id === image.dataset.contentId);
      if (!item?.image) return;
      const fallback = image.src;
      const next = collectionImageUrl(item);
      if (fallback !== next) {
        image.addEventListener('error', () => { image.src = fallback; }, { once: true });
        image.src = next;
      }
      image.style.objectPosition = item.imagePosition || 'center';
      if (item.imageAlt) image.alt = item.imageAlt;
    });
  } catch {
    // Static HTML remains usable if the optional image catalog cannot load.
  }
}
