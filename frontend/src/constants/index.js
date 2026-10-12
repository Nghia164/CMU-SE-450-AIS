// Theo SRS: Admin, Manager, Staff (3 vai trò chính thức của dự án)
export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STAFF: "staff",
};

// Các trạng thái chung — giá trị viết hoa đúng theo database schema
// (dbo.leave_requests.status / dbo.shift_swap_requests.status)
export const STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
};

// Trạng thái riêng cho Timesheet (theo dbo.timesheets.status)
export const TIMESHEET_STATUS = {
  DRAFT: "DRAFT",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  ADJUSTED: "ADJUSTED",
};

// Trạng thái riêng cho Shift Swap (theo dbo.shift_swap_requests.status)
export const SHIFT_SWAP_STATUS = {
  PENDING: "PENDING",
  ACCEPTED_BY_STAFF: "ACCEPTED_BY_STAFF",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
};

// Loại nghỉ (theo dbo.leave_requests.leave_type)
export const LEAVE_TYPES = {
  ANNUAL: { value: "ANNUAL", label: "Nghỉ phép năm" },
  SICK: { value: "SICK", label: "Nghỉ ốm" },
  PERSONAL: { value: "PERSONAL", label: "Nghỉ việc riêng" },
  UNPAID: { value: "UNPAID", label: "Nghỉ không lương" },
  EMERGENCY: { value: "EMERGENCY", label: "Nghỉ khẩn cấp" },
  OTHER: { value: "OTHER", label: "Khác" },
};