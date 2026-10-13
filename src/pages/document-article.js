import { registerSiteHeader } from '../components/site-header.js';
import { registerSiteFooter } from '../components/site-footer.js';

registerSiteHeader();
registerSiteFooter();

const copyButton = document.querySelector('.article-copy');
copyButton?.addEventListener('click', async () => {
  const label = copyButton.querySelector('span');
  try { await navigator.clipboard.writeText(location.href); label.textContent = 'Đã sao chép liên kết'; }
  catch { label.textContent = 'Không sao chép được liên kết'; }
  setTimeout(() => label.textContent = 'Sao chép liên kết', 2500);
});

const headings = [...document.querySelectorAll('.document-article h2[id], .document-article h3[id]')];
if (headings.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const current = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!current) return;
    document.querySelectorAll('.article-toc a').forEach(link => { if (link.hash === '#' + current.target.id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  }, { rootMargin: '-5% 0px -65% 0px' });
  headings.forEach(heading => observer.observe(heading));
}
