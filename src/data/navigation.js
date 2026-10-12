const siteRoot = new URL('../../', import.meta.url);

export const navigation = [
  { id: 'search', label: 'Tìm Kiếm', file: 'pages/tim-kiem.html' },
  { id: 'visiting', label: 'Tham Quan', file: 'pages/tham-quan.html' },
  { id: 'exhibitions', label: 'Hiện Vật', file: 'pages/trung-bay.html' },
  { id: 'stories', label: 'Chuyện Bảo Tàng', file: 'pages/chuyen-bao-tang.html' },
  { id: 'news', label: 'Tin Tức', file: 'pages/tin-tuc.html' },
  { id: 'explore', label: 'Khám Phá', file: 'pages/kham-pha.html' },
  { id: 'media', label: 'Media', file: 'pages/media.html' },
  { id: 'tickets', label: 'Mua Vé', file: 'pages/mua-ve.html' }
];

export function siteUrl(path = 'index.html') {
  return new URL(path, siteRoot).href;
}
