import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: number;
    phone: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    actions: {
        setAuth: (token: string, user: User) => void;
        logout: () => void;
    };
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            actions: {
                setAuth: (token, user) => set({ token, user }),
                logout: () => set({ token: null, user: null }),
            },
        }),
        {
            name: 'auth-storage',
            // 只持久化数据，不持久化 actions
            partialize: (state) => ({ token: state.token, user: state.user }),
        }
    )
);

// 导出易于混淆的 Selectors 提高性能
export const useAuthActions = () => useAuthStore((s) => s.actions);
export const useAuthToken = () => useAuthStore((s) => s.token);