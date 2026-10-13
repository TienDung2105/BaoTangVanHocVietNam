import { registerSiteHeader } from '../components/site-header.js';
import { registerSiteFooter } from '../components/site-footer.js';
import { hydrateCollectionImages } from '../features/collection-images.js';

registerSiteHeader();
registerSiteFooter();
hydrateCollectionImages();
