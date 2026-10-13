import { registerSiteHeader } from '../components/site-header.js';
import { registerSiteFooter } from '../components/site-footer.js';
import { siteUrl } from '../data/navigation.js';
import { collectionImageUrl } from '../features/collection-images.js';

const query = new URLSearchParams(location.search);
const collectionKey = query.get('collection');
document.body.dataset.page = collectionKey || 'news';
registerSiteHeader();
registerSiteFooter();

async function loadArticle() {
  const title = document.querySelector('#articleTitle');
  const content = document.querySelector('#articleContent');
  const back = document.querySelector('#articleBack');
  try {
    const response = await fetch(siteUrl('assets/data/collections.json'));
    if (!response.ok) throw new Error('Không thể tải nội dung.');
    const collections = await response.json();
    const collection = collections[collectionKey];
    const item = collection?.items.find(entry => entry.id === query.get('id'));
    if (!item) {
      title.textContent = 'Không tìm thấy nội dung';
      content.textContent = 'Bài viết không tồn tại hoặc đường dẫn đã thay đổi.';
      return;
    }
    if (item.documentPage) {
      location.replace(siteUrl(item.documentPage));
      return;
    }
    document.title = `${item.title} | Bảo Tàng Văn Học Việt Nam`;
    title.textContent = item.title;
    document.querySelector('#articleCategory').textContent = item.category || collection.title;
    document.querySelector('#collectionName').textContent = collection.title;
    back.href = siteUrl(`pages/${collection.file}${item.topic ? `?topic=${encodeURIComponent(item.topic)}` : ''}`);
    back.textContent = `Trở lại ${collection.title}`;
    const image = document.querySelector('#articleImage');
    image.src = collectionImageUrl(item);
    image.alt = item.imageAlt || item.title;
    image.style.objectPosition = item.imagePosition || 'center';
    image.style.objectFit = item.imageFit || 'cover';
    image.hidden = false;
    content.replaceChildren();
    if (item.body?.length) {
      item.body.forEach(text => {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        content.append(paragraph);
      });
    } else {
      const status = document.createElement('p');
      status.className = 'detail-status';
      status.textContent = collectionKey === 'media' ? 'Nội dung media đang được cập nhật.' : 'Nội dung bài viết đang được cập nhật.';
      content.append(status);
    }
    if (item.actions?.length) {
      const actions = document.createElement('p');
      for (const action of item.actions) {
        const url = new URL(action.href, location.href);
        if (!['https:', 'http:', 'mailto:', 'tel:'].includes(url.protocol)) continue;
        const link = document.createElement('a');
        link.className = 'collection-link';
        link.href = url.href;
        link.textContent = action.label;
        actions.append(link);
      }
      content.append(actions);
    }
    if (item.video) {
      const video = document.createElement('video');
      video.controls = true;
      video.preload = 'metadata';
      video.src = item.video;
      video.poster = image.src;
      content.prepend(video);
    }
  } catch (error) {
    title.textContent = 'Chưa tải được nội dung';
    content.textContent = `${error.message} Vui lòng tải lại trang.`;
  } finally {
    content.setAttribute('aria-busy', 'false');
  }
}

loadArticle();
