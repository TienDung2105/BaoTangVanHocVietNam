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
            <span>Tìm Kiếm</span>
          </a>
          <a href="#">Tham Quan</a>
          <a href="#">Hiện Vật</a>
          <a href="#">Chuyện Bảo Tàng</a>
        </div>

        <a class="nav__logo" href="#" aria-label="Bảo Tàng Văn Học Việt Nam">
          <img data-site-image="assets/images/home/logo.png" width="76" height="76" alt="Bảo tàng Văn học Việt Nam">
        </a>

        <div class="nav__group nav__group--right">
          <a href="#">Tin Tức</a>
          <a href="#">Khám Phá</a>
          <a href="#">Media</a>
          <a class="nav__ticket" href="#">
            <span>Mua Vé</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 18l6-6-6-6"></path>
            </svg>
          </a>
        </div>

        <a class="nav__ticket nav__ticket--mobile" href="#">
          <span>Mua Vé</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 18l6-6-6-6"></path>
          </svg>
        </a>
      </nav>

      <div class="mobile-menu" id="mobileMenu">
        <a href="#">Tìm Kiếm</a>
        <a href="#">Tham Quan</a>
        <a href="#">Hiện Vật</a>
        <a href="#">Chuyện Bảo Tàng</a>
        <a href="#">Tin Tức</a>
        <a href="#">Khám Phá</a>
        <a href="#">Media</a>
      </div>
    </header>
`;
