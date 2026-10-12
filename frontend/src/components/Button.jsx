// Nút dùng chung. variant: primary (mặc định) | secondary | danger | ghost
const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-slate-200 text-slate-700 hover:bg-slate-300",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
};

export default function Button({ children, variant = "primary", className = "", ...props }) {
  const variantCls = variants[variant] || variants.primary;
  return (
    <button
      className={`inline-flex items-center justify-center gap-1 rounded-md px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantCls} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}