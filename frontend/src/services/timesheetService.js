// FR12 - Timesheet (Xem bảng công + thu nhập ước tính)
import httpClient from "./httpClient";
import { mockTimesheet } from "../mocks/staff";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

export const getTimesheet = (params) => {
  if (USE_MOCK) {
    // Trả về promise để đồng bộ với API thực tế
    return Promise.resolve(mockTimesheet);
  }
  return httpClient.get("/timesheet", { params }).then((r) => r.data);
};

// Nếu cần update (ví dụ: chỉnh sửa break) — hiện tại chỉ đọc
// export const updateTimesheetEntry = (id, data) => httpClient.put(`/timesheet/${id}`, data).then((r) => r.data);