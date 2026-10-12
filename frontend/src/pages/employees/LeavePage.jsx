import { useEffect, useState } from "react";
import { getLeaveRequests, submitLeave, cancelLeaveRequest } from "../../services/leaveService";
import { formatDate, formatTime } from "../../utils/format";
import { LEAVE_TYPES, STATUS } from "../../constants";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import DateInput from "../../components/DateInput";
import Badge from "../../components/Badge";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

const statusConfig = {
  [STATUS.PENDING]: { label: "Chờ duyệt", variant: "warning" },
  [STATUS.APPROVED]: { label: "Đã duyệt", variant: "success" },
  [STATUS.REJECTED]: { label: "Từ chối", variant: "danger" },
  [STATUS.CANCELLED]: { label: "Đã hủy", variant: "default" },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { label: status, variant: "default" };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

function LeaveDetailModal({ request, onClose }) {
  if (!request) return null;
  const {
    leaveTypeLabel, startAt, endAt, reason, status,
    submittedAt, reviewedAt, reviewedBy, reviewNote, affectedAssignments,
  } = request;

  return (
    <Modal open onClose={onClose} title="Chi tiết đơn nghỉ">
      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-slate-500">Loại nghỉ</div>
          <div className="font-medium">{leaveTypeLabel || LEAVE_TYPES[request.leaveType]?.label || "—"}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-slate-500">Từ</div>
          <div className="font-medium">{formatDate(startAt)} {formatTime(startAt)}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-slate-500">Đến</div>
          <div className="font-medium">{formatDate(endAt)} {formatTime(endAt)}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-slate-500">Lý do</div>
          <div className="font-medium">{reason || "—"}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-slate-500">Thời gian gửi</div>
          <div className="font-medium">{formatDate(submittedAt)} {formatTime(submittedAt)}</div>
        </div>
        {reviewedAt && (
          <div className="grid grid-cols-2 gap-2">
            <div className="text-slate-500">Người duyệt</div>
            <div className="font-medium">{reviewedBy || "—"}</div>
          </div>
        )}
        {reviewNote && (
          <div className="grid grid-cols-2 gap-2">
            <div className="text-slate-500">Ghi chú duyệt</div>
            <div className="font-medium">{reviewNote}</div>
          </div>
        )}
        {affectedAssignments?.length > 0 && (
          <div>
            <div className="text-slate-500 mb-1">Ca bị ảnh hưởng</div>
            <ul className="list-disc pl-5">
              {affectedAssignments.map((a, i) => (
                <li key={i}>{formatDate(a.date)} — {a.shift}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 border-t pt-3">
          <div className="text-slate-500">Trạng thái</div>
          <div><StatusBadge status={status} /></div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onClose}>Đóng</Button>
      </div>
    </Modal>
  );
}

export default function LeavePage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null); // detail modal
  const [cancellingReq, setCancellingReq] = useState(null); // cancel confirm modal
  const [toasts, setToasts] = useState([]);

  const [form, setForm] = useState({ leaveType: "", startAt: "", endAt: "", reason: "" });
  const [formError, setFormError] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getLeaveRequests()
      .then((res) => {
        if (!cancelled) setRequests(res.requests || res || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Không thể tải danh sách đơn nghỉ");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  };

  const validate = () => {
    const errs = {};
    if (!form.leaveType) errs.leaveType = "Vui lòng chọn loại nghỉ";
    if (!form.startAt) errs.startAt = "Vui lòng chọn thời gian bắt đầu";
    if (!form.endAt) errs.endAt = "Vui lòng chọn thời gian kết thúc";
    if (form.startAt && form.endAt && new Date(form.endAt) <= new Date(form.startAt)) {
      errs.endAt = "Thời gian kết thúc phải sau thời gian bắt đầu";
    }
    if (form.reason.trim().length < 5) errs.reason = "Lý do phải từ 5 ký tự trở lên";
    setFormError(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await submitLeave({ ...form, leaveType: form.leaveType });
      if (res?.success) {
        const newReq = {
          ...res.data,
          leaveTypeLabel: LEAVE_TYPES[form.leaveType].label,
        };
        setRequests((r) => [newReq, ...r]);
        setForm({ leaveType: "", startAt: "", endAt: "", reason: "" });
        setFormError({});
        setFormOpen(false);
        addToast("Đã gửi đơn nghỉ, chờ Manager duyệt", "success");
      } else {
        addToast("Gửi đơn thất bại", "error");
      }
    } catch (err) {
      addToast(err.message || "Có lỗi xảy ra khi gửi đơn", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelConfirm = async () => {
    const req = cancellingReq;
    setCancellingReq(null);
    if (!req) return;
    try {
      const res = await cancelLeaveRequest(req.id);
      if (res?.success) {
        setRequests((r) =>
          r.map((x) => (x.id === req.id ? { ...x, status: STATUS.CANCELLED } : x))
        );
        addToast("Đã hủy đơn nghỉ", "success");
      } else {
        addToast("Không thể hủy đơn nghỉ", "error");
      }
    } catch (err) {
      addToast(err.message || "Không thể hủy đơn nghỉ", "error");
    }
  };

  const filters = [
    { key: "all", label: "Tất cả" },
    { key: STATUS.PENDING, label: "Chờ duyệt" },
    { key: STATUS.APPROVED, label: "Đã duyệt" },
    { key: STATUS.REJECTED, label: "Từ chối" },
    { key: STATUS.CANCELLED, label: "Đã hủy" },
  ];
  const filtered = requests.filter((r) => (filter === "all" ? true : r.status === filter));

  if (loading) return <Loading text="Đang tải đơn nghỉ..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Nghỉ phép của tôi</h1>
          <p className="text-sm text-slate-500">
            Đơn nghỉ được gửi cho Manager xem xét; trạng thái cuối cùng do hệ thống quyết định.
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>+ Xin nghỉ</Button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Button
            key={f.key}
            variant={filter === f.key ? "secondary" : "ghost"}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* List */}
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="text-lg font-medium">Danh sách yêu cầu</h2>
        </div>
        <div className="p-4">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-slate-500">Không có đơn nghỉ nào phù hợp.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2 text-left">Ngày gửi</th>
                    <th className="px-3 py-2 text-left">Loại nghỉ</th>
                    <th className="px-3 py-2 text-left">Thời gian nghỉ</th>
                    <th className="px-3 py-2 text-left">Lý do</th>
                    <th className="px-3 py-2 text-left">Người xử lý</th>
                    <th className="px-3 py-2 text-left">Trạng thái</th>
                    <th className="px-3 py-2 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="whitespace-nowrap px-3 py-2.5">
                        <div className="font-medium text-slate-900">{formatDate(r.submittedAt)}</div>
                        <div className="text-xs text-slate-500">{formatTime(r.submittedAt)}</div>
                      </td>
                      <td className="px-3 py-2.5">{LEAVE_TYPES[r.leaveType]?.label || r.leaveType}</td>
                      <td className="whitespace-nowrap px-3 py-2.5">
                        {formatDate(r.startAt)} — {formatDate(r.endAt)}
                      </td>
                      <td className="max-w-[16rem] truncate px-3 py-2.5">{r.reason || "—"}</td>
                      <td className="px-3 py-2.5">{r.reviewedBy || "—"}</td>
                      <td className="px-3 py-2.5"><StatusBadge status={r.status} /></td>
                      <td className="whitespace-nowrap px-3 py-2.5">
                        <div className="flex gap-2">
                          <Button variant="ghost" className="px-2.5 py-1 text-xs" onClick={() => setSelectedReq(r)}>
                            Chi tiết
                          </Button>
                          {r.status === STATUS.PENDING && (
                            <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => setCancellingReq(r)}>
                              Hủy đơn
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Form modal */}
      <Modal open={formOpen} onClose={() => { setFormOpen(false); setFormError({}); }} title="Gửi đơn xin nghỉ">
        <form onSubmit={handleSubmit}>
          <label className="mb-3 block">
            <div className="mb-1 text-sm">Loại nghỉ <span className="text-red-500">*</span></div>
            <select
              value={form.leaveType}
              onChange={(e) => setForm((f) => ({ ...f, leaveType: e.target.value }))}
              className={`w-full rounded-md border p-2 text-sm ${formError.leaveType ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Chọn loại nghỉ</option>
              {Object.entries(LEAVE_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            {formError.leaveType && <p className="mt-1 text-xs text-red-600">{formError.leaveType}</p>}
          </label>

          <DateInput
            label="Thời gian bắt đầu"
            value={form.startAt}
            onChange={(v) => setForm((f) => ({ ...f, startAt: v }))}
            error={formError.startAt}
          />
          <DateInput
            label="Thời gian kết thúc"
            value={form.endAt}
            onChange={(v) => setForm((f) => ({ ...f, endAt: v }))}
            error={formError.endAt}
          />

          <label className="mb-3 block">
            <div className="mb-1 text-sm">Lý do <span className="text-red-500">*</span></div>
            <textarea
              rows={3}
              value={form.reason}
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              className={`w-full rounded-md border p-2 text-sm ${formError.reason ? "border-red-500" : "border-gray-300"}`}
              placeholder="Nhập lý do nghỉ..."
            />
            {formError.reason && <p className="mt-1 text-xs text-red-600">{formError.reason}</p>}
          </label>

          <p className="mb-3 text-xs text-slate-500">
            Các ca làm bị ảnh hưởng sẽ do hệ thống đối chiếu với lịch đã công bố.
          </p>

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button variant="secondary" onClick={() => { setFormOpen(false); setFormError({}); }}>
              Hủy
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Đang gửi..." : "Gửi đơn"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detail modal */}
      <LeaveDetailModal request={selectedReq} onClose={() => setSelectedReq(null)} />

      {/* Cancel confirm modal */}
      <Modal open={!!cancellingReq} onClose={() => setCancellingReq(null)} title="Xác nhận hủy đơn nghỉ">
        <p className="text-sm">
          Bạn có chắc muốn hủy đơn nghỉ{" "}
          <span className="font-medium">
            {cancellingReq && `${formatDate(cancellingReq.startAt)} — ${formatDate(cancellingReq.endAt)}`}
          </span>?
          Hành động này không thể hoàn tác.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setCancellingReq(null)}>Giữ lại</Button>
          <Button variant="danger" onClick={handleCancelConfirm}>Hủy đơn</Button>
        </div>
      </Modal>

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-md px-4 py-2 text-sm shadow ${
              t.type === "success"
                ? "bg-green-100 text-green-800"
                : t.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-slate-100 text-slate-800"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}