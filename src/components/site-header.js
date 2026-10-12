import { navigation, siteUrl } from '../data/navigation.js';
import { headerTemplate } from './header-template.js';

class MuseumHeader extends HTMLElement {
  connectedCallback() {
    if (this.querySelector('.nav')) return;
    this.innerHTML = headerTemplate;
    const currentPage = document.body.dataset.page;
    this.querySelector('.nav__logo').href = siteUrl();
    this.querySelectorAll('[data-site-image]').forEach((image) => {
      image.src = siteUrl(image.dataset.siteImage);
    });
    this.querySelectorAll('a:not(.nav__logo)').forEach((link) => {
      const item = navigation.find((entry) => entry.label === link.textContent.trim());
      if (!item) return;
      link.href = siteUrl(item.file);
      if (item.id === currentPage) link.setAttribute('aria-current', 'page');
    });
    const toggle = this.querySelector('.nav__menu-button');
    const menu = this.querySelector('.mobile-menu');
    const desktopQuery = window.matchMedia('(min-width: 1025px)');
    this.closeMenu = () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    this.onViewportChange = (event) => { if (event.matches) this.closeMenu(); };
    this.onKeyDown = (event) => {
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
  }

  disconnectedCallback() {
    this.desktopQuery?.removeEventListener('change', this.onViewportChange);
    document.removeEventListener('keydown', this.onKeyDown);
    this.replaceChildren();
  }
}

export function registerSiteHeader() {
  if (!customElements.get('museum-header')) customElements.define('museum-header', MuseumHeader);
}
