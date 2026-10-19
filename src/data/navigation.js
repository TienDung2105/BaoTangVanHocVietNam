const siteRoot = new URL('../../', import.meta.url);

export const navigation = [
  { id: 'search', label: 'Tìm kiếm', file: 'pages/tim-kiem.html' },
  { id: 'visiting', label: 'Tham quan', file: 'pages/tham-quan.html' },
  { id: 'exhibitions', label: 'Sưu tầm', file: 'pages/trung-bay.html' },
  { id: 'stories', label: 'Chuyện bảo tàng', file: 'pages/chuyen-bao-tang.html' },
  { id: 'news', label: 'Tin tức', file: 'pages/tin-tuc.html' },
  { id: 'explore', label: 'Khám phá', file: 'pages/kham-pha.html' },
  { id: 'media', label: 'Media', file: 'pages/media.html' },
  { id: 'tickets', label: 'Mua vé', file: 'pages/mua-ve.html' }
];

export function siteUrl(path = 'index.html') {
  return new URL(path, siteRoot).href;
}
