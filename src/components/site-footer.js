import { siteUrl } from '../data/navigation.js';

class MuseumFooter extends HTMLElement {
  connectedCallback() {
    if (this.querySelector('footer')) return;
    this.innerHTML = `
      <footer class="collection-footer">
        <h2>BẢO TÀNG VĂN HỌC VIỆT NAM</h2>
        <div class="collection-footer__accent" aria-hidden="true"></div>
        <div class="collection-footer__columns">
          <div>
            <h3>THÔNG TIN QUẢN LÝ</h3>
            <p>Cơ quan chủ quản: Hội Nhà văn Việt Nam</p>
            <p>Đơn vị quản lý: Bảo tàng Văn học Việt Nam</p>
            <p>Chịu trách nhiệm: Nhà văn Nguyễn Thị Thu Huệ</p>
            <p>Giám đốc Bảo tàng Văn học Việt Nam</p>
          </div>
          <div class="collection-footer__contact">
            <h3>LIÊN HỆ</h3>
            <p><a href="mailto:baotangvanhocvietnam275auco@gmail.com">Email: baotangvanhocvietnam275auco@gmail.com</a></p>
            <p><a href="tel:+84865051179">Tel/Fax: 84.865051179</a></p>
            <p>Địa chỉ: Ngõ 275 Âu Cơ - P. Tây Hồ - TP. Hà Nội</p>
          </div>
          <div>
            <p>Theo dõi chúng tôi</p>
            <div class="collection-footer__social">
              <img src="${siteUrl('assets/images/home/facebook.webp')}" width="62" height="62" alt="Facebook" loading="lazy">
              <img src="${siteUrl('assets/images/home/tiktok.webp')}" width="62" height="62" alt="TikTok" loading="lazy">
            </div>
          </div>
        </div>
        <p class="collection-footer__copyright">Copyright 2026 © Baotangvanhoc.vn</p>
      </footer>`;
  }
}

export function registerSiteFooter() {
  if (!customElements.get('museum-footer')) customElements.define('museum-footer', MuseumFooter);
}
