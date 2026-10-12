// FR1.23 / UC.23 - Đổi ca (Staff)
import httpClient from "./httpClient";
import {
  mockShiftSwapRequests,
  mockMyAssignments,
  mockSwapPartners,
} from "../mocks/staff";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

// Yêu cầu đổi ca đã gửi / đã nhận
// TODO backend: đường dẫn /shift-exchange chưa được xác nhận với Laravel API
export const getExchangeRequests = (params) => {
  if (USE_MOCK) return Promise.resolve(mockShiftSwapRequests);
  return httpClient.get("/shift-exchange", { params }).then((r) => r.data);
};

// Ca đã công bố của tôi (để chọn ca muốn đổi)
// TODO backend: CHƯA CÓ endpoint — dự kiến GET /shift-exchange/my-assignments
// trả về [{ id, date, shiftName, status: "published" }]
export const getMyAssignments = () => {
  if (USE_MOCK) return Promise.resolve(mockMyAssignments);
  return httpClient.get("/shift-exchange/my-assignments").then((r) => r.data);
};

// Đồng nghiệp + ca có thể đổi
// TODO backend: CHƯA CÓ endpoint — dự kiến GET /shift-exchange/eligible-partners?assignment_id=
// Backend phải kiểm tra khả dụng, kỹ năng, nghỉ phép, ca trùng, giới hạn giờ làm,
// thời gian nghỉ giữa các ca trước khi trả về danh sách đủ điều kiện.
export const getSwapPartners = (assignmentId) => {
  if (USE_MOCK) return Promise.resolve(mockSwapPartners);
  return httpClient
    .get("/shift-exchange/eligible-partners", { params: { assignment_id: assignmentId } })
    .then((r) => r.data);
};

// Gửi yêu cầu đổi ca
export const sendExchangeRequest = (data) => {
  if (USE_MOCK) {
    return Promise.resolve({
      success: true,
      data: {
        id: Date.now(),
        ...data,
        status: "PENDING",
        submittedAt: new Date().toISOString(),
      },
    });
  }
  return httpClient.post("/shift-exchange", data).then((r) => r.data);
};

// Phản hồi yêu cầu đổi ca (chấp nhận / từ chối / hủy)
export const respondExchange = (id, data) => {
  if (USE_MOCK) return Promise.resolve({ success: true });
  return httpClient.patch(`/shift-exchange/${id}`, data).then((r) => r.data);
};