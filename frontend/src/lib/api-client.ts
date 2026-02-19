import axios, {type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/use-auth-store';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

// 请求拦截：职责单一，自动挂载 Token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 响应拦截：处理全局鉴权失效
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().actions.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;