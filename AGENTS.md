# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

# Dependency Management

For all Expo React Native dependencies, NEVER use npm install directly for native packages. Always use `npx expo install <package>` so versions stay compatible with the current Expo SDK. Do not upgrade React Native, Reanimated, Gesture Handler, or Expo packages independently.

# Project Architecture — School ERP Parent App

## Backend (Laravel)

### Key Files
- `app/Http/Controllers/Api/V1/ParentApiController.php` — REST API for parent dashboard, attendance, fees, exams, timetable
- `app/Modules/Parents/Services/ParentService.php` — Business logic for dashboard aggregation
- `app/Modules/Auth/Controllers/ApiAuthController.php` — Login, me, logout, token refresh
- `routes/modules/api.php` — API route definitions at `/api/v1/`

### Auth Response Format
Login/me returns wrapped in `{ success, message, data: { token, user, students, parent_uuid } }`.
- `user` — UserResource with roles
- `students` — Array of `{ id, uuid, name, class, section, roll_number, admission_no, photo }`
- `parent_uuid` — UUID of the Guardian record (added to both login and me responses)

### Parent API Endpoints (all require `parent_uuid`)
- `GET /parents/{uuid}/dashboard` — Aggregated dashboard data (students, attendance_summary, fees_summary, exam_results_summary, notifications)
- `GET /parents/{uuid}/children/{childUuid}/attendance?month=&year=` — Monthly attendance records with counts
- `GET /parents/{uuid}/children/{childUuid}/fees` — StudentFee collection with items
- `GET /parents/{uuid}/children/{childUuid}/exams` — Exam results grouped by academic year
- `GET /parents/{uuid}/children/{childUuid}/timetable` — Weekly timetable grouped by day_of_week

## Frontend (Expo React Native)

### State Management
- **Zustand** with `persist` middleware → AsyncStorage
- Auth store: `useAuthStore` holds `{ user, students, token, isAuthenticated, parentUuid, selectedStudentUuid }`
- `hydrateFromApi(data)` auto-selects first student via `selectedStudentUuid`

### API Layer (`src/services/api.ts`)
- Axios client with token resolution (checks raw `auth_token` key + Zustand persist store)
- 401 response interceptor clears auth data
- All API functions unwrap `{ success, data }` wrapper automatically
- Functions: `fetchDashboard`, `fetchParent`, `fetchAttendance`, `fetchFees`, `fetchExamResults`, `fetchTimetable`, `fetchChildren`, `fetchMe`, `fetchNotifications`, `fetchUnreadCount`, `markNotificationRead`, `markAllNotificationsRead`

### Types (`src/types/index.ts`)
- `User`, `Student`, `AuthState`, `LoginResponse`, `ApiResponse<T>`
- Data types: `AttendanceRecord`, `AttendanceData`, `StudentFee`, `FeeItem`, `ExamResultRecord`, `TimetableSlot`, `TimetableData`, `NotificationItem`, `DashboardData`

### Screens Status (all API-integrated)

| Screen | Status | API Source |
|--------|--------|-----------|
| Login | ✅ Real API | `POST /auth/login` → unwrap + map |
| Dashboard | ✅ Real API | `GET /parents/{uuid}/dashboard` |
| Attendance | ✅ Real API | `GET /parents/{uuid}/children/{childUuid}/attendance` |
| Fees | ✅ Real API | `GET /parents/{uuid}/children/{childUuid}/fees` |
| Results | ✅ Real API | `GET /parents/{uuid}/children/{childUuid}/exams` |
| Timetable | ✅ Real API | `GET /parents/{uuid}/children/{childUuid}/timetable` |
| Notifications | ✅ Real API | `GET /notifications`, `POST /notifications/{id}/read`, `POST /notifications/read-all` |
| Student Profile | ✅ Real API | `GET /parents/{uuid}` (for parent details) + auth store |
| Profile | ✅ Real data | Auth store (`user?.name`, `user?.email`) |
| Edit Profile | ✅ Real data | Auth store (read-only; no PUT endpoint yet) |
| Privacy | ✅ Static | Static text |
| Help | ✅ Static | Static text |

### Navigation Structure
```
(auth)/login           — Auth screen
(tabs)/
  (home)/
    index              — Dashboard
    attendance         — Attendance calendar
    fees               — Fees overview + history
    results            — Exam results grouped
    timetable          — Weekly timetable
    notifications      — Notifications list
    student-profile    — Student details + parent info
  profile/
    index              — Profile main
    edit-profile       — Read-only user info
    privacy            — Privacy policy
    help               — Help & support
```

### Common Patterns
- All data screens use: `useState` + `useEffect` + `useCallback` + `RefreshControl`
- Loading state: centered `ActivityIndicator` + "Loading..." text
- Error state: icon + message + Retry button
- Empty state: icon + title + description
- All screens use `SafeAreaView` + `Card` + `Ionicons` + NativeWind classes
- Student context: screens read `selectedStudentUuid` from auth store (defaults to first student)

### Key Conventions
- Backend returns `{ success, message, data: ... }`; API service `unwrap()` extracts `.data.data`
- Backend `User` → `guardian()` → `students()` pivot chain for parent-child relationship
- Frontend `Student.avatar_url` maps from backend `photo` field in login.tsx
- All screens handle missing `parentUuid` or `childUuid` gracefully (skip loading)
- Timetable day_of_week: 1=Monday through 7=Sunday (backend numeric, frontend maps via DAY_NAMES)
