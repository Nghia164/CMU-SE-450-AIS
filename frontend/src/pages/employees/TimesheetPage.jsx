import { useEffect, useState } from "react";
import { getTimesheet } from "../../services/timesheetService";
import { formatDate, formatMoney } from "../../utils/format";
import { TIMESHEET_STATUS } from "../../constants";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

const statusConfig = {
  [TIMESHEET_STATUS.APPROVED]: { label: "Đã duyệt", className: "bg-green-100 text-green-700" },
  [TIMESHEET_STATUS.PENDING_APPROVAL]: { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-700" },
  [TIMESHEET_STATUS.DRAFT]: { label: "Nháp", className: "bg-gray-100 text-gray-700" },
  [TIMESHEET_STATUS.REJECTED]: { label: "Từ chối", className: "bg-red-100 text-red-700" },
  [TIMESHEET_STATUS.ADJUSTED]: { label: "Đã điều chỉnh", className: "bg-blue-100 text-blue-700" },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-700" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

export default function TimesheetPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("2026-09");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getTimesheet({ period: selectedPeriod })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Không thể tải dữ liệu bảng công");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedPeriod]);

  if (loading) return <Loading text="Đang tải bảng công..." />;

  if (error) return <ErrorMessage message={error} />;

  if (!data) return <ErrorMessage message="Không có dữ liệu bảng công" />;

  const { summary, entries, periodLabel, updatedAt, source } = data;

  const columns = [
    { key: "workDate", label: "Ngày", render: (r) => formatDate(r.workDate) },
    { key: "shiftName", label: "Ca" },
    {
      key: "scheduled",
      label: "Theo lịch",
      render: (r) => `${r.scheduledStart} – ${r.scheduledEnd}`,
    },
    {
      key: "actual",
      label: "Thực tế",
      render: (r) =>
        r.actualStart && r.actualEnd
          ? `${r.actualStart} – ${r.actualEnd}`
          : "Chưa chấm công",
    },
    {
      key: "workedHours",
      label: "Giờ làm (h)",
      render: (r) => (r.regularHours + r.overtimeHours).toFixed(2),
    },
    {
      key: "overtimeHours",
      label: "Tăng ca (h)",
      render: (r) => (r.overtimeHours > 0 ? r.overtimeHours.toFixed(2) : "—"),
    },
    {
      key: "estimatedAmount",
      label: "Thu nhập ước tính",
      render: (r) => formatMoney(r.estimatedAmount),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header + Period filter */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Bảng công & Thu nhập ước tính</h1>
          <p className="text-sm text-slate-500">
            Kỳ lương: <span className="font-medium">{periodLabel}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600">Chọn kỳ:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm bg-white"
          >
            <option value="2026-10">10/2026</option>
            <option value="2026-09">09/2026</option>
            <option value="2026-08">08/2026</option>
            <option value="2026-07">07/2026</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Giờ làm thường</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{summary.totalRegularHours.toFixed(1)} h</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Giờ tăng ca</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{summary.totalOvertimeHours.toFixed(1)} h</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Tổng giờ</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {(summary.totalRegularHours + summary.totalOvertimeHours).toFixed(1)} h
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-amber-50 p-5">
          <p className="text-sm text-slate-500">Thu nhập ước tính</p>
          <p className="mt-1 text-2xl font-bold text-amber-700">{formatMoney(summary.totalEstimatedAmount)}</p>
          <p className="mt-1 text-xs text-amber-600">
            Dựa trên timesheet đã duyệt & mức lương áp dụng
          </p>
        </div>
      </div>

      {/* Detail Table */}
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="text-lg font-medium">Chi tiết từng ngày</h2>
        </div>
        <div className="p-4">
          {entries.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              Không có dữ liệu bảng công cho kỳ này.
            </p>
          ) : (
            <Table columns={columns} rows={entries} />
          )}
        </div>
      </div>

      {/* Calculation Breakdown */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-3 font-medium">Cách tính thu nhập ước tính</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Mức lương thường</p>
            <p className="font-medium">{formatMoney(summary.hourlyRate)}/h</p>
          </div>
          <div>
            <p className="text-slate-500">Mức lương tăng ca</p>
            <p className="font-medium">{formatMoney(summary.overtimeRate)}/h (hệ số 1.5)</p>
          </div>
          <div>
            <p className="text-slate-500">Công thức</p>
            <p className="font-medium">
              {summary.totalRegularHours.toFixed(1)}h × {formatMoney(summary.hourlyRate)} +{" "}
              {summary.totalOvertimeHours.toFixed(1)}h × {formatMoney(summary.overtimeRate)}
            </p>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-xs text-slate-400 text-center">
        Cập nhật: {updatedAt ? formatDate(updatedAt) : "—"} | Nguồn: {source}
      </div>
    </div>
  );
}