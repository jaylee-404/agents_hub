import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthToken } from '@/store/use-auth-store';
import LoginPage from '@/features/auth/login-page';

export default function App() {
    const token = useAuthToken();

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" />} />

                {/* 受保护的主页 */}
                <Route path="/" element={token ? (
                    <div className="p-10 text-center">
                        <h1 className="text-2xl font-bold">登录成功，欢迎来到 Agents Hub 核心控制台</h1>
                    </div>
                ) : <Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}