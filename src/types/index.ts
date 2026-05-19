// Auth types
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
  name: string;
  class: string;
  section: string;
  roll_number: string;
  avatar_url: string | null;
}

export interface AuthState {
  user: User | null;
  students: Student[];
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  students: Student[];
  token: string;
}

// API types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Attendance
export interface Attendance {
  id: number;
  student_id: number;
  date: string;
  status: "present" | "absent" | "late" | "half_day";
  remark: string | null;
}

// Fees
export interface FeeRecord {
  id: number;
  student_id: number;
  fee_type: string;
  amount: number;
  paid: number;
  due: number;
  due_date: string;
  status: "paid" | "partial" | "unpaid";
}

// Homework
export interface Homework {
  id: number;
  student_id: number;
  subject: string;
  title: string;
  description: string;
  due_date: string;
  attachments: string[];
  status: "pending" | "submitted" | "graded";
}

// Notifications
export interface Notification {
  id: number;
  title: string;
  body: string;
  type: "general" | "attendance" | "fees" | "homework" | "result";
  is_read: boolean;
  created_at: string;
}

// Timetable
export interface TimetableEntry {
  id: number;
  day: string;
  period: number;
  subject: string;
  teacher: string;
  start_time: string;
  end_time: string;
}

// Results / Exams
export interface ExamResult {
  id: number;
  student_id: number;
  exam_name: string;
  subject: string;
  total_marks: number;
  obtained_marks: number;
  grade: string;
  remarks: string | null;
}

// Leave Request
export interface LeaveRequest {
  id: number;
  student_id: number;
  from_date: string;
  to_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  remark: string | null;
}