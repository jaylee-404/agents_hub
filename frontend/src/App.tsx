export default function App() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                <h1 className="text-3xl font-bold text-slate-900">
                    Agents Hub <span className="text-blue-600">v1.0</span>
                </h1>
                <p className="mt-2 text-slate-500">
                    前端基础框架已搭建完成（Tailwind v3.4.13 + Vite）
                </p>
                <div className="mt-6 flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-mono text-slate-400">Environment: Stable</span>
                </div>
            </div>
        </div>
    )
}