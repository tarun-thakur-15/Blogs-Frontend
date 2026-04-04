// stores/authStore.ts
import { create } from "zustand";

// const url = "http://localhost:8000/api";
const url = "https://blogs-backend-ftie.onrender.com/api";

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
      isHydrated: true,
    }),

  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
      isHydrated: true,
    }),

  // ✅ Hits /me — browser auto-sends the httpOnly cookie via credentials:"include"
  hydrate: async () => {
    console.log("hydrate() called");
    try {
      const res = await fetch(`${url}/me`, {
        method: "GET",
        credentials: "include", // 🔥 sends httpOnly cookie automatically
      });
      console.log("hydrate /me status:", res.status);
      if (res.ok) {
        const user: User = await res.json();
        console.log("hydrate user:", user);
        set({ user, isLoggedIn: true, isHydrated: true });
      } else {
        console.log("hydrate failed - not ok");
        set({ user: null, isLoggedIn: false, isHydrated: true });
      }
    } catch (e) {
      console.log("hydrate error:", e);
      set({ user: null, isLoggedIn: false, isHydrated: true });
    }
  },
}));
