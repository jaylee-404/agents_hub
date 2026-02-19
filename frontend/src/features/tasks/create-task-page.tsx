import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, FileText, Image as ImageIcon, X, Loader2 } from "lucide-react";

// 👇 引入你项目中已经存在的 api-client
import apiClient from "@/lib/api-client";

const taskSchema = z.object({
    title: z.string().min(1, "请输入小红书标题").max(50, "标题不能超过50个字"),
    content: z.string().min(1, "请输入笔记内容"),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export default function CreateTaskPage() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: { title: "", content: "" },
    });

    const [images, setImages] = useState<File[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'doc') => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files);
        if (type === 'image') {
            setImages(prev => [...prev, ...newFiles]);
        } else {
            setDocuments(prev => [...prev, ...newFiles]);
        }
        e.target.value = '';
    };

    const removeFile = (index: number, type: 'image' | 'doc') => {
        if (type === 'image') {
            setImages(prev => prev.filter((_, i) => i !== index));
        } else {
            setDocuments(prev => prev.filter((_, i) => i !== index));
        }
    };

    const onSubmit = async (data: TaskFormValues) => {
        if (images.length === 0) {
            alert("请至少上传一张图片作为小红书封面");
            return;
        }

        try {
            setIsSubmitting(true);
            const formData = new FormData();

            formData.append("title", data.title);
            formData.append("content", data.content);
            images.forEach((file) => formData.append("images[]", file));
            documents.forEach((file) => formData.append("documents[]", file));

            // 👇 使用你的 apiClient，并在第三个参数中进行覆盖配置
            const response = await apiClient.post("/tasks", formData, {
                headers: {
                    // 覆盖全局的 application/json
                    "Content-Type": "multipart/form-data"
                },
                // 覆盖全局的 10s 超时，延长到 30s 以保证文件有足够的时间上传
                timeout: 30000
            });

            console.log("任务创建成功:", response.data);
            alert("任务创建成功，Agent 已开始执行！");

            reset();
            setImages([]);
            setDocuments([]);

        } catch (error) {
            console.error("创建任务失败:", error);
            alert("提交失败，请检查网络或后端日志");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">发布新任务</h1>
                <p className="text-muted-foreground mt-1">创建小红书图文内容，并上传参考资料供 AI Agent 学习执行。</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm space-y-6">

                <div>
                    <label className="block text-sm font-medium mb-2">笔记标题 <span className="text-destructive">*</span></label>
                    <input
                        {...register("title")}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
                        placeholder="例如：秋冬穿搭指南 | 氛围感神明少女"
                    />
                    {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">笔记正文 <span className="text-destructive">*</span></label>
                    <textarea
                        {...register("content")}
                        rows={5}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-colors resize-none"
                        placeholder="在这里编写你的小红书文案..."
                    />
                    {errors.content && <p className="text-destructive text-sm mt-1">{errors.content.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">配图 (必须上传) <span className="text-destructive">*</span></label>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/50 transition-colors relative">
                        <input
                            type="file"
                            multiple
                            accept="image/png, image/jpeg, image/webp"
                            onChange={(e) => handleFileChange(e, 'image')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">点击或拖拽上传图片</p>
                    </div>
                    {images.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative group rounded-lg overflow-hidden border border-border w-20 h-20 bg-muted">
                                    <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(idx, 'image')}
                                        className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">知识库附件 (可选 PDF/CSV/TXT)</label>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/50 transition-colors relative">
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.csv,.txt"
                            onChange={(e) => handleFileChange(e, 'doc')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">上传参考资料供 Agent 分析生成</p>
                    </div>
                    {documents.length > 0 && (
                        <div className="flex flex-col gap-2 mt-4">
                            {documents.map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <FileText className="text-primary flex-shrink-0" size={18} />
                                        <span className="text-sm text-foreground truncate">{doc.name}</span>
                                    </div>
                                    <button type="button" onClick={() => removeFile(idx, 'doc')} className="text-muted-foreground hover:text-destructive">
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <hr className="border-border my-6" />

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        取消并返回
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "发布任务"}
                    </button>
                </div>
            </form>
        </div>
    );
}