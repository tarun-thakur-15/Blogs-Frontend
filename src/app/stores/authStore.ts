// stores/authStore.ts
import { create } from "zustand";

const API_URL = "http://localhost:8000/api"; // e.g. https://yourbackend.com/api

interface User {
  email: string;
  username: string;
  fullname: string;
  profileImage: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isHydrated: boolean; // ✅ prevents flicker — false until /me resolves
  setUser: (user: User) => void;
  logout: () => void;
  hydrate: () => Promise<void>; // ✅ call once on app start to restore session
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isHydrated: false,

  setUser: (user) =>
    set({
      user,
      isLoggedIn: true,
    }),

  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
    }),

  // ✅ Hits /me — browser auto-sends the httpOnly cookie via credentials:"include"
  hydrate: async () => {
    try {
      const res = await fetch(`${API_URL}/me`, {
        method: "GET",
        credentials: "include", // 🔥 sends httpOnly cookie automatically
      });

      if (res.ok) {
        const user: User = await res.json();
        set({ user, isLoggedIn: true, isHydrated: true });
      } else {
        set({ user: null, isLoggedIn: false, isHydrated: true });
      }
    } catch {
      set({ user: null, isLoggedIn: false, isHydrated: true });
    }
  },
}));