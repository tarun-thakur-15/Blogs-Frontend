// stores/authStore.ts
import { create } from "zustand";

interface User {
  email: string;
  username: string;
  fullname: string;
  profileImage: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,

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
}));