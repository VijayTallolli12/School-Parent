export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://paleturquoise-monkey-126256.hostingersite.com/api/v1"
    : "http://192.168.1.3:8000/api/v1");
