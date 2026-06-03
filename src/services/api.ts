import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import { storage } from "@/utils/storage";
import { STORAGE_KEYS } from "@/constants/config";
import type { AttendanceData, DashboardData, NotificationItem, StudentFee, ExamResultRecord, TimetableData } from "@/types";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

async function resolveToken(): Promise<string | undefined> {
  const raw = await storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  if (typeof raw === "string") return raw;
  const store = await storage.get<{ token?: string }>("school_parent_auth_store");
  if (store?.token) return store.token;
  if (raw && typeof raw === "object" && "token" in raw) {
    return (raw as Record<string, unknown>).token as string;
  }
  return undefined;
}

async function clearAuthData(): Promise<void> {
  await storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  await storage.remove(STORAGE_KEYS.USER_DATA);
  await storage.remove("school_parent_auth_store");
}

apiClient.interceptors.request.use(
  async (config) => {
    const token = await resolveToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const fullUrl = `${config.baseURL ?? API_BASE_URL}${config.url ?? ""}`;
    console.log("[API] REQUEST:", config.method?.toUpperCase(), fullUrl);
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => {
    console.log("[API] RESPONSE:", response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.log("[API] ERROR:", error.response?.status, error.response?.config?.url, error.response?.data);
    if (error.response?.status === 401) {
      await clearAuthData();
    }
    return Promise.reject(error);
  },
);

function unwrap<T>(response: { data: { success: boolean; data: T } }): T {
  return response.data.data;
}

// ─── Parent / Dashboard ────────────────────────────────────────────

export async function fetchDashboard(parentUuid: string, childUuid?: string): Promise<DashboardData> {
  const params: Record<string, string> = {};
  if (childUuid) {
    params.child_uuid = childUuid;
  }
  const res = await apiClient.get(`/parents/${parentUuid}/dashboard`, { params });
  return unwrap<DashboardData>(res);
}

export async function fetchParent(parentUuid: string): Promise<Record<string, unknown>> {
  const res = await apiClient.get(`/parents/${parentUuid}`);
  return unwrap(res);
}

// ─── Attendance ─────────────────────────────────────────────────────

export async function fetchAttendance(
  parentUuid: string,
  childUuid: string,
  month?: number,
  year?: number,
): Promise<AttendanceData> {
  const params: Record<string, number> = {};
  if (month) params.month = month;
  if (year) params.year = year;
  const res = await apiClient.get(`/parents/${parentUuid}/children/${childUuid}/attendance`, { params });
  return unwrap<AttendanceData>(res);
}

// ─── Fees ───────────────────────────────────────────────────────────

export async function fetchFees(parentUuid: string, childUuid: string): Promise<StudentFee[]> {
  const res = await apiClient.get(`/parents/${parentUuid}/children/${childUuid}/fees`);
  return unwrap<StudentFee[]>(res);
}

// ─── Exam Results ───────────────────────────────────────────────────

export async function fetchExamResults(
  parentUuid: string,
  childUuid: string,
): Promise<{ student: Record<string, unknown>; results_by_academic_year: Record<string, ExamResultRecord[]> }> {
  const res = await apiClient.get(`/parents/${parentUuid}/children/${childUuid}/exams`);
  return unwrap(res);
}

// ─── Timetable ──────────────────────────────────────────────────────

export async function fetchTimetable(parentUuid: string, childUuid: string): Promise<{ timetable: TimetableData }> {
  const res = await apiClient.get(`/parents/${parentUuid}/children/${childUuid}/timetable`);
  return unwrap(res);
}

// ─── Children ───────────────────────────────────────────────────────

export async function fetchChildren(parentUuid: string): Promise<Record<string, unknown>[]> {
  const res = await apiClient.get(`/parents/${parentUuid}/children`);
  return unwrap(res);
}

// ─── Me ─────────────────────────────────────────────────────────────

export async function fetchMe(): Promise<{
  user: Record<string, unknown>;
  roles: string[];
  permissions: string[];
  students?: Record<string, unknown>[];
  parent_uuid?: string;
}> {
  const res = await apiClient.get("/me");
  return unwrap(res);
}

// ─── Notifications ──────────────────────────────────────────────────

const NOTIFICATION_TYPE_MAP: Record<string, NotificationItem["type"]> = {
  attendance_alert: "attendance",
  fee_reminder: "fees",
  exam_result_alert: "result",
  announcement: "general",
  timetable_update: "general",
};

function normalizeNotification(raw: Record<string, unknown>): NotificationItem {
  if (!raw || typeof raw !== "object") {
    return {
      id: 0,
      title: "",
      body: "",
      type: "general",
      is_read: false,
      created_at: "",
      data: undefined,
    };
  }
  const rawId = raw.id;
  return {
    id: typeof rawId === "number" ? rawId : typeof rawId === "string" ? parseInt(rawId, 10) || 0 : 0,
    title: (raw.title as string) ?? "",
    body: ((raw.body as string) ?? (raw.message as string) ?? ""),
    type: NOTIFICATION_TYPE_MAP[raw.type as string] ?? "general",
    is_read: (raw.is_read as boolean) ?? false,
    created_at: (raw.created_at as string) ?? "",
    data: raw.data as Record<string, unknown> | undefined,
  };
}

export async function fetchNotifications(page = 1): Promise<{
  data: NotificationItem[];
  meta: { current_page: number; last_page: number; total: number };
}> {
  const res = await apiClient.get("/notifications", { params: { page } });
  // paginated response: { success, message, data: [...], meta: {...}, links: {...} }
  const body = res.data;
  const rawItems = (body.data ?? []) as Record<string, unknown>[];
  return {
    data: rawItems.map(normalizeNotification),
    meta: body.meta as { current_page: number; last_page: number; total: number },
  };
}

export async function fetchUnreadCount(): Promise<{ count: number }> {
  const res = await apiClient.get("/notifications/unread");
  const data = unwrap<{ unread_count: number }>(res);
  return { count: data.unread_count };
}

export async function markNotificationRead(id: number): Promise<void> {
  await apiClient.post(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.post("/notifications/read-all");
}

export default apiClient;
