import { registerSiteHeader } from '../components/site-header.js';
import { registerSiteFooter } from '../components/site-footer.js';
import { siteUrl } from '../data/navigation.js';
import { hydrateIcons } from '../features/media-icons.js';

registerSiteHeader(); registerSiteFooter(); hydrateIcons(document);
const labels = {all:'Tất cả',exhibitions:'Hiện vật',news:'Tin tức',explore:'Khám phá',visiting:'Tham quan',stories:'Chuyện bảo tàng',media:'Media'};
const form = document.querySelector('#searchForm'), input = document.querySelector('#searchInput'), results = document.querySelector('#searchResults');
const heading = document.querySelector('#searchResultsTitle'), message = document.querySelector('#searchMessage'), more = document.querySelector('#searchMore'), sort = document.querySelector('#searchSort');
let items = [], ready = false, category = 'all', limit = 12, timer, composing = false;
const fold = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLocaleLowerCase('vi');
const tokens = () => fold(input.value.trim()).match(/[\p{L}\p{N}]+/gu) || [];
function updateUrl() {
  const url = new URL(location.href); url.search = '';
  if (input.value.trim()) url.searchParams.set('q',input.value.trim());
  if (category !== 'all') url.searchParams.set('category',category);
  if (sort.value !== 'relevance') url.searchParams.set('sort',sort.value);
  history.replaceState(null,'',url);
}
function highlight(text, terms) {
  const fragment = document.createDocumentFragment();
  for (const word of text.split(/(\s+)/)) {
    if (terms.some(term=>fold(word).includes(term))) { const mark = document.createElement('mark'); mark.textContent = word; fragment.append(mark); }
    else fragment.append(document.createTextNode(word));
  }
  return fragment;
}
function excerpt(item, terms) {
  const body = item.kind === 'section' ? item.description : item.text || item.description; if (!body) return '';
  const index = terms.length ? fold(body).indexOf(terms[0]) : -1;
  let start = index > 80 ? index - 65 : 0;
  if (start) { const space = body.indexOf(' ',start); if (space >= 0) start = space + 1; }
  return `${start ? '… ' : ''}${body.slice(start,start+210).trim()}${body.length>start+210?'…':''}`;
}
function showMessage(title, detail, action, run) {
  message.replaceChildren(); const h = document.createElement('h3'), p = document.createElement('p'); h.textContent = title; p.textContent = detail; message.append(h,p);
  if (action) { const button = document.createElement('button'); button.type = 'button'; button.className = 'search-reset'; button.textContent = action; button.addEventListener('click',run); message.append(button); }
  message.hidden = false;
}
function reset() { input.value = ''; category = 'all'; sort.value = 'relevance'; document.querySelector('input[name="category"][value="all"]').checked = true; limit = 12; render(); input.focus(); }
function render() {
  if (!ready) return;
  const terms = tokens(); updateUrl(); results.replaceChildren(); message.hidden = true;
  const matches = (input.value.trim() && !terms.length ? [] : items.filter(item=>terms.every(term=>item.search.includes(term)))).map(item=>({item,score:terms.reduce((n,t)=>n+(item.titleFold.includes(t)?10:1),0)+(terms.length&&item.titleFold.includes(fold(input.value.trim()))?30:0)}));
  document.querySelectorAll('[data-filter-count]').forEach(node=>{node.textContent = matches.filter(({item})=>node.dataset.filterCount==='all'||item.category===node.dataset.filterCount).length;});
  const selected = matches.filter(({item})=>category==='all'||item.category===category);
  selected.sort(sort.value==='title'?(a,b)=>a.item.title.localeCompare(b.item.title,'vi'):(a,b)=>b.score-a.score);
  heading.textContent = input.value.trim() ? `${selected.length} kết quả cho “${input.value.trim()}”` : category==='all'?'Gợi ý khám phá':`${selected.length} nội dung · ${labels[category]}`;
  if (!selected.length) showMessage('Chưa tìm thấy nội dung phù hợp',input.value.trim()?`Không có kết quả cho “${input.value.trim()}” trong ${labels[category].toLocaleLowerCase('vi')}. Bạn có thể thử từ khóa ngắn hơn hoặc chọn mục khác.`:'Chưa có nội dung trong mục này.','Xóa bộ lọc',reset);
  for (const {item} of selected.slice(0,limit)) {
    const link = document.createElement('a'); link.className = 'search-result'; link.href = siteUrl(item.url);
    const image = document.createElement('img'); image.className = 'search-result-image'; image.src = siteUrl(item.image); image.alt = item.imageAlt; image.width = 164; image.height = 112; image.loading = 'lazy'; image.decoding = 'async';
    const copy = document.createElement('div'); copy.className = 'search-result-copy';
    const kind = document.createElement('p'); kind.className = 'search-result-category'; kind.textContent = labels[item.category];
    const title = document.createElement('h3'); title.append(highlight(item.title,terms));
    const description = document.createElement('p'); description.className = 'search-result-description'; description.append(highlight(excerpt(item,terms),terms));
    const arrow = document.createElement('span'); arrow.dataset.icon = 'arrow-up-right'; copy.append(kind,title,description); link.append(image,copy,arrow); results.append(link);
  }
  hydrateIcons(results); more.hidden = selected.length <= limit; more.textContent = `Xem thêm (${Math.max(0,selected.length-limit)})`;
  document.querySelector('#searchAnnouncement').textContent = `${selected.length} kết quả`;
}
form.addEventListener('submit',event=>{event.preventDefault();clearTimeout(timer);limit=12;render();});
input.addEventListener('compositionstart',()=>composing=true); input.addEventListener('compositionend',()=>{composing=false;limit=12;render();});
input.addEventListener('input',()=>{clearTimeout(timer);if(!composing)timer=setTimeout(()=>{limit=12;render();},160);});
document.querySelectorAll('input[name="category"]').forEach(radio=>radio.addEventListener('change',()=>{category=radio.value;limit=12;render();}));
sort.addEventListener('change',()=>{limit=12;render();}); more.addEventListener('click',()=>{limit+=12;render();});
document.querySelectorAll('[data-search-term]').forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.searchTerm;limit=12;render();input.focus();}));
function restore() { const params = new URLSearchParams(location.search); input.value = (params.get('q')||'').slice(0,250); category = Object.hasOwn(labels,params.get('category'))?params.get('category'):'all'; document.querySelector(`input[name="category"][value="${category}"]`).checked=true; sort.value=params.get('sort')==='title'?'title':'relevance'; limit=12;render(); }
addEventListener('popstate',restore);
async function initialize() {
  results.setAttribute('aria-busy','true'); showMessage('Đang tải nội dung','');
  try {
    const response = await fetch(siteUrl('assets/data/search-index.json')); if(!response.ok)throw Error('Index unavailable');
    const data = await response.json(); items = data.items.map(item=>({...item,titleFold:fold(item.title),search:fold(`${item.title} ${item.text} ${item.description} ${labels[item.category]}`)}));
    ready=true;render();
  } catch { showMessage('Chưa tải được dữ liệu tìm kiếm','Vui lòng kiểm tra kết nối và thử lại.','Thử lại',initialize); }
  finally {results.setAttribute('aria-busy','false');}
}
restore();
initialize();
