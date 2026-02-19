import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import apiClient from '@/lib/api-client';
import { useAuthActions } from '@/store/use-auth-store';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
    phone: z.string().regex(/^1[3-9]\d{9}$/, "手机号格式不正确"),
    code: z.string().length(6, "验证码必须为6位"),
});

export default function LoginPage() {
    const { setAuth } = useAuthActions();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        try {
            const { data } = await apiClient.post('/auth/login', values);
            setAuth(data.token, data.user);
            navigate('/');
        } catch (error: any) {
            alert(error.response?.data?.error || "登录连接超时");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-[400px] bg-white p-8 rounded-2xl shadow-2xl border border-slate-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-blue-50 rounded-full mb-4">
                        <ShieldCheck className="text-blue-600" size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">AGENTS HUB</h1>
                    <p className="text-slate-400 text-sm mt-1">请使用手机号验证码登录</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">手机号</label>
                        <input
                            {...register('phone')}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            placeholder="138xxxx8888"
                        />
                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">验证码</label>
                        <input
                            {...register('code')}
                            type="password"
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            placeholder="******"
                        />
                        {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>}
                    </div>

                    <button
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                        进入系统
                    </button>
                </form>
            </div>
        </div>
    );
}