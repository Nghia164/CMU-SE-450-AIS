import { useEffect, useState } from "react";
import {
  getExchangeRequests,
  sendExchangeRequest,
  respondExchange,
  getMyAssignments,
  getSwapPartners,
} from "../../services/shiftExchangeService";
import { formatDate, formatTime } from "../../utils/format";
import { SHIFT_SWAP_STATUS } from "../../constants";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Badge from "../../components/Badge";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

const statusConfig = {
  [SHIFT_SWAP_STATUS.PENDING]: { label: "Chờ phản hồi", variant: "warning" },
  [SHIFT_SWAP_STATUS.ACCEPTED_BY_STAFF]: { label: "Chờ quản lý duyệt", variant: "info" },
  [SHIFT_SWAP_STATUS.APPROVED]: { label: "Đã duyệt", variant: "success" },
  [SHIFT_SWAP_STATUS.REJECTED]: { label: "Bị từ chối", variant: "danger" },
  [SHIFT_SWAP_STATUS.CANCELLED]: { label: "Đã hủy", variant: "default" },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { label: status, variant: "default" };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

function SwapDetailModal({ request, onClose }) {
  if (!request) return null;
  const isSent = !!request.targetEmployee;

  return (
    <Modal open onClose={onClose} title="Chi tiết yêu cầu đổi ca">
      <div className="space-y-3 text-sm">
        {isSent ? (
          <>
            <div className="rounded bg-slate-50 p-3">
              <div className="mb-1 text-xs text-slate-500">Ca của tôi</div>
              <div className="font-medium">{request.requesterAssignment.shiftName}</div>
              <div className="text-slate-600">{formatDate(request.requesterAssignment.date)}</div>
            </div>
            <div className="rounded bg-slate-50 p-3">
              <div className="mb-1 text-xs text-slate-500">Đồng nghiệp nhận đổi</div>
              <div className="font-medium">{request.targetEmployee.name}</div>
              <div className="text-slate-600">
                {request.targetAssignment?.shiftName} ({formatDate(request.targetAssignment?.date)})
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="rounded bg-slate-50 p-3">
              <div className="mb-1 text-xs text-slate-500">Đồng nghiệp gửi yêu cầu</div>
              <div className="font-medium">{request.requesterEmployee.name}</div>
              <div className="text-slate-600">
                {request.requesterAssignment.shiftName} ({formatDate(request.requesterAssignment.date)})
              </div>
            </div>
            <div className="rounded bg-slate-50 p-3">
              <div className="mb-1 text-xs text-slate-500">Ca của tôi được đề nghị đổi</div>
              <div className="font-medium">{request.targetAssignment.shiftName}</div>
              <div className="text-slate-600">{formatDate(request.targetAssignment.date)}</div>
            </div>
          </>
        )}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-slate-500">Lý do</div>
          <div className="font-medium">{request.reason || "—"}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-slate-500">Thời gian gửi</div>
          <div className="font-medium">
            {formatDate(request.submittedAt)} {formatTime(request.submittedAt)}
          </div>
        </div>
        {request.respondedAt && (
          <div className="grid grid-cols-2 gap-2">
            <div className="text-slate-500">Thời gian phản hồi</div>
            <div className="font-medium">
              {formatDate(request.respondedAt)} {formatTime(request.respondedAt)}
            </div>
          </div>
        )}
        {request.reviewedBy && (
          <div className="grid grid-cols-2 gap-2">
            <div className="text-slate-500">Người duyệt</div>
            <div className="font-medium">{request.reviewedBy}</div>
          </div>
        )}
        {request.reviewNote && (
          <div className="grid grid-cols-2 gap-2">
            <div className="text-slate-500">Ghi chú duyệt</div>
            <div className="font-medium">{request.reviewNote}</div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 border-t pt-3">
          <div className="text-slate-500">Trạng thái</div>
          <div><StatusBadge status={request.status} /></div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onClose}>Đóng</Button>
      </div>
    </Modal>
  );
}

// Form gửi yêu cầu đổi ca: chọn ca của mình + đồng nghiệp nhận (kèm ca của họ)
function SwapRequestForm({ assignments, partners, onSubmit }) {
  const [myShiftId, setMyShiftId] = useState("");
  const [partnerValue, setPartnerValue] = useState(""); // "partnerId:assignmentId"
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!myShiftId) errs.myShiftId = "Vui lòng chọn ca muốn đổi";
    if (!partnerValue) errs.partnerValue = "Vui lòng chọn đồng nghiệp nhận đổi ca";
    if (reason.trim().length < 5) errs.reason = "Lý do phải từ 5 ký tự trở lên";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const [partnerId, assignmentId] = partnerValue.split(":").map(Number);
    const partner = partners.find((p) => p.id === partnerId);
    const partnerAssignment = partner?.assignments.find((a) => a.id === assignmentId);
    const myAssignment = assignments.find((a) => a.id === Number(myShiftId));
    onSubmit({ myAssignment, partner, partnerAssignment, reason: reason.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <label className="mb-1 block text-sm">
          Ca của tôi muốn đổi <span className="text-red-500">*</span>
        </label>
        <select
          value={myShiftId}
          onChange={(e) => setMyShiftId(e.target.value)}
          className={`w-full rounded-md border p-2 text-sm ${errors.myShiftId ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="">Chọn ca đã công bố</option>
          {assignments.map((a) => (
            <option key={a.id} value={a.id}>
              {formatDate(a.date)} — {a.shiftName}
            </option>
          ))}
        </select>
        {errors.myShiftId && <p className="mt-1 text-xs text-red-600">{errors.myShiftId}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm">
          Đồng nghiệp nhận đổi ca <span className="text-red-500">*</span>
        </label>
        <select
          value={partnerValue}
          onChange={(e) => setPartnerValue(e.target.value)}
          className={`w-full rounded-md border p-2 text-sm ${errors.partnerValue ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="">Chọn đồng nghiệp và ca của họ</option>
          {partners.map((p) =>
            p.assignments.map((a) => (
              <option key={`${p.id}:${a.id}`} value={`${p.id}:${a.id}`}>
                {p.name} — {a.shiftName} ({formatDate(a.date)})
              </option>
            ))
          )}
        </select>
        {errors.partnerValue && <p className="mt-1 text-xs text-red-600">{errors.partnerValue}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm">
          Lý do <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={`w-full rounded-md border p-2 text-sm ${errors.reason ? "border-red-500" : "border-gray-300"}`}
          placeholder="Nhập lý do đổi ca..."
        />
        {errors.reason && <p className="mt-1 text-xs text-red-600">{errors.reason}</p>}
      </div>

      <Button type="submit" className="w-full">Gửi yêu cầu đổi ca</Button>
    </form>
  );
}

export default function ShiftExchangePage() {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("send"); // send | history

  const [selectedReq, setSelectedReq] = useState(null); // detail modal
  const [confirmState, setConfirmState] = useState(null); // {title, message, confirmLabel, variant, onConfirm}
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getExchangeRequests(), getMyAssignments(), getSwapPartners()])
      .then(([reqs, myAssignments, swapPartners]) => {
        if (cancelled) return;
        setSent(reqs.sent || []);
        setReceived(reqs.received || []);
        setAssignments(myAssignments || []);
        setPartners(swapPartners || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Không thể tải dữ liệu đổi ca");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // --- Gửi yêu cầu đổi ca ---
  const handleFormSubmit = (data) => {
    setConfirmState({
      title: "Xác nhận gửi yêu cầu đổi ca",
      message: (
        <div className="space-y-2">
          <p>
            Ca của tôi: <span className="font-medium">{data.myAssignment.shiftName} ({formatDate(data.myAssignment.date)})</span>
          </p>
          <p>
            Đồng nghiệp nhận: <span className="font-medium">{data.partner.name} — {data.partnerAssignment.shiftName} ({formatDate(data.partnerAssignment.date)})</span>
          </p>
          <p>
            Lý do: <span className="font-medium">{data.reason}</span>
          </p>
          <p className="rounded bg-slate-50 p-2 text-xs text-slate-500">
            Yêu cầu phải được đồng nghiệp xác nhận và Manager duyệt. Hệ thống sẽ tự kiểm tra lại
            khả dụng, kỹ năng, nghỉ phép, ca trùng, giới hạn giờ làm và thời gian nghỉ giữa các ca.
          </p>
        </div>
      ),
      confirmLabel: "Gửi yêu cầu",
      onConfirm: () => doSend(data),
    });
  };

  const doSend = async (data) => {
    setConfirmState(null);
    try {
      const res = await sendExchangeRequest({
        requester_assignment_id: data.myAssignment.id,
        target_employee_id: data.partner.id,
        target_assignment_id: data.partnerAssignment.id,
        reason: data.reason,
      });
      if (res?.success) {
        setSent((s) => [
          {
            id: res.data.id,
            requesterAssignment: data.myAssignment,
            targetEmployee: { id: data.partner.id, name: data.partner.name },
            targetAssignment: data.partnerAssignment,
            reason: data.reason,
            status: SHIFT_SWAP_STATUS.PENDING,
            submittedAt: res.data.submittedAt,
          },
          ...s,
        ]);
        addToast("Đã gửi yêu cầu đổi ca, chờ đồng nghiệp phản hồi", "success");
      } else {
        addToast("Gửi yêu cầu thất bại", "error");
      }
    } catch (err) {
      addToast(err.message || "Có lỗi xảy ra khi gửi yêu cầu", "error");
    }
  };

  // --- Hủy yêu cầu đã gửi (chỉ khi đang chờ phản hồi) ---
  const handleWithdraw = (req) => {
    setConfirmState({
      title: "Xác nhận hủy yêu cầu đổi ca",
      message: (
        <p className="text-sm">
          Hủy yêu cầu đổi ca ca <span className="font-medium">{req.requesterAssignment.shiftName}</span> ngày{" "}
          <span className="font-medium">{formatDate(req.requesterAssignment.date)}</span>? Hành động này không thể hoàn tác.
        </p>
      ),
      confirmLabel: "Hủy yêu cầu",
      variant: "danger",
      onConfirm: async () => {
        setConfirmState(null);
        try {
          const res = await respondExchange(req.id, { response: "cancelled" });
          if (res?.success) {
            setSent((s) =>
              s.map((x) => (x.id === req.id ? { ...x, status: SHIFT_SWAP_STATUS.CANCELLED } : x))
            );
            addToast("Đã hủy yêu cầu đổi ca", "success");
          } else {
            addToast("Không thể hủy yêu cầu", "error");
          }
        } catch (err) {
          addToast(err.message || "Không thể hủy yêu cầu", "error");
        }
      },
    });
  };

  // --- Chấp nhận / từ chối yêu cầu nhận được ---
  const handleRespond = (req, accept) => {
    setConfirmState({
      title: accept ? "Chấp nhận yêu cầu đổi ca" : "Từ chối yêu cầu đổi ca",
      message: (
        <p className="text-sm">
          {accept ? "Chấp nhận" : "Từ chối"} yêu cầu đổi ca của{" "}
          <span className="font-medium">{req.requesterEmployee.name}</span> (ca{" "}
          {req.requesterAssignment.shiftName} ngày {formatDate(req.requesterAssignment.date)})
          {accept ? " và chuyển sang chờ Manager duyệt?" : "?"}
        </p>
      ),
      confirmLabel: accept ? "Chấp nhận" : "Từ chối",
      variant: accept ? "primary" : "danger",
      onConfirm: async () => {
        setConfirmState(null);
        try {
          const res = await respondExchange(req.id, { response: accept ? "accepted" : "rejected" });
          if (res?.success) {
            const newStatus = accept ? SHIFT_SWAP_STATUS.ACCEPTED_BY_STAFF : SHIFT_SWAP_STATUS.REJECTED;
            setReceived((r) =>
              r.map((x) =>
                x.id === req.id ? { ...x, status: newStatus, respondedAt: new Date().toISOString() } : x
              )
            );
            addToast(
              accept
                ? "Đã chấp nhận. Yêu cầu chờ Manager duyệt trước khi lịch được cập nhật."
                : "Đã từ chối yêu cầu đổi ca",
              accept ? "success" : "info"
            );
          } else {
            addToast("Xử lý yêu cầu thất bại", "error");
          }
        } catch (err) {
          addToast(err.message || "Có lỗi xảy ra", "error");
        }
      },
    });
  };

  if (loading) return <Loading text="Đang tải dữ liệu đổi ca..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Đổi ca của tôi</h1>
        <p className="text-sm text-slate-500">
          Gửi yêu cầu đổi ca với đồng nghiệp cho ca đã công bố. Lịch chính thức chỉ thay đổi khi
          Manager phê duyệt.
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant={tab === "send" ? "secondary" : "ghost"} onClick={() => setTab("send")}>
          Gửi yêu cầu
        </Button>
        <Button variant={tab === "history" ? "secondary" : "ghost"} onClick={() => setTab("history")}>
          Yêu cầu đã gửi / nhận
        </Button>
      </div>

      {tab === "send" &&
        (assignments.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
            Hiện không có ca đã công bố nào để đổi.
          </div>
        ) : (
          <SwapRequestForm assignments={assignments} partners={partners} onSubmit={handleFormSubmit} />
        ))}

      {tab === "history" && (
        <div className="space-y-6">
          {/* Đã gửi */}
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-lg font-medium">Yêu cầu đã gửi</h2>
            </div>
            <div className="p-4">
              {sent.length === 0 ? (
                <p className="py-8 text-center text-slate-500">Chưa gửi yêu cầu đổi ca nào.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                        <th className="px-3 py-2 text-left">Ca của tôi</th>
                        <th className="px-3 py-2 text-left">Người nhận</th>
                        <th className="px-3 py-2 text-left">Ca nhận</th>
                        <th className="px-3 py-2 text-left">Lý do</th>
                        <th className="px-3 py-2 text-left">Trạng thái</th>
                        <th className="px-3 py-2 text-left"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {sent.map((r) => (
                        <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="whitespace-nowrap px-3 py-2.5">
                            <div>{r.requesterAssignment.shiftName}</div>
                            <div className="text-xs text-slate-500">{formatDate(r.requesterAssignment.date)}</div>
                          </td>
                          <td className="px-3 py-2.5">{r.targetEmployee?.name || "—"}</td>
                          <td className="whitespace-nowrap px-3 py-2.5">
                            <div>{r.targetAssignment?.shiftName || "—"}</div>
                            <div className="text-xs text-slate-500">{r.targetAssignment && formatDate(r.targetAssignment.date)}</div>
                          </td>
                          <td className="max-w-[14rem] truncate px-3 py-2.5">{r.reason || "—"}</td>
                          <td className="px-3 py-2.5"><StatusBadge status={r.status} /></td>
                          <td className="whitespace-nowrap px-3 py-2.5">
                            <div className="flex gap-2">
                              <Button variant="ghost" className="px-2.5 py-1 text-xs" onClick={() => setSelectedReq(r)}>
                                Chi tiết
                              </Button>
                              {r.status === SHIFT_SWAP_STATUS.PENDING && (
                                <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => handleWithdraw(r)}>
                                  Hủy
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

          {/* Nhận được */}
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-lg font-medium">Yêu cầu nhận được</h2>
            </div>
            <div className="p-4">
              {received.length === 0 ? (
                <p className="py-8 text-center text-slate-500">Chưa nhận được yêu cầu đổi ca nào.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                        <th className="px-3 py-2 text-left">Người gửi</th>
                        <th className="px-3 py-2 text-left">Ca của người gửi</th>
                        <th className="px-3 py-2 text-left">Ca của tôi</th>
                        <th className="px-3 py-2 text-left">Lý do</th>
                        <th className="px-3 py-2 text-left">Trạng thái</th>
                        <th className="px-3 py-2 text-left"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {received.map((r) => (
                        <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-3 py-2.5">{r.requesterEmployee?.name || "—"}</td>
                          <td className="whitespace-nowrap px-3 py-2.5">
                            <div>{r.requesterAssignment.shiftName}</div>
                            <div className="text-xs text-slate-500">{formatDate(r.requesterAssignment.date)}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5">
                            <div>{r.targetAssignment.shiftName}</div>
                            <div className="text-xs text-slate-500">{formatDate(r.targetAssignment.date)}</div>
                          </td>
                          <td className="max-w-[14rem] truncate px-3 py-2.5">{r.reason || "—"}</td>
                          <td className="px-3 py-2.5"><StatusBadge status={r.status} /></td>
                          <td className="whitespace-nowrap px-3 py-2.5">
                            <div className="flex gap-2">
                              {r.status === SHIFT_SWAP_STATUS.PENDING && (
                                <>
                                  <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => handleRespond(r, false)}>
                                    Từ chối
                                  </Button>
                                  <Button className="px-2.5 py-1 text-xs" onClick={() => handleRespond(r, true)}>
                                    Chấp nhận
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" className="px-2.5 py-1 text-xs" onClick={() => setSelectedReq(r)}>
                                Chi tiết
                              </Button>
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
        </div>
      )}

      {/* Confirm modal dùng chung */}
      <Modal open={!!confirmState} onClose={() => setConfirmState(null)} title={confirmState?.title}>
        <div>{confirmState?.message}</div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmState(null)}>Đóng</Button>
          <Button variant={confirmState?.variant === "danger" ? "danger" : "primary"} onClick={confirmState?.onConfirm}>
            {confirmState?.confirmLabel || "Xác nhận"}
          </Button>
        </div>
      </Modal>

      {/* Detail modal */}
      <SwapDetailModal request={selectedReq} onClose={() => setSelectedReq(null)} />

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