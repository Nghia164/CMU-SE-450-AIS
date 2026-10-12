// FR05 - Lập lịch
// Cần làm:
//  - Nút chạy lập lịch (giới hạn 15 giây, có trạng thái chờ)
//  - Xem lịch đề xuất
//  - Chỉnh tay từng ca
//  - Hiện cảnh báo vi phạm ràng buộc / lý do vô nghiệm
//  - Nút Apply (không cho Apply nếu vi phạm ràng buộc cứng)
export default function SchedulePage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Lập lịch</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <ul className="list-disc pl-5">
        <li>Nút chạy lập lịch (giới hạn 15 giây, có trạng thái chờ)</li>
        <li>Xem lịch đề xuất</li>
        <li>Chỉnh tay từng ca</li>
        <li>Hiện cảnh báo vi phạm ràng buộc / lý do vô nghiệm</li>
        <li>Nút Apply (không cho Apply nếu vi phạm ràng buộc cứng)</li>
        </ul>
      </div>
    </div>
  );
}
