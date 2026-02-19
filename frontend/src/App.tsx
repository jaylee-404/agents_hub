import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuthToken } from '@/store/use-auth-store';
import LoginPage from '@/features/auth/login-page';
import MainLayout from '@/layouts/main-layout';
import CreateTaskPage from '@/features/tasks/create-task-page'; // 引入刚才写的表单组件
import { Plus } from 'lucide-react'; // 引入加号图标

export default function App() {
    const token = useAuthToken();

    return (
        <BrowserRouter>
            <Routes>
                {/* 登录页：已登录则直接跳转首页 */}
                <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" />} />

                {/* 核心业务路由：由 MainLayout 包裹 */}
                <Route
                    path="/*"
                    element={token ? (
                        <MainLayout>
                            <Routes>
                                {/* 仪表盘首页 */}
                                <Route path="/" element={
                                    <div className="space-y-6">
                                        <div>
                                            <h1 className="text-3xl font-black tracking-tight text-foreground">欢迎回来</h1>
                                            <p className="text-muted-foreground">这是 Agents Hub 的核心控制台，查看您的 AI Agent 运行状态。</p>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                            {[
                                                { label: "活跃任务", val: "24", sub: "+2 较昨日", positive: true },
                                                { label: "平均响应", val: "1.2s", sub: "-0.4s 性能提升", positive: true },
                                                { label: "Agent 总数", val: "12", sub: "3 个正在运行", positive: true },
                                                { label: "API 调用量", val: "8.4k", sub: "本月累计", positive: true }
                                            ].map((stat, i) => (
                                                <div key={i} className="p-6 bg-card text-card-foreground border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                                    <p className="text-2xl font-bold text-foreground mt-1">{stat.val}</p>
                                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{stat.sub}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                } />

                                {/* Agent 列表 */}
                                <Route path="/agents" element={<div className="font-bold text-foreground">Agent 列表界面建设中...</div>} />

                                {/* 任务管理枢纽 (任务历史与入口) */}
                                <Route path="/tasks" element={
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h1 className="text-2xl font-bold tracking-tight text-foreground">任务历史</h1>
                                                <p className="text-muted-foreground mt-1">管理并追踪 AI Agent 自动发布小红书的执行状态。</p>
                                            </div>
                                            {/* 新建任务入口按钮 */}
                                            <Link
                                                to="/tasks/new"
                                                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors shadow-sm"
                                            >
                                                <Plus size={18} />
                                                新建任务
                                            </Link>
                                        </div>

                                        {/* TODO: 后续在这里替换为真实的 Table 列表组件 */}
                                        <div className="p-8 bg-card text-card-foreground border border-border rounded-xl shadow-sm text-center">
                                            <p className="text-muted-foreground mb-4">暂无任务记录，快去创建一个让 Agent 跑起来吧！</p>
                                        </div>
                                    </div>
                                } />

                                {/* 新建任务表单页 */}
                                <Route path="/tasks/new" element={<CreateTaskPage />} />

                            </Routes>
                        </MainLayout>
                    ) : <Navigate to="/login" />}
                />
            </Routes>
        </BrowserRouter>
    );
}