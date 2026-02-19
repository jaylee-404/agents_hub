import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import apiClient from '@/lib/api-client';
import { useAuthActions } from '@/store/use-auth-store';

const loginSchema = z.object({
    phone: z.string().regex(/^1[3-9]\d{9}$/, "手机号格式不正确"),
    code: z.string().length(6, "验证码必须为6位"),
});

export default function LoginPage() {
    const { setAuth } = useAuthActions();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { phone: "", code: "" },
    });

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        try {
            const { data } = await apiClient.post('/auth/login', values);
            setAuth(data.token, data.user);
            navigate('/');
        } catch (error: any) {
            console.error(error.response?.data?.error || "登录失败");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-[400px] shadow-xl border-slate-200">
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <div className="p-3 bg-primary/10 rounded-full mb-2">
                        <ShieldCheck className="text-primary" size={32} />
                    </div>
                    <CardTitle className="text-2xl font-black tracking-tight text-center">AGENTS HUB</CardTitle>
                    <CardDescription className="text-center">
                        请使用手机号验证码登录系统
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>手机号</FormLabel>
                                        <FormControl>
                                            <Input placeholder="138xxxx8888" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>验证码</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="******" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full font-bold"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                进入系统
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}