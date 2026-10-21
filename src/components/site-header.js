import { navigation, siteUrl } from '../data/navigation.js';
import { headerTemplate } from './header-template.js';
import { enableNavigationPrefetch } from '../features/navigation-prefetch.js';
import { initScrollReveal } from '../features/scroll-reveal.js';

class MuseumHeader extends HTMLElement {
  connectedCallback() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    if (!this.querySelector('.nav')) this.innerHTML = headerTemplate;
    const currentPage = document.body.dataset.page;
    this.querySelector('.nav__logo').href = siteUrl();
    this.querySelectorAll('[data-site-image]').forEach((image) => {
      image.src = siteUrl(image.dataset.siteImage);
    });
    this.querySelectorAll('a:not(.nav__logo)').forEach((link) => {
      if (link.dataset.artifactTopic) {
        link.href = siteUrl(`pages/trung-bay.html?topic=${encodeURIComponent(link.dataset.artifactTopic)}`);
        return;
      }
      const item = navigation.find((entry) => entry.label === link.textContent.trim());
      if (!item) return;
      link.href = siteUrl(item.file);
      if (item.id === currentPage) link.setAttribute('aria-current', 'page');
    });
    const toggle = this.querySelector('.nav__menu-button');
    const menu = this.querySelector('.mobile-menu');
    const desktopQuery = window.matchMedia('(min-width: 1025px)');
    const artifactToggle = this.querySelector('.mobile-artifacts__toggle');
    const artifactSubmenu = this.querySelector('.mobile-artifacts__submenu');
    if (artifactToggle && artifactSubmenu) {
      artifactSubmenu.hidden = true;
      artifactToggle.addEventListener('click', () => {
        artifactSubmenu.hidden = !artifactSubmenu.hidden;
        artifactToggle.setAttribute('aria-expanded', String(!artifactSubmenu.hidden));
      });
    }
    this.querySelectorAll('.nav__dropdown').forEach(dropdown => {
      dropdown.addEventListener('pointerenter', () => dropdown.classList.remove('is-dismissed'));
      dropdown.addEventListener('focusin', () => dropdown.classList.remove('is-dismissed'));
    });
    this.closeMenu = () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (artifactSubmenu) artifactSubmenu.hidden = true;
      artifactToggle?.setAttribute('aria-expanded', 'false');
    };
    this.onViewportChange = (event) => { if (event.matches) this.closeMenu(); };
    this.onKeyDown = (event) => {
      if (event.key === 'Escape') {
        const dropdown = this.querySelector('.nav__dropdown');
        if (dropdown?.contains(document.activeElement) || dropdown?.matches(':hover')) {
          dropdown.querySelector(':scope > a').focus();
          dropdown.classList.add('is-dismissed');
        }
      }
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        this.closeMenu();
        toggle.focus();
      }
    };
    toggle.setAttribute('aria-controls', 'mobileMenu');
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) this.closeMenu();
    });
    desktopQuery.addEventListener('change', this.onViewportChange);
    document.addEventListener('keydown', this.onKeyDown);
    this.desktopQuery = desktopQuery;
    this.stopPrefetch = enableNavigationPrefetch(this);
  }

  disconnectedCallback() {
    this.desktopQuery?.removeEventListener('change', this.onViewportChange);
    document.removeEventListener('keydown', this.onKeyDown);
    this.stopPrefetch?.();
    this.isInitialized = false;
    this.replaceChildren();
  }
}

export function registerSiteHeader() {
  if (!customElements.get('museum-header')) customElements.define('museum-header', MuseumHeader);
  // Wait for the page entry to finish constructing its initial content.
  requestAnimationFrame(initScrollReveal);
}
