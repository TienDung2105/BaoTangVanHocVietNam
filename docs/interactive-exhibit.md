# Ảnh tương tác trong Media

Mục `pages/media.html#photos` dùng `src/features/interactive-exhibit.js` và `assets/css/pages/interactive-exhibit.css`.

Tham chiếu: https://docs.google.com/document/d/1zkmZYl-R2juFxaNuRs-qYVmVYik4Sz3SlsjlgJYwIKc/edit?tab=t.0

Ba ảnh gốc từ tài liệu, đúng thứ tự trái, giữa, phải:
- `assets/images/media/interactive-left.png`: không gian sinh hoạt.
- `assets/images/media/interactive-center.png`: góc làm việc.
- `assets/images/media/interactive-right.png`: lớp học xưa.

Ảnh mẫu giao diện nằm trong `design-source/media-interactive/`.

Ban đầu hiển thị ba ảnh bằng nhau để chọn. Ảnh giữ tỷ lệ gốc, phần chữ nằm dưới và căn đều; rê chuột vào một ảnh sẽ phóng lớn nhẹ toàn bộ khung ảnh đó trên desktop. Trên điện thoại, ba ảnh xếp dọc. Chọn ảnh mở native dialog lớn. Nút thu nhỏ phía trên bên phải quay lại danh sách, giữ vị trí cuộn và trả focus về ảnh đã chọn.

Mỗi ảnh có bốn hotspot đặt theo chi tiết nhìn thấy, với tọa độ phần trăm. Bấm hotspot phóng tới chi tiết và mở mô tả hình ảnh; nhãn không khẳng định danh tính nhân vật hay xuất xứ hiện vật.

Kéo, cuộn, chụm hai ngón tay, phím mũi tên và nút trái/phải thay đổi góc nhìn. Nút cộng/trừ điều khiển zoom; nút đặt lại hoặc phím `0` trả về góc nhìn đầu. Escape đóng thông tin hotspot trước, Escape lần nữa đóng khung xem.

`?album=album-1#photos`, `album-2`, `album-3` mở trực tiếp từng ảnh. Đây là ảnh tĩnh có thể di chuyển và phóng to, không phải panorama 360 độ. Chuyển động tôn trọng cài đặt giảm chuyển động.

`media-library.json` vẫn phục vụ video và mô hình 3D; danh sách ảnh tương tác mới được định nghĩa tại `createInteractiveExhibit()`.

Đã kiểm tra cú pháp ES modules và logic bằng DOM mô phỏng: cả ba ảnh, tải ảnh, bốn hotspot mỗi ảnh, zoom, đặt lại, di chuyển, thu nhỏ, trả focus, mở trực tiếp và đóng khi chuyển tab. Chưa kiểm tra trực quan trên trình duyệt vì không có trình duyệt kết nối với công cụ trong phiên này.
