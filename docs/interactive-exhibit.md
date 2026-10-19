# Ảnh tương tác trong Media

Mục `pages/media.html#photos` dùng `src/features/interactive-exhibit.js`
và `assets/css/pages/interactive-exhibit.css`.

- Ảnh tổng quan được lấy từ file HTML mẫu người dùng cung cấp và lưu tại
  `assets/images/media/interactive-room.jpg`.
- Bốn không gian và các ảnh chi tiết vẫn lấy từ `assets/data/media-library.json`.
  Ảnh tổng quan được đặt trước các ảnh của không gian đầu tiên.
- Bốn điểm trên ảnh tổng quan gồm bàn viết, giá sách, chiếc võng và mô hình
  nhân vật. Tọa độ theo phần trăm chiều rộng và chiều cao ảnh; vị trí và mô tả
  nằm trong mảng `points`. Chưa gắn điểm vào các ảnh chưa có vị trí xác nhận.
- Đây là trình xem ảnh tĩnh tương tác. Kéo, cuộn, chụm hai ngón tay, phím
  mũi tên và nút điều khiển thay đổi góc nhìn. `0` đặt lại góc nhìn.
- `?album=album-2#photos` vẫn mở trực tiếp không gian tương ứng.
- Trình xem chỉ tải ảnh tổng quan khi mở tab ảnh. Hiệu ứng chuyển tới điểm
  tương tác tôn trọng cài đặt giảm chuyển động.

Tham chiếu thứ hai do người dùng gửi: https://3d.vnfam.vn/vi#room=1.
Trang này không mở được bằng công cụ duyệt trong phiên thực hiện; phần triển
khai dựa trên file HTML mẫu đã đọc và ảnh gốc nhúng trong file đó.
