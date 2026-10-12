// FR1.22 / UC.22 - Nghỉ phép (Staff gửi + theo dõi; Manager duyệt)
import httpClient from "./httpClient";
import { mockLeaveRequests } from "../mocks/staff";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

// Danh sách đơn nghỉ của tôi
// TODO backend: đường dẫn /leave chưa được xác nhận với Laravel API
export const getLeaveRequests = (params) => {
  if (USE_MOCK) return Promise.resolve(mockLeaveRequests);
  return httpClient.get("/leave", { params }).then((r) => r.data);
};

// Gửi đơn nghỉ mới
export const submitLeave = (data) => {
  if (USE_MOCK) {
    return Promise.resolve({
      success: true,
      data: {
        id: Date.now(),
        ...data,
        status: "PENDING",
        statusLabel: "Chờ duyệt",
        submittedAt: new Date().toISOString(),
      },
    });
  }
  return httpClient.post("/leave", data).then((r) => r.data);
};

// Hủy đơn đang chờ duyệt
// TODO backend: CHƯA CÓ endpoint — dự kiến POST /leave/{id}/cancel
export const cancelLeaveRequest = (id) => {
  if (USE_MOCK) return Promise.resolve({ success: true });
  return httpClient.post(`/leave/${id}/cancel`).then((r) => r.data);
};

// Gợi ý người thay (Manager dùng khi duyệt nghỉ tạo chỗ trống)
export const getReplacementSuggestions = (id) => {
  if (USE_MOCK) return Promise.resolve([]);
  return httpClient.get(`/leave/${id}/suggestions`).then((r) => r.data);
};

// Xác nhận người thay
export const confirmReplacement = (id, data) => {
  if (USE_MOCK) return Promise.resolve({ success: true });
  return httpClient.post(`/leave/${id}/replacement`, data).then((r) => r.data);
};