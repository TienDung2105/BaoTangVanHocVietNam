import { registerSiteHeader } from '../components/site-header.js';
import { initHomeSlider } from '../features/home-slider.js?v=loop-1500';
import { initHomeNews } from '../features/home-news.js';

registerSiteHeader();
initHomeSlider();
initHomeNews();
