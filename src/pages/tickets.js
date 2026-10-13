import { registerSiteHeader } from '../components/site-header.js';
import { registerSiteFooter } from '../components/site-footer.js';

registerSiteHeader();
registerSiteFooter();

const form = document.querySelector('#ticketForm');
const dateInput = document.querySelector('#visitDate');
const dialog = document.querySelector('#reviewDialog');
const formatter = new Intl.NumberFormat('vi-VN');
const money = value => `${formatter.format(value)} ₫`;
const types = [
  { id: 'adult', label: 'Người lớn', price: 40000 },
  { id: 'student', label: 'Học sinh cấp 3, sinh viên', price: 30000 },
  { id: 'child', label: 'Học sinh cấp 1 – cấp 2', price: 20000 }
];

// Use local calendar dates, avoiding UTC date shifts near midnight.
const calendarDate = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const today = () => calendarDate(new Date());
const readableDate = value => value ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${value}T12:00:00`)) : 'Chưa chọn ngày';
dateInput.min = today();
let reviewedBooking = null;

function booking() {
  const entries = types.map(type => ({ ...type, quantity: Number(form.elements[type.id].value) || 0 }));
  return {
    date: dateInput.value,
    session: form.elements.session.value === 'morning' ? 'Sáng: 8h00 – 12h00' : 'Chiều: 13h30 – 17h00',
    entries,
    total: entries.reduce((sum, entry) => sum + entry.price * entry.quantity, 0),
    name: form.elements.fullName.value.trim(), phone: form.elements.phone.value.trim(),
    email: form.elements.email.value.trim(), note: form.elements.note.value.trim()
  };
}

function validate() {
  dateInput.min = today();
  const day = dateInput.value ? new Date(`${dateInput.value}T12:00:00`).getDay() : null;
  const dateError = day === 0 || day === 6 ? 'Vui lòng chọn ngày từ thứ Hai đến thứ Sáu.' : dateInput.value && dateInput.value < today() ? 'Vui lòng chọn ngày hôm nay hoặc một ngày sắp tới.' : '';
  dateInput.setCustomValidity(dateError);
  document.querySelector('#dateError').textContent = dateError;
  const count = types.reduce((sum, type) => sum + (Number(form.elements[type.id].value) || 0), 0);
  const quantityError = count <= 0 ? 'Vui lòng chọn ít nhất một vé.' : '';
  form.elements.adult.setCustomValidity(quantityError);
  document.querySelector('#quantityError').textContent = quantityError;
  form.elements.fullName.setCustomValidity(form.elements.fullName.value && !form.elements.fullName.value.trim() ? 'Vui lòng nhập họ và tên.' : '');
  const phone = form.elements.phone.value.trim();
  const digits = phone.replace(/\D/g, '');
  form.elements.phone.setCustomValidity(phone && (!/^\+?[\d\s().-]{8,25}$/.test(phone) || digits.length < 8 || digits.length > 15) ? 'Vui lòng nhập số điện thoại hợp lệ.' : '');
}

function renderSummary() {
  validate();
  const data = booking();
  document.querySelector('#summaryDate').textContent = readableDate(data.date);
  document.querySelector('#summarySession').textContent = data.session.split(': ')[1];
  document.querySelector('#summaryTotal').textContent = money(data.total);
  const lines = document.querySelector('#summaryLines');
  lines.replaceChildren();
  data.entries.filter(entry => entry.quantity > 0).forEach(entry => {
    const li = document.createElement('li');
    const label = document.createElement('span');
    const price = document.createElement('span');
    label.textContent = `${entry.label} × ${entry.quantity}`;
    price.textContent = money(entry.price * entry.quantity);
    li.append(label, price);
    lines.append(li);
  });
  if (!lines.children.length) { const li = document.createElement('li'); li.textContent = 'Chưa chọn vé'; lines.append(li); }
}

form.addEventListener('input', renderSummary);
form.addEventListener('change', renderSummary);
form.addEventListener('submit', event => {
  event.preventDefault();
  validate();
  if (!form.reportValidity()) return;
  reviewedBooking = booking();
  const data = reviewedBooking;
  const rows = [['Họ và tên', data.name], ['Điện thoại', data.phone], ['Ngày đến', readableDate(data.date)], ['Khung giờ', data.session], ...data.entries.filter(entry => entry.quantity > 0).map(entry => [entry.label, `${entry.quantity} vé · ${money(entry.price * entry.quantity)}`]), ['Tổng cộng', money(data.total)]];
  if (data.email) rows.push(['Email', data.email]);
  if (data.note) rows.push(['Lời nhắn', data.note]);
  const details = document.querySelector('#reviewDetails');
  details.replaceChildren();
  rows.forEach(([label, value]) => { const row = document.createElement('div'); const dt = document.createElement('dt'); const dd = document.createElement('dd'); dt.textContent = label; dd.textContent = value; row.append(dt, dd); details.append(row); });
  document.querySelector('#downloadStatus').textContent = '';
  dialog.showModal();
});
document.querySelector('#editBooking').addEventListener('click', () => dialog.close());

// Export only to the visitor's device. No personal data is stored or transmitted.
document.querySelector('#downloadBooking').addEventListener('click', () => {
  if (!reviewedBooking) return;
  const data = reviewedBooking;
  const text = ['PHIẾU ĐĂNG KÝ THAM QUAN', 'Bảo tàng Văn học Việt Nam', 'CHƯA GỬI YÊU CẦU – CHƯA THANH TOÁN – KHÔNG PHẢI VÉ VÀO CỬA', '', `Họ và tên: ${data.name}`, `Điện thoại: ${data.phone}`, `Email: ${data.email || 'Không cung cấp'}`, `Ngày đến: ${readableDate(data.date)}`, `Khung giờ: ${data.session}`, '', ...data.entries.filter(entry => entry.quantity > 0).map(entry => `${entry.label}: ${entry.quantity} vé – ${money(entry.price * entry.quantity)}`), `Tổng cộng: ${money(data.total)}`, `Lời nhắn: ${data.note || 'Không có'}`, '', 'Liên hệ bảo tàng: 086 505 1179', '275 Âu Cơ, phường Tây Hồ, Hà Nội', 'Vui lòng liên hệ bảo tàng để xác nhận lịch và thanh toán.'].join('\r\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF', text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = `dang-ky-tham-quan-${data.date}.txt`; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector('#downloadStatus').textContent = 'Đã tải phiếu về máy. Yêu cầu chưa được gửi tới bảo tàng.';
});
renderSummary();
