// Input ngày/thời gian dùng chung cho Leave + Shift Swap forms
export default function DateInput({ label, value, onChange, error, ...props }) {
  return (
    <label className="mb-3 block">
      <div className="mb-1 text-sm text-slate-700">{label}</div>
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-md border p-2 text-sm ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  );
}