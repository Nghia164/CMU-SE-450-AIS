import { useState } from "react";
import { Plus, Pencil, Trash2, Clock, Users } from "lucide-react";

const initial = [
  { id: 1, name: "Ca sáng", start: "07:00", end: "12:00", people: 4, role: "Phục vụ" },
  { id: 2, name: "Ca chiều", start: "12:00", end: "17:00", people: 3, role: "Pha chế" },
  { id: 3, name: "Ca tối", start: "17:00", end: "22:00", people: 5, role: "Phục vụ" },
];
const blank = { name: "", start: "07:00", end: "12:00", people: 1, role: "Phục vụ" };

export default function ShiftConfigPage() {
  const [shifts, setShifts] = useState(initial);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [restHours, setRestHours] = useState(10);
  const [maxConsecutive, setMaxConsecutive] = useState(5);
  const [message, setMessage] = useState("");
  const save = (e) => {
    e.preventDefault();
    if (form.start >= form.end) return setMessage("Giờ kết thúc phải sau giờ bắt đầu trong cùng ngày.");
    if (Number(form.people) < 1) return setMessage("Số nhân viên cần có phải lớn hơn 0.");
    if (editing) setShifts((items) => items.map((item) => item.id === editing ? { ...form, id: editing, people: Number(form.people) } : item));
    else setShifts((items) => [...items, { ...form, id: Date.now(), people: Number(form.people) }]);
    setForm(blank); setEditing(null); setMessage("Đã lưu thay đổi trên giao diện mẫu.");
  };
  const edit = (shift) => { setEditing(shift.id); setForm({ name: shift.name, start: shift.start, end: shift.end, people: shift.people, role: shift.role }); setMessage(""); };
  return <div className="space-y-6">
    <div><p className="text-sm font-medium text-blue-700">QUẢN LÝ VẬN HÀNH</p><h1 className="mt-1 text-2xl font-bold text-slate-900">Ca làm & ràng buộc</h1><p className="mt-1 text-sm text-slate-500">Thiết lập khung giờ, nhu cầu nhân sự và quy tắc xếp lịch.</p></div>
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">Dữ liệu minh họa trên giao diện. Chưa lưu lên máy chủ.</div>
    {message && <div role="status" className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">{message}</div>}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{shifts.map((shift) => <article key={shift.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div className="rounded-lg bg-blue-50 p-2 text-blue-700"><Clock size={20}/></div><div className="flex gap-2"><button aria-label="Sửa ca" onClick={() => edit(shift)} className="rounded p-2 text-slate-500 hover:bg-slate-100"><Pencil size={16}/></button><button aria-label="Xóa ca" onClick={() => { setShifts((items) => items.filter((item) => item.id !== shift.id)); if (editing === shift.id) { setEditing(null); setForm(blank); } }} className="rounded p-2 text-red-600 hover:bg-red-50"><Trash2 size={16}/></button></div></div><h2 className="mt-4 text-lg font-semibold text-slate-900">{shift.name}</h2><p className="mt-1 text-sm text-slate-500">{shift.start} – {shift.end}</p><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm"><span className="flex items-center gap-2 text-slate-600"><Users size={16}/>{shift.role}</span><strong>{shift.people} người</strong></div></article>)}</div>
    <form onSubmit={save} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 text-lg font-semibold">{editing ? "Chỉnh sửa ca làm" : "Thêm ca làm"}</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><label className="text-sm text-slate-600">Tên ca<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"/></label><label className="text-sm text-slate-600">Bắt đầu<input required type="time" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"/></label><label className="text-sm text-slate-600">Kết thúc<input required type="time" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"/></label><label className="text-sm text-slate-600">Số người<input required type="number" min="1" value={form.people} onChange={(e) => setForm({ ...form, people: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"/></label><label className="text-sm text-slate-600">Vị trí<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"><option>Phục vụ</option><option>Pha chế</option><option>Thu ngân</option><option>Bếp</option></select></label></div><div className="mt-4 flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white"><Plus size={16}/>{editing ? "Lưu ca" : "Thêm ca"}</button>{editing && <button type="button" onClick={() => { setEditing(null); setForm(blank); }} className="rounded-lg border px-4 py-2 text-sm">Hủy sửa</button>}</div></form>
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold">Ràng buộc xếp lịch</h2><p className="mt-1 text-sm text-slate-500">Các giá trị bên dưới chỉ lưu trong phiên giao diện hiện tại.</p><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm text-slate-700">Thời gian nghỉ tối thiểu giữa hai ca (giờ)<input type="number" min="0" max="24" value={restHours} onChange={(e) => setRestHours(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"/></label><label className="text-sm text-slate-700">Số ca liên tiếp tối đa<input type="number" min="1" max="14" value={maxConsecutive} onChange={(e) => setMaxConsecutive(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"/></label></div><button onClick={() => setMessage("Đã cập nhật ràng buộc trong phiên giao diện mẫu.")} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Lưu ràng buộc</button></section>
  </div>;
}
