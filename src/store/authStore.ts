import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import type { Role } from "@/types";

interface AuthState {
  user: User | null;
  role: Role | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: Role | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  loading: true,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setLoading: (loading) => set({ loading }),
}));
