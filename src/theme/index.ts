import { colors } from "./colors";

export const theme = {
  colors,
  typography: {
    h1: { fontSize: 28, lineHeight: 36, fontWeight: "700" as const },
    h2: { fontSize: 24, lineHeight: 32, fontWeight: "700" as const },
    h3: { fontSize: 20, lineHeight: 28, fontWeight: "600" as const },
    h4: { fontSize: 18, lineHeight: 24, fontWeight: "600" as const },
    body: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },
    bodySm: { fontSize: 14, lineHeight: 20, fontWeight: "400" as const },
    caption: { fontSize: 12, lineHeight: 16, fontWeight: "400" as const },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    "2xl": 24,
    "3xl": 32,
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: "#1E293B",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#1E293B",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: "#1E293B",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 5,
    },
  },
} as const;
