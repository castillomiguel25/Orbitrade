import { create } from 'zustand';

export type SupabaseUser = {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
    email?: string;
    [key: string]: any;
  };
  // Puedes agregar otros campos relevantes de Supabase aquí
} | null;

interface UserState {
  user: SupabaseUser;
  isLoading: boolean;
  setUser: (user: SupabaseUser) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  clearUser: () => set({ user: null, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
})); 