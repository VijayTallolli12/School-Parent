import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User, Student, LoginPayload, LoginResponse, AuthState } from "@/types";
import { STORAGE_KEYS } from "@/constants/config";

interface AuthActions {
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setStudents: (students: Student[]) => void;
  setLoading: (loading: boolean) => void;
  hydrateFromApi: (data: LoginResponse) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      students: [],
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (payload: LoginPayload) => {
        set({ isLoading: true });
        // Login is handled by the caller via the API
        set({ isLoading: false });
      },

      logout: () => {
        set({
          user: null,
          students: [],
          token: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User) => set({ user }),

      setToken: (token: string) =>
        set({ token, isAuthenticated: !!token }),

      setStudents: (students: Student[]) => set({ students }),

      setLoading: (isLoading: boolean) => set({ isLoading }),

      hydrateFromApi: (data: LoginResponse) =>
        set({
          user: data.user,
          students: data.students,
          token: data.token,
          isAuthenticated: true,
          isLoading: false,
        }),
    }),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        students: state.students,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);