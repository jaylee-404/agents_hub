import { LayoutDashboard, MessageSquare, Settings, LogOut, Terminal, User } from "lucide-react"
import { useAuthStore } from "@/store/use-auth-store"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const navItems = [
    { title: "控制中心", icon: LayoutDashboard, url: "/" },
    { title: "Agent 管理", icon: Terminal, url: "/agents" },
    { title: "任务历史", icon: MessageSquare, url: "/tasks" },
    { title: "系统设置", icon: Settings, url: "/settings" },
]

export function AppSidebar() {
    const user = useAuthStore(s => s.user)
    const logout = useAuthStore(s => s.actions.logout)

    return (
        <Sidebar variant="inset">
            {/* 添加了明确的 border-sidebar-border */}
            <SidebarHeader className="p-4 border-b border-sidebar-border">
                {/* 加上了 text-sidebar-foreground */}
                <div className="flex items-center gap-3 font-black text-xl tracking-tight text-sidebar-foreground">
                    {/* 替换为 sidebar-primary 系列变量 */}
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground h-8 w-8 flex items-center justify-center rounded-lg shadow-sm">
                        A
                    </div>
                    AGENTS HUB
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    {/* 替换了 text-slate-400 */}
                    <SidebarGroupLabel className="px-4 py-2 text-xs uppercase tracking-wider text-sidebar-foreground/60">核心模块</SidebarGroupLabel>
                    <SidebarMenu className="px-2">
                        {navItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild tooltip={item.title}>
                                    {/* 加上了 text-sidebar-foreground 确保链接颜色正确 */}
                                    <a href={item.url} className="flex items-center gap-3 py-5 text-sidebar-foreground">
                                        <item.icon size={18} />
                                        <span className="font-medium">{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* 替换了 bg-slate-50/50 和 border 颜色 */}
            <SidebarFooter className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
                <div className="flex items-center gap-3 mb-4 px-2">
                    {/* 替换了头像边框颜色 */}
                    <Avatar className="h-9 w-9 border border-sidebar-border shadow-sm">
                        {/* 替换了 bg-slate-100 和 text-slate-600 */}
                        <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground">
                            <User size={18} />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm truncate">
                        {/* 替换了 text-slate-900 和 text-slate-500 */}
                        <span className="font-semibold text-sidebar-foreground">管理员</span>
                        <span className="text-sidebar-foreground/60 text-xs truncate">{user?.phone}</span>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-3 px-2 transition-colors"
                >
                    <LogOut size={18} />
                    <span className="font-medium">退出登录</span>
                </Button>
            </SidebarFooter>
        </Sidebar>
    )
}