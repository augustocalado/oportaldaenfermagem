import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    Newspaper,
    FileText,
    Users,
    Settings,
    LogOut,
    Heart,
    Menu,
    X,
    Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { profile, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
        { icon: BookOpen, label: "Cursos", href: "/admin/courses" },
        { icon: Newspaper, label: "Notícias", href: "/admin/news" },
        { icon: FileText, label: "Materiais", href: "/admin/materials" },
        { icon: Award, label: "Certificados", href: "/admin/certificates" },
        { icon: Users, label: "Usuários", href: "/admin/users" },
        { icon: Settings, label: "Configurações", href: "/admin/settings" },
    ];

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    return (
        <div className="flex h-screen bg-muted/30">
            {/* Sidebar */}
            <aside className={`bg-card border-r border-border transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"}`}>
                <div className="flex flex-col h-full">
                    <div className="p-4 flex items-center justify-between border-b border-border">
                        {isSidebarOpen && (
                            <Link to="/" className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                    <Heart className="h-4 w-4 text-primary-foreground" />
                                </div>
                                <span className="font-display text-sm font-bold text-foreground truncate">
                                    Portal Admin
                                </span>
                            </Link>
                        )}
                        {!isSidebarOpen && (
                            <div className="mx-auto h-8 w-8 flex items-center justify-center rounded-lg bg-primary">
                                <Heart className="h-4 w-4 text-primary-foreground" />
                            </div>
                        )}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-1 hover:bg-muted rounded-md lg:hidden"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.href
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                {isSidebarOpen && <span>{item.label}</span>}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-border">
                        {isSidebarOpen && (
                            <div className="mb-4 px-3">
                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Logado como</p>
                                <p className="text-sm font-medium text-foreground truncate">{profile?.full_name || "Administrador"}</p>
                                <p className="text-[10px] text-muted-foreground text-primary font-bold uppercase tracking-tighter">Master Access</p>
                            </div>
                        )}
                        <Button
                            variant="outline"
                            className={`w-full justify-start gap-3 ${!isSidebarOpen && "px-2"}`}
                            onClick={handleSignOut}
                        >
                            <LogOut className="h-5 w-5 shrink-0" />
                            {isSidebarOpen && <span>Sair</span>}
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-card border-b border-border flex items-center px-8 justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-muted rounded-md hidden lg:block"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <h2 className="text-xl font-bold text-foreground">
                            {menuItems.find(i => i.href === location.pathname)?.label || "Painel Administrativo"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link to="/"><Settings className="h-5 w-5" /></Link>
                        </Button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
