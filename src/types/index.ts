export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  role: "parent";
}

export interface Student {
  id: number;
  uuid: string;
  name: string;
  class: string;
  section: string;
  roll_number: string;
  admission_no: string;
  avatar_url: string | null;
}

export interface AuthState {
  user: User | null;
  students: Student[];
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  parentUuid: string | null;
  selectedStudentUuid: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  students: Student[];
  token: string;
  parent_uuid?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface AttendanceRecord {
  id: number;
  student_id: number;
  attendance_date: string;
  status: "present" | "absent" | "late" | "half_day";
  remark: string | null;
}

export interface AttendanceData {
  student: Record<string, unknown>;
  month: number;
  year: number;
  summary: {
    total_days: number;
    counts: Record<string, number>;
  };
  records: AttendanceRecord[];
}

export interface FeeItem {
  id: number;
  fee_category_id: number;
  amount: number;
  paid: number;
  balance: number;
  fee_category: string | null;
  due_date: string | null;
  status: "paid" | "partial" | "pending";
}

export interface StudentFee {
  id: number;
  student_id: number;
  total_amount: number;
  total_paid: number;
  total_balance: number;
  status: "paid" | "partial" | "unpaid";
  assigned_at: string | null;
  items: FeeItem[];
}

export interface ExamResultRecord {
  id: number;
  student_id: number;
  marks_obtained: number;
  maximum_marks: number;
  grade: string | null;
  remarks: string | null;
  exam: {
    id: number;
    name: string;
    subject: { id: number; name: string };
  };
}

export interface TimetableSlot {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  subject: { id: number; name: string } | null;
  teacher: { id: number; name: string } | null;
  room: string | null;
}

export type TimetableData = Record<string, TimetableSlot[]>;

export interface NotificationItem {
  id: number;
  title: string;
  body: string;
  type: "general" | "attendance" | "fees" | "homework" | "result";
  is_read: boolean;
  created_at: string;
  data?: Record<string, unknown>;
}

export interface DashboardData {
  students: Record<string, unknown>[];
  attendance_summary: {
    present: number;
    absent: number;
    total: number;
    percentage: number;
  };
  fees_summary: {
    total: number;
    paid: number;
    pending: number;
  };
  exam_results_summary: {
    average: number;
    subjects: number;
    total_marks: number;
    obtained_marks: number;
  };
  notifications: NotificationItem[];
}
