export const headerTemplate = `
<header class="site-header">
      <nav class="nav" aria-label="Điều hướng chính">
        <button class="nav__menu-button" type="button" aria-label="Mở menu" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div class="nav__group nav__group--left">
          <a class="nav__search" href="#">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7"></circle>
              <path d="m20 20-3.5-3.5"></path>
            </svg>
            <span>Tìm kiếm</span>
          </a>
          <a href="#">Tham quan</a>
          <div class="nav__dropdown"><a href="#">Sưu tầm</a><div class="nav__submenu" aria-label="Chủ đề sưu tầm"><a data-artifact-topic="co-trung-dai" href="../pages/trung-bay.html?topic=co-trung-dai">Văn học Việt Nam thời kỳ cổ trung đại (từ thế kỷ 10 đến thế kỷ 19)</a>
<a data-artifact-topic="ho-chi-minh" href="../pages/trung-bay.html?topic=ho-chi-minh">Các nhà văn Giải thưởng Hồ Chí Minh</a>
<a data-artifact-topic="nha-nuoc" href="../pages/trung-bay.html?topic=nha-nuoc">Các nhà văn Giải thưởng Nhà nước</a></div></div>
          <a href="#">Chuyện bảo tàng</a>
        </div>

        <a class="nav__logo" href="#" aria-label="Bảo Tàng Văn Học Việt Nam">
          <img data-site-image="assets/images/home/logo.png" width="76" height="76" alt="Bảo tàng Văn học Việt Nam">
        </a>

        <div class="nav__group nav__group--right">
          <a href="#">Tin tức</a>
          <a href="#">Khám phá</a>
          <a href="#">Media</a>
          <a class="nav__ticket" href="#">
            <span>Mua vé</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 18l6-6-6-6"></path>
            </svg>
          </a>
        </div>

        <a class="nav__ticket nav__ticket--mobile" href="#">
          <span>Mua vé</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 18l6-6-6-6"></path>
          </svg>
        </a>
      </nav>

      <div class="mobile-menu" id="mobileMenu">
        <a href="#">Tìm kiếm</a>
        <a href="#">Tham quan</a>
        <div class="mobile-artifacts"><div class="mobile-artifacts__row"><a href="#">Sưu tầm</a><button class="mobile-artifacts__toggle" type="button" aria-label="Mở chủ đề sưu tầm" aria-expanded="false" aria-controls="artifactSubmenuMobile"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button></div><div class="mobile-artifacts__submenu" id="artifactSubmenuMobile"><a data-artifact-topic="co-trung-dai" href="../pages/trung-bay.html?topic=co-trung-dai">Văn học Việt Nam thời kỳ cổ trung đại (từ thế kỷ 10 đến thế kỷ 19)</a>
<a data-artifact-topic="ho-chi-minh" href="../pages/trung-bay.html?topic=ho-chi-minh">Các nhà văn Giải thưởng Hồ Chí Minh</a>
<a data-artifact-topic="nha-nuoc" href="../pages/trung-bay.html?topic=nha-nuoc">Các nhà văn Giải thưởng Nhà nước</a></div></div>
        <a href="#">Chuyện bảo tàng</a>
        <a href="#">Tin tức</a>
        <a href="#">Khám phá</a>
        <a href="#">Media</a>
      </div>
    </header>
`;
