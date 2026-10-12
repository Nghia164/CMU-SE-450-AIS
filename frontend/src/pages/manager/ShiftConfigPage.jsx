// FR05 - Ca & ràng buộc
// Cần làm:
//  - Nhu cầu nhân sự mỗi ca
//  - Cấu hình ca
//  - Ràng buộc: nghỉ tối thiểu giữa 2 ca, giới hạn số ca liên tiếp
export default function ShiftConfigPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Ca & ràng buộc</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <ul className="list-disc pl-5">
        <li>Nhu cầu nhân sự mỗi ca</li>
        <li>Cấu hình ca</li>
        <li>Ràng buộc: nghỉ tối thiểu giữa 2 ca, giới hạn số ca liên tiếp</li>
        </ul>
      </div>
    </div>
  );
}
