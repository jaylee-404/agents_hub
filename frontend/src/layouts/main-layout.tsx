import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-slate-50/30 flex flex-col min-h-screen">
                <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-md px-4 sticky top-0 z-10 shadow-sm">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="h-4 mx-2" />
                    <div className="text-sm font-medium text-slate-500">
                        Agents Hub / <span className="text-slate-900">仪表盘</span>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}