import API from "../../components/Api";

export const coachApi = {
  dashboard: () => API.get("/api/coach/dashboard/").then((res) => res.data),
  plans: () => API.get("/api/coach/plans/?ordering=-created_at").then((res) => res.data.results || res.data),
  profileSetup: (payload) => API.patch("/api/coach/profile-setup/", payload).then((res) => res.data),
  generate: (intent, payload) => API.post(`/api/coach/generate/${intent}/`, payload).then((res) => res.data),
  deletePlan: (id) => API.delete(`/api/coach/plans/${id}/`),
  progress: () => API.get("/api/coach/progress/?ordering=-recorded_on").then((res) => res.data.results || res.data),
  saveProgress: (payload) => API.post("/api/coach/progress/", payload).then((res) => res.data),
  challenges: () => API.get("/api/coach/challenges/").then((res) => res.data.results || res.data),
  saveChallenge: (payload) => API.post("/api/coach/challenges/", payload).then((res) => res.data),
  deleteChallenge: (id) => API.delete(`/api/coach/challenges/${id}/`),
  notifications: () => API.get("/api/coach/notifications/").then((res) => res.data.results || res.data),
  markNotificationRead: (id) => API.post(`/api/coach/notifications/${id}/mark_read/`).then((res) => res.data),
  reports: () => API.get("/api/coach/reports/").then((res) => res.data.results || res.data),
  generateReport: () => API.post("/api/coach/reports/generate/").then((res) => res.data),
  calendar: () => API.get("/api/coach/calendar/").then((res) => res.data.results || res.data),
  saveCalendarEvent: (payload) => API.post("/api/coach/calendar/", payload).then((res) => res.data),
  updateCalendarEvent: (id, payload) => API.patch(`/api/coach/calendar/${id}/`, payload).then((res) => res.data),
  deleteCalendarEvent: (id) => API.delete(`/api/coach/calendar/${id}/`),
  conversations: (search = "") => API.get(`/api/coach/conversations/${search ? `?search=${encodeURIComponent(search)}` : ""}`).then((res) => res.data.results || res.data),
  startChat: (message) => API.post("/api/coach/chat/", { message }).then((res) => res.data),
  sendMessage: (id, message) => API.post(`/api/coach/conversations/${id}/message/`, { message }).then((res) => res.data),
  updateConversation: (id, payload) => API.patch(`/api/coach/conversations/${id}/`, payload).then((res) => res.data),
  pinConversation: (id) => API.post(`/api/coach/conversations/${id}/pin/`).then((res) => res.data),
  deleteConversation: (id) => API.delete(`/api/coach/conversations/${id}/`),
};

export default coachApi;
